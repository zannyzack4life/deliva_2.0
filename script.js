let sidebarOpen = true;
let sidebarCollapsed = false;
let currentPage = 'dashboard';
let isDragging = false;
let dragOffset = { x: 0, y: 0 };
let currentTextColor = '#ffffff';
let currentTheme = 'dark';
let savedCreations = JSON.parse(localStorage.getItem('inspireverse_creations') || '[]');

const PIXABAY_API_KEY = '37298187-8e82cfbe6f0290745835f5f68';

document.addEventListener('DOMContentLoaded', () => {
    const mobileTextShadow = document.getElementById('textShadow');
    const desktopTextShadow = document.getElementById('textShadowDesktop');
    if (mobileTextShadow) mobileTextShadow.addEventListener('input', updateTextShadow);
    if (desktopTextShadow) desktopTextShadow.addEventListener('input', updateTextShadow);

    const mobileLetterSpacing = document.getElementById('letterSpacing');
    const desktopLetterSpacing = document.getElementById('letterSpacingDesktop');
    if (mobileLetterSpacing) mobileLetterSpacing.addEventListener('input', updateLetterSpacing);
    if (desktopLetterSpacing) desktopLetterSpacing.addEventListener('input', updateLetterSpacing);

    const mobileLineHeight = document.getElementById('lineHeight');
    const desktopLineHeight = document.getElementById('lineHeightDesktop');
    if (mobileLineHeight) mobileLineHeight.addEventListener('input', updateLineHeight);
    if (desktopLineHeight) desktopLineHeight.addEventListener('input', updateLineHeight);
});

function showPopup(message, type = 'success') {
    const popup = document.getElementById('popup');
    const icon = document.getElementById('popupIcon');
    const messageEl = document.getElementById('popupMessage');
    
    messageEl.textContent = message;
    
    // Set popup style based on type
    popup.className = 'fixed top-4 right-[-7px] text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-transform duration-300';
    
    if (type === 'success') {
        popup.classList.add('bg-green-600');
        icon.className = 'fas fa-check-circle mr-2';
    } else if (type === 'error') {
        popup.classList.add('bg-red-600');
        icon.className = 'fas fa-exclamation-circle mr-2';
    } else if (type === 'info') {
        popup.classList.add('bg-blue-600');
        icon.className = 'fas fa-info-circle mr-2';
    }
    
    // Show popup
    popup.classList.remove('translate-x-full');
    
    // Hide after 3 seconds
    setTimeout(() => {
        popup.classList.add('translate-x-full');
    }, 3000);
}

// Unsplash image collections
const unsplashCollections = [
    'family', 'landscape', 'abstract', 'urban', 'business', 'lifestyle',
    'mountain', 'ocean', 'sky', 'person', 'sunset', 'architecture'
];

let backgroundIndex = 0;

// Sample AI quotes by mood
const aiQuotes = {
    'Inspirational': [
        "The only way to do great work is to love what you do.",
        "Believe you can and you're halfway there.",
        "Your limitation—it's only your imagination.",
        "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        "The future belongs to those who believe in the beauty of their dreams.",
        "Act as if what you do makes a difference. It does.",
        "Don’t wait for opportunity. Create it.",
        "Start where you are. Use what you have. Do what you can.",
        "With the new day comes new strength and new thoughts.",
        "Do something today that your future self will thank you for.",
        "Hardships often prepare ordinary people for an extraordinary destiny.",
        "Turn your wounds into wisdom.",
        "It always seems impossible until it’s done.",
        "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
        "Keep your face always toward the sunshine—and shadows will fall behind you.",
        "You are never too old to set another goal or to dream a new dream.",
        "Great things are done by a series of small things brought together.",
        "Perseverance is not a long race; it is many short races one after the other.",
        "Don’t count the days, make the days count.",
        "Fall seven times and stand up eight."
    ],
    'Motivational': [
        "Push yourself, because no one else is going to do it for you.",
        "Great things never come from comfort zones.",
        "Dream it. Wish it. Do it.",
        "Don't stop when you're tired. Stop when you're done.",
        "Wake up with determination. Go to bed with satisfaction.",
        "Do something today that your future self will thank you for.",
        "Little things make big days.",
        "It’s going to be hard, but hard does not mean impossible.",
        "Don’t wait for the right opportunity: create it.",
        "Your only limit is your mind.",
        "Work while they sleep. Learn while they party. Save while they spend. Live like they dream.",
        "Go the extra mile. It’s never crowded.",
        "Success doesn’t just find you. You have to go out and get it.",
        "Dream bigger. Do bigger.",
        "Stay positive, work hard, make it happen.",
        "Don’t wish for it. Work for it.",
        "Be stronger than your excuses.",
        "Discipline is choosing between what you want now and what you want most.",
        "Success is what happens after you have survived all your mistakes.",
        "Act like it’s impossible to fail."
    ],
    'Happy': [
        "Happiness is not by chance, but by choice.",
        "Every day is a good day when you paint.",
        "Smile big, laugh often.",
        "Choose joy every single day.",
        "Life is beautiful when you find beauty in everything.",
        "Happiness is not something ready made. It comes from your own actions.",
        "Count your age by friends, not years. Count your life by smiles, not tears.",
        "Happiness is the best makeup.",
        "Do more things that make you forget to check your phone.",
        "The purpose of our lives is to be happy.",
        "A smile is happiness you’ll find right under your nose.",
        "Enjoy the little things, for one day you may look back and realize they were the big things.",
        "Happiness held is the seed; happiness shared is the flower.",
        "Happiness depends upon ourselves.",
        "Joy is not in things; it is in us.",
        "The secret to happiness is freedom, and the secret to freedom is courage.",
        "Wherever you go, no matter what the weather, always bring your own sunshine.",
        "When you love what you have, you have everything you need.",
        "Happiness is a warm puppy.",
        "Happiness is a direction, not a place."
    ],
    'Peaceful': [
        "Peace comes from within. Do not seek it without.",
        "In the midst of chaos, find your calm.",
        "Breathe in peace, breathe out stress.",
        "Silence is the sleep that nourishes wisdom.",
        "Find peace in the present moment.",
        "Nothing can bring you peace but yourself.",
        "Peace begins with a smile.",
        "Do not let the behavior of others destroy your inner peace.",
        "The life of inner peace, being harmonious and without stress, is the easiest type of existence.",
        "When you find peace within yourself, you become the kind of person who can live at peace with others.",
        "Peace is liberty in tranquility.",
        "The less you respond to negativity, the more peaceful your life becomes.",
        "Peace is not the absence of conflict, but the ability to cope with it.",
        "Let go of the thoughts that don’t make you strong.",
        "Calm mind brings inner strength and self-confidence.",
        "Inner peace is the new success.",
        "Within you, there is a stillness and a sanctuary.",
        "Peace is always beautiful.",
        "Walk in peace, live in harmony.",
        "Choose peace over drama."
    ],
    'Thoughtful': [
        "The mind is everything. What you think you become.",
        "Wisdom is not a product of schooling but of the lifelong attempt to acquire it.",
        "Think deeply, speak gently, love much.",
        "The unexamined life is not worth living.",
        "Knowledge speaks, but wisdom listens.",
        "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
        "The more I read, the more I acquire, the more certain I am that I know nothing.",
        "An investment in knowledge pays the best interest.",
        "All that we are is the result of what we have thought.",
        "He who opens a school door, closes a prison.",
        "Knowing yourself is the beginning of all wisdom.",
        "We don’t see things as they are, we see them as we are.",
        "Education is not the learning of facts, but the training of the mind to think.",
        "Judge a man by his questions rather than his answers.",
        "Not everything that can be counted counts, and not everything that counts can be counted.",
        "The only true wisdom is in knowing you know nothing.",
        "An intelligent mind is never bored.",
        "Learn from yesterday, live for today, hope for tomorrow.",
        "Curiosity is the beginning of wisdom.",
        "A wise man learns more from his enemies than a fool from his friends."
    ],
    'Success': [
        "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        "The way to get started is to quit talking and begin doing.",
        "Don't be afraid to give up the good to go for the great.",
        "Success is walking from failure to failure with no loss of enthusiasm.",
        "The only impossible journey is the one you never begin.",
        "Opportunities don’t happen. You create them.",
        "Don’t be distracted by criticism. Remember—the only taste of success some people get is to take a bite out of you.",
        "Success usually comes to those who are too busy to be looking for it.",
        "The road to success and the road to failure are almost exactly the same.",
        "I find that the harder I work, the more luck I seem to have.",
        "There are no secrets to success. It is the result of preparation, hard work, and learning from failure.",
        "If you really look closely, most overnight successes took a long time.",
        "The secret of success is to do the common thing uncommonly well.",
        "I never dreamed about success. I worked for it.",
        "Don’t let the fear of losing be greater than the excitement of winning.",
        "Success is not in what you have, but who you are.",
        "To be successful, you must accept all challenges that come your way.",
        "The difference between who you are and who you want to be is what you do.",
        "Success is simple. Do what’s right, the right way, at the right time.",
        "Don’t watch the clock; do what it does. Keep going."
    ]
};


