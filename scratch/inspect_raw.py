import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('D:/personal websites/ieltsmockpoint/scratch/raw_extracted_writing_tests.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Total tests: {len(data)}")
if data:
    print("Keys in item 0:", list(data[0].keys()))
    print("Item 0:", json.dumps(data[0], indent=2)[:500])
