document.addEventListener('DOMContentLoaded', () => {
    
    // === 1. AUDIO INTERACTIVITY + CANVAS LIVE WAVE VISUALIZER ===
    const audio = document.getElementById('demo-audio');
    const slider = document.getElementById('volume-slider');
    const boostLevel = document.getElementById('boost-level');
    const playBtn = document.getElementById('play-btn');
    const canvas = document.getElementById('visualizer-canvas');
    const canvasCtx = canvas.getContext('2d');

    let audioCtx, source, gainNode, analyser, bufferLength, dataArray;

    function initAudio() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            source = audioCtx.createMediaElementSource(audio);
            gainNode = audioCtx.createGain();
            
            // Setup analyser node for real-time waveform reading
            analyser = audioCtx.createAnalyser();
            analyser.fftSize = 64; // Small sample size for compact UI bar movement
            bufferLength = analyser.frequencyBinCount;
            dataArray = new Uint8Array(bufferLength);

            // Connect processing chain nodes
            source.connect(gainNode);
            gainNode.connect(analyser);
            analyser.connect(audioCtx.destination);
            
            gainNode.gain.value = slider ? slider.value / 100 : 1;
            drawVisualizer();
        }
    }

    // Dynamic recursive canvas animation frame loop
    function drawVisualizer() {
        requestAnimationFrame(drawVisualizer);
        if (!analyser) return;

        analyser.getByteFrequencyData(dataArray);
        canvasCtx.fillStyle = '#111';
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength) * 1.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i] / 4; // Scale sound bytes down to canvas bounds
            // Transition color spectrum based on variable frequency levels
            canvasCtx.fillStyle = `rgb(${barHeight + 100}, 37, 235)`;
            canvasCtx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);
            x += barWidth;
        }
    }

    if (playBtn && audio) {
        playBtn.addEventListener('click', async () => {
            initAudio();
            if (audioCtx.state === 'suspended') await audioCtx.resume();

            if (audio.paused) {
                audio.play();
                playBtn.innerText = "Pause";
                playBtn.style.background = "#dc2626";
            } else {
                audio.pause();
                playBtn.innerText = "Play";
                playBtn.style.background = "#2563eb";
            }
        });

        audio.addEventListener('ended', () => {
            playBtn.innerText = "Play";
            playBtn.style.background = "#2563eb";
        });
    }

    if (slider) {
        slider.addEventListener('input', () => {
            const value = slider.value;
            if (boostLevel) boostLevel.innerText = value;
            if (gainNode) gainNode.gain.value = value / 100;
        });
    }

    // === 2. CARD DESCRIPTION TOGGLE ===
    const projectCard = document.getElementById('project-card');
    const btn = document.getElementById('show-more-btn');

    if (btn && projectCard) {
        btn.addEventListener('click', () => {
            projectCard.classList.toggle('expanded');
            btn.innerText = projectCard.classList.contains('expanded') ? "Hide Description" : "Show Description";
        });
    }

    // === 3. SKILL BOXES ROTATION ===
    const boxes = document.querySelectorAll('.skill-box');
    boxes.forEach(box => {
        box.addEventListener('mouseenter', () => {
            const degree = (Math.floor(Math.random() * 5) + 1) * (Math.random() < 0.5 ? 1 : -1);
            box.style.transform = `rotate(${degree}deg) scale(1.05)`;
        });
        box.addEventListener('mouseleave', () => {
            box.style.transform = 'rotate(0deg) scale(1)';
        });
    });

    // === 4. INTERACTIVE CLIENT-SIDE FORM VALIDATOR ===
    const contactForm = document.getElementById('contact-form');
    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const msgInput = document.getElementById('form-msg');
    const feedback = document.getElementById('validation-feedback');

    function validateField(input, condition) {
        if (condition) {
            input.classList.remove('invalid');
            input.classList.add('valid');
            return true;
        } else {
            input.classList.remove('valid');
            input.classList.add('invalid');
            return false;
        }
    }

    if (contactForm) {
        // Real-time listener checks as the user types
        contactForm.addEventListener('input', () => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            const isNameValid = validateField(nameInput, nameInput.value.trim().length >= 3);
            const isEmailValid = validateField(emailInput, emailRegex.test(emailInput.value.trim()));
            const isMsgValid = validateField(msgInput, msgInput.value.trim().length > 0);

            if (isNameValid && isEmailValid && isMsgValid) {
                feedback.style.display = 'block';
                feedback.style.background = '#14532d';
                feedback.style.color = '#4ade80';
                feedback.style.border = '1px solid #22c55e';
                feedback.innerText = '✓ Form is filled correctly. Ready to submit!';
            } else {
                feedback.style.display = 'none';
            }
        });

        contactForm.addEventListener('submit', (e) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const valid = nameInput.value.trim().length >= 3 && emailRegex.test(emailInput.value.trim()) && msgInput.value.trim().length > 0;
            
            if (!valid) {
                e.preventDefault(); // Halt standard browser forwarding execution
                feedback.style.display = 'block';
                feedback.style.background = '#7f1d1d';
                feedback.style.color = '#fca5a5';
                feedback.style.border = '1px solid #ef4444';
                feedback.innerText = '⚠️ Please fix the highlighted errors before submitting.';
            }
        });
    }
});