// Community quotes with designer names
const communityQuotes = [
    { 
        quote: "Design is not just what it looks like and feels like. Design is how it works.", 
        author: "Sarah Chen", 
        title: "UI/UX Designer",
        downloads: 1247,
        likes: 892
    },
    { 
        quote: "Creativity is intelligence having fun.", 
        author: "Marcus Rodriguez", 
        title: "Creative Director",
        downloads: 2156,
        likes: 1543
    },
    { 
        quote: "The best way to predict the future is to create it.", 
        author: "Emma Thompson", 
        title: "Brand Designer",
        downloads: 987,
        likes: 654
    },
    { 
        quote: "Innovation distinguishes between a leader and a follower.", 
        author: "David Kim", 
        title: "Product Designer",
        downloads: 1876,
        likes: 1234
    },
    { 
        quote: "Simplicity is the ultimate sophistication.", 
        author: "Lisa Wang", 
        title: "Graphic Designer",
        downloads: 3421,
        likes: 2187
    },
    { 
        quote: "Art is not what you see, but what you make others see.", 
        author: "James Miller", 
        title: "Visual Artist",
        downloads: 1654,
        likes: 987
    },
    { 
        quote: "Every great design begins with an even better story.", 
        author: "Sophia Garcia", 
        title: "Brand Strategist",
        downloads: 2341,
        likes: 1765
    },
    { 
        quote: "Design creates culture. Culture shapes values. Values determine the future.", 
        author: "Alex Johnson", 
        title: "Design Lead",
        downloads: 1432,
        likes: 876
    }
];

// Initialize app
setTimeout(() => {
    document.getElementById('loadingScreen').style.display = 'none';
    document.getElementById('mainApp').classList.remove('hidden');
    document.getElementById('mainApp').classList.add('fade-in');
    initializeBackgrounds();
    initializeGallery();
    initializeExplore();
    setupCanvasDragging();
    loadTheme();
}, 2000);

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
        if (sidebarOpen) {
            // Close sidebar
            sidebar.classList.remove('sidebar-open');
            mainContent.classList.remove('content-pushed');
            sidebarOpen = false;
        } else {
            // Open sidebar
            sidebar.classList.add('sidebar-open');
            mainContent.classList.add('content-pushed');
            sidebarOpen = true;
        }
    } else {
        // Desktop behavior
        if (sidebarCollapsed) {
            sidebar.style.width = '256px';
            sidebar.classList.remove('sidebar-collapsed');
            sidebarCollapsed = false;
        } else {
            sidebar.style.width = '80px';
            sidebar.classList.add('sidebar-collapsed');
            sidebarCollapsed = true;
        }
    }
}

function showPage(page) {
    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.className = 'nav-btn w-full flex items-center p-3 rounded-lg hover:bg-tertiary transition-colors';
    });
    event.target.closest('.nav-btn').className = 'nav-btn w-full flex items-center p-3 rounded-lg bg-purple-600 text-white';
    
    // Hide all pages
    document.querySelectorAll('[id$="Page"]').forEach(p => p.classList.add('hidden'));
    
    // Show selected page
    document.getElementById(page + 'Page').classList.remove('hidden');
    currentPage = page;
    
    // Show/hide dashboard action bar
    const actionBar = document.getElementById('dashboardActionBar');
    if (page === 'dashboard') {
        actionBar.classList.remove('hidden');
    } else {
        actionBar.classList.add('hidden');
    }
    
    // Update header title
    const titles = {
        'dashboard': 'Dashboard',
        'gallery': 'My Creations',
        'explore': 'Explore',
        'profile': 'Profile',
        'settings': 'Settings'
    };
    document.querySelector('header h1').textContent = titles[page];
    
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 768 && sidebarOpen) {
        setTimeout(() => {
            toggleSidebar();
        }, 150);
    }
}

function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    const themeToggle = document.getElementById('themeToggle');
    const settingsThemeIcon = document.getElementById('settingsThemeIcon');
    const themeText = document.getElementById('themeText');
    
    if (currentTheme === 'light') {
        themeToggle.checked = false;
        if (settingsThemeIcon) settingsThemeIcon.className = 'fas fa-sun mr-2';
        if (themeText) themeText.textContent = 'Light Mode';
    } else {
        themeToggle.checked = true;
        if (settingsThemeIcon) settingsThemeIcon.className = 'fas fa-moon mr-2';
        if (themeText) themeText.textContent = 'Dark Mode';
    }
    
    localStorage.setItem('inspireverse_theme', currentTheme);
}

function openAIGenerator() {
    document.getElementById('aiGeneratorModal').classList.remove('hidden');
    regenerateAIQuote();
}

function closeAIGenerator() {
    document.getElementById('aiGeneratorModal').classList.add('hidden');
}

let currentAIQuote = '';
let currentAIBackground = '';

