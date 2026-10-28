const MAX_DIGITS = 8;

const binaryInput = document.getElementById("binary-input");
const limitToggle = document.getElementById("limit-toggle");
const digitCounter = document.getElementById("digit-counter");
const errorMessage = document.getElementById("error-message");
const decimalOutput = document.getElementById("decimal-output");

// Mengembalikan pesan kesalahan untuk input, atau string kosong jika input valid.
function getErrorMessage(binary, isLimited) {
  const invalidCharacter = findInvalidCharacter(binary);
  if (invalidCharacter !== null) {
    return `Karakter "${invalidCharacter}" tidak valid. Bilangan biner hanya berisi 0 dan 1.`;
  }
  if (isLimited && binary.length > MAX_DIGITS) {
    return `Maksimal ${MAX_DIGITS} digit. Matikan "Batasi ${MAX_DIGITS} digit" untuk angka yang lebih panjang.`;
  }
  return "";
}

// Memperbarui tampilan setiap kali input atau opsi berubah.
function render() {
  const binary = binaryInput.value;
  const isLimited = limitToggle.checked;
  const error = getErrorMessage(binary, isLimited);

  digitCounter.textContent = isLimited ? `${binary.length}/${MAX_DIGITS} digit` : `${binary.length} digit`;
  digitCounter.classList.toggle("is-over", isLimited && binary.length > MAX_DIGITS);

  errorMessage.textContent = error;
  binaryInput.setAttribute("aria-invalid", error === "" ? "false" : "true");

  if (binary === "" || error !== "") {
    decimalOutput.textContent = "—";
  } else {
    decimalOutput.textContent = binaryToDecimal(binary).toString();
  }
}

binaryInput.addEventListener("input", render);
limitToggle.addEventListener("change", render);
render();
