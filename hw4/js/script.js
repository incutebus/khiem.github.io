/*
  Khiem Vo
  CST336
  Professor Lara
  API Lab
*/

// rick and morty api: https://rickandmortyapi.com/api/character

let currentPage = 1;

// event listeners
document.querySelector("#searchForm").addEventListener("submit", searchCharacters);
document.querySelector("#name").addEventListener("change", validateName);
document.querySelector("#prevBtn").addEventListener("click", previousPage);
document.querySelector("#nextBtn").addEventListener("click", nextPage);

// checks the name and shows an error if it is not valid
function validateName() {
  let name = document.querySelector("#name").value.trim();
  let nameError = document.querySelector("#nameError");

  if (name.length === 0) {
    nameError.textContent = "Name required";
    return false;
  }

  if (name.length < 2) {
    nameError.textContent = "Name must be at least 2 characters";
    return false;
  }

  if (name.length > 40) {
    nameError.textContent = "Name must be 40 characters or less";
    return false;
  }

  nameError.textContent = "";
  return true;
}

// runs when the search button is clicked
function searchCharacters(event) {
  event.preventDefault();

  if (validateName() === false) {
    return;
  }

  currentPage = 1;
  getCharacters();
}

// gets the characters from the api
async function getCharacters() {
  let name = document.querySelector("#name").value.trim();
  let species = document.querySelector("#species").value;
  let status = document.querySelector("#status").value;

  let url = `https://rickandmortyapi.com/api/character/?name=${name}&page=${currentPage}`;

  // only add species and status if the user picked one
  if (species !== "") {
    url += `&species=${species}`;
  }

  if (status !== "") {
    url += `&status=${status}`;
  }

  document.querySelector("#message").textContent = "Loading...";
  document.querySelector("#results").innerHTML = "";
  document.querySelector("#pager").style.display = "none";

  try {
    let response = await fetch(url);

    // the api returns a 404 when no characters are found
    if (response.status === 404) {
      document.querySelector("#message").textContent = "No characters found.";
      return;
    }

    let data = await response.json();
    displayCharacters(data);
  } catch (error) {
    document.querySelector("#message").textContent = "Unable to get characters.";
    console.error(error);
  }
}

// shows each character as a card
function displayCharacters(data) {
  let results = document.querySelector("#results");
  document.querySelector("#message").textContent = `Found ${data.info.count} character(s).`;

  for (let character of data.results) {
    results.innerHTML += `
      <div class="card">
        <img src="${character.image}" alt="${character.name}">
        <h2>${character.name}</h2>
        <p class="${character.status.toLowerCase()}">${character.status} - ${character.species}</p>
        <p><b>Gender:</b> ${character.gender}</p>
        <p><b>Origin:</b> ${character.origin.name}</p>
        <p><b>Location:</b> ${character.location.name}</p>
        <p><b>Episodes:</b> ${character.episode.length}</p>
      </div>
    `;
  }

  // show the page buttons if there is more than one page
  if (data.info.pages > 1) {
    document.querySelector("#pager").style.display = "block";
    document.querySelector("#pageInfo").textContent = `Page ${currentPage} of ${data.info.pages}`;
    document.querySelector("#prevBtn").disabled = (data.info.prev === null);
    document.querySelector("#nextBtn").disabled = (data.info.next === null);
  }
}

// goes back one page
function previousPage() {
  currentPage--;
  getCharacters();
}

// goes to the next page
function nextPage() {
  currentPage++;
  getCharacters();
}
