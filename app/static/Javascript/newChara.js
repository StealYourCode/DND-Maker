
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
    cardContainer.innerHTML = '';

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

      card.addEventListener('click', () => {
        modalInfo(item)
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

  // Set name
  document.getElementById('name').textContent = item.name || "No name found";
  // Determine whether the item is a race or a class by checking for specific keys
  const isRace = item.hasOwnProperty('speed') && item.hasOwnProperty('abilities');
  const isClass = item.hasOwnProperty('hitDie') && item.hasOwnProperty('primaryAbility');

  // Set primary information based on whether it's a race or a class
  if (isRace) {
    document.getElementById('info1').textContent = `Speed: ${item.speed}`;
    document.getElementById('info2').textContent = `Abilities: ${formatAbilities(item.abilities)}`;
  } else if (isClass) {
    document.getElementById('info1').textContent = `Hit Die: d${item.hitDie}`;
    document.getElementById('info2').textContent = `Primary Ability: ${item.primaryAbility}`;
  } else {
    document.getElementById('info1').textContent = "No specific info available";
    document.getElementById('info2').textContent = "";
  }

  // Set perks (if any)
  const perks = item.perks;
  const perksContainer = document.getElementById('perks');
  perksContainer.innerHTML = ""; // Clear previous content
  if (perks) {
    for (const perk in perks) {
      const perkElement = document.createElement('div');
      perkElement.textContent = `${perk}: ${perks[perk]}`;
      perksContainer.appendChild(perkElement);
    }
  } else {
    perksContainer.textContent = "No perks available";
  }

  // Set description
  document.getElementById('description').textContent = item.description || "No description available";

  // Display modal
  document.getElementById('modalOverlay').style.display = 'block';
  document.getElementById('detailModal').style.display = 'block';
}

// Helper function to format abilities (used for races)
function formatAbilities(abilities) {
  return Object.keys(abilities)
    .map(ability => `${ability}: ${abilities[ability]}`)
    .join(', ');
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

