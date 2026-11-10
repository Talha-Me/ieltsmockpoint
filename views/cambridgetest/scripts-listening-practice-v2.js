/**
 * Cambridge IELTS Listening Practice V2
 * Modern, Component-Driven Renderer matching official CD-IELTS design
 */

(function () {
  "use strict";

  // URL Parameters
  const urlParams = new URLSearchParams(window.location.search);
  const bookParam = Number(urlParams.get("book") || 21);
  const testParam = Number(urlParams.get("test") || 1);
  const partParam = urlParams.get("part") ? Number(urlParams.get("part")) : null;
  const sectionParam = urlParams.get("section") || urlParams.get("group") || urlParams.get("q") || null;

  // Practice Modes: 'full', 'part', 'section'
  let practiceMode = "full";
  let targetPart = 1;
  let targetGroup = null;
  let targetQIds = [];
  let sectionStartTime = 0;
  let sectionEndTime = 0;

  // Calibrated Audio Start & End Timestamps (in seconds) for Section Practice
  const sectionAudioRanges = {
    "21_1": {
      "1-6":   { start: 146, end: 310 },
      "7-10":  { start: 317, end: 400 },
      "11-16": { start: 100, end: 305 },
      "17-20": { start: 313, end: 410 },
      "21-22": { start: 39,  end: 148 },
      "23-24": { start: 151, end: 238 },
      "25-30": { start: 241, end: 360 },
      "31-40": { start: 57,  end: 390 }
    },
    "2026_1": {
      "1-6":   { start: 78,   end: 281 },  // Part 1: Note Completion (Itinerary - starts at 1:18 where instructions finish & actual questions begin)
      "7-10":  { start: 280,  end: 395 },  // Part 1: Table Completion (Demographics - prompt starts at 4:40)
      "1-10":  { start: 0,    end: 395 },  // Part 1 Full (0:00 to 6:35)
      "11-15": { start: 412,  end: 576 },  // Part 2: Multiple Choice (EasyTravel Services - prompt starts at 6:52)
      "16-20": { start: 576,  end: 705 },  // Part 2: Office Floor Plan Map (prompt starts at 9:36)
      "21-24": { start: 720,  end: 880 },  // Part 3: Timetable Matching (prompt starts at 12:00)
      "25-30": { start: 880,  end: 1045 }, // Part 3: Diagram Labels Completion (prompt starts at 14:40)
      "31-34": { start: 1055, end: 1167 }, // Part 4: Sentence Completion (prompt starts at 17:35)
      "35-40": { start: 1167, end: 1342 }, // Part 4: Lecture Note Completion (prompt starts at 19:27)
      "31-40": { start: 1045, end: 1342 }  // Part 4 Full (17:25 to 22:22)
    },
    "2026_2": {
      "1-5":   { start: 30,   end: 240 },  // Part 1: Sentence Completion (Diet Plan)
      "6-10":  { start: 240,  end: 388 },  // Part 1: Matching Snack Choices
      "1-10":  { start: 0,    end: 388 },  // Part 1 Full
      "11-16": { start: 388,  end: 570 },  // Part 2: Table Completion (Stanfield Childcare)
      "17-20": { start: 570,  end: 701 },  // Part 2: Matching Childcare Workers
      "11-20": { start: 388,  end: 701 },  // Part 2 Full
      "21-25": { start: 701,  end: 900 },  // Part 3: Flowchart Completion (Essay Foundation)
      "26-30": { start: 900,  end: 1054 }, // Part 3: Summary Completion (Essay Standards)
      "21-30": { start: 701,  end: 1054 }, // Part 3 Full
      "31-33": { start: 1054, end: 1270 }, // Part 4: Multiple Choice (Geocentrism & Heliocentrism)
      "34-40": { start: 1270, end: 1428 }, // Part 4: Notes Completion (Copernicus & Science)
      "31-40": { start: 1054, end: 1428 }  // Part 4 Full
    },
    "2026_3": {
      "1-7":   { start: 30,   end: 300 },  // Part 1: Form Completion (Client Registration)
      "8-10":  { start: 300,  end: 435 },  // Part 1: Multiple Choice (Valued Qualities)
      "1-10":  { start: 0,    end: 435 },  // Part 1 Full
      "11-15": { start: 435,  end: 600 },  // Part 2: Short Answer (Fitness Centre Consultation)
      "16-20": { start: 600,  end: 763 },  // Part 2: Matching Facilities
      "11-20": { start: 435,  end: 763 },  // Part 2 Full
      "21-25": { start: 763,  end: 935 },  // Part 3: Multiple Choice (Faculty Coordinator)
      "26-30": { start: 935,  end: 1120 }, // Part 3: Table Completion (Candidates Evaluation)
      "21-30": { start: 763,  end: 1120 }, // Part 3 Full
      "31-33": { start: 1120, end: 1300 }, // Part 4: Multiple Choice (Speleology & Caves)
      "34-40": { start: 1300, end: 1530 }, // Part 4: Table & Notes Completion (Cave Formation)
      "31-40": { start: 1120, end: 1530 }  // Part 4 Full
    },
    "2026_4": {
      "1-5":   { start: 104,  end: 248 },  // Part 1: Form Completion (Survey Form - prompt at 104s)
      "6-10":  { start: 262,  end: 395 },  // Part 1: Sentence Completion (Exercise Summary - prompt at 262s)
      "1-10":  { start: 0,    end: 395 },  // Part 1 Full
      "11-16": { start: 420,  end: 600 },  // Part 2: Matching / Floor Plan (Section 2 begins at 420s)
      "17-20": { start: 601,  end: 765 },  // Part 2: Timetable Matching (prompt at 601s)
      "11-20": { start: 418,  end: 765 },  // Part 2 Full
      "21-24": { start: 784,  end: 935 },  // Part 3: Sentence Completion (Section 3 begins at 784s)
      "25-30": { start: 936,  end: 1118 }, // Part 3: Table Completion (prompt at 936s)
      "21-30": { start: 782,  end: 1118 }, // Part 3 Full
      "31-35": { start: 1139, end: 1320 }, // Part 4: Note Completion (Section 4 begins at 1139s)
      "36-40": { start: 1321, end: 1475 }, // Part 4: Note Completion (prompt at 1321s)
      "31-40": { start: 1138, end: 1475 }  // Part 4 Full
    },
    "2026_5": {
      "1-5":   { start: 100,  end: 236 },  // Part 1: Note Completion (prompt at 100s)
      "6-10":  { start: 236,  end: 380 },  // Part 1: Multiple Choice (prompt at 236s)
      "1-10":  { start: 0,    end: 380 },  // Part 1 Full
      "11-15": { start: 396,  end: 550 },  // Part 2: Matching (Section 2 begins at 396s)
      "16-20": { start: 552,  end: 693 },  // Part 2: Sentence Completion (prompt at 552s)
      "11-20": { start: 395,  end: 693 },  // Part 2 Full
      "21-26": { start: 707,  end: 878 },  // Part 3: Table Completion (Section 3 begins at 707s)
      "27-30": { start: 878,  end: 1006 }, // Part 3: Matching (prompt at 878s)
      "21-30": { start: 707,  end: 1006 }, // Part 3 Full
      "31-32": { start: 1028, end: 1143 }, // Part 4: Multiple Choice (Section 4 begins at 1028s)
      "33-35": { start: 1143, end: 1245 }, // Part 4: Checkbox Multiple Choice (prompt at 1143s)
      "36-40": { start: 1245, end: 1405 }, // Part 4: Table Completion (prompt at 1245s)
      "31-40": { start: 1028, end: 1405 }  // Part 4 Full
    },
    "2026_6": {
      "1-6":   { start: 68,   end: 194 },
      "7-10":  { start: 208,  end: 342 },
      "1-10":  { start: 0,    end: 358 },
      "11-17": { start: 387,  end: 562 },
      "18-20": { start: 578,  end: 666 },
      "11-20": { start: 358,  end: 687 },
      "21-25": { start: 714,  end: 867 },
      "26-30": { start: 884,  end: 1013 },
      "21-30": { start: 687,  end: 1030 },
      "31-33": { start: 1054, end: 1192 },
      "34-40": { start: 1212, end: 1400 },
      "31-40": { start: 1030, end: 1415 }
    },
    "2026_7": {
      "1-10":  { start: 86,   end: 335 },
      "1-5":   { start: 86,   end: 195 },
      "6-10":  { start: 203,  end: 335 },
      "11-15": { start: 444,  end: 522 },
      "16-20": { start: 553,  end: 715 },
      "11-20": { start: 373,  end: 754 },
      "21-23": { start: 802,  end: 914 },
      "24-30": { start: 944,  end: 1067 },
      "21-30": { start: 754,  end: 1109 },
      "31-40": { start: 1155, end: 1520 }
    },
    "2026_8": {
      "1-10":  { start: 84,   end: 335 },
      "1-5":   { start: 84,   end: 194 },
      "6-10":  { start: 204,  end: 335 },
      "11-14": { start: 372,  end: 517 },
      "15-20": { start: 525,  end: 746 },
      "11-20": { start: 369,  end: 781 },
      "21-23": { start: 778,  end: 901 },
      "24-30": { start: 910,  end: 1099 },
      "21-30": { start: 781,  end: 1132 },
      "31-40": { start: 1132, end: 1468 }
    },
    "2026_9": {
      "1-10":  { start: 65,   end: 330 },
      "1-4":   { start: 65,   end: 154 },
      "5-10":  { start: 154,  end: 330 },
      "11-14": { start: 362,  end: 512 },
      "15-20": { start: 520,  end: 713 },
      "11-20": { start: 363,  end: 746 },
      "21-26": { start: 745,  end: 935 },
      "27-30": { start: 940,  end: 1044 },
      "21-30": { start: 746,  end: 1076 },
      "31-35": { start: 1075, end: 1195 },
      "36-40": { start: 1195, end: 1396 },
      "31-40": { start: 1076, end: 1428 }
    },
    "2026_10": {
      "1-10":  { start: 71,   end: 340 },
      "1-4":   { start: 71,   end: 201 },
      "5-10":  { start: 201,  end: 340 },
      "11-12": { start: 370,  end: 440 },
      "13-16": { start: 440,  end: 585 },
      "17-20": { start: 585,  end: 710 },
      "11-20": { start: 372,  end: 736 },
      "21-30": { start: 736,  end: 1170 },
      "31-40": { start: 1170, end: 1580 }
    },
    "2026_11": {
      "1-6":   { start: 84,   end: 220 },
      "7-10":  { start: 252,  end: 368 },
      "1-10":  { start: 0,    end: 408 },
      "11-14": { start: 454,  end: 565 },
      "15-20": { start: 626,  end: 780 },
      "11-20": { start: 408,  end: 820 },
      "21-25": { start: 868,  end: 1025 },
      "26-30": { start: 1064, end: 1188 },
      "21-30": { start: 820,  end: 1228 },
      "31-40": { start: 1228, end: 1686 }
    },
    "2026_12": {
      "1-6":   { start: 112,  end: 235 },
      "7-10":  { start: 291,  end: 360 },
      "1-10":  { start: 0,    end: 400 },
      "11-16": { start: 445,  end: 560 },
      "17-20": { start: 612,  end: 735 },
      "11-20": { start: 400,  end: 772 },
      "21-23": { start: 805,  end: 885 },
      "24-27": { start: 973,  end: 1040 },
      "28-30": { start: 1045, end: 1145 },
      "24-30": { start: 973,  end: 1145 },
      "21-30": { start: 772,  end: 1185 },
      "31-40": { start: 1185, end: 1592 }
    },
    "2026_13": {
      "1-5":   { start: 86,   end: 220 },
      "6-10":  { start: 254,  end: 395 },
      "1-10":  { start: 0,    end: 410 },
      "11-16": { start: 457,  end: 665 },
      "17-20": { start: 694,  end: 845 },
      "11-20": { start: 410,  end: 884 },
      "21-24": { start: 933,  end: 1125 },
      "25-30": { start: 1159, end: 1280 },
      "21-30": { start: 884,  end: 1317 },
      "31-40": { start: 1317, end: 1695 }
    },
    "2026_14": {
      "1-10":  { start: 85,   end: 378 },
      "11-16": { start: 441,  end: 659 },
      "17-20": { start: 668,  end: 804 },
      "11-20": { start: 411,  end: 824 },
      "21-23": { start: 854,  end: 1007 },
      "24-25": { start: 1016, end: 1119 },
      "26-30": { start: 1118, end: 1268 },
      "21-30": { start: 824,  end: 1304 },
      "31-40": { start: 1334, end: 1735 }
    },
    "2026_15": {
      "1-10":  { start: 77,   end: 348 },
      "11-16": { start: 410,  end: 599 },
      "17-20": { start: 628,  end: 807 },
      "11-20": { start: 380,  end: 843 },
      "21-26": { start: 873,  end: 1077 },
      "27-30": { start: 1093, end: 1243 },
      "21-30": { start: 843,  end: 1244 },
      "31-35": { start: 1274, end: 1471 },
      "36-40": { start: 1471, end: 1629 },
      "31-40": { start: 1274, end: 1629 }
    },
    "2026_16": {
      "1-5":   { start: 58,   end: 184 },
      "6-10":  { start: 198,  end: 309 },
      "1-10":  { start: 58,   end: 309 },
      "11-16": { start: 377,  end: 521 },
      "17-20": { start: 539,  end: 647 },
      "11-20": { start: 346,  end: 683 },
      "21-24": { start: 694,  end: 826 },
      "25-27": { start: 826,  end: 887 },
      "28-30": { start: 906,  end: 994 },
      "21-30": { start: 683,  end: 1029 },
      "31-33": { start: 1038, end: 1301 },
      "34-35": { start: 1301, end: 1330 },
      "36-40": { start: 1329, end: 1461 },
      "31-40": { start: 1038, end: 1461 }
    },
    "2026_17": {
      "1-5":   { start: 76,   end: 217 },
      "6-8":   { start: 231,  end: 281 },
      "9-10":  { start: 281,  end: 327 },
      "1-10":  { start: 76,   end: 327 },
      "11-14": { start: 389,  end: 500 },
      "15-20": { start: 508,  end: 707 },
      "11-20": { start: 358,  end: 743 },
      "21-27": { start: 773,  end: 953 },
      "28-30": { start: 962,  end: 1039 },
      "21-30": { start: 743,  end: 1074 },
      "31-35": { start: 1104, end: 1328 },
      "36-40": { start: 1328, end: 1464 },
      "31-40": { start: 1104, end: 1464 }
    },
    "2026_18": {
      "1-4":   { start: 81,   end: 254 },
      "5-10":  { start: 264,  end: 382 },
      "1-10":  { start: 81,   end: 382 },
      "11-14": { start: 451,  end: 611 },
      "15-16": { start: 636,  end: 656 },
      "17-20": { start: 656,  end: 780 },
      "11-20": { start: 421,  end: 811 },
      "21-26": { start: 841,  end: 1067 },
      "27-30": { start: 1074, end: 1196 },
      "21-30": { start: 811,  end: 1234 },
      "31-38": { start: 1294, end: 1572 },
      "39-40": { start: 1572, end: 1606 },
      "31-40": { start: 1294, end: 1606 }
    },
    "2026_19": {
      "1-10":  { start: 85,   end: 430 },
      "11-15": { start: 497,  end: 699 },
      "16-20": { start: 708,  end: 860 },
      "11-20": { start: 467,  end: 897 },
      "21-25": { start: 927,  end: 1157 },
      "26-30": { start: 1187, end: 1292 },
      "21-30": { start: 897,  end: 1325 },
      "31-40": { start: 1355, end: 1768 }
    },
    "2026_20": {
      "1-4":   { start: 84,   end: 227 },
      "5-10":  { start: 227,  end: 425 },
      "1-10":  { start: 84,   end: 425 },
      "11-14": { start: 492,  end: 712 },
      "15-20": { start: 721,  end: 895 },
      "11-20": { start: 462,  end: 931 },
      "21-26": { start: 961,  end: 1239 },
      "27-30": { start: 1268, end: 1352 },
      "21-30": { start: 931,  end: 1389 },
      "31-36": { start: 1447, end: 1683 },
      "37-40": { start: 1683, end: 1805 },
      "31-40": { start: 1447, end: 1805 }
    }
  };

  const recentRealTestPartRanges = {
    "2026_1": {
      1: { start: 0,    end: 395 },  // Part 1 starts at 0:00 (user specified)
      2: { start: 398,  end: 705 },  // Part 2 starts at 6:38 ("Now turn to section 2. Section 2...")
      3: { start: 708,  end: 1045 }, // Part 3 starts at 11:48 ("Now turn to section 3. Section 3...")
      4: { start: 1045, end: 1342 }  // Part 4 starts at 17:25 ("Now turn to section 4. Section 4...")
    },
    "2026_2": {
      1: { start: 0,    end: 388 },  // Part 1 starts at 0:00 (dialogue at 0:32)
      2: { start: 388,  end: 701 },  // Part 2 starts at 6:28 ("Now turn to section 2. Section 2...")
      3: { start: 701,  end: 1054 }, // Part 3 starts at 11:41 ("Now turn to section 3. Section 3...")
      4: { start: 1054, end: 1428 }  // Part 4 starts at 17:34 ("Now turn to section 4. Section 4...")
    },
    "2026_3": {
      1: { start: 0,    end: 435 },  // Part 1 starts at 0:00 (dialogue at 0:32)
      2: { start: 435,  end: 763 },  // Part 2 starts at 7:15 ("Now turn to section 2. Section 2...")
      3: { start: 763,  end: 1120 }, // Part 3 starts at 12:43 ("Now turn to section 3. Section 3...")
      4: { start: 1120, end: 1530 }  // Part 4 starts at 18:40 ("Now turn to section 4. Section 4...")
    },
    "2026_4": {
      1: { start: 0,    end: 395 },  // Part 1 starts at 0:00 (dialogue at 1:44)
      2: { start: 418,  end: 765 },  // Part 2 starts at 6:58 / 418s ("Section 2...")
      3: { start: 782,  end: 1118 }, // Part 3 starts at 13:02 / 782s ("Section 3...")
      4: { start: 1138, end: 1475 }  // Part 4 starts at 18:58 / 1138s ("Section 4...")
    },
    "2026_5": {
      1: { start: 0,    end: 380 },  // Part 1 starts at 0:00 (dialogue at 1:40)
      2: { start: 395,  end: 693 },  // Part 2 starts at 6:35 / 395s ("Section 2...")
      3: { start: 707,  end: 1006 }, // Part 3 starts at 11:47 / 707s ("Section 3...")
      4: { start: 1028, end: 1405 }  // Part 4 starts at 17:08 / 1028s ("Section 4...")
    },
    "2026_6": {
      1: { start: 0,    end: 358 },
      2: { start: 358,  end: 687 },
      3: { start: 687,  end: 1030 },
      4: { start: 1030, end: 1415 }
    },
    "2026_7": {
      1: { start: 0,    end: 373 },
      2: { start: 373,  end: 754 },
      3: { start: 754,  end: 1109 },
      4: { start: 1109, end: 1571 }
    },
    "2026_8": {
      1: { start: 0,    end: 369 },
      2: { start: 369,  end: 781 },
      3: { start: 781,  end: 1132 },
      4: { start: 1132, end: 1468 }
    },
    "2026_9": {
      1: { start: 0,    end: 363 },
      2: { start: 363,  end: 746 },
      3: { start: 746,  end: 1076 },
      4: { start: 1076, end: 1428 }
    },
    "2026_10": {
      1: { start: 0,    end: 372 },
      2: { start: 372,  end: 736 },
      3: { start: 736,  end: 1170 },
      4: { start: 1170, end: 1580 }
    },
    "2026_11": {
      1: { start: 0,    end: 408 },
      2: { start: 408,  end: 820 },
      3: { start: 820,  end: 1228 },
      4: { start: 1228, end: 1686 }
    },
    "2026_12": {
      1: { start: 0,    end: 400 },
      2: { start: 400,  end: 772 },
      3: { start: 772,  end: 1185 },
      4: { start: 1185, end: 1592 }
    },
    "2026_13": {
      1: { start: 0,    end: 410 },
      2: { start: 410,  end: 884 },
      3: { start: 884,  end: 1317 },
      4: { start: 1317, end: 1695 }
    },
    "2026_14": {
      1: { start: 0,    end: 411 },
      2: { start: 411,  end: 824 },
      3: { start: 824,  end: 1304 },
      4: { start: 1304, end: 1771 }
    },
    "2026_15": {
      1: { start: 0,    end: 380 },
      2: { start: 380,  end: 843 },
      3: { start: 843,  end: 1244 },
      4: { start: 1244, end: 1666 }
    },
    "2026_16": {
      1: { start: 0,    end: 346 },
      2: { start: 346,  end: 683 },
      3: { start: 683,  end: 1029 },
      4: { start: 1029, end: 1493 }
    },
    "2026_17": {
      1: { start: 0,    end: 358 },
      2: { start: 358,  end: 743 },
      3: { start: 743,  end: 1074 },
      4: { start: 1074, end: 1494 }
    },
    "2026_18": {
      1: { start: 0,    end: 421 },
      2: { start: 421,  end: 811 },
      3: { start: 811,  end: 1234 },
      4: { start: 1234, end: 1643 }
    },
    "2026_19": {
      1: { start: 0,    end: 467 },
      2: { start: 467,  end: 897 },
      3: { start: 897,  end: 1325 },
      4: { start: 1325, end: 1808 }
    },
    "2026_20": {
      1: { start: 0,    end: 462 },
      2: { start: 462,  end: 931 },
      3: { start: 931,  end: 1389 },
      4: { start: 1389, end: 1841 }
    }
  };

  function getFriendlyGroupType(type) {
    if (!type) return "Questions";
    const t = String(type).toLowerCase();
    if (t.includes("table")) return "Table Completion";
    if (t.includes("note")) return "Note Completion";
    if (t.includes("form")) return "Form Completion";
    if (t.includes("two-choice")) return "Two Choices";
    if (t.includes("one-choice") || t.includes("mcq")) return "One Choice";
    if (t.includes("matching") || t.includes("drag")) return "Matching";
    if (t.includes("map") || t.includes("diagram") || t.includes("plan")) return "Plan / Map Labelling";
    if (t.includes("flow")) return "Flow-chart Completion";
    if (t.includes("sentence")) return "Sentence Completion";
    return "Questions";
  }

  // State
  let testData = null;

  // ==========================================
  // PHASE & ACCESS CONTROL ENGINE (Phase 2 & Phase 3)
  // ==========================================
  let appPhase = 1;
  let appSettings = {};
  let appSettingsLoaded = false;

  async function fetchSystemPhase() {
    try {
      const res = await fetch('/api/system-settings');
      const data = await res.json();
      if (data && data.success && data.settings) {
        appPhase = Number(data.settings.currentPhase) || 1;
        appSettings = data.settings || {};
        appSettingsLoaded = true;
      }
    } catch(e) {
      console.warn('Could not fetch system settings, default to phase 1:', e);
    }
  }

  function getUserAccessState() {
    try {
      const u = JSON.parse(localStorage.getItem('user') || 'null');
      if (!u || (!u.email && !u.name)) {
        return { isLoggedIn: false, isPremium: false };
      }
      const isPremium = !!(u.isPremium || u.role === 'admin' || u.plan === 'premium');
      return { isLoggedIn: true, isPremium };
    } catch(e) {
      return { isLoggedIn: false, isPremium: false };
    }
  }

  function isSectionLocked(gIdx) {
    if (appPhase === 1) return false;
    const user = getUserAccessState();
    if (appPhase === 2 && user.isLoggedIn) return false;
    if (appPhase === 3 && user.isPremium) return false;

    const testNum = Number(testParam) || 1;
    if (bookParam >= 2000) {
      const freeRecent = appSettings.freeRecentTestsCount !== undefined ? Number(appSettings.freeRecentTestsCount) : 2;
      return testNum > freeRecent;
    }

    // Cambridge Full Test is always free; only section/question-type drills are gated
    if (practiceMode === 'full') return false;
    const allowed = appSettings.freeQuestionTypesPerTest !== undefined ? Number(appSettings.freeQuestionTypesPerTest) : 0;
    return gIdx >= allowed;
  }

  function isCurrentSessionLocked() {
    if (appPhase === 1) return false;
    const user = getUserAccessState();
    if (appPhase === 2 && user.isLoggedIn) return false;
    if (appPhase === 3 && user.isPremium) return false;

    const testNum = Number(testParam) || 1;
    if (bookParam >= 2000) {
      // Recent Actual Tests (1-20): first N tests (full + part + question type) are free; remaining are locked
      const freeRecent = appSettings.freeRecentTestsCount !== undefined ? Number(appSettings.freeRecentTestsCount) : 2;
      return testNum > freeRecent;
    }

    // Cambridge Academic Tests: Full Test is ALWAYS FREE; only Part & Question-Type practice are gated
    if (practiceMode === 'part') {
      const partIdx = (targetPart || 1) - 1;
      const freePartsAllowed = appSettings.freePartsPerTest !== undefined ? Number(appSettings.freePartsPerTest) : 1;
      if (partIdx >= freePartsAllowed) return true;
    } else if (practiceMode === 'section') {
      const groups = testData.questionGroups || [];
      const gIdx = groups.indexOf(targetGroup);
      const freeSecAllowed = appSettings.freeQuestionTypesPerTest !== undefined ? Number(appSettings.freeQuestionTypesPerTest) : 0;
      if (gIdx >= freeSecAllowed) return true;
    }

    return false;
  }

  function openTestUnlockModal(triggerReason) {
    const modal = document.getElementById('psUnlockModal');
    if (!modal) return;

    const iconWrap = document.getElementById('psUnlockIconWrap');
    const tagBadge = document.getElementById('psUnlockBadge');
    const titleEl = document.getElementById('psUnlockTitle');
    const descEl = document.getElementById('psUnlockDesc');
    const primaryBtn = document.getElementById('psUnlockPrimaryBtn');
    const backBtn = document.getElementById('psUnlockBackBtn');
    const secondaryAction = document.getElementById('psUnlockSecondaryAction');

    const currUrl = encodeURIComponent(window.location.pathname + window.location.search);
    const isSessionBlocked = isCurrentSessionLocked();

    if (backBtn) {
      if (isSessionBlocked) {
        backBtn.textContent = bookParam >= 2000 ? 'Back to Recent Tests' : 'Back to Cambridge Tests';
        backBtn.onclick = () => { window.location.href = bookParam >= 2000 ? '/recent-listening-tests' : (window.location.pathname.includes('reading') ? '/cambridge-reading.html' : '/cambridge-listening.html'); };
      } else {
        backBtn.textContent = 'Cancel / Keep Practicing';
        backBtn.onclick = () => { closeTestUnlockModal(); };
      }
    }

    if (appPhase === 3) {
      // Phase 3: Paid / Premium
      if (iconWrap) {
        iconWrap.style.background = 'rgba(224, 32, 45, 0.08)';
        iconWrap.style.borderColor = 'rgba(224, 32, 45, 0.28)';
        iconWrap.style.color = '#e0202d';
        iconWrap.innerHTML = '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>';
      }
      if (tagBadge) {
        tagBadge.style.display = 'inline-block';
        tagBadge.style.background = '#fee2e2';
        tagBadge.style.color = '#b91c1c';
        tagBadge.style.border = '1px solid #fca5a5';
        tagBadge.textContent = 'PREMIUM PLAN REQUIRED';
      }
      if (titleEl) titleEl.textContent = 'Unlock with Premium Access';
      if (descEl) descEl.textContent = 'Upgrade to IELTS Mockpoint Premium to access all Cambridge tests, individual section practices, and full audio transcripts with explanations.';
      if (primaryBtn) {
        primaryBtn.style.background = '#e0202d';
        primaryBtn.href = '/pricing';
        primaryBtn.innerHTML = '<span>Upgrade to Premium / Buy Pass</span> &rarr;';
      }
      if (secondaryAction) {
        const u = getUserAccessState();
        if (!u.isLoggedIn) {
          secondaryAction.innerHTML = `<a href="/login?redirect=${currUrl}" style="font-size:0.86rem; color:#1565c9; text-decoration:none; font-weight:600;">Already have a paid account? <span style="text-decoration:underline;">Sign In</span></a>`;
          secondaryAction.style.display = 'block';
        } else {
          secondaryAction.style.display = 'none';
        }
      }
    } else {
      // Phase 2: Candidate Free Account
      if (iconWrap) {
        iconWrap.style.background = '#fdecee';
        iconWrap.style.borderColor = 'rgba(224, 32, 45, 0.28)';
        iconWrap.style.color = '#e0202d';
        iconWrap.innerHTML = '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#e0202d" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>';
      }
      if (tagBadge) {
        tagBadge.style.display = 'inline-block';
        tagBadge.style.background = '#fdecee';
        tagBadge.style.color = '#e0202d';
        tagBadge.style.border = '1px solid rgba(224, 32, 45, 0.25)';
        tagBadge.textContent = 'FREE CANDIDATE ACCOUNT';
      }
      if (titleEl) titleEl.textContent = 'Sign In Required to Unlock';
      if (descEl) descEl.textContent = 'Please sign in or create a free candidate account to practice this section and save your progress to your personal dashboard.';
      if (primaryBtn) {
        primaryBtn.style.background = '#e0202d';
        primaryBtn.href = `/login?redirect=${currUrl}`;
        primaryBtn.innerHTML = '<span>Sign In / Register Free</span> &rarr;';
      }
      if (secondaryAction) {
        secondaryAction.style.display = 'none';
      }
    }

    modal.classList.add('open');
  }

  function closeTestUnlockModal() {
    if (isCurrentSessionLocked()) {
      window.location.href = window.location.pathname.includes('reading') ? '/cambridge-reading.html' : '/cambridge-listening.html';
      return;
    }
    const m = document.getElementById('psUnlockModal');
    if (m) m.classList.remove('open');
  }

  window.openTestUnlockModal = openTestUnlockModal;
  window.closeTestUnlockModal = closeTestUnlockModal;

  let activePart = 1;
  let userAnswers = {};
  let isSubmitted = false;
  let reviewTab = "questions"; // 'questions' or 'transcript' or 'split'

  // Timer
  let totalSeconds = 0;
  let timerInterval = null;

  // Audio Player State
  let currentAudio = null;
  let isSeeking = false;
  const audioCache = {};

  // DOM Elements
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");
  const playPauseBtn = document.getElementById("audioPlayPauseBtn");
  const playPauseIcon = document.getElementById("playPauseIcon");
  const rewindBtn = document.getElementById("audioRewindBtn");
  const forwardBtn = document.getElementById("audioForwardBtn");
  const seekSlider = document.getElementById("audioSeekSlider");
  const timeLabel = document.getElementById("audioTimeLabel");
  const testTitleBadge = document.getElementById("testTitleBadge");
  const testBookBadge = document.getElementById("testBookBadge");
  const partsContainer = document.getElementById("partsContainer");
  const finishBtn = document.getElementById("finishBtn");
  const submitModal = document.getElementById("submitModal");
  const confirmSubmitBtn = document.getElementById("confirmSubmitBtn");
  const cancelSubmitBtn = document.getElementById("cancelSubmitBtn");

  // -------------------------------------------------------------
  // 1. Data Fetching & Mode Initialization
  // -------------------------------------------------------------
  async function initTest() {
    try {
      const res = await fetch(`/api/cambridge-listening-v2/${bookParam}/${testParam}`);
      const json = await res.json();
      if (!res.ok || !json.success || !json.data) {
        throw new Error(json.message || "Failed to load test data");
      }
      testData = json.data;

      // Fetch System Phase Settings
      await fetchSystemPhase();

      // Determine practice mode (full, part, or section)
      determinePracticeMode();

      if (isCurrentSessionLocked()) {
        setupHeaderTitle();
        openTestUnlockModal('session');
        partsContainer.innerHTML = `
          <div style="text-align:center; padding: 60px 20px;">
            <div style="width:64px; height:64px; border-radius:18px; background:#fdecee; border:1.5px solid #fca5a5; display:inline-flex; align-items:center; justify-content:center; color:#e0202d; margin-bottom:16px;">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </div>
            <h3 style="font-family:'Sora',sans-serif; color:#0b2b52; margin-bottom:8px;">${appPhase === 3 ? 'Premium Subscription Required' : 'Sign In Required to Unlock'}</h3>
            <p style="color:#64748b; max-width:440px; margin:0 auto 20px;">${appPhase === 3 ? 'This Cambridge test / section requires an active IELTS Mockpoint Premium subscription.' : 'Please sign in or create a free candidate account to access this Cambridge practice test.'}</p>
            <button type="button" class="cl-btn-finish" onclick="openTestUnlockModal('session')" style="padding:10px 24px; font-weight:700;">Unlock Access Now</button>
          </div>
        `;
        return;
      }

      // Setup Header Title & Badges
      setupHeaderTitle();

      // Render Question Groups into Parts
      renderAllParts();
      renderBottomNavigation();
      switchPart(activePart);

      // Start Audio for active part
      initPartAudio(activePart);

      // Start Timer
      startTimer();

    } catch (err) {
      console.error("Init test error:", err);
      partsContainer.innerHTML = `
        <div style="text-align:center; padding: 60px 20px; color: var(--red);">
          <h2>Failed to load Cambridge ${bookParam} Test ${testParam}</h2>
          <p>${err.message}</p>
        </div>
      `;
    }
  }

    function getPartTranscript(transcripts, partNum) {
    if (!transcripts) return "";
    const p = Number(partNum) || 1;
    if (Array.isArray(transcripts)) {
      return (transcripts[p - 1] !== undefined ? transcripts[p - 1] : (transcripts[p] || "")) || "";
    }
    return (transcripts[String(p)] !== undefined ? transcripts[String(p)] : (transcripts[p] || transcripts[p - 1] || "")) || "";
  }

  function computeCalibratedSectionTime(part, qIds, audioDuration) {
    const isFirstGroupInPart = (qIds[0] === 1 || qIds[0] === 11 || qIds[0] === 21 || qIds[0] === 31);
    const rawPText = getPartTranscript(testData.transcripts, part);
    const rawEv = testData.evidencePhrases && (testData.evidencePhrases[String(qIds[0])] || "");

    const normText = (rawPText || '').toLowerCase().replace(/[’‘`]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, ' ').trim();
    const normEv = (rawEv || '').toLowerCase().replace(/[’‘`]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, ' ').trim();

    const totalDur = (audioDuration && isFinite(audioDuration) && audioDuration > 100) ? audioDuration : 360;

    if (normText && normEv) {
      let pos = normText.indexOf(normEv.slice(0, 25));
      if (pos < 0) pos = normText.indexOf(normEv.slice(0, 15));
      if (pos >= 0) {
        const ratio = pos / normText.length;
        if (isFirstGroupInPart && ratio < 0.18) {
          const introEnd = (part === 4) ? 70 : ((part === 1) ? 55 : 48);
          return Math.max(0, introEnd - 15);
        }
        const intro = (part === 4) ? 65 : 45;
        const speechTime = intro + ratio * (totalDur - intro - 20);
        return Math.max(0, Math.floor(speechTime - 15));
      }
    }

    if (isFirstGroupInPart) {
      return (part === 4) ? 55 : 35;
    }
    return 0;
  }

  function determinePracticeMode() {
    const groups = testData.questionGroups || [];

    if (sectionParam) {
      practiceMode = "section";
      const cleanSec = String(sectionParam).trim().replace(/^q/i, "");
      const m = cleanSec.match(/^(\d+)-(\d+)$/);
      if (m) {
        const qStart = Number(m[1]);
        const qEnd = Number(m[2]);
        targetGroup = groups.find(g => {
          const ids = g.questionIds || g.ids || [];
          return ids[0] === qStart && ids[ids.length - 1] === qEnd;
        }) || groups.find(g => {
          const ids = g.questionIds || g.ids || [];
          return ids.includes(qStart);
        });
      } else if (!isNaN(Number(cleanSec))) {
        const idx = Number(cleanSec);
        if (groups[idx]) targetGroup = groups[idx];
        else {
          targetGroup = groups.find(g => (g.questionIds || g.ids || []).includes(idx));
        }
      }

      if (targetGroup) {
        targetPart = Number(targetGroup.part) || Math.ceil(((targetGroup.questionIds || [1])[0]) / 10);
        targetQIds = targetGroup.questionIds || targetGroup.ids || [];
        activePart = targetPart;

        // Resolve Audio Start & End Time
        const testKey = `${bookParam}_${testParam}`;
        const rangeKey = `${targetQIds[0]}-${targetQIds[targetQIds.length - 1]}`;
        if (sectionAudioRanges[testKey] && sectionAudioRanges[testKey][rangeKey]) {
          sectionStartTime = sectionAudioRanges[testKey][rangeKey].start;
          sectionEndTime = sectionAudioRanges[testKey][rangeKey].end || 0;
        } else if (targetGroup.startTime !== undefined) {
          sectionStartTime = targetGroup.startTime;
          sectionEndTime = targetGroup.endTime || 0;
        } else {
          sectionStartTime = computeCalibratedSectionTime(targetPart, targetQIds, 360);
          sectionEndTime = 0;
        }
      } else {
        practiceMode = "full";
        activePart = 1;
        targetQIds = Array.from({ length: 40 }, (_, i) => i + 1);
      }
    } else if (partParam && partParam >= 1 && partParam <= 4) {
      practiceMode = "part";
      targetPart = partParam;
      activePart = targetPart;
      const startQ = (targetPart - 1) * 10 + 1;
      const endQ = targetPart * 10;
      targetQIds = [];
      for (let q = startQ; q <= endQ; q++) targetQIds.push(q);

      // Calibrate audio start & end time for Part practice if single master audio / recent test
      if (bookParam >= 2000) {
        const testKey = `${bookParam}_${testParam}`;
        const pRange = recentRealTestPartRanges[testKey]?.[targetPart] || { start: 0, end: 0 };
        sectionStartTime = pRange.start || 0;
        sectionEndTime = pRange.end || 0;
      }
    } else {
      practiceMode = "full";
      activePart = 1;
      targetQIds = Array.from({ length: 40 }, (_, i) => i + 1);
    }
  }

  function setupHeaderTitle() {
    const isRecent = (bookParam >= 2000);
    if (testBookBadge) {
      testBookBadge.textContent = isRecent ? "Recent Real Test" : `Cambridge ${bookParam}`;
    }

    let seoTitle = isRecent ? `IELTS Listening Recent Actual Test ${testParam} (2026 Edition)` : `Cambridge IELTS ${bookParam} Listening Test ${testParam}`;
    if (testTitleBadge) {
      if (practiceMode === "section") {
        const qRange = `Questions ${targetQIds[0]}–${targetQIds[targetQIds.length - 1]}`;
        const friendlyType = getFriendlyGroupType(targetGroup.type);
        testTitleBadge.textContent = isRecent ? `Recent Test ${testParam} • ${qRange} (${friendlyType})` : `Test ${testParam} • ${qRange} (${friendlyType})`;
        seoTitle += ` • ${qRange}`;
      } else if (practiceMode === "part") {
        testTitleBadge.textContent = isRecent ? `Recent Actual Test ${testParam} • Part ${targetPart}` : `Listening Test ${testParam} • Part ${targetPart}`;
        seoTitle += ` Part ${targetPart}`;
      } else {
        testTitleBadge.textContent = isRecent ? `Recent Listening Real Test ${testParam}` : `Academic Listening Test ${testParam}`;
      }
    }
    document.title = `${seoTitle} Online with Audio & Answers | IELTS Mockpoint`;
  }

  // -------------------------------------------------------------
  // 2. Stopwatch Timer
  // -------------------------------------------------------------
  function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      totalSeconds++;
      const m = Math.floor(totalSeconds / 60);
      const s = totalSeconds % 60;
      if (minutesEl) minutesEl.textContent = String(m).padStart(2, "0");
      if (secondsEl) secondsEl.textContent = String(s).padStart(2, "0");
    }, 1000);
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function formatTime(secs) {
    if (isNaN(secs) || !isFinite(secs)) return "00:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  // -------------------------------------------------------------
  // 3. Audio Player Logic
  // -------------------------------------------------------------
  function getAudioUrlForPart(partNum) {
    if (testData.partAudios && testData.partAudios[String(partNum)]) {
      return testData.partAudios[String(partNum)];
    }
    return testData.audioUrl || testData.audioSrc || "";
  }

  function initPartAudio(partNum) {
    const rawUrl = getAudioUrlForPart(partNum);
    if (!rawUrl) return;

    // Use existing proxy route for CORS & Range requests
    const audioSrc = rawUrl.startsWith("http")
      ? `/api/cambridge-proxy-audio?url=${encodeURIComponent(rawUrl)}`
      : rawUrl;

    if (audioCache[partNum]) {
      currentAudio = audioCache[partNum];
      syncAudioUI();
      return;
    }

    const audio = new Audio(audioSrc);
    audio.preload = "metadata";
    audioCache[partNum] = audio;
    currentAudio = audio;
    syncAudioUI();

    audio.addEventListener("loadedmetadata", () => {
      if (audio !== currentAudio) return;
      if (practiceMode === "section" && targetGroup) {
        const testKey = `${bookParam}_${testParam}`;
        const rangeKey = `${targetQIds[0]}-${targetQIds[targetQIds.length - 1]}`;
        if (sectionAudioRanges[testKey] && sectionAudioRanges[testKey][rangeKey]) {
          sectionStartTime = sectionAudioRanges[testKey][rangeKey].start;
          sectionEndTime = sectionAudioRanges[testKey][rangeKey].end || 0;
        } else if (targetGroup.startTime !== undefined) {
          sectionStartTime = targetGroup.startTime;
          sectionEndTime = targetGroup.endTime || 0;
        } else if (isFinite(audio.duration) && audio.duration > 100 && bookParam < 2000) {
          sectionStartTime = computeCalibratedSectionTime(targetPart, targetQIds, audio.duration);
        }
      } else if (practiceMode === "part" && bookParam >= 2000) {
        const testKey = `${bookParam}_${testParam}`;
        const pRange = recentRealTestPartRanges[testKey]?.[targetPart];
        if (pRange) {
          sectionStartTime = pRange.start || 0;
          sectionEndTime = pRange.end || 0;
        }
      } else if (practiceMode === "full" && bookParam >= 2000 && partNum > 1) {
        const testKey = `${bookParam}_${testParam}`;
        const pRange = recentRealTestPartRanges[testKey]?.[partNum];
        if (pRange && pRange.start > 0 && audio.currentTime < 1) {
          try { audio.currentTime = pRange.start; } catch (e) {}
        }
      }
      if ((practiceMode === "section" || practiceMode === "part") && sectionStartTime > 0) {
        if (Math.abs(audio.currentTime - sectionStartTime) > 0.5) {
          try { audio.currentTime = sectionStartTime; } catch (e) {}
        }
      }
      syncAudioUI();
    });

    audio.addEventListener("canplay", () => {
      if (audio !== currentAudio) return;
      if ((practiceMode === "section" || practiceMode === "part") && sectionStartTime > 0) {
        if (Math.abs(audio.currentTime - sectionStartTime) > 0.5) {
          try { audio.currentTime = sectionStartTime; } catch (e) {}
        }
      } else if (practiceMode === "full" && bookParam >= 2000 && partNum > 1) {
        const testKey = `${bookParam}_${testParam}`;
        const pRange = recentRealTestPartRanges[testKey]?.[partNum];
        if (pRange && pRange.start > 0 && audio.currentTime < 1) {
          try { audio.currentTime = pRange.start; } catch (e) {}
        }
      }
      syncAudioUI();
    }, { once: true });

    audio.addEventListener("timeupdate", () => {
      if (audio !== currentAudio) return;
      // Guard: Ensure section or part practice with a positive start time snaps to start position if browser started from 0
      if ((practiceMode === "section" || practiceMode === "part") && sectionStartTime > 0) {
        if (audio.currentTime < sectionStartTime - 2 && !audio.paused && !audio.seeking) {
          try { audio.currentTime = sectionStartTime; } catch (e) {}
          return;
        }
      }
      if (!isSeeking && seekSlider && timeLabel) {
        seekSlider.value = Math.floor(audio.currentTime);
        timeLabel.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
      }
      // Auto-stop at end of section / part in practice mode
      if ((practiceMode === "section" || practiceMode === "part") && sectionEndTime > 0 && audio.currentTime >= sectionEndTime) {
        audio.pause();
        updatePlayPauseIcon(false);
      }
    });

    audio.addEventListener("play", () => {
      // Pause other cached audios
      Object.keys(audioCache).forEach((k) => {
        if (Number(k) !== Number(partNum) && !audioCache[k].paused) {
          audioCache[k].pause();
        }
      });
      if ((practiceMode === "section" || practiceMode === "part") && sectionStartTime > 0) {
        if (audio.currentTime < sectionStartTime - 1 || (sectionEndTime > 0 && audio.currentTime >= sectionEndTime)) {
          try { audio.currentTime = sectionStartTime; } catch(e) {}
        }
      }
      if (audio === currentAudio) updatePlayPauseIcon(true);
    });

    audio.addEventListener("playing", () => {
      if (audio === currentAudio) {
        if ((practiceMode === "section" || practiceMode === "part") && sectionStartTime > 0) {
          if (audio.currentTime < sectionStartTime - 1 || (sectionEndTime > 0 && audio.currentTime >= sectionEndTime)) {
            try { audio.currentTime = sectionStartTime; } catch(e) {}
          }
        }
      }
    });

    audio.addEventListener("pause", () => {
      if (audio === currentAudio) updatePlayPauseIcon(false);
    });

    audio.addEventListener("ended", () => {
      if (audio === currentAudio) {
        updatePlayPauseIcon(false);
        if (seekSlider) seekSlider.value = 0;
      }
    });
  }

  function updatePlayPauseIcon(isPlaying) {
    if (!playPauseIcon) return;
    if (isPlaying) {
      playPauseIcon.className = "bi bi-pause-fill";
    } else {
      playPauseIcon.className = "bi bi-play-fill";
    }
  }

  function syncAudioUI() {
    if (!currentAudio) return;
    updatePlayPauseIcon(!currentAudio.paused && !currentAudio.ended);
    const displayTime = ((practiceMode === "section" || practiceMode === "part") && sectionStartTime > 0 && currentAudio.currentTime < sectionStartTime)
      ? sectionStartTime
      : currentAudio.currentTime;
    if (seekSlider && isFinite(currentAudio.duration)) {
      seekSlider.max = Math.floor(currentAudio.duration);
      seekSlider.value = Math.floor(displayTime || 0);
    }
    if (timeLabel) {
      timeLabel.textContent = `${formatTime(displayTime)} / ${formatTime(currentAudio.duration)}`;
    }
  }

  if (playPauseBtn) {
    playPauseBtn.addEventListener("click", () => {
      if (!currentAudio) return;
      if (currentAudio.paused) {
        if ((practiceMode === "section" || practiceMode === "part") && sectionStartTime > 0) {
          if (currentAudio.currentTime < sectionStartTime - 0.5 || (sectionEndTime > 0 && currentAudio.currentTime >= sectionEndTime)) {
            try { currentAudio.currentTime = sectionStartTime; } catch (e) {}
          }
        }
        currentAudio.play().then(() => {
          if ((practiceMode === "section" || practiceMode === "part") && sectionStartTime > 0) {
            if (currentAudio.currentTime < sectionStartTime - 1 || (sectionEndTime > 0 && currentAudio.currentTime >= sectionEndTime)) {
              currentAudio.currentTime = sectionStartTime;
            }
          }
        }).catch(e => console.warn("Audio play prevented:", e));
      } else {
        currentAudio.pause();
      }
    });
  }

  if (rewindBtn) {
    rewindBtn.addEventListener("click", () => {
      if (currentAudio) {
        const minBound = (practiceMode === "section" || practiceMode === "part") ? (sectionStartTime || 0) : 0;
        currentAudio.currentTime = Math.max(minBound, currentAudio.currentTime - 10);
      }
    });
  }

  if (forwardBtn) {
    forwardBtn.addEventListener("click", () => {
      if (currentAudio) {
        const maxBound = ((practiceMode === "section" || practiceMode === "part") && sectionEndTime > 0)
          ? sectionEndTime
          : (currentAudio.duration || 0);
        currentAudio.currentTime = Math.min(maxBound, currentAudio.currentTime + 10);
      }
    });
  }

  if (seekSlider) {
    seekSlider.addEventListener("input", () => {
      isSeeking = true;
      if (timeLabel && currentAudio) {
        timeLabel.textContent = `${formatTime(seekSlider.value)} / ${formatTime(currentAudio.duration)}`;
      }
    });
    seekSlider.addEventListener("change", () => {
      isSeeking = false;
      if (currentAudio) currentAudio.currentTime = Number(seekSlider.value);
    });
  }

  // -------------------------------------------------------------
  // 4. Question Renderers (Matching 8 Sample Pics)
  // -------------------------------------------------------------
  function renderAllParts() {
    partsContainer.innerHTML = "";

    const partsToRender = (practiceMode === "full") ? [1, 2, 3, 4] : [targetPart];

    partsToRender.forEach(p => {
      const partWrap = document.createElement("div");
      partWrap.className = `cl-part-container ${p === activePart ? "active" : ""}`;
      partWrap.id = `part-panel-${p}`;

      // Header Banner
      const startQ = (p - 1) * 10 + 1;
      const endQ = p * 10;

      let bannerTitle = `Part ${p}`;
      let bannerSubtitle = `Listen and answer questions ${startQ} &ndash; ${endQ}.`;

      if (practiceMode === "section" && targetGroup) {
        const qStart = targetQIds[0];
        const qEnd = targetQIds[targetQIds.length - 1];
        bannerTitle = `Part ${p} • Section Practice`;
        bannerSubtitle = `Listen and answer questions ${qStart} &ndash; ${qEnd} (${getFriendlyGroupType(targetGroup.type)}).`;
      } else if (practiceMode === "part") {
        bannerTitle = `Part ${p} Practice`;
        bannerSubtitle = `Listen and answer questions ${startQ} &ndash; ${endQ}.`;
      }

      partWrap.innerHTML = `
        <div class="cl-part-header">
          <div>
            <h2>${bannerTitle}</h2>
            <p>${bannerSubtitle}</p>
          </div>
          <div id="partTranscriptToggleBtn-${p}" style="${(practiceMode !== 'full' || isSubmitted) ? 'display:block;' : 'display:none;'}">
            <button type="button" class="cl-btn-outline-sm" onclick="window.clV2.toggleTranscriptView(${p})">
              <i class="bi bi-file-text"></i> Show Audio Script
            </button>
          </div>
        </div>
        <div class="cl-part-content-grid" id="part-content-grid-${p}">
          <div class="cl-transcript-col" id="part-transcript-col-${p}" style="display:none;"></div>
          <div class="cl-split-resizer" id="split-resizer-${p}" data-part="${p}" title="Drag left or right to resize split screen">
            <div class="cl-resizer-line"></div>
            <div class="cl-resizer-pill">
              <i class="bi bi-grip-vertical"></i>
            </div>
          </div>
          <div class="cl-questions-col" id="part-questions-col-${p}"></div>
        </div>
      `;

      partsContainer.appendChild(partWrap);

      // Render groups belonging to this part
      const qCol = partWrap.querySelector(`#part-questions-col-${p}`);
      let partGroups = (testData.questionGroups || []).filter(g => Number(g.part) === p);

      if (practiceMode === "section" && targetGroup) {
        partGroups = [targetGroup];
      }

      partGroups.forEach(g => {
        const groupEl = renderGroup(g);
        if (groupEl) qCol.appendChild(groupEl);
      });
    });
  }

  // Lookup full option text for a question (e.g. "C. This was easy to decide on.")
  function getFullOptionForQuestion(qid, letterOrAns) {
    if (!letterOrAns || !testData) return "";
    const cleanAns = String(letterOrAns).trim();
    if (!cleanAns) return "";
    const letter = cleanAns.length === 1 ? cleanAns.toUpperCase() : cleanAns.charAt(0).toUpperCase();

    const groups = testData.questionGroups || [];
    for (const g of groups) {
      const ids = g.questionIds || g.ids || [];
      const inRange = ids.includes(Number(qid)) ||
        (g.startQuestion && g.endQuestion && Number(qid) >= g.startQuestion && Number(qid) <= g.endQuestion);

      if (inRange && g.options) {
        if (Array.isArray(g.options)) {
          const match = g.options.find(o => (o.letter || "").trim().toUpperCase() === letter);
          if (match) {
            return `${match.letter}. ${match.text}`;
          }
        } else if (typeof g.options === "object") {
          if (g.options[letter]) {
            return `${letter}. ${g.options[letter]}`;
          }
        }
      }
    }
    return cleanAns;
  }

  // Replace [blank:X] with square badge [ X ] + Input
  function replaceBlanks(text) {
    if (!text) return "";
    return text.replace(/\[(?:blank|drop)\s*:\s*(\d+)\]/gi, (match, qid) => {
      const val = userAnswers[qid] || "";
      const displayVal = val ? (getFullOptionForQuestion(qid, val) || val) : "";
      return `<span class="cl-q-badge" id="badge-${qid}">${qid}</span><input type="text" class="cl-text-input" data-qid="${qid}" value="${escapeAttr(displayVal)}" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">`;
    });
  }

  function renderGroup(group) {
    const card = document.createElement("div");
    card.className = "cl-group-card";
    card.dataset.groupType = group.type;

    const gIds = group.questionIds || group.ids || [1];
    const qStart = gIds[0];
    const qEnd = gIds[gIds.length - 1];

    let sectionPillHtml = "";
    if (practiceMode === "section") {
      sectionPillHtml = `<span class="cl-section-pill active-mode"><i class="bi bi-record-circle"></i> Section Practice Mode</span>`;
    } else {
      sectionPillHtml = `<a href="/cambridge-listening-v2?book=${bookParam}&test=${testParam}&section=${qStart}-${qEnd}" target="_blank" class="cl-section-pill" title="Practice Questions ${qStart}–${qEnd} in a new tab"><i class="bi bi-box-arrow-up-right"></i> Practice this section only</a>`;
    }

    let html = `
      <div class="cl-group-title-row">
        <h3 class="cl-group-title">${escapeHtml(group.title || "")}</h3>
        ${sectionPillHtml}
      </div>
    `;

    if (group.instruction) {
      html += `<div class="cl-group-instruction">${escapeHtml(group.instruction)}</div>`;
    }
    if (group.heading) {
      html += `<div class="cl-group-limit">${escapeHtml(group.heading)}</div>`;
    }

    // Render by type
    switch (group.type) {
      case "table-completion":
        html += renderTableCompletion(group);
        break;
      case "note-completion":
      case "notes-completion":
        html += renderNoteCompletion(group);
        break;
      case "sentence-completion":
      case "summary-completion":
        html += renderSentenceCompletion(group);
        break;
      case "form-completion":
        html += renderFormCompletion(group);
        break;
      case "short-answer":
      case "short-answer-questions":
        html += renderShortAnswer(group);
        break;
      case "mcq-one-choice":
      case "multiple-choice":
      case "mcq":
      case "one-choice":
        html += renderMcqOneChoice(group);
        break;
      case "two-choice-checkbox":
      case "multiple-choice-multiple":
      case "multiple-choice-three":
        html += renderTwoChoiceCheckbox(group);
        break;
      case "matching":
      case "matching-drag-drop":
        html += renderMatchingDragDrop(group);
        break;
      case "flow-chart-matching":
      case "flowchart-matching":
        html += renderFlowChartMatching(group);
        break;
      case "flow-chart-completion":
      case "flowchart-completion":
        html += renderFlowChartCompletion(group);
        break;
      case "map-labelling":
        html += renderMapLabelling(group);
        break;
      case "table-and-notes-completion":
        html += renderTableAndNotesCompletion(group);
        break;
      default:
        console.warn("Unknown question type:", group.type);
        if (group.fields) {
          html += renderFormCompletion(group);
        } else if (group.sentences || group.summaryText) {
          html += renderSentenceCompletion(group);
        } else if (group.sections || group.notes) {
          html += renderNoteCompletion(group);
        } else if (group.items && group.options) {
          html += renderMatchingDragDrop(group);
        } else if (group.items || group.questions) {
          html += renderMcqOneChoice(group);
        } else if (group.tableData || group.rows) {
          html += renderTableCompletion(group);
        } else if (group.steps) {
          html += renderFlowChartCompletion(group);
        } else {
          const ids = group.ids || group.questionIds || [];
          html += `<div class="cl-sentence-wrap" style="display:flex; flex-direction:column; gap:12px; margin-top:14px;">`;
          ids.forEach(id => {
            html += `<div class="cl-sentence-item" style="line-height:2.3; font-size:15.5px; padding:8px 0; border-bottom:1px dashed var(--line);"><span class="cl-q-badge" id="badge-${id}">${id}</span> <input type="text" class="cl-text-input" data-qid="${id}" value="${escapeAttr(userAnswers[id] || "")}"></div>`;
          });
          html += `</div>`;
        }
    }

    card.innerHTML = html;
    return card;
  }

  // Type 1: Table Completion
  function renderTableCompletion(group) {
    let headers = [];
    let rows = [];
    if (group.tableData) {
      headers = group.tableData.headers || [];
      rows = group.tableData.rows || [];
    } else if (group.rows && Array.isArray(group.rows)) {
      headers = group.headers || [];
      rows = group.rows.map(r => Array.isArray(r) ? r : Object.values(r));
    }
    if (!rows.length) return "";

    let out = `<div class="cl-table-wrap"><table class="cl-table">`;
    if (headers.length) {
      out += `<thead><tr>`;
      headers.forEach(h => { out += `<th>${replaceBlanks(String(h || ""))}</th>`; });
      out += `</tr></thead>`;
    }
    out += `<tbody>`;
    rows.forEach(row => {
      out += `<tr>`;
      row.forEach(cell => {
        out += `<td>${replaceBlanks(String(cell || "")).replace(/\n/g, "<br>")}</td>`;
      });
      out += `</tr>`;
    });
    out += `</tbody></table></div>`;
    return out;
  }

  // Type 2: Note Completion
  function renderNoteCompletion(group) {
    let out = `<div class="cl-note-wrap">`;
    const sections = group.sections || group.notes || [];

    // Check if sections is directly an array of strings (e.g. ["note 1", "note 2"])
    if (sections.length && typeof sections[0] === "string") {
      out += `<ul class="cl-note-list" style="list-style:none; padding:0; display:flex; flex-direction:column; gap:10px; margin-top:10px;">`;
      sections.forEach(pt => {
        out += `<li class="cl-note-item" style="line-height:2.3; font-size:15.5px; padding:6px 0; border-bottom:1px dashed var(--line);">${replaceBlanks(pt)}</li>`;
      });
      out += `</ul>`;
    } else {
      sections.forEach(sec => {
        if (typeof sec === "string") {
          out += `<div class="cl-note-item" style="line-height:2.3; font-size:15.5px; padding:6px 0; border-bottom:1px dashed var(--line);">${replaceBlanks(sec)}</div>`;
          return;
        }
        const heading = sec.title || sec.subheading || "";
        if (heading) {
          out += `<div class="cl-group-subheading">${escapeHtml(heading)}</div>`;
        }
        if (sec.points && sec.points.length) {
          out += `<ul class="cl-note-list">`;
          sec.points.forEach(pt => {
            out += `<li class="cl-note-item">${replaceBlanks(pt)}</li>`;
          });
          out += `</ul>`;
        }
      });
    }
    out += `</div>`;
    return out;
  }

  // Type 2b: Sentence & Summary Completion
  function renderSentenceCompletion(group) {
    let out = `<div class="cl-sentence-wrap" style="display:flex; flex-direction:column; gap:12px; margin-top:14px;">`;
    if (group.summaryText) {
      out += `<div class="cl-summary-text" style="line-height:2.5; font-size:16px; color:var(--navy); padding:10px 0;">${replaceBlanks(group.summaryText)}</div>`;
    }
    const sentences = group.sentences || [];
    if (sentences && sentences.length) {
      sentences.forEach(sent => {
        out += `<div class="cl-sentence-item" style="line-height:2.3; font-size:15.5px; color:var(--navy); padding:8px 0; border-bottom:1px dashed var(--line);">${replaceBlanks(sent)}</div>`;
      });
    } else if (group.sections && group.sections.length) {
      group.sections.forEach(sec => {
        if (sec.subheading || sec.title) {
          out += `<div class="cl-group-subheading" style="font-weight:700; margin-top:10px;">${escapeHtml(sec.subheading || sec.title)}</div>`;
        }
        (sec.points || []).forEach(pt => {
          out += `<div class="cl-sentence-item" style="line-height:2.3; font-size:15.5px; padding:8px 0; border-bottom:1px dashed var(--line);">${replaceBlanks(pt)}</div>`;
        });
      });
    }
    out += `</div>`;
    return out;
  }

  // Type 2c: Form Completion
  function renderFormCompletion(group) {
    if (group.tableData || group.rows) {
      return renderTableCompletion(group);
    }
    const fields = group.fields || [];
    let out = `<div class="cl-form-wrap" style="display:flex; flex-direction:column; gap:12px; margin-top:14px;">`;
    fields.forEach(f => {
      const label = f.label || "";
      const val = f.value || f.text || "";
      out += `
        <div class="cl-form-row" style="display:flex; align-items:center; gap:14px; padding:8px 0; border-bottom:1px dashed var(--line); font-size:15.5px; line-height:2.2;">
          <span style="font-weight:700; color:var(--navy); min-width:180px;">${escapeHtml(label)}:</span>
          <span style="flex:1;">${replaceBlanks(val)}</span>
        </div>
      `;
    });
    out += `</div>`;
    return out;
  }

  // Type 2d: Short Answer Questions
  function renderShortAnswer(group) {
    const questions = group.questions || group.items || [];
    let out = `<div class="cl-sentence-wrap" style="display:flex; flex-direction:column; gap:14px; margin-top:14px;">`;
    questions.forEach(q => {
      const txt = q.text || q.question || "";
      const hasBlank = /\[(?:blank|drop)\s*:\s*\d+\]/i.test(txt);
      const content = hasBlank ? replaceBlanks(txt) : `<span class="cl-q-badge" id="badge-${q.id}">${q.id}</span> <span>${escapeHtml(txt)}</span> <input type="text" class="cl-text-input" data-qid="${q.id}" value="${escapeAttr(userAnswers[q.id] || "")}" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" style="margin-left:8px;">`;
      out += `<div class="cl-sentence-item" style="line-height:2.3; font-size:15.5px; padding:8px 0; border-bottom:1px dashed var(--line);">${content}</div>`;
    });
    out += `</div>`;
    return out;
  }

  // Type 2e: Table and Notes Completion
  function renderTableAndNotesCompletion(group) {
    let out = "";
    if (group.processes && group.processes.length) {
      out += `<div class="cl-table-wrap" style="margin-bottom:18px;"><table class="cl-table"><thead><tr><th>Mechanism / Reason</th><th>Description</th></tr></thead><tbody>`;
      group.processes.forEach(p => {
        out += `<tr><td><strong>${escapeHtml(p.name)}</strong></td><td>${replaceBlanks(p.detail)}</td></tr>`;
      });
      out += `</tbody></table></div>`;
    }
    if (group.notes && group.notes.length) {
      out += renderNoteCompletion({ sections: group.notes });
    }
    return out;
  }

  // Type 3: MCQ One Choice
  function renderMcqOneChoice(group) {
    const items = group.items || group.questions || [];
    let out = `<div class="cl-mcq-group">`;

    items.forEach(it => {
      const qid = it.id;
      const questionText = it.question || it.text || "";
      out += `
        <div class="cl-mcq-item" id="mcq-item-${qid}">
          <div class="cl-mcq-prompt-row">
            <span class="cl-q-badge" id="badge-${qid}">${qid}</span>
            <span>${escapeHtml(questionText)}</span>
          </div>
          <div class="cl-mcq-options">
      `;

      // Options could be object { "A": "..." } or array [ { letter: "A", text: "..." } ]
      let opts = [];
      if (Array.isArray(it.options)) {
        opts = it.options;
      } else if (typeof it.options === "object" && it.options !== null) {
        opts = Object.keys(it.options).sort().map(k => ({ letter: k, text: it.options[k] }));
      }

      opts.forEach(op => {
        const letter = op.letter;
        const text = op.text;
        const checked = (userAnswers[qid] === letter);
        out += `
          <label class="cl-option-label ${checked ? "selected" : ""}" data-qid="${qid}" data-letter="${letter}">
            <span class="cl-option-letter">${letter}</span>
            <input type="radio" class="cl-option-input" name="mcq-${qid}" value="${letter}" ${checked ? "checked" : ""}>
            <span class="cl-option-text">${escapeHtml(text)}</span>
          </label>
        `;
      });

      out += `</div></div>`;
    });

    out += `</div>`;
    return out;
  }

  // Type 4: Two Choice Checkbox
  function renderTwoChoiceCheckbox(group) {
    const ids = group.ids || group.questionIds || [];
    const prompt = group.prompt || group.question || "";
    const options = group.options || [];

    const badgeHtml = ids.map(id => `<span class="cl-q-badge" id="badge-${id}">${id}</span>`).join(" ");

    let out = `
      <div class="cl-two-choice-box" data-ids='${JSON.stringify(ids)}'>
        <div class="cl-mcq-prompt-row">
          ${badgeHtml}
          <span>${escapeHtml(prompt)}</span>
        </div>
        <div class="cl-mcq-options">
    `;

    options.forEach(op => {
      const letter = op.letter;
      const text = op.text;
      const isSelected = ids.some(id => userAnswers[id] === letter);

      out += `
        <label class="cl-option-label ${isSelected ? "selected" : ""}" data-group-ids='${JSON.stringify(ids)}' data-letter="${letter}">
          <span class="cl-option-letter">${letter}</span>
          <input type="checkbox" class="cl-option-input" value="${letter}" ${isSelected ? "checked" : ""}>
          <span class="cl-option-text">${escapeHtml(text)}</span>
        </label>
      `;
    });

    out += `</div></div>`;
    return out;
  }

  // Type 5: Matching Drag & Drop
  function renderMatchingDragDrop(group) {
    const items = group.items || group.questions || [];
    const options = group.options || [];

    let out = `
      <div class="cl-matching-grid">
        <div class="cl-matching-items-col">
    `;

    items.forEach(it => {
      const qid = it.id || it.qid;
      const label = it.task || it.statement || it.text || it.label || it.question || "";
      const val = userAnswers[qid] || "";
      const displayVal = val ? (getFullOptionForQuestion(qid, val) || val) : "";

      out += `
        <div class="cl-matching-item-row" data-qid="${qid}">
          <span class="cl-matching-item-label">• ${escapeHtml(label)}</span>
          <div class="cl-dropzone ${displayVal ? "has-val" : ""}" data-qid="${qid}">
            <span class="cl-q-badge" id="badge-${qid}">${qid}</span>
            <span class="cl-drop-text">${displayVal ? escapeHtml(displayVal) : "Drop answer here"}</span>
            <input type="hidden" class="cl-hidden-input" data-qid="${qid}" value="${escapeAttr(displayVal)}">
          </div>
        </div>
      `;
    });

    out += `</div>`;

    // Options column (cards)
    out += `
      <div class="cl-matching-options-col">
        <div class="cl-options-col-title">${escapeHtml(group.boxTitle || "Options")}</div>
        <div class="cl-options-hint">Drag and drop or click to place in each blank.</div>
        <div class="cl-draggable-cards-list">
    `;

    options.forEach(op => {
      const letter = op.letter;
      const text = op.text;
      const fullText = `${letter}. ${text}`;
      out += `
        <div class="cl-draggable-card" draggable="true" data-letter="${letter}" data-fulltext="${escapeAttr(fullText)}">
          <strong class="cl-option-letter">${letter}.</strong>
          <span class="cl-option-text">${escapeHtml(text)}</span>
        </div>
      `;
    });

    out += `</div></div></div>`;
    return out;
  }

  // Type 6: Flow Chart Matching
  function renderFlowChartMatching(group) {
    const steps = group.steps || group.flowChartSteps || [];
    const options = group.options || [];

    let out = "";
    if (group.subheading) {
      out += `<div class="cl-flowchart-subheading" style="font-family:'Sora',sans-serif;font-weight:700;font-size:15px;color:var(--navy);margin:14px 0 10px;text-transform:uppercase;letter-spacing:0.04em;">${escapeHtml(group.subheading)}</div>`;
    }

    out += `<div class="cl-flowchart-steps">`;
    steps.forEach((step, idx) => {
      out += `<div class="cl-flowchart-card">${replaceBlanks(step)}</div>`;
      if (idx < steps.length - 1) {
        out += `<div class="cl-flowchart-arrow">&darr;</div>`;
      }
    });
    out += `</div>`;

    // Horizontal options bar
    if (options.length) {
      out += `
        <div class="cl-matching-options-col" style="margin-top: 18px;">
          <div class="cl-options-hint">Drag and drop or click an option below to place it into the corresponding blank:</div>
          <div style="display:flex; gap:10px; flex-wrap:wrap;">
      `;
      options.forEach(op => {
        const fullText = `${op.letter}. ${op.text}`;
        out += `
          <div class="cl-draggable-card" draggable="true" data-letter="${op.letter}" data-fulltext="${escapeAttr(fullText)}" style="margin:0;cursor:pointer;">
            <strong class="cl-option-letter">${op.letter}.</strong>
            <span class="cl-option-text">${escapeHtml(op.text)}</span>
          </div>
        `;
      });
      out += `</div></div>`;
    }

    return out;
  }

  // Type 7: Flow Chart Completion
  function renderFlowChartCompletion(group) {
    const steps = group.steps || group.flowChartSteps || [];
    let out = "";
    if (group.subheading) {
      out += `<div class="cl-flowchart-subheading" style="font-family:'Sora',sans-serif;font-weight:700;font-size:15px;color:var(--navy);margin:14px 0 10px;text-transform:uppercase;letter-spacing:0.04em;">${escapeHtml(group.subheading)}</div>`;
    }
    out += `<div class="cl-flowchart-steps">`;
    steps.forEach((step, idx) => {
      out += `<div class="cl-flowchart-card">${replaceBlanks(step)}</div>`;
      if (idx < steps.length - 1) {
        out += `<div class="cl-flowchart-arrow">&darr;</div>`;
      }
    });
    out += `</div>`;
    return out;
  }

  // Type 8: Map Labelling
  function renderMapLabelling(group) {
    const rawMapImg = group.mapImageUrl || group.imageUrl || group.localMapImageUrl || "/Image/premium-map-1.png";
    const mapImgSrc = (rawMapImg.startsWith("http") && !rawMapImg.includes("r2.dev")) ? `/api/proxy-image?url=${encodeURIComponent(rawMapImg)}` : rawMapImg;
    const items = group.items || group.questions || [];
    let rawOptions = group.options || [];
    if ((!rawOptions || !rawOptions.length) && items.length && items[0].options) {
      rawOptions = items[0].options;
    }
    if (!rawOptions || !rawOptions.length) {
      rawOptions = ["A", "B", "C", "D", "E"];
    }
    const options = rawOptions.map(op => typeof op === "string" ? op : (op.letter || op.value || String(op)));

    let out = `
      <div class="cl-map-grid">
        <div class="cl-map-image-box">
          <img src="${mapImgSrc}" alt="Map diagram" loading="lazy" onerror="if(this.src!=='/Image/premium-map-1.png')this.src='/Image/premium-map-1.png';">
        </div>
        <div class="cl-map-matrix-box">
          <table class="cl-matrix-table">
            <thead>
              <tr>
                <th>Location / Item</th>
                ${options.map(op => `<th>${escapeHtml(op)}</th>`).join("")}
              </tr>
            </thead>
            <tbody>
    `;

    items.forEach(it => {
      const qid = it.id || it.qid;
      const label = it.label || it.text || it.statement || it.question || "";
      const val = userAnswers[qid] || "";

      out += `
        <tr>
          <td><span class="cl-q-badge" id="badge-${qid}">${qid}</span> ${escapeHtml(label)}</td>
      `;

      options.forEach(op => {
        const checked = (val === op);
        out += `
          <td>
            <input type="radio" name="map-${qid}" class="cl-option-input" value="${op}" data-qid="${qid}" ${checked ? "checked" : ""}>
          </td>
        `;
      });

      out += `</tr>`;
    });

    out += `</tbody></table></div></div>`;
    return out;
  }

  // -------------------------------------------------------------
  // 5. User Input Listeners & Answer Recording
  // -------------------------------------------------------------
  function attachEventHandlers() {
    // Text inputs
    partsContainer.addEventListener("input", (e) => {
      const target = e.target;
      if (target.classList.contains("cl-text-input")) {
        const qid = Number(target.dataset.qid);
        userAnswers[qid] = target.value.trim();
        updateDotStatus(qid, !!target.value.trim());
      }
    });

    // Auto-complete text input with full option line when typing letter (e.g. typing "C" -> "C. This was easy to decide on.")
    partsContainer.addEventListener("change", (e) => {
      const target = e.target;
      if (target.classList.contains("cl-text-input")) {
        const qid = Number(target.dataset.qid);
        const val = target.value.trim();
        if (val) {
          const full = getFullOptionForQuestion(qid, val);
          if (full && full !== val) {
            target.value = full;
            userAnswers[qid] = full;
          }
        }
      }
    });

    // MCQ Radio inputs
    partsContainer.addEventListener("change", (e) => {
      const target = e.target;
      if (target.type === "radio" && target.name.startsWith("mcq-")) {
        const qid = Number(target.name.replace("mcq-", ""));
        userAnswers[qid] = target.value;
        updateDotStatus(qid, true);

        // Highlight label
        const itemBox = document.getElementById(`mcq-item-${qid}`);
        if (itemBox) {
          itemBox.querySelectorAll(".cl-option-label").forEach(l => l.classList.remove("selected"));
          const parentLabel = target.closest(".cl-option-label");
          if (parentLabel) parentLabel.classList.add("selected");
        }
      }

      // Map Labelling radio inputs
      if (target.type === "radio" && target.name.startsWith("map-")) {
        const qid = Number(target.dataset.qid);
        userAnswers[qid] = target.value;
        updateDotStatus(qid, true);
      }

      // Two Choice Checkbox
      if (target.type === "checkbox" && target.closest(".cl-two-choice-box")) {
        const box = target.closest(".cl-two-choice-box");
        const ids = JSON.parse(box.dataset.ids || "[]");
        const checkedInputs = Array.from(box.querySelectorAll("input[type='checkbox']:checked"));

        if (checkedInputs.length > ids.length) {
          target.checked = false; // Prevent choosing more than allowed
          alert(`You can only choose ${ids.length} letters for this question.`);
          return;
        }

        // Map checked values to ids (id[0] gets 1st choice, id[1] gets 2nd)
        ids.forEach((id, idx) => {
          if (checkedInputs[idx]) {
            userAnswers[id] = checkedInputs[idx].value;
            updateDotStatus(id, true);
          } else {
            delete userAnswers[id];
            updateDotStatus(id, false);
          }
        });

        // Update selected style on labels
        box.querySelectorAll(".cl-option-label").forEach(lbl => {
          const chk = lbl.querySelector("input[type='checkbox']");
          lbl.classList.toggle("selected", chk && chk.checked);
        });
      }
    });

    // Drag and Drop & Click to Select for Matching
    setupMatchingInteraction();
  }

  function setupMatchingInteraction() {
    let draggedLetter = null;
    let draggedFullText = null;
    let selectedLetter = null;
    let selectedFullText = null;

    partsContainer.addEventListener("dragstart", (e) => {
      const card = e.target.closest(".cl-draggable-card");
      if (card) {
        draggedLetter = card.dataset.letter;
        const textSpan = card.querySelector(".cl-option-text");
        draggedFullText = card.dataset.fulltext || (card.dataset.letter + ". " + (textSpan ? textSpan.textContent.trim() : ""));
        e.dataTransfer.setData("text/plain", draggedFullText);
        e.dataTransfer.setData("text/letter", draggedLetter);
      }
    });

    partsContainer.addEventListener("dragover", (e) => {
      const dropzone = e.target.closest(".cl-dropzone") || e.target.closest(".cl-text-input");
      if (dropzone) {
        e.preventDefault();
        dropzone.classList.add("active-target");
      }
    });

    partsContainer.addEventListener("dragleave", (e) => {
      const dropzone = e.target.closest(".cl-dropzone") || e.target.closest(".cl-text-input");
      if (dropzone) dropzone.classList.remove("active-target");
    });

    partsContainer.addEventListener("drop", (e) => {
      const dropzone = e.target.closest(".cl-dropzone") || e.target.closest(".cl-text-input");
      if (dropzone) {
        e.preventDefault();
        dropzone.classList.remove("active-target");
        const fullText = e.dataTransfer.getData("text/plain") || draggedFullText;
        const letter = e.dataTransfer.getData("text/letter") || draggedLetter;
        if (fullText) {
          if (dropzone.tagName === "INPUT") {
            dropzone.value = fullText;
            const qid = Number(dropzone.dataset.qid);
            userAnswers[qid] = fullText;
            updateDotStatus(qid, true);
          } else {
            assignMatchingAnswer(dropzone, fullText, letter);
          }
        }
      }
    });

    // Click to select/drop
    partsContainer.addEventListener("click", (e) => {
      const card = e.target.closest(".cl-draggable-card");
      if (card) {
        selectedLetter = card.dataset.letter;
        const textSpan = card.querySelector(".cl-option-text");
        selectedFullText = card.dataset.fulltext || (card.dataset.letter + ". " + (textSpan ? textSpan.textContent.trim() : ""));
        partsContainer.querySelectorAll(".cl-draggable-card").forEach(c => c.style.borderColor = "var(--line)");
        card.style.borderColor = "var(--blue)";
        return;
      }

      const dropzone = e.target.closest(".cl-dropzone");
      if (dropzone && selectedFullText) {
        assignMatchingAnswer(dropzone, selectedFullText, selectedLetter);
        selectedFullText = null;
        selectedLetter = null;
        partsContainer.querySelectorAll(".cl-draggable-card").forEach(c => c.style.borderColor = "var(--line)");
        return;
      }

      const inputEl = e.target.closest(".cl-text-input");
      if (inputEl && selectedFullText) {
        inputEl.value = selectedFullText;
        const qid = Number(inputEl.dataset.qid);
        userAnswers[qid] = selectedFullText;
        updateDotStatus(qid, true);
        selectedFullText = null;
        selectedLetter = null;
        partsContainer.querySelectorAll(".cl-draggable-card").forEach(c => c.style.borderColor = "var(--line)");
        return;
      }
    });
  }

  function assignMatchingAnswer(dropzone, fullText, letter) {
    const qid = Number(dropzone.dataset.qid);
    userAnswers[qid] = fullText;
    dropzone.classList.add("has-val");
    const dropText = dropzone.querySelector(".cl-drop-text");
    if (dropText) dropText.textContent = fullText;
    const hiddenIn = dropzone.querySelector(".cl-hidden-input");
    if (hiddenIn) hiddenIn.value = fullText;
    updateDotStatus(qid, true);
  }

  // -------------------------------------------------------------
  // 6. Bottom Navigation (Part Cards & Question Buttons)
  // -------------------------------------------------------------
  let activeQuestion = 1;

  function renderBottomNavigation() {
    if (practiceMode === "full") {
      for (let p = 1; p <= 4; p++) {
        const card = document.getElementById(`bottomPartCard-${p}`);
        if (card) {
          card.style.display = "block";
          card.style.maxWidth = "";
          card.style.margin = "";
          const titleEl = card.querySelector(".cl-part-card-title");
          if (titleEl) titleEl.textContent = `Part ${p}`;
        }
        const container = document.getElementById(`partNums-${p}`);
        if (!container) continue;
        container.innerHTML = "";
        const startQ = (p - 1) * 10 + 1;
        const endQ = p * 10;
        for (let i = startQ; i <= endQ; i++) {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "cl-q-btn";
          btn.id = `q-dot-${i}`;
          btn.textContent = i;
          btn.title = `Question ${i}`;
          btn.addEventListener("click", () => goToQuestion(i));
          container.appendChild(btn);
        }
      }
    } else if (practiceMode === "part") {
      for (let p = 1; p <= 4; p++) {
        const card = document.getElementById(`bottomPartCard-${p}`);
        if (!card) continue;
        if (p === targetPart) {
          card.style.display = "block";
          card.style.maxWidth = "760px";
          card.style.margin = "0 auto";
          card.classList.add("active");
          const titleEl = card.querySelector(".cl-part-card-title");
          if (titleEl) titleEl.textContent = `Part ${targetPart}`;
          const container = document.getElementById(`partNums-${p}`);
          if (container) {
            container.innerHTML = "";
            const startQ = (p - 1) * 10 + 1;
            const endQ = p * 10;
            for (let i = startQ; i <= endQ; i++) {
              const btn = document.createElement("button");
              btn.type = "button";
              btn.className = "cl-q-btn";
              btn.id = `q-dot-${i}`;
              btn.textContent = i;
              btn.title = `Question ${i}`;
              btn.addEventListener("click", () => goToQuestion(i));
              container.appendChild(btn);
            }
          }
        } else {
          card.style.display = "none";
        }
      }
    } else if (practiceMode === "section") {
      for (let p = 1; p <= 4; p++) {
        const card = document.getElementById(`bottomPartCard-${p}`);
        if (!card) continue;
        if (p === targetPart) {
          card.style.display = "block";
          card.style.maxWidth = "760px";
          card.style.margin = "0 auto";
          card.classList.add("active");
          const titleEl = card.querySelector(".cl-part-card-title");
          const qRange = `Questions ${targetQIds[0]}–${targetQIds[targetQIds.length - 1]}`;
          if (titleEl) titleEl.textContent = `${qRange} • ${getFriendlyGroupType(targetGroup ? targetGroup.type : "")}`;
          const container = document.getElementById(`partNums-${p}`);
          if (container) {
            container.innerHTML = "";
            targetQIds.forEach(i => {
              const btn = document.createElement("button");
              btn.type = "button";
              btn.className = "cl-q-btn";
              btn.id = `q-dot-${i}`;
              btn.textContent = i;
              btn.title = `Question ${i}`;
              btn.addEventListener("click", () => goToQuestion(i));
              container.appendChild(btn);
            });
          }
        } else {
          card.style.display = "none";
        }
      }
    }
  }

  function updateDotStatus(qid, isAnswered) {
    const btn = document.getElementById(`q-dot-${qid}`);
    if (btn) btn.classList.toggle("answered", isAnswered);
  }

  function goToQuestion(qid) {
    if (practiceMode !== "full") {
      if (!targetQIds.includes(qid)) return;
    } else {
      if (qid < 1 || qid > 40) return;
    }
    activeQuestion = qid;
    const tPart = Math.ceil(qid / 10);

    if (activePart !== tPart) {
      switchPart(tPart, false);
    }

    // Update focused button
    const allowed = (practiceMode === "full") ? Array.from({ length: 40 }, (_, i) => i + 1) : targetQIds;
    allowed.forEach(i => {
      const b = document.getElementById(`q-dot-${i}`);
      if (b) b.classList.toggle("current-focus", i === qid);
    });

    setTimeout(() => {
      const el = document.getElementById(`badge-${qid}`) || 
                 document.querySelector(`[data-qid="${qid}"]`) || 
                 document.getElementById(`mcq-item-${qid}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.remove("cl-q-pulse");
        void el.offsetWidth;
        el.classList.add("cl-q-pulse");
      }
    }, 120);
  }

  function navigatePrev() {
    if (practiceMode === "full") {
      if (activeQuestion > 1) goToQuestion(activeQuestion - 1);
    } else {
      const idx = targetQIds.indexOf(activeQuestion);
      if (idx > 0) goToQuestion(targetQIds[idx - 1]);
    }
  }

  function navigateNext() {
    if (practiceMode === "full") {
      if (activeQuestion < 40) goToQuestion(activeQuestion + 1);
    } else {
      const idx = targetQIds.indexOf(activeQuestion);
      if (idx >= 0 && idx < targetQIds.length - 1) goToQuestion(targetQIds[idx + 1]);
    }
  }

  function switchPart(partNum, scrollToTop = true) {
    if (practiceMode !== "full" && partNum !== targetPart) return;
    activePart = partNum;
    for (let p = 1; p <= 4; p++) {
      const panel = document.getElementById(`part-panel-${p}`);
      if (panel) panel.classList.toggle("active", p === partNum);
      const card = document.getElementById(`bottomPartCard-${p}`);
      if (card && practiceMode === "full") card.classList.toggle("active", p === partNum);
    }

    // Switch or init audio for this part
    initPartAudio(partNum);

    // If master audio and full mode, seek to part start
    if (practiceMode === "full" && bookParam >= 2000) {
      const testKey = `${bookParam}_${testParam}`;
      const pRange = recentRealTestPartRanges[testKey]?.[partNum];
      if (pRange && currentAudio) {
        const pStart = pRange.start || 0;
        if (Math.abs(currentAudio.currentTime - pStart) > 10) {
          try { currentAudio.currentTime = pStart; } catch(e) {}
        }
      }
    } else if ((practiceMode === "part" || practiceMode === "section") && currentAudio) {
      if (Math.abs(currentAudio.currentTime - sectionStartTime) > 1) {
        try { currentAudio.currentTime = sectionStartTime; } catch(e) {}
      }
    }

    if (scrollToTop) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  // Expose methods to window
  window.clV2 = window.clV2 || {};
  window.clV2.switchPart = switchPart;
  window.clV2.goToQuestion = goToQuestion;
  window.clV2.navigatePrev = navigatePrev;
  window.clV2.navigateNext = navigateNext;

  // -------------------------------------------------------------
  // 7. Test Submission & Evaluation Logic
  // -------------------------------------------------------------
  if (finishBtn) {
    finishBtn.addEventListener("click", () => {
      if (submitModal) submitModal.style.display = "flex";
    });
  }

  if (cancelSubmitBtn) {
    cancelSubmitBtn.addEventListener("click", () => {
      if (submitModal) submitModal.style.display = "none";
    });
  }

  if (confirmSubmitBtn) {
    confirmSubmitBtn.addEventListener("click", () => {
      if (submitModal) submitModal.style.display = "none";
      submitTest();
    });
  }

  function norm(str) {
    return String(str || "")
      .trim()
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
      .replace(/\s+/g, " ");
  }

  function isAnswerCorrect(userAns, officialTarget, qid) {
    if (!userAns || !officialTarget) return false;
    const uNorm = norm(userAns);
    if (!uNorm) return false;

    // Official answers can be separated by '/' or in array
    const targets = Array.isArray(officialTarget) ? officialTarget : String(officialTarget).split("/");
    return targets.some(target => {
      const tNorm = norm(target);
      if (uNorm === tNorm) return true;

      // If official target is a single letter (e.g. "C", "A")
      if (/^[a-z]$/i.test(target.trim())) {
        const targetLetter = target.trim().toUpperCase();
        // Check if user answer starts with target letter followed by period, space, hyphen, or end of string
        const firstLetterMatch = userAns.trim().match(/^([A-Za-z])(?:[\.\s\-\:\)]|$)/);
        if (firstLetterMatch && firstLetterMatch[1].toUpperCase() === targetLetter) {
          return true;
        }
        // Match against option full text or text without letter
        if (qid && typeof getFullOptionForQuestion === "function") {
          const fullOp = getFullOptionForQuestion(qid, targetLetter);
          if (fullOp) {
            if (norm(userAns) === norm(fullOp)) return true;
            const opOnlyText = fullOp.replace(/^[A-Za-z]\s*[\.\-\:]?\s*/, "");
            if (norm(userAns) === norm(opOnlyText)) return true;
          }
        }
      }
      return false;
    });
  }

  function calculateBand(score) {
    if (score >= 39) return 9.0;
    if (score >= 37) return 8.5;
    if (score >= 35) return 8.0;
    if (score >= 32) return 7.5;
    if (score >= 30) return 7.0;
    if (score >= 26) return 6.5;
    if (score >= 23) return 6.0;
    if (score >= 18) return 5.5;
    if (score >= 16) return 5.0;
    if (score >= 13) return 4.5;
    if (score >= 10) return 4.0;
    return 3.5;
  }

  function submitTest() {
    isSubmitted = true;
    stopTimer();

    // Pause audio
    if (currentAudio) currentAudio.pause();

    const officialAnswers = testData.answers || {};
    let correctCount = 0;
    const mistakeDetails = {};

    const qIdsToScore = (practiceMode === "full")
      ? Array.from({ length: 40 }, (_, i) => i + 1)
      : targetQIds;

    qIdsToScore.forEach(q => {
      const uAns = userAnswers[q] || "";
      const oAns = officialAnswers[String(q)] || officialAnswers[q] || "";
      const ok = isAnswerCorrect(uAns, oAns, q);

      if (ok) {
        correctCount++;
      } else {
        const fullOAns = getFullOptionForQuestion(q, oAns) || oAns;
        const fullUAns = getFullOptionForQuestion(q, uAns) || uAns;
        mistakeDetails[q] = {
          userAnswer: fullUAns || "(No Answer)",
          correctAnswer: fullOAns
        };
      }
    });

    const totalPossible = qIdsToScore.length;
    const bandScore = (practiceMode === "full") ? calculateBand(correctCount) : null;

    // Enable Split-Screen Review Mode (Script on Left, Questions on Right)
    document.body.classList.add("cl-review-mode");
    const partsToEnable = (practiceMode === "full") ? [1, 2, 3, 4] : [targetPart];
    partsToEnable.forEach(p => {
      const tCol = document.getElementById(`part-transcript-col-${p}`);
      if (tCol) tCol.style.display = "block";
      const resizer = document.getElementById(`split-resizer-${p}`);
      if (resizer) resizer.style.display = "flex";
    });

    // Initialize Draggable Split-Screen Resizers
    initSplitResizers();

    // Render Answer Highlighting on page & Add explanations
    applyReviewOnQuestions(officialAnswers, qIdsToScore);

    // Build Transcript with highlighted evidence
    buildTranscriptsWithEvidence();

    // Show result scorecard
    showResultScorecard(correctCount, totalPossible, bandScore);

    // Automatically record student practice in dashboard
    try {
      const u = JSON.parse(localStorage.getItem('user') || 'null');
      const seriesPrefix = (bookParam >= 2000) ? 'Recent Actual' : `Cambridge ${bookParam}`;
      let testTitle = `${seriesPrefix} Listening Test ${testParam}`;
      if (practiceMode === "part") {
        testTitle = `${seriesPrefix} Listening Test ${testParam} (Part ${targetPart})`;
      } else if (practiceMode === "section" && targetGroup) {
        const qIds = targetGroup.questionIds || targetGroup.ids || [];
        testTitle = `${seriesPrefix} Listening Test ${testParam} (Q${qIds[0]}-${qIds[qIds.length - 1]})`;
      }

      fetch('/api/student/record-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: u ? u.email : '',
          testType: (bookParam >= 2000) ? 'Recent Listening Actual Test' : (practiceMode === 'full' ? 'Cambridge Listening' : 'Cambridge Listening Practice'),
          module: 'listening',
          testId: `cambridge-listening-${bookParam}-${testParam}-${practiceMode}`,
          title: testTitle,
          totalQuestions: totalPossible,
          listeningScore: correctCount,
          listeningBand: Number(bandScore) || (totalPossible > 0 ? Math.round((correctCount / totalPossible) * 9 * 2) / 2 : 0),
          overallBand: Number(bandScore) || (totalPossible > 0 ? Math.round((correctCount / totalPossible) * 9 * 2) / 2 : 0),
          answers: userAnswers,
          mistakes: mistakeDetails
        })
      }).catch(err => console.warn('Listening record sync error:', err));
    } catch(e) {}

    // Hide transcript toggle buttons in split view
    partsToEnable.forEach(p => {
      const btn = document.getElementById(`partTranscriptToggleBtn-${p}`);
      if (btn) btn.style.display = "none";
    });
  }

  // -------------------------------------------------------------
  // 8. Review Mode: Inline Highlighting, Explanations & Traps
  // -------------------------------------------------------------
  function applyReviewOnQuestions(officialAnswers, qIdsToReview) {
    const rawExplanations = testData.explanations || {};
    const rawTraps = testData.traps || {};
    const evidencePhrases = testData.evidencePhrases || {};

    const explanations = {};
    const traps = {};

    if (Array.isArray(rawExplanations)) {
      rawExplanations.forEach((item, idx) => {
        if (!item) return;
        const qId = item.qNum || item.questionNumber || (idx + 1);
        if (typeof item === 'string') {
          explanations[String(qId)] = item;
        } else {
          explanations[String(qId)] = item.explanation || item.text || item.expl || "";
          if (item.trap) traps[String(qId)] = item.trap;
        }
      });
    } else if (typeof rawExplanations === 'object') {
      Object.keys(rawExplanations).forEach(k => {
        const item = rawExplanations[k];
        if (typeof item === 'string') {
          explanations[k] = item;
        } else if (item && typeof item === 'object') {
          explanations[k] = item.explanation || item.text || item.expl || "";
          if (item.trap) traps[k] = item.trap;
        }
      });
    }

    if (Array.isArray(rawTraps)) {
      rawTraps.forEach((item, idx) => {
        if (!item) return;
        const qId = item.qNum || item.questionNumber || (idx + 1);
        traps[String(qId)] = typeof item === 'string' ? item : (item.trap || item.text || "");
      });
    } else if (typeof rawTraps === 'object') {
      Object.keys(rawTraps).forEach(k => {
        const item = rawTraps[k];
        traps[k] = typeof item === 'string' ? item : (item?.trap || item?.text || "");
      });
    }

    const qList = qIdsToReview || ((practiceMode === "full") ? Array.from({ length: 40 }, (_, i) => i + 1) : targetQIds);

    qList.forEach(q => {
      const uAns = userAnswers[q] || "";
      const oAns = officialAnswers[String(q)] || officialAnswers[q] || "";
      const ok = isAnswerCorrect(uAns, oAns, q);
      const fullOAns = getFullOptionForQuestion(q, oAns) || oAns;
      const fullUAns = getFullOptionForQuestion(q, uAns) || uAns;

      // Update bottom question button color
      const dotBtn = document.getElementById(`q-dot-${q}`);
      if (dotBtn) {
        dotBtn.classList.remove("answered");
        dotBtn.classList.add(ok ? "correct" : "wrong");
      }

      // (A) Text inputs
      const textInput = document.querySelector(`.cl-text-input[data-qid="${q}"]`);
      if (textInput) {
        textInput.classList.add(ok ? "input-correct" : "input-wrong");
        textInput.disabled = true;

        if (ok && fullUAns) {
          textInput.value = fullUAns;
        }

        if (!ok) {
          const badge = document.createElement("span");
          badge.className = "cl-correct-badge";
          badge.innerHTML = `<i class="bi bi-check2"></i> ${escapeHtml(fullOAns)}`;
          textInput.insertAdjacentElement("afterend", badge);
        }
      }

      // (B) Dropzones
      const dropzone = document.querySelector(`.cl-dropzone[data-qid="${q}"]`);
      if (dropzone) {
        dropzone.classList.add(ok ? "input-correct" : "input-wrong");
        if (ok && fullUAns) {
          const dropText = dropzone.querySelector(".cl-drop-text");
          if (dropText) dropText.textContent = fullUAns;
        }
        if (!ok) {
          const badge = document.createElement("span");
          badge.className = "cl-correct-badge";
          badge.innerHTML = `<i class="bi bi-check2"></i> ${escapeHtml(fullOAns)}`;
          dropzone.appendChild(badge);
        }
      }

      // (C) Radios (MCQ / Map)
      const mcqItem = document.getElementById(`mcq-item-${q}`);
      if (mcqItem) {
        mcqItem.querySelectorAll(".cl-option-label").forEach(lbl => {
          const letter = lbl.dataset.letter;
          if (letter === oAns) {
            lbl.classList.add("input-correct");
          } else if (letter === uAns && !ok) {
            lbl.classList.add("input-wrong");
          }
        });
      }

      // (D) Inject Explanation & Trap Card beneath question element
      const badgeEl = document.getElementById(`badge-${q}`);
      if (badgeEl) {
        const twoChoiceBox = badgeEl.closest(".cl-two-choice-box");

        // Handle Two-Choice Box Explanation (single clean box per pair)
        if (twoChoiceBox) {
          const ids = JSON.parse(twoChoiceBox.dataset.ids || "[]");
          const groupKey = `expl-box-group-${ids.join("-")}`;
          if (!document.getElementById(groupKey)) {
            // Collect correct answer letters
            const pairLetters = [];
            ids.forEach(id => {
              const raw = officialAnswers[String(id)] || officialAnswers[id] || "";
              const arr = Array.isArray(raw) ? raw : String(raw).split("/");
              arr.forEach(l => {
                const cl = String(l).trim().toUpperCase();
                if (cl && !pairLetters.includes(cl)) pairLetters.push(cl);
              });
            });

            const pairFullOptions = pairLetters.map(l => getFullOptionForQuestion(ids[0], l) || l);
            const explText = explanations[String(ids[0])] || explanations[ids[0]] || "";
            const trapText = traps[String(ids[0])] || traps[ids[0]] || "";

            const explDiv = document.createElement("div");
            explDiv.className = "cl-expl-box";
            explDiv.id = groupKey;
            explDiv.innerHTML = `
              <div class="cl-expl-header">
                <span class="cl-expl-title">
                  <i class="bi bi-lightbulb-fill" style="color:#eab308;"></i> Questions ${ids.join(" & ")} Explanation
                </span>
                <button type="button" class="cl-btn-locate" onclick="window.clV2.locateInScript(${ids[0]})" style="background:var(--blue-light); border:1px solid var(--blue-border); color:var(--blue); font-size:11.5px; font-weight:700; padding:2px 7px; border-radius:4px; cursor:pointer;">
                  <i class="bi bi-search"></i> Locate in Script
                </button>
              </div>
              <div class="cl-expl-correct-row" style="margin:6px 0 10px; padding:7px 12px; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:6px; font-size:13px; color:#166534; font-weight:600;">
                <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
                  <i class="bi bi-check-circle-fill" style="color:#22c55e;"></i>
                  <span><strong>Correct Answers (${pairLetters.join(", ")}):</strong></span>
                </div>
                <div style="padding-left:22px; font-weight:500; line-height:1.5;">
                  ${pairFullOptions.map(fo => `<div>• ${escapeHtml(fo)}</div>`).join("")}
                </div>
              </div>
              ${explText ? `<p class="cl-expl-text">${escapeHtml(explText)}</p>` : ""}
              ${trapText ? `<div class="cl-trap-alert"><i class="bi bi-exclamation-triangle-fill"></i> <span><strong>Trap Alert:</strong> ${escapeHtml(trapText)}</span></div>` : ""}
            `;
            twoChoiceBox.insertAdjacentElement("afterend", explDiv);
          }
        } else {
          // Standard Question Explanation injection
          const explText = explanations[String(q)] || explanations[q] || "";
          const trapText = traps[String(q)] || traps[q] || "";
          const evidence = evidencePhrases[String(q)] || evidencePhrases[q] || "";

          if (explText || trapText || evidence || fullOAns) {
            const parentItem = badgeEl.closest(".cl-flowchart-card") || badgeEl.closest(".cl-mcq-item") || badgeEl.closest(".cl-matching-item-row") || badgeEl.closest("li") || badgeEl.closest("tr") || badgeEl.parentElement;
            if (parentItem) {
              const explDiv = document.createElement("div");
              explDiv.className = "cl-expl-box";
              explDiv.id = `expl-box-${q}`;
              explDiv.innerHTML = `
                <div class="cl-expl-header">
                  <span class="cl-expl-title">
                    <i class="bi bi-lightbulb-fill" style="color:#eab308;"></i> Q${q} Explanation
                  </span>
                  <button type="button" class="cl-btn-locate" onclick="window.clV2.locateInScript(${q})" style="background:var(--blue-light); border:1px solid var(--blue-border); color:var(--blue); font-size:11.5px; font-weight:700; padding:2px 7px; border-radius:4px; cursor:pointer;">
                    <i class="bi bi-search"></i> Locate in Script
                  </button>
                </div>
                ${fullOAns ? `
                  <div class="cl-expl-correct-row" style="margin:6px 0 10px; padding:7px 12px; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:6px; font-size:13px; color:#166534; font-weight:600; display:flex; align-items:center; gap:8px;">
                    <i class="bi bi-check-circle-fill" style="color:#22c55e; font-size:15px; flex-shrink:0;"></i>
                    <span><strong>Correct Answer:</strong> ${escapeHtml(fullOAns)}</span>
                  </div>
                ` : ""}
                ${explText ? `<p class="cl-expl-text">${escapeHtml(explText)}</p>` : ""}
                ${trapText ? `<div class="cl-trap-alert"><i class="bi bi-exclamation-triangle-fill"></i> <span><strong>Trap:</strong> ${escapeHtml(trapText)}</span></div>` : ""}
              `;

              if (parentItem.tagName === "TR") {
                const tr = document.createElement("tr");
                tr.className = "cl-expl-tr";
                const td = document.createElement("td");
                td.colSpan = 100;
                td.appendChild(explDiv);
                tr.appendChild(td);
                parentItem.insertAdjacentElement("afterend", tr);
              } else if (parentItem.tagName === "LI" || parentItem.classList.contains("cl-flowchart-card")) {
                parentItem.appendChild(explDiv);
              } else {
                parentItem.insertAdjacentElement("afterend", explDiv);
              }
            }
          }
        }
      }
    });

    // (E) Two Choice Checkboxes Review Styling (e.g. Questions 21-22, 23-24)
    document.querySelectorAll(".cl-two-choice-box").forEach(box => {
      const ids = JSON.parse(box.dataset.ids || "[]");
      if (!ids.length) return;

      // Extract all valid answers for this pair
      const validLetters = [];
      ids.forEach(id => {
        const raw = officialAnswers[String(id)] || officialAnswers[id] || "";
        const parts = Array.isArray(raw) ? raw : String(raw).split("/");
        parts.forEach(p => {
          const cl = String(p).trim().toUpperCase();
          if (cl && !validLetters.includes(cl)) validLetters.push(cl);
        });
      });

      // User selections for this group
      const userSelectedLetters = ids.map(id => (userAnswers[id] || "").trim().toUpperCase()).filter(Boolean);

      // Highlight each option label
      box.querySelectorAll(".cl-option-label").forEach(lbl => {
        const letter = (lbl.dataset.letter || "").trim().toUpperCase();
        const chk = lbl.querySelector("input[type='checkbox']");
        if (chk) chk.disabled = true;

        if (validLetters.includes(letter)) {
          lbl.classList.add("input-correct");
          if (!lbl.querySelector(".cl-correct-badge")) {
            const badge = document.createElement("span");
            badge.className = "cl-correct-badge";
            badge.innerHTML = `<i class="bi bi-check2"></i> Correct`;
            lbl.appendChild(badge);
          }
        } else if (userSelectedLetters.includes(letter)) {
          lbl.classList.add("input-wrong");
        }
      });

      // Add a summary banner in prompt row showing correct letters
      const promptRow = box.querySelector(".cl-mcq-prompt-row");
      if (promptRow && !box.querySelector(".cl-two-choice-ans-banner")) {
        const banner = document.createElement("div");
        banner.className = "cl-two-choice-ans-banner";
        banner.innerHTML = `<span class="cl-badge-correct-ans"><i class="bi bi-check-circle-fill"></i> Correct Answers: <strong>${validLetters.join(" and ")}</strong></span>`;
        promptRow.appendChild(banner);
      }
    });
  }

  // -------------------------------------------------------------
  // 9. Audio Script Placement & Guaranteed Evidence Highlighting
  // -------------------------------------------------------------
  function escapeTranscriptText(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function buildEvidenceRegex(ev, strict = true) {
    let clean = String(ev).trim();
    if (!strict) {
      clean = clean.replace(/^[^\w]+|[^\w]+$/g, "");
    }
    const rawTokens = clean.split(/\s+/).filter(Boolean);
    const pattern = rawTokens.map(token => {
      let escaped = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      escaped = escaped.replace(/['’]/g, "(?:['’]|&#039;|&apos;)");
      escaped = escaped.replace(/[-–—]/g, "[-–—]");
      escaped = escaped.replace(/[\"“”]/g, '(?:[\"“”]|&quot;)');
      return escaped;
    }).join("\\s+");

    return new RegExp(`(${pattern})`, "i");
  }

  // Smart split evidence for Two Choice Questions (e.g. Cambridge 21 Test 1)
  const customTwoChoiceEvidence = {
    "21_1": {
      "21": { text: "I especially liked the way her lecture focused on more long-term issues. PHIL: Yes, things that aren't currently receiving widespread attention but are likely to be important in the future. That impressed me too", tag: "Ans: D" },
      "22": { text: "The examples she gave were at a more global level, and they really made it clear to me just how wide-ranging the threats to ocean biodiversity are. LUCY: Yes, me too", tag: "Ans: B" },
      "23": { text: "I'd have thought it was quite unusual to have so many experts working together. LUCY: Yeah, and from such different backgrounds. Must have been a really exciting team to work with", tag: "Ans: E" },
      "24": { text: "And the description of improvements in systems used for tracking marine animals and things like robots were really interesting. LUCY: Yes, and her description of how robotics can be used to investigate threats to biodiversity", tag: "Ans: C" }
    }
  };

  function extractSectionSnippet(part, qIds) {
    const fullText = getPartTranscript(testData.transcripts, part);
    if (!fullText) return "";
    if (qIds.length >= 10) return fullText; // Full part

    const testKey = `${bookParam}_${testParam}`;
    const testCustomEv = customTwoChoiceEvidence[testKey] || {};
    const evidencePhrases = testData.evidencePhrases || {};

    let earliestFound = Infinity;
    let latestEvEnd = -1;

    qIds.forEach(q => {
      const ev = (testCustomEv[String(q)] && testCustomEv[String(q)].text) || evidencePhrases[String(q)] || "";
      if (!ev) return;
      const searchKey = String(ev).slice(0, 25).trim();
      if (!searchKey) return;
      const firstPos = fullText.indexOf(searchKey);
      if (firstPos !== -1 && firstPos < earliestFound) {
        earliestFound = firstPos;
      }
      const lastPos = fullText.lastIndexOf(searchKey);
      if (lastPos !== -1) {
        const evEnd = lastPos + String(ev).length;
        if (evEnd > latestEvEnd) latestEvEnd = evEnd;
      }
    });

    let startIdx = 0;
    let endIdx = fullText.length;

    if (earliestFound < Infinity) {
      // Look backwards for speaker marker (e.g. WOMAN: or MAN:)
      const before = fullText.slice(Math.max(0, earliestFound - 200), earliestFound);
      const speakerMatch = [...before.matchAll(/([A-Z]{2,}\s*:)/g)];
      if (speakerMatch.length) {
        const lastSpeaker = speakerMatch[speakerMatch.length - 1];
        startIdx = Math.max(0, earliestFound - 200 + lastSpeaker.index);
      } else {
        startIdx = Math.max(0, earliestFound - 50);
      }
    }

    if (latestEvEnd > -1 && latestEvEnd > startIdx) {
      // Look forward for next sentence ending or speaker marker
      const after = fullText.slice(latestEvEnd, Math.min(fullText.length, latestEvEnd + 200));
      const nextSentence = after.match(/\.\s+[A-Z]/);
      if (nextSentence) {
        endIdx = latestEvEnd + nextSentence.index + 1;
      } else {
        endIdx = Math.min(fullText.length, latestEvEnd + 80);
      }
    }

    const snippet = fullText.slice(startIdx, endIdx).trim();
    return snippet || fullText;
  }

  function buildTranscriptsWithEvidence() {
    const transcripts = testData.transcripts || {};
    const evidencePhrases = testData.evidencePhrases || {};
    const testKey = `${bookParam}_${testParam}`;
    const testCustomEv = customTwoChoiceEvidence[testKey] || {};

    const partsToBuild = (practiceMode === "full") ? [1, 2, 3, 4] : [targetPart];

    partsToBuild.forEach(p => {
      const transcriptCol = document.getElementById(`part-transcript-col-${p}`);
      if (!transcriptCol) return;

      let rawText = "";
      if (practiceMode === "section") {
        rawText = extractSectionSnippet(p, targetQIds);
      } else {
        rawText = getPartTranscript(transcripts, p);
      }

      if (!rawText) {
        transcriptCol.innerHTML = `<div class="cl-transcript-container"><em>No audio script available for Part ${p}</em></div>`;
        return;
      }

      // Safe escape & < >
      let textContent = escapeTranscriptText(rawText);

      // Collect evidence phrases for questions to highlight
      const qIdsToHighlight = (practiceMode === "section")
        ? targetQIds
        : (practiceMode === "part" ? targetQIds : Array.from({ length: 10 }, (_, i) => (p - 1) * 10 + i + 1));

      const qList = [];
      qIdsToHighlight.forEach(q => {
        let ev = "";
        let tag = "";
        if (testCustomEv[String(q)]) {
          ev = testCustomEv[String(q)].text;
          tag = testCustomEv[String(q)].tag;
        } else {
          ev = evidencePhrases[String(q)] || evidencePhrases[q] || "";
        }
        if (ev) qList.push({ q, ev: String(ev).trim(), tag });
      });

      // Sort questions by length descending to match longer phrases first
      qList.sort((a, b) => b.ev.length - a.ev.length);

      for (const item of qList) {
        let regex = buildEvidenceRegex(item.ev, true);
        if (!regex.test(textContent)) {
          regex = buildEvidenceRegex(item.ev, false);
        }

        try {
          if (regex.test(textContent)) {
            textContent = textContent.replace(regex, (match) => {
              const tagLabel = item.tag ? `Q${item.q} (${item.tag})` : `Q${item.q}`;
              return `<mark class="cl-evidence-highlight" id="evidence-q-${item.q}" data-qid="${item.q}" onclick="window.clV2.focusQuestion(${item.q})"><span class="cl-evidence-q-tag">${tagLabel}</span>${match}</mark>`;
            });
          } else {
            console.warn(`Evidence for Q${item.q} could not be matched in Part ${p}`);
          }
        } catch (e) {
          console.warn("Evidence regex error for Q" + item.q, e);
        }
      }

      let headerTitle = `Part ${p} Audio Transcript`;
      let headerSubtitle = `${qIdsToHighlight.length}/${qIdsToHighlight.length} Answers highlighted`;
      if (practiceMode === "section") {
        headerTitle = `Questions ${targetQIds[0]}–${targetQIds[targetQIds.length - 1]} Audio Script`;
        headerSubtitle = `Section Evidence Highlighted (${getFriendlyGroupType(targetGroup ? targetGroup.type : "")})`;
      }

      transcriptCol.innerHTML = `
        <div class="cl-transcript-container">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; border-bottom:1px solid var(--line); padding-bottom:8px;">
            <h4 style="font-family:'Sora',sans-serif; color:var(--navy); font-weight:700;"><i class="bi bi-file-text-fill"></i> ${headerTitle}</h4>
            <span style="font-size:12px; color:var(--muted);"><i class="bi bi-check-circle-fill" style="color:var(--green);"></i> ${headerSubtitle}</span>
          </div>
          <div style="line-height:2.2; font-size:14.5px;">${textContent}</div>
        </div>
      `;
    });
  }

  // Toggle Transcript View
  window.clV2.toggleTranscriptView = function (partNum) {
    const transcriptCol = document.getElementById(`part-transcript-col-${partNum}`);
    if (!transcriptCol) return;

    if (!transcriptCol.innerHTML.trim() || transcriptCol.innerHTML.includes("No audio script")) {
      buildTranscriptsWithEvidence();
      initSplitResizers();
    }

    const grid = document.getElementById(`part-content-grid-${partNum}`);
    const resizer = document.getElementById(`split-resizer-${partNum}`);
    const isVisible = (transcriptCol.style.display !== "none");

    if (isVisible) {
      transcriptCol.style.display = "none";
      if (resizer) resizer.style.display = "none";
      if (grid) grid.classList.remove("cl-script-open");
      document.body.classList.remove("has-script-open");
    } else {
      transcriptCol.style.display = "block";
      if (resizer) resizer.style.display = "flex";
      if (grid) grid.classList.add("cl-script-open");
      document.body.classList.add("has-script-open");
    }

    const btn = document.querySelector(`#partTranscriptToggleBtn-${partNum} button`);
    if (btn) {
      btn.innerHTML = isVisible
        ? `<i class="bi bi-file-text"></i> Show Audio Script`
        : `<i class="bi bi-eye-slash"></i> Hide Audio Script`;
    }
  };

  // Scroll to Evidence in Script
  window.clV2.locateInScript = function (qid) {
    const partNum = Math.ceil(qid / 10);
    switchPart(partNum);

    const transcriptCol = document.getElementById(`part-transcript-col-${partNum}`);
    if (transcriptCol && transcriptCol.style.display === "none") {
      window.clV2.toggleTranscriptView(partNum);
    }

    setTimeout(() => {
      const evEl = document.getElementById(`evidence-q-${qid}`);
      if (evEl) {
        evEl.scrollIntoView({ behavior: "smooth", block: "center" });
        evEl.style.transition = "background-color 0.3s";
        evEl.style.backgroundColor = "#f97316";
        setTimeout(() => { evEl.style.backgroundColor = "#fef08a"; }, 1200);
      } else {
        alert(`Evidence for Question ${qid} located in Part ${partNum} script.`);
      }
    }, 200);
  };

  // Focus Question from Script Click
  window.clV2.focusQuestion = function (qid) {
    const badge = document.getElementById(`badge-${qid}`);
    if (badge) {
      badge.scrollIntoView({ behavior: "smooth", block: "center" });
      badge.style.boxShadow = "0 0 0 3px var(--red)";
      setTimeout(() => { badge.style.boxShadow = ""; }, 1500);
    }
  };

  // -------------------------------------------------------------
  // 9.1 Draggable Split-Screen Resizer Logic
  // -------------------------------------------------------------
  function initSplitResizers() {
    for (let p = 1; p <= 4; p++) {
      const resizer = document.getElementById(`split-resizer-${p}`);
      const grid = document.getElementById(`part-content-grid-${p}`);
      const tCol = document.getElementById(`part-transcript-col-${p}`);
      const qCol = document.getElementById(`part-questions-col-${p}`);
      if (!resizer || !grid || !tCol || !qCol) continue;

      let isDragging = false;

      const startDrag = (e) => {
        isDragging = true;
        document.body.classList.add("cl-is-resizing");
        resizer.classList.add("active");
        e.preventDefault();

        const onMove = (moveEvt) => {
          if (!isDragging) return;
          const clientX = moveEvt.touches ? moveEvt.touches[0].clientX : moveEvt.clientX;
          const rect = grid.getBoundingClientRect();
          const offsetX = clientX - rect.left;
          let pct = (offsetX / rect.width) * 100;
          if (pct < 20) pct = 20;
          if (pct > 80) pct = 80;

          tCol.style.width = `calc(${pct}% - 12px)`;
          tCol.style.flex = "none";
          qCol.style.width = `calc(${100 - pct}% - 12px)`;
          qCol.style.flex = "none";
        };

        const stopDrag = () => {
          if (!isDragging) return;
          isDragging = false;
          document.body.classList.remove("cl-is-resizing");
          resizer.classList.remove("active");
          window.removeEventListener("mousemove", onMove);
          window.removeEventListener("mouseup", stopDrag);
          window.removeEventListener("touchmove", onMove);
          window.removeEventListener("touchend", stopDrag);
        };

        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", stopDrag);
        window.addEventListener("touchmove", onMove, { passive: false });
        window.addEventListener("touchend", stopDrag);
      };

      resizer.addEventListener("mousedown", startDrag);
      resizer.addEventListener("touchstart", startDrag, { passive: true });
    }
  }

  // -------------------------------------------------------------
  // 10. Result Scorecard Modal
  // -------------------------------------------------------------
  function showResultScorecard(correct, totalPossible, band) {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    const timeFormatted = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    const pct = Math.round((correct / totalPossible) * 100);

    const overlay = document.createElement("div");
    overlay.className = "cl-modal-overlay";
    overlay.id = "scorecardOverlay";

    let titleText = "Practice Complete!";
    let subtitleText = `${escapeHtml(testData.title || `Cambridge ${bookParam} Test ${testParam}`)} &nbsp;|&nbsp; Time: ${timeFormatted}`;
    let scoreDisplayHtml = "";

    if (practiceMode === "full") {
      titleText = "Full Mock Test Complete!";
      scoreDisplayHtml = `
        <div style="background:var(--surface); border:1.5px solid var(--line); border-radius:14px; padding:20px; margin-bottom:20px;">
          <div style="font-size:12px; font-weight:800; text-transform:uppercase; color:var(--muted); letter-spacing:0.05em; margin-bottom:4px;">
            IELTS Band Score
          </div>
          <div style="font-family:'Sora',sans-serif; font-size:46px; font-weight:800; color:var(--red); line-height:1;">
            ${(band || 0).toFixed(1)}
          </div>
          <div style="font-size:14px; font-weight:600; color:var(--navy); margin-top:10px;">
            Score: ${correct} / ${totalPossible} (${pct}% Accuracy)
          </div>
        </div>
      `;
    } else if (practiceMode === "part") {
      titleText = `Part ${targetPart} Practice Complete!`;
      subtitleText = `Cambridge ${bookParam} Test ${testParam} • Part ${targetPart} &nbsp;|&nbsp; Time: ${timeFormatted}`;
      scoreDisplayHtml = `
        <div style="background:var(--surface); border:1.5px solid var(--line); border-radius:14px; padding:20px; margin-bottom:20px;">
          <div style="font-size:12px; font-weight:800; text-transform:uppercase; color:var(--muted); letter-spacing:0.05em; margin-bottom:4px;">
            Part Accuracy
          </div>
          <div style="font-family:'Sora',sans-serif; font-size:46px; font-weight:800; color:var(--blue); line-height:1;">
            ${pct}%
          </div>
          <div style="font-size:14px; font-weight:600; color:var(--navy); margin-top:10px;">
            Score: ${correct} / ${totalPossible} Questions
          </div>
        </div>
      `;
    } else if (practiceMode === "section") {
      const qRange = `Questions ${targetQIds[0]}–${targetQIds[targetQIds.length - 1]}`;
      const fType = getFriendlyGroupType(targetGroup ? targetGroup.type : "");
      titleText = `${qRange} Practice Complete!`;
      subtitleText = `${fType} • Cambridge ${bookParam} Test ${testParam} &nbsp;|&nbsp; Time: ${timeFormatted}`;
      scoreDisplayHtml = `
        <div style="background:var(--surface); border:1.5px solid var(--line); border-radius:14px; padding:20px; margin-bottom:20px;">
          <div style="font-size:12px; font-weight:800; text-transform:uppercase; color:var(--muted); letter-spacing:0.05em; margin-bottom:4px;">
            Section Accuracy
          </div>
          <div style="font-family:'Sora',sans-serif; font-size:46px; font-weight:800; color:#16a34a; line-height:1;">
            ${pct}%
          </div>
          <div style="font-size:14px; font-weight:600; color:var(--navy); margin-top:10px;">
            Score: ${correct} / ${totalPossible} Questions (${fType})
          </div>
        </div>
      `;
    }

    overlay.innerHTML = `
      <div class="cl-result-modal">
        <h2 style="font-family:'Sora',sans-serif; color:var(--navy); font-weight:800; font-size:24px; margin-bottom:6px;">
          ${titleText}
        </h2>
        <p style="color:var(--muted); font-size:14px; margin-bottom:20px;">
          ${subtitleText}
        </p>

        ${scoreDisplayHtml}

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:24px;">
          <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; padding:10px;">
            <strong style="color:#16a34a; font-size:18px;">${correct}</strong>
            <div style="font-size:12px; color:#15803d; font-weight:600;">Correct</div>
          </div>
          <div style="background:#fef2f2; border:1px solid #fecaca; border-radius:8px; padding:10px;">
            <strong style="color:#dc2626; font-size:18px;">${totalPossible - correct}</strong>
            <div style="font-size:12px; color:#b91c1c; font-weight:600;">Incorrect / Empty</div>
          </div>
        </div>

        <div style="display:flex; gap:10px; justify-content:center;">
          <button type="button" class="cl-btn-finish" style="background:var(--navy); padding:10px 22px;" onclick="document.getElementById('scorecardOverlay').remove()">
            <i class="bi bi-search"></i> Review Answers & Script
          </button>
          <a href="/cambridge-listening.html" class="cl-btn-finish" style="background:#fff; color:var(--navy); border:1.5px solid var(--line); text-decoration:none; padding:10px 20px;">
            Exit to Hub
          </a>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
  }

  // -------------------------------------------------------------
  // 11. User Custom Text Highlighting & Unhighlighting
  // -------------------------------------------------------------
  const hlTooltip = document.getElementById("clHighlightTooltip");
  const doHlBtn = document.getElementById("clDoHighlightBtn");
  const doUnhlBtn = document.getElementById("clDoUnhighlightBtn");
  let activeTargetHighlight = null;

  function initTextHighlighting() {
    document.addEventListener("mouseup", handleSelectionChange);
    document.addEventListener("keyup", handleSelectionChange);

    document.addEventListener("click", (e) => {
      // Check if user clicked on an existing custom highlight
      const hlMark = e.target.closest(".cl-user-highlight");
      if (hlMark) {
        e.stopPropagation();
        showUnhighlightTooltip(hlMark);
        return;
      }

      // Hide tooltip if clicked outside tooltip
      if (!e.target.closest("#clHighlightTooltip")) {
        hideHighlightTooltip();
      }
    });

    if (doHlBtn) {
      doHlBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        highlightCurrentSelection();
      });
    }

    if (doUnhlBtn) {
      doUnhlBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (activeTargetHighlight) {
          removeUserHighlight(activeTargetHighlight);
        }
      });
    }
  }

  function handleSelectionChange(e) {
    if (e.target && e.target.closest("#clHighlightTooltip")) return;

    setTimeout(() => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !sel.rangeCount) {
        if (!activeTargetHighlight) hideHighlightTooltip();
        return;
      }

      const text = sel.toString().trim();
      if (text.length === 0) {
        if (!activeTargetHighlight) hideHighlightTooltip();
        return;
      }

      const range = sel.getRangeAt(0);
      const mainWrap = document.querySelector(".cl-main-wrap");
      if (!mainWrap || !mainWrap.contains(range.commonAncestorContainer)) {
        hideHighlightTooltip();
        return;
      }

      const rect = range.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) return;

      activeTargetHighlight = null;
      if (doHlBtn) doHlBtn.style.display = "inline-flex";
      if (doUnhlBtn) doUnhlBtn.style.display = "none";

      positionTooltip(rect);
    }, 30);
  }

  function positionTooltip(rect) {
    if (!hlTooltip) return;
    hlTooltip.style.display = "flex";
    const tipWidth = hlTooltip.offsetWidth || 140;
    const left = Math.max(10, Math.min(window.innerWidth - tipWidth - 10, rect.left + rect.width / 2 - tipWidth / 2));
    const top = Math.max(10, rect.top - 44);

    hlTooltip.style.left = `${left}px`;
    hlTooltip.style.top = `${top}px`;
  }

  function showUnhighlightTooltip(hlMark) {
    activeTargetHighlight = hlMark;
    const rect = hlMark.getBoundingClientRect();
    if (doHlBtn) doHlBtn.style.display = "none";
    if (doUnhlBtn) doUnhlBtn.style.display = "inline-flex";
    positionTooltip(rect);
  }

  function hideHighlightTooltip() {
    if (hlTooltip) hlTooltip.style.display = "none";
    activeTargetHighlight = null;
  }

  function highlightCurrentSelection() {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.rangeCount) return;
    const range = sel.getRangeAt(0);
    const text = sel.toString().trim();
    if (!text) return;

    try {
      const mark = document.createElement("mark");
      mark.className = "cl-user-highlight";
      mark.title = "Click to remove highlight";
      range.surroundContents(mark);
    } catch (e) {
      try {
        const fragment = range.extractContents();
        const mark = document.createElement("mark");
        mark.className = "cl-user-highlight";
        mark.title = "Click to remove highlight";
        mark.appendChild(fragment);
        range.insertNode(mark);
      } catch (err) {
        console.warn("Could not wrap selection:", err);
      }
    }

    sel.removeAllRanges();
    hideHighlightTooltip();
  }

  function removeUserHighlight(markEl) {
    if (!markEl || !markEl.parentNode) return;
    const parent = markEl.parentNode;
    while (markEl.firstChild) {
      parent.insertBefore(markEl.firstChild, markEl);
    }
    parent.removeChild(markEl);
    parent.normalize();
    hideHighlightTooltip();
  }

  function clearAllUserHighlights() {
    const all = document.querySelectorAll(".cl-user-highlight");
    if (!all.length) {
      alert("You have no custom highlights on this page.");
      return;
    }
    if (confirm(`Remove all ${all.length} custom highlights?`)) {
      all.forEach(m => {
        const parent = m.parentNode;
        if (parent) {
          while (m.firstChild) parent.insertBefore(m.firstChild, m);
          parent.removeChild(m);
          parent.normalize();
        }
      });
    }
    hideHighlightTooltip();
  }

  window.clV2.clearAllUserHighlights = clearAllUserHighlights;

  // Helpers
  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function escapeAttr(str) {
    return String(str || "").replace(/"/g, "&quot;");
  }

  // Start on load
  window.addEventListener("DOMContentLoaded", () => {
    initTest();
    attachEventHandlers();
    initTextHighlighting();
  });

})();
