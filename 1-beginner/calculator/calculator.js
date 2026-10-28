// Batas angka sesuai spesifikasi.
const MAX_INTEGER_DIGITS = 8; // digit di depan titik desimal
const MAX_DECIMAL_DIGITS = 3; // digit di belakang titik desimal (fitur bonus)

// Angka disimpan sebagai BigInt dalam satuan seperseribu, contoh 1.5 -> 1500n.
// Karena semuanya bilangan bulat, 0.1 + 0.2 hasilnya tepat 0.3 (tanpa galat floating point).
const SCALE = 10n ** BigInt(MAX_DECIMAL_DIGITS);

// Hasil yang nilai mutlaknya mencapai 100000000 (9 digit) ditampilkan sebagai ERR.
const LIMIT = 10n ** BigInt(MAX_INTEGER_DIGITS) * SCALE;

const OPERATOR_SYMBOLS = { "+": "+", "-": "−", "*": "×", "/": "÷" };

/**
 * Membuat state awal kalkulator: layar menampilkan 0.
 *
 * State tidak pernah diubah langsung. Setiap tombol menghasilkan state baru, dan
 * `previous` menyimpan state sebelum operasi terakhir agar tombol C bisa membatalkannya.
 */
function createCalculator() {
  return {
    entry: null, // angka yang sedang diketik, contoh "12.5"; "" setelah dihapus dengan C; null jika tidak ada
    accumulator: null, // hasil sementara, dalam satuan seperseribu
    operator: null, // operasi yang menunggu angka kedua: "+", "-", "*", atau "/"
    lastOperation: null, // operasi terakhir untuk "=" berulang: { operator, operand }
    expression: "", // teks kecil di atas layar, contoh "5 +"
    justEvaluated: false, // true tepat setelah "=" ditekan
    error: false, // true jika layar menampilkan ERR
    previous: null, // state sebelum operasi terakhir
  };
}

/** Mengubah angka yang diketik menjadi satuan seperseribu, contoh "-12.5" -> -12500n. */
function entryToValue(entry) {
  const negative = entry.startsWith("-");
  const digits = negative ? entry.slice(1) : entry;
  const dotIndex = digits.indexOf(".");
  const integerPart = dotIndex === -1 ? digits : digits.slice(0, dotIndex);
  const decimalPart = dotIndex === -1 ? "" : digits.slice(dotIndex + 1);
  const value = BigInt(integerPart || "0") * SCALE + BigInt(decimalPart.padEnd(MAX_DECIMAL_DIGITS, "0"));
  return negative ? -value : value;
}

/** Mengubah nilai seperseribu menjadi teks layar, contoh 3750n -> "3.75". Nol di belakang dibuang. */
function formatValue(value) {
  const negative = value < 0n;
  const absolute = negative ? -value : value;
  const integerPart = (absolute / SCALE).toString();
  const decimalPart = (absolute % SCALE).toString().padStart(MAX_DECIMAL_DIGITS, "0").replace(/0+$/, "");
  return (negative ? "-" : "") + integerPart + (decimalPart === "" ? "" : `.${decimalPart}`);
}

/** Menyusun teks perhitungan untuk baris di atas layar, contoh "5 + (-3)". */
function describe(a, operator, b) {
  const right = b < 0n ? `(${formatValue(b)})` : formatValue(b);
  return `${formatValue(a)} ${OPERATOR_SYMBOLS[operator]} ${right}`;
}

/** Membagi dua BigInt lalu membulatkan ke bilangan bulat terdekat; setengah dibulatkan menjauhi nol. */
function divideRounded(numerator, denominator) {
  const negative = (numerator < 0n) !== (denominator < 0n);
  const n = numerator < 0n ? -numerator : numerator;
  const d = denominator < 0n ? -denominator : denominator;
  const quotient = n / d + ((n % d) * 2n >= d ? 1n : 0n);
  return negative ? -quotient : quotient;
}

/**
 * Menghitung `a operator b` tanpa eval(). Hasil kali dan bagi dibulatkan ke 3 angka desimal.
 * Mengembalikan null jika hasilnya tidak bisa ditampilkan: lebih dari 8 digit, atau dibagi nol.
 */
function calculate(a, operator, b) {
  let result;
  switch (operator) {
    case "+":
      result = a + b;
      break;
    case "-":
      result = a - b;
      break;
    case "*":
      result = divideRounded(a * b, SCALE);
      break;
    case "/":
      if (b === 0n) {
        return null;
      }
      result = divideRounded(a * SCALE, b);
      break;
  }
  const absolute = result < 0n ? -result : result;
  return absolute < LIMIT ? result : null;
}

/** Tombol digit: menambahkan satu digit ke angka yang sedang diketik. Digit yang melewati batas diabaikan. */
function pressDigit(state, digit) {
  // Setelah "=" atau ERR, digit baru memulai perhitungan baru.
  const current = state.justEvaluated || state.error ? createCalculator() : state;
  const entry = current.entry ?? "";
  const dotIndex = entry.indexOf(".");

  if (dotIndex !== -1) {
    const decimalDigits = entry.length - dotIndex - 1;
    return decimalDigits < MAX_DECIMAL_DIGITS ? { ...current, entry: entry + digit } : current;
  }
  if (entry === "" || entry === "0") {
    return { ...current, entry: digit }; // nol di depan diganti, jadi "07" menjadi "7"
  }
  const integerDigits = entry.startsWith("-") ? entry.length - 1 : entry.length;
  return integerDigits < MAX_INTEGER_DIGITS ? { ...current, entry: entry + digit } : current;
}

