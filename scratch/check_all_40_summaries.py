import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('D:/personal websites/ieltsmockpoint/data/cambridgeWriting12_21.json', 'r', encoding='utf-8') as f:
    tests = json.load(f)

for t in tests:
    b = t['book']
    no = t['testNo']
    q1 = t['writing']['questions'][0]['question']
    q2 = t['writing']['questions'][1]['question']
    
    # Extract just the core prompt
    p1 = q1.split('You should spend about 20 minutes on this task.\n\n')[1].split('\n\nWrite at least 150 words.')[0]
    p2 = q2.split('Write about the following topic:\n\n')[1].split('\n\nGive reasons for your answer')[0]
    
    # replace newlines with space
    p1_s = " ".join(p1.split())
    p2_s = " ".join(p2.split())
    
    print(f"C{b}T{no} | T1 ({len(p1_s)} chars): {p1_s[:60]}... -> ...{p1_s[-40:]}")
    print(f"       | T2 ({len(p2_s)} chars): {p2_s[:60]}... -> ...{p2_s[-40:]}")
