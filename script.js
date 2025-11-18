// --- NEW PRELOADER FUNCTIONALITY ---
function hidePreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // 1. Add class to trigger CSS fade-out (opacity: 0)
        preloader.classList.add('preloader-hidden');

        // 2. Remove the element completely after the CSS transition ends (700ms)
        setTimeout(() => {
            preloader.remove();
            document.body.style.overflow = ''; // Ensure scrolling is restored
        }, 700);
    }
}
// --- END PRELOADER FUNCTIONALITY ---


// Configuration
const defaultConfig = {
    developer_name: "Onyekachi Jeremiah (Jarvis)",
    developer_title: "Frontend Developer & UI Implementation Specialist",
    tagline: "I turn ideas into clean, responsive, high-performing interfaces — basically, I make the internet look good.",
    punchline: "Frontend dev by day, bug exterminator by night.",
    contact_text: "Need a developer who actually delivers and doesn't ghost? Hit me up. I'm open to freelance, collaborations, and long-term work.",
    whatsapp_number: "+2349018654747",
    linkedin_url: "https://www.linkedin.com/in/jerry-luis-55473226b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
};

// Sample Projects Data (UPDATED with image_url field)
const projects = [
    {
        id: 1,
        title: "AI BANKING PROJECT",
        description: "Modern AI Banking template for on and offline banking and utility payments.",
        tags: ["React", "TypeScript", "TailwindCSS", "Chart.js"],
        gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        icon: "🛒",
        image_url: "img/img1 (1).jpg",
        details: {
            overview: "Modern AI Banking template for on and offline banking and utility payments.",
            duration: "2 weeks",
            client: "Personal Project.",
            role: "Lead Frontend Developer",
            technologies: "TailwindCSS, javascript, HTML",
            features: ["Real-time Analytics", "Inventory Management", "Revenue Reports"]
        }
    },
    {
        id: 2,
        title: "PowerUp – Smart Electricity",
        description: "A real-time electricity balance viewer with seamless meter top-ups — no token typing, no stress.",
        tags: ["Next.js", "Firebase", "TailwindCSS"],
        gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        icon: "⚡",
        image_url: "img/img1 (5).jpg",
        details: {
            overview:
                "PowerUp is a smart energy management platform that lets users check their electricity balance in real time and purchase new units without manually entering meter tokens. It syncs directly with supported smart meters and provides instant updates, secure payments, and a clean, minimal dashboard. The whole idea is: 'No more typing 20-digit tokens like it's 2003.'",
            duration: "4 weeks",
            client: "PowerUp Energy",
            role: "Frontend Developer & System Integration Lead",
            technologies:
                "TailwindCSS, Paystack API, Realtime DB, HTML, Javascript",
            features: [
                "Live Electricity Balance Display",
                "Instant Top-Up (No Token Needed)",
                "Smart Meter Auto-Sync",
                "Real-Time Activity Logs",
                "Secure Paystack Integration",
                "Clean, Mobile-First UI",
                "Fast & Optimized Dashboard"
            ]
        }
    },

    {
        id: 3,
        title: "Deliva – Smart Delivery",
        description: "A logistics and delivery web app with live tracking, automated region pricing, and a smooth, modern UI.",
        tags: ["Next.js", "Firebase", "TailwindCSS"],
        gradient: "linear-gradient(135deg, #00dbde 0%, #fc00ff 100%)",
        icon: "📦",
        image_url: "img/img1 (7).jpg",
        details: {
            overview:
                "Deliva is a full-stack delivery platform built to simplify item dispatching across Lagos. It includes automated price calculation based on regions, real-time order updates, rider assignment logic, and an intuitive dashboard for customers and admins. The platform focuses on simplicity, speed, and clean UX that works flawlessly on both desktop and mobile.",
            duration: "5 weeks",
            client: "Deliva Logistics",
            role: "Full Frontend Developer & System Architect",
            technologies:
                "CSS, HTML, Javascript",
            features: [
                "Automated Region-Based Pricing",
                "Real-Time Order Status Updates",
                "Rider Assignment Flow",
                "Mobile-First Dashboard UI",
                "Firebase Cloud Functions Integration",
                "Optimized Image + Asset Loading",
                "Modern Animations & Smooth Transitions"
            ]
        }
    },

    {
        id: 4,
        title: "EventFlow – Events Platform",
        description: "A modern event management platform for browsing live, upcoming, and past events — plus booking and creating new ones.",
        tags: ["Next.js", "Firebase", "TailwindCSS", "Framer Motion"],
        gradient: "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
        icon: "🎉",
        image_url: "img/img1 (3).jpg",
        details: {
            overview:
                "EventFlow is a dynamic events platform built to help users discover live events, explore upcoming ones, revisit past ones, and even create new events with a clean and intuitive UI. With real-time data sync, smooth animations, secure bookings, and a powerful admin dashboard, the system makes event management effortless for both organizers and attendees.",
            duration: "4 weeks",
            client: "EventFlow Inc.",
            role: "Full Frontend Developer",
            technologies:
                "TailwindCSS,, HTML, Javascript",
            features: [
                "Live, Upcoming & Past Events Filtering",
                "Create & Manage Your Own Events",
                "Secure Event Booking System",
                "Admin Dashboard for Organizers",
                "Real-Time Data Updates",
                "Modern Animations & Transitions",
                "Clean, Mobile-First User Interface"
            ]
        }
    },

    {
        id: 5,
        title: "Mamatees Jollof Sauce Website",
        description: "A clean, conversion-driven food product website with e-commerce functionality and smooth interactive sections.",
        tags: ["Next.js", "TailwindCSS", "Firebase"],
        gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
        icon: "🍲",
        image_url: "img/img1 (2).jpg",
        details: {
            overview:
                "A modern product website for Mamatees Jollof Sauce — built to showcase the sauce, display product variations, manage customer orders, and guide users smoothly through purchasing. The platform blends clean visuals with fast performance, giving the brand a premium, trust-building presence online.",
            duration: "3 weeks",
            client: "Mamatees Foods (Okefee Productions)",
            role: "Frontend Developer & UI Designer",
            technologies: "TailwindCSS, Paystack API, Realtime DB, HTML, Javascript",
            features: [
                "Product Showcase Pages",
                "Smooth Add-to-Cart & Checkout Flow",
                "Secure Paystack Payments",
                "Customer Order Tracking",
                "Mobile-First Design",
                "Optimized Images & Fast Loading",
                "Brand-Themed Animations & Effects"
            ]
        }
    },

    {
        id: 6,
        title: "AI Dashboard for SMEs",
        description: "A smart business dashboard powered by AI insights, analytics, and automated reporting for small and medium enterprises.",
        tags: ["Next.js", "Firebase", "AI API", "TailwindCSS"],
        gradient: "linear-gradient(135deg, #c3cfe2 0%, #f5f7fa 100%)",
        icon: "📊",
        image_url: "img/img1 (4).jpg",
        details: {
            overview:
                "This is a modern AI-powered dashboard built specifically for SMEs to help them understand their business performance in real-time. It provides automated insights, sales analytics, inventory health checks, customer behavior predictions, and smart recommendations — basically giving small businesses the kind of data power only big companies usually enjoy.",
            duration: "6 weeks",
            client: "BizIntel Solutions",
            role: "Frontend Developer & AI Integration Engineer",
            technologies:
                "TailwindCSS, HTML, Javascript",
            features: [
                "AI-Generated Business Insights",
                "Automated Daily/Weekly Reports",
                "Sales & Revenue Analytics",
                "Inventory Monitoring & Forecasting",
                "Customer Behavior Predictions",
                "Smart Recommendations for SMEs",
                "Real-Time Data Sync",
                "Mobile-Responsive Interactive Dashboard"
            ]
        }
    }

];

