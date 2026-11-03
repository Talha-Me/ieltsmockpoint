import os
import re
import sys
import json
import unicodedata
import pypdf

sys.stdout.reconfigure(encoding='utf-8')

pdf_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../Writing Test questions'))

def clean_text(text):
    if not text:
        return ""
    # Normalize unicode (decompose ligatures like fi, fl)
    text = unicodedata.normalize("NFKD", text)
    # Replace special unicode quotes and dashes
    text = text.replace('\u2018', "'").replace('\u2019', "'")
    text = text.replace('\u201c', '"').replace('\u201d', '"')
    text = text.replace('\u2013', '-').replace('\u2014', '-')
    text = text.replace('\ufb01', 'fi').replace('\ufb02', 'fl')
    
    # Clean up whitespace while preserving paragraph breaks
    lines = [line.strip() for line in text.splitlines()]
    # Remove empty lines at start and end
    while lines and not lines[0]:
        lines.pop(0)
    while lines and not lines[-1]:
        lines.pop()
    
    return "\n".join(lines)

all_tests = []

# Pattern to extract book and test number from filename
# e.g. "Cambridge IELTS 12 Academic Writing Test 1 (Free Online Test & Samples).pdf"
pattern = re.compile(r"Cambridge\s+IELTS\s+(\d+)\s+Academic\s+Writing\s+Test\s+(\d+)", re.IGNORECASE)

files = sorted(os.listdir(pdf_dir))
print(f"Found {len(files)} files in directory.")

for fname in files:
    if not fname.endswith(".pdf"):
        continue
    m = pattern.search(fname)
    if not m:
        print(f"WARNING: Filename did not match pattern: {fname}")
        continue
    
    book = int(m.group(1))
    test_no = int(m.group(2))
    
    fpath = os.path.join(pdf_dir, fname)
    reader = pypdf.PdfReader(fpath)
    
    pages_text = [clean_text(p.extract_text()) for p in reader.pages]
    
    all_tests.append({
        "filename": fname,
        "book": book,
        "testNo": test_no,
        "numPages": len(reader.pages),
        "pages": pages_text
    })

# Sort by book and testNo
all_tests.sort(key=lambda x: (x["book"], x["testNo"]))

print(f"Successfully processed {len(all_tests)} tests.")
for t in all_tests:
    print(f"Book {t['book']} Test {t['testNo']} -> {t['numPages']} pages")
    # check page 1 header
    p1_first_line = t['pages'][0].splitlines()[0] if t['pages'] and t['pages'][0] else ""
    p2_first_line = t['pages'][1].splitlines()[0] if len(t['pages']) > 1 and t['pages'][1] else ""
    # print sample line
    print(f"   P1: {p1_first_line[:50]} | P2: {p2_first_line[:50]}")
