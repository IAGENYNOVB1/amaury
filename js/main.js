
const burger = document.querySelector('.burger');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-links a');
const toggle = document.querySelector('.theme-toggle');

// Vérifier que les éléments existent
if (burger && navLinks) {
  // Toggle du menu mobile
  burger.addEventListener('click', (e) => {
    e.stopPropagation();
    navLinks.classList.toggle('active');
  });

  // Fermer le menu quand on clique ailleurs
  document.addEventListener('click', (e) => {
    if (!burger.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('active');
    }
  });

  // Fermer le menu quand on clique sur un lien
  navLinksItems.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
    });
  });
}

// Marquer le lien actif basé sur la page actuelle
function setActiveLink() {
  const currentPage = window.location.pathname;
  
  navLinksItems.forEach(link => {
    link.classList.remove('active');
    
    const href = link.getAttribute('href');
    
    // Vérifier si c'est la page actuelle
    if (currentPage.includes(href) || 
        (currentPage.endsWith('/') && href === 'index.html') ||
        (currentPage.endsWith('index.html') && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// Appeler la fonction au chargement
window.addEventListener('DOMContentLoaded', () => {
  setActiveLink();
  
  // Charger le thème sauvegardé
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
  }
});

// Gérer le thème sombre
if (toggle) {
  toggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
  });
}

// Gestion du formulaire de contact
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  // Vérifier que EmailJS est chargé
  if (typeof emailjs === 'undefined') {
    console.error('EmailJS n\'est pas chargé. Vérifiez que le script EmailJS est bien inclus dans la page.');
    const formMessage = document.getElementById('formMessage');
    if (formMessage) {
      formMessage.className = 'form-message error';
      formMessage.textContent = '⚠️ Le service d\'envoi d\'email n\'est pas disponible. Contactez-moi directement par email.';
    }
  } else {
    // Initialiser EmailJS
    emailjs.init('IoGmO9_7-datRxN4T');
    console.log('EmailJS initialisé avec succès');
  }
  
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = contactForm.querySelector('.submit-btn');
    const formMessage = document.getElementById('formMessage');
    
    // Vérifier que EmailJS est disponible
    if (typeof emailjs === 'undefined') {
      formMessage.className = 'form-message error';
      formMessage.textContent = '⚠️ Le service d\'envoi d\'email n\'est pas disponible. Contactez-moi directement par email.';
      return;
    }
    
    // Récupérer les données du formulaire
    const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      subject: document.getElementById('subject').value,
      message: document.getElementById('message').value
    };
    
    // Désactiver le bouton pendant l'envoi
    submitBtn.disabled = true;
    submitBtn.textContent = 'Envoi en cours...';
    formMessage.className = 'form-message';
    
    try {
      console.log('Tentative d\'envoi avec EmailJS...');
      console.log('Service ID:', 'service_l5lwzun');
      console.log('Template ID:', 'template_km87f5t');
      console.log('Données:', formData);
      
      // Envoyer l'email via EmailJS
      const response = await emailjs.send('service_l5lwzun', 'template_km87f5t', {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        reply_to: formData.email
      });
      
      console.log('Réponse EmailJS:', response);
      
      // Succès
      formMessage.className = 'form-message success';
      formMessage.textContent = '✅ Message envoyé avec succès! Je vous répondrai rapidement.';
      
      // Réinitialiser le formulaire
      contactForm.reset();
      
      // Réinitialiser le bouton après 2 secondes
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Envoyer';
      }, 2000);
    } catch (error) {
      console.error('Erreur complète:', error);
      console.error('Message d\'erreur:', error.text || error.message);
      
      // Erreur
      formMessage.className = 'form-message error';
      formMessage.textContent = `❌ Erreur lors de l'envoi: ${error.text || error.message || 'Erreur inconnue'}. Vérifiez la console.`;
      
      // Réinitialiser le bouton
      submitBtn.disabled = false;
      submitBtn.textContent = 'Envoyer';
    }
  });
}

// Gestion du carrousel de projets avec filtrage
const carousel = document.querySelector('.carousel-track');
const allSlides = document.querySelectorAll('.carousel-slide');
const prevBtn = document.querySelector('.carousel-btn-prev');
const nextBtn = document.querySelector('.carousel-btn-next');
const dotsContainer = document.querySelector('.carousel-dots');
const filterButtons = document.querySelectorAll('.filter-btn');

if (carousel && allSlides.length > 0) {
  let currentIndex = 0;
  let visibleSlides = Array.from(allSlides);
  let currentFilter = 'all';

  // Fonction pour filtrer les projets
  function filterProjects(category) {
    currentFilter = category;
    currentIndex = 0;

    // Réinitialiser toutes les slides
    allSlides.forEach(slide => {
      slide.style.display = 'none';
    });

    if (category === 'all') {
      visibleSlides = Array.from(allSlides);
      allSlides.forEach(slide => {
        slide.style.display = 'block';
      });
    } else {
      visibleSlides = Array.from(allSlides).filter(slide => slide.dataset.category === category);
      visibleSlides.forEach(slide => {
        slide.style.display = 'block';
      });
    }

    // Mettre à jour les boutons de filtre
    filterButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === category);
    });

    // Repositionner le carrousel
    carousel.style.transform = 'translateX(0)';
    
    // Recréer les points de navigation
    updateDots();
    updateCarousel();
  }

  // Créer les points de navigation
  function updateDots() {
    dotsContainer.innerHTML = '';
    visibleSlides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.classList.add('carousel-dot');
      if (index === currentIndex) dot.classList.add('active');
      dot.setAttribute('aria-label', `Aller au projet ${index + 1}`);
      dot.addEventListener('click', () => goToSlide(index));
      dotsContainer.appendChild(dot);
    });
  }

  // Initialiser le carrousel
  updateDots();
  
  function updateCarousel() {
    if (visibleSlides.length === 0) return;

    // Calculer la largeur d'une slide
    const slideWidth = carousel.offsetWidth;
    
    // Repositionner selon les slides visibles seulement
    carousel.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    
    // Mettre à jour les points actifs
    const dots = document.querySelectorAll('.carousel-dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  }
  
  function goToSlide(index) {
    if (index >= 0 && index < visibleSlides.length) {
      currentIndex = index;
      updateCarousel();
    }
  }
  
  function nextSlide() {
    if (visibleSlides.length === 0) return;
    currentIndex = (currentIndex + 1) % visibleSlides.length;
    updateCarousel();
  }
  
  function prevSlide() {
    if (visibleSlides.length === 0) return;
    currentIndex = (currentIndex - 1 + visibleSlides.length) % visibleSlides.length;
    updateCarousel();
  }
  
  // Event listeners pour le filtrage
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterProjects(btn.dataset.filter);
    });
  });

  // Event listeners pour la navigation
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);
  
  // Navigation au clavier
  document.addEventListener('keydown', (e) => {
    if (carousel && carousel.closest('section').offsetParent !== null) {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    }
  });
  
  // Mise à jour lors du redimensionnement
  window.addEventListener('resize', updateCarousel);
  
  // Support du swipe sur mobile
  let touchStartX = 0;
  let touchEndX = 0;
  
  carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });
  
  carousel.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });
  
  function handleSwipe() {
    const swipeThreshold = 50;
    if (touchStartX - touchEndX > swipeThreshold) {
      nextSlide();
    }
    if (touchEndX - touchStartX > swipeThreshold) {
      prevSlide();
    }
  }
}
