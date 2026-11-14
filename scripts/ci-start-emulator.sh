#!/usr/bin/env bash
# Boots a headless Android emulator on the GitHub runner and waits for boot_completed.
set -euo pipefail

API_LEVEL="${API_LEVEL:-34}"
IMAGE="system-images;android-${API_LEVEL};google_apis;x86_64"
SDK="${ANDROID_HOME:-${ANDROID_SDK_ROOT:-/usr/local/lib/android/sdk}}"
export PATH="$SDK/cmdline-tools/latest/bin:$SDK/emulator:$SDK/platform-tools:$PATH"

yes | sdkmanager --licenses >/dev/null || true
sdkmanager --install "$IMAGE" emulator platform-tools >/dev/null

if ! avdmanager list avd | grep -q 'Name: ci'; then
  echo no | avdmanager create avd -n ci -k "$IMAGE" -d pixel_6 --force >/dev/null
fi

mkdir -p logs
nohup emulator -avd ci -no-window -gpu swiftshader_indirect -noaudio -no-boot-anim \
  -no-snapshot -camera-back none -port 5554 >logs/emulator.log 2>&1 &
echo $! > /tmp/emulator.pid

adb wait-for-device
for _ in $(seq 1 180); do
  [ "$(adb -s emulator-5554 shell getprop sys.boot_completed 2>/dev/null | tr -d '\r')" = "1" ] && break
  sleep 2
done
[ "$(adb -s emulator-5554 shell getprop sys.boot_completed | tr -d '\r')" = "1" ] || {
  echo "::error::Emulator did not boot"
  exit 1
}

adb -s emulator-5554 shell settings put global window_animation_scale 0
adb -s emulator-5554 shell settings put global transition_animation_scale 0
adb -s emulator-5554 shell settings put global animator_duration_scale 0
adb -s emulator-5554 shell input keyevent 82 || true
echo "Emulator booted"
