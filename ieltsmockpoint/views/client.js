// const boxed_listening = document.getElementById("boxed-listening");





// const dataRetriever = async function(){
//   try{
//     const res = await fetch("/api/mockTest");
//     const data = await res.json();
//     return data;
//   } catch(err){
//     alert(err);
//   }
// }

// let data;
// async function main(){
// data = await dataRetriever();
// localStorage.setItem("data", JSON.stringify(data));
// console.log(data);
// }

// main();



// /* this booleans will be handled like Frontend -> backend -> Frontend */
// // ignore ^, it does not make sense
// let listeningIscompleted = false;
// let readingIscompleted = false;
// let writingIscompleted = false;




// /* popup for ok button */
// function showPopupModalForListening(){
//    const popModal = document.getElementById("pop-modal-for-listening");
//     popModal.style.display = "flex";
// }


// function showPopupModalForReading(){
//   const popModal = document.getElementById("pop-modal-for-reading");
//   popModal.style.display = "flex";
// }

// function showPopupModalForWriting(){
//   const popModal = document.getElementById("pop-modal-for-writing");
//   popModal.style.display = "flex";
// }


// function closePopupModal(){
//     const popModal = document.getElementById("pop-modal");
//     popModal.style.display="none";
//     updateModuleBox();
// }
// /* popup for ok button */



// /* might be changed  */
// function navigateToRouteListening(){
//     window.location.href = "/listening-test";
// }

// function navigateToRouteReading(){
//   window.location.href = "/reading-test";
// }

// function navigateToRouteWriting(){
//   window.location.href = "/writing-test";
// }
// /* might be changed  */


// /* very cool(dumb) logic to update the "front"-page */
// function updateModuleBox(){
//     if(!listeningIscompleted){
//     const moduleBox = document.getElementById("module-box");
//     moduleBox.innerHTML = `
//     <div class="active-module" id="active-module">
//             <h6>Listening</h6>
//             <p class="text-danger">Not Completed</p>
//             <p class="text-muted">Timing 30 minutes</p>
//             <div class="video-box">
//                 <p class="">Test Information: <span class="text-danger" id="info">confirmed</span></p>

//                 <div class="collapsible-content">
//                 <video class="video" controls>
//                     <source src="/video/listening" type="video/mp4">
//                 </video>
//                 <p class="fs-5"><strong>Ready?</strong></p>
//                 <p class="text-muted">Please confirm that you have understood the Information above</p>
//                 <button class="confirm-button" onclick="navigateToRouteListening()">✔ I confirm</button>
//               </div> 
//             </div>
            

//     </div>

//     <div class="boxed-reading">
//       <h7>Reading</h7>
//       <p class="text-danger">Not Completed</p>
//       <p class="text-muted">Timing 60 minutes</p>
//     </div>
//     <div class="boxed-writing">
//       <h8>Writing</h8>
//       <p class="text-danger">Not Completed</p>
//       <p class="text-muted">Timing 60 minutes</p>
//     </div>
    
//     `
// }


// if (listeningIscompleted == true){
//     const moduleBox = document.getElementById("module-box");
//     moduleBox.innerHTML = `
//         <div class="boxed-listening">
//         <h6>Listening</h6>
//         <p class="text-completed">Completed</p>
//         <p class="text-muted">Timing 60 minutes</p>
//         </div>

//             <div class="active-module" id="active-module">
//             <h6>Reading</h6>
//             <p class="text-danger">Not Completed</p>
//             <p class="text-muted">Timing 60 minutes</p>
//             <div class="video-box">
//                 <p class="">Test Information: <span class="text-danger" id="info">confirmed</span></p>

//                 <div class="collapsible-content">
//                 <video class="video" controls>
//                     <source src="/video/reading" type="video/mp4">
//                 </video>
//                 <p class="fs-5"><strong>Ready?</strong></p>
//                 <p class="text-muted">Please confirm that you have understood the Information above</p>
//                 <button class="confirm-button" onclick="navigateToRouteReading()">✔ I confirm</button>
//               </div> 
//             </div>
            

