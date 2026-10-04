async function addTestQuestion() {
  const mockNumber = "Premium-UKA-FINAL-9";
  const plan = "Premium";
  // আমি এখান থেকে অবজেক্ট স্ট্রাকচার একদম ক্লিন করে দিয়েছি
  const listening = {
      "questions": [
    {
      "part": 1,
      "group": 11,
      "type": "note-completion",
      "id": [1, 2, 3, 4, 5],
      "heading": "Working at Milo’s Restaurants",
      "subheadings": ["Benefits", "Person specification"],
      "paragraphs": [
        [
          "• [blank] provided for all staff",
          "• [blank] during weekdays at all Milo’s Restaurants",
          "• [blank] provided after midnight"
        ],
        [
          "• must be prepared to work well in a team",
          "• must care about maintaining a high standard of [blank]",
          "• must have a qualification in [blank]"
        ]
      ]
    },
    {
      "part": 1,
      "group": 12,
      "type": "table-completion",
      "id": [6, 7, 8, 9, 10],
      "table-structure": [4, 4,4],
      "cells": [
        ["<strong>Location</strong>", "<strong>Job title</strong>", "<strong>Responsibilities include</strong>", "<strong>Pay and conditions</strong>"],
        ["[blank] Street", "Breakfast supervisor", "Checking portions, etc. are correct. Making sure [blank] is clean", "Starting salary £[blank] per hour. Start work at 5.30 a.m."],
        ["City Road", "Junior chef", "Supporting senior chefs. Maintaining stock and organising [blank]", "Annual salary £23,000. No work on a [blank] once a month"]
      ]
    },
    {
      "part": 2,
      "group": 21,
      "type": "mcq-updated",
      "id": [11, 12, 13, 14],
      "heading": "Oniton Hall",
      "questions": [
        "Many past owners made changes to",
        "Sir Edward Downes built Oniton Hall because he wanted",
        "Visitors can learn about the work of servants in the past from",
        "What is new for children at Onion Hall?"
      ],
      "options": [
        ["the gardens.", "the house.", "the farm."],
        ["a place for discussing politics.", "a place to display his wealth.", "a place for artists and writers."],
        ["audio guides.", "photographs.", "people in costume."],
        ["clothes for dressing up", "mini tractors", "the adventure playground"]
      ]
    },
    {
      "part": 2,
      "group": 22,
      "type": "feature-matching",
      "id": [15, 16, 17, 18, 19, 20],
      "options": [
        "shopping",
        "watching cows being milked",
        "seeing old farming equipment",
        "eating and drinking",
        "starting a trip",
        "seeing rare breeds of animals",
        "helping to look after animals",
        "using farming tools"
      ],
      "features": ["dairy", "large barn", "small barn", "stables", "shed", "parkland"]
    },
    {
      "part": 3,
      "group": 31,
      "type": "mcq-updated",
      "id": [21, 22, 23, 24],
      "heading": "Woolly mammoths on St Paul’s Island",
      "questions": [
        "How will Rosie and Martin introduce their presentation?",
        "What was surprising about the mammoth tooth found by Russell Graham?",
        "The students will use an animated diagram to demonstrate how the mammoths",
        "According to Martin, what is unusual about the date of the mammoths’ extinction on the island?"
      ],
      "options": [
        ["with a drawing of woolly mammoths in their natural habit", "with a timeline showing when woolly mammoths lived", "with a video clip about woolly mammoths"],
        ["It was still embedded in the mammoth’s jawbone.", "It was from an unknown species of mammoth.", "It was not as old as mammoth remains from elsewhere."],
        ["became isolated on the island.", "spread from the island to other areas.", "coexisted with other animals on the island."],
        ["how exact it is", "how early it is", "how it was established"]
      ]
    },
    {
      "part": 3,
      "group": 32,
      "type": "feature-matching",
      "id": [25, 26, 27, 28, 29, 30],
      "options": [
        "make it more interactive",
        "reduce visual input",
        "add personal opinions",
        "contact one of the researchers",
        "make detailed notes",
        "find information online",
        "check timing",
        "organise the content more clearly"
      ],
      "features": [
        "Introduction",
        "Discovery of the mammoth tooth",
        "Initial questions asked by the researchers",
        "Further research carried out on the island",
        "Findings and possible explanations",
        "Relevance to the present day"
      ]
    },
    {
      "part": 4,
      "group": 41,
      "id": [31, 32, 33, 34, 35, 36, 37, 38, 39, 40],
      "heading": "Tardigrades",
      "subheadings": ["Physical appearance", "Habitat", "Cryptobiosis", "Feeding", "Conservation status"],
      "paragraphs": [
        [
          "– more than 1,000 species, 0.05–1.2 millimetres long",
          "– also known as water ‘bears’ (due to how they [blank]) and ‘moss piglets’"
        ],
        [
          "– a [blank] round body and four pairs of legs",
          "– claws or [blank] for gripping",
          "– absence of respiratory organs",
          "– body filled with a liquid that carries both [blank] and blood",
          "– mouth shaped like a [blank] with teeth called stylets"
        ],
        [
          "– often found at the bottom of a lake or on plants",
          "– very resilient and can exist in very low or high [blank]"
        ],
        [
          "– In dry conditions, they roll into a ball called a ‘tun’.",
          "– They stay alive with a much lower metabolism than usual.",
          "– A type of [blank] ensures their DNA is not damaged.",
          "– Research is underway to find out how many days they can stay alive in [blank]"
        ],
        [
          "– consume liquids, e.g., those found in moss or [blank]",
          "– may eat other tardigrades",
          "– They are not considered to be [blank]."
        ]
     
      ]
    }
  ],
  "instructions": [
    { "group": 11, "instruction": "Complete the notes below. Write <strong>ONE WORD ONLY</strong> for each answer." },
    { "group": 12, "instruction": "Complete the table below. Write <strong>ONE WORD AND/OR A NUMBER</strong> for each answer." },
    { "group": 21, "instruction": "Choose the correct letter, <strong>A, B or C</strong>." },
    { "group": 22, "instruction": "Choose <strong>SIX</strong> answers from the box and write the correct letter, A-H, next to Questions." },
    { "group": 31, "instruction": "Choose the correct letter, <strong>A, B or C</strong>." },
    { "group": 32, "instruction": "Choose <strong>SIX</strong> answers from the box and write the correct letter, A-H, next to Questions." },
    { "group": 41, "instruction": "Complete the notes below. Write <strong>ONE WORD ONLY</strong> for each answer." }
  ],
  "answers": {
    "1": ["training"],
    "2": ["discount"],
    "3": ["taxi"],
    "4": ["service"],
    "5": ["English"],
    "6": ["Wivenhoe"],
    "7": ["equipment"],
    "8": ["9.75"],
    "9": ["deliveries"],
    "10": ["Sunday"],
    "11": ["2"],
    "12": ["3"],
    "13": ["3"],
    "14": ["2"],
    "15": ["eating and drinking"],
    "16": ["seeing old farming equipment"],
    "17": ["helping to look after animals"],
    "18": ["shopping"],
    "19": ["starting a trip"],
    "20": ["seeing rare breeds of animals"],
    "21": ["2"],
    "22": ["3"],
    "23": ["1"],
    "24": ["1"],
    "25": ["make detailed notes"],
    "26": ["contact one of the researchers"],
    "27": ["make it more interactive"],
    "28": ["organise the content more clearly"],
    "29": ["check timing"],
    "30": ["add personal opinions"],
    "31": ["move"],
    "32": ["short"],
    "33": ["discs", "disks"],
    "34": ["oxygen"],
    "35": ["tube"],
    "36": ["temperatures"],
    "37": ["protein"],
    "38": ["space"],
    "39": ["seaweed"],
    "40": ["endangered"]
  }
};

  const reading = {
  "passages": [
    {
      "part": 1,
      "title": "New Agriculture in Oregon, US",
      "paragraphs": ["A", "B", "C", "D", "E", "F", "G", "H", "I"],
      "paragraph-content": [
        ["Onion growers in eastern Oregon are adopting a system that saves water and keeps topsoil in place while producing the highest quality “super-colossal” onions. Pear growers in southern Oregon have reduced their use of some of the most toxic pesticides by up to two-thirds, and are still producing top-quality pear. Range managers throughout the state have controlled the poisonous weed tansy ragwort with insect predators and saved the Oregon livestock industry up to $4.8 million a year."],
        ["These are some of the results Oregon growers have achieved in collaboration with Oregon State University (OSU) researchers as they test new farming methods including integrated pest management (IPM). Nationwide, however, IPM has not delivered results comparable to those in Oregon. A recent U.S General Accounting Office (GAO) report indicates that while integrated pest management can result in dramatically reduced pesticide use, the federal government has been lacking in effectively promoting that goal and implementing IPM. Farmers also blame the government for not making the new options of pest management attractive. “Wholesale changes in the way that farmers control the pests on their farms is an expensive business.” Tony Brown, of the National Farmers Association, says. “If the farmers are given tax breaks to offset the expenditure, then they would willingly accept the new practices.” The report goes on to note that even though the use of the riskiest pesticides has declined nationwide, they still make up more than 40 percent of all pesticides used today; and national pesticide use has risen by 40 million kilograms since 1992. “Our food supply remains the safest and highest quality on Earth but we continue to overdose our farmland with powerful and toxic pesticides and to under-use the safe and effective alternatives,” charged Patrick Leahy, who commissioned the report. Green action groups disagree about the safety issue. “There is no way that habitual consumption of foodstuffs grown using toxic chemical of the nature found on today’s farms can be healthy for consumers,” noted Bill Bowler, spokesman for Green Action, one of many lobbyists interested in this issue."],
        ["The GAO report singles out Oregon’s apple and pear producers who have used the new IPM techniques with growing success. Although Oregon is clearly ahead of the nation, scientists at OSU are taking the Government Accounting Office criticisms seriously. “We must continue to develop effective alternative practices that will reduce environmental hazards and produce high-quality products,” said Paul Jepson, a professor of entomology at OSU and new director of"],
        ["OSU’s Integrated Plant Protection Centre (IPPC). The IPPC brings together scientists from OSU’s Agricultural Experiment Station, OSU Extension service, the U.S. Department of Agriculture and Oregon farmers to help develop agricultural systems that will save water and soil, and reduce pesticides. In response to the GAO report, the Centre is putting even more emphasis on integrating research and farming practices to improve Oregon agriculture environmentally and economically."],
        ["“The GAO report criticizes agencies for not clearly communicating the goals of IPM,” said Jepson. “Our challenge is to greatly improve the communication to and from growers, to learn what works and what doesn’t. the work coming from OSU researchers must be adopted in the field and not simply languish in scientific journals.”"],
        ["In Oregon, growers and scientists are working together to instigate new practices. For example, a few years ago scientists at OSU’s Malheur Experiment Station began testing a new drip irrigation system to replace old ditches that wasted water and washed soil and fertilizer into streams. The new system cut water and fertilizer use by half kept topsoil in place and protected water quality."],
        ["In addition, the new system produced crops of very large onions, rated “super-colossal” and highly valued by the restaurant industry and food processors. Art Pimms, one of the researchers at Malheur comments: “Growers are finding that when they adopt more environmentally benign practices, they can have excellent results. The new practices benefit the environment and give the growers their success.”"],
        ["OSU researcher in Malheur next tested straw mulch and found that it successfully held soil in place and kept the ground moist with less irrigation. In addition, and unexpectedly, the scientists found that the mulched soil created a home for beneficial beetles and spiders that prey on onion thrips – a notorious pest in commercial onion fields – a discovery that could reduce the need for pesticides. “I would never have believed that we could replace the artificial pest controls that we had before and still keep our good results,” commented Steve Black, a commercial onion farmer in Oregon, “but instead we have actually surpassed expectations.”"],
        ["OSU researchers throughout the state have been working to reduce dependence on broad-spectrum chemical spays that are toxic to many kinds of organisms, including humans. “Consumers are rightly putting more and more pressure on the industry to change its reliance on chemical pesticides, but they still want a picture-perfect product,” said Rick Hilton, an entomologist at OSU’s Southern Oregon Research and Extension Centre, where researches help pear growers reduce the need for highly toxic pesticides. Picture perfect pears are an important product in Oregon and traditionally they have required lots of chemicals. In recent years, the industry has faced stiff competition from overseas producers, so any new methods that growers adopt must make sense economically as well as environmentally. Hilton is testing a growth regulator that interferes with the molting of codling moth larvae. Another study used pheromone dispensers to disrupt codling moth mating. These and other methods of integrated pest management have allowed pear growers to reduce their use of organophosphates by two-thirds and reduce all other synthetic pesticides by even more and still produce top-quality pears. These and other studies around the state are part of the effort of the IPPC to find alternative farming practices that benefit both the economy and the environment."]
      ]
    },
    {
      "part": 2,
      "title": "WHAT COOKBOOKS REALLY TEACH US",
      "paragraphs": ["A", "B", "C", "D", "E", "F", "G", "H", "I"],
      "paragraph-content": [
        ["Shelves bend under their weight of cookery books. Even a medium-sized bookshop contains many more recipes than one person could hope to cook in a lifetime. Although the recipes in one book are often similar to those in another, their presentation varies wildly, from an array of vegetarian cookbooks to instructions on cooking the food that historical figures might have eaten. The reason for this abundance is that cookbooks promise to bring about a kind of domestic transformation for the user. The daily routine can be put to one side and they liberate the user, if only temporarily. To follow their instructions is to turn a task which has to be performed every day into an engaging, romantic process. Cookbooks also provide an opportunity to delve into distant cultures without having to turn up at an airport to get there."],
        ["The first Western cookbook appeared just over 1,600 years ago. De re coquinara (it means concerning cookery’) is attributed to a Roman gourmet named Apicius. It is probably a compilation of Roman and Greek recipes, some or all of them drawn from manuscripts that were later lost. The editor was sloppy, allowing several duplicated recipes to sneak in. Yet Apicius’s book set the tone of cookery advice in Europe for more than a thousand years. As a cookbook, it is unsatisfactory with very basic instructions. Joseph Vehling, a chef who translated Apicius in the 1930s, suggested the author had been obscure on purpose, in case his secrets leaked out."],
        ["But a more likely reason is that Apicius’s recipes were written by and for professional cooks, who could follow their shorthand. This situation continued for hundreds of years. There was no order to cookbooks: a cake recipe might be followed by a mutton one. But then, they were not written for careful study. Before the 19th century, few educated people cooked for themselves."],
        ["The wealthiest employed literate chefs; others presumably read recipes to their servants. Such cooks would have been capable of creating dishes from the vaguest of instructions. The invention of printing might have been expected to lead to greater clarity but at first, the reverse was true. As words acquired commercial value, plagiarism exploded. Recipes were distorted through reproduction. A recipe for boiled capon in The Good Huswives Jewell, printed in 1596, advised the cook to add three or four dates. By 1653, when the recipe was given by a different author in A Book of Fruits & Flowers, the cook was told to set the dish aside for three or four days."],
        ["The dominant theme in 16th and 17th-century cookbooks was ordered. Books combined recipes and household advice, on the assumption that a well-made dish, a well-ordered larder and well-disciplined children were equally important. Cookbooks thus became a symbol of dependability in chaotic times. They hardly seem to have been affected by the English civil war or the revolutions in America and France."],
        ["In the 1850s Isabella Beeton published The Book of Household Management. Like earlier cookery writers she plagiarized freely, lifting not just recipes but philosophical observations from other books. If Beeton’s recipes were not wholly new, though, the way in which she presented them certainly was. She explains when she chief ingredients are most likely to be in season, how long the dish will take to prepare and even how much it is likely to cost. Beetons recipes were well suited to her times. Two centuries earlier, an understanding of rural ways had been so widespread that one writer could advise cooks to heat water until it was a little hotter than milk comes from a cow. By the 1850s Britain was industrialising. The growing urban middle class needed details, and Beeton provided them in full."],
        ["In France, cookbooks were fast becoming even more systematic. Compared with Britain, France had produced few books written for the ordinary householder by the end of the 19th century. The most celebrated French cookbooks were written by superstar chefs who had a clear sense of codifying a unified approach to sophisticated French cooking. The 5,000 recipes in Auguste Escoffier’s Le Guide Culinaire (The Culinary Guide), published in 1902, might as well have been written in stone, given the book’s reputation among French chefs, many of whom still consider it the definitive reference book."],
        ["What Escoffier did for French cooking, Fannie Farmer did for American home cooking. She not only synthesised American cuisine; she elevated it to the status of science. ‘Progress in civilisation has been accompanied by progress in cookery,’ she breezily announced in The Boston Cooking-School Cook Book, before launching into a collection of recipes that sometimes resembles a book of chemistry experiments. She was occasionally over-fussy. She explained that currants should be picked between June 28th and July 3rd, but not when it is raining. But in the main, her book is reassuringly authoritative. Its recipes are short, with no unnecessary chat and no unnecessary spices."],
        ["In 1950 Mediterranean Food by Elizabeth David launched a revolution in cooking advice in Britain. In some ways, Mediterranean Food recalled even older cookbooks but the smells and noises that filled David’s books were not a mere decoration for her recipes. They were the point of her books. When she began to write, many ingredients were not widely available or affordable. She understood this, acknowledging in a letter edition of one of her books that even if people could not very often make the dishes here described, it was stimulating to think about them. David’s books were not so much cooking manuals as guides to the kind of food people might well wish to eat."]
      ]
    },
    {
      "part": 3,
      "title": "Learning lessons from the past",
      "paragraphs": ["A", "B", "C", "D", "E", "F"],
      "paragraph-content": [
        ["Many past societies collapsed or vanished, leaving behind monumental ruins such as those that the poet Shelley imagined in his sonnet, Ozymandias. By collapse, I mean a drastic decrease in human population size and/or political/economic/social complexity, over a considerable, for an extended time. By those standards, most people would consider the following past societies to have been famous victims of full-fledged collapses rather than of just minor declines: the Anasazi and Cahokia within the boundaries of the modem US, the Maya cities in Central American, Moche and Tiwanaku societies in South America, Norse Greenland, Mycenean Greece and Minoan Crete in Europe, Great Zimbabwe in Africa, Angkor Wat and the Harappan Indus Valley cities in Asia, and Easter Island in the Pacific Ocean."],
        ["The monumental ruins left behind by those past societies hold a fascination for all of us. We marvel at them when as children we first learn of them through pictures. When we grow up, many of us plan vacations in order to experience them at first hand. We feel drawn to their often spectacular and haunting beauty, and also to the mysteries that they pose. The scales of the ruins testify to the former wealth and power of their builders. Yet these builders vanished, abandoning the great structures that they had created at such effort. How could a society that was once so mighty end up collapsing?"],
        ["It has long been suspected that many of those mysterious abandonments were at least partly triggered by ecological problems: people inadvertently destroying the environmental resources on which their societies depended. This suspicion of unintended ecological suicide (ecocide) has been confirmed by discoveries made in recent decades by archaeologists, climatologists, historians, palaeontologists, and palynologists (pollen scientists). The processes through which past societies have undermined themselves by damaging their environments fall into eight categories, whose relative importance differs from case to case: deforestation and habitat destruction, soil problems, water management problems, overhunting, overfishing, effects of introduced species on native species, human population growth, and increased impact of people."],
        ["Those past collapses tended to follow somewhat similar courses constituting variations on a theme. Writers find it tempting to draw analogies between the course of human societies and the course of individual human lives – to talk of a society’s birth, growth, peak, old age and eventual death. But that metaphor proves erroneous for many past societies: they declined rapidly after reaching peak numbers and power, and those rapid declines must have come as a surprise and shock to their citizens. Obviously, too, this trajectory is not one that all past societies followed unvaryingly to completion: different societies collapsed to different degrees and in somewhat different ways, while many societies did not collapse at all."],
        ["Today many people feel that environmental problems overshadow all the other threats to global civilisation. These environmental problems include the same eight that undermined past societies, plus four new ones: human-caused climate change, the build-up of toxic chemicals in the environment, energy shortages, and full human utilisation of the Earth’s photosynthetic capacity. But the seriousness of these current environmental problems is vigorously debated. Are the risks greatly exaggerated, or conversely are they underestimated? Will modem technology solve our problems, or is it creating new problems faster than it solves old ones? When we deplete one resource (eg wood, oil, or ocean fish), can we count on being able to substitute some new resource (eg plastics, wind and solar energy, or farmed fish)? Isn’t the rate of human population growth declining, such that we’re already on course for the world’s population to level off at home manageable number of people?"],
        ["Questions like this illustrate why those famous collapses of past civilisations have taken on more meaning than just that of a romantic mystery. Perhaps there are some practical lessons that we could learn from all those past collapses. But there are also differences between the modem world and its problems, and those past societies and their problems. We shouldn’t be so naive as to think that the study of the past will yield simple solutions, directly transferable to our societies today. We differ from past societies in some respects that put us at lower risk than them; some of those respects often mentioned include our powerful technology (ie its beneficial effects), globalisation, modem medicine, and greater knowledge of past societies and of distant modem societies. We also differ from past societies in some respects that put us at greater risk than them: again, our potent technology (ie its unintended destructive effects), globalisation (such that now a problem in one part of the world affects all the rest), the dependence of millions of us on modern medicine for our survival, and our much larger human population. Perhaps we can still learn from the past, but only if we think carefully about its lessons."]
      ]
    }
  ],

  "questions": [
    {
      "part": 1,
      "group": 11,
      "type": "matching-table-container",
      "id": [1, 2, 3, 4, 5, 6, 7, 8],
      "paragraphs": [
        "Tony Brown",
        "Patrick Leahy",
        "Bill Bowler",
        "Paul Jepson",
        "Art Pimms",
        "Steve Black",
        "Rick Hilton"
      ],
      "information": [
        "There is a double-advantage to the new techniques.",
        "The work on developing these alternative techniques is not finished.",
        "Eating food that has had chemicals used in its production is dangerous to our health.",
        "Changing current farming methods into a new one is not a cheap process.",
        "Results have exceeded the anticipated goal.",
        "The research done should be translated into practical projects.",
        "The U.S. produces the best food in the world nowadays.",
        "Expectations of end-users of agricultural products affect the products."
      ]
    },
    {
      "part": 1,
      "group": 12,
      "type": "Y/N/NG",
      "id": [9, 10, 11, 12, 13],
      "questions": [
        "Integrated Pest Management has generally been regarded as a success in across the US.",
        "Oregon farmers of apples and pears have been promoted as successful examples of Integrated Pest Management.",
        "The IPPC uses scientists from different organisations globally",
        "Straw mulch experiments produced unplanned benefits.",
        "The apple industry is now facing a lot of competition from abroad."
      ]
    },
    {
      "part": 2,
      "group": 21,
      "type": "summary-completion",
      "id": [14, 15, 16],
      "title": "Why are there so many cookery books?",
      "summary": [
        "There are a great number more cookery books published than is really necessary and it is their [blank] which makes them differ from each other. There are such large numbers because they offer people an escape from their [blank] and some give the user the chance to inform themselves about other [blank] ."
      ]
    },
    {
      "part": 2,
      "group": 22,
      "type": "matching-table-container",
      "id": [17, 18, 19, 20, 21],
      "paragraphs": ["A", "B", "C", "D", "E", "F","G", "H", "I"],
      "information": [
        "cookery books providing a sense of stability during periods of unrest",
        "details in recipes being altered as they were passed on",
        "knowledge which was in danger of disappearing",
        "the negative effect on cookery books of a new development",
        "a period when there was no need for cookery books to be precise"
      ]
    },
    {
      "part": 2,
      "group": 23,
      "type": "matching-table-container",
      "id": [22, 23, 24, 25, 26],
      "paragraphs": [
        "De re coquinara",
        "The Book of Household Management",
        "Le Guide Culinaire",
        "The Boston Cooking-School Cook Book",
        "Mediterranean Food"
      ],
      "information": [
        "Its recipes were easy to follow despite the writer’s attention to detail.",
        "Its writer may have deliberately avoided passing on details.",
        "It appealed to ambitious ideas people have about cooking.",
        "Its writer used ideas from other books but added additional related information.",
        "It put into print ideas which are still respected today."
      ]
    },
    {
      "part": 3,
      "group": 31,
      "type": "mcq-one-choice",
      "id": [27, 28, 29],
      "questions": [
        "When the writer describes the impact of monumental ruins today, he emphasizes",
        "Recent findings concerning vanished civilisations",
        "What does the writer say about ways in which former societies collapsed?"
      ],
      "options": [
        ["the income they generate from tourism.", "the area of land they occupy.", "their archaeological value.", "their romantic appeal."],
        ["have overturned long-held beliefs.", "caused controversy amongst scientists.", "come from a variety of disciplines.", "identified one main cause of environmental damage."],
        ["The pace of decline was usually similar.", "The likelihood of collapse would have been foreseeable.", "Deterioration invariably led to total collapse.", "Individual citizens could sometimes influence the course of events."]
      ]
    },
    {
      "part": 3,
      "group": 32,
      "type": "Y/N/NG",
      "id": [30, 31, 32, 33, 34],
      "questions": [
        "It is widely believed that environmental problems represent the main danger faced by the modern world.",
        "The accumulation of poisonous substances is a relatively modern problem.",
        "There is general agreement that the threats posed by environmental problems are very serious.",
        "Some past societies resembled present-day societies more closely than others.",
        "We should be careful when drawing comparisons between past and present."
      ]
    },
    {
      "part": 3,
      "group": 33,
      "type": "feature-matching-drag-drop",
      "id": [35, 36, 37, 38, 39],
      "options":[
        "is not necessarily valid.",
        "provides grounds for an optimistic outlook.",
        "exists in the form of physical structures.",
        "is potentially both positive and negative.",
        "will not provide direct solutions for present problems.",
        "is greater now than in the past."
      ],
      "features": [
        "Evidence of the greatness of some former civilisations",
        "The parallel between an individual’s life and the life of a society",
        "The number of environmental problems that societies face",
        "The power of technology",
        "A consideration of historical events and trends"
       
      ]
    },
    {
      "part": 3,
      "group": 34,
      "type": "mcq-one-choice",
      "id": [40],
      "questions": [
        "What is the main argument of Reading Passage 3?"
      ],
      "options": [
        [
          "There are differences as well as similarities between past and present societies.",
          "More should be done to preserve the physical remains of earlies civilisations.",
          "Some historical accounts of great civilisations are inaccurate.",
          "Modern societies are dependent on each other for their continuing survival."
        ]
      ]
    }
  ],
  "instructions": [
    {
      "group": 11,
      "instruction": "Use the information in the passage to match the people (listed A-G) with opinions or deeds below. Write the appropriate letters A-G in boxes 1-8 on your answer sheet. NB: You may use any letter more than once."
    },
    {
      "group": 12,
      "instruction": "Do the following statements agree with the information given in Reading Passage 1? Write YES, NO or NOT GIVEN in boxes 9-13."
    },
    {
      "group": 21,
      "instruction": "Complete the summary below. Choose NO MORE THAN TWO WORDS from the passage for each answer."
    },
    {
      "group": 22,
      "instruction": "Reading Passage has nine paragraphs, A-I. Which paragraph contains the following information? NB: You may use any letter more than once."
    },
    {
      "group": 23,
      "instruction": "Match each statement with the correct book (A-E)."
    },
    {
      "group": 31,
      "instruction": "Choose the correct letter A, B, C or D."
    },
    {
      "group": 32,
      "instruction": "Do the following statements agree with the views of the writer in Reading Passage? Write YES, NO or NOT GIVEN."
    },
    {
      "group": 33,
      "instruction": "Complete each sentence with the correct ending, A-F, below."
    },
    {
      "group": 34,
      "instruction": "Choose the correct letter A, B, C or D."
    }
  ],
  "answers": {
   "1": ["art pimms"],
    "2": ["paul jepson"],
    "3": ["bill bowler"],
    "4": ["tony brown"],
    "5": ["steve black"],
    "6": ["paul jepson"],
    "7": ["patrick leahy"],
    "8": ["rick hilton"],
    "9": ["no"],
    "10": ["yes"],
    "11": ["no"],
    "12": ["yes"],
    "13": ["not given"],
    "14": ["presentation"],
    "15": ["daily routine", "routine"],
    "16": ["cultures"],
    "17": ["e"],
    "18": ["d"],
    "19": ["f"],
    "20": ["d"],
    "21": ["c"],
    "22": ["the boston cooking-school cook book"],
    "23": ["de re coquinara"],
    "24": ["mediterranean food"],
    "25": ["the boston cooking-school cook book"],
    "26": ["le guide culinaire"],
    "27": ["4"],
    "28": ["3"],
    "29": ["1"],
    "30": ["yes"],
    "31": ["yes"],
    "32": ["no"],
    "33": ["not given"],
    "34": ["yes"],
    "35": ["exists in the form of physical structures."],
    "36": ["is not necessarily valid."],
    "37": ["is greater now than in the past."],
    "38": ["is potentially both positive and negative."],
    "39": ["will not provide direct solutions for present problems."],
    "40": ["1"]
  }
};

 const writing = {
      "questions": [
{
      "part": 1,
      "question": "The bar chart shows the percentage of the total world population in 4 countries in 1950 and 2002, and projections for 2050. <br><br> Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
      "image": ["Image/premium-writing-9.jpg"]
    },
    {
      "part": 2,
      "question": "Nowadays a large amount of advertising aimed at children should be banned because of the negative effects. <br><br> To what extent do you agree or disagree? <br><br> Give reasons for your answer and include any relevant examples from your own knowledge or experience."
    }
]
      
    }}