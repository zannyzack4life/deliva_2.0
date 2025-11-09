document.addEventListener('DOMContentLoaded', () => {
    // -----------------------------------------------------------
    // 1. Element Setup and Constants 
    // -----------------------------------------------------------
    const sidebar = document.getElementById('desktop-sidebar');
    const mainContent = document.getElementById('main-content-area');
    const toggleBtn = document.getElementById('sidebar-toggle');
    const logoText = document.getElementById('sidebar-logo-text');
    const logoIcon = document.getElementById('sidebar-logo-icon');
    const sidebarLogo = document.getElementById('sidebar-logo');
    const navButtons = document.querySelectorAll('.nav-btn'); 
    const balanceElement = document.getElementById('balanceElement'); 

    const aiModal = document.getElementById('aiModal');
    const aiPanel = document.getElementById('aiPanel');
    const aiIcon = document.getElementById('aiIcon');

    // NEW: Back button elements
    const backButtons = document.querySelectorAll('.backBtns'); 

    if (!sidebar || !toggleBtn || !mainContent) return; 

    const COLLAPSED_WIDTH_CLASS = 'w-28';
    const EXPANDED_WIDTH_CLASS = 'w-64';
    
    // NEW: History tracking
    const pageHistory = []; 
    const MAX_HISTORY_SIZE = 10; 

    document.querySelectorAll('.nav-link-text').forEach(el => {
        el.classList.add('transition-all', 'duration-300', 'ease-in-out');
    });

    // Add necessary transition classes to content sections for the effect
    document.querySelectorAll('.page-content-section').forEach(section => {
        section.classList.add('transition-opacity', 'duration-200', 'ease-in-out'); // Adjust duration-200 for speed
    });

    sidebar.setAttribute('data-state', 'expanded');
    logoText?.classList.remove('hidden');
    logoIcon?.classList.add('hidden');
    
    // -----------------------------------------------------------
    // 2. Sidebar Collapse/Expand Functions (No change)
    // -----------------------------------------------------------
    const collapseSidebar = () => {
        sidebar.setAttribute('data-state', 'collapsed');

        sidebar.classList.remove(EXPANDED_WIDTH_CLASS, 'p-4');
        sidebar.classList.add(COLLAPSED_WIDTH_CLASS, 'p-3');

        mainContent.classList.remove('lg:ml-0');
        mainContent.classList.add('lg:ml-0');

        logoText?.classList.add('hidden');
        logoIcon?.classList.remove('hidden');
        sidebarLogo?.classList.add('justify-center');

        document.querySelectorAll('.nav-link-text').forEach(el => {
            el.classList.add('opacity-0', 'w-0', 'overflow-hidden');
            el.classList.remove('ml-4');
        });
        
    };

    const expandSidebar = () => {
        sidebar.setAttribute('data-state', 'expanded');

        sidebar.classList.remove(COLLAPSED_WIDTH_CLASS, 'p-3');
        sidebar.classList.add(EXPANDED_WIDTH_CLASS, 'p-4');

        mainContent.classList.remove('lg:ml-0');
        mainContent.classList.add('lg:ml-0');
        
        logoText?.classList.remove('hidden');
        logoIcon?.classList.add('hidden');
        sidebarLogo?.classList.remove('justify-center');

        setTimeout(() => {
            document.querySelectorAll('.nav-link-text').forEach(el => {
                el.classList.remove('opacity-0', 'w-0', 'overflow-hidden');
                el.classList.add('ml-4');
            });
        }, 150); 
        
    };

    toggleBtn.addEventListener('click', () => {
        const state = sidebar.getAttribute('data-state');
        if (state === 'expanded') {
            collapseSidebar();
        } else {
            expandSidebar();
        }
    });

    // -----------------------------------------------------------
    // 3. Navigation Visuals (No change)
    // -----------------------------------------------------------
    const setActiveButton = (route) => {
        navButtons.forEach(btn => {
            const isTarget = btn.getAttribute('data-route') === route;

            // Deactivate all or Activate the target button
            if (isTarget) {
                btn.classList.add('bg-gray-800', 'text-orange-500', 'shadow-lg');
                btn.classList.remove('text-gray-400', 'hover:bg-gray-800', 'hover:text-white');
                btn.querySelector('div')?.classList.remove('hidden');
            } else {
                btn.classList.remove('bg-gray-800', 'text-orange-500', 'shadow-lg');
                btn.classList.add('text-gray-400', 'hover:bg-gray-800', 'hover:text-white');
                btn.querySelector('div')?.classList.add('hidden');
            }
        });
    };

    // -----------------------------------------------------------
    // 4. Page Content Loading (UPDATED for History Tracking)
    // -----------------------------------------------------------
    // Added isBackNavigation flag
    window.loadPageContent = (route, isBackNavigation = false) => {
        
        // 0. History Tracking: Only add to history if it's NOT a back navigation
        if (!isBackNavigation) {
            // Only push if the new route is different from the last one
            if (pageHistory.length === 0 || pageHistory[pageHistory.length - 1] !== route) {
                pageHistory.push(route);
                if (pageHistory.length > MAX_HISTORY_SIZE) {
                    pageHistory.shift(); // Remove the oldest entry
                }
            }
        }
        
        // 1. Find the currently active section and the target section
        const currentActiveSection = document.querySelector('.page-content-section:not(.hidden)');
        const targetSection = document.getElementById(`content-${route}`);
        
        // 2. START FADE-OUT on the CURRENT active section (if one exists)
        if (currentActiveSection) {
            // Apply opacity-0 to start the fade-out
            currentActiveSection.classList.add('opacity-0');
            
            // Wait for the fade-out transition to complete before switching content
            setTimeout(() => {
                // 3. Hide all content sections after the fade-out
                document.querySelectorAll('.page-content-section').forEach(section => {
                    section.classList.add('hidden');
                    // Ensure all sections (except the one fading in next) are set to opacity-100 
                    section.classList.remove('opacity-0'); 
                });

                // 4. Show the specific content section
                if (targetSection) {
                    // Start hidden, but with opacity-0 applied immediately (due to the loop above/initial state)
                    targetSection.classList.remove('hidden'); 

                    // FIX: Reset the global window scroll position to the top
                    window.scrollTo(0, 0); 
                    
                    // 5. FADE-IN the TARGET section
                    // Use a slight delay (e.g., 10ms) to ensure the browser registers the 'hidden' removal 
                    setTimeout(() => {
                        targetSection.classList.remove('opacity-0'); 
                    }, 10); // Small delay for rendering/reflow
                } else {
                    mainContent.innerHTML = `<h1 class="text-3xl font-bold text-red-500 p-8">Error 404: Content section for "${route}" not found.</h1>`;
                }

            }, 200); // Wait time matches the 'duration-200' class
        } else {
            // 6. Handle initial load or no current active section (no fade-out needed)
            document.querySelectorAll('.page-content-section').forEach(section => {
                section.classList.add('hidden', 'opacity-0'); // Ensure all others are hidden and transparent
            });

            if (targetSection) {
                targetSection.classList.remove('hidden');

                // FIX: Reset the global window scroll position to the top for initial load
                window.scrollTo(0, 0); 
                
                setTimeout(() => {
                    targetSection.classList.remove('opacity-0');
                }, 10);
            } else {
                mainContent.innerHTML = `<h1 class="text-3xl font-bold text-red-500 p-8">Error 404: Content section for "${route}" not found.</h1>`;
            }
        }
        
        // 7. ALWAYS UPDATE THE NAV BUTTON ACTIVE STATE
        setActiveButton(route);
    };

    // -----------------------------------------------------------
    // 5. Navigation Handler 
    // -----------------------------------------------------------
    const handleNavigation = (event) => {
        const route = event.currentTarget.getAttribute('data-route');
        if (!route) return;
        
        // Load page content normally (isBackNavigation defaults to false)
        window.loadPageContent(route); 
    };
    
    // -----------------------------------------------------------
    // 6. Back Button Handler (NEW)
    // -----------------------------------------------------------
    const handleBackNavigation = () => {
        // We need at least 2 entries: the current page and the previous page.
        if (pageHistory.length > 1) {
            // 1. Remove the current page from history
            pageHistory.pop();
            
            // 2. Get the new last page (the target previous page)
            const previousRoute = pageHistory[pageHistory.length - 1];
            
            // 3. Load the content, passing 'true' to AVOID re-adding it to history.
            window.loadPageContent(previousRoute, true);
        } else {
            console.log("History is too short to go back.");
        }
    };
    

    // Attach the navigation handler to all navigation buttons
    navButtons.forEach(button => {
        button.addEventListener('click', handleNavigation);
    });
    
    // Attach the NEW back navigation handler to all backBtns
    backButtons.forEach(button => {
        button.addEventListener('click', handleBackNavigation);
    });
    
    // -----------------------------------------------------------
    // 7. Initial Page Load 
    // -----------------------------------------------------------
    const initialRoute = 'home';
    window.loadPageContent(initialRoute); // This handles loading, highlighting, and the initial fade-in


    // -----------------------------------------------------------
    // 8. Other Logic (Blur, Carousel, Modals)
    // -----------------------------------------------------------

    // Ensure this selector targets the right element
    const header = document.querySelector('.deskhead'); 
    const contentBody = document.getElementById('content-body'); // <-- Get the content body
    const scrollThreshold = 20; 

    // Define the class that reduces the margin
    const scrolledMarginClass = 'mt-[70%]' // Example: reducing from 85% to 70%

    window.addEventListener('scroll', () => {
        if (window.scrollY > scrollThreshold) {
            // Shrink Header
            header.dataset.scrolled = 'true'; 
            
            // **Reduce Content Margin**
            contentBody.classList.remove('mt-[85%]'); 
            contentBody.classList.add(scrolledMarginClass); 
            
        } else {
            // Reset Header
            header.dataset.scrolled = 'false'; 

            // **Reset Content Margin**
            contentBody.classList.remove(scrolledMarginClass);
            contentBody.classList.add('mt-[85%]');
        }
    });
    
    // --- BALANCE BLUR LOGIC ---
    if (balanceElement) {
        function toggleBalanceBlur(event) {
            event.preventDefault(); 
            balanceElement.classList.toggle('balance-blurred');
        }
        balanceElement.addEventListener('click', toggleBalanceBlur);
        balanceElement.addEventListener('touchend', toggleBalanceBlur, { passive: false });
    }
    
    // --- CAROUSEL/SLIDER LOGIC ---
    const track = document.getElementById('promo-track');
    const slides = Array.from(track.children);
    const indicators = document.getElementById('indicators');
    
    if (track && indicators) {
        let slideWidth = slides[0].getBoundingClientRect().width;
        let currentSlide = 0;
        const slideInterval = 5000;
        
        const moveToSlide = (targetIndex) => {
            const distanceToMove = targetIndex * slideWidth;
            track.style.transform = `translateX(-${distanceToMove}px)`;
            currentSlide = targetIndex;
            dots.forEach((dot, index) => {
                dot.classList.remove('active');
                if (index === targetIndex) dot.classList.add('active');
            });
        };
        
        window.addEventListener('resize', () => {
            slideWidth = slides[0].getBoundingClientRect().width;
            moveToSlide(currentSlide);
        });
        
        slides.forEach((slide, index) => {
            const dot = document.createElement('span');
            dot.classList.add('indicator-dot');
            if (index === 0) dot.classList.add('active');
            indicators.appendChild(dot);
        });
        const dots = Array.from(indicators.children);

        setInterval(() => {
            let nextSlide = currentSlide + 1;
            if (nextSlide >= slides.length) {
                nextSlide = 0;
            }
            moveToSlide(nextSlide);
        }, slideInterval);

        moveToSlide(0);
    }
}); // End of DOMContentLoaded

// -----------------------------------------------------------
// 6. Global Functions (Accessible from inline HTML: onclick="...")
// -----------------------------------------------------------

function toggleExpansion() {
    const card = document.getElementById('accountCard');
    const detailPanel = document.getElementById('detailPanel');
    const expandIcon = document.getElementById('expandIcon');

    if (!card || !detailPanel || !expandIcon) return;

    card.classList.toggle('expanded');

    if (card.classList.contains('expanded')) {
        detailPanel.style.maxHeight = detailPanel.scrollHeight + "px";
        expandIcon.style.transform = 'rotate(180deg)';
    } else {
        detailPanel.style.maxHeight = '0';
        expandIcon.style.transform = 'rotate(0deg)';
    }
}

function toggleAIModal() {
    const aiModal = document.getElementById('aiModal');
    const aiPanel = document.getElementById('aiPanel');
    const aiIcon = document.getElementById('aiIcon');

    if (!aiModal || !aiPanel || !aiIcon) return;
    
    if (aiModal.classList.contains('hidden')) {
        // OPEN MODAL
        aiModal.classList.remove('hidden');
        aiIcon.className = 'fa-solid fa-xmark text-white text-2xl transition-all duration-300';
        
        setTimeout(() => {
            aiPanel.classList.remove('translate-y-full'); 
            aiPanel.classList.add('animate-bounce-in');
        }, 10); 
    } else {
        // CLOSE MODAL
        aiPanel.classList.remove('animate-bounce-in');
        aiPanel.classList.add('opacity-0', 'scale-95');
        
        setTimeout(() => {
            aiModal.classList.add('hidden');
            aiPanel.classList.remove('opacity-0', 'scale-95'); 
            aiPanel.classList.add('translate-y-full');
        }, 300);

        aiIcon.className = 'fa-brands fa-slack fa-spin text-white text-2xl transition-all duration-300';
    }
}

function closeModalIfClickedOutside(event) {
    const aiModal = document.getElementById('aiModal');
    if (event.target === aiModal) {
        toggleAIModal();
    }
}













// --- Transfer Flow Global Functions ---

// State variables to hold transfer data
let selectedBank = null;
let recipientName = null;
let accountNumberValue = null;

// Utility to switch between stages (1, 2, 3)
function switchTransferStage(targetStage) {
    document.querySelectorAll('.transfer-stage').forEach(stage => {
        stage.classList.add('hidden');
    });
    document.getElementById(`transfer-stage-${targetStage}`).classList.remove('hidden');
}

// Stage 1: Account Number Input Handler
function handleAccountInput(accountNumber) {
    const savedAccountsSection = document.getElementById('saved-accounts-section');
    const bankSelectionSection = document.getElementById('bank-selection-section');
    accountNumberValue = accountNumber;

    if (accountNumber.length >= 10) {
        // Assume account number is complete, show the bank list (Image: 03.52.56_8d296b53.jpg)
        savedAccountsSection.classList.add('hidden');
        bankSelectionSection.classList.remove('hidden');
    } else {
        // Account number is incomplete, show saved accounts
        savedAccountsSection.classList.remove('hidden');
        bankSelectionSection.classList.add('hidden');
        // Reset selected bank if user starts typing again
        selectedBank = null;
    }
}

// Action: Go to All Banks List (Stage 2)
function goToAllBanks() {
    switchTransferStage(2);
}

// Action: Select a Bank from the top 3 list
function selectBank(bankName) {
    selectedBank = bankName;
    // For demonstration, let's assume successful name lookup
    recipientName = 'JEREMIAH CHUKWUDUBEM ONYEKACHI'; 
    
    // Update and show confirmation modal
    document.getElementById('confirmed-recipient-name').textContent = recipientName;
    document.getElementById('confirmed-recipient-details').textContent = `${bankName} • ${accountNumberValue}`;
    openConfirmationModal();
}

// Action: Select a Bank from the Stage 2 All Banks List
function selectBankFromList(bankName, recipient) {
    selectedBank = bankName;
    recipientName = recipient; 
    
    // Update and show confirmation modal
    document.getElementById('confirmed-recipient-name').textContent = recipientName;
    document.getElementById('confirmed-recipient-details').textContent = `${bankName} • ${accountNumberValue}`;
    openConfirmationModal();
}

