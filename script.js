// Valentine's Day Proposal - Interactive Script

document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const envelope = document.getElementById('envelope');
    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');
    const reconsiderBtn = document.getElementById('reconsiderBtn');
    const heartsContainer = document.getElementById('heartsContainer');
    const fireworksContainer = document.getElementById('fireworks');

    // Screens
    const screen1 = document.getElementById('screen1');
    const screen2 = document.getElementById('screen2');
    const screen3 = document.getElementById('screen3');
    const screen4 = document.getElementById('screen4');

    // State
    let noClickCount = 0;
    const noButtonTexts = [
        "No",
        "Are you sure?",
        "Really sure?",
        "Think again!",
        "Last chance!",
        "Surely not?",
        "You might regret this!",
        "Give it another thought!",
        "Are you absolutely certain?",
        "This is making me sad",
        "I'm gonna cry...",
        "You're breaking my heart"
    ];

    // Create floating hearts background
    function createFloatingHearts() {
        const hearts = ['❤️', '💕', '💗', '💓', '💖', '💘', '💝'];

        setInterval(() => {
            const heart = document.createElement('div');
            heart.className = 'floating-heart';
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
            heart.style.animationDuration = (Math.random() * 5 + 8) + 's';
            heartsContainer.appendChild(heart);

            // Remove heart after animation
            setTimeout(() => {
                heart.remove();
            }, 15000);
        }, 500);
    }

    // Switch between screens
    function showScreen(screenToShow) {
        [screen1, screen2, screen3, screen4].forEach(screen => {
            screen.classList.remove('active');
        });
        screenToShow.classList.add('active');
    }

    // Envelope click handler
    envelope.addEventListener('click', () => {
        envelope.classList.add('opened');

        // Wait for animation then show question
        setTimeout(() => {
            showScreen(screen2);
        }, 1000);
    });

    // Yes button handler
    yesBtn.addEventListener('click', () => {
        showScreen(screen3);
        createFireworks();
        createConfetti();
        createSparkles();

        // Extra hearts celebration
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                createBurstHeart();
            }, i * 100);
        }
    });

    // No button handler - gets harder to click!
    noBtn.addEventListener('click', () => {
        noClickCount++;

        // Update button text
        if (noClickCount < noButtonTexts.length) {
            noBtn.textContent = noButtonTexts[noClickCount];
        }

        // Make yes button grow
        yesBtn.classList.add('growing');

        // Make no button smaller
        const currentFontSize = parseFloat(window.getComputedStyle(noBtn).fontSize);
        const currentPadding = parseFloat(window.getComputedStyle(noBtn).paddingTop);

        noBtn.style.fontSize = Math.max(currentFontSize * 0.85, 10) + 'px';
        noBtn.style.padding = `${Math.max(currentPadding * 0.85, 5)}px ${Math.max(currentPadding * 1.5, 10)}px`;

        // After many clicks, show the sad screen
        if (noClickCount >= 5) {
            setTimeout(() => {
                showScreen(screen4);
            }, 300);
        }
    });

    // Make No button run away on hover (optional fun feature)
    let runAwayEnabled = false;

    noBtn.addEventListener('mouseenter', () => {
        if (noClickCount >= 3 && runAwayEnabled) {
            const maxX = window.innerWidth - noBtn.offsetWidth - 50;
            const maxY = window.innerHeight - noBtn.offsetHeight - 50;

            const randomX = Math.random() * maxX;
            const randomY = Math.random() * maxY;

            noBtn.style.position = 'fixed';
            noBtn.style.left = randomX + 'px';
            noBtn.style.top = randomY + 'px';
            noBtn.style.zIndex = '1000';
        }
    });

    // Reconsider button handler
    reconsiderBtn.addEventListener('click', () => {
        showScreen(screen2);
        // Reset no button but keep yes button big
        noClickCount = 0;
        noBtn.textContent = noButtonTexts[0];
        noBtn.style.fontSize = '';
        noBtn.style.padding = '';
        noBtn.style.position = '';
    });

    // Create fireworks effect
    function createFireworks() {
        const colors = ['#ff6b6b', '#ff8e8e', '#ffd93d', '#ff6b6b', '#c56cf0', '#ff9ff3'];

        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const firework = document.createElement('div');
                firework.className = 'firework';
                firework.style.left = Math.random() * 100 + '%';
                firework.style.top = Math.random() * 60 + 20 + '%';
                firework.style.background = colors[Math.floor(Math.random() * colors.length)];
                fireworksContainer.appendChild(firework);

                setTimeout(() => {
                    firework.remove();
                }, 1000);
            }, i * 200);
        }
    }

    // Create confetti effect
    function createConfetti() {
        const colors = ['#ff6b6b', '#ffd93d', '#6bcbff', '#c56cf0', '#ff9ff3', '#54a0ff', '#5f27cd'];
        const shapes = ['circle', 'square', 'triangle'];

        for (let i = 0; i < 100; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';

                const shape = shapes[Math.floor(Math.random() * shapes.length)];
                if (shape === 'circle') {
                    confetti.style.borderRadius = '50%';
                } else if (shape === 'triangle') {
                    confetti.style.width = '0';
                    confetti.style.height = '0';
                    confetti.style.borderLeft = '5px solid transparent';
                    confetti.style.borderRight = '5px solid transparent';
                    confetti.style.borderBottom = '10px solid ' + colors[Math.floor(Math.random() * colors.length)];
                    confetti.style.background = 'transparent';
                }

                document.body.appendChild(confetti);

                setTimeout(() => {
                    confetti.remove();
                }, 4000);
            }, i * 30);
        }
    }

    // Create sparkles around the celebration
    function createSparkles() {
        const celebration = document.querySelector('.celebration');

        setInterval(() => {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.left = Math.random() * 100 + '%';
            sparkle.style.top = Math.random() * 100 + '%';
            sparkle.style.animationDelay = Math.random() * 0.5 + 's';
            celebration.appendChild(sparkle);

            setTimeout(() => {
                sparkle.remove();
            }, 1500);
        }, 200);
    }

    // Create burst hearts for celebration
    function createBurstHeart() {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = ['❤️', '💕', '💗', '💖', '💘'][Math.floor(Math.random() * 5)];
        heart.style.left = 50 + (Math.random() - 0.5) * 50 + '%';
        heart.style.top = '50%';
        heart.style.fontSize = (Math.random() * 30 + 20) + 'px';
        heart.style.animation = 'none';
        heart.style.transition = 'all 1s ease-out';
        heart.style.opacity = '1';

        heartsContainer.appendChild(heart);

        // Animate outward
        setTimeout(() => {
            const angle = Math.random() * Math.PI * 2;
            const distance = 200 + Math.random() * 200;
            heart.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`;
            heart.style.opacity = '0';
        }, 50);

        setTimeout(() => {
            heart.remove();
        }, 1500);
    }

    // Add touch support for mobile
    function addTouchSupport() {
        let touchStartX, touchStartY;

        noBtn.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });

        noBtn.addEventListener('touchmove', (e) => {
            if (noClickCount >= 3 && runAwayEnabled) {
                e.preventDefault();
                const maxX = window.innerWidth - noBtn.offsetWidth - 20;
                const maxY = window.innerHeight - noBtn.offsetHeight - 20;

                const randomX = Math.random() * maxX;
                const randomY = Math.random() * maxY;

                noBtn.style.position = 'fixed';
                noBtn.style.left = randomX + 'px';
                noBtn.style.top = randomY + 'px';
                noBtn.style.zIndex = '1000';
            }
        });
    }

    // Initialize
    createFloatingHearts();
    addTouchSupport();

    // Add keyboard support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            if (screen1.classList.contains('active')) {
                envelope.click();
            } else if (screen2.classList.contains('active')) {
                yesBtn.click();
            } else if (screen4.classList.contains('active')) {
                reconsiderBtn.click();
            }
        }
    });

    // Easter egg: Konami code reveals a special message
    let konamiCode = [];
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.key);
        konamiCode = konamiCode.slice(-10);

        if (konamiCode.join(',') === konamiSequence.join(',')) {
            alert('🎉 You found the secret! I love you more than code! 💕');
            konamiCode = [];
        }
    });
});
