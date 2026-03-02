document.addEventListener('DOMContentLoaded', () => {

    // --- Theme Toggle ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');

    // Check for saved theme preference or use OS preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Initially, dark mode is on by default in the HTML body class
    // We adjust it based on saved preferences
    if (savedTheme === 'light') {
        document.body.classList.remove('dark-mode');
        themeIcon.classList.replace('fa-sun', 'fa-moon');
    } else if (savedTheme === 'dark' || prefersDark) {
        document.body.classList.add('dark-mode');
        if (themeIcon.classList.contains('fa-moon')) {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        }
    }

    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');

        if (isDarkMode) {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'light');
        }
    });

    // --- Sticky Navbar & Active Link Update ---
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links li a');

    window.addEventListener('scroll', () => {
        // Sticky Navbar
        if (window.scrollY > 50) {
            navbar.classList.add('sticky');
        } else {
            navbar.classList.remove('sticky');
        }

        // Active Link Update
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // --- Mobile Menu Toggle ---
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // --- Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll('.reveal-fade, .reveal-left, .reveal-right');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: Stop observing once revealed to animate only once
                // observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- Progress Bar Animations ---
    const progressBars = document.querySelectorAll('.progress');

    const progressObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.getAttribute('data-width');
                entry.target.style.width = width;
                observer.unobserve(entry.target); // Animate only once
            }
        });
    }, {
        threshold: 0.5
    });

    progressBars.forEach(bar => progressObserver.observe(bar));
});

// --- Lightbox Logic ---
window.openLightbox = function (element) {
    const img = element.querySelector('img').src;

    let title = "";
    let desc = "";
    // If it's a 3D folder card
    if (element.querySelector('.f-card-title')) {
        title = element.querySelector('.f-card-title').innerText;
    }
    // If it's a Certificate card
    else if (element.parentElement.querySelector('.cert-info h4')) {
        title = element.parentElement.querySelector('.cert-info h4').innerText;
        const descEl = element.parentElement.querySelector('.cert-info .desc-content');
        if (descEl) {
            desc = descEl.innerText;
        }
    }

    document.getElementById('lightbox-img').src = img;
    document.getElementById('lightbox-title').innerText = title;

    const descElement = document.getElementById('lightbox-desc');
    if (descElement) {
        descElement.innerText = desc;
        descElement.style.display = desc ? 'block' : 'none';
    }

    // Slight delay to allow display before animating opacity
    const lightbox = document.getElementById('lightbox');
    lightbox.style.display = 'flex';
    // force reflow
    void lightbox.offsetWidth;
    lightbox.classList.add('active');

    document.body.style.overflow = 'hidden';
};

window.closeLightbox = function () {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');

    setTimeout(() => {
        lightbox.style.display = 'none';
        document.body.style.overflow = '';
    }, 500); // match CSS transition duration
};

// Close on background click
document.addEventListener('DOMContentLoaded', () => {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.style.display = 'none'; // Initially hidden
        lightbox.addEventListener('click', (e) => {
            if (e.target.id === 'lightbox') {
                window.closeLightbox();
            }
        });
    }
});

// --- Contact Form Validation & Submission ---
document.addEventListener("DOMContentLoaded", function () {

    // Initialize EmailJS
    emailjs.init("Cj0qFyvzv8slD_dkz");

    const form = document.getElementById("contact-form");
    const submitBtn = document.getElementById("submit-btn");
    const formMessage = document.getElementById("form-message");

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const formData = new FormData(form);

        const name = formData.get("user_name");
        const email = formData.get("user_email");
        const subject = formData.get("user_subject");
        const message = formData.get("user_message");

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showMessage("Please enter a valid email address.", "error");
            return;
        }

        if (message.trim().length < 10) {
            showMessage("Message must be at least 10 characters.", "error");
            return;
        }

        // Loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = "Sending...";

        try {

            const response = await emailjs.send(
                "service_t8i2cyr",
                "template_vkbyxey",
                {
                    from_name: name,
                    from_email: email,
                    subject: subject,
                    message: message
                }
            );

            if (response.status === 200) {
                showMessage("Message sent successfully! I’ll contact you soon.", "success");
                form.reset();
            } else {
                showMessage("Something went wrong. Please try again.", "error");
            }

        } catch (error) {
            console.error("EmailJS Error:", error);
            showMessage("Failed to send message. Try again later.", "error");
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `Send Message <i class="fas fa-paper-plane"></i>`;
        }
    });

    function showMessage(msg, type) {
        formMessage.textContent = msg;
        formMessage.className = type === "success"
            ? "form-message success"
            : "form-message error";

        formMessage.style.display = "block";

        setTimeout(() => {
            formMessage.style.display = "none";
        }, 5000);
    }

});

















/*document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const formMessage = document.getElementById('form-message');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };

            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                showFormMessage('Please enter a valid email address', 'error');
                return;
            }

            // Validate message
            if (formData.message.trim().length < 10) {
                showFormMessage('Message must be at least 10 characters', 'error');
                return;
            }

            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            formMessage.style.display = 'none';

            try {
                // Send email using EmailJS
                const response = await emailjs.send(
                    'service_t8i2cyr', // Service ID
                    'template_vkbyxey', // Template ID
                    {
                        from_name: formData.name,
                        from_email: formData.email,
                        to_name: 'Ahmed Abdallah Hussein',
                        subject: formData.subject,
                        message: formData.message
                    },
                    'X18Q82_12W0l-5_5B' // Public Key
                );

                if (response.status === 200) {
                    showFormMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
                    contactForm.reset();
                } else {
                    showFormMessage('Failed to send message. Please try again or email me directly.', 'error');
                }
            } catch (error) {
                console.error('EmailJS Error:', error);
                showFormMessage('Failed to send message. Please try again or email me directly.', 'error');
            } finally {
                // Reset button
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Send Message';
            }
        });
    }

    // Show form message
    function showFormMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = type === 'success' ? 'form-message success' : 'form-message error';
        formMessage.style.display = 'block';

        // Hide after 5 seconds
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
});*/

