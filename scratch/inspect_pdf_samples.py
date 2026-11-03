import os
import sys
import pypdf

sys.stdout.reconfigure(encoding='utf-8')

pdf_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../Writing Test questions'))
sample_files = [
    'Cambridge IELTS 12 Academic Writing Test 1 (Free Online Test & Samples).pdf',
    'Cambridge IELTS 12 Academic Writing Test 2 (Free Online Test & Samples).pdf',
    'Cambridge IELTS 16 Academic Writing Test 1 (Free Online Test & Samples).pdf',
    'Cambridge IELTS 21 Academic Writing Test 1 (Free Online Test & Samples).pdf'
]

for fname in sample_files:
    fpath = os.path.join(pdf_dir, fname)
    reader = pypdf.PdfReader(fpath)
    print(f"**************************************************")
    print(f"FILE: {fname} (Pages: {len(reader.pages)})")
    print(f"**************************************************")
    for i, p in enumerate(reader.pages):
        text = p.extract_text()
        print(f"--- PAGE {i+1} ---")
        print(text)
        print()
