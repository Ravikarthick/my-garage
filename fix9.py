#!/usr/bin/env python3
import re

path = 'app/(tabs)/index.tsx'

with open(path, 'r') as f:
    content = f.read()

# Replace using regex to match any nested brackets/parens
content = re.sub(r'\{\[allMfgs\.map\]\(http://allMfgs\.map\)\(', '{allMfgs.map(', content)
content = re.sub(r'\{\[allSeries\.map\]\(http://allSeries\.map\)\(', '{allSeries.map(', content)

with open(path, 'w') as f:
    f.write(content)

# Verify
with open(path, 'r') as f:
    check = f.read()

if 'allMfgs.map](http' in check or 'allSeries.map](http' in check:
    print('STILL CORRUPTED!')
else:
    print('Fixed successfully!')
