// jscs:disable validateLineBreaks
// jscs:disable validateQuoteMarks
// jscs:disable disallowMultipleLineBreaks
// jscs:disable requirePaddingNewLinesBeforeLineComments
// jscs:disable requireTrailingComma
// jscs:disable disallowQuotedKeysInObjects
// jscs:disable requireShorthandArrowFunctions
/* jshint esversion: 8 */

document.addEventListener("DOMContentLoaded", () => {

  function checkHTTPstatus(response) {
    if (response.status === 200) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(new Error(response.statusText));
    }
  }

  function fetchJSONfrom(url) {
    // returns resolved/rejected promise with value
    return fetch(url)
      .then(checkHTTPstatus)
      .then(response => response.json())
      .catch(reason => {
        console.log("Error when fetching data:", reason);
        // keep promise chain rejected on return
        throw reason;
      });
  }

  function displayDirectory(responseJSON) {
    ulHTML = "";
    responseJSON.results.forEach(el => {
      ulHTML += "<li class='directory-item'>";
      ulHTML += `<img src='${el.picture.large}'`;
      ulHTML += `alt='Picture of ${el.name.first} ${el.name.last}'>`;
      ulHTML += `<p class='name'>${el.name.first} ${el.name.last}</p>`;
      ulHTML += `<p class='email'>${el.email}</p>`;
      ulHTML += `<p class='city-location'>${el.location.city}</p>`;
      ulHTML += "</li>";
    });
    document.querySelector("ul.directory-list").innerHTML = ulHTML;
  }

  fetchJSONfrom("https://randomuser.me/api/?results=12")
    .then(displayDirectory)
    .catch(reason => console.log("Error: HTML can't be generated"));
});
