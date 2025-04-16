import { Pokemon } from './Pokemon.js';
import { typeChart } from './typeChart.js';

let loadedPokemon = []; 
let currentSortStat = "id"; 
let currentSortOrder = "asc"; 
let defensiveRelationships  = {
      normal: 1,
      fire: 1,
      water: 1,
      electric: 1,
      grass: 1,
      ice: 1,
      fighting: 1,
      poison: 1,
      ground: 1,
      flying: 1,
      psychic: 1,
      bug: 1,
      rock: 1,
      ghost: 1,
      dragon: 1,
      dark: 1,
      steel: 1,
      fairy: 1,
    }
    const cardContainer = document.getElementById("card-container");
    const sideMenu = document.getElementById("side-menu");
    const hamburger = document.getElementById("hamburger");




//++++++++++ Section 1:loading and showing mons +++++++

//load and parse
//loads data from json, parses the data
//calls build pokemon object, pushes into loadedPokemon
//calls sort and display
async function loadPokemonData() { 
  const response = await fetch('./metaMons.json'); 
  const jsonData = await response.json();
  cardContainer.innerHTML = "";

  for (const raw of jsonData) { 
    const pokemon = buildPokemonFromRaw(raw);
    loadedPokemon.push(pokemon);
  }
  sortAndDisplayPokemon();
}

//accepts the raw json parsed object from its array
// returns a pokemon object made from it
function buildPokemonFromRaw(raw) {
  return new Pokemon({
    name: raw.name,
    id: raw.id,
    type1: raw.types[0].type.name || null, 
    type2: raw.types[1]?.type.name || null, 
    hp: raw.stats.find(s => s.stat.name === "hp").base_stat, 
    attack: raw.stats.find(s => s.stat.name === "attack").base_stat,
    defense: raw.stats.find(s => s.stat.name === "defense").base_stat,
    specialAttack: raw.stats.find(s => s.stat.name === "special-attack").base_stat,
    specialDefense: raw.stats.find(s => s.stat.name === "special-defense").base_stat,
    speed: raw.stats.find(s => s.stat.name === "speed").base_stat,
    weight: raw.weight,
    spritesFront: raw.sprites.other["official-artwork"].front_default,
    abilities: raw.abilities.map(a => ({
      name: a.ability.name,
      isHidden: a.is_hidden
    })),
    moves: raw.moves?.map(m => m.move.name).sort()
  });
}

//creates card from card template
//display
function publishCardsFromList() { 
  for (const pokemon of loadedPokemon){
    const templateCard = document.querySelector(".card");
    const newCard = templateCard.cloneNode(true);
    newCard.style.display = "block";
  
    newCard.querySelector("h2").textContent = pokemon.name;
    const cardImage = newCard.querySelector("img");
    cardImage.src = pokemon.image;
    cardImage.alt = `${pokemon.name} image`;
  
    const list = newCard.querySelector("ul");
    list.innerHTML = `
      <li>Type: ${pokemon.type1}${pokemon.type2 ? ' / ' + pokemon.type2 : ''}</li>
      <li>HP: ${pokemon.hp}</li>
      <li>Attack: ${pokemon.attack}</li>
      <li>Defense: ${pokemon.defense}</li>
      <li>Special Attack: ${pokemon.specialAttack}</li>
      <li>Special Defense: ${pokemon.specialDefense}</li>
      <li>Speed: ${pokemon.speed}</li>
      <li>Weight: ${pokemon.weight}</li>
    `;

    newCard.onclick = () => {
        displayDetails(pokemon);
    };
    
    cardContainer.appendChild(newCard);

  }
  notCardsStylesOff();
}

function setupBackToListButton() {
  document.getElementById("back-to-list").onclick = () => {
    cardContainer.innerHTML = "";
    publishCardsFromList();
  };
}

//+++++++++section 2: sorting +++++++++

//sorts the loadedPokemon via stat and ascending/descending
//calls publishCardsFromList
function sortAndDisplayPokemon() {
  loadedPokemon.sort((a, b) => {
    const valA = a[currentSortStat];
    const valB = b[currentSortStat];

    if (typeof valA === "string" && typeof valB === "string") {
      return currentSortOrder === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    }

    if (valA === valB) {
      return (a.id - b.id);
    }

    return currentSortOrder === "asc" ? valA - valB : valB - valA;
  });
  cardContainer.innerHTML = "";
  publishCardsFromList();
}


