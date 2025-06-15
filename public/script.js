// Fichier JavaScript principal réorganisé

/**
 * Fonctions utilitaires
 */
// Animation d'un élément avec délai
function animateWithDelay(element, styles, delay = 0) {
    setTimeout(() => {
        Object.entries(styles).forEach(([property, value]) => {
            element.style[property] = value;
        });
    }, delay);
}

// Réinitialiser les styles d'animation
function resetAnimation(element, styles) {
    Object.entries(styles).forEach(([property, value]) => {
        element.style[property] = value;
    });
}

/**
 * Gestion du menu et du header
 */
function initNavigation() {
    const header = document.querySelector('header');
    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.menu');
    const menuLinks = document.querySelectorAll('.menu a');
    const body = document.body;
    
    let menuOpen = false;
    
    // Fonction pour ouvrir le menu
    function openMenu() {
        menuToggle.classList.add('active');
        menu.classList.add('active');
        body.style.overflow = 'hidden';
        menuOpen = true;
        
        // Animation séquentielle des liens
        menuLinks.forEach((link, index) => {
            animateWithDelay(link, { opacity: '1', transform: 'translateY(0)' }, 100 * index);
        });
    }
    
    // Fonction pour fermer le menu
    function closeMenu() {
        menuToggle.classList.remove('active');
        menu.classList.remove('active');
        body.style.overflow = '';
        menuOpen = false;
        
        menuLinks.forEach(link => {
            resetAnimation(link, { opacity: '0', transform: 'translateY(10px)' });
        });
    }
    
    // Gestion du header au scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Afficher/Masquer le bouton retour en haut
        const backToTop = document.getElementById("backToTop");
        if (backToTop) {
            if (window.scrollY > 300) {
                backToTop.classList.add("show");
            } else {
                backToTop.classList.remove("show");
            }
        }
    });
    
    // Toggle du menu
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            menuOpen ? closeMenu() : openMenu();
        });
    }
    
    // Gestion des liens du menu
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (menuOpen && window.innerWidth <= 768) {
                // Vérifie si c'est un lien externe (comme realisations.html)
                if (!this.getAttribute('href').startsWith('#')) {
                    // Ne pas empêcher la navigation pour les liens externes
                    closeMenu();
                    return;
                }
                
                e.preventDefault();
                const targetId = this.getAttribute('href');
                closeMenu();
                
                setTimeout(() => {
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        window.scrollTo({
                            top: targetElement.offsetTop - header.offsetHeight,
                            behavior: 'smooth'
                        });
                    }
                }, 300);
            }
        });
    });
    
    // Fermer le menu en cliquant en dehors
    document.addEventListener('click', function(e) {
        if (menuOpen && !menu.contains(e.target) && !menuToggle.contains(e.target)) {
            closeMenu();
        }
    });
    
    // Fermer le menu avec Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && menuOpen) {
            closeMenu();
        }
    });
    
    // Gestion du redimensionnement
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && menuOpen) {
            closeMenu();
            
            menuLinks.forEach(link => {
                resetAnimation(link, { opacity: '1', transform: 'none' });
            });
        }
    });
    
    // Initialisation des styles pour mobile
    function initMobileMenuStyles() {
        if (window.innerWidth <= 768) {
            menuLinks.forEach(link => {
                link.style.opacity = '0';
                link.style.transform = 'translateY(10px)';
                link.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            });
        }
    }
    
    initMobileMenuStyles();
    
    // Retour en haut de page
    const backToTop = document.getElementById("backToTop");
    if (backToTop) {
        backToTop.addEventListener("click", function() {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }
}

/**
 * Animations et effets visuels
 */
function initAnimations() {
    // Initialisation AOS avec des paramètres améliorés
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
            once: true,  // Modifié: animations une seule fois
            mirror: true
        });
    }
    
    // Animation des cartes de services
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.service-icon');
            if (icon) {
                icon.style.animationName = 'pulse';
                icon.style.animationDuration = '1.5s';
                icon.style.animationIterationCount = 'infinite';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.service-icon');
            if (icon) {
                icon.style.animationName = '';
            }
        });
    });
    
    // Animation des projets
    initProjectsAnimation();
    
    // Effet AOS simulé - La boucle est supprimée car elle est redondante avec AOS.init()
    // Les animations sont maintenant gérées directement par AOS avec once: true
    
    // Animation compteur avec GSAP
    initCounters();
    
    // Animation du bouton CTA
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            this.classList.add('animate');
            
            setTimeout(() => {
                this.classList.remove('animate');
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }, 1000);
        });
    }
}

