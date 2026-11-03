import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('D:/personal websites/ieltsmockpoint/data/cambridgeWriting12_21.json', 'r', encoding='utf-8') as f:
    tests = json.load(f)

print(f"Total tests loaded: {len(tests)}")

for t in tests:
    b = t["book"]
    no = t["testNo"]
    q1 = t["writing"]["questions"][0]["question"]
    q2 = t["writing"]["questions"][1]["question"]
    img1 = t["writing"]["questions"][0]["image"]
    
    # Check assertions
    assert b in range(12, 22), f"Invalid book: {b}"
    assert no in range(1, 5), f"Invalid testNo: {no}"
    assert img1 == [], f"Image should be empty list, got {img1}"
    assert "WRITING TASK 1" in q1
    assert "WRITING TASK 2" in q2
    assert "Write at least 150 words" in q1
    assert "Write at least 250 words" in q2
    
    print(f"=== Cambridge {b} Test {no} ===")
    print("[Task 1 Prompt]:")
    # extract middle part
    p1_mid = q1.split("You should spend about 20 minutes on this task.\n\n")[1].split("\n\nWrite at least 150 words.")[0]
    print(p1_mid)
    print("\n[Task 2 Prompt]:")
    p2_mid = q2.split("Write about the following topic:\n\n")[1].split("\n\nGive reasons for your answer")[0]
    print(p2_mid)
    print("-" * 50)