function regenerateAIQuote() {
    const mood = document.getElementById('aiMoodSelect').value;
    const quotes = aiQuotes[mood];
    currentAIQuote = quotes[Math.floor(Math.random() * quotes.length)];
    
    // Set random background
    const backgrounds = [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'https://cdn.pixabay.com/photo/2017/02/01/22/02/mountain-landscape-2031539_640.jpg',
        'https://cdn.pixabay.com/photo/2015/12/01/20/28/road-1072823_640.jpg',
        'https://cdn.pixabay.com/photo/2016/08/09/21/54/lake-1581879_640.jpg'
    ];
    currentAIBackground = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    
    // Apply to AI canvas
    const aiCanvas = document.getElementById('aiCanvas');
    const aiCanvasText = document.getElementById('aiCanvasText');
    
    if (currentAIBackground.startsWith('http')) {
        aiCanvas.style.backgroundImage = `url(${currentAIBackground})`;
        aiCanvas.style.backgroundSize = 'cover';
        aiCanvas.style.backgroundPosition = 'center';
        aiCanvas.style.background = 'none';
    } else {
        aiCanvas.style.background = currentAIBackground;
        aiCanvas.style.backgroundImage = 'none';
    }
    
    // Typewriter effect
    aiCanvasText.textContent = '';
    let i = 0;
    const typeWriter = () => {
        if (i < currentAIQuote.length) {
            aiCanvasText.textContent += currentAIQuote.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    };
    typeWriter();
}

function setAIBackground(type) {
    const backgrounds = {
        'gradient1': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient2': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'gradient3': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'image1': 'https://cdn.pixabay.com/photo/2017/02/01/22/02/mountain-landscape-2031539_640.jpg',
        'image2': 'https://cdn.pixabay.com/photo/2015/12/01/20/28/road-1072823_640.jpg',
        'image3': 'https://cdn.pixabay.com/photo/2016/08/09/21/54/lake-1581879_640.jpg'
    };
    
    currentAIBackground = backgrounds[type];
    const aiCanvas = document.getElementById('aiCanvas');
    
    if (currentAIBackground.startsWith('http')) {
        aiCanvas.style.backgroundImage = `url(${currentAIBackground})`;
        aiCanvas.style.backgroundSize = 'cover';
        aiCanvas.style.backgroundPosition = 'center';
        aiCanvas.style.background = 'none';
    } else {
        aiCanvas.style.background = currentAIBackground;
        aiCanvas.style.backgroundImage = 'none';
    }
}

function useAIQuote() {
    document.getElementById('quoteInput').value = currentAIQuote;
    if (currentAIBackground.startsWith('http')) {
        setCanvasBackground(`url(${currentAIBackground})`);
    } else {
        setCanvasBackground(currentAIBackground);
    }
    updateCanvasText();
    closeAIGenerator();
    showPopup('AI quote applied to canvas!', 'success');
}

function updateProfile() {
    const name = document.getElementById('displayName').value;
    const email = document.getElementById('userEmail').value;
    const bio = document.getElementById('userBio').value;
    
    // Save to localStorage (in a real app, this would be sent to a server)
    localStorage.setItem('inspireverse_profile', JSON.stringify({
        name, email, bio
    }));
    
    showPopup('Profile updated successfully!', 'success');
}

function updateInterfaceFontSize() {
    const fontSize = document.getElementById('interfaceFontSize').value;
    document.getElementById('fontSizeDisplay').textContent = fontSize + 'px';
    document.documentElement.style.fontSize = fontSize + 'px';
    localStorage.setItem('inspireverse_fontSize', fontSize);
}

function loadTheme() {
    const savedTheme = localStorage.getItem('inspireverse_theme') || 'dark';
    currentTheme = savedTheme;
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    const themeToggle = document.getElementById('themeToggle');
    const settingsThemeIcon = document.getElementById('settingsThemeIcon');
    const themeText = document.getElementById('themeText');
    
    if (currentTheme === 'light') {
        if (themeToggle) themeToggle.checked = false;
        if (settingsThemeIcon) settingsThemeIcon.className = 'fas fa-sun mr-2';
        if (themeText) themeText.textContent = 'Light Mode';
    } else {
        if (themeToggle) themeToggle.checked = true;
        if (settingsThemeIcon) settingsThemeIcon.className = 'fas fa-moon mr-2';
        if (themeText) themeText.textContent = 'Dark Mode';
    }
    
    // Load font size
    const savedFontSize = localStorage.getItem('inspireverse_fontSize') || '16';
    document.documentElement.style.fontSize = savedFontSize + 'px';
    if (document.getElementById('interfaceFontSize')) {
        document.getElementById('interfaceFontSize').value = savedFontSize;
        document.getElementById('fontSizeDisplay').textContent = savedFontSize + 'px';
    }
}

function toggleAIDropdown() {
    const dropdown = document.getElementById('aiDropdown');
    dropdown.classList.toggle('open');
}

function toggleAIDropdownMobile() {
    const dropdown = document.getElementById('aiDropdownMobile');
    dropdown.classList.toggle('open');
}

function toggleMoodDropdown() {
    const dropdown = document.getElementById('moodDropdown');
    dropdown.classList.toggle('open');
}

function toggleMoodDropdownMobile() {
    const dropdown = document.getElementById('moodDropdownMobile');
    dropdown.classList.toggle('open');
}

function selectMood(mood) {
    document.getElementById('selectedMood').textContent = mood;
    document.getElementById('moodDropdown').classList.remove('open');
}

function selectMoodMobile(mood) {
    document.getElementById('selectedMoodMobile').textContent = mood;
    document.getElementById('moodDropdownMobile').classList.remove('open');
}

function generateAIQuote() {
    const selectedMood = document.getElementById('selectedMood').textContent;
    if (selectedMood === 'Select mood...') {
        showPopup('Please select a mood first!', 'error');
        return;
    }
    
    const quotes = aiQuotes[selectedMood];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    
    // Typewriter effect
    const quoteInput = document.getElementById('quoteInput');
    const quoteInputDesktop = document.getElementById('quoteInputDesktop');
    
    if (quoteInput) quoteInput.value = '';
    if (quoteInputDesktop) quoteInputDesktop.value = '';
    
    if (quoteInput) quoteInput.classList.add('typewriter');
    
    let i = 0;
    const typeWriter = () => {
        if (i < randomQuote.length) {
            if (quoteInput) quoteInput.value += randomQuote.charAt(i);
            if (quoteInputDesktop) quoteInputDesktop.value += randomQuote.charAt(i);
            updateCanvasText();
            i++;
            setTimeout(typeWriter, 50);
        } else {
            if (quoteInput) quoteInput.classList.remove('typewriter');
            showPopup('AI quote generated successfully!', 'success');
        }
    };
    
    typeWriter();
    toggleAIDropdown();
}

function generateAIQuoteMobile() {
    const selectedMood = document.getElementById('selectedMoodMobile').textContent;
    if (selectedMood === 'Select mood...') {
        showPopup('Please select a mood first!', 'error');
        return;
    }
    
    const quotes = aiQuotes[selectedMood];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    
    // Typewriter effect (assuming mobile uses 'quoteInput' like desktop; adjust if mobile has a separate input ID)
    const quoteInput = document.getElementById('quoteInput');  // Or use 'quoteInputMobile' if you have a separate one
    const quoteInputDesktop = document.getElementById('quoteInputDesktop');
    
    if (quoteInput) quoteInput.value = '';
    if (quoteInputDesktop) quoteInputDesktop.value = '';
    
    if (quoteInput) quoteInput.classList.add('typewriter');
    
    let i = 0;
    const typeWriter = () => {
        if (i < randomQuote.length) {
            if (quoteInput) quoteInput.value += randomQuote.charAt(i);
            if (quoteInputDesktop) quoteInputDesktop.value += randomQuote.charAt(i);
            updateCanvasText();
            i++;
            setTimeout(typeWriter, 50);
        } else {
            if (quoteInput) quoteInput.classList.remove('typewriter');
            showPopup('AI quote generated successfully!', 'success');
        }
    };
    
    typeWriter();
    // Close the dropdown (assuming you want to toggle it closed after generation)
    document.getElementById('aiDropdownMobile').classList.remove('open');
}

// Sync functions for desktop/mobile inputs
function syncQuoteInputs(source) {
    const mobileInput = document.getElementById('quoteInput');
    const desktopInput = document.getElementById('quoteInputDesktop');
    
    if (source.id === 'quoteInput') {
        if (desktopInput) desktopInput.value = source.value;
    } else {
        if (mobileInput) mobileInput.value = source.value;
    }
    updateCanvasText();
}

function syncBrandInputs(source) {
    const mobileInput = document.getElementById('brandInput');
    const desktopInput = document.getElementById('brandInputDesktop');
    
    if (source.id === 'brandInput') {
        if (desktopInput) desktopInput.value = source.value;
    } else {
        if (mobileInput) mobileInput.value = source.value;
    }
    updateBrandText();
}

function syncFontSize(source) {
    const mobileSlider = document.getElementById('fontSize');
    const desktopSlider = document.getElementById('fontSizeDesktop');
    const mobileValue = document.getElementById('fontSizeValue');
    const desktopValue = document.getElementById('fontSizeValueDesktop');
    
    if (source.id === 'fontSize') {
        if (desktopSlider) desktopSlider.value = source.value;
        if (desktopValue) desktopValue.textContent = source.value + 'px';
    } else {
        if (mobileSlider) mobileSlider.value = source.value;
        if (mobileValue) mobileValue.textContent = source.value + 'px';
    }
    
    const canvasText = document.getElementById('canvasText');
    const canvasTextDesktop = document.getElementById('canvasTextDesktop');
    
    if (canvasText) canvasText.style.fontSize = source.value + 'px';
    if (canvasTextDesktop) canvasTextDesktop.style.fontSize = source.value + 'px';
}

function updateCanvasText() {
    const mobileInput = document.getElementById('quoteInput');
    const desktopInput = document.getElementById('quoteInputDesktop');
    const text = (mobileInput ? mobileInput.value : '') || (desktopInput ? desktopInput.value : '') || 'Your quote will appear here...';
    
    const canvasText = document.getElementById('canvasText');
    const canvasTextDesktop = document.getElementById('canvasTextDesktop');
    
    if (canvasText) canvasText.textContent = text;
    if (canvasTextDesktop) canvasTextDesktop.textContent = text;
}

function updateBrandText() {
    const mobileInput = document.getElementById('brandInput');
    const desktopInput = document.getElementById('brandInputDesktop');
    const brand = (mobileInput ? mobileInput.value : '') || (desktopInput ? desktopInput.value : '');
    
    const brandText = document.getElementById('brandText');
    const brandTextDesktop = document.getElementById('brandTextDesktop');
    
    if (brandText) brandText.textContent = brand;
    if (brandTextDesktop) brandTextDesktop.textContent = brand;
}

function updateTextStyle() {
    const fontSize = document.getElementById('fontSize').value;
    document.getElementById('fontSizeValue').textContent = fontSize + 'px';
    
    const canvasText = document.getElementById('canvasText');
    const canvasTextDesktop = document.getElementById('canvasTextDesktop');
    
    if (canvasText) canvasText.style.fontSize = fontSize + 'px';
    if (canvasTextDesktop) canvasTextDesktop.style.fontSize = fontSize + 'px';
}

function setFontFamily(fontFamily) {
    const canvasText = document.getElementById('canvasText');
    const canvasTextDesktop = document.getElementById('canvasTextDesktop');
    
    if (canvasText) canvasText.style.fontFamily = fontFamily;
    if (canvasTextDesktop) canvasTextDesktop.style.fontFamily = fontFamily;
    
    // Update button states
    document.querySelectorAll('[id^="font"]').forEach(btn => {
        btn.className = 'p-2 bg-tertiary hover:bg-purple-600 rounded border border-custom text-xs';
    });
    
    // Set active button
    const fontMap = {
        'Righteous': 'fontRighteous',
        'Arial': 'fontArial',
        'Georgia': 'fontGeorgia',
        'Times New Roman': 'fontTimes',
        'Helvetica': 'fontHelvetica',
        'Courier New': 'fontCourier',
        'Impact': 'fontImpact',
        'Comic Sans MS': 'fontComic'
    };
    
    const activeBtn = document.getElementById(fontMap[fontFamily]);
    if (activeBtn) {
        activeBtn.className = 'p-2 bg-purple-600 hover:bg-purple-700 rounded border border-custom text-xs';
    }
}

function setTextColor(color) {
    currentTextColor = color;
    const canvasText = document.getElementById('canvasText');
    const canvasTextDesktop = document.getElementById('canvasTextDesktop');
    
    if (canvasText) canvasText.style.color = color;
    if (canvasTextDesktop) canvasTextDesktop.style.color = color;
}

function setTextAlign(align) {
    const canvasText = document.getElementById('canvasText');
    const canvasTextDesktop = document.getElementById('canvasTextDesktop');
    
    if (canvasText) canvasText.style.textAlign = align;
    if (canvasTextDesktop) canvasTextDesktop.style.textAlign = align;
    
    // Update button states for both mobile and desktop
    document.querySelectorAll('[onclick^="setTextAlign"]').forEach(btn => {
        if (btn.className.includes('flex-1')) {
            // Mobile buttons
            btn.className = 'flex-1 p-3 bg-tertiary hover:bg-purple-600 rounded-lg border border-custom';
        } else {
            // Desktop buttons
            btn.className = 'p-2 bg-tertiary hover:bg-purple-600 rounded border border-custom';
        }
    });
    
    // Set active state for clicked button
    document.querySelectorAll(`[onclick="setTextAlign('${align}')"]`).forEach(btn => {
        if (btn.className.includes('flex-1')) {
            // Mobile buttons
            btn.className = 'flex-1 p-3 bg-purple-600 hover:bg-purple-700 rounded-lg border border-custom';
        } else {
            // Desktop buttons
            btn.className = 'p-2 bg-purple-600 hover:bg-purple-700 rounded border border-custom';
        }
    });
}

function toggleBold() {
    const canvasText = document.getElementById('canvasText');
    const canvasTextDesktop = document.getElementById('canvasTextDesktop');
    const mobileBtn = document.getElementById('boldBtn');
    const desktopBtn = document.getElementById('boldBtnDesktop');
    const currentWeight = canvasText ? canvasText.style.fontWeight : canvasTextDesktop ? canvasTextDesktop.style.fontWeight : '';

    const isBold = currentWeight === 'bold';
    const newWeight = isBold ? 'normal' : 'bold';
    const newClass = isBold 
        ? 'p-2 bg-tertiary hover:bg-purple-600 rounded border border-custom'
        : 'p-2 bg-purple-600 hover:bg-purple-700 rounded border border-custom';

    // Apply to both canvases
    if (canvasText) canvasText.style.fontWeight = newWeight;
    if (canvasTextDesktop) canvasTextDesktop.style.fontWeight = newWeight;

    // Update both buttons
    if (mobileBtn) mobileBtn.className = newClass;
    if (desktopBtn) desktopBtn.className = newClass;
}

function toggleItalic() {
    const canvasText = document.getElementById('canvasText');
    const canvasTextDesktop = document.getElementById('canvasTextDesktop');
    const mobileBtn = document.getElementById('italicBtn');
    const desktopBtn = document.getElementById('italicBtnDesktop');
    const currentStyle = canvasText ? canvasText.style.fontStyle : canvasTextDesktop ? canvasTextDesktop.style.fontStyle : '';

    const isItalic = currentStyle === 'italic';
    const newStyle = isItalic ? 'normal' : 'italic';
    const newClass = isItalic 
        ? 'p-2 bg-tertiary hover:bg-purple-600 rounded border border-custom'
        : 'p-2 bg-purple-600 hover:bg-purple-700 rounded border border-custom';

    // Apply to both canvases
    if (canvasText) canvasText.style.fontStyle = newStyle;
    if (canvasTextDesktop) canvasTextDesktop.style.fontStyle = newStyle;

    // Update both buttons
    if (mobileBtn) mobileBtn.className = newClass;
    if (desktopBtn) desktopBtn.className = newClass;
}

function toggleUnderline() {
    const canvasText = document.getElementById('canvasText');
    const canvasTextDesktop = document.getElementById('canvasTextDesktop');
    const mobileBtn = document.getElementById('underlineBtn');
    const desktopBtn = document.getElementById('underlineBtnDesktop');
    const currentDecoration = canvasText ? canvasText.style.textDecoration : canvasTextDesktop ? canvasTextDesktop.style.textDecoration : '';

    const isUnderlined = currentDecoration === 'underline';
    const newDecoration = isUnderlined ? 'none' : 'underline';
    const newClass = isUnderlined 
        ? 'p-2 bg-tertiary hover:bg-purple-600 rounded border border-custom'
        : 'p-2 bg-purple-600 hover:bg-purple-700 rounded border border-custom';

    // Apply to both canvases
    if (canvasText) canvasText.style.textDecoration = newDecoration;
    if (canvasTextDesktop) canvasTextDesktop.style.textDecoration = newDecoration;

    // Update both buttons
    if (mobileBtn) mobileBtn.className = newClass;
    if (desktopBtn) desktopBtn.className = newClass;
}

function updateTextShadow() {
    const mobileSlider = document.getElementById('textShadow');
    const desktopSlider = document.getElementById('textShadowDesktop');
    const mobileValue = document.getElementById('textShadowValue');
    const desktopValue = document.getElementById('textShadowValueDesktop');
    const shadow = (mobileSlider ? mobileSlider.value : desktopSlider ? desktopSlider.value : 2) || 2;

    // Sync sliders and values
    if (mobileSlider && desktopSlider) desktopSlider.value = shadow;
    if (mobileValue) mobileValue.textContent = shadow + 'px';
    if (desktopValue) desktopValue.textContent = shadow + 'px';

    const canvasText = document.getElementById('canvasText');
    const canvasTextDesktop = document.getElementById('canvasTextDesktop');
    const shadowStyle = `${shadow}px ${shadow}px ${shadow * 2}px rgba(0,0,0,0.5)`;

    // Apply to both canvases
    if (canvasText) canvasText.style.textShadow = shadowStyle;
    if (canvasTextDesktop) canvasTextDesktop.style.textShadow = shadowStyle;
}

function updateLetterSpacing() {
    const mobileSlider = document.getElementById('letterSpacing');
    const desktopSlider = document.getElementById('letterSpacingDesktop');
    const mobileValue = document.getElementById('letterSpacingValue');
    const desktopValue = document.getElementById('letterSpacingValueDesktop');
    const spacing = (mobileSlider ? mobileSlider.value : desktopSlider ? desktopSlider.value : 0) || 0;

    // Sync sliders and values
    if (mobileSlider && desktopSlider) desktopSlider.value = spacing;
    if (mobileValue) mobileValue.textContent = spacing + 'px';
    if (desktopValue) desktopValue.textContent = spacing + 'px';

    const canvasText = document.getElementById('canvasText');
    const canvasTextDesktop = document.getElementById('canvasTextDesktop');

    // Apply to both canvases
    if (canvasText) canvasText.style.letterSpacing = spacing + 'px';
    if (canvasTextDesktop) canvasTextDesktop.style.letterSpacing = spacing + 'px';
}

function updateLineHeight() {
    const mobileSlider = document.getElementById('lineHeight');
    const desktopSlider = document.getElementById('lineHeightDesktop');
    const mobileValue = document.getElementById('lineHeightValue');
    const desktopValue = document.getElementById('lineHeightValueDesktop');
    const height = (mobileSlider ? mobileSlider.value : desktopSlider ? desktopSlider.value : 1.2) || 1.2;

    // Sync sliders and values
    if (mobileSlider && desktopSlider) desktopSlider.value = height;
    if (mobileValue) mobileValue.textContent = height;
    if (desktopValue) desktopValue.textContent = height;

    const canvasText = document.getElementById('canvasText');
    const canvasTextDesktop = document.getElementById('canvasTextDesktop');

    // Apply to both canvases
    if (canvasText) canvasText.style.lineHeight = height;
    if (canvasTextDesktop) canvasTextDesktop.style.lineHeight = height;
}

function getUnsplashImage(query, width = 400, height = 400) {
    return `https://source.unsplash.com/${width}x${height}/?${query}`;
}

async function initializeBackgrounds() {
    const mobileGrid = document.getElementById('backgroundGrid');
    const desktopGrid = document.getElementById('backgroundGridDesktop');
    
    // Add gradient backgrounds
    const gradients = [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
    ];
    
    let backgroundImages = [];
    
    try {
        const query = unsplashCollections.join('+');
        const response = await fetch(`https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${query}&image_type=photo&per_page=11&min_width=1920&min_height=1080`);
        const data = await response.json();
        backgroundImages = data.hits.map(hit => hit.largeImageURL);
    } catch (error) {
        console.error('Error fetching Pixabay images:', error);
        showPopup('Failed to load backgrounds from Pixabay', 'error');
    }
    
    // Function to add backgrounds to a grid
    function addBackgroundsToGrid(grid) {
        if (!grid) return;
        
        // Clear existing content
        grid.innerHTML = '';
        
        // Add gradients
        gradients.forEach(bg => {
            const div = document.createElement('div');
            div.className = 'w-full h-32 rounded-lg cursor-pointer border-2 border-transparent hover:border-purple-500 transition-all'; // Increased height for better quality preview
            div.style.background = bg;
            div.onclick = () => setCanvasBackground(bg);
            grid.appendChild(div);
        });
        
        // Add images with lazy loading
        backgroundImages.forEach(imageUrl => {
            const div = document.createElement('div');
            div.className = 'w-full h-32 rounded-lg cursor-pointer border-2 border-transparent hover:border-purple-500 transition-all overflow-hidden lazy-load'; // Increased height
            div.dataset.src = imageUrl;
            div.onclick = () => setCanvasBackground(imageUrl);
            grid.appendChild(div);
        });
        
        // Lazy load images
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const div = entry.target;
                    div.style.backgroundImage = `url("${div.dataset.src}")`;
                    div.style.backgroundSize = 'cover';
                    div.style.backgroundPosition = 'center';
                    observer.unobserve(div);
                }
            });
        }, { rootMargin: '100px' });
        
        grid.querySelectorAll('.lazy-load').forEach(div => observer.observe(div));
    }
    
    // Add backgrounds to both grids
    addBackgroundsToGrid(mobileGrid);
    addBackgroundsToGrid(desktopGrid);
}

