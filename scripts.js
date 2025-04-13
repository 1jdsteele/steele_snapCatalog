


import { Pokemon } from './Pokemon.js';
let loadedPokemon = []; //keeping a list of all the pokemon we are supposed to show

//this function akin to showCards
//load
async function loadPokemonData() { //must be marked async bc next 2 lines - allows me to await
  const response = await fetch('./metaRestricteds.json'); //async function, return a promise. If don't use await, get promise object instead of response
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
  publishCardsFromList();
}

//parse
function buildPokemonFromRaw(raw) {
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
    spritesFront: raw.sprites.front_default
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
      <li>Speed: ${pokemon.speed}</li>
    `;
  
    cardContainer.appendChild(newCard);

  }
}


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
document.addEventListener("DOMContentLoaded", loadPokemonData);