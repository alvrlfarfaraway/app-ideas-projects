const HUE_STEP = 45; // setiap orang mendapat warna avatar yang berbeda

const personList = document.getElementById("person-list");
const detailPane = document.getElementById("detail-pane");
const emptyState = document.getElementById("empty-state");
const details = document.getElementById("details");
const detailAvatar = document.getElementById("detail-avatar");
const detailName = document.getElementById("detail-name");
const detailAddress = document.getElementById("detail-address");
const detailTelephone = document.getElementById("detail-telephone");
const detailBirthday = document.getElementById("detail-birthday");

function getHue(index) {
  return (index * HUE_STEP) % 360;
}

// Membuat daftar nama di panel ringkasan dari data `people`.
function renderList() {
  people.forEach((person, index) => {
    const avatar = document.createElement("span");
    avatar.className = "avatar";
    avatar.setAttribute("aria-hidden", "true");
    avatar.style.setProperty("--hue", getHue(index));
    avatar.textContent = getInitials(person.name);

    const name = document.createElement("span");
    name.textContent = person.name;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "person-button";
    button.dataset.index = index;
    button.append(avatar, name);

    const item = document.createElement("li");
    item.append(button);
    personList.append(item);
  });
}

// Mengisi panel detail dengan data satu orang.
function showDetails(index) {
  const person = people[index];
  const age = calculateAge(person.birthday, new Date());

  detailAvatar.style.setProperty("--hue", getHue(index));
  detailAvatar.textContent = getInitials(person.name);
  detailName.textContent = person.name;
  detailAddress.textContent = formatAddress(person);
  detailTelephone.textContent = person.telephone;
  detailBirthday.textContent = `${formatBirthday(person.birthday)} · ${age} tahun`;

  emptyState.hidden = true;
  details.hidden = false;
}

// Menandai nama yang diklik sebagai terpilih, lalu menghapus tanda dari nama sebelumnya.
function selectPerson(button) {
  const previous = personList.querySelector('[aria-current="true"]');
  if (previous) {
    previous.removeAttribute("aria-current");
  }
  button.setAttribute("aria-current", "true");
  showDetails(Number(button.dataset.index));

  // Di layar sempit panel detail berada di bawah daftar, jadi gulir agar terlihat.
  detailPane.scrollIntoView({ block: "nearest" });
}

// Satu event listener untuk seluruh daftar (event delegation).
personList.addEventListener("click", (event) => {
  const button = event.target.closest(".person-button");
  if (button) {
    selectPerson(button);
  }
});

renderList();
