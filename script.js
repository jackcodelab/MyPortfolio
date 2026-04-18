document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('demo-audio');
    const slider = document.getElementById('volume-slider');
    const boostLevel = document.getElementById('boost-level');
    const playBtn = document.getElementById('play-btn');

    let audioCtx, source, gainNode;

    if (playBtn) {
        playBtn.addEventListener('click', () => {
            if (audio.paused) {
                audio.play();
            } else {
                audio.pause();
            }
        });
    }

    if (slider) {
        slider.oninput = () => {
            const value = slider.value;
            if (boostLevel) boostLevel.innerText = value;

            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                source = audioCtx.createMediaElementSource(audio);
                gainNode = audioCtx.createGain();
                source.connect(gainNode);
                gainNode.connect(audioCtx.destination);
            }


            gainNode.gain.value = value / 100;
        };
    }





    const myForm = document.getElementById('contact-form');

    if (myForm) {
        myForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const formData = new FormData(myForm);
            const dataObject = Object.fromEntries(formData);


            try {
                const response = await fetch('http://localhost:3000/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dataObject)
                });

                if (response.ok) {
                    alert('Success! Message saved to local database.');
                    myForm.reset();
                } else {
                    alert('Error: Check if json-server is running.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Could not connect to the server. Did you run "json-server --watch db.json"?');
            }
        });
    }
});



document.addEventListener('DOMContentLoaded', () => {
    const boxes = document.querySelectorAll('.skill-box');

    const applyRandomRotation = (element) => {
 
        const degree = Math.floor(Math.random() * 5) + 1;

        const direction = Math.random() < 0.5 ? 1 : -1;
        const finalRotation = degree * direction;


        element.style.transform = `rotate(${finalRotation}deg) scale(1.1)`;
    };

    const resetRotation = (element) => {
        element.style.transform = `rotate(0deg) scale(1)`;
    };

    boxes.forEach(box => {

        box.addEventListener('mouseenter', () => applyRandomRotation(box));

        box.addEventListener('mouseleave', () => resetRotation(box));

        box.addEventListener('click', () => applyRandomRotation(box));
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const projectCard = document.getElementById('project-card');
    const btn = document.getElementById('show-more-btn');

    if (btn && projectCard) {
        btn.addEventListener('click', () => {
            projectCard.classList.toggle('expanded');

            if (projectCard.classList.contains('expanded')) {
                btn.innerText = "Show Less";
            } else {
                btn.innerText = "Show Full";
            }
        });
    }
});

const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevents the page from refreshing

    // Collect data from the form fields
    const formData = new FormData(contactForm);
    const data = {
        username: formData.get('username'),
        email: formData.get('email'),
        message: formData.get('message')
    };

    try {
        // Send a POST request to your json-server
        const response = await fetch('http://localhost:3000/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('Details stored successfully in db.json!');
            contactForm.reset(); // Clear the form
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Check if json-server is running on port 3000.');
    }
});