// Mobile Sidebar Management
class SidebarManager {
    constructor() {
        this.sidebar = document.getElementById('mobileSidebar');
        this.overlay = document.getElementById('sidebarOverlay');
        this.menuBtn = document.getElementById('mobileMenuBtn');
        this.closeBtn = document.getElementById('sidebarClose');
        this.mainContent = document.getElementById('mainContent');
        this.isOpen = false;
        
        this.init();
    }

    init() {
        this.menuBtn.addEventListener('click', () => this.toggle());
        this.closeBtn.addEventListener('click', () => this.close());
        this.overlay.addEventListener('click', () => this.close());
        
        // Close sidebar when clicking nav items on mobile
        document.querySelectorAll('.sidebar-nav-item').forEach(item => {
            item.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    this.close();
                }
            });
        });
    }

    toggle() {
        this.isOpen ? this.close() : this.open();
    }

    open() {
        this.sidebar.classList.add('open');
        this.overlay.classList.add('active');
        this.mainContent.classList.add('sidebar-open');
        this.isOpen = true;
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.sidebar.classList.remove('open');
        this.overlay.classList.remove('active');
        this.mainContent.classList.remove('sidebar-open');
        this.isOpen = false;
        document.body.style.overflow = '';
    }
}

// Page Router
class PageRouter {
    constructor() {
        this.currentPage = 'home';
        this.pages = document.querySelectorAll('.page');
        this.navLinks = document.querySelectorAll('.nav-link, .sidebar-nav-item');
        this.init();
    }

