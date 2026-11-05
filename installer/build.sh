#!/usr/bin/env bash
# Builds the WP Pond Windows installers from the portable zips in public/.
#   installer/build.sh            # uses makensis from PATH (apt install nsis)
#   MAKENSIS=/path/to/makensis NSISDIR=/path/to/share/nsis installer/build.sh
# Output: public/downloads/wp-pond-<version>-setup-<arch>.exe
set -euo pipefail

VERSION=0.1.0
ROOT=$(cd "$(dirname "$0")/.." && pwd)
ZIPS="$ROOT/public/wp-content/uploads/2026/09"
OUT="$ROOT/public/downloads"
MAKENSIS=${MAKENSIS:-makensis}
WORK=$(mktemp -d)
trap 'rm -rf "$WORK"' EXIT

mkdir -p "$OUT"
for arch in x64 x86; do
  name="wp-pond-$VERSION-windows-$arch"
  unzip -q "$ZIPS/$name.zip" -d "$WORK"
  "$MAKENSIS" -V2 \
    -DARCH="$arch" -DVERSION="$VERSION" \
    -DSRC_DIR="$WORK/$name" \
    -DOUT_FILE="$OUT/wp-pond-$VERSION-setup-$arch.exe" \
    "$ROOT/installer/wp-pond.nsi"
done
ls -l "$OUT"