//     </div>
//     <div class="boxed-writing">
//       <h8>Writing</h8>
//       <p class="text-danger">Not Completed</p>
//       <p class="text-muted">Timing 60 minutes</p>
//     </div>
//     `
    
// }

// if (listeningIscompleted && readingIscompleted){
//     const moduleBox = document.getElementById("module-box");
//     moduleBox.innerHTML = `
//         <div class="boxed-listening">
//         <h6>Listening</h6>
//         <p class="text-completed">Completed</p>
//         <p class="text-muted">Timing 30 minutes</p>
//         </div>
//         <div class="boxed-reading">
//         <h6>Reading</h6>
//         <p class="text-completed">Completed</p>
//         <p class="text-muted">Timing 60 minutes</p>
//         </div>

//         <div class="active-module" id="active-module">
//             <h6>Writing</h6>
//             <p class="text-danger">Not Completed</p>
//             <p class="text-muted">Timing 60 minutes</p>
//             <div class="video-box">
//                 <p class="">Test Information: <span class="text-danger" id="info">confirmed</span></p>

//                 <div class="collapsible-content">
//                 <video class="video" controls>
//                     <source src="/video/writing" type="video/mp4">
//                 </video>
//                 <p class="fs-5"><strong>Ready?</strong></p>
//                 <p class="text-muted">Please confirm that you have understood the Information above</p>
//                 <button class="confirm-button" onclick="navigateToRouteWriting()">✔ I confirm</button>
//               </div> 
//             </div>
            

//     </div>

    
//     `
// }


// if(listeningIscompleted && readingIscompleted && writingIscompleted){
//   const moduleBox = document.getElementById("module-box");

//   moduleBox.innerHTML = `
//         <div class="boxed-listening">
//         <h6>Listening</h6>
//         <p class="text-completed">Completed</p>
//         <p class="text-muted">Timing 30 minutes</p>
//         </div>
//         <div class="boxed-reading">
//         <h6>Reading</h6>
//         <p class="text-completed">Completed</p>
//         <p class="text-muted">Timing 60 minutes</p>
//         </div>
//         <div class="boxed-writing">
//         <h6>Writing</h6>
//         <p class="text-completed">Completed</p>
//         <p class="text-muted">Timing 60 minutes</p>
//         </div>`

//   sessionStorage.clear();
//   localStorage.clear();
//   window.location.href = "/test-completed";
// }

// }

// /* this should not EXIST, but it does, just like me :( */
// function alert_function(){
//     alert("Are you sure?")
// }


// document.addEventListener("DOMContentLoaded", function() {
//   listeningIscompleted = sessionStorage.getItem("listeningIscompleted") === "true";
//   readingIscompleted = sessionStorage.getItem("readingIsCompleted") === "true";
//   writingIscompleted = sessionStorage.getItem("writingIsCompleted") === "true";
//   //console.log(listeningIscompleted);
//   updateModuleBox();
  
// });



const boxed_listening = document.getElementById("boxed-listening");


// ============================================================
// CLOUDFLARE R2 VIDEO URLS
// ============================================================

const R2_VIDEOS = {
  listening:
    "https://pub-f88da22cc9ae4937a6641b7ee1702c05.r2.dev/Video/WhatsApp%20Video%202025-05-05%20at%205.02.30%20PM.mp4",

  reading:
    "https://pub-f88da22cc9ae4937a6641b7ee1702c05.r2.dev/Video/reading.mp4",

  writing:
    "https://pub-f88da22cc9ae4937a6641b7ee1702c05.r2.dev/Video/writing.mp4"
};


// ============================================================
// GET MOCK TEST DATA
// ============================================================