// Modal: Open the Recipient Confirmation Modal
function openConfirmationModal() {
    const modal = document.getElementById('recipient-confirmation-modal');
    const panel = document.getElementById('confirmation-panel');
    modal.classList.remove('hidden');
    
    // Use a timeout to trigger the slide-up animation after display
    setTimeout(() => {
        modal.style.opacity = '1';
        panel.classList.remove('translate-y-full');
    }, 10);
    
    // Important: Switch back to Stage 1 to show input screen behind the modal
    switchTransferStage(1);
}

// Modal: Close the Recipient Confirmation Modal
function closeConfirmationModal(event) {
    const modal = document.getElementById('recipient-confirmation-modal');
    const panel = document.getElementById('confirmation-panel');
    
    if (event.target === modal || event.target.id === 'changeDetails') {
        panel.classList.add('translate-y-full');
        modal.style.opacity = '0';
        
        // Hide the modal after the transition finishes (300ms)
        setTimeout(() => {
            modal.classList.add('hidden');
            // Reset to initial Stage 1 view if account number is cleared/changed
            if (accountNumberValue.length < 10) {
                 handleAccountInput(accountNumberValue);
            }
        }, 300);
    }
}

// Action: Change Details (close modal and allow re-selection)
function changeDetails() {
    const event = { target: document.getElementById('changeDetails') };
    closeConfirmationModal(event);
}

// Action: Go to Amount Stage (Stage 3)
function goToAmountStage() {
    closeConfirmationModal({ target: document.getElementById('recipient-confirmation-modal') });
    
    // Update Stage 3 recipient name
    document.getElementById('amount-recipient-name').textContent = recipientName;
    
    // Clear amount input and disable button
    const amountInput = document.getElementById('amountInput');
    amountInput.value = '';
    document.getElementById('continueButton').disabled = true;
    document.getElementById('continueButton').classList.replace('bg-orange-500', 'bg-gray-700');
    document.getElementById('continueButton').classList.replace('text-black', 'text-gray-400');
    
    switchTransferStage(3);
    amountInput.focus();
}

// Action: Go back to Stage 1 (from Stage 2 or 3)
function goBackToTransfer() {
    switchTransferStage(1);
    // Ensure the correct state (bank list or saved accounts) is displayed
    handleAccountInput(document.getElementById('accountNumber').value);
}

// Stage 3: Amount Input Handler
function updateAmountDisplay(value) {
    const continueBtn = document.getElementById('continueButton');
    const amount = parseInt(value.replace(/,/g, ''), 10); 
    
    if (amount > 100) {
        continueBtn.disabled = false;
        continueBtn.classList.replace('bg-gray-700', 'bg-orange-500');
        continueBtn.classList.replace('text-gray-400', 'text-black');
    } else {
        continueBtn.disabled = true;
        continueBtn.classList.replace('bg-orange-500', 'bg-gray-700');
        continueBtn.classList.replace('text-black', 'text-gray-400');
    }
}



















        // Configuration object for editable content
        const defaultConfig = {
            app_title: "SecureTransfer",
            bank_name: "SecureBank",
            user_name: "Alex Johnson"
        };

        // Global state
        let currentView = '';
        let transferData = {};
        
        // Mock data
        const userAccount = {
            name: "Alex Johnson",
            accountNumber: "1234567890",
            balance: 350000.00,
            bankName: "SecureBank"
        };

        const popularBanks = [
            { name: "GTBank", code: "058", },
            { name: "Access Bank", code: "044", },
            { name: "First Bank", code: "011", },
            { name: "UBA", code: "033", },
            { name: "Opay", code: "999", },
            { name: "PalmPay", code: "327", }
        ];

        const allBanks = [
            { name: "GTBank", code: "058", },
            { name: "Access Bank", code: "044", },
            { name: "First Bank", code: "011", },
            { name: "Zenith Bank", code: "057", },
            { name: "UBA", code: "033", },
            { name: "Fidelity Bank", code: "070", },
            { name: "Sterling Bank", code: "232", },
            { name: "Stanbic IBTC", code: "221", },
            { name: "Union Bank", code: "032", },
            { name: "Wema Bank", code: "035", },
            { name: "Ecobank", code: "050", },
            { name: "Heritage Bank", code: "030", },
            { name: "Keystone Bank", code: "082", },
            { name: "Polaris Bank", code: "076", },
            { name: "Unity Bank", code: "215", },
            { name: "Jaiz Bank", code: "301", },
            { name: "Providus Bank", code: "101", },
            { name: "Kuda Bank", code: "090", },
            { name: "Opay", code: "999", },
            { name: "PalmPay", code: "327", },
            { name: "Moniepoint", code: "330", },
            { name: "Grey", code: "760", }
        ];

        let mockRecentTransactions = [
            {
                id: "TXN001",
                recipient: "John Doe",
                bank: "GTBank",
                amount: 15000,
                date: new Date(Date.now() - 86400000),
                status: "completed"
            },
            {
                id: "TXN002", 
                recipient: "Sarah Adams",
                bank: "Access Bank",
                amount: 25000,
                date: new Date(Date.now() - 172800000),
                status: "completed"
            }
        ];

        // Utility functions
        function formatNaira(amount) {
            return new Intl.NumberFormat('en-NG', {
                style: 'currency',
                currency: 'NGN',
                minimumFractionDigits: 2
            }).format(amount);
        }

        function generateUniqueId() {
            return 'TXN' + Date.now().toString(36).toUpperCase();
        }

        function showCustomMessage(title, message, type = 'info') {
            const colors = {
                success: 'bg-green-100 text-green-800 border-green-200',
                error: 'bg-red-100 text-red-800 border-red-200',
                info: 'bg-blue-100 text-blue-800 border-blue-200'
            };
            
            const messageDiv = document.createElement('div');
            messageDiv.className = `fixed top-4 right-4 p-4 rounded-lg border ${colors[type]} z-50 max-w-sm`;
            messageDiv.innerHTML = `
                <div class="font-semibold">${title}</div>
                <div class="text-sm mt-1">${message}</div>
            `;
            
            document.body.appendChild(messageDiv);
            
            setTimeout(() => {
                messageDiv.remove();
            }, 4000);
        }

        // View management functions
        function showView(viewName, details = {}) {
            // Hide all views
            const allViews = document.querySelectorAll('.view-container');
            allViews.forEach(view => view.classList.add('hidden'));
            
            // Show the requested view
            const targetView = document.getElementById(viewName + '-view');
            if (targetView) {
                targetView.classList.remove('hidden');
                
                // Apply fade-in animation
                targetView.classList.add('animate-fade-in-right');
                setTimeout(() => {
                    targetView.classList.remove('animate-fade-in-right');
                }, 300);
                
                // Update view-specific content
                updateViewContent(viewName, details);
            }
            
            currentView = viewName;
        }

        function updateViewContent(viewName, details) {
            switch(viewName) {
                case 'bank-selection':
                    populateBanks(false);
                    setupBankSearch();
                    break;
                case 'account-input':
                    document.getElementById('selected-bank-name').textContent = `Sending to ${details.bankName}`;
                    document.getElementById('account-number').value = '';
                    break;
                case 'recipient-confirm':
                    updateRecipientConfirm(details);
                    break;
                case 'amount-entry':
                    updateAmountEntry(details);
                    break;
                case 'receipt':
                    updateReceipt(details);
                    break;
            }
        }

        function populateBanks(showAllBanks = false) {
            const banksToShow = showAllBanks ? allBanks : popularBanks;
            const banksGrid = document.getElementById('banks-grid');
            const banksTitle = document.getElementById('banks-title');
            const toggleBtn = document.getElementById('toggle-banks-btn');
            
            banksTitle.textContent = showAllBanks ? "All Banks" : "Popular Banks";
            toggleBtn.textContent = showAllBanks ? "← Back" : "All Banks →";
            
            banksGrid.innerHTML = banksToShow.map(bank => `
                <div class="bank-card p-3 md:p-4  rounded-2xl shadow-lg hover:shadow-2xl hover:border-yellow-200 transition-all duration-300 transform cursor-pointer group" 
                     onclick="selectBank('${bank.name}', '${bank.code}')">
                    <div class="flex items-center space-x-4">
                        <div class="flex-1">
                            <h3 class="font-bold text-white text-[12px] md:text-lg group-hover:text-blue-600 transition-colors">${bank.name}</h3>
                            <p class="text-white text-[12px] md:text-sm font-medium">Code: ${bank.code}</p>
                        </div>
                        
                    </div>
                </div>
            `).join('');
            
            currentBankView = showAllBanks ? 'all' : 'popular';
        }

        function setupBankSearch() {
            const searchInput = document.getElementById('bank-search');
            searchInput.value = '';
            searchInput.oninput = (e) => filterBanks(e.target.value);
        }

        

        function updateRecipientConfirm(details) {
            document.getElementById('recipient-name').textContent = details.recipientName;
            document.getElementById('recipient-initial').textContent = details.recipientName.charAt(0);
            document.getElementById('confirm-account-number').textContent = details.accountNumber;
            document.getElementById('confirm-bank-name').textContent = details.bankName;
        }

        function updateAmountEntry(details) {
            document.getElementById('amount-recipient-name').textContent = details.recipientName;
            document.getElementById('amount-bank-name').textContent = details.bankName;
            document.getElementById('available-balance').textContent = formatNaira(userAccount.balance);
            document.getElementById('transfer-amount').value = '';
            document.getElementById('total-debit').textContent = '₦50.00';
            
            // Setup amount calculation
            const amountInput = document.getElementById('transfer-amount');
            const totalDebitSpan = document.getElementById('total-debit');
            
            amountInput.oninput = function() {
                const amount = parseFloat(this.value) || 0;
                const total = amount + 50;
                totalDebitSpan.textContent = formatNaira(total);
            };
        }

        function updateReceipt(details) {
            const receiptDetails = document.getElementById('receipt-details');
            receiptDetails.innerHTML = `
                <div class="recetra rounded-xl p-4 flex justify-between items-center">
                    <span class="text-gray-200 text-[12px] md:text-sm font-medium">Transaction ID</span>
                    <span class="font-bold text-[12px] md:text-sm text-gray-400 font-mono text-sm">${details.transactionId}</span>
                </div>
                <div class="recetra rounded-xl p-4 flex justify-between items-center">
                    <span class="text-gray-200 text-[12px] md:text-sm font-medium">Recipient</span>
                    <span class="font-bold text-[12px] md:text-sm text-gray-400">${details.recipientName}</span>
                </div>
                <div class="recetra rounded-xl p-4 flex justify-between items-center">
                    <span class="text-gray-200 text-[12px] md:text-sm font-medium">Bank</span>
                    <span class="font-bold text-[12px] md:text-sm text-gray-400">${details.bankName}</span>
                </div>
                <div class="recetra rounded-xl p-4 flex justify-between items-center">
                    <span class="text-gray-200 text-[12px] md:text-sm font-medium">Amount</span>
                    <span class="font-bold text-[12px] md:text-sm text-green-400 text-lg">${formatNaira(details.amount)}</span>
                </div>
                <div class="recetra rounded-xl p-4 flex justify-between items-center">
                    <span class="text-gray-200 text-[12px] md:text-sm font-medium">Transfer Fee</span>
                    <span class="font-bold text-[12px] md:text-sm text-gray-400">₦50.00</span>
                </div>
                <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200">
                    <div class="flex justify-between items-center">
                        <span class="text-blue-800 font-bold text-[12px] md:text-sm">Total Debited</span>
                        <span class="font-bold text-blue-600 text-[12px] md:text-sm">${formatNaira(details.amount + 50)}</span>
                    </div>
                </div>
                <div class="quicktr mt-2 rounded-xl p-4 flex justify-between items-center">
                    <span class="text-gray-200 text-[12px] md:text-sm font-medium">Date & Time</span>
                    <span class="font-bold text-[12px] md:text-sm text-gray-300">${new Date().toLocaleString()}</span>
                </div>
            `;
        }

        // Bank search and filter functions
let currentBankView = 'popular'; // 'popular' or 'all'
// Assuming allBanks and populateBanks are defined elsewhere

