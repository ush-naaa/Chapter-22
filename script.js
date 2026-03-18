function buildBunting() {
    const row1 = ['H','A','P','P','Y','','B','I','R','T','H','D','A','Y'];
    const row2 = ['A','E','N','A','T','O','O','S','E','X','Y'];
    const colors = ['#ff007f','#00c4ef','#7000ff','#ffcc00','#00e07a'];

    function buildRow(letters, containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        const realLetters = letters.filter(l => l !== '');
        const total = realLetters.length;
        let pennantIndex = 0;

        letters.forEach((letter, i) => {
            if (letter === '') {
                const spacer = document.createElement('div');
                spacer.style.width = '30px';
                container.appendChild(spacer);
                return;
            }

            const t = pennantIndex / (total - 1);
            const sag = 30 * Math.sin(t * Math.PI);

            const pennant = document.createElement('div');
            pennant.className = 'pennant';
            pennant.style.background = colors[i % colors.length];
            pennant.style.animationDelay = `${i * 0.12}s`;
            pennant.style.marginTop = `${sag}px`;

            const span = document.createElement('span');
            span.textContent = letter;
            pennant.appendChild(span);
            container.appendChild(pennant);

            pennantIndex++;
        });
    }

    buildRow(row1, 'pennants-row1');
    buildRow(row2, 'pennants-row2');

    // After pennants are in the DOM, measure their top-center positions
    // and draw the string through them
    
}

window.addEventListener('load', buildBunting);

const blowBtn = document.getElementById("blowBtn");
const slider = document.getElementById("ageSlider");
const display = document.getElementById("ageDisplay");
const message = document.getElementById("message");
const candleContainer = document.getElementById("candle-container");
const increaseBtn = document.getElementById("increaseBtn");

let candlesBlown = false;

// Generate fixed random candle positions
const fixedPositions = [];
for (let i = 0; i < 40; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radiusX = Math.random() * 105;
    const radiusY = Math.random() * 35;

    fixedPositions.push({
        x: 140 + radiusX * Math.cos(angle),
        y: 50 + radiusY * Math.sin(angle),
        delay: Math.random()
    });
}

const cheekyMessages = [
    "A bit young for a mid-life crisis?",
    "Nice try, kiddo.",
    "Don't lie to the cake, it knows.",
    "U gonn lie to haji basheer?",
    "Almost at the 'perfect' age...",
    "Only 22-year-olds get the secret wish."
];

function updateCandles(count) {
    const currentCandles = candleContainer.children.length;

    if (count > currentCandles) {
        for (let i = currentCandles; i < count; i++) {
            const pos = fixedPositions[i];

            const candle = document.createElement("div");
            candle.className = "candle";
            candle.style.left = `${pos.x}px`;
            candle.style.top = `${pos.y}px`;
            candle.style.transform = "translate(-50%, -100%)";

            const flame = document.createElement("div");
            flame.className = "flame";
            flame.style.animationDelay = `${pos.delay}s`;

            candle.appendChild(flame);
            candleContainer.appendChild(candle);
        }
    } else if (count < currentCandles) {
        for (let i = currentCandles; i > count; i--) {
            candleContainer.lastElementChild.remove();
        }
    }
}

// Slider logic
slider.addEventListener("input", () => {
    const val = parseInt(slider.value);
    display.textContent = val;

    updateCandles(val);

    // Reset candles if user moves away from 22
    if (val !== 22) {
        candlesBlown = false;
        const flames = document.querySelectorAll(".flame");
        flames.forEach(flame => {
            flame.style.opacity = "1";
        });
    }

    if (val === 0) {
        message.textContent = "Slide to your age...";
        message.className = "";
        blowBtn.classList.add("hidden");

    } else if (val === 22) {
        // Hide message, show button with transition
        message.classList.add("hidden");
        blowBtn.classList.remove("hidden");

    } else {
        // Show cheeky messages, hide button
        message.textContent = cheekyMessages[val % cheekyMessages.length];
        message.className = "error-text";
        blowBtn.classList.add("hidden");
    }
});

// + button logic
increaseBtn.addEventListener("click", () => {
    let currentVal = parseInt(slider.value);
    if (currentVal < 22) {
        slider.value = currentVal + 1;
        slider.dispatchEvent(new Event("input"));
    }
});

// Blow button logic
// Update the Blow button logic
blowBtn.addEventListener("click", () => {
    if (!candlesBlown) {
        // 1. Extinguish candles
        extinguishCandles();
        candlesBlown = true;

        // 2. Disable UI
        slider.disabled = true;
        increaseBtn.disabled = true;

        // 3. Trigger Celebration
        setTimeout(() => {
            // Drop the banner
            const banner = document.getElementById("birthday-banner");
            banner.classList.add("show");

            // NEW: Push the cake to the lower middle
            const cakeContainer = document.querySelector('.cake-container');
            cakeContainer.classList.add('lower'); 

            // Trigger the 10-second confetti
            // Trigger the 10-second confetti
             triggerConfetti();

            // Show more button after confetti finishes (10s confetti + 3s delay)
            setTimeout(() => {
            document.getElementById('moreBtn').classList.remove('hidden');
            }, 13000); 
    
            // Hide the controls
            const inputContainer = document.querySelector('.input-container');
            inputContainer.style.opacity = "0";
            inputContainer.style.pointerEvents = "none";
            
            // Also hide the blow button specifically
            
        }, 400); 
    }
});
function extinguishCandles() {
    const flames = document.querySelectorAll(".flame");

    flames.forEach((flame, index) => {
        // Add a tiny random delay to each flame so they don't all vanish at the exact same millisecond
        setTimeout(() => {
            flame.classList.add("extinguished");
        }, index * 40); // staggered effect
    });
}
function triggerConfetti() {
    const duration = 10 * 1000; // 10 seconds
    const animationEnd = Date.now() + duration;

    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 40;
        
        confetti({
            particleCount,
            startVelocity: 30,
            spread: 360,
            origin: { x: Math.random(), y: Math.random() - 0.2 },
            colors: ['#ff007f', '#00d4ff', '#7000ff', '#ffcc00', '#00ff88']
        });
    }, 250);
}
// Show more button after confetti ends

// Go to letter screen
document.getElementById('moreBtn').addEventListener('click', () => {
    document.getElementById('letter-screen').classList.add('show');
});
function openEnvelope() {
    const flap = document.getElementById('svg-flap');
    const letter = document.getElementById('letter-paper');
    const hint = document.querySelector('.hint-text');

    // Hide hint
    hint.style.opacity = '0';

    // Animate flap open
    flap.style.transition = 'transform 0.6s ease';
    flap.style.transformOrigin = 'top';
    flap.style.transform = 'scaleY(-1)';
    flap.setAttribute('fill', '#d4b97a');

    // Open full letter after flap animation
    setTimeout(() => {
        letter.classList.add('open');
    }, 600);
}

function closeEnvelope() {
    const letter = document.getElementById('letter-paper');
    const flap = document.getElementById('svg-flap');
    const hint = document.querySelector('.hint-text');

    // Close letter first
    letter.classList.remove('open');

    // Reset flap and hint after letter finishes closing
    setTimeout(() => {
        flap.style.transform = 'scaleY(1)';
        flap.setAttribute('fill', '#e8cf9a');
        hint.style.opacity = '1';
    }, 700);
}