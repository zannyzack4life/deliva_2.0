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
    


           // Modal Functions
// ===============================
  // ===== ModalA Functions =====
        function openModalA(modalId) {
            const modal = document.getElementById(modalId);
            if (!modal) return;
            modal.classList.add('show');
            modal.classList.remove('opacity-0', 'invisible');
            modal.classList.add('opacity-100', 'visible');
            document.body.style.overflow = 'hidden';
        }

        function closeModalA(modalId) {
            const modal = document.getElementById(modalId);
            if (!modal) return;
            modal.classList.remove('show', 'opacity-100', 'visible');
            modal.classList.add('opacity-0', 'invisible');
            document.body.style.overflow = 'auto';
        }

        function showPaymentFormA() {
            closeModalA('deliveryModalA');
            setTimeout(() => {
                openModalA('termsModalA');
            }, 300);
        }

        function showPickupInfoA() {
            closeModalA('deliveryModalA');
            setTimeout(() => {
                openModalA('pickupModalA');
            }, 300);
        }

        function confirmPaymentA() {
            closeModalA('termsModalA');
            setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 300);
        }

        function copyAddressA(event) {
            const address = document.getElementById('storeAddressA').innerText;
            if (navigator.clipboard) {
                navigator.clipboard.writeText(address).then(() => {
                    const button = event.target;
                    const originalText = button.innerHTML;
                    button.innerHTML = '<i class="fas fa-check mr-3"></i>Address Copied!';
                    button.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
                    setTimeout(() => {
                        button.innerHTML = originalText;
                        button.style.background = '';
                    }, 2000);
                });
            } else {
                const textArea = document.createElement('textarea');
                textArea.value = address;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                alert('Address copied to clipboard!');
            }
        }

        function toggleCheckboxA() {
            const checkbox = document.getElementById('agreeTermsA');
            const customCheckbox = document.getElementById('customCheckboxA');
            const checkIcon = document.getElementById('checkIconA');
            const confirmButton = document.getElementById('confirmPaymentBtnA');
            const buttonGradient = document.getElementById('buttonGradientA');
            const buttonIcon = document.getElementById('buttonIconA');
            const buttonText = document.getElementById('buttonTextA');
            checkbox.checked = !checkbox.checked;
            if (checkbox.checked) {
                customCheckbox.style.background = 'linear-gradient(135deg, #A82925, #165A99)';
                customCheckbox.style.borderColor = '#A82925';
                checkIcon.style.opacity = '1';
                confirmButton.disabled = false;
                confirmButton.classList.remove('cursor-not-allowed');
                buttonGradient.style.opacity = '1';
                buttonIcon.className = 'fas fa-credit-card mr-3 text-lg';
                buttonText.textContent = 'Confirm Payment';
            } else {
                customCheckbox.style.background = 'white';
                customCheckbox.style.borderColor = '#ECB431';
                checkIcon.style.opacity = '0';
                confirmButton.disabled = true;
                confirmButton.classList.add('cursor-not-allowed');
                buttonGradient.style.opacity = '0';
                buttonIcon.className = 'fas fa-lock mr-3 text-lg';
                buttonText.textContent = 'Please Accept Terms';
            }
        }

        // Close modalA when clicking outside
        window.addEventListener('click', function(event) {
            const modals = document.querySelectorAll('.modalA');
            modals.forEach(modal => {
                if (event.target === modal) {
                    closeModalA(modal.id);
                }
            });
        });

        // Close modalA with Escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                const openModal = document.querySelector('.modalA.show');
                if (openModal) {
                    closeModalA(openModal.id);
                }
            }
        });

// ===============================
// Smooth scrolling for anchor links
// ===============================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});



      // Package selection
        function selectPackage(packageType, price, element) {
            // Remove selection from all packages
            document.querySelectorAll('.package-option').forEach(option => {
                option.classList.remove('border-[#10B981]', 'bg-[#10B981]/5', 'selected'); // updated to green
                option.classList.add('border-gray-200');
                const radio = option.querySelector('.package-radio');
                radio.classList.remove('bg-[#10B981]', 'border-[#10B981]'); // updated to green
                radio.classList.add('border-gray-300');
                radio.innerHTML = '';
            });

            // Add selection to clicked package
            element.classList.remove('border-gray-200');
            element.classList.add('border-[#10B981]', 'bg-[#10B981]/5', 'selected'); // green border & bg
            const radio = element.querySelector('.package-radio');
            radio.classList.remove('border-gray-300');
            radio.classList.add('bg-[#10B981]', 'border-[#10B981]'); // green radio
            radio.innerHTML = '<i class="fas fa-check text-white text-xs"></i>';


            // Store selected package data
            const packageNames = {
                'starter': 'Starter Pack',
                'family': 'Family Pack', 
                'premium': 'Premium Pack'
            };

            const packageDetails = {
                'starter': '2 Premium Jars',
                'family': '4 Premium Jars • Save ₦2,500',
                'premium': '6 Premium Jars • Best Value'
            };

            selectedPackageData = {
                type: packageType,
                name: packageNames[packageType],
                details: packageDetails[packageType],
                price: price
            };

            updatePayButton();
            showPackageSummary();
        }

        function updatePayButton() {
            const payBtn = document.getElementById('payNowBtn');
            
            if (selectedPackageData) {
                payBtn.disabled = false;
                payBtn.classList.remove('bg-gray-300', 'text-gray-500', 'cursor-not-allowed');
                payBtn.classList.add('bg-[#A82925]', 'text-white', 'hover:bg-[#8B1F1C]', 'cursor-pointer', 'transform', 'hover:scale-105');
                payBtn.innerHTML = `<i class="fas fa-credit-card mr-2"></i>Pay ₦${selectedPackageData.price.toLocaleString()} Now`;
            } else {
                payBtn.disabled = true;
                payBtn.classList.add('bg-gray-300', 'text-gray-500', 'cursor-not-allowed');
                payBtn.classList.remove('bg-[#A82925]', 'text-white', 'hover:bg-[#8B1F1C]', 'cursor-pointer', 'transform', 'hover:scale-105');
                payBtn.innerHTML = '<i class="fas fa-credit-card mr-2"></i>Select Package First';
            }
        }

        function showPackageSummary() {
            const summary = document.getElementById('packageSummary');
            
            if (selectedPackageData) {
                document.getElementById('selectedPackageName').textContent = selectedPackageData.name;
                document.getElementById('selectedPackageDetails').textContent = selectedPackageData.details;
                document.getElementById('selectedPackagePrice').textContent = `₦${selectedPackageData.price.toLocaleString()}`;
                summary.classList.remove('hidden');
            } else {
                summary.classList.add('hidden');
            }
        }


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




    
