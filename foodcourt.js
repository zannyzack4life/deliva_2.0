  // === DOM Elements ===
  const foodDisplay = document.querySelector('.food-display');
  const foodNameEl = document.querySelector('.food-name');
  const plateContainer = document.querySelector('.plate-container');
  const addPlateBtn = document.querySelector('.add-plate');
  const closeBtn = document.getElementById('close-btnforpop');

  const popupfornofood = document.getElementById('popupfornofood'); // Max food popup
  const closePopupfornofoodBtn = document.getElementById('close-popupfornofood');

  const popupfornoplate = document.getElementById('popupfornoplate'); // Max plates popup
  const closePopupfornoplateBtn = document.getElementById('close-popupfornoplate');

  const totalPriceEl = document.getElementById('total-price');

  // === Food data ===
  const foodNames = ['Fried rice: N1500', 'Jollof:  N1200', 'White rice:  N1000', 'Vegetable soup: N1000', 'Egusi soup:  N500', 'Eba:  N500', 'Fufu:  N300'];
  const foodImages = [
    'img/friedrice.jpg',
    'img/jollof.jpg',
    'img/white rice.jpg',
    'img/vegetable.jpg',
    'img/egusi.jpg',
    'img/eba.jpg',
    'img/fufu.jpg'
  ];

  // Food price mapping
  const foodPrices = {
    'Fried rice: N1500': 1500,
    'Jollof:  N1200': 1200,
    'White rice:  N1000': 1000,
    'Vegetable soup: N1000': 1000,
    'Egusi soup:  N500': 500,
    'Eba:  N500': 500,
    'Fufu:  N300': 300
  };

  // === App State ===
  let plates = []; // Array of plates
  let activePlateIndex = 0; // Currently active plate
  const maxFoodPortions = 5; // Max food per plate
  const maxPlates = 4; // Max number of plates

  // === Popup Handlers ===
  function showPopupfornofood() {
    popupfornofood.classList.add('open'); // Show max food popup
  }

  function showPopupfornoplate() {
    popupfornoplate.classList.add('open'); // Show max plate popup
  }

  closePopupfornofoodBtn.addEventListener('click', () => {
    popupfornofood.classList.remove('open');
  });

  closePopupfornoplateBtn.addEventListener('click', () => {
    popupfornoplate.classList.remove('open');
  });

  // === Updates plate descriptions (list of items) ===
  function updateDescriptions() {
    plates.forEach((plate, index) => {
      const desc = plate.parentElement.querySelector('.plate-description');
      const counts = {};

      // Count each type of food
      plate.querySelectorAll('img[data-food]').forEach(img => {
        const food = img.dataset.food;
        counts[food] = (counts[food] || 0) + 1;
      });

      desc.innerHTML = '';

      if (Object.keys(counts).length === 0) {
        desc.textContent = 'No food added';
        return;
      }

      // Create bullet list of food portions
      const list = document.createElement('ul');
      Object.entries(counts).forEach(([food, count]) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${count} portion${count > 1 ? 's' : ''} of ${food.split(':')[0]}`;
        list.appendChild(listItem);
      });

      desc.appendChild(list);
    });
  }

  // === Updates total price display ===
  function updateTotalPrice() {
    let total = 0;

    // Add up prices of all items on all plates
    plates.forEach(plate => {
      plate.querySelectorAll('img[data-food]').forEach(img => {
        const food = img.dataset.food;
        const price = foodPrices[food] || 0;
        total += price;
      });
    });

    totalPriceEl.textContent = ` ₦${total.toLocaleString()}`;
  }

  // === Create a new plate ===
  function createPlate() {
    if (plates.length >= maxPlates) {
      showPopupfornoplate(); // If limit reached, show popup
      return;
    }

    // Create plate container and description
    const plateWrapper = document.createElement('div');
    plateWrapper.className = 'plate-wrapper';

    const plate = document.createElement('div');
    plate.className = 'plate';

    const desc = document.createElement('div');
    desc.className = 'plate-description';

    plateWrapper.appendChild(plate);
    plateWrapper.appendChild(desc);
    plateContainer.appendChild(plateWrapper);

    plates.push(plate);

    // Click handler for plate activation/removal
    plate.addEventListener('click', () => {
      const isActive = plate.classList.contains('active');

      // Remove empty plate on click
      if (isActive && plate.querySelectorAll('img[data-food]').length === 0) {
        plateWrapper.remove();
        const index = plates.indexOf(plate);
        if (index > -1) plates.splice(index, 1);
        activePlateIndex = plates.length > 0 ? Math.max(0, index - 1) : -1;
        plates.forEach(p => p.classList.remove('active'));
        if (plates[activePlateIndex]) plates[activePlateIndex].classList.add('active');
        updateDescriptions();
        updateTotalPrice();
        return;
      }

      // Activate selected plate
      plates.forEach(p => p.classList.remove('active'));
      plate.classList.add('active');
      activePlateIndex = plates.indexOf(plate);
    });

    // Make new plate active by default
    if (plates.length === 1) plate.classList.add('active');
    activePlateIndex = plates.length - 1;

    updateDescriptions();
    updateTotalPrice();
  }

  // === Food item click events ===
  document.querySelectorAll('.glide__slide').forEach((slide, i) => {
    const food = foodNames[i % foodNames.length];
    const imgSrc = foodImages[i % foodImages.length];
    slide.dataset.food = food;

    const foodNameTag = slide.querySelector('.foodname');
    if (foodNameTag) foodNameTag.textContent = food;

    // On clicking food item:
    slide.addEventListener('click', () => {
      foodDisplay.classList.add('open'); // Show food selection UI

      const plate = plates[activePlateIndex];
      if (activePlateIndex === -1 || !plate) return;

      const currentPlateFoods = plate.querySelectorAll('img[data-food]').length;
      if (currentPlateFoods >= maxFoodPortions) {
        showPopupfornofood(); // If max food reached, show popup
        return;
      }

      // Check if same food exists already
      const existingImg = Array.from(plate.querySelectorAll('img')).find(img => img.dataset.food === food);

      if (existingImg) {
        // Clone and add another portion
        const clone = existingImg.cloneNode();
        plate.appendChild(clone);
        clone.addEventListener('click', () => {
          clone.remove();
          updateDescriptions();
          updateTotalPrice();
        });
      } else {
        // First portion of this food
        const portion = document.createElement('img');
        portion.src = imgSrc;
        portion.alt = food;
        portion.dataset.food = food;
        plate.appendChild(portion);
        portion.addEventListener('click', () => {
          portion.remove();
          updateDescriptions();
          updateTotalPrice();
        });
      }

      // Position food items in a circle layout
      const plateImages = plate.querySelectorAll('img[data-food]');
      const totalImages = plateImages.length;
      plateImages.forEach((img, index) => {
        const angle = (index / totalImages) * 360;
        const radius = 18;
        const offsetX = Math.cos((angle * Math.PI) / 180) * radius;
        const offsetY = Math.sin((angle * Math.PI) / 180) * radius;

        img.style.position = 'absolute';
        img.style.left = `${50 + offsetX}%`;
        img.style.top = `${50 + offsetY}%`;
        img.style.transform = 'translate(-50%, -50%)';
        img.style.width = '30%';
        img.style.height = '30%';
      });

      updateDescriptions();
      updateTotalPrice();
    });

    // Close food display
    closeBtn.addEventListener('click', () => {
      foodDisplay.classList.remove('open');
    });
  });

  // === Event listener for Add Plate button ===
  addPlateBtn.addEventListener('click', createPlate);

  // === Init with one plate ===
  createPlate();

  window.addEventListener('load', () => {
    new Glide('.glide', {
      type: 'carousel',
      perView: 3,
      focusAt: 'center',
      gap: 5,
      autoplay: 4000,
      hoverpause: true,
      animationDuration: 600
    }).mount();
  });
  


































const btn = document.querySelector('.drinksfridge');
const vend = document.querySelector('.vend');
let isDragging = false;
let offsetX, offsetY;

// Start dragging for mouse
btn.addEventListener('mousedown', (e) => {
  isDragging = true;
  offsetX = e.clientX - btn.offsetLeft;
  offsetY = e.clientY - btn.offsetTop;
  btn.style.cursor = 'grabbing';
});

// Start dragging for touch
btn.addEventListener('touchstart', (e) => {
  isDragging = true;
  const touch = e.touches[0];
  offsetX = touch.clientX - btn.offsetLeft;
  offsetY = touch.clientY - btn.offsetTop;
  btn.style.cursor = 'grabbing';
});

// Move the button with mouse
document.addEventListener('mousemove', (e) => {
  if (isDragging) {
    const x = e.clientX - offsetX;
    const y = e.clientY - offsetY;
    const rect = vend.getBoundingClientRect();
    const maxX = rect.width - btn.offsetWidth;
    const maxY = rect.height - btn.offsetHeight;

    btn.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
    btn.style.top = Math.max(0, Math.min(y, maxY)) + 'px';
  }
});

// Move the button with touch
document.addEventListener('touchmove', (e) => {
  if (isDragging) {
    const touch = e.touches[0];
    const x = touch.clientX - offsetX;
    const y = touch.clientY - offsetY;
    const rect = vend.getBoundingClientRect();
    const maxX = rect.width - btn.offsetWidth;
    const maxY = rect.height - btn.offsetHeight;

    btn.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
    btn.style.top = Math.max(0, Math.min(y, maxY)) + 'px';
  }
});

// Stop dragging for mouse
document.addEventListener('mouseup', () => {
  isDragging = false;
  btn.style.cursor = 'grab';
});

// Stop dragging for touch
document.addEventListener('touchend', () => {
  isDragging = false;
  btn.style.cursor = 'grab';
});














const fridges = document.querySelectorAll('.fridge');
const sound = document.querySelector('.fridge-sound');

fridges.forEach(fridge => {
  const openBtn = fridge.querySelector('.door-button');
  const inside = fridge.querySelector('.inside');
  const closeBtn = inside.querySelector('.close-button');
  const drinkBoxes = fridge.querySelectorAll('.drink');
  
  // Create the selection display container
  let selectionDisplay = fridge.querySelector('.selection-display');
  if (!selectionDisplay) {
    selectionDisplay = document.createElement('div');
    selectionDisplay.classList.add('selection-display');
    inside.appendChild(selectionDisplay);
  }

  // Initially hide the selection display
  selectionDisplay.style.display = 'none';

  // Create upgrade popup
  let upgradePopup = fridge.querySelector('.upgrade-popup');
  if (!upgradePopup) {
    upgradePopup = document.createElement('div');
    upgradePopup.classList.add('upgrade-popup');
    upgradePopup.innerHTML = `
      <div class="upgrade-popup-content">
        <p>You can only select up to 4 drinks.<br>Upgrade to add more!</p>
        <div class="drkupg"><button class="upgrade-close">Close</button><button class="upgrade-close">Upgrade</button></div>
      </div>
    `;
    inside.appendChild(upgradePopup);

    // Close popup
    upgradePopup.querySelector('.upgrade-close').addEventListener('click', () => {
      upgradePopup.classList.remove('active');
    });
  }

  // Open fridge
  openBtn.addEventListener('click', () => {
    fridge.classList.add('open');
    sound.currentTime = 0;
    sound.play().catch(() => {});
  });

  // Close fridge
  closeBtn.addEventListener('click', () => {
    fridge.classList.remove('open');
  });

  // Drink selection logic
  drinkBoxes.forEach(drinkBox => {
    drinkBox.addEventListener('click', () => {
      const currentCount = selectionDisplay.querySelectorAll('.selected-drink').length;

      if (currentCount >= 4) {
        upgradePopup.classList.add('active');
        return;
      }

      const drinkName = drinkBox.parentElement.querySelector('span').innerText;
      const drinkImg = drinkBox.querySelector('img');

      const selected = document.createElement('div');
      selected.classList.add('selected-drink');

      selected.innerHTML = `
        <img src="${drinkImg.src}" alt="${drinkName}">
        <span>${drinkName}</span>
      `;

      selected.addEventListener('click', () => {
        selected.remove();
        // If there are no drinks left, hide the selection display
        if (selectionDisplay.querySelectorAll('.selected-drink').length === 0) {
          selectionDisplay.style.display = 'none';
        }
      });

      selectionDisplay.appendChild(selected);

      // Show the selection display when a drink is added
      selectionDisplay.style.display = 'flex';

      // Check if 'Add to Plate' button already exists, if not create it
      if (!selectionDisplay.querySelector('.add-to-plate')) {
        const addToPlateBtn = document.createElement('button');
        addToPlateBtn.classList.add('add-to-plate', 'close-button');
        addToPlateBtn.innerText = 'Add to Plate';
        addToPlateBtn.addEventListener('click', () => {
          alert('Drinks have been added to your plate!');
        });

        // Add the button at the bottom of the selection display
        selectionDisplay.appendChild(addToPlateBtn);
      }
    });
  });
});