    init() {
        // Add click listeners to all navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetPage = link.getAttribute('data-page');
                this.navigateTo(targetPage);
            });
        });

        // Add click listeners to CTA buttons and logo
        document.querySelectorAll('[data-page]').forEach(btn => {
            if (!btn.classList.contains('nav-link') && !btn.classList.contains('sidebar-nav-item')) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetPage = btn.getAttribute('data-page');
                    this.navigateTo(targetPage);
                });
            }
        });
    }

    navigateTo(pageId) {
        if (pageId === this.currentPage) return;

        // Update navigation active states
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === pageId) {
                link.classList.add('active');
            }
        });

        // Hide current page and show target page
        document.getElementById(this.currentPage).classList.remove('active');
        document.getElementById(pageId).classList.add('active');

        this.currentPage = pageId;

        // This conditional logic is now handled in EnhancedPageRouter
    }
}

// Gallery Manager (UPDATED to handle images)
class GalleryManager {
    constructor() {
        this.grid = document.getElementById('galleryGrid');
        this.slider = document.getElementById('projectSlider');
        this.sliderTitle = document.getElementById('sliderTitle');
        this.sliderContent = document.getElementById('sliderContent');
        this.sliderClose = document.getElementById('sliderClose');
        
        this.init();
    }

    init() {
        this.sliderClose.addEventListener('click', () => this.closeSlider());
        this.slider.addEventListener('click', (e) => {
            if (e.target === this.slider) this.closeSlider();
        });
    }

    renderProjects() {
        if (!this.grid) return;
        
        // Clear existing content only if the grid is currently empty to avoid re-rendering flicker
        if (this.grid.children.length === 0) {
            this.grid.innerHTML = '';
            projects.forEach(project => {
                const card = this.createProjectCard(project);
                this.grid.appendChild(card);
            });
        }
    }

    createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.onclick = () => this.openProjectDetails(project);
        
        // --- START Image/Content Logic ---
        let imageContent;
        const fallbackText = project.icon ? `<span style="font-size: 4rem;">${project.icon}</span>` : '';

        if (project.image_url) {
            // Use an actual image tag
            imageContent = `<img src="${project.image_url}" alt="${project.title} screenshot" class="project-card-info">`;
        } else {
            // Fallback to the colored box with an emoji
            imageContent = `
                <div class="project-image-content" style="background: ${project.gradient}">
                    ${fallbackText}
                </div>
            `;
        }
        
        // Check if image_url is defined to set a class for proper styling
        const imageClass = project.image_url ? 'has-image' : 'no-image';
        // --- END Image/Content Logic ---

        card.innerHTML = `
            <div class="project-image ${imageClass}">
                ${imageContent}
                <div class="project-overlay">
                    <div class="overlay-content">
                        <div class="overlay-title">${project.title}</div>
                        <div class="overlay-subtitle">${project.tags.slice(0, 2).join(' • ')}</div>
                        <div class="overlay-button">View Project</div>
                    </div>
                </div>
            </div>
            
        `;
        return card;
    }

    openProjectDetails(project) {
        this.sliderTitle.textContent = project.title;
        
        this.sliderContent.innerHTML = `
            <div class="project-details">
                <div class="project-main-info">
                    <h3>Project Overview</h3>
                    <p>${project.details.overview}</p>
                    
                    <h3>Key Features</h3>
                    <ul style="color: #94a3b8; line-height: 1.8; margin-left: 1.5rem;">
                        ${project.details.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="project-specs">
                    <h3 style="color: #00d4ff; margin-bottom: 1rem;">Project Details</h3>
                    <div class="spec-item">
                        <span class="spec-label">Duration:</span>
                        <span class="spec-value">${project.details.duration}</span>
                    </div>
                    <div class="spec-item">
                        <span class="spec-label">Client:</span>
                        <span class="spec-value">${project.details.client}</span>
                    </div>
                    <div class="spec-item">
                        <span class="spec-label">Role:</span>
                        <span class="spec-value">${project.details.role}</span>
                    </div>
                    <div class="spec-item">
                        <span class="spec-label">Technologies:</span>
                        <span class="spec-value">${project.details.technologies}</span>
                    </div>
                </div>
            </div>
            
            <div style="margin-top: 3rem;">
                <h3 style="color: #00d4ff; margin-bottom: 1.5rem; font-size: 1.5rem;">Project Gallery</h3>
                <div class="project-gallery">
                    <div class="gallery-image" style="background: ${project.gradient}">
                        <span style="font-size: 3rem;">${project.icon}</span>
                    </div>
                    <div class="gallery-image" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
                        <span style="font-size: 2rem;">📱</span>
                    </div>
                    <div class="gallery-image" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">
                        <span style="font-size: 2rem;">💻</span>
                    </div>
                    <div class="gallery-image" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">
                        <span style="font-size: 2rem;">🎨</span>
                    </div>
                </div>
            </div>
        `;
        
        this.slider.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    closeSlider() {
        this.slider.classList.remove('open');
        document.body.style.overflow = '';
    }
}

