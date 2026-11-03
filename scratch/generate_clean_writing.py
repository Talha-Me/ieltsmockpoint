import os
import re
import sys
import json
import unicodedata
import pypdf

sys.stdout.reconfigure(encoding='utf-8')

pdf_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../Writing Test questions'))

def clean_unicode(text):
    if not text:
        return ""
    text = unicodedata.normalize("NFKD", text)
    text = text.replace('’', "'").replace('‘', "'")
    text = text.replace('”', '"').replace('“', '"')
    text = text.replace('–', '-').replace('—', '-')
    text = text.replace('ﬁ', 'fi').replace('ﬂ', 'fl')
    text = text.replace('\xa0', ' ')
    return text

def parse_pdf(book, test_no):
    fname = f"Cambridge IELTS {book} Academic Writing Test {test_no} (Free Online Test & Samples).pdf"
    fpath = os.path.join(pdf_dir, fname)
    if not os.path.exists(fpath):
        raise FileNotFoundError(fpath)
    
    reader = pypdf.PdfReader(fpath)
    valid_pages = []
    for p in reader.pages:
        t = p.extract_text() or ""
        if len(t.strip()) > 30:
            valid_pages.append(t)
            
    if len(valid_pages) < 2:
        raise ValueError(f"{fname} has only {len(valid_pages)} valid pages")
        
    p1_raw = clean_unicode(valid_pages[0])
    p2_raw = clean_unicode(valid_pages[-1])
    
    return p1_raw, p2_raw

tests_data = []

for b in range(12, 22):
    for t in range(1, 5):
        p1_raw, p2_raw = parse_pdf(b, t)
        
        # --- Task 1 cleaning ---
        p1_lines = [l.strip() for l in p1_raw.splitlines() if l.strip()]
        p1_filtered = []
        for line in p1_lines:
            low = line.lower()
            if re.search(r'^cambridge\s+ielts\s+\d+\s+academic\s+writing\s+test\s+\d+', low):
                continue
            if low in ['part 1', 'writing task 1', 'task 1']:
                continue
            if 'you should spend about 20 minutes on this task' in low:
                continue
            if 'write at least 150 words' in low:
                continue
            p1_filtered.append(line)
        p1_core = " ".join(p1_filtered)
        p1_core = p1_core.replace("annual ' income", "annual income")
        p1_core = p1_core.replace("annual '  income", "annual income")
        p1_core = re.sub(r'\s+', ' ', p1_core).strip()
        
        m_sum = re.search(r'(Summarise the information.*|Summarize the information.*)', p1_core, re.IGNORECASE)
        if m_sum:
            prompt_main = p1_core[:m_sum.start()].strip()
            summary_inst = p1_core[m_sum.start():].strip()
            task1_formatted = f"WRITING TASK 1\n\nYou should spend about 20 minutes on this task.\n\n{prompt_main}\n\n{summary_inst}\n\nWrite at least 150 words."
        else:
            task1_formatted = f"WRITING TASK 1\n\nYou should spend about 20 minutes on this task.\n\n{p1_core}\n\nWrite at least 150 words."

        # --- Task 2 cleaning ---
        # Handle Book 20 Test 3 and Test 4 explicitly if needed, or through robust parsing
        # Combine all lines first to avoid split across line breaks
        p2_full = " ".join([l.strip() for l in p2_raw.splitlines() if l.strip()])
        
        # Remove headers
        p2_full = re.sub(r'(?i)cambridge\s+ielts\s+\d+\s+academic\s+writing\s+test\s+\d+', '', p2_full)
        p2_full = re.sub(r'(?i)\bpart\s+2\b', '', p2_full)
        p2_full = re.sub(r'(?i)\bwriting\s+task\s+2\b', '', p2_full)
        p2_full = re.sub(r'(?i)you should spend about 40 minutes on this task\.?', '', p2_full)
        p2_full = re.sub(r'(?i)write at least 250 words\.?', '', p2_full)
        p2_full = re.sub(r'(?i)write about the following topic:?', '', p2_full)
        p2_full = re.sub(r'(?i)give reasons for your answer and include any relevant examples from your own knowledge or experience\.?', '', p2_full)
        p2_full = re.sub(r'(?i)give reasons for your answer and include any relevant examples\.?', '', p2_full)
        
        # Clean extra spaces
        p2_core = re.sub(r'\s+', ' ', p2_full).strip()
        
        task2_formatted = f"WRITING TASK 2\n\nYou should spend about 40 minutes on this task.\n\nWrite about the following topic:\n\n{p2_core}\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\n\nWrite at least 250 words."
        
        tests_data.append({
            "book": b,
            "testNo": t,
            "bookNumber": b,
            "testNumber": t,
            "title": f"Cambridge {b} Test {t} Academic Writing",
            "writing": {
                "title": f"Cambridge {b} Test {t} Academic Writing",
                "questions": [
                    {
                        "part": 1,
                        "question": task1_formatted,
                        "image": []
                    },
                    {
                        "part": 2,
                        "question": task2_formatted
                    }
                ]
            }
        })

print(f"Generated {len(tests_data)} tests.")

out_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../data'))
os.makedirs(out_dir, exist_ok=True)
json_path = os.path.join(out_dir, "cambridgeWriting12_21.json")

with open(json_path, "w", encoding="utf-8") as f:
    json.dump(tests_data, f, indent=2, ensure_ascii=False)

print(f"Saved to {json_path}")
