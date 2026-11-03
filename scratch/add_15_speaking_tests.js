const fs = require('fs');

const newSpeakingTests = [
  {
    id: 6,
    title: "Speaking Test 6: Daily Routine, Time Management & AI Schedules",
    part1: {
      topic: "Daily Routine & Morning Habits",
      questions: [
        "Let's talk about your daily routine. What is your typical morning like?",
        "Do you prefer doing challenging tasks early in the morning or later in the day?",
        "Do you usually plan your day in advance, or do you prefer to be spontaneous?",
        "What is your favourite part of the day, and why?"
      ]
    },
    part2: {
      topic: "Describe a time when you were very busy and had to manage your time carefully.",
      cueCard: [
        "When this happened",
        "Why you had so many responsibilities",
        "How you managed your time effectively",
        "And explain how you felt after completing everything successfully."
      ]
    },
    part3: {
      topic: "Time Management, Work-Life Balance & Automated Schedules",
      questions: [
        "Why do so many modern professionals struggle to balance work commitments with personal life?",
        "Do you think digital apps and smartphones help people save time, or do they cause more distraction?",
        "How have societal attitudes towards leisure and relaxation evolved compared to the past?",
        "In the future, do you think AI and automation will lead to shorter workweeks for most people?"
      ]
    }
  },
  {
    id: 7,
    title: "Speaking Test 7: Environment, Climate & Sustainable Living",
    part1: {
      topic: "Weather, Nature & Climate",
      questions: [
        "What kind of weather do you enjoy the most, and why?",
        "Does the weather ever influence your mood or daily productivity?",
        "Do you enjoy spending your free time outdoors in natural environments?",
        "Have you observed any noticeable changes in the weather patterns in your region over recent years?"
      ]
    },
    part2: {
      topic: "Describe an environmental problem that your town or country is facing.",
      cueCard: [
        "What the environmental problem is",
        "How long it has been a serious issue",
        "What the main causes of this problem are",
        "And explain what steps should be taken to resolve or mitigate it."
      ]
    },
    part3: {
      topic: "Environmental Conservation, Government Policy & Green Energy",
      questions: [
        "Do you believe individual habits can make a significant difference, or is government action essential?",
        "Why do some developing economies find it difficult to transition rapidly to renewable energy?",
        "What role should environmental sustainability education play in school curriculums?",
        "Are you optimistic that technological innovation will solve our global ecological challenges?"
      ]
    }
  },
  {
    id: 8,
    title: "Speaking Test 8: Health, Fitness, Diet & Public Healthcare",
    part1: {
      topic: "Physical Exercise & Staying Active",
      questions: [
        "What types of physical exercise or sports do you enjoy participating in?",
        "Did you do more physical activities when you were younger than you do now?",
        "How do you ensure you maintain a nutritious and balanced diet?",
        "Do you think people in your community are becoming more health-conscious nowadays?"
      ]
    },
    part2: {
      topic: "Describe a healthy lifestyle habit or activity you adopted recently.",
      cueCard: [
        "What the healthy habit or activity is",
        "When and why you decided to start doing it",
        "How challenging it was to integrate it into your daily schedule",
        "And explain what positive benefits it has brought to your well-being."
      ]
    },
    part3: {
      topic: "Public Health Policies, Fast Food & Mental Wellness",
      questions: [
        "What are the main contributing factors behind the global rise in lifestyle-related illnesses?",
        "Should governments impose special taxes on sugary beverages and fast food to encourage healthier diets?",
        "How has public understanding and acceptance of mental health issues changed over recent years?",
        "Do fitness tracking smartwatches genuinely motivate people to lead healthier lives?"
      ]
    }
  },
  {
    id: 9,
    title: "Speaking Test 9: Education, E-Learning, Teachers & Mentors",
    part1: {
      topic: "School Memories & Learning Preferences",
      questions: [
        "What was your favourite subject when you were in secondary school?",
        "Do you prefer studying alone in a quiet room or studying in a collaborative group?",
        "Have you ever taken an online course or watched educational tutorials on the internet?",
        "What qualities made a teacher memorable or inspiring during your schooling?"
      ]
    },
    part2: {
      topic: "Describe an inspiring teacher or mentor who had a strong positive impact on you.",
      cueCard: [
        "Who this teacher or mentor was",
        "What subject, skill, or discipline they taught you",
        "What made their teaching style or personality so exceptional",
        "And explain how they influenced your personal character or academic goals."
      ]
    },
    part3: {
      topic: "The Future of Education, Online Learning & Human Mentorship",
      questions: [
        "What are the key advantages and potential drawbacks of distance learning compared to traditional classrooms?",
        "Can artificial intelligence and adaptive software ever completely replace human educators?",
        "Should formal education focus more on practical life skills like personal finance and problem-solving?",
        "How can educational institutions ensure fair access to quality learning for underprivileged students?"
      ]
    }
  },
  {
    id: 10,
    title: "Speaking Test 10: Art, Music, Museums & Cultural Heritage",
    part1: {
      topic: "Musical Tastes & Visiting Galleries",
      questions: [
        "What genre of music do you listen to most frequently, and why?",
        "Did you learn to play a musical instrument or paint when you were a child?",
        "Do you enjoy visiting museums, art galleries, or historic exhibitions?",
        "Do you think traditional arts and folk music are still appreciated by young people today?"
      ]
    },
    part2: {
      topic: "Describe a piece of art, a painting, sculpture, or monument that you found fascinating.",
      cueCard: [
        "What the artwork or monument is",
        "Where and when you first saw or visited it",
        "What it looks like or what message it conveys",
        "And explain why it left such a profound impression on you."
      ]
    },
    part3: {
      topic: "Preserving Cultural Heritage, Public Funding for Arts & Virtual Exhibitions",
      questions: [
        "Should national museums and art galleries be free for all citizens, or should they charge admission fees?",
        "Why is it vital for societies to preserve historical monuments and traditional crafts?",
        "Is it justified for governments to allocate substantial tax revenue to artistic and cultural projects?",
        "How have virtual reality and online exhibitions transformed the way people engage with art?"
      ]
    }
  },
  {
    id: 11,
    title: "Speaking Test 11: Advertising, Social Media & Consumer Behaviour",
    part1: {
      topic: "Social Media Apps & Online Browsing",
      questions: [
        "How much time do you typically spend on social media platforms each day?",
        "Do you frequently pay attention to advertisements while browsing videos or websites?",
        "Have you ever purchased a product solely because you saw it advertised online?",
        "What kinds of commercials do you find entertaining rather than annoying?"
      ]
    },
    part2: {
      topic: "Describe a memorable advertisement or commercial that made a strong impression on you.",
      cueCard: [
        "What product or service was being advertised",
        "Where and when you saw or heard this commercial",
        "What happened in the advertisement",
        "And explain why it made such a memorable impression on you."
      ]
    },
    part3: {
      topic: "Influencer Marketing, Consumer Psychology & Advertising Regulations",
      questions: [
        "Why have social media influencers become such an influential force in modern retail marketing?",
        "Are younger audiences particularly vulnerable to manipulative advertising techniques?",
        "To what degree does relentless advertising encourage unsustainable consumer materialism?",
        "Should governments enforce stricter regulations on targeted digital advertising and privacy tracking?"
      ]
    }
  },
  {
    id: 12,
    title: "Speaking Test 12: Family, Generations & Elderly Care",
    part1: {
      topic: "Family Relationships & Traditions",
      questions: [
        "How often do you spend quality time with members of your family?",
        "Do you come from a large extended family or a nuclear household?",
        "Who in your family are you most similar to in temperament or interests?",
        "What special traditions or gatherings does your family enjoy celebrating together?"
      ]
    },
    part2: {
      topic: "Describe an older person in your family or community whom you admire.",
      cueCard: [
        "Who this person is and what your relationship with them is",
        "What their personality, character, and life story are like",
        "What valuable wisdom or skills they have shared with you",
        "And explain why you have such deep respect and admiration for them."
      ]
    },
    part3: {
      topic: "Intergenerational Dynamics, Retirement & Elderly Care",
      questions: [
        "How have family structures and living arrangements changed compared to previous generations?",
        "Whose fundamental duty is it to care for senior citizens: their families or state social care?",
        "What profound perspectives can youth gain from spending time with elderly relatives?",
        "Is rapid technological change widening the communication gap between generations?"
      ]
    }
  },
  {
    id: 13,
    title: "Speaking Test 13: Cities, Public Transport & Urbanization",
    part1: {
      topic: "Commuting & City Travel",
      questions: [
        "How do you usually travel to work, school, or around your town?",
        "Do you prefer using public transit like buses and metro trains or private vehicles?",
        "Is vehicular traffic congestion a major problem in your local neighbourhood?",
        "Has the public transport infrastructure in your region improved recently?"
      ]
    },
    part2: {
      topic: "Describe an exciting or historic city you would like to visit in the future.",
      cueCard: [
        "Which city it is and where it is situated",
        "How you first became interested in visiting this city",
        "What landmark sights, culture, or activities you wish to experience there",
        "And explain why travelling to this specific city is so appealing to you."
      ]
    },
    part3: {
      topic: "Mega-Cities, Smart Urban Planning & Future Transit",
      questions: [
        "What are the most significant challenges associated with living in densely populated mega-cities?",
        "How can city architects and planners redesign roads to promote cycling and reduce car emissions?",
        "Why do so many ambitious young individuals migrate from countryside towns to major capital cities?",
        "Will autonomous driverless vehicles and electric transit become the dominant mode of travel in cities?"
      ]
    }
  },
  {
    id: 14,
    title: "Speaking Test 14: Reading, Books, Libraries & Digital Information",
    part1: {
      topic: "Reading Habits & Literature",
      questions: [
        "Do you enjoy reading books, fiction, or non-fiction articles in your spare time?",
        "Did you read a lot of illustrated storybooks during your childhood?",
        "Do you prefer reading traditional printed paper books or electronic e-books on a screen?",
        "Have you visited a public or institutional library recently to study or borrow books?"
      ]
    },
    part2: {
      topic: "Describe an interesting book, novel, or biography you read recently.",
      cueCard: [
        "What the title of the book was and who the author is",
        "What the main storyline or central theme was about",
        "Why you decided to read this particular book",
        "And explain why you found it so captivating and intellectually rewarding."
      ]
    },
    part3: {
      topic: "The Future of Physical Books, Public Libraries & Digital Literacy",
      questions: [
        "Do you believe physical paper books will eventually disappear due to tablets and audiobooks?",
        "How should contemporary public libraries evolve to remain relevant in the digital era?",
        "How does sustained reading of long-form literature enhance cognitive focus and empathy?",
        "With vast amounts of misinformation online, how can readers develop critical discernment?"
      ]
    }
  },
  {
    id: 15,
    title: "Speaking Test 15: Money, Cashless Economy & Financial Planning",
    part1: {
      topic: "Spending Habits & Shopping Methods",
      questions: [
        "Do you prefer paying for everyday purchases using cash or digital contactless cards?",
        "Did your parents give you a regular allowance or pocket money when you were growing up?",
        "Do you find it easy or challenging to set aside savings for long-term investments?",
        "What was the last purchase you made that you considered excellent value for money?"
      ]
    },
    part2: {
      topic: "Describe an expensive purchase or item you bought that was worth the money.",
      cueCard: [
        "What the item was and how much it cost",
        "Why you decided to purchase it",
        "How long you had to save up before buying it",
        "And explain why you consider it a valuable and worthwhile investment."
      ]
    },
    part3: {
      topic: "Cashless Society, Financial Literacy & Consumer Psychology",
      questions: [
        "What are the primary advantages and potential cybersecurity risks of a cashless society?",
        "Should personal budgeting and investment literacy be mandatory subjects in secondary schools?",
        "Why do some individuals spend beyond their means on luxury goods they cannot comfortably afford?",
        "How do attitudes towards homeownership and long-term savings differ between generations?"
      ]
    }
  },
  {
    id: 16,
    title: "Speaking Test 16: Leadership, Teamwork & Decision Making",
    part1: {
      topic: "Teamwork & Collaboration",
      questions: [
        "Do you enjoy collaborating on group projects, or do you prefer working independently?",
        "What essential qualities make an individual an outstanding team player?",
        "Have you ever taken on the responsibility of leading a club, project, or student group?",
        "Do you find it straightforward to make major decisions quickly, or do you reflect for a long time?"
      ]
    },
    part2: {
      topic: "Describe a successful leader, entrepreneur, or public figure you respect.",
      cueCard: [
        "Who this leader or figure is",
        "What domain, business, or field they are renowned for",
        "What major challenges or obstacles they successfully navigated",
        "And explain what leadership attributes you most admire about their style."
      ]
    },
    part3: {
      topic: "Leadership Qualities, Workplace Governance & Young Leaders",
      questions: [
        "What are the most indispensable ethical qualities needed to lead an organisation effectively today?",
        "Is a collaborative, democratic leadership style more successful than an authoritative one?",
        "Are great leaders born with innate charismatic ability, or can leadership competencies be cultivated?",
        "Why is it essential to promote greater diversity and female representation in senior corporate leadership?"
      ]
    }
  },
  {
    id: 17,
    title: "Speaking Test 17: Animals, Pets & Wildlife Conservation",
    part1: {
      topic: "Domestic Pets & Animal Fascination",
      questions: [
        "Did you have any domestic pets living in your household when you were growing up?",
        "What is your favourite wild or domestic animal, and what do you admire about it?",
        "Are domestic companion pets popular among households in your country?",
        "Have you ever had the opportunity to observe wildlife in a safari park or natural reserve?"
      ]
    },
    part2: {
      topic: "Describe an interesting encounter or experience you had with an animal.",
      cueCard: [
        "What animal it was and where this encounter took place",
        "What the animal was doing at that moment",
        "How you felt and reacted during the experience",
        "And explain why this particular encounter was so memorable to you."
      ]
    },
    part3: {
      topic: "Biodiversity Conservation, Zoological Gardens & Habitat Loss",
      questions: [
        "Why is preserving ecological biodiversity and protecting endangered fauna crucial for humankind?",
        "What is your assessment of contemporary zoos: are they conservation centres or animal exploitation?",
        "What measures can international authorities implement to eradicate cross-border wildlife poaching?",
        "How has accelerating deforestation and urban sprawl disrupted natural animal migratory corridors?"
      ]
    }
  },
  {
    id: 18,
    title: "Speaking Test 18: Gifts, Celebrations & Traditional Festivals",
    part1: {
      topic: "Celebrations & Holiday Festivities",
      questions: [
        "What is your favourite national holiday or cultural festival, and how do you celebrate it?",
        "How do families in your country usually mark major personal milestones like birthdays?",
        "Do you derive more joy from presenting gifts to loved ones or from receiving them?",
        "What was the most heartfelt or meaningful gift you have ever been given?"
      ]
    },
    part2: {
      topic: "Describe a thoughtful gift you gave to someone that made them genuinely happy.",
      cueCard: [
        "Who you presented the gift to and what the occasion was",
        "What the gift was and how you selected or prepared it",
        "How the recipient reacted when they received it",
        "And explain why giving this gift gave you such genuine satisfaction."
      ]
    },
    part3: {
      topic: "Commercialization of Festivals, Gift Psychology & Community Cohesion",
      questions: [
        "Do you agree that traditional holidays have become excessively commercialised by retail brands?",
        "Is a personalised, handmade gift more valuable than an expensive mass-produced luxury present?",
        "Why have international festivities like New Year and Halloween gained widespread global appeal?",
        "How do shared community celebrations reinforce cultural identity and social harmony?"
      ]
    }
  },
  {
    id: 19,
    title: "Speaking Test 19: Architecture, Housing & Smart Sustainable Living",
    part1: {
      topic: "Residential Living & Architectural Styles",
      questions: [
        "What type of residential home or apartment do you currently live in?",
        "Which particular room in your home is your favourite sanctuary to unwind, and why?",
        "If you could modify one design feature of your home, what would you enhance?",
        "Do you find modern minimalist architecture or classical historic architecture more appealing?"
      ]
    },
    part2: {
      topic: "Describe an impressive modern or historical building that you admire.",
      cueCard: [
        "Where this building is located and what its primary function is",
        "What the exterior façade and architectural structure look like",
        "When and under what circumstances you first visited or saw it",
        "And explain why you consider this structure so architecturally magnificent."
      ]
    },
    part3: {
      topic: "Green Building Design, Smart Homes & Urban Heritage",
      questions: [
        "Why is it essential for growing cities to preserve heritage landmarks amidst skyscraper construction?",
        "How can modern structural engineers incorporate passive solar energy and eco-materials into buildings?",
        "Will smart home automation and voice-assisted IoT devices fundamentally improve domestic life?",
        "How significantly does the aesthetic architecture of residential districts affect mental wellbeing?"
      ]
    }
  },
  {
    id: 20,
    title: "Speaking Test 20: Photography, Memories & Visual Storytelling",
    part1: {
      topic: "Smartphone Photography & Capturing Moments",
      questions: [
        "Do you enjoy capturing photographs with your smartphone or a professional camera?",
        "How often do you take photos when socialising with close friends or exploring new places?",
        "Do you prefer photographing natural landscapes and scenery or candid portraits of people?",
        "Do you still print tangible photographs for albums, or do you store them in cloud archives?"
      ]
    },
    part2: {
      topic: "Describe an important photograph or family picture that holds special significance for you.",
      cueCard: [
        "When and where this photograph was originally captured",
        "Who or what is portrayed in the frame",
        "Who took the picture",
        "And explain why this specific photograph is so treasured and cherished by you."
      ]
    },
    part3: {
      topic: "Digital Archiving, Photojournalism & Privacy in the Camera Age",
      questions: [
        "Are people so preoccupied with recording events on their phones that they miss experiencing them fully?",
        "How has digital cloud photography changed how families preserve historical lineages and memories?",
        "What privacy dilemmas arise when individuals photograph bystanders in public without their consent?",
        "What unique power does investigative photojournalism wield in exposing global humanitarian realities?"
      ]
    }
  }
];

