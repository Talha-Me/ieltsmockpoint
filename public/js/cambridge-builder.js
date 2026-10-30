let groupUid = 100;

// ট্যাব পরিবর্তন করার ফাংশন
function showPart(partNo) {
  document.querySelectorAll('.part-panel').forEach(p => p.style.display = 'none');
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`part-panel-${partNo}`).style.display = 'block';
  event.target.classList.add('active');
}

// নতুন কোয়েশ্চেন গ্রুপ যোগ করা
function appendQuestionGroup(partNo) {
  groupUid++;
  const container = document.getElementById(`groups-container-${partNo}`);

  const cardHtml = `
    <div class="group-card" id="card-${groupUid}" data-part="${partNo}">
      <div class="group-card-header">
        <strong style="color: #0f172a; font-size: 15px;">Part ${partNo} - Question Group</strong>
        <button type="button" class="delete-btn" onclick="document.getElementById('card-${groupUid}').remove()">✕ Remove Group</button>
      </div>

      <div style="margin-bottom: 12px;">
        <label style="font-size: 13px; font-weight: 600;">Instruction (HTML allowed):</label>
        <input type="text" class="field-instruction form-control" placeholder="e.g. Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer." />
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 12px;">
        <div>
          <label style="font-size: 13px; font-weight: 600;">Question Type:</label>
          <select class="field-type form-control" onchange="renderDynamicFields('${groupUid}', this.value)">
            <option value="">-- Choose Type --</option>
            <option value="note-completion">Note Completion (Form / Notes)</option>
            <option value="mcq-updated">Multiple Choice (Single - 3 Choices)</option>
            <option value="mcq-two-choice-updated">Multiple Choice (Choose Two - 5 Choices)</option>
            <option value="sentence-completion">Sentence Completion</option>
            <option value="feature-matching">Feature Matching (Box Matching)</option>
            <option value="diagram-labelling">Diagram / Map Labelling</option>
          </select>
        </div>
        <div>
          <label style="font-size: 13px; font-weight: 600;">Question Numbers (Comma separated):</label>
          <input type="text" class="field-ids form-control" placeholder="e.g. 1, 2, 3, 4, 5, 6, 7, 8, 9, 10" />
        </div>
      </div>

      <!-- ডাইনামিক ফিল্ড কন্টেইনার -->
      <div id="dynamic-zone-${groupUid}" class="dynamic-form-box" style="display: none;"></div>

      <!-- আনসার বক্স -->
      <div style="margin-top: 15px;">
        <label style="font-size: 13px; font-weight: 700; color: #15803d;">Answers (Format: QuestionNumber: answer, alt_answer):</label>
        <textarea class="field-answers form-control" rows="4" placeholder="1: 219 442 9785, 2194429785&#10;2: 10 october, 10th october&#10;3: manager"></textarea>
        <span class="help-text">প্রতি লাইনে একটি করে প্রশ্নের উত্তর দাও। একাধিক অপশন থাকলে কমা দিয়ে লিখবে। MCQ হলে 1-based index (A=1, B=2, C=3) বা টেক্সট লিখবে।</span>
      </div>
    </div>
  `;

  container.insertAdjacentHTML('beforeend', cardHtml);
}

