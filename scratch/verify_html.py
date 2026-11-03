with open('D:/personal websites/ieltsmockpoint/public/cambridge-writing.html', 'r', encoding='utf-8') as f:
    c = f.read()
print('Includes book 21:', 'book: 21' in c)
print('Includes Cambridge 12–21:', 'Cambridge 12–21' in c)
print('Includes data-n 40:', 'data-n="40"' in c)
