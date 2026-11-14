#!/usr/bin/env bash
# Runs inside reactivecircus/android-emulator-runner (emulator already booted).
set -euo pipefail

: "${ANDROID_APP_PATH:?ANDROID_APP_PATH is required}"
: "${APPIUM_HOST:=127.0.0.1}"
: "${APPIUM_PORT:=4725}"
: "${E2E_TAGS:=11874}"
: "${E2E_LANG:=ar}"

adb wait-for-device
adb emu geo fix 46.6753 24.7136
adb install -r -t -g "$ANDROID_APP_PATH"

mkdir -p logs
npx appium --address "$APPIUM_HOST" --port "$APPIUM_PORT" --relaxed-security --allow-insecure=uiautomator2:adb_shell --log logs/appium.log --log-timestamp &
APPIUM_PID=$!

cleanup() {
  kill "$APPIUM_PID" 2>/dev/null || true
}
trap cleanup EXIT

for _ in $(seq 1 60); do
  if curl -fs "http://${APPIUM_HOST}:${APPIUM_PORT}/status" >/dev/null; then
    break
  fi
  sleep 2
done
curl -fs "http://${APPIUM_HOST}:${APPIUM_PORT}/status" >/dev/null || {
  echo "::error::Appium did not start"
  exit 1
}

SPEC_ARGS=()
if [ -n "${WDIO_SPEC:-}" ]; then
  SPEC_ARGS=(--spec "$WDIO_SPEC")
fi

echo "Running WDIO tags=${E2E_TAGS} lang=${E2E_LANG} spec=${WDIO_SPEC:-all}"
set +e
npx wdio run wdio.conf.ts "${SPEC_ARGS[@]}"
code=$?
set -e

if [ -n "${GITHUB_OUTPUT:-}" ]; then
  echo "wdio_exit=${code}" >> "$GITHUB_OUTPUT"
fi
exit "$code"