// 1. Update data/speakingTests.js
const testsPath = '../data/speakingTests.js';
const existingTests = require(testsPath);
console.log('Existing tests count:', existingTests.length);

const combined = [...existingTests];
newSpeakingTests.forEach(nt => {
  if (!combined.some(t => t.id === nt.id)) {
    combined.push(nt);
  }
});
console.log('Updated total tests count:', combined.length);

const outputCode = 'module.exports = ' + JSON.stringify(combined, null, 2) + ';\n';
fs.writeFileSync(testsPath, outputCode, 'utf8');
console.log('Successfully saved all 20 tests to data/speakingTests.js');

// 2. Update FrontPage/Frontend/speaking.html
const spHtmlPath = '../FrontPage/Frontend/speaking.html';
let spHtml = fs.readFileSync(spHtmlPath, 'utf8');

// Generate card HTML for tests 6 to 20
let newCardsHtml = '';
for (let i = 6; i <= 20; i++) {
  const t = combined.find(x => x.id === i);
  if (!t) continue;
  const numPad = String(i).padStart(2, '0');
  const p1Topic = t.part1 ? t.part1.topic : 'General Interview';
  const p2Topic = t.part2 ? t.part2.topic : 'Cue Card';
  const p3Topic = t.part3 ? t.part3.topic : 'Discussion';

  newCardsHtml += `
      <!-- Test ${i} -->
      <div class="sp-card reveal">
        <span class="bignum">${numPad}</span>
        <span class="pill">IELTS SPEAKING ${i}</span>
        <h3>Speaking Mock Test ${i}</h3>
        <div class="sp-topics">
          <span><b>Part 1:</b> ${p1Topic}</span>
          <span><b>Part 2:</b> ${p2Topic.replace('Describe a ', '').replace('Describe an ', '').replace(/\.$/, '')} (Cue Card)</span>
          <span><b>Part 3:</b> ${p3Topic}</span>
        </div>
        <div class="chips">
          <span>⏱ 11–14 min</span>
          <span>🎙 3 Parts</span>
          <span>🤖 3D AI Examiner</span>
        </div>
        <div class="sp-card-actions">
          <a href="/speaking-test?id=${i}" class="btn btn-red">Take Test →</a>
          <div class="practice-drop-wrap">
            <button type="button" class="btn btn-outline" aria-haspopup="true" aria-expanded="false" aria-controls="pop-sp-${i}">Practice <span class="caret">▾</span></button>
            <div class="part-popover" id="pop-sp-${i}" role="menu">
              <a role="menuitem" href="/speaking-test?id=${i}&part=1">Part 1 <span>Interview</span></a>
              <a role="menuitem" href="/speaking-test?id=${i}&part=2">Part 2 <span>Cue Card</span></a>
              <a role="menuitem" href="/speaking-test?id=${i}&part=3">Part 3 <span>Discussion</span></a>
            </div>
          </div>
        </div>
      </div>
`;
}