function filterBanks(searchTerm) {
    const banksGrid = document.getElementById('banks-grid');
    const banksTitle = document.getElementById('banks-title');
    const toggleBtn = document.getElementById('toggle-banks-btn'); // Assuming you have a toggle button
    const searchInput = document.getElementById('bank-search'); // Assuming you have a search input
    
    // Normalize the search term
    const searchLower = searchTerm.trim().toLowerCase();
    
    // --- 1. Handle Empty Search Term (Restore Original View) ---
    if (searchLower.length === 0) {
        // Restore the view the user was on before searching
        populateBanks(currentBankView === 'all');
        
        // Restore UI elements to non-search state
        banksTitle.style.display = 'block'; // Or whatever your default title state is
        if (toggleBtn) toggleBtn.style.display = 'block';
        
        // Clear the grid content if it wasn't rendered by populateBanks (optional cleanup)
        // banksGrid.innerHTML = ''; 
        
        return; // Stop execution
    }
    
    // --- 2. Perform Comprehensive Search (Always use allBanks) ---
    // This is the CRUCIAL fix: ALWAYS filter the complete list
    const filteredBanks = allBanks.filter(bank => 
        bank.name.toLowerCase().includes(searchLower) ||
        // Ensure bank code search is also case-insensitive if needed, 
        // but keeping your original 'includes' for codes.
        bank.code.includes(searchTerm.trim()) 
    );
    
    // Update UI for active search state
    banksTitle.textContent = `Search Results for: "${searchTerm.trim()}"`;
    if (toggleBtn) toggleBtn.style.display = 'none'; // Hide the toggle button during search

    
    // --- 3. Render Results ---
    if (filteredBanks.length > 0) {
        // Render search results
        // Note: The 'no-results' element is not needed if you handle rendering here.
        banksGrid.innerHTML = filteredBanks.map(bank => `
            <div class="bank-card p-3 md:p-4 rounded-2xl shadow-lg hover:shadow-2xl hover:border-yellow-200 transition-all duration-300 transform cursor-pointer group" 
                 onclick="selectBank('${bank.name}', '${bank.code}')">
                <div class="flex items-center space-x-4">
                    <div class="flex-1">
                        <h3 class="font-bold text-white text-[12px] md:text-lg group-hover:text-blue-600 transition-colors">${bank.name}</h3>
                        <p class="text-white text-[12px] md:text-sm font-medium">Code: ${bank.code}</p>
                    </div>
                </div>
            </div>
        `).join('');
    } else {
        // Handle no results found
        banksGrid.innerHTML = `
            <div class="col-span-full text-center p-8 w-full">
                <p class="text-white text-lg font-semibold">🔍 No banks found matching "${searchTerm.trim()}".</p>
                <p class="text-gray-400 text-sm mt-1">Try searching by name or bank code.</p>
            </div>
        `;
    }
}
        
        function showAllBanks() {
            populateBanks(true);
            const toggleBtn = document.getElementById('toggle-banks-btn');
            toggleBtn.onclick = function() {
                showPopularBanks();
            };
        }
        
        function showPopularBanks() {
            populateBanks(false);
            const toggleBtn = document.getElementById('toggle-banks-btn');
            toggleBtn.onclick = function() {
                showAllBanks();
            };
        }

        // Quick transfer function
        function quickTransfer(recipientName, bankName, accountNumber) {
            transferData = {
                recipientName: recipientName,
                bankName: bankName,
                accountNumber: accountNumber,
                bankCode: popularBanks.find(bank => bank.name === bankName)?.code || '000'
            };
            showView('amount-entry', transferData);
        }

        // Event handlers
        function selectBank(bankName, bankCode) {
            transferData.bankName = bankName;
            transferData.bankCode = bankCode;
            showView('account-input', { bankName });
        }

        function lookupAccount() {
            const accountNumber = document.getElementById('account-number').value;
            
            if (accountNumber.length !== 10) {
                showCustomMessage('Invalid Account', 'Please enter a valid 10-digit account number', 'error');
                return;
            }
            
            // Mock account lookup
            const mockRecipients = [
                { accountNumber: '1234567890', name: 'John Doe' },
                { accountNumber: '0987654321', name: 'Sarah Adams' },
                { accountNumber: '1122334455', name: 'Michael Brown' },
                { accountNumber: '5566778899', name: 'Emma Wilson' },
                { accountNumber: '2233445566', name: 'David Johnson' },
                { accountNumber: '3344556677', name: 'Lisa Chen' },
                { accountNumber: '4455667788', name: 'Robert Taylor' },
                { accountNumber: '5566778800', name: 'Maria Garcia' },
                { accountNumber: '6677889900', name: 'James Wilson' },
                { accountNumber: '7788990011', name: 'Jennifer Lee' },
                { accountNumber: '9018654747', name: 'Jerry Luis' },
                { accountNumber: '8101874140', name: 'Melvin col' }
            ];
            
            // Generate a realistic name if account not found
            const firstNames = ['Ahmed', 'Fatima', 'Chidi', 'Amina', 'Kemi', 'Tunde', 'Ngozi', 'Ibrahim', 'Aisha', 'Emeka'];
            const lastNames = ['Adebayo', 'Okafor', 'Bello', 'Eze', 'Yakubu', 'Okoro', 'Musa', 'Nwosu', 'Aliyu', 'Okonkwo'];
            
            const recipient = mockRecipients.find(r => r.accountNumber === accountNumber) || {
                accountNumber,
                name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`
            };
            
            transferData.accountNumber = accountNumber;
            transferData.recipientName = recipient.name;
            
            showView('recipient-confirm', transferData);
        }

        function proceedToAmount() {
            // Check if user wants to save as beneficiary
            const saveBeneficiary = document.getElementById('save-beneficiary').checked;
            if (saveBeneficiary) {
                // Add to saved beneficiaries (in a real app, this would save to backend)
                const newBeneficiary = {
                    name: transferData.recipientName,
                    bank: transferData.bankName,
                    accountNumber: transferData.accountNumber
                };
                
                // Show confirmation message
                showCustomMessage('Beneficiary Saved', `${transferData.recipientName} has been added to your quick transfer list`, 'success');
            }
            
            showView('amount-entry', transferData);
        }

        function handleSend() {
            const amount = parseFloat(document.getElementById('transfer-amount').value);
            
            if (!amount || amount <= 0) {
                showCustomMessage('Invalid Amount', 'Please enter a valid amount', 'error');
                return;
            }
            
            const totalDebit = amount + 50;
            
            if (totalDebit > userAccount.balance) {
                showCustomMessage('Insufficient Funds', 'You do not have enough balance for this transfer', 'error');
                return;
            }
            
            transferData.amount = amount;
            showConfirmationModal();
        }

        function showConfirmationModal() {
            const modal = document.getElementById('confirmation-modal');
            const modalContent = document.getElementById('modal-content');
            const transferDetails = document.getElementById('transfer-details');
            
            transferDetails.innerHTML = `
                <div class="sendfrom rounded-lg p-4 space-y-2">
                    <div class="flex justify-between">
                        <span class="text-gray-300">To:</span>
                        <span class="font-medium">${transferData.recipientName}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-300">Bank:</span>
                        <span class="font-medium">${transferData.bankName}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-300">Amount:</span>
                        <span class="font-medium">${formatNaira(transferData.amount)}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-300">Fee:</span>
                        <span class="font-medium">₦50.00</span>
                    </div>
                    <hr class="border-gray-200">
                    <div class="flex justify-between font-semibold">
                        <span>Total:</span>
                        <span>${formatNaira(transferData.amount + 50)}</span>
                    </div>
                </div>
            `;
            
            modal.classList.remove('hidden');
            
            // Apply appropriate animation based on screen size
            if (window.innerWidth >= 1024) {
                modalContent.classList.add('animate-bounce-in');
            } else {
                modalContent.classList.add('animate-slide-up');
            }
            
            // Event listeners
            document.getElementById('cancel-transfer').onclick = closeConfirmationModal;
            document.getElementById('confirm-transfer').onclick = handleConfirmTransfer;
        }

        function closeConfirmationModal() {
            const modal = document.getElementById('confirmation-modal');
            const modalContent = document.getElementById('modal-content');
            
            // Apply exit animation
            if (window.innerWidth >= 1024) {
                modalContent.classList.remove('animate-bounce-in');
                modalContent.classList.add('animate-shrink-fade');
            } else {
                modalContent.classList.remove('animate-slide-up');
                modalContent.classList.add('animate-slide-down');
            }
            
            setTimeout(() => {
                modal.classList.add('hidden');
                modalContent.classList.remove('animate-shrink-fade', 'animate-slide-down');
            }, 300);
        }

        function handleConfirmTransfer() {
            closeConfirmationModal();
            
            // Show loading view
            showView('loading');
            
            // Simulate processing time
            setTimeout(() => {
                // Process the transfer
                const transactionId = generateUniqueId();
                const totalDebit = transferData.amount + 50;
                
                // Debit user account
                userAccount.balance -= totalDebit;
                updateBalanceDisplay();
                
                // Add to recent transactions
                mockRecentTransactions.unshift({
                    id: transactionId,
                    recipient: transferData.recipientName,
                    bank: transferData.bankName,
                    amount: transferData.amount,
                    date: new Date(),
                    status: "completed"
                });
                
                updateRecentActivity();
                
                // Show receipt
                showView('receipt', {
                    ...transferData,
                    transactionId
                });
                
                showCustomMessage('Transfer Successful', 'Your money has been sent successfully', 'success');
            }, 2000);
        }

        function shareReceipt() {
            showCustomMessage('Receipt Shared', 'Receipt has been copied to clipboard', 'success');
        }

        // Setup event listeners
        function setupEventListeners() {
            // Bank selection events
            const toggleBtn = document.getElementById('toggle-banks-btn');
            toggleBtn.onclick = function() {
                if (currentBankView === 'popular') {
                    showAllBanks();
                } else {
                    showPopularBanks();
                }
            };
            
            // Account input events
            document.getElementById('back-to-banks').onclick = () => showView('bank-selection');
            document.getElementById('lookup-account').onclick = lookupAccount;
            
            // Recipient confirm events
            document.getElementById('back-to-account').onclick = () => showView('account-input', { bankName: transferData.bankName });
            document.getElementById('proceed-to-amount').onclick = proceedToAmount;
            
            // Amount entry events
            document.getElementById('back-to-confirm').onclick = () => showView('recipient-confirm', transferData);
            document.getElementById('send-money').onclick = handleSend;
            
            // Receipt events
            document.getElementById('send-another').onclick = () => showView('bank-selection');
            document.getElementById('share-receipt').onclick = shareReceipt;
        }

        function updateBalanceDisplay() {
            const config = window.elementSdk?.config || defaultConfig;
            const userName = config.user_name || defaultConfig.user_name;
            
            document.getElementById('balance-display').textContent = formatNaira(userAccount.balance);
            userAccount.name = userName;
        }

        function updateRecentActivity() {
            const recentActivity = document.getElementById('recent-activity');
            const recentTransactions = mockRecentTransactions.slice(0, 3);
            
            recentActivity.innerHTML = recentTransactions.map(transaction => `
                <div class="recetra p-3 rounded-lg border">
                    <div class="flex justify-between items-start mb-1">
                        <p class="font-medium text-sm">${transaction.recipient}</p>
                        <span class="text-xs text-gray-400">${transaction.date.toLocaleDateString()}</span>
                    </div>
                    <div class="flex justify-between items-start mb-1">
                        <p class="text-xs text-gray-400 mb-1">${transaction.bank}</p>
                        <p class="font-semibold text-sm">${formatNaira(transaction.amount)}</p>
                    </div>
                    
                </div>
            `).join('');
        }

        // Initialize app
        function initializeApp() {
            // Hide loading screen and show app
            setTimeout(() => {
                document.getElementById('initial-loading').style.display = 'none';
                document.getElementById('app-container').style.display = 'grid';
                
                // Setup event listeners
                setupEventListeners();
                
                // Initialize with bank selection view
                showView('bank-selection');
                updateBalanceDisplay();
                updateRecentActivity();
            }, 1500);
        }

        // Element SDK integration
        async function onConfigChange(config) {
            // Update app title
            const appTitleElement = document.getElementById('app-title');
            if (appTitleElement) {
                appTitleElement.textContent = config.app_title || defaultConfig.app_title;
            }
            
            // Update user name in account
            userAccount.name = config.user_name || defaultConfig.user_name;
            userAccount.bankName = config.bank_name || defaultConfig.bank_name;
            
            updateBalanceDisplay();
        }

        function mapToCapabilities(config) {
            return {
                recolorables: [],
                borderables: [],
                fontEditable: undefined,
                fontSizeable: undefined
            };
        }

        function mapToEditPanelValues(config) {
            return new Map([
                ["app_title", config.app_title || defaultConfig.app_title],
                ["bank_name", config.bank_name || defaultConfig.bank_name],
                ["user_name", config.user_name || defaultConfig.user_name]
            ]);
        }

        // Initialize Element SDK
        if (window.elementSdk) {
            window.elementSdk.init({
                defaultConfig,
                onConfigChange,
                mapToCapabilities,
                mapToEditPanelValues
            });
        }

        // Start the app
        document.addEventListener('DOMContentLoaded', initializeApp);

































(function() {
    // Note: The original 'defaultConfig' is now safely scoped inside this IIFE,
    // so it will not conflict with any existing global 'defaultConfig'.

    // Configuration object for editable content
    const localDefaultConfig = {
        page_title: "Buy Airtime",
        user_phone: "***********",
        success_message: "Your airtime has been sent successfully"
    };

    // Global state (now local to the IIFE)
    let currentStep = 0; // Start with quick purchase screen
    let selectedNetwork = null;
    let selectedAmount = 0;
    let phoneNumber = '';
    let paymentMethod = 'wallet'; // Default to wallet

    // Utility functions
    function formatNaira(amount) {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0
        }).format(amount);
    }

    function generateTransactionRef() {
        return 'TXN' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 5).toUpperCase();
    }

    function showCustomMessage(title, message, type = 'info') {
        const colors = {
            success: 'bg-green-100 text-green-800 border-green-200',
            error: 'bg-red-100 text-red-800 border-red-200',
            info: 'bg-blue-100 text-blue-800 border-blue-200'
        };

        const messageDiv = document.createElement('div');
        messageDiv.className = `fixed top-4 right-4 p-4 rounded-lg border ${colors[type]} z-50 max-w-sm slide-up-airtime`;
        messageDiv.innerHTML = `
            <div class="font-semibold">${title}</div>
            <div class="text-sm mt-1">${message}</div>
        `;

        document.body.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.remove();
        }, 4000);
    }

    // Quick purchase function
    function quickPurchase(amount, event) { // Added 'event' argument
        selectedAmount = amount;

        // Set predefined network and phone based on amount
        if (amount === 100) {
            selectedNetwork = { name: 'MTN', icon: '🟡' };
            phoneNumber = localDefaultConfig.user_phone; // Use configured default user phone
        } else if (amount === 500) {
            selectedNetwork = { name: 'Airtel', icon: '🔴' };
            phoneNumber = localDefaultConfig.user_phone; // Use configured default user phone
        }

        // Go directly to payment step
        updateSummary();
        goToStep(3);
    }

    // Step management
    function goToStep(step) {
        // Validation
        if (step === 2 && !selectedNetwork) {
            showCustomMessage('Network Required', 'Please select a network first', 'error');
            return;
        }

        if (step === 3) {
            // Skip validation for quick purchase (when coming directly from step 1)
            // The check below ensures that if we are coming from a quick purchase (currentStep=0), 
            // the variables have been set. If coming from step 2, we validate as normal.
            if (currentStep <= 1 && selectedAmount > 0 && selectedNetwork && phoneNumber) {
                 // Quick purchase - validation already done
            } else if (!validateStep2()) {
                return;
            }
        }

        // Hide all steps
        document.querySelectorAll('.step-content').forEach(el => el.classList.add('hidden'));

        // Show target step
        if (step >= 1 && step <= 3) {
            document.getElementById(`step${step}`).classList.remove('hidden');
            currentStep = step;
            updateProgressIndicator();
        }
    }

    function updateProgressIndicator() {
        // Reset all indicators
        for (let i = 1; i <= 3; i++) {
            const indicator = document.getElementById(`step${i}-indicator`);
            if (!indicator) continue; // Safety check

            indicator.className = 'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold';

            if (i < currentStep) {
                indicator.className += ' bg-green-500 text-white';
                indicator.innerHTML = '✓';
            } else if (i === currentStep) {
                indicator.className += ' bg-orange-500 text-white';
                indicator.innerHTML = i;
            } else {
                indicator.className += ' bg-gray-300 text-gray-500';
                indicator.innerHTML = i;
            }
        }

        // Update progress bars
        const bar1 = document.getElementById('progress-bar-1');
        const bar2 = document.getElementById('progress-bar-2');
        if (bar1) bar1.style.width = currentStep > 1 ? '100%' : '0%';
        if (bar2) bar2.style.width = currentStep > 2 ? '100%' : '0%';
    }

    // Network selection
    function selectNetwork(name, color, icon, event) {
        // Remove previous selection
        document.querySelectorAll('.network-card-airtime').forEach(card => {
            card.classList.remove('selected');
        });

        // Add selection to clicked card
        if (event && event.currentTarget) {
            event.currentTarget.classList.add('selected');
        }

        selectedNetwork = { name, color, icon };

        // Auto-advance to next step after a short delay
        setTimeout(() => {
            goToStep(2);
        }, 500);
    }

    // Amount selection
    function selectAmount(amount, event) {
        // Remove previous selection
        document.querySelectorAll('.amount-btn-airtime').forEach(btn => {
            btn.classList.remove('selected');
        });

        // Add selection to clicked button
        if (event && event.currentTarget) {
            event.currentTarget.classList.add('selected');
        }

        selectedAmount = amount;
        const customAmountInput = document.getElementById('custom-amount');
        if (customAmountInput) customAmountInput.value = '';

        validateStep2();
    }

    // Payment method selection
    function selectPaymentMethod(method, event) {
        // Remove previous selection
        document.querySelectorAll('.payment-method').forEach(el => {
            el.classList.remove('border-purple-500');
            el.classList.add('border-gray-200');
            // Remove checkmark
            const checkmark = el.querySelector('.text-purple-500');
            if (checkmark) {
                checkmark.style.display = 'none';
            }
        });

        // Add selection to clicked method
        if (event && event.currentTarget) {
            event.currentTarget.classList.remove('border-gray-200');
            event.currentTarget.classList.add('border-purple-500');

            // Add checkmark
            let checkmark = event.currentTarget.querySelector('.text-purple-500');
            if (checkmark) {
                checkmark.style.display = 'block';
            } else if (method === 'card') {
                // Assuming card method needs a checkmark dynamically added if not already present
                checkmark = document.createElement('div');
                checkmark.className = 'text-purple-500';
                checkmark.innerHTML = '<span class="text-xl">✓</span>';
                const flexContainer = event.currentTarget.querySelector('.flex');
                if (flexContainer) flexContainer.appendChild(checkmark);
            }
        }

        paymentMethod = method;
    }

    // Validation
    function validateStep2() {
        const phoneInput = document.getElementById('phone-number');
        const customAmountInput = document.getElementById('custom-amount');
        const continueBtn = document.getElementById('continue-to-payment');

        if (!phoneInput || !customAmountInput || !continueBtn) return false;

        phoneNumber = phoneInput.value.replace(/\D/g, '');

        // Check custom amount if no quick amount selected
        let finalAmount = selectedAmount;
        if (selectedAmount === 0) {
            const customAmount = parseInt(customAmountInput.value) || 0;
            if (customAmount >= 50 && customAmount <= 50000) {
                finalAmount = customAmount;
                // Remove selection from quick amount buttons
                document.querySelectorAll('.amount-btn-airtime').forEach(btn => {
                    btn.classList.remove('selected');
                });
            } else {
                finalAmount = 0; // Invalid custom amount
            }
        }

        const isValid = phoneNumber.length === 11 && finalAmount >= 50;
        
        // Update state and UI based on validation
        selectedAmount = finalAmount; // Update global state amount
        continueBtn.disabled = !isValid;

        if (isValid) {
            updateSummary();
        }

        return isValid;
    }

    function updateSummary() {
        if (selectedNetwork) {
            const networkDisplay = document.getElementById('selected-network-display');
            const networkIcon = document.getElementById('selected-network-icon');
            const summaryNetwork = document.getElementById('summary-network');
            const summaryIcon = document.getElementById('summary-network-icon');

            if (networkDisplay) networkDisplay.textContent = selectedNetwork.name;
            if (networkIcon) networkIcon.textContent = selectedNetwork.icon;
            if (summaryNetwork) summaryNetwork.textContent = selectedNetwork.name;
            if (summaryIcon) summaryIcon.textContent = selectedNetwork.icon;
        }

        const summaryPhone = document.getElementById('summary-phone');
        const summaryAmount = document.getElementById('summary-amount');
        const summaryTotal = document.getElementById('summary-total');

        if (summaryPhone) summaryPhone.textContent = `+234${phoneNumber.substring(1)}`;
        if (summaryAmount) summaryAmount.textContent = formatNaira(selectedAmount);
        // Assuming a NGN 10 fee for total calculation
        if (summaryTotal) summaryTotal.textContent = formatNaira(selectedAmount + 10);
    }

    // Purchase processing
    function processPurchase() {
        if (!paymentMethod) {
            showCustomMessage('Payment Method Required', 'Please select a payment method', 'error');
            return;
        }

        // Show loading
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) loadingOverlay.classList.remove('hidden');

        // Simulate processing
        setTimeout(() => {
            if (loadingOverlay) loadingOverlay.classList.add('hidden');
            showSuccessScreen();
        }, 3000);
    }

    function showSuccessScreen() {
        document.querySelectorAll('.step-content').forEach(el => el.classList.add('hidden'));
        const successScreen = document.getElementById('success-screen');
        if (successScreen) successScreen.classList.remove('hidden');

        // Update transaction details
        const ref = document.getElementById('transaction-ref');
        const date = document.getElementById('transaction-date');
        const message = document.getElementById('success-message');

        if (ref) ref.textContent = generateTransactionRef();
        if (date) date.textContent = new Date().toLocaleDateString();

        const config = window.elementSdk?.config || localDefaultConfig;
        if (message) message.textContent = config.success_message || localDefaultConfig.success_message;
    }

    function startOver() {
        // Reset all state
        currentStep = 1;
        selectedNetwork = null;
        selectedAmount = 0;
        // Use default phone from config or local default
        const config = window.elementSdk?.config || localDefaultConfig;
        phoneNumber = config.user_phone || localDefaultConfig.user_phone; 
        paymentMethod = 'wallet'; // Reset to default wallet

        // Reset UI
        document.querySelectorAll('.network-card-airtime').forEach(card => {
            card.classList.remove('selected');
        });
        document.querySelectorAll('.amount-btn-airtime').forEach(btn => {
            btn.classList.remove('selected');
        });
        document.querySelectorAll('.payment-method').forEach(el => {
            el.classList.remove('border-purple-500');
            el.classList.add('border-gray-200');
            // Hide checkmarks
            const checkmark = el.querySelector('.text-purple-500');
            if (checkmark) {
                checkmark.style.display = 'none';
            }
        });

        // Reset wallet as default
        const walletPayment = document.getElementById('wallet-payment');
        if (walletPayment) {
            walletPayment.classList.remove('border-gray-200');
            walletPayment.classList.add('border-purple-500');
            const walletCheckmark = walletPayment.querySelector('.text-purple-500');
            if (walletCheckmark) {
                walletCheckmark.style.display = 'block';
            }
        }

        // Clear inputs and set default phone
        const phoneInput = document.getElementById('phone-number');
        if (phoneInput) {
            phoneInput.value = phoneNumber;
        }
        const customAmountInput = document.getElementById('custom-amount');
        if (customAmountInput) {
            customAmountInput.value = '';
        }

        // Go to network selection screen
        goToStep(1);
    }

    function shareReceipt() {
        showCustomMessage('Receipt Shared', 'Transaction receipt has been copied to clipboard', 'success');
    }

    // Event listeners
    function setupEventListeners() {
        // Phone number input formatting
        const phoneInput = document.getElementById('phone-number');
        if (phoneInput) {
            phoneInput.addEventListener('input', function() {
                let value = this.value.replace(/\D/g, '');
                if (value.length > 11) value = value.substring(0, 11);
                this.value = value;
                validateStep2();
            });
        }

        // Custom amount input
        const customAmountInput = document.getElementById('custom-amount');
        if (customAmountInput) {
            customAmountInput.addEventListener('input', function() {
                selectedAmount = 0; // Reset quick selection
                document.querySelectorAll('.amount-btn-airtime').forEach(btn => {
                    btn.classList.remove('selected');
                });
                validateStep2();
            });
        }
    }

    // Element SDK integration
    async function onConfigChange(config) {
        // Update page title
        const pageTitleElement = document.getElementById('page-title');
        if (pageTitleElement) {
            pageTitleElement.textContent = config.page_title || localDefaultConfig.page_title;
        }

        // Update default phone number
        const phoneInput = document.getElementById('phone-number');
        if (phoneInput && config.user_phone) {
            phoneInput.value = config.user_phone || localDefaultConfig.user_phone;
            phoneNumber = phoneInput.value.replace(/\D/g, ''); // Update state
            validateStep2();
        }
    }

    function mapToCapabilities(config) {
        return {
            recolorables: [],
            borderables: [],
            fontEditable: undefined,
            fontSizeable: undefined
        };
    }

    function mapToEditPanelValues(config) {
        return new Map([
            ["page_title", config.page_title || localDefaultConfig.page_title],
            ["user_phone", config.user_phone || localDefaultConfig.user_phone],
            ["success_message", config.success_message || localDefaultConfig.success_message]
        ]);
    }

    // Initialize Element SDK
    if (window.elementSdk) {
        window.elementSdk.init({
            defaultConfig: localDefaultConfig, // Pass the locally scoped config
            onConfigChange,
            mapToCapabilities,
            mapToEditPanelValues
        });
    }

    // Initialize app
    document.addEventListener('DOMContentLoaded', function() {
        setupEventListeners();

        // Start with network selection screen
        goToStep(1);

        // Set default phone number if available
        const config = window.elementSdk?.config || localDefaultConfig;
        const phoneInput = document.getElementById('phone-number');
        if (phoneInput && config.user_phone) {
            phoneInput.value = config.user_phone;
            phoneNumber = config.user_phone.replace(/\D/g, '');
            validateStep2(); // Validate and update summary based on default phone
        }
    });


    // **Export functions to the global scope**
    // This allows HTML attributes like onclick="quickPurchase(100, event)" to work.
    window.quickPurchase = quickPurchase;
    window.goToStep = goToStep;
    window.selectNetwork = selectNetwork;
    window.selectAmount = selectAmount;
    window.selectPaymentMethod = selectPaymentMethod;
    window.processPurchase = processPurchase;
    window.startOver = startOver;
    window.shareReceipt = shareReceipt;

})();






        // Unique namespace to avoid conflicts
        const DataPurchaseApp = (function() {
            'use strict';
            
            // Configuration
            const appConfig = {
                app_title: "Data Purchase Portal",
                quick_purchase_title: "Quick Purchase",
                network_selection_title: "Select Network Provider",
                background_color: "#667eea",
                surface_color: "#ffffff",
                text_color: "#1f2937",
                primary_action_color: "#7c3aed",
                secondary_action_color: "#374151"
            };

            // State management
            let currentStep = 1;
            let selectedNetwork = null;
            let selectedPlan = null;
            let phoneNumber = '';
            let currentDuration = 'hot';

            // Data plans for different networks and durations
            const dataPlans = {
                mtn: {
                    hot: [
                        { id: 'mtn_hot_1', data: '1GB', price: 100, validity: '1 Day', description: 'Hot Deal', badge: 'POPULAR' },
                        { id: 'mtn_hot_2', data: '2GB', price: 180, validity: '2 Days', description: 'Hot Deal', badge: 'SAVE 20%' },
                        { id: 'mtn_hot_3', data: '5GB', price: 400, validity: '7 Days', description: 'Hot Deal', badge: 'BEST VALUE' },
                        { id: 'mtn_hot_4', data: '10GB', price: 750, validity: '14 Days', description: 'Hot Deal', badge: 'LIMITED' },
                        { id: 'mtn_hot_5', data: '20GB', price: 1400, validity: '30 Days', description: 'Hot Deal', badge: 'MEGA DEAL' }
                    ],
                    daily: [
                        { id: 'mtn_daily_1', data: '100MB', price: 25, validity: '1 Day', description: 'Daily Plan' },
                        { id: 'mtn_daily_2', data: '200MB', price: 40, validity: '1 Day', description: 'Daily Plan' },
                        { id: 'mtn_daily_3', data: '500MB', price: 50, validity: '1 Day', description: 'Daily Plan' },
                        { id: 'mtn_daily_4', data: '1GB', price: 100, validity: '1 Day', description: 'Daily Plan' },
                        { id: 'mtn_daily_5', data: '2GB', price: 200, validity: '1 Day', description: 'Daily Plan' },
                        { id: 'mtn_daily_6', data: '3GB', price: 280, validity: '1 Day', description: 'Daily Plan' }
                    ],
                    weekly: [
                        { id: 'mtn_weekly_1', data: '750MB', price: 200, validity: '7 Days', description: 'Weekly Plan' },
                        { id: 'mtn_weekly_2', data: '1.5GB', price: 300, validity: '7 Days', description: 'Weekly Plan' },
                        { id: 'mtn_weekly_3', data: '3GB', price: 500, validity: '7 Days', description: 'Weekly Plan' },
                        { id: 'mtn_weekly_4', data: '6GB', price: 900, validity: '7 Days', description: 'Weekly Plan' },
                        { id: 'mtn_weekly_5', data: '10GB', price: 1400, validity: '7 Days', description: 'Weekly Plan' },
                        { id: 'mtn_weekly_6', data: '15GB', price: 2000, validity: '7 Days', description: 'Weekly Plan' }
                    ],
                    monthly: [
                        { id: 'mtn_monthly_1', data: '2GB', price: 800, validity: '30 Days', description: 'Monthly Plan' },
                        { id: 'mtn_monthly_2', data: '6GB', price: 1500, validity: '30 Days', description: 'Monthly Plan' },
                        { id: 'mtn_monthly_3', data: '12GB', price: 2500, validity: '30 Days', description: 'Monthly Plan' },
                        { id: 'mtn_monthly_4', data: '24GB', price: 4000, validity: '30 Days', description: 'Monthly Plan' },
                        { id: 'mtn_monthly_5', data: '40GB', price: 6000, validity: '30 Days', description: 'Monthly Plan' },
                        { id: 'mtn_monthly_6', data: '75GB', price: 10000, validity: '30 Days', description: 'Monthly Plan' }
                    ]
                },
                glo: {
                    hot: [
                        { id: 'glo_hot_1', data: '1.2GB', price: 120, validity: '1 Day', description: 'Hot Deal', badge: 'POPULAR' },
                        { id: 'glo_hot_2', data: '2.5GB', price: 200, validity: '2 Days', description: 'Hot Deal', badge: 'SAVE 15%' },
                        { id: 'glo_hot_3', data: '6GB', price: 450, validity: '7 Days', description: 'Hot Deal', badge: 'BEST VALUE' },
                        { id: 'glo_hot_4', data: '12GB', price: 800, validity: '14 Days', description: 'Hot Deal', badge: 'LIMITED' },
                        { id: 'glo_hot_5', data: '25GB', price: 1500, validity: '30 Days', description: 'Hot Deal', badge: 'MEGA DEAL' }
                    ],
                    daily: [
                        { id: 'glo_daily_1', data: '150MB', price: 30, validity: '1 Day', description: 'Daily Plan' },
                        { id: 'glo_daily_2', data: '350MB', price: 50, validity: '1 Day', description: 'Daily Plan' },
                        { id: 'glo_daily_3', data: '600MB', price: 60, validity: '1 Day', description: 'Daily Plan' },
                        { id: 'glo_daily_4', data: '1.2GB', price: 120, validity: '1 Day', description: 'Daily Plan' },
                        { id: 'glo_daily_5', data: '2.4GB', price: 240, validity: '1 Day', description: 'Daily Plan' },
                        { id: 'glo_daily_6', data: '3.5GB', price: 320, validity: '1 Day', description: 'Daily Plan' }
                    ],
                    weekly: [
                        { id: 'glo_weekly_1', data: '1GB', price: 250, validity: '7 Days', description: 'Weekly Plan' },
                        { id: 'glo_weekly_2', data: '2GB', price: 350, validity: '7 Days', description: 'Weekly Plan' },
                        { id: 'glo_weekly_3', data: '4GB', price: 600, validity: '7 Days', description: 'Weekly Plan' },
                        { id: 'glo_weekly_4', data: '8GB', price: 1000, validity: '7 Days', description: 'Weekly Plan' },
                        { id: 'glo_weekly_5', data: '12GB', price: 1500, validity: '7 Days', description: 'Weekly Plan' },
                        { id: 'glo_weekly_6', data: '18GB', price: 2200, validity: '7 Days', description: 'Weekly Plan' }
                    ],
                    monthly: [
                        { id: 'glo_monthly_1', data: '3GB', price: 900, validity: '30 Days', description: 'Monthly Plan' },
                        { id: 'glo_monthly_2', data: '7GB', price: 1600, validity: '30 Days', description: 'Monthly Plan' },
                        { id: 'glo_monthly_3', data: '14GB', price: 2700, validity: '30 Days', description: 'Monthly Plan' },
                        { id: 'glo_monthly_4', data: '28GB', price: 4200, validity: '30 Days', description: 'Monthly Plan' },
                        { id: 'glo_monthly_5', data: '50GB', price: 6500, validity: '30 Days', description: 'Monthly Plan' },
                        { id: 'glo_monthly_6', data: '93GB', price: 11000, validity: '30 Days', description: 'Monthly Plan' }
                    ]
                },
                airtel: {
                    hot: [
                        { id: 'airtel_hot_1', data: '1.5GB', price: 150, validity: '1 Day', description: 'Hot Deal', badge: 'POPULAR' },
                        { id: 'airtel_hot_2', data: '3GB', price: 250, validity: '2 Days', description: 'Hot Deal', badge: 'SAVE 25%' },
                        { id: 'airtel_hot_3', data: '7GB', price: 500, validity: '7 Days', description: 'Hot Deal', badge: 'BEST VALUE' },
                        { id: 'airtel_hot_4', data: '15GB', price: 900, validity: '14 Days', description: 'Hot Deal', badge: 'LIMITED' },
                        { id: 'airtel_hot_5', data: '30GB', price: 1600, validity: '30 Days', description: 'Hot Deal', badge: 'MEGA DEAL' }
                    ],
                    daily: [
                        { id: 'airtel_daily_1', data: '200MB', price: 35, validity: '1 Day', description: 'Daily Plan' },
                        { id: 'airtel_daily_2', data: '500MB', price: 70, validity: '1 Day', description: 'Daily Plan' },
                        { id: 'airtel_daily_3', data: '750MB', price: 75, validity: '1 Day', description: 'Daily Plan' },
                        { id: 'airtel_daily_4', data: '1.5GB', price: 150, validity: '1 Day', description: 'Daily Plan' },
                        { id: 'airtel_daily_5', data: '3GB', price: 300, validity: '1 Day', description: 'Daily Plan' },
                        { id: 'airtel_daily_6', data: '4GB', price: 380, validity: '1 Day', description: 'Daily Plan' }
                    ],
                    weekly: [
                        { id: 'airtel_weekly_1', data: '1.2GB', price: 300, validity: '7 Days', description: 'Weekly Plan' },
                        { id: 'airtel_weekly_2', data: '2.5GB', price: 400, validity: '7 Days', description: 'Weekly Plan' },
                        { id: 'airtel_weekly_3', data: '5GB', price: 700, validity: '7 Days', description: 'Weekly Plan' },
                        { id: 'airtel_weekly_4', data: '10GB', price: 1200, validity: '7 Days', description: 'Weekly Plan' },
                        { id: 'airtel_weekly_5', data: '15GB', price: 1800, validity: '7 Days', description: 'Weekly Plan' },
                        { id: 'airtel_weekly_6', data: '20GB', price: 2400, validity: '7 Days', description: 'Weekly Plan' }
                    ],
                    monthly: [
                        { id: 'airtel_monthly_1', data: '4GB', price: 1000, validity: '30 Days', description: 'Monthly Plan' },
                        { id: 'airtel_monthly_2', data: '8GB', price: 1800, validity: '30 Days', description: 'Monthly Plan' },
                        { id: 'airtel_monthly_3', data: '16GB', price: 3000, validity: '30 Days', description: 'Monthly Plan' },
                        { id: 'airtel_monthly_4', data: '32GB', price: 4800, validity: '30 Days', description: 'Monthly Plan' },
                        { id: 'airtel_monthly_5', data: '60GB', price: 7500, validity: '30 Days', description: 'Monthly Plan' },
                        { id: 'airtel_monthly_6', data: '100GB', price: 12000, validity: '30 Days', description: 'Monthly Plan' }
                    ]
                },
                '9mobile': {
                    hot: [
                        { id: '9mobile_hot_1', data: '1.2GB', price: 120, validity: '1 Day', description: 'Hot Deal', badge: 'POPULAR' },
                        { id: '9mobile_hot_2', data: '2.4GB', price: 220, validity: '2 Days', description: 'Hot Deal', badge: 'SAVE 18%' },
                        { id: '9mobile_hot_3', data: '6GB', price: 480, validity: '7 Days', description: 'Hot Deal', badge: 'BEST VALUE' },
                        { id: '9mobile_hot_4', data: '11GB', price: 850, validity: '14 Days', description: 'Hot Deal', badge: 'LIMITED' },
                        { id: '9mobile_hot_5', data: '22GB', price: 1550, validity: '30 Days', description: 'Hot Deal', badge: 'MEGA DEAL' }
                    ],
                    daily: [
                        { id: '9mobile_daily_1', data: '100MB', price: 25, validity: '1 Day', description: 'Daily Plan' },
                        { id: '9mobile_daily_2', data: '300MB', price: 45, validity: '1 Day', description: 'Daily Plan' },
                        { id: '9mobile_daily_3', data: '600MB', price: 60, validity: '1 Day', description: 'Daily Plan' },
                        { id: '9mobile_daily_4', data: '1.2GB', price: 120, validity: '1 Day', description: 'Daily Plan' },
                        { id: '9mobile_daily_5', data: '2.4GB', price: 240, validity: '1 Day', description: 'Daily Plan' },
                        { id: '9mobile_daily_6', data: '3.2GB', price: 300, validity: '1 Day', description: 'Daily Plan' }
                    ],
                    weekly: [
                        { id: '9mobile_weekly_1', data: '900MB', price: 280, validity: '7 Days', description: 'Weekly Plan' },
                        { id: '9mobile_weekly_2', data: '2GB', price: 350, validity: '7 Days', description: 'Weekly Plan' },
                        { id: '9mobile_weekly_3', data: '4GB', price: 600, validity: '7 Days', description: 'Weekly Plan' },
                        { id: '9mobile_weekly_4', data: '8GB', price: 1000, validity: '7 Days', description: 'Weekly Plan' },
                        { id: '9mobile_weekly_5', data: '13GB', price: 1600, validity: '7 Days', description: 'Weekly Plan' },
                        { id: '9mobile_weekly_6', data: '17GB', price: 2100, validity: '7 Days', description: 'Weekly Plan' }
                    ],
                    monthly: [
                        { id: '9mobile_monthly_1', data: '2.5GB', price: 850, validity: '30 Days', description: 'Monthly Plan' },
                        { id: '9mobile_monthly_2', data: '7GB', price: 1700, validity: '30 Days', description: 'Monthly Plan' },
                        { id: '9mobile_monthly_3', data: '14GB', price: 2800, validity: '30 Days', description: 'Monthly Plan' },
                        { id: '9mobile_monthly_4', data: '28GB', price: 4500, validity: '30 Days', description: 'Monthly Plan' },
                        { id: '9mobile_monthly_5', data: '45GB', price: 6800, validity: '30 Days', description: 'Monthly Plan' },
                        { id: '9mobile_monthly_6', data: '80GB', price: 11500, validity: '30 Days', description: 'Monthly Plan' }
                    ]
                }
            };

            // DOM elements
            const elements = {
                step1: document.getElementById('dataPurchase__step1'),
                step2: document.getElementById('dataPurchase__step2'),
                step3: document.getElementById('dataPurchase__step3'),
                progressBar1: document.getElementById('dataPurchase__progressBar1'),
                progressBar2: document.getElementById('dataPurchase__progressBar2'),
                step1Indicator: document.getElementById('dataPurchase__step1Indicator'),
                step2Indicator: document.getElementById('dataPurchase__step2Indicator'),
                step3Indicator: document.getElementById('dataPurchase__step3Indicator'),
                phoneNumber: document.getElementById('dataPurchase__phoneNumber'),
                plansContainer: document.getElementById('dataPurchase__plansContainer'),
                continueSection: document.getElementById('dataPurchase__continueSection'),
                continueBtn: document.getElementById('dataPurchase__continueBtn'),
                backBtn1: document.getElementById('dataPurchase__backBtn1'),
                backBtn2: document.getElementById('dataPurchase__backBtn2'),
                purchaseBtn: document.getElementById('dataPurchase__purchaseBtn'),
                loadingModal: document.getElementById('dataPurchase__loadingModal'),
                successModal: document.getElementById('dataPurchase__successModal'),
                receiptModal: document.getElementById('dataPurchase__receiptModal'),
                doneBtn: document.getElementById('dataPurchase__doneBtn'),
                viewReceiptBtn: document.getElementById('dataPurchase__viewReceiptBtn'),
                shareReceiptBtn: document.getElementById('dataPurchase__shareReceiptBtn'),
                closeReceiptBtn: document.getElementById('dataPurchase__closeReceiptBtn')
            };

            // Initialize the app
            function init() {
                bindEvents();
                updateProgressBar();
                loadPlans();
            }

            // Bind event listeners
            function bindEvents() {
                // Network selection
                document.querySelectorAll('.dataPurchase__network-card').forEach(card => {
                    card.addEventListener('click', function() {
                        selectNetwork(this.dataset.network);
                    });
                });

                // Saved numbers functionality
                document.querySelectorAll('.dataPurchase__saved-number').forEach(card => {
                    card.addEventListener('click', function() {
                        const number = this.dataset.number;
                        const network = this.dataset.network;
                        const name = this.dataset.name;
                        
                        // Pre-fill the phone number and select network
                        selectedNetwork = network;
                        phoneNumber = number;
                        
                        // Go directly to step 2 with pre-filled data
                        goToStep(2);
                        elements.phoneNumber.value = number;
                        loadPlans();
                        
                        showToast(`Selected ${name}'s number (${network.toUpperCase()})`);
                    });
                });



                // Duration tabs
                document.querySelectorAll('.dataPurchase__duration-tab').forEach(tab => {
                    tab.addEventListener('click', function() {
                        selectDuration(this.dataset.duration);
                    });
                });

                // Navigation buttons
                elements.continueBtn.addEventListener('click', goToPayment);
                elements.backBtn1.addEventListener('click', () => goToStep(1));
                elements.backBtn2.addEventListener('click', () => goToStep(2));
                elements.purchaseBtn.addEventListener('click', processPurchase);
                elements.doneBtn.addEventListener('click', resetApp);
                elements.viewReceiptBtn.addEventListener('click', showReceipt);
                elements.shareReceiptBtn.addEventListener('click', shareReceipt);
                elements.closeReceiptBtn.addEventListener('click', hideReceipt);

                // Phone number input
                elements.phoneNumber.addEventListener('input', validateForm);
            }

            // Select network
            function selectNetwork(network) {
                selectedNetwork = network;
                
                // Update UI
                document.querySelectorAll('.dataPurchase__network-card').forEach(card => {
                    card.classList.remove('dataPurchase__network-card--selected');
                });
                document.querySelector(`[data-network="${network}"]`).classList.add('dataPurchase__network-card--selected');
                
                // Go to step 2
                setTimeout(() => {
                    goToStep(2);
                    loadPlans();
                }, 300);
            }

            // Select duration
            function selectDuration(duration) {
                currentDuration = duration;
                
                // Update tabs
                document.querySelectorAll('.dataPurchase__duration-tab').forEach(tab => {
                    tab.classList.remove('bg-gradient-to-r', 'from-orange-600', 'to-orange-700', 'text-white', 'shadow-lg', 'dataPurchase__glow');
                    tab.classList.add( 'text-gray-200', 'hover:border-orange-300');
                });
                
                const selectedTab = document.querySelector(`[data-duration="${duration}"]`);
                selectedTab.classList.remove('bg-white', 'border-2', 'border-gray-200', 'text-gray-700', 'hover:border-orange-300');
                selectedTab.classList.add('bg-gradient-to-r', 'from-orange-600', 'to-orange-700', 'text-white', 'shadow-lg', 'dataPurchase__glow');
                
                loadPlans();
            }
            

            // Load plans based on selected network and duration
            function loadPlans() {
                if (!selectedNetwork) return;
                
                const plans = dataPlans[selectedNetwork][currentDuration];
                elements.plansContainer.innerHTML = '';
                
                plans.forEach(plan => {
                    const planCard = document.createElement('div');
                    planCard.className = 'dataPurchase__plan-card lightdark rounded-xl p-6 pt-8 cursor-pointer relative';
                    planCard.dataset.planId = plan.id;
                    
                    const badgeHtml = plan.badge ? `<div class="dataPurchase__badge absolute text-[12px] md:text-2x1 top-2 left-2">${plan.badge}</div>` : '';
                    
                    planCard.innerHTML = `
                        ${badgeHtml}
                        <div class="text-center relative z-10">
                            <div class="text-[20px] md:text-3x1 font-bold text-orange-600">${plan.data}</div>
                               <div class="text-[20px] md:text-2x1 font-bold text-gray-200 mb-2">₦${plan.price.toLocaleString()}</div>
                                <div class="text-sm text-gray-200 mb-3 flex items-center justify-center">
                                    <svg class="w-4 h-4 mr-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
                                    </svg>
                                    ${plan.validity}
                                </div>
                           
                        </div>
                    `;
                    
                    planCard.addEventListener('click', function() {
                        selectPlan(plan);
                    });
                    
                    elements.plansContainer.appendChild(planCard);
                });
            }

            // Select plan
            function selectPlan(plan) {
                selectedPlan = plan;
                
                // Update UI
                document.querySelectorAll('.dataPurchase__plan-card').forEach(card => {
                    card.classList.remove('dataPurchase__plan-card--selected');
                });
                document.querySelector(`[data-plan-id="${plan.id}"]`).classList.add('dataPurchase__plan-card--selected');
                
                // Show continue button and scroll to it
                elements.continueSection.style.display = 'block';
                elements.continueSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                validateForm();
            }

            // Validate form
            function validateForm() {
                phoneNumber = elements.phoneNumber.value;
                const isValid = phoneNumber.length >= 10 && selectedPlan;
                elements.continueBtn.disabled = !isValid;
                elements.continueBtn.style.opacity = isValid ? '1' : '0.5';
            }

            // Go to payment step
            function goToPayment() {
                if (!selectedPlan || !phoneNumber) return;
                
                updateSummary();
                goToStep(3);
            }

            // Update purchase summary
            function updateSummary() {
                const networkName = selectedNetwork.toUpperCase();
                const currentDate = new Date().toLocaleDateString();
                
                document.getElementById('dataPurchase__summaryNetwork').textContent = networkName;
                document.getElementById('dataPurchase__summaryNumber').textContent = phoneNumber;
                document.getElementById('dataPurchase__summaryPlan').textContent = selectedPlan.data;
                document.getElementById('dataPurchase__summaryValidity').textContent = selectedPlan.validity;
                document.getElementById('dataPurchase__summaryDate').textContent = currentDate;
                document.getElementById('dataPurchase__summaryTotal').textContent = `₦${selectedPlan.price}`;
            }

            // Process purchase
            function processPurchase() {
                // Show loading modal
                elements.loadingModal.style.display = 'flex';
                
                // Simulate processing time
                setTimeout(() => {
                    elements.loadingModal.style.display = 'none';
                    showSuccessModal();
                }, 3000);
            }

            // Show success modal
            function showSuccessModal() {
                const transactionId = 'TXN' + Date.now();
                const currentDate = new Date().toLocaleString();
                
                document.getElementById('dataPurchase__transactionId').textContent = transactionId;
                document.getElementById('dataPurchase__receiptNetwork').textContent = selectedNetwork.toUpperCase();
                document.getElementById('dataPurchase__receiptAmount').textContent = `₦${selectedPlan.price}`;
                document.getElementById('dataPurchase__receiptDate').textContent = currentDate;
                
                elements.successModal.style.display = 'flex';
            }

            // Show receipt
            function showReceipt() {
                const transactionId = document.getElementById('dataPurchase__transactionId').textContent;
                const currentDate = new Date().toLocaleString();
                
                const receiptHTML = `
                    <div class="space-y-3">
                        <div class="text-center border-b pb-3 mb-3">
                            <div class="font-bold">DATA PURCHASE RECEIPT</div>
                            <div class="text-xs text-gray-200">${currentDate}</div>
                        </div>
                        <div class="flex justify-between">
                            <span>Transaction ID:</span>
                            <span class="font-mono text-xs">${transactionId}</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Network Provider:</span>
                            <span>${selectedNetwork.toUpperCase()}</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Phone Number:</span>
                            <span>${phoneNumber}</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Data Plan:</span>
                            <span>${selectedPlan.data}</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Validity:</span>
                            <span>${selectedPlan.validity}</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Plan Type:</span>
                            <span>${selectedPlan.description}</span>
                        </div>
                        <div class="border-t pt-3 mt-3">
                            <div class="flex justify-between font-bold">
                                <span>Total Amount:</span>
                                <span>₦${selectedPlan.price}</span>
                            </div>
                        </div>
                        <div class="text-center text-xs text-gray-300 mt-4">
                            Thank you for using our service!
                        </div>
                    </div>
                `;
                
                document.getElementById('dataPurchase__fullReceipt').innerHTML = receiptHTML;
                elements.receiptModal.style.display = 'flex';
            }

            // Hide receipt
            function hideReceipt() {
                elements.receiptModal.style.display = 'none';
            }

            // Share receipt
            function shareReceipt() {
                const receiptText = `
DATA PURCHASE RECEIPT
Transaction ID: ${document.getElementById('dataPurchase__transactionId').textContent}
Network: ${selectedNetwork.toUpperCase()}
Phone: ${phoneNumber}
Data: ${selectedPlan.data}
Amount: ₦${selectedPlan.price}
Date: ${new Date().toLocaleString()}
                `.trim();
                
                if (navigator.share) {
                    navigator.share({
                        title: 'Data Purchase Receipt',
                        text: receiptText
                    });
                } else {
                    // Fallback: copy to clipboard
                    navigator.clipboard.writeText(receiptText).then(() => {
                        showToast('Receipt copied to clipboard!');
                    });
                }
            }

            // Go to specific step
            function goToStep(step) {
                currentStep = step;
                
                // Hide all steps
                elements.step1.classList.remove('dataPurchase__step--active');
                elements.step2.classList.remove('dataPurchase__step--active');
                elements.step3.classList.remove('dataPurchase__step--active');
                
                elements.step1.classList.add('dataPurchase__step--hidden');
                elements.step2.classList.add('dataPurchase__step--hidden');
                elements.step3.classList.add('dataPurchase__step--hidden');
                
                // Show current step
                const currentStepElement = document.getElementById(`dataPurchase__step${step}`);
                currentStepElement.classList.remove('dataPurchase__step--hidden');
                currentStepElement.classList.add('dataPurchase__step--active');
                
                updateProgressBar();
                updateStepIndicators();
            }

            // Update progress bar
            function updateProgressBar() {
                // Reset all progress bars
                elements.progressBar1.style.width = '0%';
                elements.progressBar2.style.width = '0%';
                
                // Update progress based on current step
                if (currentStep >= 2) {
                    elements.progressBar1.style.width = '100%';
                }
                if (currentStep >= 3) {
                    elements.progressBar2.style.width = '100%';
                }
            }

            // Update step indicators
            function updateStepIndicators() {
                const indicators = [elements.step1Indicator, elements.step2Indicator, elements.step3Indicator];
                
                indicators.forEach((indicator, index) => {
                    const stepNumber = index + 1;
                    const stepContainer = indicator.parentElement;
                    const stepLabel = stepContainer.querySelector('span');
                    
                    if (stepNumber <= currentStep) {
                        // Active step styling
                        indicator.classList.remove('bg-gray-300', 'text-gray-500');
                        indicator.classList.add('bg-orange-500', 'text-white');
                        
                        // Update step label
                        if (stepLabel) {
                            stepLabel.classList.remove('text-gray-500');
                            stepLabel.classList.add('text-gray-100');
                        }
                    } else {
                        // Inactive step styling
                        indicator.classList.remove('bg-orange-500', 'text-white');
                        indicator.classList.add('bg-gray-300', 'text-gray-500');
                        
                        // Update step label
                        if (stepLabel) {
                            stepLabel.classList.remove('text-gray-100');
                            stepLabel.classList.add('text-gray-500');
                        }
                    }
                });
            }

            // Reset app to initial state
            function resetApp() {
                currentStep = 1;
                selectedNetwork = null;
                selectedPlan = null;
                phoneNumber = '';
                currentDuration = 'hot';
                
                elements.phoneNumber.value = '';
                elements.continueSection.style.display = 'none';
                elements.successModal.style.display = 'none';
                
                // Reset network selection
                document.querySelectorAll('.dataPurchase__network-card').forEach(card => {
                    card.classList.remove('dataPurchase__network-card--selected');
                });
                
                // Reset duration tabs
                document.querySelectorAll('.dataPurchase__duration-tab').forEach(tab => {
                    tab.classList.remove('bg-gradient-to-r', 'from-purple-600', 'to-purple-700', 'text-white', 'shadow-lg', 'dataPurchase__glow');
                    tab.classList.add('bg-white', 'border-2', 'border-gray-200', 'text-gray-700', 'hover:border-purple-300');
                });
                const hotTab = document.querySelector('[data-duration="hot"]');
                hotTab.classList.remove('bg-white', 'border-2', 'border-gray-200', 'text-gray-700', 'hover:border-purple-300');
                hotTab.classList.add('bg-gradient-to-r', 'from-purple-600', 'to-purple-700', 'text-white', 'shadow-lg', 'dataPurchase__glow');
                
                goToStep(1);
            }

            // Show toast notification
            function showToast(message) {
                const toast = document.createElement('div');
                toast.className = 'fixed top-4 right-4 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
                toast.textContent = message;
                
                document.body.appendChild(toast);
                
                setTimeout(() => {
                    toast.style.transform = 'translateX(0)';
                }, 100);
                
                setTimeout(() => {
                    toast.style.transform = 'translateX(100%)';
                    setTimeout(() => {
                        document.body.removeChild(toast);
                    }, 300);
                }, 3000);
            }


            // Element SDK implementation
            const element = {
                defaultConfig: appConfig,
                
                onConfigChange: async (config) => {
                    // Update text content
                    const appTitle = document.getElementById('dataPurchase__appTitle');
                    const quickPurchaseTitle = document.getElementById('dataPurchase__quickPurchaseTitle');
                    const networkSelectionTitle = document.getElementById('dataPurchase__networkSelectionTitle');

                    if (appTitle) appTitle.textContent = config.app_title || appConfig.app_title;
                    if (quickPurchaseTitle) quickPurchaseTitle.textContent = config.quick_purchase_title || appConfig.quick_purchase_title;
                    if (networkSelectionTitle) networkSelectionTitle.textContent = config.network_selection_title || appConfig.network_selection_title;

                    // Update colors
                    const backgroundColor = config.background_color || appConfig.background_color;
                    const surfaceColor = config.surface_color || appConfig.surface_color;
                    const textColor = config.text_color || appConfig.text_color;
                    const primaryActionColor = config.primary_action_color || appConfig.primary_action_color;
                    const secondaryActionColor = config.secondary_action_color || appConfig.secondary_action_color;

                    // Apply background gradient
                    const gradientBg = document.querySelector('.dataPurchase__gradient');
                    if (gradientBg) {
                        gradientBg.style.background = `linear-gradient(135deg, ${backgroundColor} 0%, ${primaryActionColor} 100%)`;
                    }

                    // Apply surface color to cards
                    const cards = document.querySelectorAll('.dataPurchase__card');
                    cards.forEach(card => {
                        card.style.backgroundColor = surfaceColor;
                    });

                    // Apply text color
                    const textElements = document.querySelectorAll('.text-gray-800, .text-gray-700, .text-gray-600');
                    textElements.forEach(element => {
                        element.style.color = textColor;
                    });

                    // Apply primary action color to buttons
                    const primaryButtons = document.querySelectorAll('.bg-purple-600');
                    primaryButtons.forEach(button => {
                        button.style.backgroundColor = primaryActionColor;
                    });

                    // Apply secondary action color
                    const secondaryButtons = document.querySelectorAll('.bg-gray-200');
                    secondaryButtons.forEach(button => {
                        button.style.backgroundColor = secondaryActionColor;
                    });
                },

                mapToCapabilities: (config) => ({
                    recolorables: [
                        {
                            get: () => config.background_color || appConfig.background_color,
                            set: (value) => {
                                if (window.elementSdk) {
                                    window.elementSdk.setConfig({ background_color: value });
                                }
                            }
                        },
                        {
                            get: () => config.surface_color || appConfig.surface_color,
                            set: (value) => {
                                if (window.elementSdk) {
                                    window.elementSdk.setConfig({ surface_color: value });
                                }
                            }
                        },
                        {
                            get: () => config.text_color || appConfig.text_color,
                            set: (value) => {
                                if (window.elementSdk) {
                                    window.elementSdk.setConfig({ text_color: value });
                                }
                            }
                        },
                        {
                            get: () => config.primary_action_color || appConfig.primary_action_color,
                            set: (value) => {
                                if (window.elementSdk) {
                                    window.elementSdk.setConfig({ primary_action_color: value });
                                }
                            }
                        },
                        {
                            get: () => config.secondary_action_color || appConfig.secondary_action_color,
                            set: (value) => {
                                if (window.elementSdk) {
                                    window.elementSdk.setConfig({ secondary_action_color: value });
                                }
                            }
                        }
                    ],
                    borderables: [],
                    fontEditable: undefined,
                    fontSizeable: undefined
                }),

                mapToEditPanelValues: (config) => new Map([
                    ["app_title", config.app_title || appConfig.app_title],
                    ["quick_purchase_title", config.quick_purchase_title || appConfig.quick_purchase_title],
                    ["network_selection_title", config.network_selection_title || appConfig.network_selection_title]
                ])
            };

            // Initialize Element SDK
            if (window.elementSdk) {
                window.elementSdk.init(element);
            }

            // Public API
            return {
                init: init
            };
        })();

        // Initialize the app when DOM is ready
        document.addEventListener('DOMContentLoaded', function() {
            DataPurchaseApp.init();
        });




        // Get a reference to the footer element