// টাইপ অনুযায়ী নির্দিষ্ট ইনপুট ফিল্ড রেন্ডার করা
function renderDynamicFields(uid, type) {
  const zone = document.getElementById(`dynamic-zone-${uid}`);
  if (!type) {
    zone.style.display = 'none';
    zone.innerHTML = '';
    return;
  }
  zone.style.display = 'block';

  if (type === 'note-completion') {
    zone.innerHTML = `
      <div style="margin-bottom: 10px;">
        <label style="font-size: 12px; font-weight: 600;">Heading:</label>
        <input type="text" class="sub-heading form-control" placeholder="e.g. TOTAL HEALTH CLINIC" />
      </div>
      <div style="margin-bottom: 10px;">
        <label style="font-size: 12px; font-weight: 600;">Subheadings (প্রতি লাইনে একটি করে):</label>
        <textarea class="sub-subheadings form-control" rows="3" placeholder="Personal information&#10;Details of the problem&#10;Other information"></textarea>
      </div>
      <div>
        <label style="font-size: 12px; font-weight: 600;">Paragraphs with [blank] (প্রতিটি Subheading এর প্যারাগ্রাফ খালি লাইন দিয়ে আলাদা করো):</label>
        <textarea class="sub-paragraphs form-control" rows="8" placeholder="Contact phone: [blank]&#10;Date of birth: [blank], 1992&#10;&#10;Type of problem: pain in her left [blank]&#10;When it began: [blank] ago"></textarea>
      </div>
    `;
  } else if (type === 'mcq-updated') {
    zone.innerHTML = `
      <div style="margin-bottom: 10px;">
        <label style="font-size: 12px; font-weight: 600;">Questions (প্রতি লাইনে একটি প্রশ্ন):</label>
        <textarea class="sub-mcq-questions form-control" rows="4" placeholder="What made David leave London and move to Northsea?&#10;The Lifeboat Institution was built with..."></textarea>
      </div>
      <div>
        <label style="font-size: 12px; font-weight: 600;">Options (প্রতি প্রশ্নের ৩টি অপশন দাও, দুটি প্রশ্নের অপশনের মাঝে খালি লাইন দাও):</label>
        <textarea class="sub-mcq-options form-control" rows="7" placeholder="He was eager to develop a hobby.&#10;He wanted to work shorter hours.&#10;He found his job unsatisfying&#10;&#10;a local organisation.&#10;a local resident.&#10;the local council."></textarea>
      </div>
    `;
  } else if (type === 'mcq-two-choice-updated') {
    zone.innerHTML = `
      <div style="margin-bottom: 10px;">
        <label style="font-size: 12px; font-weight: 600;">Question Prompt (প্রতি লাইনে একটি প্রশ্ন):</label>
        <textarea class="sub-two-questions form-control" rows="3" placeholder="Which TWO things does David say about the training?&#10;Which TWO things does David find most motivating?"></textarea>
      </div>
      <div>
        <label style="font-size: 12px; font-weight: 600;">Options (৫টি অপশন A-E প্রতি লাইনে, খালি লাইন দিয়ে পরবর্তী প্রশ্ন আলাদা করো):</label>
        <textarea class="sub-two-options form-control" rows="8" placeholder="Option A&#10;Option B&#10;Option C&#10;Option D&#10;Option E&#10;&#10;Option A2&#10;Option B2..."></textarea>
      </div>
    `;
  } else if (type === 'sentence-completion') {
    zone.innerHTML = `
      <div>
        <label style="font-size: 12px; font-weight: 600;">Sentences (প্রতি লাইনে একটি বাক্য এবং গ্যাপের জায়গায় [blank] লিখো):</label>
        <textarea class="sub-sentences form-control" rows="6" placeholder="decide on sample: twelve students from the [blank] department.&#10;ensure that risk is assessed and [blank] is kept to a minimum."></textarea>
      </div>
    `;
  } else if (type === 'feature-matching') {
    zone.innerHTML = `
      <div style="margin-bottom: 10px;">
        <label style="font-size: 12px; font-weight: 600;">Features / Categories (প্রতি লাইনে একটি, যেমন দেশের নাম):</label>
        <textarea class="sub-features form-control" rows="4" placeholder="Iceland&#10;Egypt&#10;UK&#10;USA"></textarea>
      </div>
      <div>
        <label style="font-size: 12px; font-weight: 600;">Matching Options / Statements (প্রতি লাইনে একটি):</label>
        <textarea class="sub-match-options form-control" rows="6" placeholder="This country suffered the most severe loss of life.&#10;The impact on agriculture was predictable.&#10;Animals suffered from a sickness."></textarea>
      </div>
    `;
  } else if (type === 'diagram-labelling') {
    zone.innerHTML = `
      <div style="margin-bottom: 10px;">
        <label style="font-size: 12px; font-weight: 600;">Diagram / Map Image URL:</label>
        <input type="text" class="sub-diagram-img form-control" placeholder="https://example.com/map.jpg" />
      </div>
      <div style="margin-bottom: 10px;">
        <label style="font-size: 12px; font-weight: 600;">Options (A, B, C, D... প্রতি লাইনে একটি):</label>
        <textarea class="sub-diagram-opts form-control" rows="4" placeholder="A&#10;B&#10;C&#10;D&#10;E&#10;F"></textarea>
      </div>
      <div>
        <label style="font-size: 12px; font-weight: 600;">Labels (যে আইটেমগুলোর আইডি ম্যাচ করতে হবে, প্রতি লাইনে একটি):</label>
        <textarea class="sub-diagram-labels form-control" rows="5" placeholder="New traffic lights&#10;Pedestrian crossing&#10;Parking allowed"></textarea>
      </div>
    `;
  }
}