if (!spHtml.includes('Speaking Mock Test 6')) {
  const test5CloseMarker = '<!-- Test 5 -->';
  const test5Idx = spHtml.indexOf(test5CloseMarker);
  const cardGridCloseIdx = spHtml.indexOf('</div>\n  </div>\n</section>\n\n<section id="format">', test5Idx);

  if (cardGridCloseIdx !== -1) {
    spHtml = spHtml.substring(0, cardGridCloseIdx) + newCardsHtml + '\n    ' + spHtml.substring(cardGridCloseIdx);
    fs.writeFileSync(spHtmlPath, spHtml, 'utf8');
    console.log('Successfully appended tests 6-20 cards to FrontPage/Frontend/speaking.html');
  } else {
    console.warn('Could not find card grid close marker in speaking.html');
  }
} else {
  console.log('speaking.html already has Test 6+');
}

// 3. Update FrontPage/Frontend/Practice-hub.html
const hubPath = '../FrontPage/Frontend/Practice-hub.html';
let hubHtml = fs.readFileSync(hubPath, 'utf8');

hubHtml = hubHtml.replace(
  "out.speaking={'Part-1':norm(5),'Part-2':norm(5),'Part-3':norm(5)};",
  "out.speaking={'Part-1':norm(20),'Part-2':norm(20),'Part-3':norm(20)};"
);

hubHtml = hubHtml.replace(
  "pick any of the 5 tests (Set 1 to 5)",
  "pick any of the 20 tests (Set 1 to 20)"
);

fs.writeFileSync(hubPath, hubHtml, 'utf8');
console.log('Successfully updated Practice-hub.html to 20 speaking tests!');