function setCanvasBackground(background) {
    const canvas = document.getElementById('canvas');
    const canvasDesktop = document.getElementById('canvasDesktop');
    
    // Apply to both mobile and desktop canvases
    [canvas, canvasDesktop].forEach(canvasEl => {
        if (!canvasEl) return;
        
        // Clear existing styles first
        canvasEl.style.background = '';
        canvasEl.style.backgroundImage = '';
        canvasEl.style.backgroundSize = '';
        canvasEl.style.backgroundPosition = '';
        canvasEl.style.backgroundRepeat = '';
        
        if (background.includes('http') || background.startsWith('url(')) {
            // Handle image URLs - ensure proper url() format
            let imageUrl = background;
            if (!background.startsWith('url(')) {
                imageUrl = `url("${background}")`;
            }
            canvasEl.style.backgroundImage = imageUrl;
            canvasEl.style.backgroundSize = 'cover';
            canvasEl.style.backgroundPosition = 'center';
            canvasEl.style.backgroundRepeat = 'no-repeat';
        } else {
            // Handle gradients and solid colors
            canvasEl.style.background = background;
        }
    });
    
    showPopup('Background applied!', 'success');
}

async function loadMoreBackgrounds() {
    const mobileGrid = document.getElementById('backgroundGrid');
    const desktopGrid = document.getElementById('backgroundGridDesktop');
    
    // Add more gradients
    const moreGradients = [
        'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
        'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
        'linear-gradient(135deg, #fad0c4 0%, #ffd1ff 100%)',
        'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
        'linear-gradient(135deg, #ff8a80 0%, #ea80fc 100%)',
        'linear-gradient(135deg, #8fd3f4 0%, #84fab0 100%)'
    ];
    
    let moreImages = [];
    
    try {
        const query = unsplashCollections.join('+');
        const response = await fetch(`https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${query}&image_type=photo&per_page=50&page=2&min_width=1920&min_height=1080`);
        const data = await response.json();
        moreImages = data.hits.map(hit => hit.largeImageURL);
    } catch (error) {
        console.error('Error fetching more Pixabay images:', error);
        showPopup('Failed to load more backgrounds from Pixabay', 'error');
    }
    
    // Function to add more backgrounds to a grid
    function addMoreBackgroundsToGrid(grid) {
        if (!grid) return;
        
        // Add gradients first
        moreGradients.forEach(bg => {
            const div = document.createElement('div');
            div.className = 'w-full h-32 rounded-lg cursor-pointer border-2 border-transparent hover:border-purple-500 transition-all'; // Increased height
            div.style.background = bg;
            div.onclick = () => setCanvasBackground(bg);
            grid.appendChild(div);
        });
        
        // Add images
        moreImages.forEach(imageUrl => {
            const div = document.createElement('div');
            div.className = 'w-full h-32 rounded-lg cursor-pointer border-2 border-transparent hover:border-purple-500 transition-all overflow-hidden lazy-load'; // Increased height
            div.dataset.src = imageUrl;
            div.onclick = () => setCanvasBackground(imageUrl);
            grid.appendChild(div);
        });
        
        // Lazy load images
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const div = entry.target;
                    div.style.backgroundImage = `url("${div.dataset.src}")`;
                    div.style.backgroundSize = 'cover';
                    div.style.backgroundPosition = 'center';
                    observer.unobserve(div);
                }
            });
        }, { rootMargin: '100px' });
        
        grid.querySelectorAll('.lazy-load').forEach(div => observer.observe(div));
    }
    
    // Add to both grids
    addMoreBackgroundsToGrid(mobileGrid);
    addMoreBackgroundsToGrid(desktopGrid);
    
    showPopup('More backgrounds loaded!', 'success');
}