//builds side menu dynamically
//buttons sort by stat ascending or descending
function buildSideMenu() {
  const sortingParams = [
    "name", "id", "hp", "attack", "defense", "specialAttack", "specialDefense", "speed", "weight"
  ]
  const sortingDisplayNames = {
    name: "Name",
    id: "ID",
    hp: "HP",
    attack: "Attack",
    defense: "Defense",
    specialAttack: "Sp Atk",
    specialDefense: "Sp Def",
    speed: "Speed",
    weight: "Weight"
  }
  sideMenu.innerHTML = ""; 

  const filterHeader = document.createElement("div");
  filterHeader.classList.add("side-menu-header");
  filterHeader.textContent = "Filters";
  sideMenu.appendChild(filterHeader);

  for (const stat of sortingParams) {
    const slotDiv = document.createElement("div");
    slotDiv.classList.add("side-menu-slots");

    const ascButton = document.createElement("button");
    ascButton.classList.add("sort-ascending");
    ascButton.textContent = "ASC";
    ascButton.onclick = () => {
      currentSortStat = stat;
      currentSortOrder = "asc";
      sortAndDisplayPokemon();
    }

    const statLabel = document.createElement("div");
    statLabel.classList.add("sorting-parameter");
    statLabel.textContent = sortingDisplayNames[stat];

    const descButton = document.createElement("button");
    descButton.classList.add("sort-descending");
    descButton.textContent = "DSC";
    descButton.onclick = () => {
      currentSortStat = stat;
      currentSortOrder = "desc";
      sortAndDisplayPokemon();
    }

    slotDiv.appendChild(ascButton);
    slotDiv.appendChild(statLabel);
    slotDiv.appendChild(descButton);
    sideMenu.appendChild(slotDiv);
  }
}

window.addEventListener("resize", () => {
  if (window.innerWidth <= 900) {
    sideMenu.classList.add("closed");
  } else {
    sideMenu.classList.remove("closed");
  }
});


// ++++++++++++ section 4: other functions ++++++++++

//causes this alert. Just for fun right now.
window.quoteAlert = function () {
  alert("Kyogre used Origin Pulse lol!");
}

//reformatted to remove cards on this system
window.removeLastCard = function () { 
  const cards = cardContainer.querySelectorAll(".card");
  cardContainer.removeChild(cards[cards.length - 1]);
  loadedPokemon.pop();
}

// the various functions that must run when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  runApp();
});

//initializes the app
function runApp() {
  loadPokemonData();
  buildSideMenu();
  setInitialSideMenuState();
  setupHamburgerToggle();
  setupOutsideClickToCloseMenu();
}

//menu is closed when we open app
function setInitialSideMenuState() {
  if (window.innerWidth <= 900) {
    sideMenu.classList.add("closed");
  }
}

//hamburger closes menu
function setupHamburgerToggle() {
  hamburger.addEventListener("click", () => {
    sideMenu.classList.toggle("closed");
  });
}

//prevent clicking from propagating back when menu open in mobile
function setupOutsideClickToCloseMenu() {
  document.addEventListener("click", (event) => {
    if (window.innerWidth <= 900 && !sideMenu.classList.contains("closed")) {
      const clickedElement = event.target;
      const clickedInsideSideMenu = sideMenu.contains(clickedElement);
      const clickedHamburger = hamburger.contains(clickedElement);
  
      if (!clickedInsideSideMenu && !clickedHamburger) {
        sideMenu.classList.add("closed");
        event.stopImmediatePropagation(); 
        event.preventDefault();
      }
    }
  }, true);
}



// +++++++++++ section 5: explanation of site ++++++++

//dynamically create explanation page
window.getExplanation = async function () {
  const response = await fetch('./explanation.html');
  const explanationHTML = await response.text();
  cardContainer.innerHTML = explanationHTML;

  setupBackToListButton();
  notCardsStylesOn();
}


// ++++++++++ section display details page +++++++++

//creates displayDetails page dynamically
function displayDetails(pokemon){
  calculateDefensiveMultipliers(pokemon);
  const typeEffectivenessHTML = Object.entries(defensiveRelationships)
  .map(([type, multiplier]) => `<li>${type.toUpperCase()}: x${multiplier}</li>`)
  .join("");

  const detailDiv = document.createElement("div");
  detailDiv.classList.add("detail-card");

  cardContainer.innerHTML = "";
  detailDiv.innerHTML = `
    <button id="back-to-list">Back to All</button>
    <h2>${pokemon.name}</h2>
    <img src="${pokemon.image}" alt="${pokemon.name} image">
    <h3>Type:</h3> 
      <ul>
        ${pokemon.type1}${pokemon.type2 ? ' / ' + pokemon.type2 : ''}
      </ul>
    <h3>Type Effectiveness</h3>
      <ul>
        ${typeEffectivenessHTML}
      </ul>
    <h3>Abilities</h3>
      <li> 
        ${pokemon.abilities.map(each => 
        each.name + (each.isHidden ? " (Hidden)" : "")).join(", ")}
      </li>
    <h3>Moves</h3>
      <ul>
        ${pokemon.moves.map(move => `<li>${move}</li>`).join("")}
      </ul>
    
  `;

  cardContainer.appendChild(detailDiv);
  notCardsStylesOn();
  setupBackToListButton();

}

//mutates defensive relationships map based on pokemon's type
function calculateDefensiveMultipliers(pokemon){
  for (const type in defensiveRelationships){
    defensiveRelationships[type] = 1;
  }
  for (const attackingType in typeChart[pokemon.type1]){
    defensiveRelationships[attackingType] *= typeChart[pokemon.type1][attackingType];
  }
  if (pokemon.type2){
    for (const attackingType in typeChart[pokemon.type2]){
      defensiveRelationships[attackingType] *= typeChart[pokemon.type2][attackingType];
    }
  }
}

//style for detail and explanation view
function notCardsStylesOn() {
    document.body.classList.add("not-list");
}

//turns off style for detail and explanation view
function notCardsStylesOff() {
    document.body.classList.remove("not-list");
}