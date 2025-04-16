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
  loadPokemonData();
  buildSideMenu();

  if (window.innerWidth <= 900) {
    sideMenu.classList.add("closed");
  }

  hamburger.addEventListener("click", (event) => {
    sideMenu.classList.toggle("closed");
  });

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

});



// +++++++++++ section 5: explanation of site ++++++++

//dynamically create explanation page
window.getExplanation = function (){
  cardContainer.innerHTML = `
   <button id="back-to-list">Back to All</button>
   <div class="explanation-text-wrapper">
     <strong>TLDR: A meta threat is a pokemon that contestants are extremely likely to encounter at the World Pokemon Video Game Championships in Anaheim this upcoming August 2025. This site is to act as a lookup guide for Worlds attendees and competitors.</strong>
     Long explanation:
     <br><br>
     Competitive Pokemon is becoming increasingly popular with 2024 and 2025 continuously breaking records for competition entrants. As we approach the World Pokemon Video Game Championship (aka VGC Worlds), money, pride, and the World Champion title are at stake. You might think that you could possibly see every pokemon or that you will only see the strongest pokemon but the reality is neither of those are true.
     <br><br>
     VGC as a culture is not in a vacuum and as a result the pokemon that trainers choose are also not in a vacuum. Therefore only certain pokemon have a reasonable viability and desirability within the current cultural moment. This cultural moment which is constantly shifting and evolving is known as the meta. As you can imagine, there is a life-cycle when it comes to metas.
     <br><br>
     Let's say a new Pokemon game comes out with many new strong pokemon. Trainers begin to compete with these strong pokemon, and the field may be oversaturated with a select few. As they dominate the competitive play, trainers innovate and come up with counterplays. Eventually those counterplays become so dominant that the old meta can no longer reliably compete against such a wide field of counterplay. Therein, a new meta has been developed. Players continue to innovate and the life-cycle continues.
     <br><br>
     Metas experience the most amount of radical change when a new rule-set takes effect or a new game comes out because the new restraints shape what kinds of Pokemon are allowed on competitive teams. Beginning on May 1, 2025, we will begin a new ruleset: Regulation I (Reg I). This ruleset is the first time in generation 10 (Scarlet and Violet) that two restricted pokemon will be allowed. Restricted Pokemon are legendary pokemon, normally of a much higher caliber than your average pokemon. Therefore, the meta warps considerably around them as teams are made to utilize these restricted threats to their fullest potential.
     <br><br>
     I have been playing the competitive online ladder; keeping up with the latest regional, national, and international championships; and keeping tabs on the biggest professional champion hopefuls to gain a deep understanding of what the current meta is and how it is likely to change while we move into Reg I which will be used for Worlds. With my finger on the pulse and continuous updates, I hope to create a curated list of the largest META THREATS at Worlds that the user can reorganize so that they can compare the field.
   </div>


  
  
  `;

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