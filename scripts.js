import { Pokemon } from './Pokemon.js';
// vars needed by multiple functions
let loadedPokemon = []; //keeping a list of all the pokemon we are supposed to show
let currentSortStat = "id"; //in beginning show by id, ascending :)
let currentSortOrder = "asc"; 


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
  sortAndDisplayPokemon()
}

//parse
function buildPokemonFromRaw(raw) {

  const sprite =
  raw.sprites?.other?.["official-artwork"]?.front_default ||
  raw.sprites?.front_default ||
  ""; //bc cornerstone mask did not have front sprite... whatever, official artwork better anyways

// console.log("Building:", raw.name, "| Sprite:", sprite); //testing bc cornerstone mask doesn't have front sprite - just official artwork

  return new Pokemon({
    name: raw.name,
    id: raw.id,
    type1: raw.types[0]?.type?.name || null, //? is opt chaining for not crashing if undefined... probably actually only needed for type2 tho, so after some testing I may change this
    type2: raw.types[1]?.type?.name || null,
    hp: raw.stats.find(s => s.stat.name === "hp").base_stat, //find requires a function as it's parameter and return
    // go through each s in raw.stats array and return the matching one
    //anonymous arrow function called by .find yo :) every iteration
    attack: raw.stats.find(s => s.stat.name === "attack").base_stat,
    defense: raw.stats.find(s => s.stat.name === "defense").base_stat,
    specialAttack: raw.stats.find(s => s.stat.name === "special-attack").base_stat,
    specialDefense: raw.stats.find(s => s.stat.name === "special-defense").base_stat,
    speed: raw.stats.find(s => s.stat.name === "speed").base_stat,
    weight: raw.weight,
    // spritesFront: raw.sprites.front_default
    // spritesFront: raw.sprites.front_default || raw.sprites.other["official-artwork"]?.front_default || ""
    spritesFront: sprite

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
  //TODO list out everything, this was practice for showing the data
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
  // an array of what we want to sort by
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









// Run when page is loaded
document.addEventListener("DOMContentLoaded", () => {
  loadPokemonData();
  buildSideMenu();
});