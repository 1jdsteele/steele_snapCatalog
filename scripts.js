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
    moves: raw.moves?.map(m => m.move.name).sort() || []



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
  notCardsStylesOff();
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

window.addEventListener("resize", () => {
  const sideMenu = document.getElementById("side-menu");
  if (window.innerWidth <= 900) {
    sideMenu.classList.add("closed");
  } else {
    sideMenu.classList.remove("closed");
  }
});


// ++++++++++++ section 4: other functions ++++++++++
//so these last two click event functions silently failed. I am going to fix them
//when I turned this file from a text/javascript to a module all of the onclick functions from html are no longer global so they began to silently fail.

// Example button functionality
window.quoteAlert = function () {
  alert("Kyogre used Origin Pulse lol!");
}


window.getExplanation = function (){
  const container = document.getElementById("card-container");
  container.innerHTML = `
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

  document.getElementById("back-to-list").onclick = () => {
    container.innerHTML="";
    publishCardsFromList();
  }
  notCardsStylesOn();

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

  //TODO change the .clicks so they are created in html and defined in functions here for hamburger
  const hamburger = document.getElementById("hamburger");
  const sideMenu = document.getElementById("side-menu");

  if (window.innerWidth <= 900) {
    sideMenu.classList.add("closed");
  }

  hamburger.addEventListener("click", (event) => {
    // event.stopPropagation(); 
    sideMenu.classList.toggle("closed");
  });

  // document.addEventListener("click", (event) => {
  //   if (window.innerWidth <= 900 && !sideMenu.classList.contains("closed")) {
  //     const clickedElement = event.target;

  //     const clickedInsideSideMenu = sideMenu.contains(clickedElement);
  //     const clickedHamburger = hamburger.contains(clickedElement);
  //     const clickedCard = clickedElement.closest(".card");
  //     // const clickedInfoButton = clickedElement.closest("#explanation");
  //     // const clickedBackButton = clickedElement.closest("#back-to-list");

  //     if (!clickedInsideSideMenu && 
  //       !clickedHamburger && 
  //       !clickedCard //&&
  //       // !clickedInfoButton &&
  //       // !clickedBackButton
  //     ) {
  //       sideMenu.classList.add("closed");
  //     }
  //   }
  // });

  document.addEventListener("click", (event) => {


    const sideMenu = document.getElementById("side-menu");
    const hamburger = document.getElementById("hamburger");
  
    if (window.innerWidth <= 900 && !sideMenu.classList.contains("closed")) {
      const clickedElement = event.target;
      const clickedInsideSideMenu = sideMenu.contains(clickedElement);
      const clickedHamburger = hamburger.contains(clickedElement);
  
      
      if (!clickedInsideSideMenu && !clickedHamburger) {
        sideMenu.classList.add("closed");
        event.stopImmediatePropagation(); //THIS
        event.preventDefault();
      }
    }

  }, true); //AND THIS
  
 

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
    </ul>
    


  `;

  
  container.appendChild(detailDiv);
  notCardsStylesOn();


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



// function toggleDetailStyles() {
//   const detailCard = document.querySelector(".detail-card");
//   if (detailCard){
//     document.body.classList.add("detail-mode");
//   } else {
//     document.body.classList.remove("detail-mode");
//   }
// }

function notCardsStylesOn() {
  const detailCard = document.querySelector("not-list");
    document.body.classList.add("not-list");
}

function notCardsStylesOff() {
  const detailCard = document.querySelector("not-list");
    document.body.classList.remove("not-list");
}