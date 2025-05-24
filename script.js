
document.addEventListener('DOMContentLoaded', () => {
    const contents = document.querySelectorAll('.contentact');
    const loader = document.getElementById('loader');
    const backButtons = document.querySelectorAll('.backbutnforconts');
    const tabs = document.querySelectorAll('.tab');
    let historyStack = JSON.parse(localStorage.getItem('historyStack')) || [];

    // Restore last active content
    const lastcontentactId = localStorage.getItem('contentact');

    if (lastcontentactId) {
        const lastcontentact = document.getElementById(lastcontentactId);
        if (lastcontentact) {
            contents.forEach(content => content.classList.remove('active'));
            lastcontentact.classList.add('active');

            // Restore tab state
            tabs.forEach(tab => {
                tab.classList.toggle('active', tab.getAttribute('data-target') === lastcontentactId);
            });
        }
    } else {
        contents[0]?.classList.add('active');
        tabs[0]?.classList.add('active');
    }

    // Tab click handler
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = tab.getAttribute('data-target');
            const currentActive = document.querySelector('.contentact.active');

            if (currentActive) {
                historyStack.push(currentActive.id);
            }

            localStorage.setItem('contentact', targetId);
            localStorage.setItem('historyStack', JSON.stringify(historyStack));

            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            loader.style.display = 'block';

            contents.forEach(content => {
                if (content.classList.contains('active')) {
                    content.classList.remove('active');
                    content.classList.add('exit');
                    setTimeout(() => content.classList.remove('exit'), 700);
                }
            });

            setTimeout(() => {
                loader.style.display = 'none';
                const targetContent = document.getElementById(targetId);
                if (targetContent) {
                    contents.forEach(content => content.classList.remove('active'));
                    targetContent.classList.add('active');
                }
            }, 1000);
        });
    });

    // Back button functionality with loader
    backButtons.forEach(backButton => {
        backButton.addEventListener('click', () => {
            if (historyStack.length > 0) {
                const previousContentId = historyStack.pop();
                localStorage.setItem('historyStack', JSON.stringify(historyStack));

                const previousContent = document.getElementById(previousContentId);
                if (previousContent) {
                    loader.style.display = 'block';

                    contents.forEach(content => {
                        if (content.classList.contains('active')) {
                            content.classList.remove('active');
                            content.classList.add('exit');
                            setTimeout(() => content.classList.remove('exit'), 700);
                        }
                    });

                    setTimeout(() => {
                        loader.style.display = 'none';
                        contents.forEach(content => content.classList.remove('active'));
                        previousContent.classList.add('active');
                        localStorage.setItem('contentact', previousContent.id);

                        tabs.forEach(tab => {
                            tab.classList.toggle('active', tab.getAttribute('data-target') === previousContent.id);
                        });
                    }, 1000);
                }
            }
        });
    });
});




    // Fake loader delay — reveal real content
    window.addEventListener('DOMContentLoaded', () => {
    const loaders = document.querySelectorAll('.loadeffect');

    loaders.forEach((el, index) => {
    setTimeout(() => {
        el.classList.add('loaded');
        el.classList.remove('loadeffect');
    }, 2000 + index * 300); // optional stagger effect
    });
});





// Preload fonts, icons, images
const preloadAssets = () => {
    const links = [
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
    'your-important-image.jpg', // add more if needed
    ];

    links.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = src.endsWith('.css') ? 'style' : 'image';
    link.href = src;
    document.head.appendChild(link);
    });
};

// Add lazy loading to all images that don't have it
const makeImagesLazy = () => {
    document.querySelectorAll('img:not([loading])').forEach(img => {
    img.setAttribute('loading', 'lazy');
    });
};

// Hide loader when page is fully ready
window.addEventListener('load', () => {
    document.getElementById('preloader').style.display = 'none';
    makeImagesLazy();
});

preloadAssets();





