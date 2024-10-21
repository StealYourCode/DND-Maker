
// ---- New CHARACTER DATA ----
const userSelection = {
  name: null,
  level: 1,
  race: null,
  class: null,
  background: null,
  alignment: null,
  abilityScores: {
    strength: null,
    dexterity: null,
    constitution: null,
    intelligence: null,
    wisdom: null,
    charisma: null,
  },
  skills: [],
  proficiencies: {
    weapons: [],
    armor: [],
    tools: [],
  },
  equipment: [],
  traits: [],
  gold: 0,
  armorClass: null,
  hitPoints: null,
  initiative: null,
  spells: {
    spellcastingAbility: null,
    spellSlots: [],
    knownSpells: [],
  },
  personality: {
    traits: [],
    ideals: [],
    bonds: [],
    flaws: [],
    backstory: '',
  },
  appearance: {
    height: null,
    weight: null,
    eyeColor: null,
    hairColor: null,
    physicalTraits: '',
  },
  languages: [],
  affiliation: null,
  notes: '',
};

// ---- GLOBAL VARIABLE THAT GET CURRENT DATA JSON (Fighter, Dwarf, etc)
let currentItem = null;

// ---- LOAD JSON DATA FUNCTION ----
async function loadData(endpoint, containerId, itemType) {
  try {
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();
    const items = data[itemType];

    const cardContainer = document.getElementById(containerId);
    if (!cardContainer) {
      console.error(`Container with id '${containerId}' not found!`);
      return;
    }

    cardContainer.innerHTML = ''; // Clear previous cards

    items.forEach(item => {
      const card = document.createElement('div');
      card.className = `card`;

      const img = document.createElement('img');
      img.src = item.image;
      img.alt = item.name || `${itemType.charAt(0).toUpperCase() + itemType.slice(1)} Image`;
      img.className = `image`;

      const name = document.createElement('h3');
      name.textContent = item.name || `Unnamed ${itemType}`;
      name.className = `name`;

      card.appendChild(img);
      card.appendChild(name);
      cardContainer.appendChild(card);

      // Safely attach modalInfo to the click event
      card.addEventListener('click', () => {
        modalInfo(item);
      });
    });
  } catch (error) {
    console.error(`There was a problem with the ${itemType} fetch operation:`, error);
  }
}

// ---- SHOW LOADED DATA IN A MODAL ----

function modalInfo(item) {
  // Load current item in a global variable
  currentItem = item;

  // Safely access elements with defensive checks
  const nameElement = document.getElementById('name');
  const info1Element = document.getElementById('info1');
  const info2Element = document.getElementById('info2');
  const descriptionElement = document.getElementById('description');
  const perksContainer = document.getElementById('perks');
  
  if (nameElement) {
    nameElement.textContent = item.name || "No name found";
  } else {
    console.error("Element with id 'name' not found!");
  }
  
  // Determine if it's a race or class
  const isRace = item.hasOwnProperty('speed') && item.hasOwnProperty('abilities');
  const isClass = item.hasOwnProperty('hitDie') && item.hasOwnProperty('primaryAbility');

  // Set primary information based on whether it's a race or a class
  if (isRace && info1Element && info2Element) {
    info1Element.textContent = `Speed: ${item.speed}`;
    info2Element.textContent = `Abilities: ${formatAbilities(item.abilities)}`;
  } else if (isClass && info1Element && info2Element) {
    info1Element.textContent = `Hit Die: d${item.hitDie}`;
    info2Element.textContent = `Primary Ability: ${item.primaryAbility}`;
  } else if (info1Element) {
    info1Element.textContent = "No specific info available";
    if (info2Element) {
      info2Element.textContent = "";
    }
  }

  // Set perks (if any)
  if (perksContainer) {
    perksContainer.innerHTML = ""; // Clear previous content
    const perks = item.perks;
    if (perks) {
      for (const perk in perks) {
        const perkElement = document.createElement('div');
        perkElement.textContent = `${perk}: ${perks[perk]}`;
        perksContainer.appendChild(perkElement);
      }
    } else {
      perksContainer.textContent = "No perks available";
    }
  }

  // Set description
  if (descriptionElement) {
    descriptionElement.textContent = item.description || "No description available";
  }

  // Display modal
  const modalOverlay = document.getElementById('modalOverlay');
  const detailModal = document.getElementById('detailModal');
  if (modalOverlay && detailModal) {
    modalOverlay.style.display = 'block';
    detailModal.style.display = 'block';
  } else {
    console.error("Modal elements not found!");
  }
}