const dataRetriever = async function () {
  try {
    const res = await fetch("/api/mockTest");

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (err) {
    alert(err);
  }
};


let data;

async function main() {
  data = await dataRetriever();

  localStorage.setItem("data", JSON.stringify(data));

  console.log(data);
}

main();


// ============================================================
// TEST COMPLETION STATES
// ============================================================

let listeningIscompleted = false;
let readingIscompleted = false;
let writingIscompleted = false;


// ============================================================
// POPUP FUNCTIONS
// ============================================================

function showPopupModalForListening() {
  const popModal = document.getElementById("pop-modal-for-listening");

  if (popModal) {
    popModal.style.display = "flex";
  }
}


function showPopupModalForReading() {
  const popModal = document.getElementById("pop-modal-for-reading");

  if (popModal) {
    popModal.style.display = "flex";
  }
}


function showPopupModalForWriting() {
  const popModal = document.getElementById("pop-modal-for-writing");

  if (popModal) {
    popModal.style.display = "flex";
  }
}


function closePopupModal() {
  ["listening", "reading", "writing"].forEach(function (name) {
    const modal = document.getElementById(`pop-modal-for-${name}`);

    if (modal) {
      modal.style.display = "none";
    }
  });

  updateModuleBox();
}


// ============================================================
// NAVIGATION FUNCTIONS
// ============================================================

function navigateToRouteListening() {
  window.location.href = "/listening-test";
}


function navigateToRouteReading() {
  window.location.href = "/reading-test";
}


function navigateToRouteWriting() {
  window.location.href = "/writing-test";
}


// ============================================================
// UPDATE MODULE BOX
// ============================================================

function updateModuleBox() {

  const moduleBox = document.getElementById("module-box");

  if (!moduleBox) {
    return;
  }


  // ==========================================================
  // LISTENING NOT COMPLETED
  // ==========================================================

  if (!listeningIscompleted) {

    moduleBox.innerHTML = `

      <div class="active-module" id="active-module">

        <h6>Listening</h6>

        <p class="text-danger">
          Not Completed
        </p>

        <p class="text-muted">
          Timing 30 minutes
        </p>


        <div class="video-box">

          <p>
            Test Information:
            <span class="text-danger" id="info">
              confirmed
            </span>
          </p>


          <div class="collapsible-content">

            <!-- Listening Video - Cloudflare R2 -->

            <video
              class="video"
              controls
              preload="metadata"
              playsinline
            >

              <source
                src="${R2_VIDEOS.listening}"
                type="video/mp4"
              >

              Your browser does not support the video tag.

            </video>


            <p class="fs-5">
              <strong>Ready?</strong>
            </p>


            <p class="text-muted">
              Please confirm that you have understood the Information above
            </p>


            <button
              class="confirm-button"
              onclick="navigateToRouteListening()"
            >
              ✔ I confirm
            </button>


          </div>

        </div>

      </div>


      <div class="boxed-reading">

        <h6>Reading</h6>

        <p class="text-danger">
          Not Completed
        </p>

        <p class="text-muted">
          Timing 60 minutes
        </p>

      </div>


      <div class="boxed-writing">

        <h6>Writing</h6>

        <p class="text-danger">
          Not Completed
        </p>

        <p class="text-muted">
          Timing 60 minutes
        </p>

      </div>

    `;

    return;
  }


  // ==========================================================
  // LISTENING COMPLETED
  // READING NOT COMPLETED
  // ==========================================================

  if (
    listeningIscompleted &&
    !readingIscompleted
  ) {

    moduleBox.innerHTML = `

      <div class="boxed-listening">

        <h6>Listening</h6>

        <p class="text-completed">
          Completed
        </p>

        <p class="text-muted">
          Timing 30 minutes
        </p>

      </div>


      <div class="active-module" id="active-module">

        <h6>Reading</h6>

        <p class="text-danger">
          Not Completed
        </p>

        <p class="text-muted">
          Timing 60 minutes
        </p>


        <div class="video-box">

          <p>
            Test Information:
            <span class="text-danger" id="info">
              confirmed
            </span>
          </p>


          <div class="collapsible-content">

            <!-- Reading Video - Cloudflare R2 -->

            <video
              class="video"
              controls
              preload="metadata"
              playsinline
            >

              <source
                src="${R2_VIDEOS.reading}"
                type="video/mp4"
              >

              Your browser does not support the video tag.

            </video>


            <p class="fs-5">
              <strong>Ready?</strong>
            </p>


            <p class="text-muted">
              Please confirm that you have understood the Information above
            </p>


            <button
              class="confirm-button"
              onclick="navigateToRouteReading()"
            >
              ✔ I confirm
            </button>


          </div>

        </div>

      </div>


      <div class="boxed-writing">

        <h6>Writing</h6>

        <p class="text-danger">
          Not Completed
        </p>

        <p class="text-muted">
          Timing 60 minutes
        </p>

      </div>

    `;

    return;
  }


  // ==========================================================
  // LISTENING + READING COMPLETED
  // WRITING NOT COMPLETED
  // ==========================================================

  if (
    listeningIscompleted &&
    readingIscompleted &&
    !writingIscompleted
  ) {

    moduleBox.innerHTML = `

      <div class="boxed-listening">

        <h6>Listening</h6>

        <p class="text-completed">
          Completed
        </p>

        <p class="text-muted">
          Timing 30 minutes
        </p>

      </div>


      <div class="boxed-reading">

        <h6>Reading</h6>

        <p class="text-completed">
          Completed
        </p>

        <p class="text-muted">
          Timing 60 minutes
        </p>

      </div>


      <div class="active-module" id="active-module">

        <h6>Writing</h6>

        <p class="text-danger">
          Not Completed
        </p>

        <p class="text-muted">
          Timing 60 minutes
        </p>


        <div class="video-box">

          <p>
            Test Information:
            <span class="text-danger" id="info">
              confirmed
            </span>
          </p>


          <div class="collapsible-content">

            <!-- Writing Video - Cloudflare R2 -->

            <video
              class="video"
              controls
              preload="metadata"
              playsinline
            >

              <source
                src="${R2_VIDEOS.writing}"
                type="video/mp4"
              >

              Your browser does not support the video tag.

            </video>


            <p class="fs-5">
              <strong>Ready?</strong>
            </p>


            <p class="text-muted">
              Please confirm that you have understood the Information above
            </p>


            <button
              class="confirm-button"
              onclick="navigateToRouteWriting()"
            >
              ✔ I confirm
            </button>


          </div>

        </div>

      </div>

    `;

    return;
  }


  // ==========================================================
  // ALL TESTS COMPLETED
  // ==========================================================

  if (
    listeningIscompleted &&
    readingIscompleted &&
    writingIscompleted
  ) {

    moduleBox.innerHTML = `

      <div class="boxed-listening">

        <h6>Listening</h6>

        <p class="text-completed">
          Completed
        </p>

        <p class="text-muted">
          Timing 30 minutes
        </p>

      </div>


      <div class="boxed-reading">

        <h6>Reading</h6>

        <p class="text-completed">
          Completed
        </p>

        <p class="text-muted">
          Timing 60 minutes
        </p>

      </div>


      <div class="boxed-writing">

        <h6>Writing</h6>

        <p class="text-completed">
          Completed
        </p>

        <p class="text-muted">
          Timing 60 minutes
        </p>

      </div>

    `;


    sessionStorage.clear();

    localStorage.clear();

    window.location.href = "/test-completed";

  }

}


// ============================================================
// ALERT FUNCTION
// ============================================================

function alert_function() {

  alert("Are you sure?");

}


// ============================================================
// DOM CONTENT LOADED
// ============================================================

document.addEventListener(
  "DOMContentLoaded",
  function () {

    listeningIscompleted =
      sessionStorage.getItem("listeningIscompleted") === "true";


    readingIscompleted =
      sessionStorage.getItem("readingIsCompleted") === "true";


    writingIscompleted =
      sessionStorage.getItem("writingIsCompleted") === "true";


    updateModuleBox();

  }
);