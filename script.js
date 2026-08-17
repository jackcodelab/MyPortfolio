document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. FEATURE ONE: GITHUB API TRACKER
    // ==========================================
    const ghWidget = document.getElementById('github-widget');
    const refreshGhBtn = document.getElementById('refresh-gh-btn');
    const username = 'JackAtTheRate1687';

    async function fetchGitHubStats() {
        if (!ghWidget) return;
        ghWidget.innerHTML = '<p class="loading-text">Fetching API payload metrics...</p>';
        
        try {
            const response = await fetch(`https://github.com{username}`);
            if (!response.ok) throw new Error('Network error mapping profile data');
            
            const data = await response.json();
            ghWidget.innerHTML = `
                <div style="display:flex; align-items:center; gap:12px;">
                    <img src="${data.avatar_url}" width="45" style="border-radius:50%; border:1px solid #ccc;">
                    <div>
                        <strong style="font-size:16px;">${data.name || username}</strong>
                        <p style="margin:2px 0 0 0; font-size:12px; color:#555;">Public Repos: <b>${data.public_repos}</b></p>
                        <p style="margin:2px 0 0 0; font-size:12px; color:#555;">Followers: <b>${data.followers}</b></p>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error(error);
            ghWidget.innerHTML = '<p style="color:#ef4444; font-size:12px;">⚠️ Failed to load profile data from API.</p>';
        }
    }

    if (refreshGhBtn) {
        refreshGhBtn.addEventListener('click', fetchGitHubStats);
    }
    fetchGitHubStats(); // Initial lifecycle mount trigger

    // ==========================================
    // 2. FEATURE TWO: FREELANCE PROJECT CALCULATOR
    // ==========================================
    const calcPages = document.getElementById('calc-pages');
    const pagesVal = document.getElementById('pages-val');
    const calcTier = document.getElementById('calc-tier');
    const calcTotal = document.getElementById('calc-total');

    function calculateCost() {
        if (!calcPages || !calcTier || !calcTotal) return;
        const pageCount = parseInt(calcPages.value, 10);
        const tierMultiplier = parseInt(calcTier.value, 10);
        
        if (pagesVal) pagesVal.innerText = pageCount;
        calcTotal.innerText = pageCount * tierMultiplier;
    }

    if (calcPages && calcTier) {
        calcPages.addEventListener('input', calculateCost);
        calcTier.addEventListener('change', calculateCost);
    }

    // ==========================================
    // 3. FEATURE THREE: TYPOGRAPHY LAB SANDBOX
    // ==========================================
    const sandboxInput = document.getElementById('sandbox-input');
    const sandboxSize = document.getElementById('sandbox-size');
    const fontSizeVal = document.getElementById('font-size-val');
    const sandboxPreview = document.getElementById('sandbox-preview');

    function updateSandbox() {
        if (!sandboxInput || !sandboxSize || !sandboxPreview) return;
        const size = sandboxSize.value;
        
        if (fontSizeVal) fontSizeVal.innerText = size;
        sandboxPreview.innerText = sandboxInput.value || ' ';
        sandboxPreview.style.fontSize = `${size}px`;
    }

    if (sandboxInput && sandboxSize) {
        sandboxInput.addEventListener('input', updateSandbox);
        sandboxSize.addEventListener('input', updateSandbox);
    }

    // ==========================================
    // 4. ANIMATION: SKILL BOX ROTATION HINTS
    // ==========================================
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

    // ==========================================
    // 5. CONTACT FORM CLIENT-SIDE VALIDATION
    // ==========================================
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
                e.preventDefault();
                feedback.style.display = 'block';
                feedback.style.background = '#7f1d1d';
                feedback.style.color = '#fca5a5';
                feedback.style.border = '1px solid #ef4444';
                feedback.innerText = '⚠️ Please fix the highlighted errors before submitting.';
            }
        });
    }
});
