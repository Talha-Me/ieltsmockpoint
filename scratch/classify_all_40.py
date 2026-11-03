import json
import re

with open('D:/personal websites/ieltsmockpoint/data/cambridgeWriting12_21.json', 'r', encoding='utf-8') as f:
    tests = json.load(f)

print(f"Total tests: {len(tests)}")

def classify_task1(prompt):
    p = prompt.lower()
    if 'graph' in p:
        return 'Line-Graph'
    elif 'bar chart' in p or 'bar charts' in p:
        return 'Bar-Chart'
    elif 'pie chart' in p or 'pie charts' in p:
        return 'Pie-Chart'
    elif 'table' in p and ('chart' in p or 'charts' in p):
        return 'Mixed-Charts'
    elif 'table' in p or 'tables' in p:
        return 'Table'
    elif 'map' in p or 'maps' in p or 'plans' in p or 'plan' in p or 'site' in p or 'layout' in p or 'harbour' in p or 'park' in p or 'cafe' in p:
        return 'Map'
    elif 'diagram' in p or 'process' in p or 'manufactur' in p or 'produc' in p:
        return 'Process-Diagram'
    elif 'chart' in p or 'charts' in p:
        return 'Bar-Chart'
    return 'Other'

def classify_task2(prompt):
    p = prompt.lower()
    if 'discuss both' in p:
        return 'Discussion-Essay'
    elif 'agree or disagree' in p:
        return 'Opinion-Essay'
    elif 'positive or negative' in p:
        return 'Positive-Negative'
    elif 'outweigh' in p or 'advantages and disadvantages' in p:
        return 'Advantages-Disadvantages'
    elif 'why' in p and ('what can be done' in p or 'how can' in p or 'solution' in p):
        return 'Problem-Solution'
    elif '?' in p and p.count('?') >= 2:
        return 'Two-Part-Question'
    elif 'why' in p:
        return 'Problem-Solution'
    return 'Opinion-Essay'

t1_counts = {}
t2_counts = {}

for t in tests:
    b = t['book']
    no = t['testNo']
    q1 = t['writing']['questions'][0]['question']
    q2 = t['writing']['questions'][1]['question']
    
    c1 = classify_task1(q1)
    c2 = classify_task2(q2)
    
    t1_counts[c1] = t1_counts.get(c1, []) + [f"C{b}T{no}"]
    t2_counts[c2] = t2_counts.get(c2, []) + [f"C{b}T{no}"]

print("\n--- TASK 1 CLASSIFICATION ---")
for k, v in sorted(t1_counts.items()):
    print(f"{k} ({len(v)}): {', '.join(v)}")

print("\n--- TASK 2 CLASSIFICATION ---")
for k, v in sorted(t2_counts.items()):
    print(f"{k} ({len(v)}): {', '.join(v)}")