function setupCanvasDragging() {
    const canvasText = document.getElementById('canvasText');
    const canvasTextDesktop = document.getElementById('canvasTextDesktop');
    
    // Setup dragging for both mobile and desktop canvas text
    if (canvasText) {
        canvasText.addEventListener('mousedown', startDrag);
    }
    if (canvasTextDesktop) {
        canvasTextDesktop.addEventListener('mousedown', startDrag);
    }
    
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
    
    // Touch events for mobile
    if (canvasText) {
        canvasText.addEventListener('touchstart', startDragTouch);
    }
    if (canvasTextDesktop) {
        canvasTextDesktop.addEventListener('touchstart', startDragTouch);
    }
    
    document.addEventListener('touchmove', dragTouch);
    document.addEventListener('touchend', stopDrag);
}

let currentDragElement = null;

function startDrag(e) {
    e.preventDefault();
    isDragging = true;
    currentDragElement = e.target;
    const rect = e.target.getBoundingClientRect();
    dragOffset.x = e.clientX - rect.left;
    dragOffset.y = e.clientY - rect.top;
    e.target.style.cursor = 'grabbing';
}

function startDragTouch(e) {
    e.preventDefault();
    isDragging = true;
    currentDragElement = e.target;
    const touch = e.touches[0];
    const rect = e.target.getBoundingClientRect();
    dragOffset.x = touch.clientX - rect.left;
    dragOffset.y = touch.clientY - rect.top;
}

function drag(e) {
    if (!isDragging || !currentDragElement) return;
    e.preventDefault();
    
    // Determine which canvas we're working with
    const isDesktop = currentDragElement.id === 'canvasTextDesktop';
    const canvas = isDesktop ? document.getElementById('canvasDesktop') : document.getElementById('canvas');
    const canvasRect = canvas.getBoundingClientRect();
    
    let x = e.clientX - canvasRect.left - dragOffset.x;
    let y = e.clientY - canvasRect.top - dragOffset.y;
    
    // Keep text within canvas bounds
    x = Math.max(0, Math.min(x, canvas.offsetWidth - currentDragElement.offsetWidth));
    y = Math.max(0, Math.min(y, canvas.offsetHeight - currentDragElement.offsetHeight));
    
    currentDragElement.style.left = x + 'px';
    currentDragElement.style.top = y + 'px';
    currentDragElement.style.transform = 'none';
}

function dragTouch(e) {
    if (!isDragging || !currentDragElement) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const isDesktop = currentDragElement.id === 'canvasTextDesktop';
    const canvas = isDesktop ? document.getElementById('canvasDesktop') : document.getElementById('canvas');
    const canvasRect = canvas.getBoundingClientRect();
    
    let x = touch.clientX - canvasRect.left - dragOffset.x;
    let y = touch.clientY - canvasRect.top - dragOffset.y;
    
    // Keep text within canvas bounds
    x = Math.max(0, Math.min(x, canvas.offsetWidth - currentDragElement.offsetWidth));
    y = Math.max(0, Math.min(y, canvas.offsetHeight - currentDragElement.offsetHeight));
    
    currentDragElement.style.left = x + 'px';
    currentDragElement.style.top = y + 'px';
    currentDragElement.style.transform = 'none';
}

function stopDrag() {
    if (currentDragElement) {
        currentDragElement.style.cursor = 'move';
    }
    isDragging = false;
    currentDragElement = null;
}

function resetCanvasStyles() {
    const textElements = [document.getElementById('canvasText'), document.getElementById('canvasTextDesktop')];
    textElements.forEach(el => {
        if (el) {
            el.style.fontSize = '';
            el.style.fontFamily = '';
            el.style.fontWeight = '';
            el.style.fontStyle = '';
            el.style.textDecoration = '';
            el.style.color = '#ffffff';
            el.style.textAlign = 'center';
            el.style.textShadow = '';
            el.style.letterSpacing = '';
            el.style.lineHeight = '';
            el.style.left = '';
            el.style.top = '';
            el.style.transform = '';
            el.style.position = 'absolute';
        }
    });

    // Reset UI controls
    const defaultFontSize = 16;
    [document.getElementById('fontSize'), document.getElementById('fontSizeDesktop')].forEach(slider => {
        if (slider) slider.value = defaultFontSize;
    });
    [document.getElementById('fontSizeValue'), document.getElementById('fontSizeValueDesktop')].forEach(valueEl => {
        if (valueEl) valueEl.textContent = defaultFontSize + 'px';
    });

    document.querySelectorAll('[id^="font"]').forEach(btn => {
        btn.className = 'p-2 bg-tertiary hover:bg-purple-600 rounded border border-custom text-xs';
    });
    const defaultFontBtn = document.getElementById('fontArial'); // Assume Arial as default
    if (defaultFontBtn) {
        defaultFontBtn.className = 'p-2 bg-purple-600 hover:bg-purple-700 rounded border border-custom text-xs';
    }

    document.querySelectorAll('[onclick^="setTextAlign"]').forEach(btn => {
        btn.className = btn.className.includes('flex-1') 
            ? 'flex-1 p-3 bg-tertiary hover:bg-purple-600 rounded-lg border border-custom'
            : 'p-2 bg-tertiary hover:bg-purple-600 rounded border border-custom';
    });
    document.querySelectorAll('[onclick="setTextAlign(\'center\')"]').forEach(btn => {
        btn.className = btn.className.includes('flex-1') 
            ? 'flex-1 p-3 bg-purple-600 hover:bg-purple-700 rounded-lg border border-custom'
            : 'p-2 bg-purple-600 hover:bg-purple-700 rounded border border-custom';
    });

    ['boldBtn', 'italicBtn', 'underlineBtn'].forEach(btnId => {
        const btn = document.getElementById(btnId);
        if (btn) btn.className = 'p-2 bg-tertiary hover:bg-purple-600 rounded border border-custom';
    });

    if (document.getElementById('textShadow')) {
        document.getElementById('textShadow').value = 0;
        document.getElementById('textShadowValue').textContent = '0px';
    }

    if (document.getElementById('letterSpacing')) {
        document.getElementById('letterSpacing').value = 0;
        document.getElementById('letterSpacingValue').textContent = '0px';
    }

    if (document.getElementById('lineHeight')) {
        document.getElementById('lineHeight').value = 1.5;
        document.getElementById('lineHeightValue').textContent = '1.5';
    }
}