// **REMOVED** the old `initContactForm()` function here.

// Contact Methods
function initContactMethods() {
    const whatsappContact = document.getElementById('whatsappContact');
    const linkedinContact = document.getElementById('linkedinContact');
    
    if (whatsappContact) {
        whatsappContact.addEventListener('click', () => {
            const number = defaultConfig.whatsapp_number.replace(/[^\d]/g, '');
            window.open(`https://wa.me/${number}`, '_blank');
        });
    }
    
    if (linkedinContact) {
        linkedinContact.addEventListener('click', () => {
            window.open(defaultConfig.linkedin_url, '_blank');
        });
    }
}

// Navbar Scroll Effect
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Element SDK Integration
async function onConfigChange(config) {
    const heroName = document.getElementById('heroName');
    const heroTitle = document.getElementById('heroTitle');
    const heroTagline = document.getElementById('heroTagline');
    const heroPunchline = document.getElementById('heroPunchline');
    const contactMessage = document.getElementById('contactMessage');

    if (heroName) heroName.textContent = config.developer_name || defaultConfig.developer_name;
    if (heroTitle) heroTitle.textContent = config.developer_title || defaultConfig.developer_title;
    if (heroTagline) heroTagline.textContent = config.tagline || defaultConfig.tagline;
    if (heroPunchline) heroPunchline.textContent = config.punchline || defaultConfig.punchline;
    if (contactMessage) contactMessage.textContent = config.contact_text || defaultConfig.contact_text;
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
        ["developer_name", config.developer_name || defaultConfig.developer_name],
        ["developer_title", config.developer_title || defaultConfig.developer_title],
        ["tagline", config.tagline || defaultConfig.tagline],
        ["punchline", config.punchline || defaultConfig.punchline],
        ["contact_text", config.contact_text || defaultConfig.contact_text],
        ["whatsapp_number", config.whatsapp_number || defaultConfig.whatsapp_number],
        ["linkedin_url", config.linkedin_url || defaultConfig.linkedin_url]
    ]);
}

// Scroll Animation System
class ScrollAnimationManager {
    constructor() {
        this.animatedElements = [];
        this.init();
    }

    init() {
        this.observeElements();
        this.setupIntersectionObserver();
    }

    observeElements() {
        const elements = document.querySelectorAll('.animate-on-scroll, .animate-slide-left, .animate-slide-right, .animate-scale');
        elements.forEach(element => {
            this.animatedElements.push(element);
        });
    }

    setupIntersectionObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, options);

        this.animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    refreshElements() {
        // Re-observe elements when page changes
        this.animatedElements = [];
        this.observeElements();
        this.setupIntersectionObserver();
    }
}

// Typewriter Effect Manager
class TypewriterManager {
    constructor() {
        this.typewriters = [];
        this.init();
    }

    init() {
        this.setupTypewriters();
    }

    setupTypewriters() {
        const typewriterElements = document.querySelectorAll('.typewriter');
        typewriterElements.forEach((element, index) => {
            // Only re-run the effect if the content hasn't been typed yet
            if (element.textContent.length === 0) {
                const text = element.getAttribute('data-text') || element.textContent; // Use data-text to store original content
                element.textContent = '';
                element.style.borderRight = '3px solid #00d4ff';
                
                setTimeout(() => {
                    this.typeText(element, text, 50);
                }, index * 500);
            }
        });
    }