// Helper function to format abilities (used for races)
function formatAbilities(abilities) {
  return Object.keys(abilities)
    .map(ability => `${ability}: ${abilities[ability]}`)
    .join(', ');
}

// ---- Score Button ----

// Function to show the ability score options
function showAbilityOptions() {
  // Show the ability score container
  clearContainers();
  document.getElementById('abilityScoreContainer').style.display = 'block';
}

// Show the Point Buy UI
function showPointBuy() {
  document.getElementById('pointBuySection').style.display = 'block';
  document.getElementById('roll4d6Section').style.display = 'none';
}

// Show the Roll 4d6 UI
function showRoll4d6() {
  document.getElementById('roll4d6Section').style.display = 'block';
  document.getElementById('pointBuySection').style.display = 'none';
}

// Roll 4d6 for each ability and show the results
function rollAbilityScores() {
  const stats = [];
  for (let i = 0; i < 6; i++) {
    let rolls = [];
    for (let j = 0; j < 4; j++) {
      rolls.push(Math.floor(Math.random() * 6) + 1);
    }
    rolls.sort((a, b) => b - a); // Sort in descending order
    const score = rolls[0] + rolls[1] + rolls[2]; // Sum top 3
    stats.push(score);
  }
  document.getElementById('rolledScores').innerText = "Rolled Scores: " + stats.join(", ");
}

// ---- OTHER BUTTON ----
function showAbilityOptions() {
    clearContainers();
    document.getElementById('abilityScoreContainer').style.display = 'block';
}

// ---- OTHER BUTTONS ----
function showCharacterInfo() {
  document.getElementById('characterInfoContainer').style.display = 'block';
}


// ---- CLEAR WINDOW OF OTHER ELEMENTS ----
function clearContainers() {
    document.getElementById('cardContainer').innerHTML = '';
    document.getElementById('abilityScoreContainer').style.display = 'none';
    document.getElementById('characterInfoContainer').style.display = 'none';
}

function clearAndShow(containerId) {
    clearContainers();
    document.getElementById(containerId).style.display = 'block';
}



// Save Character Info to Character Object
function saveCharacterInfo() {
  // Get values from inputs
  const alignment = document.getElementById('alignment').value;
  const height = document.getElementById('height').value;
  const weight = document.getElementById('weight').value;
  const eyeColor = document.getElementById('eyeColor').value;
  const hairColor = document.getElementById('hairColor').value;
  const physicalTraits = document.getElementById('physicalTraits').value;
  
  const weaponProficiencies = document.getElementById('weaponProficiencies').value.split(',').map(item => item.trim());
  const armorProficiencies = document.getElementById('armorProficiencies').value.split(',').map(item => item.trim());
  const toolProficiencies = document.getElementById('toolProficiencies').value.split(',').map(item => item.trim());

  // Update character object
  character.alignment = alignment;
  character.appearance = {
    height: height,
    weight: weight,
    eyeColor: eyeColor,
    hairColor: hairColor,
    physicalTraits: physicalTraits,
  };
  character.proficiencies.weapons = weaponProficiencies;
  character.proficiencies.armor = armorProficiencies;
  character.proficiencies.tools = toolProficiencies;

  // Confirm save
  alert("Character info saved!");
}


// ---- CLOSE MODAL BUTTON ----

function closeModal() {
  // Hide the modal and overlay
  document.getElementById('modalOverlay').style.display = 'none';
  document.getElementById('detailModal').style.display = 'none';
}


// ---- VALIDATE USER CHOICE MODAL ----
function validateChoice() {
  if (currentItem.type === 'race') {
    userSelection.race = currentItem;
  } else if (currentItem.type === 'class') {
    userSelection.class = currentItem;
  }

  if (currentItem.abilities){
    console.log("Current Item:", currentItem.name);
    userSelection.race = currentItem.name;
  } else if (currentItem.hitDie){
    userSelection.class = currentItem.name;
  }
  else console.log("Invalid Choice in validation");
  console.log(userSelection); 
  closeModal();
}

// ---- Turn user choice into a json ----
function finalizeSelection() {
    const selectionJSON = JSON.stringify(userSelection);
    console.log("Final Selection JSON:", selectionJSON);
  }

// ---- BACK TO THE HOME PAGE BUTTON ----

function backHome() {
  if (window.confirm("Are you sure you want to go back, your data won't be save ?")){
    location.href = "/";
  }
}

