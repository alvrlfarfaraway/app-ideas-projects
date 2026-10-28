const CORNERS = ["top-left", "top-right", "bottom-right", "bottom-left"]; // urutan sesuai CSS
const MAX_VALUE = { px: 240, "%": 100 }; // 240px = ukuran kotak pratinjau

const controls = document.getElementById("controls");
const unitSelect = document.getElementById("unit-select");
const advancedToggle = document.getElementById("advanced-toggle");
const sliders = controls.querySelectorAll('input[type="range"]');
const previewBox = document.getElementById("preview-box");
const cssCode = document.getElementById("css-code");
const copyButton = document.getElementById("copy-button");
const copyStatus = document.getElementById("copy-status");

let statusTimer;

function getSlider(corner, axis) {
  return document.getElementById(`${corner}-${axis}`);
}

// Membaca nilai slider keempat sudut untuk satu sumbu ("x" = horizontal, "y" = vertikal).
function readValues(axis) {
  return CORNERS.map((corner) => Number(getSlider(corner, axis).value));
}

// Memperbarui kotak pratinjau, teks CSS, dan angka di samping setiap slider.
function render() {
  const unit = unitSelect.value;
  const isAdvanced = advancedToggle.checked;
  const horizontal = readValues("x");
  // Pada mode 4 nilai, radius vertikal selalu sama dengan radius horizontal.
  const vertical = isAdvanced ? readValues("y") : horizontal;
  const borderRadius = buildBorderRadius(horizontal, vertical, unit);

  controls.classList.toggle("is-advanced", isAdvanced);
  previewBox.style.borderRadius = borderRadius;
  cssCode.textContent = `border-radius: ${borderRadius};`;

  for (const slider of sliders) {
    const text = `${slider.value}${unit}`;
    controls.querySelector(`output[for="${slider.id}"]`).textContent = text;
    slider.setAttribute("aria-valuetext", text);
  }
}

// Menyesuaikan batas maksimum slider dengan satuan yang dipilih.
function applyUnitLimit() {
  const max = MAX_VALUE[unitSelect.value];
  for (const slider of sliders) {
    slider.max = max;
    slider.value = Math.min(Number(slider.value), max);
  }
}

function showStatus(message, isError) {
  copyStatus.textContent = message;
  copyStatus.classList.toggle("is-error", isError);
  clearTimeout(statusTimer);
  statusTimer = setTimeout(() => {
    copyStatus.textContent = "";
  }, 3000);
}

// Memilih teks CSS agar pengguna bisa menyalinnya sendiri dengan Ctrl+C.
function selectCssText() {
  const range = document.createRange();
  range.selectNodeContents(cssCode);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
}

async function copyCss() {
  try {
    await navigator.clipboard.writeText(cssCode.textContent);
    showStatus("CSS tersalin ke clipboard.", false);
  } catch {
    selectCssText();
    showStatus("Tidak bisa menyalin otomatis. Teks sudah dipilih, tekan Ctrl+C.", true);
  }
}

for (const slider of sliders) {
  slider.addEventListener("input", render);
}

unitSelect.addEventListener("change", () => {
  applyUnitLimit();
  render();
});

advancedToggle.addEventListener("change", () => {
  if (advancedToggle.checked) {
    // Mulai dari bentuk yang sama: radius vertikal disamakan dengan radius horizontal.
    for (const corner of CORNERS) {
      getSlider(corner, "y").value = getSlider(corner, "x").value;
    }
  }
  render();
});

copyButton.addEventListener("click", copyCss);

applyUnitLimit();
render();
