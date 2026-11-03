import os
import re
import sys
import json
import unicodedata
import pypdf

sys.stdout.reconfigure(encoding='utf-8')

pdf_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../Writing Test questions'))

def clean_str(s):
    if not s:
        return ""
    # Normalize unicode
    s = unicodedata.normalize("NFKD", s)
    s = s.replace('\u2018', "'").replace('\u2019', "'")
    s = s.replace('\u201c', '"').replace('\u201d', '"')
    s = s.replace('\u2013', '-').replace('\u2014', '-')
    s = s.replace('\ufb01', 'fi').replace('\ufb02', 'fl')
    s = s.replace('\xa0', ' ')
    
    # Normalize multiple spaces per line
    lines = []
    for l in s.splitlines():
        l_clean = re.sub(r'[ \t]+', ' ', l).strip()
        lines.append(l_clean)
    
    # collapse consecutive empty lines
    collapsed = []
    prev_empty = False
    for l in lines:
        if not l:
            if not prev_empty:
                collapsed.append("")
                prev_empty = True
        else:
            collapsed.append(l)
            prev_empty = False
            
    while collapsed and not collapsed[0]:
        collapsed.pop(0)
    while collapsed and not collapsed[-1]:
        collapsed.pop()
        
    return "\n".join(collapsed)

tests_data = []

files = sorted(os.listdir(pdf_dir))
pattern = re.compile(r"Cambridge\s+IELTS\s+(\d+)\s+Academic\s+Writing\s+Test\s+(\d+)", re.IGNORECASE)

for fname in files:
    if not fname.endswith(".pdf"):
        continue
    m = pattern.search(fname)
    if not m:
        continue
    book = int(m.group(1))
    test_no = int(m.group(2))
    
    reader = pypdf.PdfReader(os.path.join(pdf_dir, fname))
    
    raw_pages = [clean_str(p.extract_text()) for p in reader.pages]
    # Filter out empty pages (like page 2 in Book 19 Test 2 and Book 20 Test 2)
    non_empty = [p for p in raw_pages if p]
    
    # Part 1 is the first non-empty page
    part1_raw = non_empty[0] if len(non_empty) > 0 else ""
    # Part 2 is the last non-empty page
    part2_raw = non_empty[1] if len(non_empty) > 1 else ""
    
    tests_data.append({
        "book": book,
        "testNo": test_no,
        "title": f"Cambridge {book} Test {test_no} Academic Writing",
        "part1_raw": part1_raw,
        "part2_raw": part2_raw
    })

tests_data.sort(key=lambda x: (x["book"], x["testNo"]))

print(f"Total tests extracted: {len(tests_data)}")
out_path = os.path.abspath(os.path.join(os.path.dirname(__file__), 'raw_extracted_writing_tests.json'))
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(tests_data, f, indent=2, ensure_ascii=False)
print(f"Saved raw extracted data to: {out_path}")
