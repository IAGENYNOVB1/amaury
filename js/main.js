
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
  // Initialiser EmailJS
  // NOTE: Remplacer 'YOUR_PUBLIC_KEY' par votre clé publique EmailJS
  emailjs.init('IoGmO9_7-datRxN4T');
  
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = contactForm.querySelector('.submit-btn');
    const formMessage = document.getElementById('formMessage');
    
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
      // Envoyer l'email via EmailJS
      await emailjs.send('service_l5lwzun', 'template_km87f5t', {
        to_email: 'aune.amaury1@gmail.com', // À remplacer par votre email
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        reply_to: formData.email
      });
      
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
      console.error('Erreur lors de l\'envoi:', error);
      
      // Erreur
      formMessage.className = 'form-message error';
      formMessage.textContent = '❌ Erreur lors de l\'envoi du message. Veuillez réessayer ou me contacter directement.';
      
      // Réinitialiser le bouton
      submitBtn.disabled = false;
      submitBtn.textContent = 'Envoyer';
    }
  });
}
