import os
import sys
import pypdf

sys.stdout.reconfigure(encoding='utf-8')

pdf_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../Writing Test questions'))

for book in [20, 21]:
    for test in [1, 2, 3, 4]:
        fname = f"Cambridge IELTS {book} Academic Writing Test {test} (Free Online Test & Samples).pdf"
        fpath = os.path.join(pdf_dir, fname)
        if not os.path.exists(fpath):
            print("Missing:", fname)
            continue
        reader = pypdf.PdfReader(fpath)
        print(f"==================================================")
        print(f"{fname} (Pages: {len(reader.pages)})")
        print(f"==================================================")
        for i, page in enumerate(reader.pages):
            print(f"--- PAGE {i+1} ---")
            print(page.extract_text())
