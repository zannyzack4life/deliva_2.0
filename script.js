// PowerUp Dashboard - JavaScript functionality

class PowerUpDashboard {
    constructor() {
        this.activeTab = 'dashboard';
        this.isDarkMode = false;
        this.walletBalance = 234.50;
        this.currentUsage = 2.4;
        this.energyUsage = {
            current: 2.4,
            daily: 18.7,
            monthly: 542
        };

        // Initialize the Balance Module to handle all circular progress charts
        this.balanceModule = new BalanceModule();

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.startRealTimeUpdates();
        this.handleLoading();
        this.initTheme();
        this.animateChartOnLoad();
        // Initialize the balance module
        this.balanceModule.init();
    }

    setupEventListeners() {
        // Theme toggle buttons
        const themeToggle = document.getElementById('themeToggle');
        const desktopThemeToggle = document.getElementById('desktopThemeToggle');

        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
        if (desktopThemeToggle) {
            desktopThemeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Navigation
        this.setupNavigation();

        // Notifications
        this.setupNotifications();

        // Quick actions
        this.setupQuickActions();

        // Window resize handler
        window.addEventListener('resize', () => this.handleResize());
    }


    setupNavigation() {
        // Sidebar navigation
        const sidebarLinks = document.querySelectorAll('.sidebar-link');
        sidebarLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const tab = link.dataset.tab;
                this.switchTab(tab);
                this.updateSidebarActive(link);
            });
        });

        // Bottom navigation
        const bottomNavBtns = document.querySelectorAll('.bottom-nav-btn');
        bottomNavBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const tab = btn.dataset.tab;
                this.switchTab(tab);
                this.updateBottomNavActive(btn);
            });
        });
    }

    setupNotifications() {
        const notificationBtn = document.getElementById('notificationBtn');
        const desktopNotificationBtn = document.getElementById('desktopNotificationBtn');
        const notificationCenter = document.getElementById('notificationCenter');
        const closeNotifications = document.getElementById('closeNotifications');

        [notificationBtn, desktopNotificationBtn].forEach(btn => {
            if (btn) {
                btn.addEventListener('click', () => this.showNotifications());
            }
        });

        if (closeNotifications) {
            closeNotifications.addEventListener('click', () => this.hideNotifications());
        }

        // Close notifications when clicking backdrop
        if (notificationCenter) {
            notificationCenter.addEventListener('click', (e) => {
                if (e.target === notificationCenter) {
                    this.hideNotifications();
                }
            });
        }
    }

    setupQuickActions() {
        const quickActionBtns = document.querySelectorAll('.quick-action-btn');
        quickActionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                this.handleQuickAction(action);
            });
        });
    }

    switchTab(tab) {
        this.activeTab = tab;

        // Update page title
        const pageTitle = document.getElementById('pageTitle');
        if (pageTitle) pageTitle.textContent = tab.charAt(0).toUpperCase() + tab.slice(1);

        // Hide all tab pages
        document.querySelectorAll('.tab-page').forEach(section => {
            section.classList.add('hidden');
        });

        // Show the selected tab
        const activeSection = document.getElementById(tab);
        if (activeSection) activeSection.classList.remove('hidden');

        // Optional fade effect
        const mainContent = document.querySelector('main');
        if (mainContent) {
            mainContent.style.opacity = '0.7';
            setTimeout(() => mainContent.style.opacity = '1', 150);
        }
    }


    updateSidebarActive(activeLink) {
        const sidebarLinks = document.querySelectorAll('.sidebar-link');
        sidebarLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    }

    updateBottomNavActive(activeBtn) {
        const bottomNavBtns = document.querySelectorAll('.bottom-nav-btn');
        bottomNavBtns.forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');
    }

    showNotifications() {
        const notificationCenter = document.getElementById('notificationCenter');
        if (notificationCenter) {
            notificationCenter.classList.remove('hidden');
            notificationCenter.classList.add('show');

            // Animate the panel in
            setTimeout(() => {
                const panel = notificationCenter.querySelector('.absolute');
                if (panel) {
                    panel.style.transform = 'translateX(0)';
                }
            }, 10);
        }
    }

    hideNotifications() {
        const notificationCenter = document.getElementById('notificationCenter');
        if (notificationCenter) {
            const panel = notificationCenter.querySelector('.absolute');
            if (panel) {
                panel.style.transform = 'translateX(100%)';
            }

            setTimeout(() => {
                notificationCenter.classList.add('hidden');
                notificationCenter.classList.remove('show');
            }, 300);
        }
    }

    handleQuickAction(action) {
        // Add ripple effect
        const btn = document.querySelector(`[data-action="${action}"]`);
        if (btn) {
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                btn.style.transform = 'scale(1)';
            }, 150);
        }

        // Simulate action feedback
        switch (action) {
            case 'topup':
                this.showToast('Opening top-up ...', 'info');
                break;
            case 'electricity':
                this.showToast('Opening Electricity payment...', 'info');
                break;
            case 'tv':
                this.showToast('Opening TV payment...', 'info');
                break;
            case 'data':
                this.showToast('Opening Data payment...', 'info');
                break;
            case 'airtime':
                this.showToast('Opening Airtime payment...', 'info');
                break;
            case 'transfers':
                this.showToast('Opening Transfers payment...', 'info');
                break;
        }
    }

    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        const html = document.documentElement;
        const flipper = document.getElementById('themeFlipper'); // add this div in your button if not yet

        // Flip animation
        if (this.isDarkMode) {
            html.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            if (flipper) flipper.style.transform = 'rotateY(180deg)';
        } else {
            html.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            if (flipper) flipper.style.transform = 'rotateY(0deg)';
        }

        this.updateThemeIcons();
    }

    initTheme() {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const flipper = document.getElementById('themeFlipper');

        this.isDarkMode = savedTheme === 'dark' || (!savedTheme && prefersDark);

        if (this.isDarkMode) {
            document.documentElement.classList.add('dark');
            if (flipper) flipper.style.transform = 'rotateY(180deg)';
        } else {
            if (flipper) flipper.style.transform = 'rotateY(0deg)';
        }

        this.updateThemeIcons();
    }

    updateThemeIcons() {
        const lightIcons = document.querySelectorAll('#lightIcon, #desktopLightIcon');
        const darkIcons = document.querySelectorAll('#darkIcon, #desktopDarkIcon');

        // No visibility flicker — icons stay in sync with flip
        if (this.isDarkMode) {
            lightIcons.forEach(icon => icon.classList.add('hidden'));
            darkIcons.forEach(icon => icon.classList.remove('hidden'));
        } else {
            lightIcons.forEach(icon => icon.classList.remove('hidden'));
            darkIcons.forEach(icon => icon.classList.add('hidden'));
        }
    }


    startRealTimeUpdates() {
        // Update current usage every 5 seconds
        setInterval(() => {
            this.currentUsage = +(Math.random() * 2 + 1.5).toFixed(1);
            this.energyUsage.current = this.currentUsage;
            this.updateRealTimeDisplays();
            this.updateEnergyChart();
        }, 5000);

        // Balance updates are now handled by BalanceModule
    }

    updateRealTimeDisplays() {
        const currentUsageElements = document.querySelectorAll('#currentUsage, #liveUsage, #chartCurrentUsage');
        currentUsageElements.forEach(element => {
            element.textContent = this.currentUsage;
        });
    }

    updateEnergyStats() {
        // Update daily usage
        const dailyElements = document.querySelectorAll('[data-stat="daily"]');
        dailyElements.forEach(element => {
            element.textContent = this.energyUsage.daily.toFixed(1);
        });

        // Update monthly usage
        const monthlyElements = document.querySelectorAll('[data-stat="monthly"]');
        monthlyElements.forEach(element => {
            element.textContent = Math.round(this.energyUsage.monthly);
        });
    }

    animateChartOnLoad() {
        const chartPath = document.getElementById('energyChart');
        if (chartPath) {
            const pathLength = chartPath.getTotalLength();
            chartPath.style.strokeDasharray = pathLength + ' ' + pathLength;
            chartPath.style.strokeDashoffset = pathLength;

            // Animate the path
            setTimeout(() => {
                chartPath.style.transition = 'stroke-dashoffset 2s ease-in-out';
                chartPath.style.strokeDashoffset = '0';
            }, 1000);
        }
    }

    updateEnergyChart() {
        // Animate chart data points
        const dataPoints = document.querySelectorAll('#energyChart + defs + circle');
        dataPoints.forEach((point, index) => {
            setTimeout(() => {
                point.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    point.style.transform = 'scale(1)';
                }, 200);
            }, index * 100);
        });
    }

    handleLoading() {
        // Hide loading screen after 2 seconds with fade effect
        setTimeout(() => {
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                loadingScreen.style.opacity = '0';
                loadingScreen.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    loadingScreen.classList.add('hidden');
                }, 500);
            }

            // Trigger content animations
            this.animateContentOnLoad();
        }, 2000);
    }

    animateContentOnLoad() {
        // Animate main content sections with stagger
        const sections = document.querySelectorAll('.glass-card');
        sections.forEach((section, index) => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';

            setTimeout(() => {
                section.style.transition = 'all 0.6s ease-out';
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    handleResize() {
        // Handle responsive adjustments, including calling the BalanceModule's resize handler
        this.balanceModule.updateAllCircularProgress();
    }

    showToast(message, type = 'info') {
        // Create a simple toast notification
        const toast = document.createElement('div');
        toast.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300 ${
            type === 'info' ? 'bg-blue-500 text-white' :
            type === 'success' ? 'bg-green-500 text-white' :
            type === 'warning' ? 'bg-orange-500 text-white' :
            'bg-red-500 text-white'
        }`;
        toast.textContent = message;

        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 10);

        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }
}




// ==========================================================
// BALANCE MODULE (Handles all circular progress charts)
// ==========================================================
class BalanceModule {
    constructor() {
        this.balances = {
            electricity: {
                initialValue: 50, max: 100, unit: 'kWh',
                colors: { high: '#fab005', medium: '#3498db', low: '#e74c3c' },
                thresholds: { low: 20, medium: 50 },
                statusTexts: { high: 'Good Balance', medium: 'Medium Balance', low: 'Low Balance!' },
                tailwindMap: { high: { text: 'text-yellow-500', bg: 'bg-yellow-900' }, medium: { text: 'text-blue-500', bg: 'bg-blue-900' }, low: { text: 'text-red-500', bg: 'bg-red-900' } }
            },
            tv: {
                initialValue: 25, max: 30, unit: 'days',
                colors: { high: '#00bcd4', medium: '#8e44ad', low: '#e74c3c' },
                thresholds: { low: 5, medium: 15 },
                statusTexts: { high: 'Active Subscription', medium: 'Subscription Due Soon', low: 'Subscription Expiring!' },
                tailwindMap: { high: { text: 'text-cyan-500', bg: 'bg-cyan-900' }, medium: { text: 'text-purple-500', bg: 'bg-purple-900' }, low: { text: 'text-red-500', bg: 'bg-red-900' } }
            },
            data: {
                initialValue: 700, max: 1000, unit: 'MB',
                colors: { high: '#4caf50', medium: '#f39c12', low: '#e74c3c' },
                thresholds: { low: 200, medium: 500 },
                statusTexts: { high: 'Ample Data', medium: 'Data Running Low', low: 'Data Critical!' },
                tailwindMap: { high: { text: 'text-green-500', bg: 'bg-green-900' }, medium: { text: 'text-orange-500', bg: 'bg-orange-900' }, low: { text: 'text-red-500', bg: 'bg-red-900' } }
            },
            airtime: {
                initialValue: 700, max: 1000, unit: 'NGN',
                colors: { high: '#00ff88', medium: '#FFA500', low: '#8B0000' },
                thresholds: { low: 100, medium: 300 },
                statusTexts: { high: 'Good Airtime', medium: 'Airtime Low', low: 'Recharge Now!' },
                tailwindMap: { high: { text: 'text-green-500', bg: 'bg-green-900' }, medium: { text: 'text-orange-500', bg: 'bg-orange-900' }, low: { text: 'text-red-700', bg: 'bg-red-900' } }
            }
        };

        for (const type in this.balances) {
            this.balances[type].currentValue = this.balances[type].initialValue;
        }

        this.radius = 95; 
        this.circumference = 2 * Math.PI * this.radius;
    }

    init() {
        this.updateAllCircularProgress();
        this.startAllBalanceUpdates();
    }

    // This is the core function for updating the UI
    updateCircularProgress(type, currentValue) {
        // Use querySelectorAll to find ALL cards with the matching data-balance-type
        const balanceCards = document.querySelectorAll(`.glass-card[data-balance-type="${type}"]`);
        
        if (balanceCards.length === 0) return;

        const balanceConfig = this.balances[type];
        let percentage = (currentValue / balanceConfig.max) * 100;
        percentage = Math.max(0, Math.min(100, percentage)); // Clamp between 0 and 100

        // 1. Pre-calculate values (done once)
        const offset = this.circumference - (percentage / 100) * this.circumference;
        const classesToRemove = ['text-yellow-500', 'text-blue-500', 'text-green-500', 'text-red-500', 'text-purple-500', 'text-orange-500', 'text-cyan-500', 'text-red-700', 'bg-yellow-900', 'bg-blue-900', 'bg-green-900', 'bg-red-900', 'bg-purple-900', 'bg-orange-900', 'bg-cyan-900'];

        // 2. Determine status, color, text (done once)
        let statusKey;
        if (currentValue < balanceConfig.thresholds.low) {
            statusKey = 'low';
        } else if (currentValue < balanceConfig.thresholds.medium) {
            statusKey = 'medium';
        } else {
            statusKey = 'high';
        }
        
        const color = balanceConfig.colors[statusKey];
        const statusText = balanceConfig.statusTexts[statusKey];
        const tailwindClasses = balanceConfig.tailwindMap[statusKey];

        // 3. Loop over ALL matching cards and apply updates
        balanceCards.forEach((balanceCard) => {
            const progressCircle = balanceCard.querySelector('.progressCircle');
            const balancePercentageElement = balanceCard.querySelector('.balancePercentage');
            const statusIndicator = balanceCard.querySelector('.balanceStatusIndicator');

            // CRITICAL: Dynamically determine the unique gradient ID for this specific card
            const svg = balanceCard.querySelector('svg');
            const gradientId = svg.querySelector('linearGradient').id;
            
            // Use the specific ID to find the gradient stops inside this card's SVG
            const gradientStop0 = balanceCard.querySelector(`#${gradientId} .stopColor_0`); 
            const gradientStop100 = balanceCard.querySelector(`#${gradientId} .stopColor_100`);

            
            if (progressCircle && balancePercentageElement && gradientStop0 && gradientStop100) {

                // Update the progress circle's dash offset
                progressCircle.style.strokeDasharray = this.circumference;
                progressCircle.style.strokeDashoffset = offset;

                // Apply color to the progress circle (via gradient stops)
                gradientStop0.style.stopColor = color;
                gradientStop100.style.stopColor = color;

                // Update the numerical text content
                balancePercentageElement.textContent = Math.round(currentValue);
                
                // Update the status indicator text and colors
                if (statusIndicator) {
                    statusIndicator.textContent = statusText;
                    
                    statusIndicator.classList.remove(...classesToRemove);
                    statusIndicator.classList.add(tailwindClasses.text, tailwindClasses.bg);
                }
            }
        });
    }

    // Call this to update all balances on page load
    updateAllCircularProgress() {
        for (const type in this.balances) {
            this.updateCircularProgress(type, this.balances[type].currentValue);
        }
    }

    // This starts the live data simulation
    startAllBalanceUpdates() {
        // Electricity: Simulate usage/top-up every 2 seconds
        setInterval(() => {
            const bal = this.balances.electricity;
            bal.currentValue += (Math.random() - 0.5) * 5; 
            bal.currentValue = Math.max(0, Math.min(bal.max, bal.currentValue));
            this.updateCircularProgress('electricity', bal.currentValue);
        }, 2000);

        // TV: Simulate day counting every 2 seconds
        setInterval(() => {
            const bal = this.balances.tv;
            bal.currentValue += (Math.random() - 0.5) * 1.5;
            bal.currentValue = Math.max(0, Math.min(bal.max, bal.currentValue));
            this.updateCircularProgress('tv', bal.currentValue);
        }, 2000);

        // Data: Simulate data usage/top-up every 2 seconds
        setInterval(() => {
            const bal = this.balances.data;
            bal.currentValue += (Math.random() - 0.5) * 100;
            bal.currentValue = Math.max(0, Math.min(bal.max, bal.currentValue));
            this.updateCircularProgress('data', bal.currentValue);
        }, 2000);

        // Airtime: Simulate airtime usage/top-up every 2 seconds
        setInterval(() => {
            const bal = this.balances.airtime;
            bal.currentValue += (Math.random() - 0.5) * 100;
            bal.currentValue = Math.max(0, Math.min(bal.max, bal.currentValue));
            this.updateCircularProgress('airtime', bal.currentValue);
        }, 2000);
    }
}

// Initialize and start the module when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const balanceModule = new BalanceModule();
    balanceModule.init();
});