const footer = document.getElementById('mobileFooter');

// A variable to store the last known scroll position
let lastScrollTop = 0;

// The scroll handler function
window.addEventListener('scroll', function() {
    // Current scroll position from the top of the page
    let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    // Determine the scroll direction
    if (currentScroll > lastScrollTop) {
        // SCROLLING DOWN: User is going down the page, HIDE the footer
        // But only hide it if they've scrolled past a certain point (e.g., 50px)
        if (currentScroll > 50) { 
            footer.classList.add('hidden-footer');
        }
    } else {
        // SCROLLING UP: User is going up the page, SHOW the footer
        footer.classList.remove('hidden-footer');
    }

    // Update the lastScrollTop for the next scroll event
    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // Prevents negative values
}, false);













 const __app_id = 'default-app-id'; // Fallback for Canvas environment variable
        const __firebase_config = '{}'; // Fallback for Canvas environment variable

        // --- Mock Data: Updated with specific fields for detailed views ---
        const mockTransactions = [
            // Money Transfer (P2P Transfer) - Debit
            { id: 1, name: "Transfer to Jane D.", amount: -500.00, type: "Debit", date: "2025-11-01", category: "P2P Transfer", icon: "user-group", recipientName: "Jane Doe", recipientBank: "Zenith Bank" },
            // TV Subscription (Subscription)
            { id: 2, name: "TV Subscription (DSTV)", amount: -15.00, type: "Debit", date: "2025-11-01", category: "Subscription", icon: "tv", biller: "DStv", plan: "Premium Package" },
            // Airtime Top-up (Mobile Services)
            { id: 3, name: "Airtime Top-up (Glo)", amount: -5.00, type: "Debit", date: "2025-11-01", category: "Mobile Services", subtype: "Airtime", icon: "mobile-screen-button", number: "0803 123 4567", network: "Globacom" },
            // Electricity Bill (Bills & Utilities)
            { id: 4, name: "Electricity Bill (PHCN)", amount: -85.75, type: "Debit", date: "2025-10-31", category: "Bills & Utilities", icon: "bolt", biller: "PHCN", meterNumber: "12345678901" },
            // Income (General)
            { id: 5, name: "Monthly Paycheck", amount: 3200.00, type: "Credit", date: "2025-10-31", category: "Income", icon: "money-bill-transfer" },
            // Money Transfer (P2P Transfer) - Credit
            { id: 6, name: "Transfer from John M.", amount: 150.00, type: "Credit", date: "2025-10-30", category: "P2P Transfer", icon: "user-group", senderName: "John Mark", senderBank: "First Bank" },
            // Data Purchase (Mobile Services)
            { id: 7, name: "Mobile Data Purchase", amount: -10.00, type: "Debit", date: "2025-10-30", category: "Mobile Services", subtype: "Data", icon: "wifi", number: "0909 876 5432", dataPlan: "5GB Monthly" },
            // Water Bill (Bills & Utilities) - Generic Bill
            { id: 8, name: "Water Bill Payment", amount: -25.50, type: "Debit", date: "2025-10-29", category: "Bills & Utilities", icon: "water", biller: "Lagos Water Corp", reference: "WTR-987654" },
        ];

        // --- Helper Functions ---

        /**
         * Formats a number as US currency.
         * @param {number} amount
         * @returns {string}
         */
        const formatCurrency = (amount) => {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
            }).format(amount);
        };

        /**
         * Formats the date string into a readable format, e.g., "October 31, 2025" or "Today".
         * @param {string} dateString
         * @returns {string}
         */
        const formatDate = (dateString) => {
            const date = new Date(dateString);
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);

            const isSameDay = (d1, d2) => d1.toDateString() === d2.toDateString();

            if (isSameDay(date, today)) return "Today";
            if (isSameDay(date, yesterday)) return "Yesterday";

            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        };

        /**
         * Groups transactions by their formatted date.
         * @param {Array<Object>} transactions
         * @returns {Object<string, Array<Object>>}
         */
        const groupTransactionsByDate = (transactions) => {
            return transactions.reduce((groups, transaction) => {
                const dateKey = formatDate(transaction.date);
                if (!groups[dateKey]) {
                    groups[dateKey] = [];
                }
                groups[dateKey].push(transaction);
                return groups;
            }, {});
        };
        
        /**
         * Generates category-specific detail HTML for the slide-down panel.
         * Fields use flex justify-between for alignment.
         * @param {Object} transaction
         * @returns {string}
         */
        const generateDetailContent = (transaction) => {
            let details = '';

            // Common Details
            details += `
                <div class="flex justify-between">
                    <span class="font-semibold text-slate-400">Date:</span> 
                    <span class="text-white">${new Date(transaction.date).toLocaleDateString()}</span>
                </div>
                <div class="flex justify-between">
                    <span class="font-semibold text-slate-400">Transaction ID:</span> 
                    <span class="text-white">TRX-${transaction.id}${Math.floor(Math.random() * 1000)}</span>
                </div>
            `;
            
            // Category-Specific Details
            switch (transaction.category) {
                case "P2P Transfer":
                    if (transaction.type === "Debit") { // Sent
                        details += `
                            <div class="flex justify-between">
                                <span class="font-semibold text-slate-400">Recipient Name:</span> 
                                <span class="text-white">${transaction.recipientName || 'N/A'}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="font-semibold text-slate-400">Recipient Bank:</span> 
                                <span class="text-white">${transaction.recipientBank || 'N/A'}</span>
                            </div>
                        `;
                    } else { // Received
                        details += `
                            <div class="flex justify-between">
                                <span class="font-semibold text-slate-400">Sender Name:</span> 
                                <span class="text-white">${transaction.senderName || 'N/A'}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="font-semibold text-slate-400">Sender Bank:</span> 
                                <span class="text-white">${transaction.senderBank || 'N/A'}</span>
                            </div>
                        `;
                    }
                    break;

                case "Subscription": // Covers TV Sub
                    details += `
                        <div class="flex justify-between">
                            <span class="font-semibold text-slate-400">Biller:</span> 
                            <span class="text-white">${transaction.biller || 'N/A'}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="font-semibold text-slate-400">Subscription Plan:</span> 
                            <span class="text-white">${transaction.plan || 'N/A'}</span>
                        </div>
                    `;
                    break;
                
                case "Mobile Services":
                    details += `
                        <div class="flex justify-between">
                            <span class="font-semibold text-slate-400">Network:</span> 
                            <span class="text-white">${transaction.network || 'N/A'}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="font-semibold text-slate-400">Phone Number:</span> 
                            <span class="text-white">${transaction.number || 'N/A'}</span>
                        </div>
                    `;
                    if (transaction.subtype === "Data") {
                         details += `
                            <div class="flex justify-between">
                                <span class="font-semibold text-slate-400">Data Plan:</span> 
                                <span class="text-white">${transaction.dataPlan || 'N/A'}</span>
                            </div>
                        `;
                    }
                    break;

                case "Bills & Utilities":
                    if (transaction.name.includes("Electricity")) {
                        details += `
                            <div class="flex justify-between">
                                <span class="font-semibold text-slate-400">Biller:</span> 
                                <span class="text-white">${transaction.biller || 'N/A'}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="font-semibold text-slate-400">Meter Number:</span> 
                                <span class="text-white">${transaction.meterNumber || 'N/A'}</span>
                            </div>
                        `;
                    } else { // Generic Bill (like Water)
                        details += `
                            <div class="flex justify-between">
                                <span class="font-semibold text-slate-400">Biller:</span> 
                                <span class="text-white">${transaction.biller || 'N/A'}</span>
                            </div>
                        `;
                    }
                    break;
                
                // Fallback for Income or other unclassified items
                default:
                    details += `
                        <div class="flex justify-between">
                            <span class="font-semibold text-slate-400">Type:</span> 
                            <span class="text-white">${transaction.type}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="font-semibold text-slate-400">Category:</span> 
                            <span class="text-white">${transaction.category}</span>
                        </div>
                    `;
            }

            return details;
        };

        /**
         * Creates the HTML for a single transaction item, including the hidden details panel.
         * @param {Object} transaction
         * @returns {string}
         */
        const createTransactionItem = (transaction) => {
            const isDebit = transaction.type === "Debit";
            const amountColor = isDebit ? 'text-red-400' : 'text-emerald-400';
            const sign = isDebit ? '-' : '+';
            const iconClass = `fa-solid fa-${transaction.icon || 'circle-question'}`;

            const detailContent = generateDetailContent(transaction); // Call the new function

            return `
                <div id="transaction-block-${transaction.id}" class="transaction-block">
                    <!-- Main Card -->
                    <div class="transaction-card flex items-center justify-between p-4 bg-slate-700/70 rounded-xl shadow-lg hover:bg-slate-700 transition-all duration-200" onclick="toggleTransactionDetails(${transaction.id})">
                        <!-- Icon and Name -->
                        <div class="flex items-center space-x-4 flex-grow min-w-0">
                            <div class="w-10 h-10 flex items-center justify-center rounded-full ${isDebit ? 'bg-red-900/50' : 'bg-emerald-900/50'} text-white text-lg flex-shrink-0">
                                <i class="${iconClass}"></i>
                            </div>
                            <div class="flex-grow min-w-0">
                                <p class="text-white font-semibold truncate">${transaction.name}</p>
                                <p class="text-xs text-slate-400">${transaction.category}</p>
                            </div>
                        </div>

                        <!-- Amount -->
                        <div class="text-right flex-shrink-0 ml-4">
                            <p class="font-bold text-lg ${amountColor}">
                                ${sign}${formatCurrency(Math.abs(transaction.amount)).replace('$', '$ ')}
                            </p>
                        </div>
                    </div>
                    
                    <!-- Details Panel (Starts Hidden and slides down) -->
                    <div id="transaction-details-${transaction.id}" class="details-panel relative z-0 bg-slate-800 rounded-b-xl">
                        <div class="p-4 text-sm text-slate-300 space-y-2">
                            ${detailContent}
                            <div class="pt-3 border-t border-slate-700/50">
                                <button class="w-full p-2 text-center bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors">
                                    View Receipt
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        };

        // --- Main Rendering Logic ---

        const renderTransactions = () => {
            const listContainer = document.getElementById('transactions-list');
            listContainer.innerHTML = ''; // Clear loading message

            const grouped = groupTransactionsByDate(mockTransactions.sort((a, b) => new Date(b.date) - new Date(a.date)));

            let html = '';

            for (const date in grouped) {
                // Date Group Header
                html += `
                    <div class="py-2 mt-4">
                        <h2 class="text-xl font-bold text-slate-300 pb-2">${date}</h2>
                    </div>
                    <div class="space-y-3">
                `;

                // Transactions for that date
                grouped[date].forEach(transaction => {
                    html += createTransactionItem(transaction);
                });

                html += `</div>`;
            }

            if (html === '') {
                listContainer.innerHTML = `
                    <div class="text-white text-center p-12 bg-slate-800 rounded-xl shadow-2xl">
                        <i class="fa-regular fa-folder-open text-4xl mb-4 text-blue-400"></i>
                        <p class="text-xl font-semibold">No Recent Transactions Found</p>
                        <p class="text-slate-400 mt-1">It looks like your activity log is empty.</p>
                    </div>
                `;
            } else {
                listContainer.innerHTML = html;
            }
        };

        /**
         * Toggles the visibility and slide effect of the transaction details panel.
         * This function replaces the original showTransactionDetail modal logic.
         * @param {number} id
         */
        const toggleTransactionDetails = (id) => {
            const detailPanel = document.getElementById(`transaction-details-${id}`);
            const transactionBlock = document.getElementById(`transaction-block-${id}`);
            if (!detailPanel || !transactionBlock) return;

            const mainCard = transactionBlock.querySelector('.transaction-card');
            const isOpen = detailPanel.classList.contains('open');
            
            // 1. Close all other open panels (for clean UX)
            document.querySelectorAll('.details-panel.open').forEach(panel => {
                if (panel.id !== `transaction-details-${id}`) {
                    panel.classList.remove('open');
                    const cardToClose = panel.closest('.transaction-block').querySelector('.transaction-card');
                    // Restore full rounding on closed cards
                    cardToClose.classList.add('rounded-xl');
                    cardToClose.classList.remove('rounded-t-xl', 'rounded-b-none');
                }
            });

            // 2. Toggle the current panel
            if (!isOpen) {
                // Open the panel
                detailPanel.classList.add('open');
                // Adjust card rounding to merge with the panel
                mainCard.classList.remove('rounded-xl');
                mainCard.classList.add('rounded-t-xl', 'rounded-b-none');
            } else {
                // Close the panel
                detailPanel.classList.remove('open');
                // Restore full rounding on the main card
                mainCard.classList.add('rounded-xl');
                mainCard.classList.remove('rounded-t-xl', 'rounded-b-none');
            }
        };

        // Render transactions when the page loads
        window.onload = renderTransactions;



























                // Initialize Lucide icons
        lucide.createIcons();

       lucide.createIcons();

        // Application State
        const profileState = {
            name: "Jerry Luis",
            title: "Head of Investments"
        };
        
        // DOM Elements
        const overlayprof = document.getElementById('overlayprof');
        const messageBox = document.getElementById('message-box');
        const messageTitle = document.getElementById('message-title');
        const messageContent = document.getElementById('message-content');
        const notificationPanel = document.getElementById('notification-panel');
        const editModal = document.getElementById('edit-modal');
        const profileNameElement = document.getElementById('profile-name');
        const profileTitleElement = document.getElementById('profile-title');
        const editNameInput = document.getElementById('edit-name');
        const editTitleInput = document.getElementById('edit-title');


        // --- Utility Functions for Modals and Panels ---
        
        /**
         * Generic function to display a modal or panel and the overlayprof.
         * NOTE: This is primarily used for the center-screen modals (messageBox, editModal).
         * @param {HTMLElement} element - The modal/panel element to show.
         * @param {string} className - Optional class name to add (e.g., 'open' for side panels).
         */
        function openPanel(element, className = 'block') {
            element.classList.add(className);
            element.classList.remove('hidden'); 
            element.style.display = 'block'; 
            overlayprof.classList.remove('hidden');
        }

        /**
         * Generic function to hide a modal or panel and the overlayprof.
         * @param {HTMLElement} element - The modal/panel element to hide.
         * @param {string} className - Optional class name to remove (e.g., 'open' for side panels).
         */
        function closePanel(element, className = 'block') {
            element.classList.remove(className);
            
            if (element.id === 'notification-panel') {
                 // Start the transition out
                 element.style.transform = 'translateX(100%)';
                 // Wait for transition to complete (0.3s defined in CSS) before setting display: none
                 setTimeout(() => {
                    element.style.display = 'none';
                    checkAndHideOverlayprof();
                 }, 300);
            } else {
                 element.style.display = 'none';
                 checkAndHideOverlayprof();
            }
        }

        /**
         * Checks if any modal/panel is still open and hides the overlayprof only if none are open.
         */
        function checkAndHideOverlayprof() {
            // Check if any modal is visibly open (display: block)
            const isAnyModalOpen = messageBox.style.display === 'block' || editModal.style.display === 'block';
            // Check if the notification panel is still in the 'open' state
            const isPanelOpen = notificationPanel.classList.contains('open');
            
            if (!isAnyModalOpen && !isPanelOpen) {
                overlayprof.classList.add('hidden');
            }
        }
        
        // --- Specific UI Control Functions ---

        /** Displays the generic message box (replaces alert). */
        function showMessage(title, content) {
            messageTitle.textContent = title;
            messageContent.textContent = content;
            openPanel(messageBox);
        }

        /** Closes the generic message box. */
        function closeMessage() {
            closePanel(messageBox);
        }

        // --- Notifications Panel Logic (FIXED) ---
        function openNotifications() {
            // 1. Ensure the overlay is visible immediately
            overlayprof.classList.remove('hidden');
            
            // 2. Set the panel to its initial state: visible (block) and off-screen (100%)
            notificationPanel.style.display = 'block';
            notificationPanel.style.transform = 'translateX(100%)';

            // 3. IMPORTANT: Force a synchronous browser reflow (repaint). 
            // This makes the browser render the off-screen position before the next line of code runs,
            // which ensures the transition from 100% to 0% is executed.
            notificationPanel.offsetWidth; 

            // 4. Trigger the transition: change transform to 0 and add 'open' class for state tracking.
            notificationPanel.classList.add('open'); // Used for tracking state in checkAndHideOverlayprof
            notificationPanel.style.transform = 'translateX(0)';
        }

        function closeNotifications() {
            closePanel(notificationPanel, 'open');
        }
        
        // --- Editable Profile Modal Logic ---
        
        /** Opens the profile edit modal and pre-fills fields. */
        function openEditModal() {
            // Load current state into the form
            editNameInput.value = profileState.name;
            editTitleInput.value = profileState.title;
            openPanel(editModal);
        }

        /** Closes the profile edit modal. */
        function closeEditModal() {
            closePanel(editModal);
        }
        
        /** Saves the profile changes to the state and updates the UI. */
        function saveProfile() {
            const newName = editNameInput.value.trim();
            const newTitle = editTitleInput.value.trim();

            if (newName && newTitle) {
                // Update state
                profileState.name = newName;
                profileState.title = newTitle;
                
                // Update UI
                profileNameElement.textContent = newName;
                profileTitleElement.textContent = newTitle;
                
                closeEditModal();
                showMessage('Profile Updated', 'Your profile details have been successfully saved.');
            } else {
                showMessage('Error', 'Name and Title cannot be empty.');
            }
        }
        
        // --- Initialization and Toggles ---

        // Functionality for the custom switch/slider styling
        const style = document.createElement('style');
        style.textContent = `
            .switch { position: relative; display: inline-block; width: 44px; height: 24px; }
            .switch input { opacity: 0; width: 0; height: 0; }
            .slider {
                position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0;
                background-color: #4b5563; /* Gray background for OFF */
                transition: .4s;
            }
            .slider:before {
                position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px;
                background-color: white; transition: .4s;
            }
            input:checked + .slider { background-color: #10b981; /* Emerald green for ON */ }
            input:checked + .slider:before { transform: translateX(20px); }
            .slider.round { border-radius: 34px; }
            .slider.round:before { border-radius: 50%; }
        `;
        document.head.appendChild(style);

        // Toggle Functionality (for settings)
        document.getElementById('tfa-toggle').addEventListener('change', (e) => {
            const status = e.target.checked ? 'Enabled' : 'Disabled';
            showMessage('2FA Status Update', `Two-Factor Authentication is now ${status}.`);
        });

        document.getElementById('bio-toggle').addEventListener('change', (e) => {
            const status = e.target.checked ? 'Enabled' : 'Disabled';
            showMessage('Biometric Status Update', `Biometric Login is now ${status}.`);
        });

        // Close panels when clicking the overlayprof
        overlayprof.addEventListener('click', () => {
            if (messageBox.style.display === 'block') closeMessage();
            if (editModal.style.display === 'block') closeEditModal();
            // Check for the 'open' class for the slide-out panel
            if (notificationPanel.classList.contains('open')) closeNotifications();
        });

        // Initial setup for profile name display
        profileNameElement.textContent = profileState.name;
        profileTitleElement.textContent = profileState.title;









































        document.addEventListener('DOMContentLoaded', () => {
    // --- Unique ID references (all prefixed with 'ac-') ---
    const sidebar = document.getElementById('ac-sidebar');
    const contentWrapper = document.getElementById('ac-content-wrapper');
    const toggleBtn = document.getElementById('ac-sidebar-toggle-btn');
    const textarea = document.getElementById('ac-input-textarea');
    const sendButton = document.getElementById('ac-send-btn');
    const initialPrompt = document.getElementById('ac-initial-prompt');
    const chatMessages = document.getElementById('ac-messages');
    const quickActionsContainer = document.getElementById('ac-quick-actions');
    const indicator = document.getElementById('ac-typing-indicator');
    const historyContainer = document.getElementById('ac-history-container');

    const sidebarWidth = 256; // w-64 in pixels
    let isSidebarOpen = window.innerWidth >= 768; // Start open on desktop
    const typingSpeed = 25; // ms per character for typewriter effect

    // --- Core Chat Functions ---
    
    /**
     * Creates the message bubble structure.
     * @param {string} text - The message text.
     * @param {boolean} isUser - True if sender is user.
     * @param {boolean} isTyping - True if the message is being typed by the bot.
     * @returns {object} Contains the container div and the paragraph element.
     */
    function createMessageBubble(text, isUser, isTyping = false) {
        const bubbleClass = isUser 
            ? 'flex justify-end' 
            : 'flex justify-start';
        const contentClass = isUser
            ? 'lightdark text-white p-3 font-semibold rounded-xl rounded-br-none max-w-[80%] md:max-w-[60%] shadow-xl'
            : 'lightdark text-gray-200 p-3 font-semibold rounded-xl rounded-tl-none max-w-[80%] md:max-w-[60%] shadow-lg ';
        
        const messageContainer = document.createElement('div');
        messageContainer.className = bubbleClass;
        
        const messageContent = document.createElement('div');
        messageContent.className = contentClass;
        
        const paragraph = document.createElement('p');

        // Only set content immediately if it's a user message (not typing)
        if (isUser || !isTyping) {
            // Apply simple markdown processing for line breaks and bolding
            let htmlText = text.replace(/\n/g, '<br>');
            htmlText = htmlText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            paragraph.innerHTML = htmlText;
        }

        messageContent.appendChild(paragraph);
        messageContainer.appendChild(messageContent);
        
        return { container: messageContainer, paragraph: paragraph };
    }

    /**
     * Implements the typewriter effect.
     * @param {HTMLElement} element - The target paragraph element.
     * @param {string} rawText - The full raw text to type.
     */
    function typeMessage(element, rawText) {
        return new Promise(resolve => {
            let i = 0;
            element.classList.add('ac-typing-cursor');
            
            const interval = setInterval(() => {
                if (i < rawText.length) {
                    // Append raw text character by character
                    element.textContent += rawText.charAt(i);
                    i++;
                    ac_scrollToBottom();
                } else {
                    clearInterval(interval);
                    element.classList.remove('ac-typing-cursor');
                    
                    // Final rendering: handle markdown (bolding and line breaks)
                    let finalHtml = element.textContent.replace(/\n/g, '<br>');
                    finalHtml = finalHtml.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                    element.innerHTML = finalHtml;
                    
                    resolve();
                }
            }, typingSpeed);
        });
    }

    function ac_scrollToBottom() {
        if (historyContainer) {
            historyContainer.scrollTop = historyContainer.scrollHeight;
        }
    }

    async function ac_simulateBotResponse(userText) {
        // Show typing indicator
        indicator.classList.remove('hidden');
        
        let rawResponseText = "I'm sorry, I can only provide mock responses for now. For security, please verify any real transaction on your official banking app or contact support.";
        
        // Response logic based on user input (updated to be more conversational)
        if (userText.includes('Transfer ₦5,000 to Melvin')) {
            rawResponseText = "Certainly! I've initiated the **₦5,000 transfer to Melvin**. Please confirm the one-time password (OTP) sent to your mobile device to complete this transaction.";
        } else if (userText.includes('Recharge 2GB data')) {
            rawResponseText = "Great! **2GB data has been successfully recharged** to the number 09018654747. You should receive a confirmation text shortly.";
        } else if (userText.includes('Pay Electricity Bill')) {
            rawResponseText = "The **AEDC electricity bill payment is confirmed**. That's one less thing to worry about! Your receipt will be available in your transaction history in a few minutes.";
        } else if (userText.includes('Show my spending trends')) {
            rawResponseText = "I've analyzed your recent spending. Preliminary data shows a notable **15% increase in dining expenses** this month compared to last. Would you like me to flag any future dining purchases over ₦10,000 as a budget alert?";
        } else if (userText.includes('transactions')) {
            rawResponseText = "Here are your three most recent transactions:\n\n1. Withdrawal: **₦2,500** (ATM)\n2. Deposit: **₦15,000** (Salary)\n3. Purchase: **₦8,900** (Grocery Store)\n\nDo any of these require further detail or categorization?";
        }
        
        // 1. Create and append the message container, marked as typing
        const { container: botBubble, paragraph: targetElement } = createMessageBubble('', false, true);
        chatMessages.appendChild(botBubble);
        ac_scrollToBottom();

        // 2. Wait a short delay before typing begins
        await new Promise(r => setTimeout(r, 500)); 

        // 3. Start typing the message
        await typeMessage(targetElement, rawResponseText); 

        // 4. Hide typing indicator only after typing is complete
        indicator.classList.add('hidden');
        ac_scrollToBottom();
    }

    function ac_sendMessage(text) {
        const messageText = text.trim();
        if (!messageText) return;

        // 1. Switch View
        if (!chatMessages.classList.contains('hidden') || !initialPrompt.classList.contains('hidden')) {
             // Use opacity for smooth transition before setting hidden
             initialPrompt.classList.add('opacity-0'); 
             setTimeout(() => {
                initialPrompt.classList.add('hidden'); 
                chatMessages.classList.remove('hidden');
             }, 300);
        } else {
            chatMessages.classList.remove('hidden');
        }

        // 2. Append User Message
        const { container: userBubble } = createMessageBubble(messageText, true);
        chatMessages.appendChild(userBubble);
        
        // 3. Simulate AI Response
        ac_simulateBotResponse(messageText);

        // 4. Clear input
        if (textarea.value.trim() === messageText) {
            textarea.value = '';
            textarea.style.height = '40px'; // Reset height
        }
        
        // 5. Hide quick actions after first chat message
        quickActionsContainer.classList.add('hidden'); 
        
        ac_scrollToBottom();
    }


    // --- Sidebar Toggle Logic (Relative Push) ---
    function ac_toggleSidebar() {
        if (window.innerWidth >= 768) return; // Only apply on mobile

        isSidebarOpen = !isSidebarOpen;
        const translateValue = isSidebarOpen ? 0 : -sidebarWidth;
        contentWrapper.style.transform = `translateX(${translateValue}px)`;
    }

    function ac_handleResize() {
        if (window.innerWidth >= 768) {
            // Desktop: sidebar always open, no translation
            isSidebarOpen = true;
            contentWrapper.style.transform = 'translateX(0)';
        } else {
            // Mobile: respect current state
            const translateValue = isSidebarOpen ? 0 : -sidebarWidth;
            contentWrapper.style.transform = `translateX(${translateValue}px)`;
        }
    }
    
    // Initial setup on load:
    if (!isSidebarOpen) {
        contentWrapper.style.transform = `translateX(${-sidebarWidth}px)`;
    }


    // --- Event Listeners Setup ---

    // Mobile Sidebar Toggle
    if (toggleBtn) {
        toggleBtn.addEventListener('click', ac_toggleSidebar);
    }
    
    // Window Resize Handler
    window.addEventListener('resize', ac_handleResize);

    // Textarea Auto-Resize
    if (textarea) {
        textarea.addEventListener('input', () => {
            textarea.style.height = 'auto';
            textarea.style.height = (textarea.scrollHeight) + 'px'; 
        });
    }

    // Send Button Click
    sendButton.addEventListener('click', () => {
        ac_sendMessage(textarea.value.trim());
    });

    // Enter Key Press in Textarea (Shift+Enter for new line)
    textarea.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); 
            ac_sendMessage(textarea.value.trim());
        }
    });
    
    // Quick Action Buttons (Directly send message)
    document.querySelectorAll('.ac-quick-action-btn').forEach(button => {
        button.addEventListener('click', () => {
            const promptText = button.querySelector('p:first-child').textContent.trim();
            ac_sendMessage(promptText.replace(/[\s\r\n]+/g, ' ')); // Clean up text before sending
        });
    });
    
    // When the textarea gets focus, switch the view from initial prompt to chat history
    if (textarea) {
        textarea.addEventListener('focus', () => {
            if (!initialPrompt.classList.contains('hidden')) {
                initialPrompt.classList.add('opacity-0');
                setTimeout(() => {
                    initialPrompt.classList.add('hidden');
                }, 300); 
            }
        });
    }
});




























// --- Setup Elements ---
const canvas = document.getElementById('audio-visualizer');
const canvasCtx = canvas.getContext('2d');
// REMOVED: const statusDiv = document.getElementById('status');
const finalTextView = document.getElementById('final-text');
const interimTextView = document.getElementById('interim-text');
const systemResponseView = document.getElementById('system-response'); 

// Initial canvas size setup
function setCanvasDimensions() {
    // Ensure the canvas scales to the container's current dimensions
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
}
setCanvasDimensions(); 
window.addEventListener('resize', setCanvasDimensions);

// --- Global Variables ---
let audioCtx;
let analyser;
let dataArray;
let bufferLength;
let animationFrameId;
let mediaStream; 
let recognitionTimeout;
const RECOGNITION_TIMEOUT_MS = 90000;

// --- Speech Recognition Variables ---
let recognition;
let isListening = false;
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

// --- FLEXIBLE COMMANDS DICTIONARY (INTACT) ---
const COMMANDS = [
    {
        trigger: 'transfer',
        getResponse: (text) => {
            let amount = 'an unknown amount';
            let name = 'an unknown recipient';
            
            // 1. Find the amount (prioritizes digits, then checks for common spoken thousands)
            const amountMatch = text.match(/(\d{1,3}(?:,\d{3})*|\d+)/) || 
                                text.match(/(one|two|three|four|five|six|seven|eight|nine)\s*(?:thousand)/i);
            if (amountMatch) {
                amount = amountMatch[0].replace(/\s/g, '');
            } else {
                return "TRANSFER: Please specify the amount you wish to transfer. E.g., 'transfer 5000...'";
            }

            // 2. Find the recipient after the word 'to'
            const toIndex = text.indexOf('to');
            if (toIndex !== -1) {
                let nameSegment = text.substring(toIndex + 2).trim();
                name = nameSegment.replace(/\s*(now|today|please|quickly|my|a|an)\s*$/i, '').trim();
                if (name.length < 2) {
                    return `TRANSFER: I have the amount ${amount}, but who should I send it to?`;
                }
            } else {
                return `TRANSFER: I have the amount ${amount}, but I couldn't find the recipient's name.`;
            }
            
            // Final Success Response
            return `CONFIRM: Transfer ${amount} NGN to ${name.toUpperCase()}. Reply 'YES' to proceed.`;
        }
    },
    {
        trigger: 'time',
        getResponse: () => {
            return `The current time is ${new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true})}.`;
        }
    },
    {
        trigger: 'call',
        getResponse: (text) => {
            const nameMatch = text.match(/call\s+([a-zA-Z\s]+)/i);
            const name = nameMatch ? nameMatch[1].trim() : 'a contact';
            
            if (name.length < 2 || name === 'a contact') {
                return "CALL: Please state who you would like to call. E.g., 'call my wife'.";
            }
            return `Calling ${name.toUpperCase()} now. Please wait...`;
        }
    }
];

// --- Typewriter Effect Function (INTACT) ---
let typeInterval;
function startTypewriterEffect(message) {
    clearInterval(typeInterval);
    systemResponseView.textContent = '';
    systemResponseView.classList.add('system-response');
    systemResponseView.classList.add('typing');

    let i = 0;
    typeInterval = setInterval(() => {
        if (i < message.length) {
            systemResponseView.textContent += message.charAt(i);
            i++;
        } else {
            clearInterval(typeInterval);
            systemResponseView.classList.remove('typing'); 
        }
    }, 35); 
}

// --- Helper Functions to manage UI State (MODIFIED - setMicState REMOVED) ---
// function setMicState(state) { ... } // REMOVED
 
function setTranscriptionStatus(message, isError = false) {
    finalTextView.textContent = message;
    interimTextView.textContent = '';
    if (isError) {
        finalTextView.classList.add('error-message');
    } else {
        finalTextView.classList.remove('error-message');
        systemResponseView.textContent = ''; 
        clearInterval(typeInterval); 
    }
}

// --- Command Processor (INTACT) ---
function processCommand(text) {
    const commandText = text.toLowerCase().trim();
    let commandFound = false;
    
    for (const command of COMMANDS) {
        if (commandText.includes(command.trigger)) {
            const response = command.getResponse(commandText); 
            startTypewriterEffect(response);
            commandFound = true;
            break; 
        }
    }
    
    if (!commandFound && commandText.length > 5) {
        startTypewriterEffect("Command not recognized. Try saying 'transfer 5000' or 'what is the time'.");
    }
}

// =======================================================
// --- CLEAN STOP HANDLER (Essential for Page Leave) ---
// =======================================================
function stopAllFeatures(silent = false) {
    if (isListening) {
        isListening = false;
        if (recognition) {
            // Stop the speech recognition service
            recognition.stop();
        }
        if (audioCtx) {
            // Suspend the audio context to release the mic
            audioCtx.suspend();
        }

        // Only update UI if not a "silent" stop (i.e., not before a navigation)
        if (!silent) {
            setTranscriptionStatus("Recording stopped.");
            clearInterval(typeInterval);
        }
        clearTimeout(recognitionTimeout);

        // Stop the media stream tracks to fully release the microphone
        if (mediaStream) {
            mediaStream.getTracks().forEach(track => track.stop());
            mediaStream = null;
        }
    }
    // Cancel the visualizer animation loop
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
}

// --- 1. Audio Initialization (Web Audio API) ---
function initAudio(stream) {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    if (!analyser) {
        const source = audioCtx.createMediaStreamSource(stream);
        analyser = audioCtx.createAnalyser();
        
        analyser.fftSize = 2048;
        bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);

        source.connect(analyser);
        analyser.connect(audioCtx.destination); 
        
        drawVisualizer();
    }
}

// --- 2. Speech Recognition Initialization (Web Speech API) ---
function initSpeechRecognition() {
    if (!SpeechRecognition) {
        setTranscriptionStatus("FATAL ERROR: Speech Recognition not supported in this browser. Use Chrome.", true);
        return false;
    }

    if (recognition) return true; 

    recognition = new SpeechRecognition();
    recognition.continuous = true; 
    recognition.interimResults = true; 
    recognition.lang = 'en-US'; 

    recognition.onstart = () => {
        isListening = true;
        // setMicState('listening'); // REMOVED
        setTranscriptionStatus("Go ahead and speak. Listening...");
        systemResponseView.textContent = '';
        
        clearTimeout(recognitionTimeout);
        recognitionTimeout = setTimeout(() => {
            // Use the full stop function to cleanly handle the timeout
            stopAllFeatures(false);
            setTranscriptionStatus('Listening timed out.', true);
        }, RECOGNITION_TIMEOUT_MS);
    };

    recognition.onresult = (event) => {
        clearTimeout(recognitionTimeout);
        
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript + ' ';
            } else {
                interimTranscript += transcript;
            }
        }

        if (finalTranscript) {
            finalTextView.innerHTML += `<span class="transcribed-text">${finalTranscript}</span>`;
            finalTextView.classList.remove('error-message');
            
            const currentTranscribedText = finalTextView.textContent.trim();
            processCommand(currentTranscribedText); 
        }
        interimTextView.textContent = interimTranscript;

        recognitionTimeout = setTimeout(() => {
            // Use the full stop function to cleanly handle the silence/timeout
            stopAllFeatures(false);
            setTranscriptionStatus('Listening timed out.', true);
        }, RECOGNITION_TIMEOUT_MS);
    };

    recognition.onerror = (event) => {
        stopAllFeatures(false); // Clean up everything on error
        setTranscriptionStatus(`Speech Recognition Error (${event.error}).`, true);
        // setMicState('error'); // REMOVED
    };

    recognition.onend = () => {
        if (isListening) {
            // Automatically restart if we were actively listening (as intended by continuous=true)
            recognition.start(); 
        } else {
            setTranscriptionStatus("Ready."); 
        }
    };

    return true;
}

// --- 3. Visualization Drawing Loop (INTACT) ---
function drawVisualizer() {
    animationFrameId = requestAnimationFrame(drawVisualizer);
    analyser.getByteTimeDomainData(dataArray);

    // Clear canvas
    canvasCtx.fillStyle = 'rgba(255, 255, 255, 0.95)'; 
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height); 

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'rgb(0, 0, 0)'; 

    canvasCtx.beginPath();
    const sliceWidth = canvas.width * 1.0 / bufferLength;
    let x = 0;

    for(let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0; 
        const y = v * canvas.height / 2; 

        if(i === 0) {
            canvasCtx.moveTo(x, y); 
        } else {
            canvasCtx.lineTo(x, y); 
        }
        x += sliceWidth;
    }

    canvasCtx.lineTo(canvas.width, canvas.height/2); 
    canvasCtx.stroke(); 
}

// =======================================================
// --- PRIMARY MIC LOGIC: START-ONLY HANDLER ---
// =======================================================

/**
 * Executes the microphone start logic.
 */
function executeStartLogic() {
    if (!initSpeechRecognition()) return;

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaStream = stream; 
            if (audioCtx && audioCtx.state === 'suspended') {
                audioCtx.resume();
            } else if (!audioCtx) {
                initAudio(stream);
            }
            
            if (!isListening) {
                finalTextView.innerHTML = '';
                interimTextView.textContent = '';
                recognition.start();
            }
        })
        .catch(err => {
            setTranscriptionStatus(`Microphone Denied/Failed: ${err.name}. Check browser permissions.`, true);
            console.error('Microphone access error:', err);
        });
}

/**
 * Dedicated function for elements with class 'activate-mic'.
 * It only starts the mic if it is currently stopped.
 */
function startMicIfStopped() {
    if (!isListening) {
        executeStartLogic();
    }
}

// --- 5. Event Listeners ---

// 1. Attach the dedicated start-only handler to all elements with 'activate-mic' class
document.querySelectorAll('.activate-mic').forEach(button => {
    button.addEventListener('click', startMicIfStopped);
});

// 2. CRITICAL: Stops the mic when the user closes the tab or navigates away.
window.addEventListener('beforeunload', () => {
    // Stops everything silently without updating the UI state
    stopAllFeatures(true); 
});

// Initialize state on load
setTranscriptionStatus("Ready.");





document.addEventListener('DOMContentLoaded', function() {
    const inputField = document.getElementById('ac-input-textarea');

    // Only apply this fix on mobile devices (or small screens) if necessary
    // A simple way to check:
    if (/Mobi|Android/i.test(navigator.userAgent) || window.innerWidth < 768) {
        inputField.addEventListener('focus', function() {
            // Wait a moment (e.g., 300ms) for the keyboard to fully render
            setTimeout(() => {
                // Scroll the input into view, aligning it to the bottom of the screen
                this.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'end' 
                });
            }, 300); 
        });
    }
});
