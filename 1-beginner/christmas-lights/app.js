const lightRows = document.getElementById("light-rows");
const toggleButton = document.getElementById("toggle-button");
const intervalInput = document.getElementById("interval-input");
const intervalValue = document.getElementById("interval-value");
const intensityInput = document.getElementById("intensity-input");
const intensityValue = document.getElementById("intensity-value");
const rowsInput = document.getElementById("rows-input");
const rowsValue = document.getElementById("rows-value");
const editorTitle = document.getElementById("editor-title");
const colorInput = document.getElementById("color-input");
const sizeInput = document.getElementById("size-input");
const sizeValue = document.getElementById("size-value");

const state = {
  lights: DEFAULT_COLORS.map((color) => ({ color, size: SIZE.default })),
  interval: INTERVAL.default,
  intensity: INTENSITY.default,
  rows: ROWS.default,
  selected: 0,
  step: 0,
  timerId: null,
};

function isRunning() {
  return state.timerId !== null;
}

// Membuat ulang semua baris lampu. Hanya baris pertama berupa tombol agar
// pengguna keyboard tidak perlu melewati 49 lampu; baris lain tetap bisa diklik.
function buildRows() {
  lightRows.replaceChildren();
  for (let row = 0; row < state.rows; row++) {
    const rowElement = document.createElement("div");
    rowElement.className = "light-row";
    for (let index = 0; index < LIGHT_COUNT; index++) {
      const light = document.createElement(row === 0 ? "button" : "span");
      light.className = "light";
      light.dataset.index = index;
      if (row === 0) {
        light.type = "button";
      }
      rowElement.append(light);
    }
    lightRows.append(rowElement);
  }
  paintLights();
  updateLit();
}

// Menerapkan warna, ukuran, dan intensitas ke setiap lampu.
function paintLights() {
  for (const light of lightRows.querySelectorAll(".light")) {
    const index = Number(light.dataset.index);
    const { color, size } = state.lights[index];
    const { brightness, glow } = litAppearance(state.intensity, size);
    light.style.setProperty("--color", color);
    light.style.setProperty("--rgb", hexToRgb(color));
    light.style.setProperty("--size", `${size}px`);
    light.style.setProperty("--brightness", brightness);
    light.style.setProperty("--glow", `${glow}px`);
    light.classList.toggle("is-selected", index === state.selected);
    if (light.tagName === "BUTTON") {
      light.setAttribute("aria-label", `Lampu ${index + 1}, warna ${color}, ukuran ${size} piksel`);
      light.setAttribute("aria-pressed", index === state.selected ? "true" : "false");
    }
  }
}

// Menyalakan satu lampu per baris sesuai langkah saat ini; lampu sebelumnya
// otomatis kembali normal. Saat berhenti, semua lampu kembali normal.
function updateLit() {
  lightRows.querySelectorAll(".light-row").forEach((rowElement, row) => {
    const lit = isRunning() ? litIndex(state.step, row) : -1;
    rowElement.querySelectorAll(".light").forEach((light, index) => {
      light.classList.toggle("is-lit", index === lit);
    });
  });
}

function scheduleTick() {
  state.timerId = setTimeout(() => {
    state.step = (state.step + 1) % LIGHT_COUNT;
    updateLit();
    scheduleTick();
  }, state.interval);
}

function start() {
  scheduleTick();
  updateLit();
  toggleButton.textContent = "Berhenti";
  toggleButton.setAttribute("aria-pressed", "true");
}

function stop() {
  clearTimeout(state.timerId);
  state.timerId = null;
  updateLit();
  toggleButton.textContent = "Mulai";
  toggleButton.setAttribute("aria-pressed", "false");
}

// Menyamakan isi panel pengaturan lampu dengan lampu yang dipilih.
function renderEditor() {
  const { color, size } = state.lights[state.selected];
  editorTitle.textContent = `Lampu ${state.selected + 1}`;
  colorInput.value = color;
  sizeInput.value = size;
  sizeValue.textContent = `${size} px`;
}

toggleButton.addEventListener("click", () => {
  if (isRunning()) {
    stop();
  } else {
    start();
  }
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

intensityInput.addEventListener("input", () => {
  state.intensity = clampInt(intensityInput.value, INTENSITY);
  intensityValue.textContent = `${state.intensity}%`;
  paintLights();
});

rowsInput.addEventListener("input", () => {
  state.rows = clampInt(rowsInput.value, ROWS);
  rowsValue.textContent = state.rows;
  buildRows();
});

lightRows.addEventListener("click", (event) => {
  const light = event.target.closest(".light");
  if (light === null) {
    return;
  }
  state.selected = Number(light.dataset.index);
  paintLights();
  renderEditor();
});

colorInput.addEventListener("input", () => {
  state.lights[state.selected].color = colorInput.value;
  paintLights();
});

sizeInput.addEventListener("input", () => {
  state.lights[state.selected].size = clampInt(sizeInput.value, SIZE);
  sizeValue.textContent = `${state.lights[state.selected].size} px`;
  paintLights();
});

intervalInput.value = state.interval;
intervalValue.textContent = `${state.interval} ms`;
intensityInput.value = state.intensity;
intensityValue.textContent = `${state.intensity}%`;
rowsInput.value = state.rows;
rowsValue.textContent = state.rows;
buildRows();
renderEditor();
