// Full-length IELTS Writing Samples dataset (shared by /writing-samples hub, /writing-samples/:slug SSR pages, and /sitemap.xml)

const WRITING_SAMPLES = [
  {
    slug: "ielts-task-1-line-graph-renewable-energy-vs-fossil-fuels",
    module: "task1",
    moduleLabel: "Academic Task 1",
    type: "Line Graph",
    band: "9.0",
    wordCount: 178,
    title: "Renewable Energy vs Fossil Fuel Consumption (2000–2025)",
    seoTitle: "IELTS Task 1 Line Graph Sample (Band 9.0): Renewable Energy vs Fossil Fuels | IELTS Mockpoint",
    seoDesc: "Read a Band 9.0 IELTS Academic Writing Task 1 Line Graph model answer comparing renewable energy and fossil fuel consumption (2000–2025) with examiner review and vocabulary.",
    prompt: "The graph below shows the percentage of total energy generated from renewable sources and fossil fuels in a European country between 2000 and 2025. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    criteria: { ta: "9.0", cc: "9.0", lr: "9.0", gra: "9.0" },
    examinerNote: "Crystal-clear overview identifying the crossover point and inverse trends. Accurate data selection without listing every minor fluctuation, paired with precise verbs of change.",
    tips: [
      "Always write a dedicated Overview paragraph highlighting the overall trend and crossover point—never put numbers in the overview unless summarizing extremes.",
      "Group data logically by time phase (e.g., 2000–2010 vs 2015–2025) instead of describing one line completely and then the other."
    ],
    vocab: ["inverse trajectory", "steadily eclipsed", "crossover point", "marked acceleration", "remained predominant"],
    paragraphs: [
      { label: "Introduction", text: "The line graph illustrates the proportion of national electricity produced from renewable energy and fossil fuels in a European nation over a 25-year period from 2000 to 2025." },
      { label: "Overview", text: "Overall, the two energy sources followed an inverse trajectory. While fossil fuels initially dominated power generation, their share declined steadily and was eventually overtaken by renewables, which experienced marked acceleration after 2015." },
      { label: "Body 1", text: "In 2000, fossil fuels accounted for roughly 78% of total electricity output, whereas renewable sources contributed just 14%. Over the following decade, reliance on coal and gas edged down gradually to 64% in 2010, while clean energy climbed modestly to 26%." },
      { label: "Body 2", text: "Between 2015 and 2020, the gap narrowed sharply, reaching a crossover point in 2021 when both categories stood at approximately 48%. By 2025, renewables had risen to 62%, comfortably eclipsing fossil fuels, which fell to a 25-year low of 31%." }
    ]
  },
  {
    slug: "ielts-task-1-bar-chart-household-expenditure",
    module: "task1",
    moduleLabel: "Academic Task 1",
    type: "Bar Chart",
    band: "8.5",
    wordCount: 172,
    title: "Household Expenditure Across Four Countries",
    seoTitle: "IELTS Task 1 Bar Chart Sample (Band 8.5): Household Expenditure | IELTS Mockpoint",
    seoDesc: "Band 8.5 IELTS Academic Writing Task 1 Bar Chart sample comparing household spending in Japan, Germany, Australia, and Brazil with examiner feedback.",
    prompt: "The bar chart compares average annual household spending across four categories (housing, food, transport, and technology) in Japan, Germany, Australia, and Brazil. Summarise the information by selecting and reporting the main features.",
    criteria: { ta: "8.5", cc: "8.5", lr: "8.5", gra: "8.5" },
    examinerNote: "Strong comparative grouping by category rather than country-by-country mechanical listing. Natural comparative structures ('outstripped', 'by contrast').",
    tips: [
      "Compare across countries within each spending category to avoid repetitive sentence patterns.",
      "Use varied verbs for spending: 'absorbed', 'allocated to', 'prioritised', 'accounted for'."
    ],
    vocab: ["allocated to", "outstripped", "comparable margins", "lowest proportion", "expenditure profile"],
    paragraphs: [
      { label: "Introduction", text: "The bar chart compares the distribution of average yearly household expenditure across four major spending areas in Japan, Germany, Australia, and Brazil." },
      { label: "Overview", text: "Overall, housing represented the largest financial burden in three of the four nations, whereas Brazilian households allocated a significantly higher share to food than their counterparts. Technology consistently received the smallest proportion across every country." },
      { label: "Body 1", text: "Housing absorbed the greatest share of income in Australia at 34%, closely followed by Germany at 31% and Japan at 28%. In contrast, Brazil spent only 19% on accommodation, prioritising food at 29%, which outstripped the figures for Japan (22%), Germany (18%), and Australia (16%)." },
      { label: "Body 2", text: "Transport expenditure showed narrower variation, ranging from 15% in Japan to 21% in Brazil. Meanwhile, spending on technology remained modest everywhere, peaking at 11% in Japan and dipping to just 6% in Brazil." }
    ]
  },
  {
    slug: "ielts-task-1-pie-charts-graduate-employment",
    module: "task1",
    moduleLabel: "Academic Task 1",
    type: "Pie Charts",
    band: "8.0",
    wordCount: 168,
    title: "University Graduate Employment Sectors (2010 vs 2024)",
    seoTitle: "IELTS Task 1 Pie Charts Sample (Band 8.0): Graduate Employment Sectors | IELTS Mockpoint",
    seoDesc: "Study a Band 8.0 IELTS Task 1 Pie Charts model answer comparing graduate employment sectors in 2010 and 2024 with examiner comments.",
    prompt: "The two pie charts show the sectors in which graduates from a UK university found employment in 2010 and 2024. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    criteria: { ta: "8.0", cc: "8.0", lr: "8.5", gra: "8.0" },
    examinerNote: "Clear comparison between the two time periods with accurate percentages and well-organized paragraphing.",
    tips: [
      "Group shrinking sectors in Body 1 and expanding sectors in Body 2 for instant coherence.",
      "Mention unchanged categories briefly at the end ('remained virtually unchanged')."
    ],
    vocab: ["experienced a surge", "shrank considerably", "remained virtually unchanged", "employment landscape"],
    paragraphs: [
      { label: "Introduction", text: "The two pie charts illustrate shifts in the employment destinations of graduates from a British university between 2010 and 2024." },
      { label: "Overview", text: "Overall, the technology and healthcare sectors expanded substantially over the 14-year period, whereas traditional manufacturing and retail absorbed far fewer graduates by 2024." },
      { label: "Body 1", text: "In 2010, finance and retail were the leading employers, hiring 28% and 22% of graduates respectively. By 2024, retail had fallen sharply to 9%, while finance declined slightly to 23%. Manufacturing also contracted from 16% to just 7%." },
      { label: "Body 2", text: "Conversely, technology experienced the most dramatic growth, nearly tripling from 11% in 2010 to 31% in 2024 to become the top destination. Healthcare rose steadily from 14% to 21%, while education remained virtually unchanged at around 9%." }
    ]
  },
  {
    slug: "ielts-task-1-table-underground-railway-systems",
    module: "task1",
    moduleLabel: "Academic Task 1",
    type: "Table",
    band: "8.5",
    wordCount: 174,
    title: "Underground Railway Systems in Six Major Cities",
    seoTitle: "IELTS Task 1 Table Sample (Band 8.5): Underground Railway Systems | IELTS Mockpoint",
    seoDesc: "Band 8.5 IELTS Writing Task 1 Table model answer comparing underground railway networks in London, Paris, Tokyo, Washington DC, Kyoto, and Los Angeles.",
    prompt: "The table below gives information about underground railway systems in six cities, including opening year, route length, and annual passenger numbers. Summarise the information by selecting and reporting the main features.",
    criteria: { ta: "8.5", cc: "8.5", lr: "8.5", gra: "8.5" },
    examinerNote: "Effectively groups older vs newer networks and highlights the key contrast between Tokyo's passenger volume and London's route length.",
    tips: [
      "In Task 1 tables, never go row-by-row mechanically. Group by 'older vs newer' or 'largest vs smallest'.",
      "Highlight striking anomalies—such as Tokyo carrying more passengers than London despite a shorter route."
    ],
    vocab: ["oldest network", "passenger throughput", "disproportionately high", "newly established"],
    paragraphs: [
      { label: "Introduction", text: "The table presents key statistics regarding the opening dates, total track length, and yearly ridership of underground rail networks in six major global cities." },
      { label: "Overview", text: "Overall, the older systems in London, Paris, and Tokyo possess significantly longer routes and carry far more passengers than the more recently constructed networks in Washington DC, Kyoto, and Los Angeles." },
      { label: "Body 1", text: "London operates the oldest system, opened in 1863, and boasts the longest network at 394 kilometres, carrying 775 million passengers annually. Paris (1900) and Tokyo (1927) have shorter tracks of 199 km and 155 km respectively, yet Tokyo records the highest ridership of all at 1,927 million passengers per year." },
      { label: "Body 2", text: "By comparison, the three newer systems—built between 1976 and 2001—are much smaller. Washington DC spans 126 km with 144 million riders, while Kyoto and Los Angeles operate compact networks under 30 km serving 45 to 50 million commuters annually." }
    ]
  },
  {
    slug: "ielts-task-1-process-diagram-plastic-bottle-recycling",
    module: "task1",
    moduleLabel: "Academic Task 1",
    type: "Process Diagram",
    band: "9.0",
    wordCount: 169,
    title: "How Plastic Bottles Are Recycled Into Textile Fibre",
    seoTitle: "IELTS Task 1 Process Diagram Sample (Band 9.0): Plastic Recycling | IELTS Mockpoint",
    seoDesc: "Band 9.0 IELTS Academic Writing Task 1 Process Diagram sample explaining how plastic bottles are recycled into polyester fabric, with passive voice tips.",
    prompt: "The diagram illustrates the stages involved in recycling used plastic bottles into polyester fabric for clothing. Summarise the information by selecting and reporting the main features.",
    criteria: { ta: "9.0", cc: "9.0", lr: "9.0", gra: "9.0" },
    examinerNote: "Exemplary use of passive voice and sequential linkers ('subsequently', 'once cooled'). Covers every stage from collection to finished fabric.",
    tips: [
      "Use present simple passive ('are collected', 'is washed', 'are heated') for man-made manufacturing processes.",
      "State the total number of stages and whether the process is linear or cyclical in your Overview."
    ],
    vocab: ["subsequently", "shredded into flakes", "melted and extruded", "woven into fabric", "multi-stage process"],
    paragraphs: [
      { label: "Introduction", text: "The flow diagram outlines the industrial process through which discarded plastic bottles are transformed into wearable polyester textiles." },
      { label: "Overview", text: "Overall, the linear sequence comprises eight main stages, progressing from waste collection and mechanical shredding to thermal melting, fibre extrusion, and final garment weaving." },
      { label: "Body 1", text: "Initially, used plastic bottles are collected from recycling bins and transported to a sorting facility, where labels and caps are removed. The remaining clear plastic is washed thoroughly and compressed into dense blocks before being fed into a shredding machine, which cuts the material into small flakes." },
      { label: "Body 2", text: "In the subsequent thermal phase, the clean flakes are heated until molten and forced through fine nozzles to produce thin polyester filaments. Once cooled and stretched for strength, these threads are wound onto spools and finally woven into rolls of fabric ready for clothing manufacture." }
    ]
  },
  {
    slug: "ielts-task-1-map-changes-oakwood-town-centre",
    module: "task1",
    moduleLabel: "Academic Task 1",
    type: "Map Changes",
    band: "8.5",
    wordCount: 176,
    title: "Transformation of Oakwood Town Centre (1995 vs Today)",
    seoTitle: "IELTS Task 1 Map Sample (Band 8.5): Town Centre Redevelopment | IELTS Mockpoint",
    seoDesc: "Band 8.5 IELTS Writing Task 1 Map Comparison sample showing the transformation of Oakwood town centre from 1995 to today.",
    prompt: "The two maps show the changes that have taken place in Oakwood town centre between 1995 and the present day. Summarise the information by selecting and reporting the main features.",
    criteria: { ta: "8.5", cc: "8.5", lr: "8.5", gra: "8.5" },
    examinerNote: "Accurate spatial prepositions ('to the north-west', 'adjacent to', 'replaced by') and strong contrast between vehicular and pedestrian infrastructure.",
    tips: [
      "Use compass directions (north-west, south-east) and verbs of change ('demolished', 'pedestrianised', 'relocated').",
      "Always mention at least one feature that remained unchanged ('remains intact')."
    ],
    vocab: ["pedestrianised", "demolished to make way for", "adjacent to", "underwent extensive redevelopment"],
    paragraphs: [
      { label: "Introduction", text: "The two maps depict the structural transformation of Oakwood town centre from 1995 to the present day." },
      { label: "Overview", text: "Overall, the area has undergone extensive modernisation, shifting from an industrial, car-dominated layout to a pedestrian-friendly commercial and recreational hub." },
      { label: "Body 1", text: "In 1995, a main road bisected the town from west to east, flanked by a row of small independent shops in the north and an open-air car park in the south-east. Today, the central road has been fully pedestrianised, and the old shops have been replaced by a large covered shopping mall." },
      { label: "Body 2", text: "Further east, the former warehouse complex near the river was demolished to make way for a riverside park and café promenade. Meanwhile, the original car park was relocated underground beneath a newly constructed cinema, while the historic library in the north-west corner remains intact." }
    ]
  },
  {
    slug: "ielts-task-2-opinion-public-transport-vs-new-roads",
    module: "task2",
    moduleLabel: "Task 2 Essay",
    type: "Opinion (Agree/Disagree)",
    band: "9.0",
    wordCount: 286,
    title: "Public Transport Investment vs Building New Roads",
    seoTitle: "IELTS Task 2 Opinion Essay Sample (Band 9.0): Public Transport vs Roads | IELTS Mockpoint",
    seoDesc: "Read a Band 9.0 IELTS Writing Task 2 Opinion Essay on whether governments should invest in public transport rather than new roads, with examiner breakdown.",
    prompt: "Some people believe governments should spend money on railways and public transport rather than building new roads. To what extent do you agree or disagree?",
    criteria: { tr: "9.0", cc: "9.0", lr: "9.0", gra: "9.0" },
    examinerNote: "Unambiguous position maintained throughout, sophisticated topic vocabulary ('induced demand'), and well-developed cause-and-effect reasoning.",
    tips: [
      "State your exact position clearly in the Introduction and reinforce it in the Conclusion.",
      "Include a brief concession ('Admittedly, rural regions still require...') to show balanced Band 9 reasoning."
    ],
    vocab: ["induced demand", "sustainable mobility", "bottlenecks", "disproportionate reliance", "long-term viability"],
    paragraphs: [
      { label: "Introduction", text: "Urban congestion has become one of the defining challenges of modern cities. While expanding road networks is often proposed as a quick remedy, I strongly agree that public funds are far better invested in railways and mass transit systems." },
      { label: "Body 1", text: "The primary reason for favouring public transport is that building wider roads rarely solves traffic congestion in the long run. Urban planners frequently point to the phenomenon of induced demand: new lanes temporarily ease travel, which encourages more citizens to purchase private vehicles, quickly restoring the original gridlock. By contrast, a single metro line or high-speed rail corridor can move tens of thousands of commuters per hour without consuming additional urban land." },
      { label: "Body 2", text: "Furthermore, prioritising railways yields substantial environmental and social dividends. Private cars account for a disproportionate share of urban carbon emissions and fine-particulate pollution. Shifting commuters onto electric trains directly improves air quality and public health. Equally important, affordable buses and trains promote social equity by ensuring that students, elderly residents, and lower-income workers can access employment and education without the financial burden of car ownership." },
      { label: "Conclusion", text: "Admittedly, rural regions still require well-maintained roads for freight and essential services. However, for growing metropolitan areas, investing in reliable rail and public transit offers the only sustainable solution to congestion, pollution, and urban liveability." }
    ]
  },
  {
    slug: "ielts-task-2-discuss-both-views-remote-work-vs-office",
    module: "task2",
    moduleLabel: "Task 2 Essay",
    type: "Discuss Both Views",
    band: "8.5",
    wordCount: 292,
    title: "Remote Work vs Working in a Traditional Office",
    seoTitle: "IELTS Task 2 Discuss Both Views Sample (Band 8.5): Remote Work vs Office | IELTS Mockpoint",
    seoDesc: "Band 8.5 IELTS Task 2 essay discussing remote work vs traditional office working with a balanced opinion and examiner scoring notes.",
    prompt: "Some employees prefer working from home, while others believe working in a physical office is essential for career growth and teamwork. Discuss both views and give your own opinion.",
    criteria: { tr: "8.5", cc: "8.5", lr: "8.5", gra: "8.5" },
    examinerNote: "Balanced discussion of both perspectives before delivering a clear, nuanced hybrid opinion.",
    tips: [
      "Give equal paragraph weight to both sides before stating your own opinion clearly.",
      "Use attribution phrases like 'Advocates of...' and 'On the other hand, proponents of...'."
    ],
    vocab: ["autonomy", "spontaneous collaboration", "work-life integration", "professional isolation", "hybrid model"],
    paragraphs: [
      { label: "Introduction", text: "The rapid rise of digital collaboration tools has sparked debate over whether remote work should replace traditional office environments. While working from home offers undeniable flexibility, many still argue that physical offices remain vital for collaboration and career progression. In my view, a structured hybrid arrangement captures the strengths of both approaches." },
      { label: "Body 1", text: "Advocates of remote work highlight gains in personal autonomy and productivity. Eliminating the daily commute saves hours of time and reduces transport expenses, allowing staff to begin their workday rested and focused. Moreover, quiet home environments often suit deep analytical tasks such as coding, writing, or financial modelling, where constant office interruptions can hinder concentration." },
      { label: "Body 2", text: "On the other hand, proponents of office-based work emphasise spontaneous collaboration and mentorship. Informal conversations beside a desk frequently spark creative solutions that scheduled video calls struggle to replicate. For junior employees in particular, observing senior colleagues in person accelerates workplace learning and prevents the sense of professional isolation that full-time remote workers often report." },
      { label: "Conclusion", text: "In conclusion, neither extreme serves every need. Remote work excels for focused individual output and wellbeing, whereas physical offices nurture culture and teamwork. Companies that adopt a hybrid model—combining two or three in-office collaboration days with flexible home working—are best positioned for long-term success." }
    ]
  },
  {
    slug: "ielts-task-2-advantages-disadvantages-ai-university-education",
    module: "task2",
    moduleLabel: "Task 2 Essay",
    type: "Advantages & Disadvantages",
    band: "8.5",
    wordCount: 278,
    title: "Artificial Intelligence in University Education",
    seoTitle: "IELTS Task 2 Advantages & Disadvantages Sample (Band 8.5): AI in Education | IELTS Mockpoint",
    seoDesc: "Band 8.5 IELTS Writing Task 2 essay evaluating whether the advantages of Artificial Intelligence in university education outweigh the disadvantages.",
    prompt: "Universities are increasingly integrating Artificial Intelligence tools into student learning and assessment. Do the advantages of this trend outweigh the disadvantages?",
    criteria: { tr: "8.5", cc: "8.5", lr: "8.5", gra: "8.5" },
    examinerNote: "Directly answers the 'outweigh' question with clear evaluation of risks vs benefits.",
    tips: [
      "When a prompt asks 'Do the advantages outweigh the disadvantages?', state clearly in the introduction which side is stronger.",
      "Place the weaker side in Body 1 and your stronger side in Body 2 ('Nevertheless...') for persuasive flow."
    ],
    vocab: ["personalised tutoring", "academic integrity", "critical thinking", "over-reliance", "pedagogical safeguards"],
    paragraphs: [
      { label: "Introduction", text: "Artificial Intelligence has rapidly entered higher education, assisting students with research, writing feedback, and data analysis. Although concerns regarding plagiarism and cognitive dependency are valid, I believe the educational benefits outweigh the drawbacks provided universities enforce clear guidelines." },
      { label: "Body 1", text: "The foremost disadvantage of AI in academia is the threat to academic integrity and independent thinking. When students use generative tools to draft entire essays, they bypass the mental struggle required to synthesise arguments and evaluate evidence. Over-reliance on automated answers can weaken critical reasoning and leave graduates ill-prepared for problem-solving in real workplaces." },
      { label: "Body 2", text: "Nevertheless, AI offers transformative advantages when used as a learning companion rather than a shortcut. Intelligent tutoring systems can provide instant, personalised feedback on grammar, mathematics, or coding outside lecture hours—support that human lecturers cannot offer to hundreds of students simultaneously. Furthermore, automating routine literature searches frees undergraduates to focus on higher-order analysis and original experimentation." },
      { label: "Conclusion", text: "Overall, while unchecked AI usage risks undermining genuine scholarship, banning the technology is neither realistic nor desirable. By redesigning assessments around oral defences and process-based grading, universities can harness AI's personalisation benefits while safeguarding academic standards." }
    ]
  },
  {
    slug: "ielts-task-2-problem-solution-urban-traffic-air-pollution",
    module: "task2",
    moduleLabel: "Task 2 Essay",
    type: "Problem & Solution",
    band: "8.0",
    wordCount: 282,
    title: "Urban Air Pollution & Traffic Congestion in Megacities",
    seoTitle: "IELTS Task 2 Problem Solution Essay Sample (Band 8.0): Traffic & Air Pollution | IELTS Mockpoint",
    seoDesc: "Band 8.0 IELTS Writing Task 2 Problem and Solution essay on urban traffic congestion and air pollution with real-world policy examples.",
    prompt: "In many major cities, air pollution and traffic congestion have reached critical levels. What are the main causes of this issue, and what measures can governments take to address it?",
    criteria: { tr: "8.0", cc: "8.0", lr: "8.5", gra: "8.0" },
    examinerNote: "Clearly separates causes and practical government solutions with strong lexical cohesion.",
    tips: [
      "Dedicate Body 1 exclusively to Causes and Body 2 exclusively to Solutions, matching each solution to a cause.",
      "Cite real cities briefly (e.g., London, Singapore) to make solutions concrete."
    ],
    vocab: ["vehicular emissions", "congestion pricing", "urban sprawl", "viable alternatives", "stringent regulations"],
    paragraphs: [
      { label: "Introduction", text: "Rapidly expanding metropolises worldwide face severe traffic gridlock and deteriorating air quality. These twin problems stem primarily from unchecked car dependency and inadequate urban planning, yet targeted policy interventions can significantly reverse the trend." },
      { label: "Body 1", text: "Two key factors drive urban congestion and pollution. First, rising disposable incomes have enabled millions of households to buy private cars, overwhelming road networks designed decades ago. Second, suburban urban sprawl forces residents to commute long distances into city centres without reliable metro or bus links, leaving private vehicles as the only practical option." },
      { label: "Body 2", text: "To tackle these root causes, governments must combine disincentives for private driving with attractive alternatives. Implementing congestion pricing zones—as seen successfully in London and Singapore—discourages unnecessary city-centre car journeys while generating revenue for clean public transit. Simultaneously, authorities should subsidise electric buses, build protected cycling lanes, and enforce stringent emissions standards on commercial vehicles." },
      { label: "Conclusion", text: "In summary, urban air pollution and gridlock are largely the result of car-centric growth and weak transit infrastructure. By pairing congestion charges with sustained investment in clean mass transit, city leaders can restore both mobility and breathable air." }
    ]
  },
  {
    slug: "ielts-task-2-two-part-question-youth-reading-habits",
    module: "task2",
    moduleLabel: "Task 2 Essay",
    type: "Two-Part Question",
    band: "9.0",
    wordCount: 274,
    title: "Decline in Printed Book Reading Among Young People",
    seoTitle: "IELTS Task 2 Two-Part Question Sample (Band 9.0): Youth Reading Habits | IELTS Mockpoint",
    seoDesc: "Band 9.0 IELTS Writing Task 2 Two-Part essay explaining why young people read fewer printed books and how to encourage reading habits.",
    prompt: "Fewer young people are reading printed books for pleasure today. Why is this happening, and what can be done to encourage reading habits among youth?",
    criteria: { tr: "9.0", cc: "9.0", lr: "9.0", gra: "9.0" },
    examinerNote: "Addresses both parts evenly with insightful psychological/social causes and actionable solutions.",
    tips: [
      "Give each question in a two-part prompt its own dedicated body paragraph.",
      "Avoid generic advice like 'parents should force kids to read'; propose realistic modern habits like book clubs and audiobooks."
    ],
    vocab: ["short-form digital media", "attention span", "immediate gratification", "curated reading spaces", "lifelong literacy"],
    paragraphs: [
      { label: "Introduction", text: "In recent years, recreational reading of printed books has declined noticeably among teenagers and young adults. This shift is largely driven by the dominance of short-form digital entertainment, though schools and families can take practical steps to revive a love of reading." },
      { label: "Body 1", text: "The primary explanation lies in how smartphones and social platforms reshape young people's attention spans. Algorithmic video feeds deliver immediate visual gratification with minimal cognitive effort, making the slower, sustained concentration required by a 300-page novel feel less appealing. In addition, heavy academic workloads and the rising retail price of paperbacks often push leisure reading to the bottom of a student's priorities." },
      { label: "Body 2", text: "Encouraging youth to read again requires making books accessible, social, and enjoyable rather than mandatory. Public libraries and schools should invest in vibrant, student-curated collections featuring graphic novels, contemporary fiction, and audiobooks as stepping stones to deeper reading. Moreover, organising informal book clubs—where young readers discuss stories with peers rather than writing graded book reports—transforms reading from a chore into a shared social experience." },
      { label: "Conclusion", text: "Ultimately, digital distractions and cost barriers have pulled youth away from printed books. By lowering access costs and framing reading as an engaging social habit, communities can nurture lifelong literacy." }
    ]
  },
  {
    slug: "ielts-task-2-band-7-comparison-free-university-education",
    module: "task2",
    moduleLabel: "Task 2 Essay",
    type: "Band 7.0 Model (Comparison)",
    band: "7.0",
    wordCount: 265,
    title: "Should University Education Be Free for Everyone?",
    seoTitle: "IELTS Task 2 Band 7.0 Sample Essay: Free University Education | IELTS Mockpoint",
    seoDesc: "See a realistic Band 7.0 IELTS Task 2 essay on free university education with examiner notes explaining exactly how to upgrade it to Band 8.5+.",
    prompt: "Some people think university education should be free for all students, regardless of income. To what extent do you agree or disagree?",
    criteria: { tr: "7.0", cc: "7.0", lr: "7.0", gra: "7.0" },
    examinerNote: "Why this is Band 7.0 (and how to reach Band 8.5+): Clear position and good organisation, but uses slightly repetitive phrases and broader generalisations. Upgrading to precise terms ('means-tested grants', 'regressive taxation') pushes it to Band 8.5.",
    tips: [
      "Compare this Band 7.0 sample against the Band 9.0 essays to notice how lexical precision ('means-tested' vs 'financial need') lifts your LR score.",
      "Replace formulaic openers ('On the one hand', 'In conclusion') with more natural topic transitions where possible."
    ],
    vocab: ["financial barrier", "skilled workforce", "taxpayer burden", "equal opportunity"],
    paragraphs: [
      { label: "Introduction", text: "Higher education plays an important role in modern society, and there is an ongoing debate about whether tuition should be free for every student. While free universities could widen access, I partly disagree because completely free tuition places a heavy burden on public budgets." },
      { label: "Body 1", text: "On the one hand, removing tuition fees helps talented students from low-income backgrounds attend university. When families do not have to worry about large student loans, young people are more likely to pursue degrees in medicine, engineering, or teaching. As a result, the country benefits from a more skilled and educated workforce." },
      { label: "Body 2", text: "On the other hand, funding free university places for everyone—including wealthy families who can already afford fees—is financially inefficient. Governments have limited tax revenue and must also fund hospitals, primary schools, and public transport. A fairer system is to charge moderate fees to higher-income students while providing full scholarships and living grants to those in financial need." },
      { label: "Conclusion", text: "In conclusion, although free higher education sounds attractive, it can strain national resources unnecessarily. Targeted financial aid is a more balanced way to ensure equal opportunity without sacrificing other vital public services." }
    ]
  },
  {
    slug: "ielts-gt-task-1-formal-letter-hotel-complaint",
    module: "gt1",
    moduleLabel: "GT Task 1 Letter",
    type: "GT Formal Letter",
    band: "9.0",
    wordCount: 174,
    title: "Formal Complaint About Hotel Service & Lost Luggage",
    seoTitle: "IELTS General Training Task 1 Formal Letter Sample (Band 9.0): Hotel Complaint | IELTS Mockpoint",
    seoDesc: "Band 9.0 IELTS General Training Writing Task 1 Formal Letter sample complaining about hotel room issues and lost luggage, with examiner notes.",
    prompt: "You recently stayed at a hotel and experienced problems with your room and lost luggage. Write a letter to the hotel manager explaining what happened, how it affected your trip, and what action you expect.",
    criteria: { ta: "9.0", cc: "9.0", lr: "9.0", gra: "9.0" },
    examinerNote: "Consistently formal register ('Dear Sir or Madam', 'Yours faithfully'), covers all three bullet points clearly with polite yet firm tone.",
    tips: [
      "Use 'Yours faithfully' when opening with 'Dear Sir or Madam', and 'Yours sincerely' when addressing someone by name.",
      "Avoid contractions (don't, didn't) in formal letters."
    ],
    vocab: ["unacceptable standard", "considerable inconvenience", "promptly rectified", "full reimbursement"],
    paragraphs: [
      { label: "Greeting & Purpose", text: "Dear Sir or Madam,\nI am writing to express my dissatisfaction regarding my recent three-night stay at the Grand Harbour Hotel from 4 to 7 October (Booking Reference: GH-4821)." },
      { label: "The Problems", text: "Upon arrival, the air-conditioning unit in my room was malfunctioning, leaving the room uncomfortably warm throughout the first night despite two calls to reception. More seriously, when I checked my suitcase into your concierge storage before my afternoon meeting, one bag containing business documents was misplaced for nearly six hours." },
      { label: "Impact & Action", text: "This considerable inconvenience caused me to miss an important client presentation and incur extra taxi expenses. I therefore request a formal written apology, reimbursement of the first night's accommodation fee, and confirmation that your luggage-tracking procedures have been reviewed." },
      { label: "Sign-off", text: "I look forward to your prompt response within seven working days.\nYours faithfully,\nTariq Rahman" }
    ]
  },
  {
    slug: "ielts-gt-task-1-semi-formal-letter-flexible-hours",
    module: "gt1",
    moduleLabel: "GT Task 1 Letter",
    type: "GT Semi-Formal Letter",
    band: "8.5",
    wordCount: 168,
    title: "Requesting Flexible Working Hours From Your Manager",
    seoTitle: "IELTS GT Task 1 Semi-Formal Letter Sample (Band 8.5): Flexible Working Hours | IELTS Mockpoint",
    seoDesc: "Band 8.5 IELTS General Training Task 1 Semi-Formal Letter sample requesting flexible working hours from a manager.",
    prompt: "You are taking an evening qualification course and need to adjust your working hours for three months. Write a letter to your manager explaining your course, proposing a new schedule, and reassuring them about your workload.",
    criteria: { ta: "8.5", cc: "8.5", lr: "8.5", gra: "8.5" },
    examinerNote: "Appropriate semi-formal tone ('Dear Ms Carter', 'Best regards'), practical schedule proposal, and reassuring commitment to team deadlines.",
    tips: [
      "Semi-formal letters should be polite and respectful without sounding stiff or overly legalistic.",
      "Show how your request also benefits the company to make your letter persuasive."
    ],
    vocab: ["professional development", "adjusted schedule", "core responsibilities", "seamless handover"],
    paragraphs: [
      { label: "Greeting & Purpose", text: "Dear Ms Carter,\nI am writing to request a temporary adjustment to my working hours from 1 November to 31 January while I complete an evening diploma in Project Management." },
      { label: "Proposed Schedule", text: "My classes begin at 5:30 p.m. on Tuesdays and Thursdays, so leaving the office at 5:00 p.m. creates a tight commute. I would like to propose starting at 7:45 a.m. instead of 9:00 a.m. on those two days, allowing me to finish at 3:45 p.m. without reducing my weekly hours." },
      { label: "Reassurance", text: "Please rest assured that all my core responsibilities and client deadlines will remain unaffected, and I will remain fully reachable by email until 5:00 p.m. Additionally, the risk-management skills from this course will directly benefit our upcoming Q1 launch." },
      { label: "Sign-off", text: "Thank you for considering this request, and I would be happy to discuss it briefly this week.\nBest regards,\nNadia Islam" }
    ]
  },
  {
    slug: "ielts-gt-task-1-informal-letter-inviting-friend",
    module: "gt1",
    moduleLabel: "GT Task 1 Letter",
    type: "GT Informal Letter",
    band: "8.5",
    wordCount: 165,
    title: "Inviting a Friend to Stay & Local Recommendations",
    seoTitle: "IELTS GT Task 1 Informal Letter Sample (Band 8.5): Inviting a Friend | IELTS Mockpoint",
    seoDesc: "Band 8.5 IELTS General Training Task 1 Informal Letter sample inviting a friend to stay and recommending local attractions.",
    prompt: "An old friend from abroad is planning to visit your city next month. Write a letter inviting them to stay at your home, suggesting places to visit, and advising them on what clothes to pack.",
    criteria: { ta: "8.5", cc: "8.5", lr: "8.5", gra: "8.5" },
    examinerNote: "Warm, natural informal tone with idioms and contractions ('can't wait', 'feel right at home'), covering all three bullet points smoothly.",
    tips: [
      "Use natural contractions (I've, you'll, can't) and friendly idioms in informal letters.",
      "Do not mix formal expressions like 'I am writing to inform you' into a letter to a close friend."
    ],
    vocab: ["feel right at home", "hidden gems", "changeable weather", "catch up properly"],
    paragraphs: [
      { label: "Greeting & Invitation", text: "Hi Sam,\nI was thrilled to hear you're finally coming to visit next month! Of course, you must stay at my apartment—I've got a cosy spare room ready so you'll feel right at home and save on hotel costs." },
      { label: "Things to Do", text: "Once you've settled in, I'd love to take you to the Old Quarter street-food market and the hillside botanical gardens, which are absolute hidden gems. If the weather holds up, we can also take a Saturday ferry out to the coastal cliffs." },
      { label: "Packing Advice", text: "Just a quick heads-up on packing: evenings get breezy near the river, and we sometimes get sudden afternoon showers, so bring a light waterproof jacket, a warm jumper, and comfortable walking shoes." },
      { label: "Sign-off", text: "Let me know your flight arrival time so I can meet you at the station. Can't wait to catch up properly!\nWarmly,\nAlex" }
    ]
  }
];

module.exports = WRITING_SAMPLES;
