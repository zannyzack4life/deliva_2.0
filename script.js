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


const rawLines = [
        { text: "Hello I'm \nOnyekachi Jeremiah", highlight: ["Onyekachi", "Jeremiah"] },
        { text: "I don’t just code I \ncraft experiences", highlight: ["craft", "experiences"] },
        { text: "Making UIs that hits \nvisually & functionally.", highlight: ["visually", "functionally"] },
        { text: "Creating dope digital \nstuff since forever", highlight: ["digital", "forever"] }
        ];

        const h1 = document.querySelector('.disp-text');
        let lineIndex = 0;
        let charIndex = 0;
        let typing = true;

        function getTypedHTML(line, charIndex) {
        const { text, highlight } = line; // highlight is now an array
        let html = "";

        for (let i = 0; i < charIndex; i++) {
            const char = text[i];

            // Check if current char is inside any of the highlight words
            let isHighlighted = false;
            for (const word of highlight) {
            const start = text.indexOf(word);
            const end = start + word.length;
            if (i >= start && i < end) {
                isHighlighted = true;
                break;
            }
            }

            html += isHighlighted ? `<span class="color-changing">${char}</span>` : (char === "\n" ? "<br>" : char);
        }

        return html;
        }

        function typeLoop() {
        const line = rawLines[lineIndex];

        if (typing) {
            if (charIndex <= line.text.length) {
            h1.innerHTML = getTypedHTML(line, charIndex++);
            setTimeout(typeLoop, 100);
            } else {
            typing = false;
            setTimeout(typeLoop, 5000);
            }
        } else {
            if (charIndex > 0) {
            h1.innerHTML = getTypedHTML(line, --charIndex);
            setTimeout(typeLoop, 60);
            } else {
            typing = true;
            lineIndex = (lineIndex + 1) % rawLines.length;
            setTimeout(typeLoop, 500);
            }
        }
        }

        typeLoop();
