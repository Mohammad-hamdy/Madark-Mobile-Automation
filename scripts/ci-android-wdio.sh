#!/usr/bin/env bash
# Runs inside reactivecircus/android-emulator-runner (emulator already booted).
# Hard-caps WDIO so the action always reaches "Terminate Emulator".
set -euo pipefail

: "${ANDROID_APP_PATH:?ANDROID_APP_PATH is required}"
: "${APPIUM_HOST:=127.0.0.1}"
: "${APPIUM_PORT:=4725}"
: "${E2E_TAGS:=11874}"
: "${E2E_LANG:=ar}"
: "${E2E_FAST:=1}"
: "${WDIO_WALL_TIMEOUT:=480}" # seconds — whole WDIO+Appium budget after install
export E2E_FAST

adb wait-for-device
adb emu geo fix 46.6753 24.7136
adb install -r -t -g "$ANDROID_APP_PATH"

mkdir -p logs
npx appium --address "$APPIUM_HOST" --port "$APPIUM_PORT" --relaxed-security --allow-insecure=uiautomator2:adb_shell --log logs/appium.log --log-timestamp &
APPIUM_PID=$!

cleanup() {
  kill "$APPIUM_PID" 2>/dev/null || true
  wait "$APPIUM_PID" 2>/dev/null || true
  # android-emulator-runner "Terminate Emulator" can hang for minutes on graceful qemu exit.
  # Kill the emulator ourselves so the action cleanup returns immediately.
  echo "Force-stopping emulator (avoid hung Terminate Emulator)"
  adb -s "${ANDROID_UDID:-emulator-5554}" emu kill >/dev/null 2>&1 || true
  sleep 1
  pkill -9 -f 'qemu-system' >/dev/null 2>&1 || true
  pkill -9 -f '/emulator/emulator ' >/dev/null 2>&1 || true
}
trap cleanup EXIT

for _ in $(seq 1 30); do
  if curl -fs "http://${APPIUM_HOST}:${APPIUM_PORT}/status" >/dev/null; then
    break
  fi
  sleep 1
done
curl -fs "http://${APPIUM_HOST}:${APPIUM_PORT}/status" >/dev/null || {
  echo "::error::Appium did not start"
  exit 1
}

SPEC_ARGS=()
if [ -n "${WDIO_SPEC:-}" ]; then
  SPEC_ARGS=(--spec "$WDIO_SPEC")
fi

echo "Running WDIO tags=${E2E_TAGS} lang=${E2E_LANG} spec=${WDIO_SPEC:-all} wall=${WDIO_WALL_TIMEOUT}s"
set +e
# GNU timeout on ubuntu runners — kills hung driver/session so emulator can stop.
timeout --signal=KILL "${WDIO_WALL_TIMEOUT}" npx wdio run wdio.conf.ts "${SPEC_ARGS[@]}"
code=$?
set -e

if [ "$code" -eq 124 ] || [ "$code" -eq 137 ]; then
  echo "::error::WDIO hit wall timeout (${WDIO_WALL_TIMEOUT}s) — forced stop"
  code=124
fi

if [ -n "${GITHUB_OUTPUT:-}" ]; then
  echo "wdio_exit=${code}" >> "$GITHUB_OUTPUT"
fi
exit "$code"
