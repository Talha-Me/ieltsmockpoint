import os
import re
import sys
import unicodedata
import pypdf
import json

sys.stdout.reconfigure(encoding='utf-8')

pdf_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../Writing Test questions'))

def clean_unicode(text):
    if not text:
        return ""
    text = unicodedata.normalize("NFKD", text)
    text = text.replace('\u2018', "'").replace('\u2019', "'")
    text = text.replace('\u201c', '"').replace('\u201d', '"')
    text = text.replace('\u2013', '-').replace('\u2014', '-')
    text = text.replace('\ufb01', 'fi').replace('\ufb02', 'fl')
    return text

def extract_core_task1(raw_text):
    text = clean_unicode(raw_text)
    lines = [l.strip() for l in text.splitlines() if l.strip()]
    filtered = []
    for line in lines:
        lower = line.lower()
        if re.search(r'^cambridge\s+ielts\s+\d+\s+academic\s+writing\s+test\s+\d+', lower):
            continue
        if lower in ['part 1', 'writing task 1', 'task 1']:
            continue
        if 'you should spend about 20 minutes on this task' in lower:
            continue
        if 'write at least 150 words' in lower:
            continue
        filtered.append(line)
    return "\n".join(filtered)

def extract_core_task2(raw_text):
    text = clean_unicode(raw_text)
    lines = [l.strip() for l in text.splitlines() if l.strip()]
    filtered = []
    for line in lines:
        lower = line.lower()
        if re.search(r'^cambridge\s+ielts\s+\d+\s+academic\s+writing\s+test\s+\d+', lower):
            continue
        if lower in ['part 2', 'writing task 2', 'task 2']:
            continue
        if 'you should spend about 40 minutes on this task' in lower:
            continue
        if 'write about the following topic' in lower:
            continue
        if 'write at least 250 words' in lower:
            continue
        if 'give reasons for your answer and include any relevant examples from your own knowledge or experience' in lower:
            continue
        if 'give reasons for your answer and include any relevant examples' in lower:
            continue
        filtered.append(line)
    return "\n".join(filtered)

pattern = re.compile(r"Cambridge\s+IELTS\s+(\d+)\s+Academic\s+Writing\s+Test\s+(\d+)", re.IGNORECASE)
files = sorted(os.listdir(pdf_dir))

all_extracted = []

for fname in files:
    if not fname.endswith(".pdf"):
        continue
    m = pattern.search(fname)
    if not m:
        continue
    book = int(m.group(1))
    test_no = int(m.group(2))
    
    fpath = os.path.join(pdf_dir, fname)
    reader = pypdf.PdfReader(fpath)
    
    non_empty_pages = []
    for p in reader.pages:
        t = p.extract_text() or ""
        if len(t.strip()) > 30:
            non_empty_pages.append(t)
            
    if len(non_empty_pages) < 2:
        print(f"ERROR: {fname} has fewer than 2 text pages!")
        continue
        
    p1_core = extract_core_task1(non_empty_pages[0])
    p2_core = extract_core_task2(non_empty_pages[1])
    
    all_extracted.append({
        "book": book,
        "testNo": test_no,
        "p1_core": p1_core,
        "p2_core": p2_core
    })

all_extracted.sort(key=lambda x: (x["book"], x["testNo"]))

out_txt_path = 'D:/personal websites/ieltsmockpoint/scratch/verified_core_prompts.utf8.txt'
with open(out_txt_path, 'w', encoding='utf-8') as out:
    out.write(f"Total processed: {len(all_extracted)}\n")
    for item in all_extracted:
        out.write(f"\n==================== Cambridge {item['book']} Test {item['testNo']} ====================\n")
        out.write("TASK 1:\n")
        out.write(item['p1_core'] + "\n")
        out.write("---\n")
        out.write("TASK 2:\n")
        out.write(item['p2_core'] + "\n")

print(f"Successfully wrote {len(all_extracted)} tests to {out_txt_path}")