function getTextStyles() {
    const canvasText = document.getElementById('canvasText') || document.getElementById('canvasTextDesktop');
    if (!canvasText) return {};
    
    return {
        fontSize: canvasText.style.fontSize,
        fontFamily: canvasText.style.fontFamily,
        fontWeight: canvasText.style.fontWeight,
        fontStyle: canvasText.style.fontStyle,
        textDecoration: canvasText.style.textDecoration,
        color: canvasText.style.color,
        textAlign: canvasText.style.textAlign,
        textShadow: canvasText.style.textShadow,
        letterSpacing: canvasText.style.letterSpacing,
        lineHeight: canvasText.style.lineHeight,
        left: canvasText.style.left,
        top: canvasText.style.top
    };
}

function applyTextStyles(styles) {
    const textElements = [document.getElementById('canvasText'), document.getElementById('canvasTextDesktop')];
    textElements.forEach(el => {
        if (el && styles) {
            Object.assign(el.style, styles);
        }
    });
    
    // Update UI controls to match loaded styles
    if (styles) {
        // Font size
        const fontSize = parseInt(styles.fontSize) || 16;
        [document.getElementById('fontSize'), document.getElementById('fontSizeDesktop')].forEach(slider => {
            if (slider) slider.value = fontSize;
        });
        [document.getElementById('fontSizeValue'), document.getElementById('fontSizeValueDesktop')].forEach(valueEl => {
            if (valueEl) valueEl.textContent = fontSize + 'px';
        });

        // Font family
        if (styles.fontFamily) {
            const fontMap = {
                'Righteous': 'fontRighteous',
                'Arial': 'fontArial',
                'Georgia': 'fontGeorgia',
                'Times New Roman': 'fontTimes',
                'Helvetica': 'fontHelvetica',
                'Courier New': 'fontCourier',
                'Impact': 'fontImpact',
                'Comic Sans MS': 'fontComic'
            };
            document.querySelectorAll('[id^="font"]').forEach(btn => {
                btn.className = 'p-2 bg-tertiary hover:bg-purple-600 rounded border border-custom text-xs';
            });
            const activeBtn = document.getElementById(fontMap[styles.fontFamily]);
            if (activeBtn) {
                activeBtn.className = 'p-2 bg-purple-600 hover:bg-purple-700 rounded border border-custom text-xs';
            }
        }

        // Text align
        if (styles.textAlign) {
            document.querySelectorAll('[onclick^="setTextAlign"]').forEach(btn => {
                btn.className = btn.className.includes('flex-1') 
                    ? 'flex-1 p-3 bg-tertiary hover:bg-purple-600 rounded-lg border border-custom'
                    : 'p-2 bg-tertiary hover:bg-purple-600 rounded border border-custom';
            });
            document.querySelectorAll(`[onclick="setTextAlign('${styles.textAlign}')"]`).forEach(btn => {
                btn.className = btn.className.includes('flex-1')
                    ? 'flex-1 p-3 bg-purple-600 hover:bg-purple-700 rounded-lg border border-custom'
                    : 'p-2 bg-purple-600 hover:bg-purple-700 rounded border border-custom';
            });
        }

        // Bold, italic, underline
        if (styles.fontWeight === 'bold') {
            const btn = document.getElementById('boldBtn');
            if (btn) btn.className = 'p-2 bg-purple-600 hover:bg-purple-700 rounded border border-custom';
        } else {
            const btn = document.getElementById('boldBtn');
            if (btn) btn.className = 'p-2 bg-tertiary hover:bg-purple-600 rounded border border-custom';
        }

        if (styles.fontStyle === 'italic') {
            const btn = document.getElementById('italicBtn');
            if (btn) btn.className = 'p-2 bg-purple-600 hover:bg-purple-700 rounded border border-custom';
        } else {
            const btn = document.getElementById('italicBtn');
            if (btn) btn.className = 'p-2 bg-tertiary hover:bg-purple-600 rounded border border-custom';
        }

        if (styles.textDecoration === 'underline') {
            const btn = document.getElementById('underlineBtn');
            if (btn) btn.className = 'p-2 bg-purple-600 hover:bg-purple-700 rounded border border-custom';
        } else {
            const btn = document.getElementById('underlineBtn');
            if (btn) btn.className = 'p-2 bg-tertiary hover:bg-purple-600 rounded border border-custom';
        }

        // Text shadow
        if (styles.textShadow) {
            const shadowMatch = styles.textShadow.match(/(\d+)px (\d+)px (\d+)px/);
            if (shadowMatch) {
                const shadowValue = parseInt(shadowMatch[1]);
                if (document.getElementById('textShadow')) {
                    document.getElementById('textShadow').value = shadowValue;
                    document.getElementById('textShadowValue').textContent = shadowValue + 'px';
                }
            }
        }

        // Letter spacing
        if (styles.letterSpacing) {
            const spacing = parseFloat(styles.letterSpacing) || 0;
            if (document.getElementById('letterSpacing')) {
                document.getElementById('letterSpacing').value = spacing;
                document.getElementById('letterSpacingValue').textContent = spacing + 'px';
            }
        }

        // Line height
        if (styles.lineHeight) {
            if (document.getElementById('lineHeight')) {
                document.getElementById('lineHeight').value = parseFloat(styles.lineHeight) || 1.5;
                document.getElementById('lineHeightValue').textContent = styles.lineHeight;
            }
        }
    }
}

function downloadImage() {
    const canvasElement = document.getElementById('canvas');
    const quote = document.getElementById('quoteInput').value || 'Your quote will appear here...';
    
    if (!quote || quote === 'Your quote will appear here...') {
        showPopup('Please enter a quote first!', 'error');
        return;
    }
    
    // Show loading
    showPopup('Preparing download...', 'info');
    
    // Use html2canvas to capture the exact DOM canvas element as image
    html2canvas(canvasElement, {
        scale: 4, // Increased scale for higher resolution
        useCORS: true, // Handle cross-origin images (e.g., Unsplash)
        allowTaint: true, // Allow tainted canvases for external images
        backgroundColor: null, // Preserve any transparency (if applicable)
        width: 1920, // Explicit high-resolution width
        height: 1080 // Explicit high-resolution height
    }).then(canvas => {
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `inspireverse-quote-${Date.now()}.jpg`; // Changed to JPG for smaller size with high quality
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            showPopup('Quote downloaded successfully!', 'success');
            
            // Save to creations
            const creation = {
                id: Date.now(),
                type: 'download',
                quote: quote,
                brand: document.getElementById('brandInput').value || '',
                background: getCanvasBackground(),
                textStyles: getTextStyles(),
                timestamp: new Date().toISOString()
            };
            
            savedCreations.push(creation);
            localStorage.setItem('inspireverse_creations', JSON.stringify(savedCreations));
            updateGalleryView(); // Refresh gallery after save
        }, 'image/jpeg', 0.95); // Use JPEG with high quality
    }).catch(error => {
        console.error('Error capturing canvas:', error);
        showPopup('Failed to download image. Please try again.', 'error');
    });
}

function getCanvasBackground() {
    const canvas = document.getElementById('canvas');
    if (canvas.style.backgroundImage && canvas.style.backgroundImage !== 'none') {
        const match = canvas.style.backgroundImage.match(/^url\(["']?([^"']*)["']?\)$/);
        return match ? match[1] : '';
    } else {
        return canvas.style.background || '';
    }
}

function saveDraft() {
    const quote = document.getElementById('quoteInput').value;
    if (!quote || quote === 'Your quote will appear here...') {
        showPopup('Please enter a quote first!', 'error');
        return;
    }
    
    const creation = {
        id: Date.now(),
        type: 'draft',
        quote: quote,
        brand: document.getElementById('brandInput').value || '',
        background: getCanvasBackground(),
        textStyles: getTextStyles(),
        timestamp: new Date().toISOString()
    };
    
    savedCreations.push(creation);
    localStorage.setItem('inspireverse_creations', JSON.stringify(savedCreations));
    showPopup('Draft saved successfully!', 'success');
    updateGalleryView(); // Refresh gallery after save
}

