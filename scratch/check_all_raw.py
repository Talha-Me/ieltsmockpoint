import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('D:/personal websites/ieltsmockpoint/scratch/raw_extracted_writing_tests.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Total tests: {len(data)}")

issues = []
for item in data:
    b = item["book"]
    t = item["testNo"]
    p1 = item.get("part1_raw", "").strip()
    p2 = item.get("part2_raw", "").strip()
    
    if not p1:
        issues.append(f"Book {b} Test {t}: Part 1 is EMPTY!")
    if not p2:
        issues.append(f"Book {b} Test {t}: Part 2 is EMPTY!")
        
    print(f"Book {b} Test {t} -> P1: {len(p1)} chars, P2: {len(p2)} chars")

if issues:
    print("Issues found:")
    for iss in issues:
        print("  -", iss)
else:
    print("ALL 40 tests have non-empty Part 1 and Part 2!")
