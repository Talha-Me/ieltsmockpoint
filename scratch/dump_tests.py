import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('D:/personal websites/ieltsmockpoint/scratch/raw_extracted_writing_tests.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for item in data:
    b = item["book"]
    t = item["testNo"]
    if b in [19, 20, 21]:
        print(f"==================================================")
        print(f"BOOK {b} - TEST {t}")
        print(f"==================================================")
        print("--- PART 1 RAW ---")
        print(item.get("part1_raw"))
        print("\n--- PART 2 RAW ---")
        print(item.get("part2_raw"))
        print("\n")