/**
 * Animation des compteurs avec GSAP
 */
function initCounters() {
    const counters = document.querySelectorAll('.count');
    if (counters.length > 0 && typeof ScrollTrigger !== 'undefined' && typeof gsap !== 'undefined') {
        ScrollTrigger.create({
            trigger: '.stats',
            start: 'top 80%',
            onEnter: () => {
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-count'));
                    const duration = 2;
                    
                    gsap.to(counter, {
                        innerHTML: target,
                        duration: duration,
                        snap: { innerHTML: 1 },
                        ease: 'power2.out'
                    });
                });
            },
            once: true  // Déjà correctement configuré
        });
    }
}

/**
 * Animation et filtrage des projets
 */
function initProjectsAnimation() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    // Animation au scroll pour les cartes
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    // Variable pour stocker si les animations ont déjà été exécutées
    const animatedCards = new Set();
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                
                // Vérifier si cette carte a déjà été animée
                if (!animatedCards.has(card)) {
                    card.style.transition = 'all 0.8s cubic-bezier(0.17, 0.67, 0.83, 0.67)';
                    
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) rotateY(0)';
                    }, parseInt(card.dataset.aosDelay) || 0);
                    
                    // Marquer la carte comme animée
                    animatedCards.add(card);
                }
                
                // Ne pas désinscrire l'observateur, pour que les animations ne se répètent plus
                observer.unobserve(card);
            }
        });
    }, observerOptions);
    
    // Initialiser les cartes
    projectCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px) rotateY(10deg)';
        observer.observe(card);
        
        // Animation des badges au hover
        card.addEventListener('mouseenter', function() {
            const badge = this.querySelector('.project-badge');
            if (badge) {
                badge.style.opacity = '1';
                badge.style.transform = 'translateY(0)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const badge = this.querySelector('.project-badge');
            if (badge) {
                badge.style.opacity = '0';
                badge.style.transform = 'translateY(10px)';
            }
        });
    });
    
    // Gestion des filtres
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Activer le bouton cliqué
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filtrer les projets
            const filterValue = this.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                // Animation de sortie
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8) translateY(20px)';
                
                setTimeout(() => {
                    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'block';
                        // Animation d'entrée
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1) translateY(0)';
                        }, 50);
                    } else {
                        card.style.display = 'none';
                    }
                }, 300);
            });
        });
    });
}

/**
 * Fonctions pour la modal
 */
function openModal(imgSrc, name, role) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalInfo = document.getElementById('modalInfo');
    
    if (modal && modalImg && modalInfo) {
        modalImg.src = imgSrc;
        modalInfo.innerHTML = name + ' - ' + role;
        
        modal.style.display = 'block';
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    }
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

/**
 * Initialisation des bibliothèques
 */
