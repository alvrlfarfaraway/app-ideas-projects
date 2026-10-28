const displayElement = document.getElementById("display");
const expressionElement = document.getElementById("expression");
const keypad = document.getElementById("keypad");

// Tombol keyboard dan tombol kalkulator yang dipicunya. Digit 0–9 ditangani terpisah.
const KEYBOARD_KEYS = new Map([
  ["+", "+"],
  ["-", "-"],
  ["*", "*"],
  ["x", "*"],
  ["/", "/"],
  [".", "."],
  [",", "."],
  ["=", "="],
  ["Enter", "="],
  ["Backspace", "C"],
  ["Delete", "C"],
  ["Escape", "AC"],
]);

let state = createCalculator();

// Memperbarui layar setelah setiap tombol.
function render() {
  const text = getDisplay(state);
  displayElement.textContent = text;
  displayElement.classList.toggle("is-error", state.error);
  displayElement.classList.toggle("is-long", text.length > 8);
  expressionElement.textContent = state.expression;

  // Operasi yang sedang menunggu angka kedua diberi warna penuh.
  const pendingOperator = state.entry === null && !state.error ? state.operator : null;
  for (const button of keypad.querySelectorAll(".key-operator")) {
    button.classList.toggle("is-active", button.dataset.key === pendingOperator);
  }
}

function handleKey(key) {
  state = press(state, key);
  render();
}

// Efek tekan singkat pada tombol di layar saat tombol keyboard yang sesuai ditekan.
function flashButton(key) {
  const button = keypad.querySelector(`[data-key="${key}"]`);
  if (button === null) {
    return;
  }
  button.classList.add("is-pressed");
  setTimeout(() => button.classList.remove("is-pressed"), 120);
}

keypad.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-key]");
  if (button !== null) {
    handleKey(button.dataset.key);
  }
});

// Klik mouse tidak memindahkan fokus ke tombol, jadi Enter di keyboard tetap berarti "=".
keypad.addEventListener("mousedown", (event) => {
  if (event.target.closest("button") !== null) {
    event.preventDefault();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.ctrlKey || event.metaKey || event.altKey) {
    return;
  }
  // Tombol yang difokus lewat Tab tetap bisa ditekan dengan Enter atau Spasi.
  if (event.target instanceof HTMLButtonElement && (event.key === "Enter" || event.key === " ")) {
    return;
  }
  const key = /^[0-9]$/.test(event.key) ? event.key : KEYBOARD_KEYS.get(event.key);
  if (key === undefined) {
    return;
  }
  event.preventDefault();
  handleKey(key);
  flashButton(key);
});

render();