// ==========================================================
// GLOBAL INITIALIZATION AND HELPER FUNCTIONS
// ==========================================================

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PowerUpDashboard();
});

// Add some interactive enhancements
document.addEventListener('DOMContentLoaded', () => {
    // Add click ripple effect to buttons
    const buttons = document.querySelectorAll('button, .cursor-pointer');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
                z-index: 1;
            `;

            // Ensure the parent element has relative positioning to contain the ripple
            const parent = this.style.position === 'relative' ? this : (() => {
                this.style.position = 'relative';
                this.style.overflow = 'hidden'; // Hide overflow of ripple
                return this;
            })();

            parent.appendChild(ripple);

            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
            }, 600);
        });
    });

    // Add CSS for ripple animation dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});

// Handle keyboard navigation
document.addEventListener('keydown', (e) => {
    // Close notifications with Escape key
    if (e.key === 'Escape') {
        const notificationCenter = document.getElementById('notificationCenter');
        if (notificationCenter && !notificationCenter.classList.contains('hidden')) {
            window.dashboard?.hideNotifications(); // Use optional chaining for safety
        }
    }

    // Quick theme toggle with Ctrl/Cmd + Shift + T
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        window.dashboard?.toggleTheme(); // Use optional chaining for safety
    }
});

// Store dashboard instance globally for console access
// This needs to be set after the dashboard is instantiated.
window.dashboard = null;
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new PowerUpDashboard();
});


// PWA-like features (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Service worker would be registered here in a real PWA
        console.log('PowerUp Dashboard loaded successfully');
    });
}

// Handle network status (optional)
window.addEventListener('online', () => {
    console.log('Network connection restored');
});

window.addEventListener('offline', () => {
    console.log('Network connection lost');
});




















      // Global state management for panel animations
        let currentPanel = null; // Track which panel is currently open
        let isAnimating = false; // Prevent animation conflicts

        // Main panel opening function - handles all service panels
        function openPanel(panelType) {
            if (isAnimating) return; // Prevent overlapping animations
            
            // If another panel is open, close it first then open new one
            if (currentPanel) {
                closePanel();
                setTimeout(() => showPanel(panelType), 100); // Small delay for smooth transition
            } else {
                showPanel(panelType);
            }
        }

        // Panel display function with beautiful bounce animation
        function showPanel(panelType) {
            if (isAnimating) return; // Animation guard
            isAnimating = true;
            
            const overlay = document.querySelector('.panel-overlay');
            const panel = document.querySelector(`.${panelType}-panel`);
            
            currentPanel = panelType; // Update global state
            
            // Show backdrop overlay with blur effect
            overlay.classList.add('active');
            
            // Show panel with instant bounce animation (0.15s cubic-bezier)
            panel.classList.add('active');
            setTimeout(() => {
                isAnimating = false; // Release animation lock
            }, 150); // Match CSS transition duration
        }

        // Panel closing function with smooth fade-out
        function closePanel() {
            if (isAnimating) return; // Animation guard
            isAnimating = true;
            
            const overlay = document.querySelector('.panel-overlay');
            const activePanel = document.querySelector('.panel.active');
            
            // Remove active classes to trigger close animations
            if (activePanel) {
                activePanel.classList.remove('active');
            }
            
            overlay.classList.remove('active');
            
            // Reset state after animation completes
            setTimeout(() => {
                currentPanel = null;
                isAnimating = false;
            }, 200); // Slightly longer than CSS transition for safety
        }

        function selectNetwork(button, network) {
            const container = button.parentElement;
            container.querySelectorAll('.network-btn').forEach(btn => {
                btn.classList.remove('selected');
            });
            button.classList.add('selected');
        }

        function selectAmount(button, amount) {
            const container = button.parentElement;
            container.querySelectorAll('.amount-btn').forEach(btn => {
                btn.classList.remove('selected');
            });
            button.classList.add('selected');
            
            const panel = button.closest('.panel');
            const amountInput = panel.querySelector('input[type="number"]');
            if (amountInput) {
                amountInput.value = amount;
                amountInput.classList.add('success');
                setTimeout(() => amountInput.classList.remove('success'), 300);
            }
        }

        function quickAction(type, provider, identifier) {
            openPanel(type);
            setTimeout(() => {
                if (type === 'electricity') {
                    quickPayElectricity(provider, identifier, 'Quick Pay');
                } else if (type === 'airtime') {
                    quickPayAirtime(provider, identifier);
                } else if (type === 'data') {
                    quickPayData(provider, identifier, '1GB');
                }
            }, 250);
        }

        function quickPayElectricity(provider, meterNumber, name) {
            const panel = document.querySelector('.electricity-panel');
            const dropdown = panel.querySelector('.dropdown-button');
            dropdown.querySelector('span').textContent = provider;
            dropdown.setAttribute('data-value', provider);
            panel.querySelector('input[placeholder="Enter meter number"]').value = meterNumber;
            
            setTimeout(() => {
                panel.querySelector('.form-group').scrollIntoView({ behavior: 'smooth' });
            }, 50);
        }

        function quickPayTV(provider, cardNumber, packageName) {
            const panel = document.querySelector('.tv-panel');
            const dropdown = panel.querySelector('.dropdown-button');
            const cardInput = panel.querySelector('input[placeholder="Enter smart card number"]');
            
            dropdown.querySelector('span').textContent = provider;
            dropdown.setAttribute('data-value', provider);
            cardInput.value = cardNumber;
            
            setTimeout(() => {
                panel.querySelector('.form-group').scrollIntoView({ behavior: 'smooth' });
            }, 50);
        }

        function quickPayAirtime(network, phoneNumber) {
            const panel = document.querySelector('.airtime-panel');
            const phoneInput = panel.querySelector('input[type="tel"]');
            
            phoneInput.value = phoneNumber;
            
            panel.querySelectorAll('.network-btn').forEach(btn => {
                if (btn.textContent.includes(network)) {
                    selectNetwork(btn, network);
                }
            });
            
            setTimeout(() => {
                panel.querySelector('.network-grid').scrollIntoView({ behavior: 'smooth' });
            }, 50);
        }

        function quickPayData(network, phoneNumber, dataPlan) {
            const panel = document.querySelector('.data-panel');
            const phoneInput = panel.querySelector('input[type="tel"]');
            
            phoneInput.value = phoneNumber;
            
            panel.querySelectorAll('.network-btn').forEach(btn => {
                if (btn.textContent.includes(network)) {
                    selectNetwork(btn, network);
                }
            });
            
            setTimeout(() => {
                panel.querySelector('.network-grid').scrollIntoView({ behavior: 'smooth' });
            }, 50);
        }

        // Enhanced dropdown functions with icon support
        function toggleDropdown(button) {
            const dropdown = button.nextElementSibling;
            const isActive = dropdown.classList.contains('active');
            
            // Close all other dropdowns first
            document.querySelectorAll('.dropdown-options.active').forEach(d => {
                if (d !== dropdown) {
                    d.classList.remove('active');
                    d.previousElementSibling.classList.remove('active');
                }
            });
            
            // Toggle current dropdown with smooth animation
            if (isActive) {
                dropdown.classList.remove('active');
                button.classList.remove('active');
            } else {
                dropdown.classList.add('active');
                button.classList.add('active');
            }
        }

        function selectOption(option, value, icon = '') {
            const dropdown = option.parentElement;
            const button = dropdown.previousElementSibling;
            const buttonContent = button.querySelector('.dropdown-button-content');
            
            // Update button content with icon and text
            if (buttonContent) {
                const iconSpan = buttonContent.querySelector('.dropdown-button-icon');
                const textSpan = buttonContent.querySelector('span:not(.dropdown-button-icon)');
                
                if (icon && iconSpan) {
                    iconSpan.textContent = icon;
                }
                
                // Get the option name (first span in option text)
                const optionName = option.querySelector('.dropdown-option-name');
                if (optionName && textSpan) {
                    textSpan.textContent = optionName.textContent;
                } else if (textSpan) {
                    // Fallback for simple text options
                    textSpan.textContent = option.textContent;
                }
            } else {
                // Fallback for buttons without the new structure
                const textSpan = button.querySelector('span:not(.dropdown-arrow)');
                if (textSpan) {
                    textSpan.textContent = option.textContent;
                }
            }
            
            // Store the selected value
            button.setAttribute('data-value', value);
            
            // Close dropdown with animation
            dropdown.classList.remove('active');
            button.classList.remove('active');
            
            // Beautiful success animation
            button.classList.add('success');
            setTimeout(() => button.classList.remove('success'), 300);
        }

        // Transfer method selection
        function selectTransferMethod(option, method) {
            const container = option.parentElement;
            container.querySelectorAll('.transfer-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            option.classList.add('selected');
            
            const panel = option.closest('.panel');
            const powerupForm = panel.querySelector('.powerup-form');
            const bankForm = panel.querySelector('.bank-form');
            const amountGroup = panel.querySelector('.transfer-amount-group');
            const submitBtn = panel.querySelector('.transfer-submit-btn');
            
            if (method === 'powerup') {
                powerupForm.style.display = 'block';
                bankForm.style.display = 'none';
            } else {
                powerupForm.style.display = 'none';
                bankForm.style.display = 'block';
            }
            
            amountGroup.style.display = 'block';
            submitBtn.style.display = 'block';
        }

        // Receipt display function - shows transaction confirmation
        function showReceipt(service, amount, reference) {
            // Close current panel first to ensure smooth transition
            closePanel();
            
            // Wait for panel close animation to complete before showing receipt
            setTimeout(() => {
                const receiptPanel = document.querySelector('.receipt-panel');
                
                // Populate receipt details with transaction information
                document.getElementById('receipt-service').textContent = service;
                document.getElementById('receipt-amount').textContent = amount;
                document.getElementById('receipt-reference').textContent = reference;
                document.getElementById('receipt-date').textContent = new Date().toLocaleString();
                document.getElementById('receipt-total').textContent = amount;
                
                // Show receipt panel with beautiful bounce animation
                showPanel('receipt');
            }, 300); // Delay ensures smooth panel transition
        }

        // Enhanced form submission handler with beautiful animations
// Attach transaction handler only to real service submit buttons
document.querySelectorAll('.submit-btn').forEach(btn => {
    // ✅ Skip the Done button inside the receipt panel
    if (btn.closest('.receipt-panel')) return;

    btn.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent form submission navigation
        
        if (this.disabled) return;

        // Store original button state
        const originalText = this.textContent;
        const panel = this.closest('.panel');
        const panelClass = panel.className.split(' ')[1].replace('-panel', '');

        // Start processing animation
        this.textContent = 'Processing...';
        this.disabled = true;
        this.classList.add('loading'); // Adds shimmer effect

        // Simulate processing
        setTimeout(() => {
            // Success state
            this.textContent = '✓ Success!';
            this.style.background = '#10b981';
            this.classList.remove('loading');
            this.classList.add('success');

            // Show receipt after animation
            setTimeout(() => {
                closePanel();

                // Transaction details
                const amount = panel.querySelector('input[type="number"]')?.value || '1000';
                const reference = 'TXN' + Math.random().toString(36).substr(2, 9).toUpperCase();

                // Service name formatting
                let service = panelClass.charAt(0).toUpperCase() + panelClass.slice(1);
                if (panelClass === 'topup') service = 'Wallet Top Up';
                if (panelClass === 'transfer') service = 'Money Transfer';

                // Display receipt
                showReceipt(service, '₦' + amount, reference);

                // Reset button state
                setTimeout(() => {
                    this.textContent = originalText;
                    this.disabled = false;
                    this.style.background = '';
                    this.classList.remove('success');
                }, 300);
            }, 600);
        }, 800);
    });
});

// ✅ Handle Done button in receipt separately
const doneBtn = document.querySelector('.receipt-panel .submit-btn');
if (doneBtn) {
    doneBtn.addEventListener('click', function(e) {
        e.preventDefault();
        closePanel(); // Just close, no reopen
    });
}


        // Prevent panel close when clicking inside
        document.querySelectorAll('.panel').forEach(panel => {
            panel.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        });

        // Escape key handler
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && currentPanel && !isAnimating) {
                closePanel();
            }
        });

        // Touch optimization for mobile
        if ('ontouchstart' in window) {
            document.querySelectorAll('.service-btn, .network-btn, .amount-btn, .quick-pay-btn').forEach(btn => {
                btn.addEventListener('touchstart', function() {
                    this.style.transform = 'scale(0.95)';
                });
                
                btn.addEventListener('touchend', function() {
                    setTimeout(() => {
                        this.style.transform = '';
                    }, 100);
                });
            });
        }



        















































        // Global state
        let currentFilter = 'all';
        let servicesExpanded = false;
        let analyticsExpanded = false;


        // Modal functions
        function openModal(modalId) {
            const modal = document.getElementById(modalId);
            modal.classList.add('active');
        }

        function closeModal(modalId) {
            const modal = document.getElementById(modalId);
            modal.classList.remove('active');
        }

        // Service functions
        function openService(serviceType) {
            const modal = document.getElementById('service-modal');
            const title = document.getElementById('service-title');
            const content = document.getElementById('service-content');
            
            const services = {
                electricity: {
                    title: 'Buy Electricity',
                    content: `
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium mb-2">Select Provider</label>
                                <select class="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
                                    <option>AEDC (Abuja Electricity Distribution Company)</option>
                                    <option>EKEDC (Eko Electricity Distribution Company)</option>
                                    <option>IKEDC (Ikeja Electric)</option>
                                    <option>PHED (Port Harcourt Electricity Distribution)</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-2">Meter Number</label>
                                <input type="text" placeholder="Enter meter number" class="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-2">Amount (₦)</label>
                                <input type="number" placeholder="Enter amount" class="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
                            </div>
                            <button onclick="processPayment('electricity')" class="w-full btn-primary p-3 rounded-lg font-medium">
                                Buy Electricity
                            </button>
                        </div>
                    `
                },
                airtime: {
                    title: 'Buy Airtime',
                    content: `
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium mb-2">Select Network</label>
                                <div class="grid grid-cols-2 gap-3">
                                    <button class="p-3 border rounded-lg text-center hover:bg-gray-50 dark:hover:bg-gray-800">
                                        <div class="w-8 h-8 bg-yellow-500 rounded mx-auto mb-1"></div>
                                        <span class="text-sm">MTN</span>
                                    </button>
                                    <button class="p-3 border rounded-lg text-center hover:bg-gray-50 dark:hover:bg-gray-800">
                                        <div class="w-8 h-8 bg-green-500 rounded mx-auto mb-1"></div>
                                        <span class="text-sm">Glo</span>
                                    </button>
                                    <button class="p-3 border rounded-lg text-center hover:bg-gray-50 dark:hover:bg-gray-800">
                                        <div class="w-8 h-8 bg-red-500 rounded mx-auto mb-1"></div>
                                        <span class="text-sm">Airtel</span>
                                    </button>
                                    <button class="p-3 border rounded-lg text-center hover:bg-gray-50 dark:hover:bg-gray-800">
                                        <div class="w-8 h-8 bg-blue-500 rounded mx-auto mb-1"></div>
                                        <span class="text-sm">9mobile</span>
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-2">Phone Number</label>
                                <input type="tel" placeholder="Enter phone number" class="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-2">Amount (₦)</label>
                                <div class="grid grid-cols-3 gap-2 mb-3">
                                    <button class="p-2 border rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-800">₦100</button>
                                    <button class="p-2 border rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-800">₦200</button>
                                    <button class="p-2 border rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-800">₦500</button>
                                    <button class="p-2 border rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-800">₦1000</button>
                                    <button class="p-2 border rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-800">₦2000</button>
                                    <button class="p-2 border rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-800">₦5000</button>
                                </div>
                                <input type="number" placeholder="Or enter custom amount" class="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
                            </div>
                            <button onclick="processPayment('airtime')" class="w-full btn-primary p-3 rounded-lg font-medium">
                                Buy Airtime
                            </button>
                        </div>
                    `
                },
                data: {
                    title: 'Buy Data Bundle',
                    content: `
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium mb-2">Select Network</label>
                                <select class="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
                                    <option>MTN Nigeria</option>
                                    <option>Glo Nigeria</option>
                                    <option>Airtel Nigeria</option>
                                    <option>9mobile Nigeria</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-2">Phone Number</label>
                                <input type="tel" placeholder="Enter phone number" class="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-2">Select Data Plan</label>
                                <div class="space-y-2">
                                    <div class="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                                        <div class="flex justify-between">
                                            <span>1GB - 30 Days</span>
                                            <span class="font-bold">₦500</span>
                                        </div>
                                    </div>
                                    <div class="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                                        <div class="flex justify-between">
                                            <span>2GB - 30 Days</span>
                                            <span class="font-bold">₦1,000</span>
                                        </div>
                                    </div>
                                    <div class="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                                        <div class="flex justify-between">
                                            <span>5GB - 30 Days</span>
                                            <span class="font-bold">₦2,500</span>
                                        </div>
                                    </div>
                                    <div class="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                                        <div class="flex justify-between">
                                            <span>10GB - 30 Days</span>
                                            <span class="font-bold">₦5,000</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button onclick="processPayment('data')" class="w-full btn-primary p-3 rounded-lg font-medium">
                                Buy Data Bundle
                            </button>
                        </div>
                    `
                },
                tv: {
                    title: 'TV Subscription',
                    content: `
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium mb-2">Select Provider</label>
                                <select class="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
                                    <option>DStv</option>
                                    <option>GOtv</option>
                                    <option>StarTimes</option>
                                    <option>Netflix</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-2">Smart Card / Account Number</label>
                                <input type="text" placeholder="Enter smart card number" class="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-2">Select Package</label>
                                <div class="space-y-2">
                                    <div class="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                                        <div class="flex justify-between">
                                            <span>DStv Compact</span>
                                            <span class="font-bold">₦9,000</span>
                                        </div>
                                    </div>
                                    <div class="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                                        <div class="flex justify-between">
                                            <span>DStv Compact Plus</span>
                                            <span class="font-bold">₦14,250</span>
                                        </div>
                                    </div>
                                    <div class="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                                        <div class="flex justify-between">
                                            <span>DStv Premium</span>
                                            <span class="font-bold">₦21,000</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button onclick="processPayment('tv')" class="w-full btn-primary p-3 rounded-lg font-medium">
                                Subscribe Now
                            </button>
                        </div>
                    `
                }
            };
            
            const service = services[serviceType] || services.electricity;
            title.textContent = service.title;
            content.innerHTML = service.content;
            
            openModal('service-modal');
            closeModal('quick-actions-modal');
        }

        // Top up function
        function openTopUp() {
            const modal = document.getElementById('service-modal');
            const title = document.getElementById('service-title');
            const content = document.getElementById('service-content');
            
            title.textContent = 'Top Up Wallet';
            content.innerHTML = `
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium mb-2">Select Payment Method</label>
                        <div class="space-y-2">
                            <div class="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-3">
                                <div class="w-8 h-8 bg-blue-500 rounded"></div>
                                <span>Bank Transfer</span>
                            </div>
                            <div class="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-3">
                                <div class="w-8 h-8 bg-green-500 rounded"></div>
                                <span>Debit Card</span>
                            </div>
                            <div class="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-3">
                                <div class="w-8 h-8 bg-purple-500 rounded"></div>
                                <span>USSD</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Amount (₦)</label>
                        <div class="grid grid-cols-3 gap-2 mb-3">
                            <button class="p-2 border rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-800">₦1,000</button>
                            <button class="p-2 border rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-800">₦5,000</button>
                            <button class="p-2 border rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-800">₦10,000</button>
                            <button class="p-2 border rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-800">₦20,000</button>
                            <button class="p-2 border rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-800">₦50,000</button>
                            <button class="p-2 border rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-800">₦100,000</button>
                        </div>
                        <input type="number" placeholder="Or enter custom amount" class="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
                    </div>
                    <button onclick="processPayment('topup')" class="w-full btn-primary p-3 rounded-lg font-medium">
                        Top Up Wallet
                    </button>
                </div>
            `;
            
            openModal('service-modal');
            closeModal('quick-actions-modal');
        }

        // Process payment
        function processPayment(type) {
            const messages = {
                electricity: 'Electricity purchase successful!',
                airtime: 'Airtime top-up successful!',
                data: 'Data bundle purchase successful!',
                tv: 'TV subscription successful!',
                topup: 'Wallet top-up successful!'
            };
            
            showNotification('Payment Successful', messages[type] || 'Payment completed successfully');
            closeModal('service-modal');
            
            // Update balance (simulate)
            setTimeout(() => {
                updateBalance();
            }, 1000);
        }

        // Update balance
        function updateBalance() {
            const balanceElement = document.getElementById('balance-amount');
            const currentBalance = parseFloat(balanceElement.textContent.replace('₦', '').replace(',', ''));
            const newBalance = currentBalance + Math.floor(Math.random() * 5000) + 1000;
            balanceElement.textContent = `₦${newBalance.toLocaleString()}.92`;
        }

        // Transaction filtering
        function filterTransactions(type) {
            currentFilter = type;
            const transactions = document.querySelectorAll('.transaction-item');
            const buttons = ['filter-all', 'filter-income', 'filter-expenses'];
            
            // Update button styles
            buttons.forEach(id => {
                const btn = document.getElementById(id);
                if (id === `filter-${type}`) {
                    btn.className = 'btn-primary px-4 py-2 rounded-lg text-sm font-medium';
                } else {
                    btn.className = 'btn-secondary px-4 py-2 rounded-lg text-sm';
                }
            });
            
            // Filter transactions
            transactions.forEach(transaction => {
                const transactionType = transaction.getAttribute('data-type');
                if (type === 'all' || transactionType === type) {
                    transaction.style.display = 'block';
                } else {
                    transaction.style.display = 'none';
                }
            });
            
            showNotification('Filter Applied', `Showing ${type} transactions`);
        }

        // Show transaction details
        function showTransactionDetails(transactionId) {
            const modal = document.getElementById('transaction-modal');
            const content = document.getElementById('transaction-content');
            
            const transactions = {
                tx1: {
                    title: 'AEDC Electricity Purchase',
                    amount: '-₦5,000',
                    date: 'Today, 2:30 PM',
                    status: 'Completed',
                    reference: 'PWR123456789',
                    details: 'Meter: 04123456789<br>Units: 45.2 kWh<br>Token: 1234-5678-9012-3456'
                },
                tx2: {
                    title: 'MTN Airtime Purchase',
                    amount: '-₦2,000',
                    date: 'Yesterday, 4:15 PM',
                    status: 'Completed',
                    reference: 'AIR987654321',
                    details: 'Phone: +234 803 123 4567<br>Network: MTN Nigeria<br>Bonus: ₦200 extra airtime'
                }
            };
            
            const transaction = transactions[transactionId] || transactions.tx1;
            
            content.innerHTML = `
                <div class="space-y-4">
                    <div class="text-center">
                        <h3 class="text-xl font-bold">${transaction.title}</h3>
                        <p class="text-3xl font-bold ${transaction.amount.startsWith('-') ? 'text-red-400' : 'text-green-400'} mt-2">${transaction.amount}</p>
                        <p class="text-sm opacity-60">${transaction.date}</p>
                    </div>
                    <div class="border-t pt-4">
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <p class="text-sm opacity-60">Status</p>
                                <p class="font-semibold text-green-400">${transaction.status}</p>
                            </div>
                            <div>
                                <p class="text-sm opacity-60">Reference</p>
                                <p class="font-semibold">${transaction.reference}</p>
                            </div>
                        </div>
                    </div>
                    <div class="border-t pt-4">
                        <p class="text-sm opacity-60 mb-2">Transaction Details</p>
                        <div class="text-sm">${transaction.details}</div>
                    </div>
                    <div class="flex gap-3">
                        <button onclick="downloadReceipt('${transactionId}')" class="flex-1 btn-secondary p-3 rounded-lg font-medium">
                            Download Receipt
                        </button>
                        <button onclick="shareTransaction('${transactionId}')" class="flex-1 btn-primary p-3 rounded-lg font-medium">
                            Share
                        </button>
                    </div>
                </div>
            `;
            
            openModal('transaction-modal');
        }

        // Show account details
        function showAccountDetails(accountType) {
            const modal = document.getElementById('account-modal');
            const content = document.getElementById('account-content');
            
            const accounts = {
                electricity: {
                    title: 'AEDC Electricity Account',
                    details: `
                        <div class="space-y-4">
                            <div class="text-center">
                                <div class="w-16 h-16 primary-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                                    </svg>
                                </div>
                                <h3 class="text-xl font-bold">AEDC Electricity</h3>
                                <p class="text-sm opacity-60">Meter: 04123456789</p>
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <div class="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <p class="text-sm opacity-60">Current Balance</p>
                                    <p class="font-bold text-lg">₦2,847</p>
                                </div>
                                <div class="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <p class="text-sm opacity-60">This Month Usage</p>
                                    <p class="font-bold text-lg">156.2 kWh</p>
                                </div>
                            </div>
                            <div class="space-y-2">
                                <div class="flex justify-between">
                                    <span class="text-sm">Account Name:</span>
                                    <span class="text-sm font-semibold">John Doe</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-sm">Tariff Class:</span>
                                    <span class="text-sm font-semibold">R2 - Residential</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-sm">Last Recharge:</span>
                                    <span class="text-sm font-semibold">Today, 2:30 PM</span>
                                </div>
                            </div>
                            <div class="flex gap-3">
                                <button onclick="openService('electricity')" class="flex-1 btn-primary p-3 rounded-lg font-medium">
                                    Buy Electricity
                                </button>
                                <button onclick="viewHistory('electricity')" class="flex-1 btn-secondary p-3 rounded-lg font-medium">
                                    View History
                                </button>
                            </div>
                        </div>
                    `
                }
            };
            
            const account = accounts[accountType] || accounts.electricity;
            content.innerHTML = account.details;
            
            openModal('account-modal');
        }

        // Toggle services
        function toggleServices() {
            const additionalServices = document.getElementById('additional-services');
            const toggleText = document.getElementById('services-toggle-text');
            
            servicesExpanded = !servicesExpanded;
            
            if (servicesExpanded) {
                additionalServices.classList.add('expanded');
                toggleText.textContent = 'Show Less';
            } else {
                additionalServices.classList.remove('expanded');
                toggleText.textContent = 'View All';
            }
        }

        // Show notifications
        function showNotifications() {
            showNotification('Notifications', 'You have 3 new notifications');
        }

        // Show profile
        function showProfile() {
            showNotification('Profile', 'Profile settings opened');
        }

        // Show quick actions
        function showQuickActions() {
            openModal('quick-actions-modal');
        }

        // Show notification
        function showNotification(title, message) {
            const notification = document.getElementById('notification');
            const titleElement = document.getElementById('notification-title');
            const messageElement = document.getElementById('notification-message');
            
            titleElement.textContent = title;
            messageElement.textContent = message;
            
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }

        // Chart interaction
        function showChartData(month) {
            const data = {
                'Jan': '₦18,500',
                'Feb': '₦22,300',
                'Mar': '₦19,800',
                'Apr': '₦21,200',
                'May': '₦24,847',
                'Jun': '₦20,100',
                'Jul': '₦23,400',
                'Aug': '₦17,900',
                'Sep': '₦21,600',
                'Oct': '₦19,300'
            };
            
            showNotification(`${month} Balance`, data[month] || '₦20,000');
        }

        // Load more transactions
        function loadMoreTransactions() {
            showNotification('Loading', 'Loading more transactions...');
            
            setTimeout(() => {
                showNotification('Loaded', 'More transactions loaded successfully');
            }, 1500);
        }

        // Additional utility functions
        function downloadReceipt(transactionId) {
            showNotification('Download', 'Receipt downloaded successfully');
            closeModal('transaction-modal');
        }

        function shareTransaction(transactionId) {
            showNotification('Share', 'Transaction details shared');
            closeModal('transaction-modal');
        }

        function addAccount() {
            showNotification('Add Account', 'Account addition form opened');
        }

        function showDetails(type) {
            showNotification('Details', `Showing ${type} details`);
        }

        function showCategoryDetails(category) {
            showNotification('Category', `${category} spending details`);
        }

        function editBudget(type) {
            showNotification('Budget', `${type} budget settings opened`);
        }

        function toggleAnalytics() {
            const toggle = document.getElementById('analytics-toggle');
            analyticsExpanded = !analyticsExpanded;
            
            if (analyticsExpanded) {
                toggle.textContent = 'Summary';
                showNotification('Analytics', 'Detailed analytics view');
            } else {
                toggle.textContent = 'Details';
                showNotification('Analytics', 'Summary analytics view');
            }
        }

        function viewHistory(type) {
            showNotification('History', `${type} transaction history`);
            closeModal('account-modal');
        }

        // Initialize app
        document.addEventListener('DOMContentLoaded', function() {
            // Animate progress bars on load
            const progressBars = document.querySelectorAll('.progress-bar');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.width = entry.target.style.width;
                    }
                });
            });

            progressBars.forEach(bar => observer.observe(bar));

            // Add ripple effect to buttons
            const buttons = document.querySelectorAll('button');
            buttons.forEach(button => {
                button.addEventListener('click', function(e) {
                    const ripple = document.createElement('span');
                    const rect = this.getBoundingClientRect();
                    const size = Math.max(rect.width, rect.height);
                    const x = e.clientX - rect.left - size / 2;
                    const y = e.clientY - rect.top - size / 2;
                    
                    ripple.style.cssText = `
                        position: absolute;
                        width: ${size}px;
                        height: ${size}px;
                        left: ${x}px;
                        top: ${y}px;
                        background: rgba(255, 255, 255, 0.3);
                        border-radius: 50%;
                        transform: scale(0);
                        animation: ripple 0.6s linear;
                        pointer-events: none;
                    `;
                    
                    this.style.position = 'relative';
                    this.style.overflow = 'hidden';
                    this.appendChild(ripple);
                    
                    setTimeout(() => ripple.remove(), 600);
                });
            });

            // Close modals when clicking outside
            document.querySelectorAll('.modal').forEach(modal => {
                modal.addEventListener('click', function(e) {
                    if (e.target === this) {
                        this.classList.remove('active');
                    }
                });
            });

            // Show welcome notification
            setTimeout(() => {
                showNotification('Welcome! PowerUp is ready to use');
            }, 1000);
        });

        // Add ripple animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    


























 // Avatar functionality
        function changeAvatar() {
            document.getElementById('avatar-input').click();
        }

        function handleAvatarChange(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const avatar = document.getElementById('avatar');
                    avatar.style.backgroundImage = `url(${e.target.result})`;
                    avatar.style.backgroundSize = 'cover';
                    avatar.style.backgroundPosition = 'center';
                    document.getElementById('avatar-text').style.display = 'none';
                    showNotification('Profile picture updated successfully');
                };
                reader.readAsDataURL(file);
            }
        }

        // Modal functionality
        function editProfile() {
            document.getElementById('edit-modal').classList.add('active');
        }

        function closeModal() {
            document.getElementById('edit-modal').classList.remove('active');
        }

        function changePassword() {
            document.getElementById('password-modal').classList.add('active');
        }

        function closePasswordModal() {
            document.getElementById('password-modal').classList.remove('active');
        }

        // Form functionality
        function saveProfile(event) {
            event.preventDefault();
            
            const name = document.getElementById('edit-name').value;
            const email = document.getElementById('edit-email').value;
            const phone = document.getElementById('edit-phone').value;
            const location = document.getElementById('edit-location').value;
            
            // Update display fields
            document.getElementById('profile-name').textContent = name;
            document.getElementById('display-name').textContent = name;
            document.getElementById('display-email').textContent = email;
            document.getElementById('display-phone').textContent = phone;
            document.getElementById('display-location').textContent = location;
            
            // Update avatar initials
            document.getElementById('avatar-text').textContent = name.split(' ').map(n => n[0]).join('');
            
            closeModal();
            showNotification('Profile updated successfully');
        }

        function submitPasswordChange(event) {
            event.preventDefault();
            closePasswordModal();
            showNotification('Password changed successfully');
        }

        // Notification system
        function showNotification(message) {
            const notification = document.getElementById('notification');
            notification.querySelector('div:last-child').textContent = message;
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }

        // Close modals when clicking outside
        document.getElementById('edit-modal').addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });

        document.getElementById('password-modal').addEventListener('click', function(e) {
            if (e.target === this) {
                closePasswordModal();
            }
        });
























 // Font size controls
        const decreaseFont = document.getElementById('decreaseFont');
        const increaseFont = document.getElementById('increaseFont');
        const currentFontSize = document.getElementById('currentFontSize');
        let fontSize = 16;

        decreaseFont.addEventListener('click', () => {
            if (fontSize > 12) {
                fontSize -= 2;
                updateFontSize();
            }
        });

        increaseFont.addEventListener('click', () => {
            if (fontSize < 18) {
                fontSize += 2;
                updateFontSize();
            }
        });

        function updateFontSize() {
            document.documentElement.style.setProperty('--font-size', fontSize + 'px');
            currentFontSize.textContent = fontSize + 'px';
            showNotification('Font size updated!');
        }

        // Toggle switches
        function setupToggle(toggleId) {
            const toggle = document.getElementById(toggleId);
            toggle.addEventListener('click', () => {
                toggle.classList.toggle('active');
                showNotification('Setting updated!');
            });
        }

        setupToggle('lowBalanceToggle');
        setupToggle('autoRenewalToggle');

        // Save functions
        function savePhoneNumber() {
            const phoneNumber = document.getElementById('phoneNumber').value;
            if (phoneNumber.trim()) {
                showNotification('Phone number updated successfully!');
            } else {
                showNotification('Please enter a valid phone number!', 'warning');
            }
        }

        function saveMeterNumber() {
            const meterNumber = document.getElementById('meterNumber').value;
            if (meterNumber.trim()) {
                showNotification('Meter number updated successfully!');
            } else {
                showNotification('Please enter a valid meter number!', 'warning');
            }
        }

        function saveIUCNumber() {
            const iucNumber = document.getElementById('iucNumber').value;
            if (iucNumber.trim()) {
                showNotification('IUC number updated successfully!');
            } else {
                showNotification('Please enter a valid IUC number!', 'warning');
            }
        }

        // Purchase functions
        function topUpWallet() {
            const currentBalance = parseFloat(document.getElementById('walletBalance').textContent.replace(',', ''));
            const newBalance = currentBalance + 5000;
            document.getElementById('walletBalance').textContent = newBalance.toLocaleString() + '.00';
            showNotification('Wallet topped up with ₦5,000!');
        }

        function buyAirtime() {
            const currentAirtime = parseFloat(document.getElementById('airtimeBalance').textContent.replace(',', ''));
            const newAirtime = currentAirtime + 1000;
            document.getElementById('airtimeBalance').textContent = newAirtime.toLocaleString() + '.00';
            
            const currentWallet = parseFloat(document.getElementById('walletBalance').textContent.replace(',', ''));
            const newWallet = currentWallet - 1000;
            document.getElementById('walletBalance').textContent = newWallet.toLocaleString() + '.00';
            
            showNotification('₦1,000 airtime purchased successfully!');
        }

        function buyData() {
            const currentData = parseFloat(document.getElementById('dataBalance').textContent);
            const newData = currentData + 2.0;
            document.getElementById('dataBalance').textContent = newData.toFixed(1);
            
            const currentWallet = parseFloat(document.getElementById('walletBalance').textContent.replace(',', ''));
            const newWallet = currentWallet - 1500;
            document.getElementById('walletBalance').textContent = newWallet.toLocaleString() + '.00';
            
            showNotification('2GB data bundle purchased successfully!');
        }

        // Notification system
        function showNotification(message, type = 'success') {
            const notification = document.getElementById('notification');
            notification.textContent = message;
            
            if (type === 'warning') {
                notification.style.background = 'var(--warning)';
                notification.style.color = 'var(--warning-foreground)';
            } else {
                notification.style.background = 'var(--success)';
                notification.style.color = 'var(--success-foreground)';
            }
            
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }

        // Simulate live data updates
        function simulateLiveUpdates() {
            // Simulate electricity usage
            setInterval(() => {
                const electricityUnits = document.getElementById('electricityUnits');
                let currentUnits = parseFloat(electricityUnits.textContent);
                if (currentUnits > 0) {
                    currentUnits -= 0.1;
                    electricityUnits.textContent = currentUnits.toFixed(1);
                }
            }, 30000); // Update every 30 seconds

            // Simulate data usage
            setInterval(() => {
                const dataBalance = document.getElementById('dataBalance');
                let currentData = parseFloat(dataBalance.textContent);
                if (currentData > 0) {
                    currentData -= 0.01;
                    dataBalance.textContent = currentData.toFixed(2);
                }
            }, 60000); // Update every minute
        }

        // Initialize live updates
        simulateLiveUpdates();