function initLibraries() {
    // Initialisation Typed.js
    if (typeof Typed !== 'undefined') {
        const typedElement = document.getElementById('typed');
        if (typedElement) {
            const typed = new Typed('#typed', {
                stringsElement: '#typed-strings',
                typeSpeed: 50,
                backSpeed: 50,
                backDelay: 1500,
                startDelay: 1500,
                loop: true
            });
        }
    }
    
    // Initialisation Particles.js
    if (typeof particlesJS !== 'undefined') {
        const particlesContainer = document.getElementById('particles-js');
        if (particlesContainer) {
            particlesJS('particles-js', {
                "particles": {
                    "number": {
                        "value": 80,
                        "density": {
                            "enable": true,
                            "value_area": 800
                        }
                    },
                    "color": {
                        "value": "#ffffff"
                    },
                    "shape": {
                        "type": "circle"
                    },
                    "opacity": {
                        "value": 0.5,
                        "random": false,
                        "anim": {
                            "enable": false
                        }
                    },
                    "size": {
                        "value": 3,
                        "random": true,
                        "anim": {
                            "enable": false
                        }
                    },
                    "line_linked": {
                        "enable": true,
                        "distance": 150,
                        "color": "#ffffff",
                        "opacity": 0.4,
                        "width": 1
                    },
                    "move": {
                        "enable": true,
                        "speed": 2,
                        "direction": "none",
                        "random": false,
                        "straight": false,
                        "out_mode": "bounce", // Changed from "out" to "bounce"
                        "bounce": true,
                        "attract": {
                            "enable": false
                        }
                    }
                },
                "interactivity": {
                    "detect_on": "canvas",
                    "events": {
                        "onhover": {
                            "enable": true,
                            "mode": "grab"
                        },
                        "onclick": {
                            "enable": true,
                            "mode": "push"
                        },
                        "resize": true
                    },
                    "modes": {
                        "grab": {
                            "distance": 140,
                            "line_linked": {
                                "opacity": 1
                            }
                        },
                        "push": {
                            "particles_nb": 4
                        }
                    }
                },
                "retina_detect": true
            });
        }
    }
    
    // Initialisation Swiper
    if (typeof Swiper !== 'undefined') {
        const swiperContainer = document.querySelector('.swiper');
        if (swiperContainer) {
            const swiper = new Swiper('.swiper', {
                slidesPerView: 1,
                spaceBetween: 30,
                loop: true,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true
                },
                breakpoints: {
                    768: {
                        slidesPerView: 2
                    },
                    1024: {
                        slidesPerView: 3
                    }
                },
                autoplay: {
                    delay: 3000,
                    disableOnInteraction: false
                }
            });
        }
    }
    
    // Initialisation du diaporama d'arrière-plan hero
    initHeroSlideshow();
}

/**
 * Gestion du diaporama d'arrière-plan hero
 */
function initHeroSlideshow() {
    const slides = document.querySelectorAll('.hero-background-slideshow .slide');
    if (slides.length) {
        let currentSlide = 0;
        
        // Fonction pour passer à la diapositive suivante
        function nextSlide() {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }
        
        // Définir l'intervalle pour changer de diapositive
        setInterval(nextSlide, 5000);
    }
}

/**
 * Gestion du formulaire de contact
 */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.querySelector('.form-success');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const message = document.getElementById('message').value;
            
            try {
                const response = await fetch('/send-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email, phone, message })
                });

                if (response.ok) {
                    contactForm.reset();
                    if (formSuccess) {
                        formSuccess.classList.add('active');
                        setTimeout(() => {
                            formSuccess.classList.remove('active');
                        }, 5000);
                    }
                } else {
                    alert("Erreur lors de l'envoi du message.");
                }
            } catch (error) {
                console.error('Erreur:', error);
                alert("Une erreur est survenue.");
            }
        });
    }
}

// S'assurer que le diaporama démarre dès le chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    initLibraries();
    initContactForm();
});

/**
 * Ajout des styles nécessaires
 */
function addGlobalStyles() {
    // Animation de pulsation
    document.head.insertAdjacentHTML('beforeend', `
        <style>
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
        </style>
    `);
}

function handleExternalAnchorLinks() {
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (link && link.getAttribute('href') && link.getAttribute('href').includes('#')) {
            const [pagePath, anchor] = link.getAttribute('href').split('#');
            if (pagePath && anchor) {
                e.preventDefault();
                window.location.href = link.href;
            }
        }
    });
}

/**
 * Initialisation globale au chargement du DOM
 */
document.addEventListener('DOMContentLoaded', function() {
    // Ajouter les styles
    addGlobalStyles();
    handleExternalAnchorLinks();
    // Initialiser la navigation et le menu
    initNavigation();
    
    // Initialiser les animations
    initAnimations();
    
    // Initialiser le formulaire de contact
    initContactForm();
});

// Gestion des clics sur la modal
window.onclick = function(event) {
    const modal = document.getElementById('imageModal');
    if (modal && event.target == modal) {
        closeModal();
    }
};

