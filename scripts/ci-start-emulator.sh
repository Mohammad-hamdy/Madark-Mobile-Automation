#!/usr/bin/env bash
# Boots a headless Android emulator on the GitHub runner and waits for boot_completed.
set -euo pipefail

API_LEVEL="${API_LEVEL:-34}"
IMAGE="system-images;android-${API_LEVEL};google_apis;x86_64"
SDK="${ANDROID_HOME:-${ANDROID_SDK_ROOT:-/usr/local/lib/android/sdk}}"
export ANDROID_AVD_HOME="$HOME/.android/avd"
export PATH="$SDK/cmdline-tools/latest/bin:$SDK/emulator:$SDK/platform-tools:$PATH"
mkdir -p "$ANDROID_AVD_HOME" logs

yes | sdkmanager --licenses >/dev/null 2>&1 || true
sdkmanager --install "$IMAGE" emulator platform-tools >/dev/null

echo no | avdmanager create avd -n ci -k "$IMAGE" --force
emulator -list-avds | grep -qx ci || { echo "::error::AVD 'ci' was not created"; exit 1; }

nohup emulator -avd ci -no-window -gpu swiftshader_indirect -noaudio -no-boot-anim \
  -no-snapshot -camera-back none -port 5554 >logs/emulator.log 2>&1 &
echo $! > /tmp/emulator.pid

timeout 120 adb -s emulator-5554 wait-for-device || {
  echo "::error::Emulator never connected to adb"
  tail -30 logs/emulator.log
  exit 1
}
for _ in $(seq 1 150); do
  [ "$(adb -s emulator-5554 shell getprop sys.boot_completed 2>/dev/null | tr -d '\r')" = "1" ] && break
  sleep 2
done
[ "$(adb -s emulator-5554 shell getprop sys.boot_completed | tr -d '\r')" = "1" ] || {
  echo "::error::Emulator did not finish booting"
  tail -30 logs/emulator.log
  exit 1
}

adb -s emulator-5554 shell settings put global window_animation_scale 0
adb -s emulator-5554 shell settings put global transition_animation_scale 0
adb -s emulator-5554 shell settings put global animator_duration_scale 0
adb -s emulator-5554 shell input keyevent 82 || true
echo "Emulator booted"
