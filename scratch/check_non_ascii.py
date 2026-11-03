import os
import sys
import pypdf

sys.stdout.reconfigure(encoding='utf-8')
pdf_dir = 'D:/personal websites/ieltsmockpoint/Writing Test questions'

for f in sorted(os.listdir(pdf_dir)):
    if not f.endswith('.pdf'): continue
    reader = pypdf.PdfReader(os.path.join(pdf_dir, f))
    for i, p in enumerate(reader.pages):
        t = p.extract_text() or ''
        non_ascii = set([c for c in t if ord(c) > 127])
        if non_ascii:
            codes = [(c, hex(ord(c)), ord(c)) for c in non_ascii]
            print(f"{f} P{i+1}: {codes}")