// Function to handle link clicks
const handleLinkClick = (event) => {
    const targetUrl = event.target.href; // Get the target URL from the href attribute
    console.log("Link clicked. Target URL:", targetUrl); // Debugging log

    if (!navigator.onLine) {
    // If offline, store the current page URL and redirect to "no-internet.html"
    localStorage.setItem('previousPage', document.referrer);
    console.log("Previous page stored:", document.referrer); // Debugging log
    window.location.href = 'no-internet.html'; // Redirect to "no-internet.html"
    event.preventDefault(); // Prevent the default navigation
    }
};

// Function to handle network changes (online/offline)
const handleNetworkChange = () => {
    if (navigator.onLine) {
    // Network is back online, check if there is a stored previous page URL
    const savedPreviousPage = localStorage.getItem('previousPage');
    console.log("Network is back online. Saved previous page:", savedPreviousPage); // Debugging log
    
    if (savedPreviousPage) {
        // Redirect to the previously stored page
        window.location.href = savedPreviousPage;
        localStorage.removeItem('previousPage'); // Clean up stored URL
    } else {
        // If there's no previous page stored, go back in history
        window.history.back();
    }
    }
};

// Add event listeners to all anchor links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', handleLinkClick);
});

// Listen for network changes
window.addEventListener('online', handleNetworkChange);
window.addEventListener('offline', handleNetworkChange);




// Select all the links, sidebars, and overlays
const leftLinks = document.querySelectorAll('.left-link');
const rightLinks = document.querySelectorAll('.right-link');
const leftSidebar = document.querySelector('.left-sidebar');
const rightSidebar = document.querySelector('.right-sidebar');
const overlays = document.querySelectorAll('.overlay');
const closeButtons = document.querySelectorAll('.close-btn');

// Function to open a sidebar
function openSidebar(sidebar, overlay) {
sidebar.classList.add('active');
overlay.classList.add('active');
}

// Function to close a sidebar
function closeSidebar(sidebar, overlay) {
sidebar.classList.remove('active');
overlay.classList.remove('active');
}

// Open left sidebar for any left link
leftLinks.forEach(link => {
link.addEventListener('click', (e) => {
    e.preventDefault();
    openSidebar(leftSidebar, overlays[0]);  // Always open the same left sidebar
});
});

// Open right sidebar for any right link
rightLinks.forEach(link => {
link.addEventListener('click', (e) => {
    e.preventDefault();
    openSidebar(rightSidebar, overlays[1]);  // Always open the same right sidebar
});
});

// Close all sidebars (left and right) when clicking the close button
closeButtons.forEach(button => {
button.addEventListener('click', () => {
    closeSidebar(leftSidebar, overlays[0]);
    closeSidebar(rightSidebar, overlays[1]);
});
});

// Clicking on the overlay closes the corresponding sidebar
overlays.forEach((overlay, index) => {
overlay.addEventListener('click', () => {
    if (index === 0) {
        closeSidebar(leftSidebar, overlay);
    } else {
        closeSidebar(rightSidebar, overlay);
    }
});
});








// Script for content-box links
document.querySelectorAll('.link-content-box').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
  
      // Remove active from all content-box links
      document.querySelectorAll('.link-content-box').forEach(l => l.classList.remove('active'));
      // Remove active from all content-boxes
      document.querySelectorAll('.content-box').forEach(box => box.classList.remove('active'));
  
      // Activate clicked link
      link.classList.add('active');
      // Activate target content-box
      const targetClass = link.getAttribute('data-target');
      const targetBox = document.querySelector(`.content-box.${targetClass}`);
      if (targetBox) targetBox.classList.add('active');
    });
  });
  
  // Script for order-box links
  document.querySelectorAll('.link-order-box').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
  
      // Remove active from all order-box links
      document.querySelectorAll('.link-order-box').forEach(l => l.classList.remove('active'));
      // Remove active from all order-boxes
      document.querySelectorAll('.order-box').forEach(box => box.classList.remove('active'));
  
      // Activate clicked link
      link.classList.add('active');
      // Activate target order-box
      const targetClass = link.getAttribute('data-target');
      const targetBox = document.querySelector(`.order-box.${targetClass}`);
      if (targetBox) targetBox.classList.add('active');
    });
  });
  




