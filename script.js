        // Loading Screen Management
        window.addEventListener('load', function() {
            const loadingScreen = document.getElementById('loadingScreen');
            const loadingText = document.querySelector('.loading-text');
            
            const messages = [
                'Preparing your culinary journey...',
                'Mixing authentic flavors...',
                'Heating up the kitchen...',
                'Almost ready to serve...'
            ];
            
            let messageIndex = 0;
            const messageInterval = setInterval(() => {
                messageIndex = (messageIndex + 1) % messages.length;
                loadingText.textContent = messages[messageIndex];
            }, 800);
            
            // Hide loading screen after minimum 3 seconds
            setTimeout(() => {
                clearInterval(messageInterval);
                loadingScreen.classList.add('hidden');
                document.body.style.overflow = 'auto';
                
                // Remove loading screen from DOM after animation
                setTimeout(() => {
                    loadingScreen.remove();
                }, 800);
            }, 3000);
        });

        // Enhanced Modal Functions
        function openModal(modalType) {
            const modal = document.getElementById(modalType + 'Modal');
            modal.style.display = 'flex';
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
            
            // Add entrance animation
            setTimeout(() => {
                modal.querySelector('.modal-content').style.transform = 'translateY(0) scale(1) rotateX(0deg)';
                modal.querySelector('.modal-content').style.opacity = '1';
            }, 10);
        }

        function closeModal(modalType) {
            const modal = document.getElementById(modalType + 'Modal');
            const modalContent = modal.querySelector('.modal-content');
            
            // Add exit animation
            modalContent.style.transform = 'translateY(-50px) scale(0.9) rotateX(10deg)';
            modalContent.style.opacity = '0';
            
            setTimeout(() => {
                modal.style.display = 'none';
                modal.classList.remove('show');
                document.body.style.overflow = 'auto';
            }, 300);
        }

        // Close modal when clicking outside
        window.onclick = function(event) {
            const modals = ['jollof', 'chicken', 'plantain', 'noodles', 'stew', 'seafood'];
            modals.forEach(modalType => {
                const modal = document.getElementById(modalType + 'Modal');
                if (event.target === modal) {
                    closeModal(modalType);
                }
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                const modals = ['jollof', 'chicken', 'plantain', 'noodles', 'stew', 'seafood'];
                modals.forEach(modalType => {
                    const modal = document.getElementById(modalType + 'Modal');
                    if (modal.classList.contains('show')) {
                        closeModal(modalType);
                    }
                });
            }
        });

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Add scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe all animated elements
        document.querySelectorAll('.fade-in-up, .slide-in-left, .slide-in-right').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(50px)';
            observer.observe(el);
        });
    

    // Typewriter Effect
    // function typeWriter(elementId, text, speed = 80, loop = false) {
    //     const el = document.getElementById(elementId);
    //     let i = 0;
    //     function typing() {
    //         if (i < text.length) {
    //             el.textContent += text.charAt(i);
    //             i++;
    //             setTimeout(typing, speed);
    //         } else if (loop) {
    //             setTimeout(() => {
    //                 el.textContent = '';
    //                 i = 0;
    //                 typing();
    //             }, 1200);
    //         }
    //     }
    //     el.textContent = '';
    //     typing();
    // }
    // // Example usage
    // document.addEventListener('DOMContentLoaded', function() {
    //     typeWriter('typewriter', "Loves Your Rice", 80, true);
    // });

    // Count Up Effect
    // function animateCountUp(el, target, duration = 1200) {
    //     let start = 0;
    //     const increment = target / (duration / 16);
    //     function update() {
    //         start += increment;
    //         if (start < target) {
    //             el.textContent = Math.floor(start);
    //             requestAnimationFrame(update);
    //         } else {
    //             el.textContent = target;
    //         }
    //     }
    //     update();
    // }
    // document.addEventListener('DOMContentLoaded', function() {
    //     document.querySelectorAll('.countup').forEach(el => {
    //         const target = parseInt(el.getAttribute('data-target'), 10);
    //         animateCountUp(el, target);
    //     });
    // });
