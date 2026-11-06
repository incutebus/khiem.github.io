/*
  Khiem Vo
  CST336
  Professor Lara
  API Lab
*/

// event listeners
document.querySelector("#zip").addEventListener("change", displayCity);
document.querySelector("#state").addEventListener("change", displayCounties);
document.querySelector("#username").addEventListener("change", checkUsername);
document.querySelector("#password").addEventListener("click", suggestPassword);
document.querySelector("#signupForm").addEventListener("submit", validateForm);

// load the states when the page loads (called directly, no event listener)
loadStates();

// shows the city, latitude, and longitude for the zip code
async function displayCity() {
  let zipCode = document.querySelector("#zip").value;
  let zipError = document.querySelector("#zipError");

  try {
    let url = `https://csumb.space/api/cityInfoAPI.php?zip=${zipCode}`;
    let response = await fetch(url);
    let data = await response.json();

    // the api returns false when the zip code is not found
    if (data === false) {
      zipError.textContent = "Zip code not found";
      document.querySelector("#city").textContent = "";
      document.querySelector("#latitude").textContent = "";
      document.querySelector("#longitude").textContent = "";
      return;
    }

    zipError.textContent = "";
    document.querySelector("#city").textContent = data.city;
    document.querySelector("#latitude").textContent = data.latitude;
    document.querySelector("#longitude").textContent = data.longitude;
  } catch (error) {
    zipError.textContent = "Unable to retrieve city";
    console.error(error);
  }
}

// fills the state dropdown with all us states
async function loadStates() {
  let stateMenu = document.querySelector("#state");

  stateMenu.textContent = "";

  let defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select One";
  stateMenu.appendChild(defaultOption);

  try {
    let url = "https://csumb.space/api/allStatesAPI.php";
    let response = await fetch(url);
    let data = await response.json();

    for (let item of data) {
      let option = document.createElement("option");
      option.value = item.usps;
      option.textContent = item.state;
      stateMenu.appendChild(option);
    }
  } catch (error) {
    stateMenu.textContent = "";

    let errorOption = document.createElement("option");
    errorOption.value = "";
    errorOption.textContent = "Unable to load states";
    stateMenu.appendChild(errorOption);
    console.error(error);
  }
}

// fills the county dropdown when a state is picked
async function displayCounties() {
  let state = document.querySelector("#state").value;
  let countyMenu = document.querySelector("#county");

  countyMenu.textContent = "";

  // stop if no state is picked
  if (state === "") {
    return;
  }

  let defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select One";
  countyMenu.appendChild(defaultOption);

  try {
    let url = `https://csumb.space/api/countyListAPI.php?state=${state}`;
    let response = await fetch(url);
    let data = await response.json();

    for (let item of data) {
      let option = document.createElement("option");
      option.value = item.county;
      option.textContent = item.county;
      countyMenu.appendChild(option);
    }
  } catch (error) {
    console.error(error);
  }
}

// checks if the username is available (green = available, red = taken)
async function checkUsername() {
  let username = document.querySelector("#username").value;
  let usernameError = document.querySelector("#usernameError");

  if (username.length === 0) {
    usernameError.textContent = "Username required";
    usernameError.style.color = "red";
    return false;
  }

  let url = `https://csumb.space/api/usernamesAPI.php?username=${username}`;
  let response = await fetch(url);
  let data = await response.json();

  if (data.available) {
    usernameError.textContent = "Username available!";
    usernameError.style.color = "green";
    return true;
  } else {
    usernameError.textContent = "Username taken";
    usernameError.style.color = "red";
    return false;
  }
}

// shows a suggested password when the password box is clicked
async function suggestPassword() {
  try {
    let url = "https://csumb.space/api/suggestedPassword.php?length=8";
    let response = await fetch(url);
    let data = await response.json();

    document.querySelector("#suggestedPwd").textContent = `Suggested: ${data.password}`;
  } catch (error) {
    console.error(error);
  }
}

// checks the username and password before submitting the form
async function validateForm(event) {
  event.preventDefault();

  let isValid = true;

  let password = document.querySelector("#password").value;
  let passwordAgain = document.querySelector("#passwordAgain").value;
  let passwordError = document.querySelector("#passwordError");

  passwordError.textContent = "";

  // checkUsername returns true or false
  let usernameAvailable = await checkUsername();

  if (usernameAvailable === false) {
    isValid = false;
  }

  // password must be at least 6 characters
  if (password.length < 6) {
    passwordError.textContent = "Password must be at least 6 characters";
    isValid = false;
  } else if (password !== passwordAgain) {
    passwordError.textContent = "Passwords do not match";
    isValid = false;
  }

  if (isValid) {
    document.querySelector("#signupForm").submit();
  }
}