/** Tombol "." (fitur bonus): memulai bagian desimal. Titik kedua diabaikan. */
function pressDecimal(state) {
  const current = state.justEvaluated || state.error ? createCalculator() : state;
  const entry = current.entry ?? "";
  if (entry.includes(".")) {
    return current;
  }
  return { ...current, entry: `${entry === "" ? "0" : entry}.` };
}

/**
 * Tombol operasi (+, -, *, /). Jika sudah ada operasi yang menunggu, hasilnya dihitung dulu,
 * jadi 5 + 3 * menampilkan 8, lalu menunggu angka berikutnya untuk dikali.
 */
function pressOperator(state, operator) {
  if (state.error) {
    return state;
  }
  const next = { ...state, entry: null, operator, lastOperation: null, justEvaluated: false, previous: state };

  if (state.entry === null) {
    // Belum ada angka baru: ganti operasi yang menunggu, atau lanjutkan dari hasil "=".
    const accumulator = state.accumulator ?? 0n;
    return { ...next, accumulator, expression: `${formatValue(accumulator)} ${OPERATOR_SYMBOLS[operator]}` };
  }

  const value = entryToValue(state.entry);
  const result = state.operator === null ? value : calculate(state.accumulator, state.operator, value);
  if (result === null) {
    return { ...next, error: true, expression: describe(state.accumulator, state.operator, value) };
  }
  return { ...next, accumulator: result, expression: `${formatValue(result)} ${OPERATOR_SYMBOLS[operator]}` };
}

/**
 * Tombol "=": menampilkan hasil.
 * - 5 + 3 =   -> 8  (dua angka terakhir)
 * - 5 + =     -> 10 (angka terakhir dipakai dua kali)
 * - 5 + 3 = = -> 11 (operasi terakhir diulang)
 * - 7 =       -> 7  (hanya ada satu angka)
 */
function pressEquals(state) {
  if (state.error) {
    return state;
  }

  let operator;
  let operand;
  if (state.operator !== null) {
    operator = state.operator;
    operand = state.entry === null ? state.accumulator : entryToValue(state.entry);
  } else if (state.justEvaluated && state.lastOperation !== null) {
    ({ operator, operand } = state.lastOperation);
  } else if (state.entry !== null) {
    const value = entryToValue(state.entry);
    return {
      ...state,
      entry: null,
      accumulator: value,
      justEvaluated: true,
      expression: `${formatValue(value)} =`,
      previous: state,
    };
  } else {
    return state;
  }

  const result = calculate(state.accumulator, operator, operand);
  const next = {
    ...state,
    entry: null,
    operator: null,
    justEvaluated: true,
    expression: `${describe(state.accumulator, operator, operand)} =`,
    previous: state,
  };
  if (result === null) {
    return { ...next, error: true };
  }
  return { ...next, accumulator: result, lastOperation: { operator, operand } };
}

/**
 * Tombol C: menghapus angka atau operasi terakhir.
 * - Jika sedang mengetik angka, angka itu dihapus dan layar menjadi 0.
 * - Jika yang terakhir berupa operasi, operasi itu dibatalkan dan layar kembali ke nilai sebelumnya.
 */
function pressClear(state) {
  if (state.entry !== null && state.entry !== "") {
    return { ...state, entry: "" };
  }
  return state.previous ?? createCalculator();
}

/** Tombol ± (fitur bonus): mengubah tanda angka yang sedang tampil di layar. */
function pressToggleSign(state) {
  if (state.error) {
    return state;
  }
  if (state.entry !== null) {
    // Angka yang sedang diketik. Nol tidak punya tanda, jadi dibiarkan.
    if (entryToValue(state.entry) === 0n) {
      return state;
    }
    const entry = state.entry.startsWith("-") ? state.entry.slice(1) : `-${state.entry}`;
    return { ...state, entry };
  }
  if (state.accumulator === null || state.accumulator === 0n) {
    return state;
  }
  // Layar menampilkan hasil, jadi tanda hasil itu yang diubah: 5 + 3 = ± menjadi -8.
  const accumulator = -state.accumulator;
  const expression = state.operator === null ? "" : `${formatValue(accumulator)} ${OPERATOR_SYMBOLS[state.operator]}`;
  return { ...state, accumulator, expression, previous: state };
}

/** Menekan satu tombol: "0"–"9", ".", "+", "-", "*", "/", "=", "C", "AC", atau "+/-". */
function press(state, key) {
  if (/^[0-9]$/.test(key)) {
    return pressDigit(state, key);
  }
  switch (key) {
    case ".":
      return pressDecimal(state);
    case "+":
    case "-":
    case "*":
    case "/":
      return pressOperator(state, key);
    case "=":
      return pressEquals(state);
    case "C":
      return pressClear(state);
    case "AC":
      return createCalculator(); // hapus semua
    case "+/-":
      return pressToggleSign(state);
    default:
      return state;
  }
}

/** Teks yang tampil di layar utama. */
function getDisplay(state) {
  if (state.error) {
    return "ERR";
  }
  if (state.entry !== null) {
    return state.entry === "" ? "0" : state.entry;
  }
  return state.accumulator === null ? "0" : formatValue(state.accumulator);
}