function shareImage() {
    if (navigator.share) {
        navigator.share({
            title: 'Check out my quote from Inspireverse!',
            text: document.getElementById('quoteInput').value,
            url: window.location.href
        });
    } else {
        // Fallback for browsers that don't support Web Share API
        const shareText = `Check out my quote: "${document.getElementById('quoteInput').value}" - Created with Inspireverse`;
        navigator.clipboard.writeText(shareText);
        alert('Quote copied to clipboard! Share it anywhere you like.');
    }
}

function initializeGallery() {
    updateGalleryView();
}

function toggleGalleryView(view) {
    // Update button states
    document.querySelectorAll('#galleryPage button').forEach(btn => {
        btn.className = 'px-4 py-2 bg-tertiary hover:bg-purple-600 rounded-lg';
    });
    document.getElementById(view + 'Btn').className = 'px-4 py-2 bg-purple-600 text-white rounded-lg';
    
    updateGalleryView(view);
}

function updateGalleryView(filter = 'all') {
    const grid = document.getElementById('galleryGrid');
    grid.innerHTML = '';
    
    let filteredCreations = savedCreations;
    if (filter !== 'all') {
        filteredCreations = savedCreations.filter(c => c.type === (filter === 'downloads' ? 'download' : 'draft'));
    }
    
    if (filteredCreations.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full text-center py-12">
                <i class="fas fa-folder-open text-6xl text-gray-400 mb-4"></i>
                <p class="text-xl text-secondary mb-2">No creations yet</p>
                <p class="text-secondary">Start creating your first quote!</p>
                <button onclick="showPage('dashboard')" class="mt-4 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
                    Create Quote
                </button>
            </div>
        `;
        return;
    }
    
    filteredCreations.forEach(creation => {
        const div = document.createElement('div');
        div.className = 'image-container relative bg-secondary rounded-lg overflow-hidden aspect-square cursor-pointer';
        
        // Clean background
        let cleanBackground = creation.background || '';
        const match = cleanBackground.match(/^url\(["']?([^"']*)["']?\)$/);
        if (match) {
            cleanBackground = match[1];
        }
        
        let backgroundStyle = '';
        let isImage = false;
        let backgroundAttr = '';
        let canvasClass = 'w-full h-full flex items-center justify-center text-center p-4 relative';
        
        if (cleanBackground) {
            if (cleanBackground.startsWith('http')) {
                isImage = true;
                canvasClass += ' lazy-load';
                backgroundAttr = ` data-src="${cleanBackground}"`;
            } else {
                backgroundStyle = `background: ${cleanBackground};`;
            }
        } else {
            backgroundStyle = 'background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);';
        }
        
        let previewTextClass = 'text-white text-[8px] md:text-sm font-normal text-shadow relative z-10';
        let previewTextStyle = 'text-shadow: 2px 2px 4px rgba(0,0,0,0.8);';
        
        if (creation.textStyles) {
            previewTextStyle = `color: ${creation.textStyles.color || '#ffffff'}; text-shadow: 2px 2px 4px rgba(0,0,0,0.8);`;
            if (creation.textStyles.fontFamily) previewTextStyle += ` font-family: ${creation.textStyles.fontFamily};`;
            let fs = parseInt(creation.textStyles.fontSize) || 14;
            fs = Math.min(fs / 3, 14); // Scale down for preview
            previewTextStyle += ` font-size: ${fs}px;`;
            if (creation.textStyles.fontWeight === 'bold') previewTextClass += ' font-bold';
            if (creation.textStyles.fontStyle === 'italic') previewTextClass += ' italic';
            if (creation.textStyles.textDecoration === 'underline') previewTextStyle += ' text-decoration: underline;';
            if (creation.textStyles.letterSpacing) previewTextStyle += ` letter-spacing: ${creation.textStyles.letterSpacing};`;
            if (creation.textStyles.lineHeight) previewTextStyle += ` line-height: ${creation.textStyles.lineHeight};`;
            if (creation.textStyles.textAlign) previewTextClass += ` text-${creation.textStyles.textAlign}`;
        }
        
        div.innerHTML = `
            <div class="${canvasClass}" style="${backgroundStyle}"${backgroundAttr}>
                <div class="absolute inset-0 bg-black bg-opacity-20"></div>
                <div class="${previewTextClass}" style="${previewTextStyle}">${creation.quote.length > 60 ? creation.quote.substring(0, 60) + '...' : creation.quote}</div>
                ${creation.brand ? `<div class="absolute bottom-2 left-2 text-white text-sm opacity-80 z-10" style="text-shadow: 1px 1px 2px rgba(0,0,0,0.8);">${creation.brand}</div>` : ''}
            </div>
            <div class="image-hover-overlay">
                <div class="text-center mb-4">
                    <p class="text-gray-300 text-[7px] md:text-sm">${new Date(creation.timestamp).toLocaleDateString()}</p>
                    <span class="inline-block px-1 py-1 md:px-2 md:py-1 bg-purple-600 text-white rounded-full text-[8px] md:text-sm mt-2">
                        ${creation.type === 'download' ? 'Downloaded' : 'Draft'}
                    </span>
                </div>
                <div class="flex space-x-2">
                    <button onclick="editCreation(${creation.id})" class="flex items-center justify-center text-center px-2 py-2 md:px-2 md:py-1 bg-blue-600 hover:bg-blue-700 rounded text-[8px] md:text-sm">
                        <i class="fas fa-edit text-[10px] md:text-sm"></i>
                    </button>
                    <button onclick="downloadCreation(${creation.id})" class="flex items-center justify-center text-center px-2 py-2 md:px-2 md:py-1 bg-green-600 hover:bg-green-700 rounded text-[8px] md:text-sm">
                        <i class="fas fa-download text-[10px] md:text-sm"></i>
                    </button>
                    <button onclick="deleteCreation(${creation.id})" class="flex items-center justify-center text-center px-2 py-2 md:px-2 md:py-1 bg-red-600 hover:bg-red-700 rounded text-[8px] md:text-sm">
                        <i class="fas fa-trash text-[10px] md:text-sm"></i>
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(div);
    });
    
    // Lazy load for gallery images
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                target.style.backgroundImage = `url("${target.dataset.src}")`;
                target.style.backgroundSize = 'cover';
                target.style.backgroundPosition = 'center';
                observer.unobserve(target);
            }
        });
    }, { rootMargin: '100px' });
    
    grid.querySelectorAll('.lazy-load').forEach(el => observer.observe(el));
}

function editCreation(id) {
    const creation = savedCreations.find(c => c.id === id);
    if (creation) {
        // Update nav buttons first
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.className = 'nav-btn w-full flex items-center p-3 rounded-lg hover:bg-tertiary transition-colors';
        });
        document.querySelector('[onclick="showPage(\'dashboard\')"]').className = 'nav-btn w-full flex items-center p-3 rounded-lg bg-purple-600 text-white';
        
        // Hide all pages and show dashboard
        document.querySelectorAll('[id$="Page"]').forEach(p => p.classList.add('hidden'));
        document.getElementById('dashboardPage').classList.remove('hidden');
        document.getElementById('dashboardActionBar').classList.remove('hidden');
        document.querySelector('header h1').textContent = 'Dashboard';
        currentPage = 'dashboard';
        
        // Then populate the editor
        setTimeout(() => {
            resetCanvasStyles();
            document.getElementById('quoteInput').value = creation.quote;
            document.getElementById('brandInput').value = creation.brand || '';
            if (creation.background) {
                setCanvasBackground(creation.background);
            }
            updateCanvasText();
            updateBrandText();
            if (creation.textStyles) {
                applyTextStyles(creation.textStyles);
            }
            showPopup('Quote loaded for editing!', 'success');
        }, 200);
    }
}

function downloadCreation(id) {
    const creation = savedCreations.find(c => c.id === id);
    if (creation) {
        resetCanvasStyles();
        document.getElementById('quoteInput').value = creation.quote;
        document.getElementById('brandInput').value = creation.brand || '';
        setCanvasBackground(creation.background);
        updateCanvasText();
        updateBrandText();
        if (creation.textStyles) {
            applyTextStyles(creation.textStyles);
        }
        
        setTimeout(() => {
            downloadImage();
        }, 500);
    }
}

function deleteCreation(id) {
    if (confirm('Are you sure you want to delete this creation?')) {
        savedCreations = savedCreations.filter(c => c.id !== id);
        localStorage.setItem('inspireverse_creations', JSON.stringify(savedCreations));
        updateGalleryView();
        showPopup('Creation deleted successfully!', 'success');
    }
}