document.addEventListener('DOMContentLoaded', () => {
    const triggers = document.querySelectorAll('.trigger');
    const popupitemsfods = document.querySelectorAll('.popupitemsfod');
    const overlayss = document.querySelector('.overlayss');

    // Open the targeted popup
    triggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = trigger.getAttribute('data-target');
            const targetPopup = document.getElementById(targetId);

            if (targetPopup) {
                targetPopup.classList.add('active');
                overlayss.classList.add('active');
            }
        });
    });

    // Close all popups on overlay click
    overlayss.addEventListener('click', () => {
        popupitemsfods.forEach(popup => popup.classList.remove('active'));
        overlayss.classList.remove('active');
    });

    // Close buttons inside each popup
    const closeButtons = document.querySelectorAll('.close, .close1, .close2');
    closeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const popup = button.closest('.popupitemsfod');
            if (popup) popup.classList.remove('active');
            overlayss.classList.remove('active');
        });
    });
});








const maxItems = 10;

// Get all progress bars and related buttons
document.querySelectorAll('.progress-bar').forEach((progressBar, index) => {
    let currentItems = 0; // Individual cart count

    const progress = progressBar.querySelector('.progress');
    const cartInfo = document.querySelectorAll('#cart-info')[index];
    const addItemButton = document.querySelectorAll('#add-item')[index];
    const removeItemButton = document.querySelectorAll('#remove-item')[index];

    function updateCart() {
        const progressPercentage = (currentItems / maxItems) * 100;
        progress.style.width = `${progressPercentage}%`;
        cartInfo.textContent = `${currentItems}/${maxItems} Items`;
    }

    addItemButton.addEventListener('click', () => {
        if (currentItems < maxItems) {
            currentItems++;
            updateCart();
        }
    });

    removeItemButton.addEventListener('click', () => {
        if (currentItems > 0) {
            currentItems--;
            updateCart();
        }
    });

    // Initialize each cart
    updateCart();
});


document.addEventListener("DOMContentLoaded", () => {
    const items = document.querySelectorAll(".fooditemss");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add("visible");
                }, index * 200); // Delay each item
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
    });

    items.forEach((item) => {
        observer.observe(item);
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const boxes = document.querySelectorAll(".toppsfoodsadd");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add("visible");
                }, index * 100); // Delay each box
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
    });

    boxes.forEach((box) => {
        observer.observe(box);
    });
});

const boxes = document.querySelectorAll('.boxswipedel');

boxes.forEach(box => {
let startX;

box.addEventListener('touchstart', (e) => {
startX = e.touches[0].clientX;
});

box.addEventListener('touchmove', (e) => {
const touchX = e.touches[0].clientX;
const deltaX = touchX - startX;

if (deltaX < -50) { // Swipe left
    box.classList.add('swipe-out');
    setTimeout(() => box.remove(), 300); // Remove after animation
}
});

box.addEventListener('mousedown', (e) => {
startX = e.clientX;
});

box.addEventListener('mousemove', (e) => {
if (e.buttons !== 1) return; // Only track when mouse button is pressed
const deltaX = e.clientX - startX;

if (deltaX < -50) { // Swipe left
    box.classList.add('swipe-out');
    setTimeout(() => box.remove(), 300); // Remove after animation
}
});
});

const slideUpButton = document.getElementById('slideUpButton');
const slideUpDiv = document.getElementById('slideUpDiv');
const closeButton = document.querySelector('.close-btncclsfood');


slideUpButton.addEventListener('click', () => {
slideUpDiv.classList.toggle('active');
});



// Slide up when the button is clicked
slideUpButton.addEventListener('click', () => {
slideUpDiv.classList.add('active');
});

// Close the slide-up div when the close button is clicked
closeButton.addEventListener('click', () => {
slideUpDiv.classList.remove('active');
});



