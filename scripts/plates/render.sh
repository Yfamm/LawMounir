#!/usr/bin/env sh
# Re-renders the architectural plates into src/assets/plates (and previews).
# Requires Python 3 with numpy, scipy and pillow: pip install numpy scipy pillow
set -e
cd "$(dirname "$0")"
OUT=../../src/assets/plates
python3 hypostyle.py 2400 1350 $OUT/hall-aisle.webp aisle
python3 hypostyle.py 1200 1500 $OUT/hall-aisle-portrait.webp aisle
python3 hypostyle.py 2400 1350 $OUT/hall-rows.webp rows
python3 colonnade.py 2400 1350 $OUT/colonnade.webp wide
python3 colonnade.py 1200 1500 $OUT/colonnade-detail.webp detail
python3 mashrabiya.py 2400 1500 $OUT/mashrabiya.webp
cd ../..
node -e "const s=require('sharp'),fs=require('fs');(async()=>{for(const f of fs.readdirSync('src/assets/plates'))await s('src/assets/plates/'+f).resize({width:900}).webp({quality:70}).toFile('src/assets/previews/'+f)})()"