function initializeExplore() {
    const grid = document.getElementById('exploreGrid');
    
    communityQuotes.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'explore-container relative bg-secondary rounded-lg overflow-hidden aspect-square cursor-pointer';
        
        // Use different Unsplash images with specific IDs for consistency
        const imageIds = [
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1280&h=720&fit=crop&q=85',
            'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1280&h=720&fit=crop&q=85',
            'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1280&h=720&fit=crop&q=85',
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1280&h=720&fit=crop&q=85',
            'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1280&h=720&fit=crop&q=85',
            'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1280&h=720&fit=crop&q=85',
            'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1280&h=720&fit=crop&q=85',
            'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=1280&h=720&fit=crop&q=85'
        ];
        
        const backgroundImage = imageIds[index % imageIds.length];
        
        div.innerHTML = `
            <div class="w-full h-full flex items-center justify-center text-center p-4 relative" style="background-image: url(${backgroundImage}); background-size: cover; background-position: center;">
                <div class="absolute inset-0 bg-black bg-opacity-30"></div>
                <div class="text-white font-bold relative z-10 px-2" style="text-shadow: 2px 2px 4px rgba(0,0,0,0.8); font-size: 14px; line-height: 1.3;">${item.quote.length > 80 ? item.quote.substring(0, 80) + '...' : item.quote}</div>
            </div>
            <div class="explore-hover-overlay">
                <div class="text-center">
                    <div class="flex items-center justify-center space-x-2 mb-2">
                        <div class="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <i class="fas fa-user text-white text-xs"></i>
                        </div>
                        <div class="text-left">
                            <p class="text-white font-medium text-xs">${item.author}</p>
                            <p class="text-gray-300 text-xs">${item.title}</p>
                        </div>
                    </div>
                    <div class="flex items-center justify-center space-x-3 text-xs text-gray-300">
                        <span><i class="fas fa-download mr-1"></i>${item.downloads.toLocaleString()}</span>
                        <span><i class="fas fa-heart mr-1"></i>${item.likes.toLocaleString()}</span>
                    </div>
                </div>
                <div class="flex justify-center space-x-1">
                    <button onclick="likeCommunityQuote(${index})" class="p-2 bg-red-600 hover:bg-red-700 rounded-full text-xs" title="Like">
                        <i class="fas fa-heart"></i>
                    </button>
                    <button onclick="editCommunityQuote('${item.quote.replace(/'/g, "\\'")}', '${backgroundImage}')" class="p-2 bg-blue-600 hover:bg-blue-700 rounded-full text-xs" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="downloadCommunityQuote('${item.quote.replace(/'/g, "\\'")}', '${backgroundImage}')" class="p-2 bg-green-600 hover:bg-green-700 rounded-full text-xs" title="Download">
                        <i class="fas fa-download"></i>
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(div);
    });
}

function editCommunityQuote(quote, backgroundImage) {
    // Update nav buttons first
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.className = 'nav-btn w-full flex items-center p-3 rounded-lg hover:bg-tertiary transition-colors';
    });
    document.querySelector('[onclick="showPage(\'dashboard\')"]').className = 'nav-btn w-full flex items-center p-3 rounded-lg bg-purple-600 text-white';
    
    // Hide all pages and show dashboard
    document.querySelectorAll('[id$="Page"]').forEach(p => p.classList.add('hidden'));
    document.getElementById('dashboardPage').classList.remove('hidden');
    document.getElementById('dashboardActionBar').classList.remove('hidden');
    document.querySelector('header h1').textContent = 'Dashboard';
    currentPage = 'dashboard';
    
    // Then populate the editor
    setTimeout(() => {
        resetCanvasStyles();
        document.getElementById('quoteInput').value = quote;
        setCanvasBackground(backgroundImage);
        updateCanvasText();
        showPopup('Community quote loaded for editing!', 'success');
    }, 200);
}

function downloadCommunityQuote(quote, backgroundImage) {
    // Set the quote and background in the editor
    resetCanvasStyles();
    document.getElementById('quoteInput').value = quote;
    setCanvasBackground(`url(${backgroundImage})`);
    updateCanvasText();
    
    // Trigger download
    setTimeout(() => {
        downloadImage();
    }, 500);
    
    showPopup('Community quote downloaded!', 'success');
}

function likeCommunityQuote(index) {
    communityQuotes[index].likes++;
    showPopup('Quote liked!', 'success');
    initializeExplore(); // Refresh the explore page
}

// Mobile tab functionality
let currentMobileTab = 'editor';
let currentMobileAIQuote = '';

function showMobileTab(tab) {
    // Update tab buttons
    document.querySelectorAll('[id$="Tab"]').forEach(btn => {
        btn.className = 'flex-1 p-4 text-center hover:bg-tertiary transition-colors border-r border-custom';
    });
    
    // Remove border-r from last tab
    document.getElementById('aiTab').className = 'flex-1 p-4 text-center hover:bg-tertiary transition-colors';
    
    // Set active tab
    document.getElementById(tab + 'Tab').className = 'flex-1 p-4 text-center bg-purple-600 text-white ' + (tab !== 'ai' ? 'border-r border-custom' : '');
    
    // Hide all tab content
    document.getElementById('mobileEditorTab').classList.add('hidden');
    document.getElementById('mobileBackgroundsTab').classList.add('hidden');
    document.getElementById('mobileAITab').classList.add('hidden');
    
    // Show selected tab content
    document.getElementById('mobile' + tab.charAt(0).toUpperCase() + tab.slice(1) + 'Tab').classList.remove('hidden');
    
    currentMobileTab = tab;
}

function applyQuickStyle(style) {
    const canvasText = document.getElementById('canvasText');
    const canvasTextDesktop = document.getElementById('canvasTextDesktop');
    
    switch(style) {
        case 'bold':
            if (canvasText) {
                canvasText.style.fontWeight = 'bold';
                canvasText.style.fontFamily = 'Impact';
            }
            if (canvasTextDesktop) {
                canvasTextDesktop.style.fontWeight = 'bold';
                canvasTextDesktop.style.fontFamily = 'Impact';
            }
            setTextColor('#ffffff');
            break;
        case 'elegant':
            if (canvasText) {
                canvasText.style.fontWeight = 'normal';
                canvasText.style.fontFamily = 'Georgia';
                canvasText.style.fontStyle = 'italic';
            }
            if (canvasTextDesktop) {
                canvasTextDesktop.style.fontWeight = 'normal';
                canvasTextDesktop.style.fontFamily = 'Georgia';
                canvasTextDesktop.style.fontStyle = 'italic';
            }
            setTextColor('#f8fafc');
            break;
        case 'modern':
            if (canvasText) {
                canvasText.style.fontWeight = '300';
                canvasText.style.fontFamily = 'Helvetica';
                canvasText.style.letterSpacing = '2px';
            }
            if (canvasTextDesktop) {
                canvasTextDesktop.style.fontWeight = '300';
                canvasTextDesktop.style.fontFamily = 'Helvetica';
                canvasTextDesktop.style.letterSpacing = '2px';
            }
            setTextColor('#ffffff');
            break;
        case 'classic':
            if (canvasText) {
                canvasText.style.fontWeight = 'normal';
                canvasText.style.fontFamily = 'Times New Roman';
                canvasText.style.fontStyle = 'normal';
                canvasText.style.letterSpacing = 'normal';
            }
            if (canvasTextDesktop) {
                canvasTextDesktop.style.fontWeight = 'normal';
                canvasTextDesktop.style.fontFamily = 'Times New Roman';
                canvasTextDesktop.style.fontStyle = 'normal';
                canvasTextDesktop.style.letterSpacing = 'normal';
            }
            setTextColor('#f1f5f9');
            break;
    }
    
    showPopup(`${style.charAt(0).toUpperCase() + style.slice(1)} style applied!`, 'success');
}

function generateMobileAIQuote() {
    const mood = document.getElementById('aiMoodSelect').value;
    const quotes = aiQuotes[mood];
    currentMobileAIQuote = quotes[Math.floor(Math.random() * quotes.length)];
    
    document.getElementById('mobileAIQuoteText').textContent = currentMobileAIQuote;
    document.getElementById('mobileAIResult').classList.remove('hidden');
    
    showPopup('AI quote generated!', 'success');
}

function useMobileAIQuote() {
    document.getElementById('quoteInput').value = currentMobileAIQuote;
    updateCanvasText();
    showMobileTab('editor');
    showPopup('Quote applied to canvas!', 'success');
}

// Handle window resize for responsive sidebar
window.addEventListener('resize', () => {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    
    if (window.innerWidth >= 768) {
        // Desktop mode
        sidebar.classList.remove('sidebar-open');
        mainContent.classList.remove('content-pushed');
        sidebarOpen = true;
        sidebar.style.width = sidebarCollapsed ? '80px' : '256px';
    } else {
        // Mobile mode - reset to closed state
        if (sidebarOpen) {
            sidebar.classList.remove('sidebar-open');
            mainContent.classList.remove('content-pushed');
            sidebarOpen = false;
        }
    }
});

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.custom-dropdown')) {
        document.getElementById('moodDropdown').classList.remove('open');
        const moodDropdownMobile = document.getElementById('moodDropdownMobile');
        if (moodDropdownMobile) moodDropdownMobile.classList.remove('open');
    }
    if (!e.target.closest('#aiDropdown') && !e.target.closest('button[onclick="toggleAIDropdown()"]')) {
        document.getElementById('aiDropdown').classList.remove('open');
    }
    if (!e.target.closest('#aiDropdownMobile') && !e.target.closest('button[onclick="toggleAIDropdownMobile()"]')) {  // Add if you have a toggleAIDropdownMobile
        const aiDropdownMobile = document.getElementById('aiDropdownMobile');
        if (aiDropdownMobile) aiDropdownMobile.classList.remove('open');
    }
});



