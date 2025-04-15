import { Pokemon } from './Pokemon.js';
import { typeChart } from './typeChart.js';



// vars needed by multiple functions
let loadedPokemon = []; //keeping a list of all the pokemon we are supposed to show
let currentSortStat = "id"; //in beginning show by id, ascending :)
let currentSortOrder = "asc"; 
let defensiveRelationships  = {
      normal: 1,
      fire: 1,
      water: 1,
      electric: 1,
      grass: 1,
      ice: 1,
      fighting: 2,
      poison: 1,
      ground: 1,
      flying: 1,
      psychic: 1,
      bug: 1,
      rock: 1,
      ghost: 0,
      dragon: 1,
      dark: 1,
      steel: 1,
      fairy: 1,
    }


//++++++++++ Section 1:loading and showing mons +++++++
//this function akin to showCards
//load
async function loadPokemonData() { //must be marked async bc next 2 lines - allows me to await
  const response = await fetch('./metaMons.json'); //async function, return a promise. If don't use await, get promise object instead of response
  const jsonData = await response.json();// another async func - await pauses the function execution until promise resolved
  // this is in lieu of .then s

  //clear existing cards
  const cardContainer = document.getElementById("card-container");
  cardContainer.innerHTML = "";

  //loop through data, crete mon objects, show each card ;)
  for (const raw of jsonData) { //like an auto : loop for vectors in C++!
    const pokemon = buildPokemonFromRaw(raw);
    loadedPokemon.push(pokemon);

  }
  sortAndDisplayPokemon();
}

//parse
function buildPokemonFromRaw(raw) {

  return new Pokemon({
    name: raw.name,
    id: raw.id,
    type1: raw.types[0].type.name || null, 
    type2: raw.types[1]?.type.name || null, //? is opt chaining for not crashing if undefined
    hp: raw.stats.find(s => s.stat.name === "hp").base_stat, //find requires a function as it's parameter and return
    // go through each s in raw.stats array and return the matching one
    //anonymous arrow function called by .find yo :) every iteration
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
    })) || [],
    moves: raw.moves?.map(m => m.move.name) || []



  });
}

//display
function publishCardsFromList() { //this one akin to editCardContent
  for (const pokemon of loadedPokemon){
    const cardContainer = document.getElementById("card-container");
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
      const sideMenu = document.getElementById("side-menu");
      //only allow clicking if side menu is closed or not on mobile view :)
      if (window.innerWidth > 900 || sideMenu.classList.contains("closed")) {
        displayDetails(pokemon);
      } else {
        sideMenu.classList.add("closed");
      }
    };
    
    
  
    cardContainer.appendChild(newCard);

  }
}



//+++++++++section 2: sorting +++++++++

function sortAndDisplayPokemon() {
  loadedPokemon.sort((a, b) => {
    const valA = a[currentSortStat];
    const valB = b[currentSortStat];

    if (typeof valA === "string" && typeof valB === "string") {
      return currentSortOrder === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    }

    //IF TIE we sort by id
    if (valA === valB) {
      return a.id - b.id;
    }

    return currentSortOrder === "asc" ? valA - valB : valB - valA;
  });




  // now that we have the order we want, clear html and publish list
  const cardContainer = document.getElementById("card-container");
  cardContainer.innerHTML = "";
  publishCardsFromList();
}



function buildSideMenu() {
  // a local array and map to help organize
  // the array of what we want to sort by
  const sortingParams = [
    "name", "id", "hp", "attack", "defense", "specialAttack", "specialDefense", "speed", "weight"
  ]

  //map of what should be displayed based on what the stat is called in data
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
  
  //now we begin in earnest
  //begin by clearing the default side menu
  const menu = document.getElementById("side-menu");
  menu.innerHTML = ""; 


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
    statLabel.textContent = sortingDisplayNames[stat]; //using our map :)

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

    menu.appendChild(slotDiv);
  }
}




