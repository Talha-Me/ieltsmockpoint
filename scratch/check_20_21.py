import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('D:/personal websites/ieltsmockpoint/data/cambridgeWriting12_21.json', 'r', encoding='utf-8') as f:
    tests = json.load(f)

for t in tests:
    if t['book'] in [20, 21]:
        print(f"*** Cambridge {t['book']} Test {t['testNo']} ***")
        print("TASK 1:")
        print(t['writing']['questions'][0]['question'])
        print("\nTASK 2:")
        print(t['writing']['questions'][1]['question'])
        print("="*60)