    typeText(element, text, speed) {
        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
                // Keep blinking cursor for a moment, then remove
                setTimeout(() => {
                    element.style.borderRight = 'none';
                }, 2000);
            }
        }, speed);
    }

    refreshTypewriters() {
        // Re-setup typewriters when page changes
        setTimeout(() => {
            this.setupTypewriters();
        }, 100);
    }
}

// Enhanced Page Router with Animation Support
class EnhancedPageRouter extends PageRouter {
    navigateTo(pageId) {
        if (pageId === this.currentPage) return;

        // Update navigation active states
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === pageId) {
                link.classList.add('active');
            }
        });

        // Hide current page and show target page
        document.getElementById(this.currentPage).classList.remove('active');
        document.getElementById(pageId).classList.add('active');

        this.currentPage = pageId;

        // Refresh animations for new page
        setTimeout(() => {
            // These variables are now declared globally (top of the file) and initialized below.
            if (window.scrollAnimationManager) window.scrollAnimationManager.refreshElements();
            if (window.typewriterManager) window.typewriterManager.refreshTypewriters();
            
            // Initialize gallery if navigating to gallery page
            if (pageId === 'gallery' && window.galleryManager) {
                window.galleryManager.renderProjects();
            }
        }, 100);
    }
}

// Initialize App (GLOBAL DECLARATIONS - needed since you removed the initial ones)
let sidebarManager, pageRouter, galleryManager, scrollAnimationManager, typewriterManager;

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Element SDK
    if (window.elementSdk) {
        window.elementSdk.init({
            defaultConfig,
            onConfigChange,
            mapToCapabilities,
            mapToEditPanelValues
        });
    }

    // 2. Initialize app components (Assignments to the global variables)
    sidebarManager = new SidebarManager();
    // **FIXED:** Removed the duplicate 'new' keyword
    pageRouter = new EnhancedPageRouter(); 
    galleryManager = new GalleryManager();
    scrollAnimationManager = new ScrollAnimationManager();
    typewriterManager = new TypewriterManager();
    
    // EXPOSE managers globally for access in EnhancedPageRouter's setTimeout block
    window.sidebarManager = sidebarManager;
    window.pageRouter = pageRouter;
    window.galleryManager = galleryManager;
    window.scrollAnimationManager = scrollAnimationManager;
    window.typewriterManager = typewriterManager;
    
    // **REMOVED:** The call to initContactForm() is now gone.
    initContactMethods();
    initNavbarScroll();
    
    // 3. Initial render of gallery
    if (pageRouter.currentPage === 'gallery') {
        galleryManager.renderProjects();
    }
});


// **PRELOADER TRIGGER** - This listens for all assets to load and hides the preloader.
window.addEventListener('load', () => {
    hidePreloader();
});



// !! IMPORTANT: GOOGLE FORM CONFIGURATION (The correct, functional logic) !!

const FORM_ID = "1FAIpQLSczV7to0hvM6wCbxzx_qfncLimfOWYEuap8438x4IngDO4f0w";
const GOOGLE_FORM_SUBMIT_URL = `https://docs.google.com/forms/d/e/${FORM_ID}/formResponse`; 

const FIELD_MAP = {
    'name': '780854094',      
    'email': '383541647',    
    'project': '714113470', 
    'message': '511356580'  
};

function showSuccessPopup() {
    const popup = document.getElementById('successPopup');
    if (!popup) {
        console.error("Popup element #successPopup not found.");
        return;
    }

    popup.classList.add('show');
    popup.style.display = 'block';

    setTimeout(() => {
        popup.classList.remove('show');
        setTimeout(() => {
            popup.style.display = 'none';
        }, 500); 
    }, 3000); 
}

// --- Event Listener for Form Submission (This is the one that works) ---
document.getElementById('contactForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const dataToSubmit = new URLSearchParams();

    for (const [key, value] of formData.entries()) {
        const googleId = FIELD_MAP[key];
        
        if (googleId) {
            dataToSubmit.append(`entry.${googleId}`, value);
        }
    }

    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;

    try {
        await fetch(GOOGLE_FORM_SUBMIT_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: dataToSubmit 
        });

        showSuccessPopup(); 
        form.reset();

    } catch (error) {
        console.error('Submission error:', error);
        alert('There was an error sending your message. Please try again.');
    } finally {
        submitButton.textContent = 'Send Message 🚀';
        submitButton.disabled = false;
    }
});
