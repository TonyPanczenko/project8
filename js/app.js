// jscs:disable validateLineBreaks
// jscs:disable validateQuoteMarks
// jscs:disable disallowMultipleLineBreaks
// jscs:disable requirePaddingNewLinesBeforeLineComments
// jscs:disable requireTrailingComma
// jscs:disable disallowQuotedKeysInObjects
// jscs:disable requireShorthandArrowFunctions
/* jshint esversion: 8 */

document.addEventListener("DOMContentLoaded", () => {

  /* ============================================= */
  /*                   Declarations                */
  /* ============================================= */

  function checkHTTPstatus(response) {
    if (response.status === 200) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(new Error(response.statusText));
    }
  }

  function fetchJSONfrom(url) {
    // fetchJSONfrom returns resolved/rejected promise with JSON/reason

    function attempt() {
      return fetch(url)
        .then(checkHTTPstatus)
        .then(response => response.json());
    }

    // try i times to get a resolved promise,
    // randomuser.me sometimes doesn't send a CORS header (?)
    let promise = Promise.reject();
    for (i = 3; i > 0; i--) {
      promise = promise.catch(attempt);
    }

    return promise.catch(reason => {
      console.log("Error when fetching data:", reason);
      // keep promise chain rejected on return
      throw reason;
    });
  }

  function displayDirectory(responseJSON) {
    ulHTML = "";
    responseJSON.results.forEach((el, index) => {
      ulHTML += `<li class='directory-item' id='employee-${index}'>`;
      ulHTML += `<img src='${el.picture.large}'`;
      ulHTML += `alt='Picture of ${el.name.first} ${el.name.last}'>`;
      ulHTML += `<div><p class='name'>${el.name.first} ${el.name.last}</p>`;
      ulHTML += `<p class='email'>${el.email}</p>`;
      ulHTML += `<p class='city-location'>${el.location.city}</p></div>`;
      ulHTML += "</li>";
    });
    directoryList.innerHTML = ulHTML;
    return responseJSON;
  }

  function saveJSON(responseJSON) {
    employeesJSON = responseJSON.results;
    return responseJSON;
  }

  function createModal(e) {
    if (e.target.classList.contains("directory-item")) {
      const employeeId = e.target.id
        .split("-")[1];
      const employee = employeesJSON[employeeId];

      let divHTML = "<div class='modal'>";
      divHTML += `<img src='${employee.picture.large}'`;
      divHTML += `alt='Picture of ${employee.name.first} ${employee.name.last}'>`;
      divHTML += `<p class='name'>${employee.name.first} ${employee.name.last}</p>`;
      divHTML += `<p class='email'>${employee.email}</p>`;
      divHTML += `<p class='city-location'>${employee.location.city}</p>`;
      divHTML += `<p class='cell-number'>${employee.cell}</p>`;
      divHTML += `<p class='address'>${employee.location.street.number} `;
      divHTML += `${employee.location.street.name}, ${employee.location.city}`;
      divHTML += `, ${employee.location.state} ${employee.location.postcode}</p>`;
      divHTML += `<p class='birthday'>Birthday: `;
      divHTML += `${moment(employee.dob.date).format("MM/DD/YY")}</p>`;
      divHTML += `<button class="close"><svg><use href="#close-icon"></use></svg></button></div>`;

      const lightbox = document.createElement("DIV");
      lightbox.classList.add("lightbox");
      lightbox.innerHTML = divHTML;
      lightbox.addEventListener("click", (e) => {
        if (e.target.classList.contains("close")) {
          e.target.parentNode.parentNode.parentNode.removeChild(e.target.parentNode.parentNode);
        }
      });
      body.appendChild(lightbox);
    }
  }

  let employeesJSON = [];

  /* ============================================= */
  /*                  DOM selectors                */
  /* ============================================= */

  const body = document.querySelector("body");
  const directoryList = document.querySelector("ul.directory-list");

  /* ============================================= */
  /*                  Event handlers               */
  /* ============================================= */

  // on DOMContentLoaded
  fetchJSONfrom("https://randomuser.me/api/?results=12&nat=AU,BR,CA,CH,DE,DK,ES,FI,FR,GB,IE,NO,NL,NZ,TR,US")
    .then(displayDirectory)
    .then(saveJSON)
    .catch(reason => console.log("Error: HTML can't be generated"));

  directoryList.addEventListener("click", createModal);
});
