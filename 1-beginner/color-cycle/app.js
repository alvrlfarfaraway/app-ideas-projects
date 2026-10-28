const form = document.getElementById("cycle-form");
const colorBox = document.getElementById("color-box");
const colorCode = document.getElementById("color-code");
const colorAlt = document.getElementById("color-alt");
const formatPicker = document.getElementById("format-picker");
const componentRows = document.getElementById("component-rows");
const rowTemplate = document.getElementById("component-row-template");
const wrapHint = document.getElementById("wrap-hint");
const intervalInput = document.getElementById("interval-input");
const intervalValue = document.getElementById("interval-value");
const toggleButton = document.getElementById("toggle-button");
const resetButton = document.getElementById("reset-button");
const startSwatch = document.getElementById("start-swatch");
const statusText = document.getElementById("status");

const state = {
  format: "rgb",
  values: [...DEFAULT_COLOR],
  // Warna terakhir yang diketik pengguna; tombol "Kembali ke awal" memulihkannya.
  start: [...DEFAULT_COLOR],
  increments: { rgb: [...DEFAULT_INCREMENTS.rgb], hsl: [...DEFAULT_INCREMENTS.hsl] },
  interval: INTERVAL.default,
  isValid: true,
  timerId: null,
};

// Elemen setiap baris komponen (R, G, B atau H, S, L) untuk format yang aktif.
let rows = [];

function isRunning() {
  return state.timerId !== null;
}

// Membuat ulang baris input sesuai format yang aktif.
function buildRows() {
  const { components, hexValues } = FORMATS[state.format];
  componentRows.replaceChildren();
  rows = components.map((component, index) => {
    const row = rowTemplate.content.firstElementChild.cloneNode(true);
    const name = row.querySelector(".name-text");
    const valueInput = row.querySelector(".value-input");
    const incrementInput = row.querySelector(".increment-input");
    const error = row.querySelector(".error");
    const max = component.modulus - 1;

    name.id = `component-name-${index}`;
    name.textContent = `${component.name} (${component.symbol})`;
    error.id = `component-error-${index}`;
    valueInput.setAttribute("aria-labelledby", `${name.id} value-heading`);
    incrementInput.setAttribute("aria-labelledby", `${name.id} increment-heading`);
    valueInput.setAttribute("aria-describedby", error.id);
    incrementInput.setAttribute("aria-describedby", error.id);

    if (hexValues) {
      valueInput.type = "text";
      valueInput.maxLength = 2;
      valueInput.classList.add("is-hex");
    } else {
      valueInput.type = "number";
      valueInput.min = 0;
      valueInput.max = max;
      valueInput.step = 1;
    }
    incrementInput.min = -max;
    incrementInput.max = max;
    row.style.setProperty("--meter-color", component.color ?? "var(--accent)");

    componentRows.append(row);
    return {
      valueInput,
      incrementInput,
      error,
      swatch: row.querySelector(".swatch"),
      note: row.querySelector(".value-note"),
      meterFill: row.querySelector(".meter-fill"),
    };
  });
  wrapHint.textContent = FORMATS[state.format].wrapHint;
}

// Input number mengosongkan value jika isinya bukan angka (misalnya baru "-"),
// jadi isian seperti itu diganti "?" agar tetap ditolak dengan pesan yang jelas.
function readText(input) {
  return input.validity.badInput ? "?" : input.value;
}

// Membaca semua isian, menyimpan nilai yang valid ke state, dan menampilkan peringatan.
function readFields() {
  const { components, hexValues } = FORMATS[state.format];
  const increments = state.increments[state.format];
  state.isValid = true;

  rows.forEach((row, index) => {
    const { symbol, modulus } = components[index];
    const max = modulus - 1;
    const valueText = readText(row.valueInput);
    const value = hexValues ? parseHexComponent(valueText) : parseInteger(valueText, 0, max);
    const increment = parseInteger(readText(row.incrementInput), -max, max);

    if (value.error === "") {
      state.values[index] = value.value;
    }
    if (increment.error === "") {
      increments[index] = increment.value;
    }

    row.valueInput.setAttribute("aria-invalid", value.error === "" ? "false" : "true");
    row.incrementInput.setAttribute("aria-invalid", increment.error === "" ? "false" : "true");
    row.error.textContent = [
      value.error && `Nilai ${symbol}: ${value.error}`,
      increment.error && `Kenaikan ${symbol}: ${increment.error}`,
    ].filter(Boolean).join(" ");

    if (value.error !== "" || increment.error !== "") {
      state.isValid = false;
    }
  });
}

