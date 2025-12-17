
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