// ++++++++++++ section 4: other functions ++++++++++
//so these last two click event functions silently failed. I am going to fix them
//when I turned this file from a text/javascript to a module all of the onclick functions are no longer global so they began to silently fail.

// Example button functionality
window.quoteAlert = function () {
  alert("Kyogre used Origin Pulse lol!");
}







window.removeLastCard = function () { //eventually this will transform into a way to edit your team - deleting a member
  // titles.pop(); // Remove last item in titles array
  // showCards(); // Call showCards again to refresh
  const cardContainer = document.getElementById("card-container");
  const cards = cardContainer.querySelectorAll(".card");
  cardContainer.removeChild(cards[cards.length - 1]);
  loadedPokemon.pop();
}









// document.addEventListener("DOMContentLoaded", () => {
//   loadPokemonData();
//   buildSideMenu();
// });

document.addEventListener("DOMContentLoaded", () => {
  loadPokemonData();
  buildSideMenu();

  const hamburger = document.getElementById("hamburger");
  const sideMenu = document.getElementById("side-menu");

  if (window.innerWidth <= 900) {
    sideMenu.classList.add("closed");
  }

  hamburger.addEventListener("click", (event) => {
    // event.stopPropagation(); 
    sideMenu.classList.toggle("closed");
  });

  document.addEventListener("click", (event) => {
    if (window.innerWidth <= 900 && !sideMenu.classList.contains("closed")) {
      const clickedElement = event.target;

      const clickedInsideSideMenu = sideMenu.contains(clickedElement);
      const clickedHamburger = hamburger.contains(clickedElement);
      const clickedCard = clickedElement.closest(".card");

      if (!clickedInsideSideMenu && !clickedHamburger && !clickedCard) {
        sideMenu.classList.add("closed");
      }
    }
  });

 

});





// ++++++++++ section display details page +++++++++

function displayDetails(pokemon){
  calculateDefensiveMultipliers(pokemon);
  const typeEffectivenessHTML = Object.entries(defensiveRelationships)
  .map(([type, multiplier]) => `<li>${type.toUpperCase()}: x${multiplier}</li>`)
  .join("");

  //since pokemon is passed, we can easily grb correct info
  const container = document.getElementById("card-container");
  container.innerHTML = "";


  const detailDiv = document.createElement("div");
  detailDiv.classList.add("detail-card");


  console.log("Abilities from displayDetails:", pokemon.abilities);

  //new plan: keep loadedPokemon to be able to easily go back to it
  detailDiv.innerHTML = `

        <button id="back-to-list">Back to All</button>
        <h2>${pokemon.name}</h2>
    <img src="${pokemon.image}" alt="${pokemon.name} image">
    <ul>
      <li>Type: ${pokemon.type1}${pokemon.type2 ? ' / ' + pokemon.type2 : ''}</li>
      <li>HP: ${pokemon.hp}</li>
      <li>Attack: ${pokemon.attack}</li>
      <li>Defense: ${pokemon.defense}</li>
      <li>Sp Atk: ${pokemon.specialAttack}</li>
      <li>Sp Def: ${pokemon.specialDefense}</li>
      <li>Speed: ${pokemon.speed}</li>
      <li>Weight: ${pokemon.weight}</li>
      
      <li>Abilities: ${pokemon.abilities.map(each => 
            each.name + (each.isHidden ? " (Hidden)" : "")).join(", ")}
      </li>
        <h3>Moves</h3>
          <ul>
            ${pokemon.moves.map(move => `<li>${move}</li>`).join("")}
          </ul>

        <h3>Type Effectiveness</h3>
          <ul>
            ${typeEffectivenessHTML}
          </ul>


    </ul>
    


  `;


  container.appendChild(detailDiv);

  document.getElementById("back-to-list").onclick = () => {
    container.innerHTML="";
    publishCardsFromList();
  }
}



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