// ফুল ডাটা কম্পাইল করে ব্যাকএন্ডে পাঠানোর ফাংশন
async function saveCambridgeTest() {
  const book = document.getElementById("bookNo").value;
  const testNo = document.getElementById("testNo").value;
  const audioUrl = document.getElementById("audioUrl").value.trim();

  if (!audioUrl) {
    alert("Audio URL is required!");
    return;
  }

  const questions = [];
  const instructions = [];
  const answers = {};

  const allCards = document.querySelectorAll(".group-card");
  if (allCards.length === 0) {
    alert("Please add at least one Question Group!");
    return;
  }

  allCards.forEach((card, index) => {
    const part = parseInt(card.getAttribute("data-part"));
    const type = card.querySelector(".field-type").value;
    const instructionText = card.querySelector(".field-instruction").value.trim();
    const idsRaw = card.querySelector(".field-ids").value.trim();
    const groupId = parseInt(`${part}${index + 1}`);

    if (!type) return;

    // আইডিস পার্সিং (কমা সেপারেটেড স্ট্রিং থেকে অ্যারে)
    const ids = idsRaw.split(",").map(n => parseInt(n.trim())).filter(n => !isNaN(n));

    // ইন্সট্রাকশন পুশ
    if (instructionText) {
      instructions.push({ group: groupId, instruction: instructionText });
    }

    // টাইপ অনুযায়ী অবজেক্ট তৈরি
    let qObj = { part, group: groupId, type, id: ids };

    if (type === "note-completion") {
      qObj.heading = card.querySelector(".sub-heading") ? card.querySelector(".sub-heading").value.trim() : "";
      const subheads = card.querySelector(".sub-subheadings") ? card.querySelector(".sub-subheadings").value.split("\n").filter(s => s.trim()) : [];
      qObj.subheadings = subheads;

      const rawParas = card.querySelector(".sub-paragraphs") ? card.querySelector(".sub-paragraphs").value.split("\n\n") : [];
      qObj.paragraphs = rawParas.map(block => block.split("\n").map(l => l.trim()).filter(l => l));
    } 
    else if (type === "mcq-updated") {
      qObj.questions = card.querySelector(".sub-mcq-questions").value.split("\n").map(q => q.trim()).filter(q => q);
      const rawOptions = card.querySelector(".sub-mcq-options").value.split("\n\n");
      qObj.options = rawOptions.map(block => block.split("\n").map(opt => opt.trim()).filter(opt => opt));
    } 
    else if (type === "mcq-two-choice-updated") {
      // id pair grouping
      const idPairs = [];
      for (let i = 0; i < ids.length; i += 2) {
        if (ids[i + 1] !== undefined) idPairs.push([ids[i], ids[i + 1]]);
        else idPairs.push([ids[i]]);
      }
      qObj.id = idPairs;
      qObj.questions = card.querySelector(".sub-two-questions").value.split("\n").map(q => [q.trim()]).filter(q => q[0]);
      const rawOptions = card.querySelector(".sub-two-options").value.split("\n\n");
      qObj.options = rawOptions.map(block => block.split("\n").map(opt => opt.trim()).filter(opt => opt));
    } 
    else if (type === "sentence-completion") {
      qObj.sentences = card.querySelector(".sub-sentences").value.split("\n").map(s => s.trim()).filter(s => s);
    } 
    else if (type === "feature-matching") {
      qObj.features = card.querySelector(".sub-features").value.split("\n").map(f => f.trim()).filter(f => f);
      qObj.options = card.querySelector(".sub-match-options").value.split("\n").map(o => o.trim()).filter(o => o);
    } 
    else if (type === "diagram-labelling") {
      qObj.image = card.querySelector(".sub-diagram-img").value.trim();
      qObj.options = card.querySelector(".sub-diagram-opts").value.split("\n").map(o => o.trim()).filter(o => o);
      qObj.labels = card.querySelector(".sub-diagram-labels").value.split("\n").map(l => l.trim()).filter(l => l);
    }

    questions.push(qObj);

    // উত্তরগুলো পার্স করা (1: answer1, alt)
    const rawAnswers = card.querySelector(".field-answers").value.split("\n");
    rawAnswers.forEach(line => {
      const parts = line.split(":");
      if (parts.length >= 2) {
        const qNum = parts[0].trim();
        const altAnswers = parts.slice(1).join(":").split(",").map(a => a.trim().toLowerCase()).filter(a => a);
        if (qNum && altAnswers.length > 0) {
          answers[qNum] = altAnswers;
        }
      }
    });
  });

  // ফাইনাল পে-লোড
  const payload = {
    book: Number(book),
    testNo: Number(testNo),
    audioUrl,
    questions,
    instructions,
    answers
  };

  try {
    const res = await fetch("/admin/api/cambridge-listening/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (data.success) {
      alert("🎉 " + data.message);
      window.location.reload();
    } else {
      alert("❌ Error: " + data.error);
    }
  } catch (err) {
    alert("Server error occurred while saving!");
    console.error(err);
  }
}