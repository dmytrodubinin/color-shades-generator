const form = document.querySelector("form");
const userColor = document.querySelector(".js-color");
const userShadesInterval = document.querySelector(".js-shades-interval");
const submitBtn = document.querySelector(".js-btn");
const colorsHTML = document.querySelector(".colors");

let userColorValue;
let shadesInterval;

function init() {
  if (localStorage.getItem("color")) {
    userColorValue = localStorage.getItem("color");
    userColor.value = userColorValue;

    shadesInterval = +localStorage.getItem("shadesInterval") || 10;
    userShadesInterval.value = shadesInterval;
    generateColors();
  } else {
    userColorValue = userColor.value || "#385170";
    localStorage.setItem("color", userColorValue);
    shadesInterval = +localStorage.getItem("shadesInterval") || 10;
    generateColors();
  }
}

// generate colors by default or input values
function generateColors(e) {
  e ? e.preventDefault() : null;
  try {
    showError(false);
    if (userColor.value) {
      userColorValue = userColor.value || "#385170";
      localStorage.setItem("color", userColorValue);
    }
    if (userShadesInterval.value) {
      shadesInterval = +userShadesInterval.value;
      localStorage.setItem("shadesInterval", "" + shadesInterval);
    }
    let colorsArr = new Values(userColorValue).all(shadesInterval);

    colorsHTML.innerHTML = "";
    colorsArr.map((color) => {
      colorsHTML.innerHTML += `
      <div class="color" style="background-color: rgb(${color.rgb.join(",")});">
          <p class="color__value">${rgbToHex(...color.rgb)}</p>
          <p class="color__percent">${color.weight}%</p>
          <p class="color__alert">copied to clipboard</p>
      </div>`;
    });
    updateTextColor(shadesInterval);
  } catch (error) {
    showError(true);
  }
}

// change text color inside color block
function updateTextColor(shadesInterval) {
  const allColors = colorsHTML.querySelectorAll(".color");

  let index = 0;
  allColors.forEach((colorItem) => {
    if (100 / shadesInterval >= index) {
      colorItem.style.color = "black";
    } else {
      colorItem.style.color = "white";
    }
    index++;
  });
}

// show error
function showError(isShow) {
  if (isShow) {
    userColor.classList.add("error");
  } else {
    userColor.classList.remove("error");
  }
}

// copy to clipboard
function copyToClipboard(e) {
  let selectedColorEl;

  // check if click on color element
  if (e.target.classList.contains("color")) {
    selectedColorEl = e.target;
  }

  // check if click inner elements in color element
  if (
    e.target.classList.contains("color__value") ||
    e.target.classList.contains("color__percent") ||
    e.target.classList.contains("color__alert")
  ) {
    selectedColorEl = e.target.parentNode;
  }

  // check if click on colors block (parent block)
  if (e.target.classList.contains("colors")) {
    return;
  }

  selectedColorEl.querySelector(".color__alert").classList.add("show");
  setTimeout(() => {
    selectedColorEl.querySelector(".color__alert").classList.remove("show");
  }, 3000);

  // copy to clipboard
  navigator.clipboard.writeText(
    selectedColorEl.querySelector(".color__value").textContent
  );
}

// rgb to hex functions
function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

/* === Event Listeners === */
document.addEventListener("DOMContentLoaded", init);
submitBtn.addEventListener("click", generateColors);
colorsHTML.addEventListener("click", copyToClipboard);