// Menulis nilai dan kenaikan dari state ke isian. Nilai di state selalu valid,
// jadi semua peringatan ikut dihapus.
function writeFields() {
  const { hexValues } = FORMATS[state.format];
  rows.forEach((row, index) => {
    const value = state.values[index];
    row.valueInput.value = hexValues ? toHex2(value) : String(value);
    row.incrementInput.value = String(state.increments[state.format][index]);
    row.valueInput.setAttribute("aria-invalid", "false");
    row.incrementInput.setAttribute("aria-invalid", "false");
    row.error.textContent = "";
  });
  state.isValid = true;
}

// Memperbarui kotak warna, kode warnanya, dan tampilan tiap komponen.
function renderColor() {
  const { components, hexValues } = FORMATS[state.format];
  const otherFormat = state.format === "rgb" ? "hsl" : "rgb";
  const code = cssColor(state.format, state.values);

  colorBox.style.backgroundColor = code;
  colorBox.style.color = readableTextColor(convertValues(state.values, state.format, "rgb"));
  colorCode.textContent = code;
  colorAlt.textContent = `≈ ${cssColor(otherFormat, convertValues(state.values, state.format, otherFormat))}`;
  startSwatch.style.backgroundColor = cssColor(state.format, state.start);

  rows.forEach((row, index) => {
    const value = state.values[index];
    const { modulus, unit } = components[index];
    row.swatch.style.backgroundColor = isolatedColor(state.format, index, state.values);
    // Selama isian salah, nilai desimalnya tidak diketahui; jangan tampilkan nilai lama.
    const isInvalid = row.valueInput.getAttribute("aria-invalid") === "true";
    row.note.textContent = hexValues ? `= ${isInvalid ? "?" : value}` : unit;
    row.meterFill.style.width = `${(value / (modulus - 1)) * 100}%`;
  });
}

// Mengunci isian selama warna berputar dan menyesuaikan tombol.
function renderControls() {
  const running = isRunning();
  toggleButton.textContent = running ? "Berhenti" : "Mulai";
  toggleButton.classList.toggle("is-running", running);
  toggleButton.disabled = !running && !state.isValid;
  resetButton.disabled = running;
  formatPicker.disabled = running;
  for (const row of rows) {
    row.valueInput.readOnly = running;
    row.incrementInput.readOnly = running;
  }

  if (running) {
    statusText.textContent = "Nilai dan kenaikan dikunci selama warna berputar. Tekan Berhenti untuk mengubahnya.";
  } else if (!state.isValid) {
    statusText.textContent = "Perbaiki isian yang bertanda merah agar bisa memulai.";
  } else {
    statusText.textContent = "";
  }
}

function scheduleTick() {
  state.timerId = setTimeout(() => {
    state.values = nextValues(state.format, state.values, state.increments[state.format]);
    writeFields();
    renderColor();
    scheduleTick();
  }, state.interval);
}

function start() {
  scheduleTick();
  renderControls();
}

function stop() {
  clearTimeout(state.timerId);
  state.timerId = null;
  renderControls();
}

// Tombol Mulai/Berhenti adalah tombol submit, jadi Enter di salah satu isian juga menjalankannya.
form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (isRunning()) {
    stop();
  } else if (state.isValid) {
    start();
  }
});

componentRows.addEventListener("input", (event) => {
  readFields();
  // Mengetik warna baru menjadikannya warna awal; mengubah kenaikan saja tidak.
  if (event.target.classList.contains("value-input")) {
    state.start = [...state.values];
  }
  renderColor();
  renderControls();
});

formatPicker.addEventListener("change", (event) => {
  const format = event.target.value;
  state.values = convertValues(state.values, state.format, format);
  state.start = convertValues(state.start, state.format, format);
  state.format = format;
  buildRows();
  writeFields();
  renderColor();
  renderControls();
});

resetButton.addEventListener("click", () => {
  state.values = [...state.start];
  writeFields();
  renderColor();
  renderControls();
});

intervalInput.addEventListener("input", () => {
  state.interval = clampInt(intervalInput.value, INTERVAL);
  intervalValue.textContent = `${state.interval} ms`;
  // Mulai ulang timer agar interval baru langsung terasa, bukan setelah langkah berikutnya.
  if (isRunning()) {
    clearTimeout(state.timerId);
    scheduleTick();
  }
});

intervalInput.value = state.interval;
intervalValue.textContent = `${state.interval} ms`;
buildRows();
writeFields();
renderColor();
renderControls();