document.addEventListener('DOMContentLoaded', () => {
    // Select all buttons to open the slide-up div and all close buttons
    const slideUpButtons = document.querySelectorAll('.slideUpButton');
    const closeButtons = document.querySelectorAll('.close-btncclsfoodgift');

    // Get the single slide-up div (assuming it's the first div with the class)
    const slideUpDiv = document.querySelector('.slideUpDiv');

    // Add event listeners for each slide-up button to toggle the slide-up div
    slideUpButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Open the slide-up div
            slideUpDiv.classList.add('active');
        });
    });

    // Add event listeners for each close button to hide the slide-up div
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Close the slide-up div
            slideUpDiv.classList.remove('active');
        });
    });
});


const selectedFlag = document.getElementById('selected-flag');
const selectedCode = document.getElementById('selected-code');
const flagDropdown = document.getElementById('flag-dropdown');

// Toggle dropdown display on flag click
selectedFlag.addEventListener('click', function() {
flagDropdown.style.display = flagDropdown.style.display === 'block' ? 'none' : 'block';
});

// Change flag and country code on selection
document.querySelectorAll('.dropdown-item').forEach(item => {
item.addEventListener('click', function() {
    const flag = item.getAttribute('data-flag');
    const countryCode = item.getAttribute('data-country-code');
    selectedFlag.src = flag;
    selectedCode.textContent = countryCode;
    flagDropdown.style.display = 'none'; // Hide dropdown after selection
});
});

// Close dropdown if clicked outside
document.addEventListener('click', function(event) {
if (!selectedFlag.contains(event.target) && !flagDropdown.contains(event.target)) {
    flagDropdown.style.display = 'none';
}
});



document.addEventListener('DOMContentLoaded', () => {
    // Select all links and popups
    const links = document.querySelectorAll('.unique-link');
    const popups = document.querySelectorAll('.unique-popup');

    // Open the matching popup
    links.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            
            // Find the corresponding popup using the data attribute (e.g., data-popup)
            const popupClass = this.getAttribute('data-popup'); // Get class for matching popup
            const popup = document.querySelector(`.unique-popup.${popupClass}`);
            
            if (popup) {
                // Display the popup
                popup.style.display = 'block';
                
                // Add the visible class with animation
                requestAnimationFrame(() => {
                    popup.classList.add('popup-visible');
                });
            }
        });
    });

    // Close popup when close button is clicked
    popups.forEach(popup => {
        const closeButton = popup.querySelector('.closeseldtcrd-popup');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                popup.classList.remove('popup-visible');
                setTimeout(() => {
                    popup.style.display = 'none';
                }, 300); // match transition duration
            });
        }
    });
});






























document.addEventListener("DOMContentLoaded", () => {
    const items = document.querySelectorAll(".fooditemss");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add("visible");
                }, index * 200); // Delay each item
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
    });

    items.forEach((item) => {
        observer.observe(item);
    });
});


document.querySelectorAll('.link').forEach(link => {
    link.addEventListener('click', event => {
        event.preventDefault();
        
        // Remove active class from all links and boxes
        document.querySelectorAll('.link').forEach(l => l.classList.remove('active'));
        document.querySelectorAll('.content-box').forEach(box => box.classList.remove('active'));
        
        // Add active class to the clicked link
        link.classList.add('active');
        
        // Get the target box using the unique class from data-target and show it
        const targetClass = link.getAttribute('data-target');
        document.querySelector(`.content-box.${targetClass}`).classList.add('active');
    });
});






const orderHistoryContainer = document.getElementById('orderHistory');

orderHistoryContainer.addEventListener('click', () => {
    orderHistoryContainer.classList.toggle('active');
});















document.getElementById('getLocation').addEventListener('click', function(event) {
    event.preventDefault();

    fetch("https://ipapi.co/json/")
    .then(response => response.json())
    .then(data => {
        document.getElementById('locationOutput').innerText = 
            `${data.city}, ${data.region}, ${data.country_name}`;
    })
    .catch(error => {
        document.getElementById('locationOutput').innerText = "Error fetching location.";
    });
});




document.addEventListener("DOMContentLoaded", function () {
    const elements = document.querySelectorAll('.smoothslideuup');

    const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        }
    });
    }, {
    threshold: 0.1
    });

    elements.forEach(el => observer.observe(el));
});



   






















