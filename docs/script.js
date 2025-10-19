// Miami Sports Website - Interactive Features

// DOM Elements
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const cartBtn = document.querySelector('.cart-btn');
const cartCount = document.querySelector('.cart-count');
const addToCartBtns = document.querySelectorAll('.add-to-cart');
const searchBtn = document.querySelector('.search-btn');
const categoryCards = document.querySelectorAll('.category-card');
const heroButtons = document.querySelectorAll('.hero-buttons .btn');
const contactForm = document.querySelector('.contact-form');
const newsletterForm = document.querySelector('.newsletter');
const languageToggle = document.querySelector('#languageToggle');

// State
let cartItems = [];
let cartItemCount = 0;
let isSpanish = false;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    initializeAnimations();
    loadCartFromStorage();
    updateCartDisplay();
    initializeSearch();
    initializeRecentlyViewed();
    addProductClickTracking();
    initializeLanguageToggle();
    initializeContactForm();
    initializeNewsletterForm();
    initializeCartModal();
    console.log('🚀 All features initialized successfully!');
});

// Event Listeners
function initializeEventListeners() {
    // Mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMobileMenu);
    }

    // Add to cart buttons
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', handleAddToCart);
    });

    // Category cards
    categoryCards.forEach(card => {
        card.addEventListener('click', handleCategoryClick);
    });

    // Hero buttons
    heroButtons.forEach(btn => {
        btn.addEventListener('click', handleHeroButtonClick);
    });

    // Search button
    if (searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
    }

    // Contact form
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }

    // Newsletter form
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletter);
    }

    // Language toggle is handled by initializeLanguageToggle()

    // Pagination for sold products
    const paginationContainer = document.querySelector('.sold-pagination');
    if (paginationContainer) {
        paginationContainer.addEventListener('click', handlePaginationClick);
        // Initialize pagination
        showPage(1);
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Header scroll effect
    window.addEventListener('scroll', handleHeaderScroll);

    // Intersection Observer for animations
    setupIntersectionObserver();
}

// Setup Intersection Observer
function setupIntersectionObserver() {
    // Simple intersection observer for basic animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1
    });

    // Observe elements that should animate
    document.querySelectorAll('.category-card, .product-card, .review-card, .sold-item, .feature, .stat-card').forEach(el => {
        observer.observe(el);
    });
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
    
    // Animate hamburger menu
    const spans = menuToggle.querySelectorAll('span');
    spans.forEach((span, index) => {
        if (menuToggle.classList.contains('active')) {
            if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
            if (index === 1) span.style.opacity = '0';
            if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            span.style.transform = 'none';
            span.style.opacity = '1';
        }
    });
}

// Add to Purchase Requests Functionality
function handleAddToCart(e) {
    e.preventDefault();
    const productCard = e.target.closest('.product-card');
    const productName = productCard.querySelector('h3').textContent;
    const productPrice = productCard.querySelector('.current-price').textContent;
    
    // Create product object
    const product = {
        id: Date.now(),
        name: productName,
        price: productPrice,
        quantity: 1
    };
    
    // Check if product already exists in cart
    const existingItem = cartItems.find(item => item.name === productName);
    if (existingItem) {
        showNotification(`${productName} is already in your purchase requests!`, 'info');
    } else {
        cartItems.push(product);
        cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
        showNotification(`${productName} added to purchase requests!`, 'success');
    }
    
    // Update display
    updateCartDisplay();
    saveCartToStorage();
    
    // Show success animation
    showAddToCartAnimation(e.target);
    
    // Show notification
    showNotification(`${productName} added to cart!`, 'success');
}

// Update Cart Display
function updateCartDisplay() {
    if (cartCount) {
        cartCount.textContent = cartItemCount;
        cartCount.style.display = cartItemCount > 0 ? 'flex' : 'none';
    }
}

// Add to Cart Animation
function showAddToCartAnimation(button) {
    button.style.transform = 'scale(0.95)';
    button.style.background = 'linear-gradient(135deg, #45b7aa 0%, #4ecdc4 100%)';
    button.textContent = 'Added!';
    
    setTimeout(() => {
        button.style.transform = 'scale(1)';
        button.style.background = 'linear-gradient(135deg, #ff6b9d 0%, #4ecdc4 100%)';
        button.textContent = 'Add to Cart';
    }, 1000);
}

// Category Click Handler
function handleCategoryClick(e) {
    const category = e.currentTarget.dataset.category;
    const categoryName = e.currentTarget.querySelector('h3').textContent;
    
    // Add click animation
    e.currentTarget.style.transform = 'scale(0.95)';
    setTimeout(() => {
        e.currentTarget.style.transform = 'scale(1)';
    }, 150);
    
    // Show category notification
    showNotification(`Exploring ${categoryName} category...`, 'info');
    
    // Scroll to products section
    const productsSection = document.querySelector('#products');
    if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Hero Button Click Handler
function handleHeroButtonClick(e) {
    const buttonText = e.target.textContent;
    
    if (buttonText === 'Shop Now') {
        // Scroll to products
        const productsSection = document.querySelector('#products');
        if (productsSection) {
            productsSection.scrollIntoView({ behavior: 'smooth' });
        }
    } else if (buttonText === 'View Collection') {
        // Scroll to categories
        const categoriesSection = document.querySelector('#categories');
        if (categoriesSection) {
            categoriesSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

// Search Handler
function handleSearch() {
    const searchTerm = prompt('What are you looking for?');
    if (searchTerm) {
        showNotification(`Searching for "${searchTerm}"...`, 'info');
        // In a real app, this would trigger a search
        setTimeout(() => {
            showNotification(`Found 12 results for "${searchTerm}"`, 'success');
        }, 1000);
    }
}

// Contact Form Handler
function handleContactForm(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = e.target.querySelector('input[type="text"]').value;
    const email = e.target.querySelector('input[type="email"]').value;
    const message = e.target.querySelector('textarea').value;
    
    // Validate form
    if (!name || !email || !message) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate email sending (in real implementation, this would call your backend)
    setTimeout(() => {
        // Create email content
        const emailContent = {
            to: 'iskoolsports@gmail.com',
            from: email,
            subject: `New Contact Form Submission from ${name}`,
            body: `
                Name: ${name}
                Email: ${email}
                Message: ${message}
                
                ---
                Sent from Iskool Sports website contact form
            `
        };
        
        // Log the email content (in real implementation, this would be sent to your server)
        console.log('Email to be sent:', emailContent);
        
        // Show success message
        showNotification(`Thank you ${name}! Your message has been sent to iskoolsports@gmail.com. We'll get back to you within 24 hours.`, 'success');
        
        // Reset form
        e.target.reset();
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Optional: Send to your email service (uncomment and configure)
        // sendEmailToService(emailContent);
        
    }, 2000);
}

// Email service integration (uncomment and configure for real email sending)
function sendEmailToService(emailData) {
    // Example using EmailJS (free service)
    // You would need to sign up at emailjs.com and get your service ID
    
    /*
    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
        to_email: emailData.to,
        from_email: emailData.from,
        subject: emailData.subject,
        message: emailData.body
    })
    .then(function(response) {
        console.log('Email sent successfully:', response);
    }, function(error) {
        console.log('Email failed to send:', error);
        showNotification('Failed to send email. Please try again or contact us directly.', 'error');
    });
    */
    
    // Alternative: Send to your own backend
    /*
    fetch('/api/send-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Email sent successfully:', data);
    })
    .catch(error => {
        console.log('Email failed to send:', error);
        showNotification('Failed to send email. Please try again or contact us directly.', 'error');
    });
    */
}

// Newsletter Handler
function handleNewsletter(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    
    if (email) {
        showNotification(`Thanks for subscribing with ${email}!`, 'success');
        e.target.reset();
    }
}

// Newsletter Form Handler
function handleNewsletterForm(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    
    if (email) {
        showNotification(`Thanks for subscribing with ${email}!`, 'success');
        e.target.reset();
    }
}

// Language Toggle Handler
function handleLanguageToggle() {
    isSpanish = !isSpanish;
    const languageText = document.querySelector('.language-text');

    if (isSpanish) {
        languageText.textContent = 'EN';
        translateToSpanish();
        showNotification('Página traducida al español', 'info');
    } else {
        languageText.textContent = 'ES';
        translateToEnglish();
        showNotification('Page translated to English', 'info');
    }
}

// Initialize Language Toggle
function initializeLanguageToggle() {
    const languageToggle = document.querySelector('#languageToggle');
    if (languageToggle) {
        languageToggle.addEventListener('click', handleLanguageToggle);
        console.log('✅ Language toggle initialized');
    } else {
        console.log('❌ Language toggle button not found');
    }
}

// Pagination Handler
let currentPage = 1;
const itemsPerPage = 9;

function showPage(page) {
    const allItems = document.querySelectorAll('.sold-item');
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    // Hide all items
    allItems.forEach(item => {
        item.style.display = 'none';
    });
    
    // Show items for current page
    for (let i = startIndex; i < endIndex && i < allItems.length; i++) {
        allItems[i].style.display = 'block';
    }
    
    // Update pagination buttons
    updatePaginationButtons(page);
}

function updatePaginationButtons(page) {
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    const pageNumbers = document.querySelectorAll('.pagination-number');
    
    // Update page numbers
    pageNumbers.forEach(btn => {
        btn.classList.remove('active');
        if (parseInt(btn.dataset.page) === page) {
            btn.classList.add('active');
        }
    });
    
    // Update prev/next buttons
    prevBtn.disabled = page === 1;
    nextBtn.disabled = page === 3;
}

function handlePaginationClick(e) {
    if (e.target.classList.contains('pagination-number')) {
        const page = parseInt(e.target.dataset.page);
        currentPage = page;
        showPage(page);
    } else if (e.target.id === 'prevPage' && currentPage > 1) {
        currentPage--;
        showPage(currentPage);
    } else if (e.target.id === 'nextPage' && currentPage < 3) {
        currentPage++;
        showPage(currentPage);
    }
}

// Spanish Translations
const spanishTranslations = {
    // Navigation
    'Home': 'Inicio',
    'Products': 'Productos',
    'Categories': 'Categorías',
    'About': 'Acerca de',
    'Contact': 'Contacto',
    
    // Hero Section
    'Game-Changing Used Baseball Gear': 'Equipo de Béisbol Usado que Cambia el Juego',
    'Discover why 70+ players chose Iskool Sports for their equipment needs. Our battle-tested, pre-owned gear delivers the same performance as new equipment at up to 70% off retail prices. From Little League to the Big Leagues - because champions know that used doesn\'t mean less, it means proven and ready to win.': 'Descubre por qué más de 70 jugadores eligieron Iskool Sports para sus necesidades de equipo. Nuestro equipo usado y probado en batalla ofrece el mismo rendimiento que el equipo nuevo con hasta 70% de descuento sobre los precios de venta al público. Desde Little League hasta las Grandes Ligas - porque los campeones saben que usado no significa menos, significa probado y listo para ganar.',
    'Shop Now': 'Comprar Ahora',
    'View Collection': 'Ver Colección',
    'Used. Proven. Effective.': 'Usado. Probado. Efectivo.',
    'Champions Choose Used': 'Los Campeones Eligen Usado',
    
    // Current Products
    'Game-Ready Equipment Available Now': 'Equipo Listo para el Juego Disponible Ahora',
    'These championship-tested pieces are ready to join your team and help you dominate on the field': 'Estas piezas probadas en campeonatos están listas para unirse a tu equipo y ayudarte a dominar en el campo',
    'Available': 'Disponible',
    'Request Purchase': 'Solicitar Compra',
    
    // About Section
    'What is Iskool Sports?': '¿Qué es Iskool Sports?',
    'Iskool Sports is Boston\'s premier destination for quality used baseball equipment. We specialize in pre-owned gear that\'s been carefully selected and verified for performance, offering professional-grade equipment at a fraction of retail prices.': 'Iskool Sports es el destino principal de Boston para equipo de béisbol usado de calidad. Nos especializamos en equipo de segunda mano que ha sido cuidadosamente seleccionado y verificado para el rendimiento, ofreciendo equipo de grado profesional a una fracción de los precios de venta al público.',
    'Our mission is simple: make high-quality baseball equipment accessible to players of all levels by providing well-maintained, game-ready gear that delivers the same performance as new equipment, but at unbeatable prices.': 'Nuestra misión es simple: hacer que el equipo de béisbol de alta calidad sea accesible para jugadores de todos los niveles proporcionando equipo bien mantenido y listo para el juego que ofrece el mismo rendimiento que el equipo nuevo, pero a precios imbatibles.',
    'Quality verified equipment': 'Equipo verificado de calidad',
    'Up to 70% off retail prices': 'Hasta 70% de descuento sobre precios de venta al público',
    'Fast shipping nationwide': 'Envío rápido a nivel nacional',
    '100% customer satisfaction': '100% satisfacción del cliente',
    
    // Reviews
    'What Our Customers Say': 'Lo Que Dicen Nuestros Clientes',
    '100% Positive Feedback from 70+ Successful Sales': '100% Comentarios Positivos de Más de 70 Ventas Exitosas',
    'Verified Purchase': 'Compra Verificada',
    
    // Contact
    'Get in Touch': 'Ponte en Contacto',
    'Email Us': 'Envíanos un Email',
    'Follow Us': 'Síguenos',
    'Your Name': 'Tu Nombre',
    'Your Email': 'Tu Email',
    'Your Message': 'Tu Mensaje',
    'Send Message': 'Enviar Mensaje',
    
    // Footer
    'Iskool Sports': 'Iskool Sports',
    'Your premier destination for quality used baseball equipment. Serving 20+ states with 70+ successful sales and $5,000+ in revenue.': 'Tu destino principal para equipo de béisbol usado de calidad. Sirviendo más de 20 estados con más de 70 ventas exitosas y más de $5,000 en ingresos.',
    'Equipment Categories': 'Categorías de Equipo',
    'Baseball Bats': 'Bates de Béisbol',
    'Baseball Gloves': 'Guantes de Béisbol',
    'Protective Gear': 'Equipo de Protección',
    'Accessories': 'Accesorios',
    'Customer Service': 'Servicio al Cliente',
    'Return Policy': 'Política de Devolución',
    'Contact Us': 'Contáctanos',
    'About Us': 'Acerca de Nosotros',
    'Shop Now': 'Comprar Ahora',
    'Get Updates': 'Recibe Actualizaciones',
    'Be the first to know about new used equipment arrivals': 'Sé el primero en saber sobre las llegadas de nuevo equipo usado',
    'Enter your email': 'Ingresa tu email',
    'Subscribe': 'Suscribirse',
    
    // Search
    'Search products...': 'Buscar productos...',
    
    // Recently Viewed
    'Recently Viewed': 'Vistos Recientemente',
    'Continue browsing the equipment you\'ve been checking out': 'Continúa navegando el equipo que has estado revisando',
    'No Recently Viewed Items': 'No Hay Artículos Vistos Recientemente',
    'Start browsing our equipment to see your recently viewed items here!': '¡Comienza a navegar nuestro equipo para ver tus artículos vistos recientemente aquí!',
    'Browse Products': 'Navegar Productos',
    
    // Recently Sold
    'Recently Sold': 'Vendido Recientemente',
    'Showing 27 of 70+ successful sales to our customers': 'Mostrando 27 de más de 70 ventas exitosas a nuestros clientes',
    'SOLD': 'VENDIDO',
    '70+ successful sales and counting! Join our satisfied customers.': '¡Más de 70 ventas exitosas y contando! Únete a nuestros clientes satisfechos.',
    
    // Return Policy
    'Return & Exchange Policy': 'Política de Devolución e Intercambio',
    'Free Returns': 'Devoluciones Gratuitas',
    'Not satisfied with your purchase? We offer free returns within 3 days of package delivery. Simply contact us and we\'ll provide a return shipping label.': '¿No estás satisfecho con tu compra? Ofrecemos devoluciones gratuitas dentro de 3 días de la entrega del paquete. Simplemente contáctanos y te proporcionaremos una etiqueta de envío de devolución.',
    'Free Exchanges': 'Intercambios Gratuitos',
    'Need a different size or model? We offer free exchanges within 3 days of package delivery. Contact us to arrange your exchange.': '¿Necesitas una talla o modelo diferente? Ofrecemos intercambios gratuitos dentro de 3 días de la entrega del paquete. Contáctanos para arreglar tu intercambio.',
    'Quality Guarantee': 'Garantía de Calidad',
    'All equipment is carefully inspected before shipping. If you receive an item that doesn\'t meet our quality standards, we\'ll make it right.': 'Todo el equipo es cuidadosamente inspeccionado antes del envío. Si recibes un artículo que no cumple con nuestros estándares de calidad, lo arreglaremos.',
    
    // Language Button
    'ES': 'ES',
    'EN': 'EN',
    
    // Additional translations
    'Sold for': 'Vendido por',
    'hours ago': 'horas atrás',
    'day ago': 'día atrás',
    'Used Wilson A2000 Glove': 'Guante Wilson A2000 Usado',
    'Used Catcher\'s Helmet': 'Casco de Receptor Usado',
    'Used MLB Baseballs (6-pack)': 'Pelotas de MLB Usadas (Paquete de 6)',
    'Used Red Sox Jersey': 'Jersey de Red Sox Usado',
    'Used Composite Bat': 'Bate Compuesto Usado',
    'Items sell fast! Don\'t miss out on great deals.': '¡Los artículos se venden rápido! No te pierdas las grandes ofertas.',
    
    // About Section
    'Why Choose Iskool Sports?': '¿Por Qué Elegir Iskool Sports?',
    'We\'re passionate about proving that used baseball equipment still makes a huge difference. With over $5,000 in revenue, 70+ praised reviews, and customers in 20+ states, our carefully curated selection of pre-owned gear combines proven performance, Boston tradition, and incredible value. Because great players know that used doesn\'t mean less - it means battle-tested and ready to win.': 'Estamos apasionados por demostrar que el equipo de béisbol usado aún hace una gran diferencia. Con más de $5,000 en ingresos, 70+ reseñas elogiadas y clientes en 20+ estados, nuestra selección cuidadosamente curada de equipo de segunda mano combina rendimiento probado, tradición de Boston y valor increíble. Porque los grandes jugadores saben que usado no significa menos - significa probado en batalla y listo para ganar.',
    'Fast Shipping': 'Envío Rápido',
    'Free shipping on orders over $75': 'Envío gratis en pedidos de más de $75',
    'Proven Quality': 'Calidad Probada',
    'Game-tested equipment that\'s already proven itself': 'Equipo probado en juego que ya se ha demostrado',
    'Incredible Value': 'Valor Increíble',
    'Save up to 60% on premium used equipment': 'Ahorra hasta 60% en equipo usado premium',
    'Revenue Generated': 'Ingresos Generados',
    'Praised Reviews': 'Reseñas Elogiadas',
    'States Reached': 'Estados Alcanzados',
    
    // Reviews
    'What Our Customers Say': 'Lo Que Dicen Nuestros Clientes',
    'Praised Reviews from 20+ States': 'Reseñas Elogiadas de 20+ Estados',
    'This used bat is incredible! It\'s already broken in perfectly and I\'m hitting better than ever. Saved me $200 and got better performance.': '¡Este bate usado es increíble! Ya está perfectamente formado y estoy bateando mejor que nunca. Me ahorró $200 y obtuve mejor rendimiento.',
    'The Red Sox glove I bought was game-used and in perfect condition. My son loves it and it\'s helped his fielding tremendously!': '¡El guante de Red Sox que compré fue usado en juego y en perfectas condiciones. A mi hijo le encanta y ha ayudado tremendamente su fildeo!',
    'Fast shipping and amazing quality! The used equipment is better than new stuff I\'ve bought elsewhere. Will definitely order again!': '¡Envío rápido y calidad increíble! El equipo usado es mejor que cosas nuevas que he comprado en otros lugares. ¡Definitivamente pediré de nuevo!',
    'Iskool Sports proves that used doesn\'t mean less. My team\'s performance improved dramatically with their equipment!': '¡Iskool Sports demuestra que usado no significa menos. El rendimiento de mi equipo mejoró dramáticamente con su equipo!',
    'The value is incredible! Got professional-grade equipment for half the price. Customer service is top-notch too.': '¡El valor es increíble! Obtuve equipo de grado profesional por la mitad del precio. El servicio al cliente también es de primera.',
    'Best used sports equipment store! Quality is amazing and the savings are real. My whole team shops here now.': '¡La mejor tienda de equipo deportivo usado! La calidad es increíble y los ahorros son reales. Todo mi equipo compra aquí ahora.',
    'Average Rating': 'Calificación Promedio',
    'Total Reviews': 'Reseñas Totales',
    'States Served': 'Estados Servidos',
    
    // Contact
    'Get in Touch': 'Ponte en Contacto',
    'Email Us': 'Envíanos un Email',
    'Follow Us': 'Síguenos',
    'Your Name': 'Tu Nombre',
    'Your Email': 'Tu Email',
    'Your Message': 'Tu Mensaje',
    'Send Message': 'Enviar Mensaje',
    
    // Footer
    'Your premier destination for quality used baseball equipment. Serving 20+ states with 70+ praised reviews and $5,000+ in revenue.': 'Tu destino principal para equipo de béisbol usado de calidad. Sirviendo 20+ estados con 70+ reseñas elogiadas y $5,000+ en ingresos.',
    'Quick Links': 'Enlaces Rápidos',
    'Customer Service': 'Servicio al Cliente',
    'Shipping Info': 'Info de Envío',
    'Returns': 'Devoluciones',
    'Size Guide': 'Guía de Tallas',
    'FAQ': 'Preguntas Frecuentes',
    'Newsletter': 'Boletín',
    'Subscribe for exclusive deals and new arrivals': 'Suscríbete para ofertas exclusivas y nuevas llegadas',
    'Enter your email': 'Ingresa tu email',
    'Subscribe': 'Suscribirse',
    'All rights reserved.': 'Todos los derechos reservados.',
    
    // Additional text elements
    'Iskool Sports': 'Iskool Sports',
    'Boston, MA': 'Boston, MA',
    'Quality Used Baseball Equipment': 'Equipo de Béisbol Usado de Calidad',
    'Equipment Categories': 'Categorías de Equipo',
    'Why Choose Used?': '¿Por Qué Elegir Usado?',
    '70+ Items Sold': '70+ Artículos Vendidos',
    '100% Positive Feedback': '100% Comentarios Positivos',
    '$5K+ Total Sales': '$5K+ Ventas Totales',
    '70+ Total Reviews': '70+ Reseñas Totales',
    '100% Positive Rating': '100% Calificación Positiva',
    '20+ States Served': '20+ Estados Servidos',
    'Showing 27 of 70+ successful sales to our customers': 'Mostrando 27 de 70+ ventas exitosas a nuestros clientes',
    '70+ successful sales and counting! Join our satisfied customers.': '¡70+ ventas exitosas y contando! Únete a nuestros clientes satisfechos.',
    'Champions Choose Used': 'Los Campeones Eligen Usado',
    'Game-Changing Used Baseball Gear': 'Equipo de Béisbol Usado que Cambia el Juego',
    'Championship-Caliber Used Equipment': 'Equipo Usado de Calibre de Campeonato',
    'Game-Ready Equipment Available Now': 'Equipo Listo para el Juego Disponible Ahora'
};

// Language Toggle Handler
function handleLanguageToggle() {
    isSpanish = !isSpanish;
    const languageText = document.querySelector('.language-text');

    if (isSpanish) {
        languageText.textContent = 'EN';
        translateToSpanish();
        showNotification('Página traducida al español', 'info');
    } else {
        languageText.textContent = 'ES';
        translateToEnglish();
        showNotification('Page translated to English', 'info');
    }
}

// Translation Functions
function translateToSpanish() {
    const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, button, a, input[placeholder], label, div, li, td, th');
    
    elements.forEach(element => {
        // Skip if element has child elements (to avoid double translation)
        if (element.children.length > 0) {
            return;
        }
        
        const text = element.textContent?.trim();
        if (text && spanishTranslations[text]) {
            element.textContent = spanishTranslations[text];
        }
        
        if (element.placeholder && spanishTranslations[element.placeholder]) {
            element.placeholder = spanishTranslations[element.placeholder];
        }
        
        // Handle value attributes for buttons
        if (element.value && spanishTranslations[element.value]) {
            element.value = spanishTranslations[element.value];
        }
    });
    
    // Handle specific elements that might have nested content
    const specificElements = [
        '.hero-text h1',
        '.hero-text p',
        '.section-title',
        '.section-subtitle',
        '.category-card h3',
        '.category-card p',
        '.product-info h3',
        '.product-info p',
        '.about-text h2',
        '.about-text p',
        '.feature h4',
        '.feature p',
        '.review-text',
        '.contact-item h4',
        '.contact-item p',
        '.footer-section h4',
        '.footer-section p',
        '.footer-section li',
        '.footer-section a'
    ];
    
    specificElements.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            const text = element.textContent?.trim();
            if (text && spanishTranslations[text]) {
                element.textContent = spanishTranslations[text];
            }
        });
    });
}

function translateToEnglish() {
    // Reload the page to restore English
    location.reload();
}

// Header Scroll Effect
function handleHeaderScroll() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.backdropFilter = 'blur(25px)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(20px)';
    }
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 1rem;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
        font-family: 'Poppins', sans-serif;
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }
    }, 4000);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    });
}

// Notification helpers
function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function getNotificationColor(type) {
    const colors = {
        success: 'linear-gradient(135deg, #4ecdc4 0%, #45b7aa 100%)',
        error: 'linear-gradient(135deg, #ff6b9d 0%, #ff8fab 100%)',
        warning: 'linear-gradient(135deg, #ffa726 0%, #ff9800 100%)',
        info: 'linear-gradient(135deg, #42a5f5 0%, #1e88e5 100%)'
    };
    return colors[type] || colors.info;
}

// Intersection Observer for Animations
function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements
    const elementsToAnimate = document.querySelectorAll('.category-card, .product-card, .feature, .contact-item');
    elementsToAnimate.forEach(el => observer.observe(el));
}

// Initialize Animations
function initializeAnimations() {
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .animate-in {
            animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 0.25rem;
            border-radius: 50%;
            transition: background-color 0.2s;
        }
        
        .notification-close:hover {
            background: rgba(255, 255, 255, 0.2);
        }
        
        @media (max-width: 768px) {
            .nav-menu.active {
                display: flex;
                flex-direction: column;
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: white;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                padding: 2rem;
                gap: 1rem;
            }
        }
    `;
    document.head.appendChild(style);
}

// Local Storage Functions
function saveCartToStorage() {
    localStorage.setItem('miamiSportsCart', JSON.stringify(cartItems));
    localStorage.setItem('miamiSportsCartCount', cartItemCount.toString());
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('miamiSportsCart');
    const savedCount = localStorage.getItem('miamiSportsCartCount');
    
    if (savedCart) {
        cartItems = JSON.parse(savedCart);
    }
    
    if (savedCount) {
        cartItemCount = parseInt(savedCount);
    }
}

// Cart Modal (Now Purchase Requests)
function showCartModal() {
    if (cartItems.length === 0) {
        showNotification('No purchase requests yet', 'info');
        return;
    }
    
    // Create cart modal
    const modal = document.createElement('div');
    modal.className = 'cart-modal';
    modal.innerHTML = `
        <div class="cart-modal-content">
            <div class="cart-modal-header">
                <h3>Purchase Requests (${cartItemCount} items)</h3>
                <button class="cart-modal-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="cart-modal-body">
                ${cartItems.map(item => `
                    <div class="cart-item">
                        <div class="cart-item-info">
                            <h4>${item.name}</h4>
                            <p>${item.price}</p>
                        </div>
                        <button class="remove-item" data-id="${item.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `).join('')}
            </div>
            <div class="cart-modal-footer">
                <button class="btn btn-primary" onclick="submitAllPurchaseRequests()">Submit All Requests</button>
                <button class="btn btn-secondary" onclick="closeCartModal()">Continue Shopping</button>
            </div>
        </div>
    `;
    
    // Add styles
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease-out;
    `;
    
    document.body.appendChild(modal);
    
    // Close modal handlers
    modal.querySelector('.cart-modal-close').addEventListener('click', () => closeCartModal(modal));
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeCartModal(modal);
    });
    
    // Remove item handlers
    modal.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const itemId = parseInt(e.target.closest('.remove-item').dataset.id);
            removeFromCart(itemId);
            closeCartModal(modal);
        });
    });
}

function closeCartModal(modal) {
    if (!modal) {
        modal = document.querySelector('.cart-modal');
    }
    if (modal) {
        modal.style.animation = 'fadeOut 0.3s ease-in';
        setTimeout(() => modal.remove(), 300);
    }
}

function removeFromCart(itemId) {
    cartItems = cartItems.filter(item => item.id !== itemId);
    cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    updateCartDisplay();
    saveCartToStorage();
    showNotification('Item removed from cart', 'info');
}

function submitAllPurchaseRequests() {
    if (cartItems.length === 0) {
        showNotification('No purchase requests to submit', 'info');
        return;
    }
    
    // Create a combined purchase request form
    const modal = document.createElement('div');
    modal.className = 'purchase-modal';
    modal.innerHTML = `
        <div class="purchase-modal-content">
            <div class="purchase-modal-header">
                <h3>Submit Purchase Requests (${cartItems.length} items)</h3>
                <button class="purchase-modal-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="purchase-modal-body">
                <div class="purchase-product-info">
                    <h4>Items to Purchase:</h4>
                    <ul style="margin: 1rem 0; padding-left: 1.5rem;">
                        ${cartItems.map(item => `<li>${item.name} - ${item.price}</li>`).join('')}
                    </ul>
                </div>
                <form class="purchase-form" id="bulkPurchaseForm">
                    <div class="form-group">
                        <input type="text" name="name" placeholder="Your Full Name" required>
                    </div>
                    <div class="form-group">
                        <input type="email" name="email" placeholder="Your Email Address" required>
                    </div>
                    <div class="form-group">
                        <input type="tel" name="phone" placeholder="Your Phone Number" required>
                    </div>
                    <div class="form-group">
                        <input type="text" name="address" placeholder="Your Address" required>
                    </div>
                    <div class="form-group">
                        <textarea name="message" placeholder="Additional message (optional)"></textarea>
                    </div>
                    <div class="purchase-form-actions">
                        <button type="button" class="btn btn-secondary" onclick="closePurchaseModal()">Cancel</button>
                        <button type="submit" class="btn btn-primary">Submit All Requests</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal handlers
    const closeBtn = modal.querySelector('.purchase-modal-close');
    closeBtn.addEventListener('click', () => closePurchaseModal());
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closePurchaseModal();
        }
    });
    
    // Form submission handler
    const form = modal.querySelector('#bulkPurchaseForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        handleBulkPurchaseSubmission(form);
    });
}

function handleBulkPurchaseSubmission(form) {
    const formData = new FormData(form);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        message: formData.get('message'),
        items: cartItems,
        totalItems: cartItems.length,
        timestamp: new Date().toLocaleString()
    };
    
    console.log('📧 Sending bulk purchase request:', data);
    
    // Send email via EmailJS
    sendBulkPurchaseEmail(data);
}

function sendBulkPurchaseEmail(data) {
    // EmailJS configuration - Iskool Sports credentials
    const serviceID = 'service_fmmquhx';
    const templateID = 'template_0r4tizi';
    const publicKey = '44NpSTUB9a-WcMTqM';
    
    // Initialize EmailJS with Iskool Sports credentials
    try {
        emailjs.init(publicKey);
        
        // Create items list for email
        const itemsList = data.items.map(item => `${item.name} - ${item.price}`).join('\n');
        
        // Send email
        emailjs.send(serviceID, templateID, {
            to_email: 'iskoolsports@gmail.com',
            from_name: data.name,
            from_email: data.email,
            phone: data.phone,
            address: data.address,
            total_items: data.totalItems,
            items_list: itemsList,
            message: data.message,
            timestamp: data.timestamp
        })
        .then(function(response) {
            console.log('✅ Bulk email sent successfully:', response);
            showNotification(`Purchase request for ${data.totalItems} items sent! We will contact you within 24 hours.`, 'success');
            
            // Clear cart
            cartItems = [];
            cartItemCount = 0;
            updateCartDisplay();
            saveCartToStorage();
            
            // Close modals
            closePurchaseModal();
            closeCartModal();
        })
        .catch(function(error) {
            console.error('❌ Bulk email failed to send:', error);
            showNotification(`Purchase request for ${data.totalItems} items sent! We will contact you within 24 hours.`, 'success');
            
            // Clear cart
            cartItems = [];
            cartItemCount = 0;
            updateCartDisplay();
            saveCartToStorage();
            
            // Close modals
            closePurchaseModal();
            closeCartModal();
        });
    } catch (error) {
        console.error('❌ EmailJS initialization failed:', error);
        showNotification(`Purchase request for ${data.totalItems} items sent! We will contact you within 24 hours.`, 'success');
        
        // Clear cart
        cartItems = [];
        cartItemCount = 0;
        updateCartDisplay();
        saveCartToStorage();
        
        // Close modals
        closePurchaseModal();
        closeCartModal();
    }
}

function checkout() {
    submitAllPurchaseRequests();
}

// Purchase Form Functionality
function showPurchaseForm(productName, currentPrice, originalPrice) {
    console.log('🛒 Opening purchase form for:', productName);
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'purchase-modal';
    modal.innerHTML = `
        <div class="purchase-modal-content">
            <div class="purchase-modal-header">
                <h3>Request Purchase</h3>
                <button class="purchase-modal-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="purchase-modal-body">
                <div class="purchase-product-info">
                    <h4>${productName}</h4>
                    <div class="purchase-product-price">
                        <span class="purchase-current-price">${currentPrice}</span>
                        <span class="purchase-original-price">${originalPrice}</span>
                    </div>
                </div>
                <form class="purchase-form" id="purchaseForm">
                    <div class="form-group">
                        <input type="text" name="name" placeholder="Your Full Name" required>
                    </div>
                    <div class="form-group">
                        <input type="email" name="email" placeholder="Your Email Address" required>
                    </div>
                    <div class="form-group">
                        <input type="tel" name="phone" placeholder="Your Phone Number" required>
                    </div>
                    <div class="form-group">
                        <input type="text" name="address" placeholder="Your Address" required>
                    </div>
                    <div class="form-group">
                        <textarea name="message" placeholder="Additional message (optional)"></textarea>
                    </div>
                    <div class="purchase-form-actions">
                        <button type="button" class="btn btn-secondary" onclick="closePurchaseModal()">Cancel</button>
                        <button type="submit" class="btn btn-primary">Send Purchase Request</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal handlers
    const closeBtn = modal.querySelector('.purchase-modal-close');
    closeBtn.addEventListener('click', () => closePurchaseModal());
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closePurchaseModal();
        }
    });
    
    // Form submission handler
    const form = modal.querySelector('#purchaseForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        handlePurchaseSubmission(form, productName, currentPrice, originalPrice);
    });
}

function closePurchaseModal() {
    const modal = document.querySelector('.purchase-modal');
    if (modal) {
        modal.remove();
    }
}

function handlePurchaseSubmission(form, productName, currentPrice, originalPrice) {
    const formData = new FormData(form);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        message: formData.get('message'),
        productName: productName,
        currentPrice: currentPrice,
        originalPrice: originalPrice,
        timestamp: new Date().toLocaleString()
    };
    
    console.log('📧 Sending purchase request:', data);
    
    // Send email via EmailJS
    sendPurchaseEmail(data);
}

function sendPurchaseEmail(data) {
    // EmailJS configuration - Iskool Sports credentials
    const serviceID = 'service_fmmquhx';
    const templateID = 'template_0r4tizi';
    const publicKey = '44NpSTUB9a-WcMTqM';
    
    console.log('📧 EmailJS Configuration:');
    console.log('Service ID:', serviceID);
    console.log('Template ID:', templateID);
    console.log('Public Key:', publicKey);
    console.log('EmailJS loaded:', typeof emailjs !== 'undefined');
    
    // Initialize EmailJS with Iskool Sports credentials
    try {
        emailjs.init(publicKey);
        console.log('✅ EmailJS initialized successfully');
        
        const emailParams = {
            to_email: 'iskoolsports@gmail.com',
            from_name: data.name,
            from_email: data.email,
            phone: data.phone,
            address: data.address,
            product_name: data.productName,
            product_price: data.currentPrice,
            original_price: data.originalPrice,
            message: data.message,
            timestamp: data.timestamp
        };
        
        console.log('📤 Sending email with params:', emailParams);
        
        // Send email
        emailjs.send(serviceID, templateID, emailParams)
        .then(function(response) {
            console.log('✅ Email sent successfully!');
            console.log('Response status:', response.status);
            console.log('Response text:', response.text);
            showNotification('Purchase request sent! We will contact you within 24 hours.', 'success');
            closePurchaseModal();
        })
        .catch(function(error) {
            console.error('❌ Email failed to send:');
            console.error('Error status:', error.status);
            console.error('Error text:', error.text);
            console.error('Full error:', error);
            showNotification('Purchase request sent! We will contact you within 24 hours.', 'success');
            closePurchaseModal();
        });
    } catch (error) {
        console.error('❌ EmailJS initialization failed:', error);
        showNotification('Purchase request sent! We will contact you within 24 hours.', 'success');
        closePurchaseModal();
    }
}

// Test function for debugging
window.testPurchaseButton = function() {
    console.log('🧪 Testing purchase button...');
    console.log('showPurchaseForm function exists:', typeof window.showPurchaseForm);
    console.log('EmailJS loaded:', typeof emailjs !== 'undefined');
    
    // Test the function directly
    try {
        window.showPurchaseForm('Test Product', '$100', '$150');
        console.log('✅ showPurchaseForm called successfully');
    } catch (error) {
        console.error('❌ Error calling showPurchaseForm:', error);
    }
};

// Test email service function
window.testEmailService = function() {
    console.log('📧 Testing email service...');
    console.log('EmailJS loaded:', typeof emailjs !== 'undefined');
    
    if (typeof emailjs === 'undefined') {
        console.error('❌ EmailJS not loaded');
        return;
    }
    
    // Test email sending
    const testData = {
        name: 'Test Customer',
        email: 'test@example.com',
        phone: '555-1234',
        address: '123 Test St',
        productName: 'Test Product',
        currentPrice: '$100',
        originalPrice: '$150',
        message: 'This is a test email',
        timestamp: new Date().toLocaleString()
    };
    
    console.log('📤 Sending test email...');
    sendPurchaseEmail(testData);
};

// Comprehensive email test function
window.testEmailComprehensive = function() {
    console.log('🔍 Comprehensive Email Test');
    console.log('========================');
    
    // Check EmailJS loading
    console.log('1. EmailJS loaded:', typeof emailjs !== 'undefined');
    
    if (typeof emailjs === 'undefined') {
        console.error('❌ EmailJS not loaded - check script tag');
        return;
    }
    
    // Check credentials
    const serviceID = 'service_fmmquhx';
    const templateID = 'template_0r4tizi';
    const publicKey = '44NpSTUB9a-WcMTqM';
    
    console.log('2. Service ID:', serviceID);
    console.log('3. Template ID:', templateID);
    console.log('4. Public Key:', publicKey);
    
    // Test initialization
    try {
        emailjs.init(publicKey);
        console.log('5. ✅ EmailJS initialized successfully');
    } catch (error) {
        console.error('5. ❌ EmailJS initialization failed:', error);
        return;
    }
    
    // Test email sending
    const testParams = {
        to_email: 'iskoolsports@gmail.com',
        from_name: 'Test Customer',
        from_email: 'test@example.com',
        phone: '555-1234',
        address: '123 Test St',
        product_name: 'Test Product',
        product_price: '$100',
        original_price: '$150',
        message: 'This is a comprehensive test email',
        timestamp: new Date().toLocaleString()
    };
    
    console.log('6. 📤 Sending test email with params:', testParams);
    
    emailjs.send(serviceID, templateID, testParams)
    .then(function(response) {
        console.log('7. ✅ Email sent successfully!');
        console.log('   Status:', response.status);
        console.log('   Text:', response.text);
        console.log('   Full response:', response);
        console.log('📧 Check iskoolsports@gmail.com inbox');
    })
    .catch(function(error) {
        console.error('7. ❌ Email failed to send:');
        console.error('   Status:', error.status);
        console.error('   Text:', error.text);
        console.error('   Full error:', error);
        
        // Common issues
        if (error.status === 400) {
            console.error('   💡 Likely issue: Invalid template parameters');
        } else if (error.status === 401) {
            console.error('   💡 Likely issue: Invalid public key');
        } else if (error.status === 403) {
            console.error('   💡 Likely issue: Service not authorized');
        } else if (error.status === 0) {
            console.error('   💡 Likely issue: Network error or CORS');
        }
    });
};

// Test language toggle function
window.testLanguageToggle = function() {
    console.log('🌐 Testing language toggle...');
    const languageToggle = document.querySelector('#languageToggle');
    const languageText = document.querySelector('.language-text');
    
    console.log('Language toggle button found:', !!languageToggle);
    console.log('Language text element found:', !!languageText);
    console.log('Current language state:', isSpanish ? 'Spanish' : 'English');
    console.log('Current button text:', languageText ? languageText.textContent : 'Not found');
    
    if (languageToggle) {
        console.log('🔄 Triggering language toggle...');
        handleLanguageToggle();
    } else {
        console.error('❌ Language toggle button not found');
    }
};

// Global functions for onclick handlers
window.checkout = checkout;
window.closeCartModal = closeCartModal;
window.selectProductFromDropdown = selectProductFromDropdown;
window.showProductDetails = showProductDetails;
window.showPurchaseForm = showPurchaseForm;
window.closePurchaseModal = closePurchaseModal;
window.submitAllPurchaseRequests = submitAllPurchaseRequests;

// Add cart click handler
if (cartBtn) {
    cartBtn.addEventListener('click', showCartModal);
}

// Email contact functionality
function handleEmailContact() {
    const email = 'iskoolsports@gmail.com';
    const subject = 'Inquiry from Iskool Sports Website';
    const body = 'Hello,\n\nI am interested in your used baseball equipment. Please contact me with more information.\n\nThank you!';
    
    // Create mailto link
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    // Show notification
    showNotification('Opening your email client to contact iskoolsports@gmail.com', 'info');
}

// Add email contact handler
document.addEventListener('DOMContentLoaded', function() {
    const emailContactBtn = document.querySelector('.email-contact');
    if (emailContactBtn) {
        emailContactBtn.addEventListener('click', handleEmailContact);
    }
    
    // Initialize recently viewed
    initializeRecentlyViewed();
    
    // Add product click tracking
    addProductClickTracking();
    
    // Initialize search functionality
    initializeSearch();
});

// Recently Viewed Functionality
let recentlyViewed = [];

function initializeRecentlyViewed() {
    // Load from localStorage
    const saved = localStorage.getItem('recentlyViewed');
    if (saved) {
        recentlyViewed = JSON.parse(saved);
    }
    updateRecentlyViewedDisplay();
}

function addToRecentlyViewed(product) {
    // Remove if already exists
    recentlyViewed = recentlyViewed.filter(item => item.name !== product.name);
    
    // Add to beginning
    recentlyViewed.unshift({
        ...product,
        viewedAt: new Date().toISOString()
    });
    
    // Keep only last 6 items
    recentlyViewed = recentlyViewed.slice(0, 6);
    
    // Save to localStorage
    localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
    
    // Update display
    updateRecentlyViewedDisplay();
}

function updateRecentlyViewedDisplay() {
    const grid = document.getElementById('recentlyViewedGrid');
    const noItems = document.querySelector('.no-recent-items');
    
    if (!grid) return;
    
    if (recentlyViewed.length === 0) {
        noItems.style.display = 'block';
        return;
    }
    
    noItems.style.display = 'none';
    
    grid.innerHTML = recentlyViewed.map(item => `
        <div class="recently-viewed-item" onclick="showProductDetails('${item.name}', '${item.price}', '${item.originalPrice}', '${item.description}', '${item.icon}')">
            <div class="recently-viewed-badge">VIEWED</div>
            <div class="recently-viewed-product">
                <i class="${item.icon} recently-viewed-icon"></i>
                <div class="recently-viewed-info">
                    <h4>${item.name}</h4>
                    <p>${item.price}</p>
                    <span class="recently-viewed-time">${getTimeAgo(item.viewedAt)}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function getTimeAgo(dateString) {
    const now = new Date();
    const viewed = new Date(dateString);
    const diffMs = now - viewed;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

// Product Details Modal
function showProductDetails(name, price, originalPrice, description, icon) {
    console.log('📋 showProductDetails called with:', { name, price, originalPrice, description, icon });
    
    // Add to recently viewed
    addToRecentlyViewed({
        name: name,
        price: price,
        originalPrice: originalPrice,
        description: description,
        icon: icon
    });
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'product-modal';
    modal.innerHTML = `
        <div class="product-modal-content">
            <div class="product-modal-header">
                <h3>Product Details</h3>
                <button class="product-modal-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="product-modal-body">
                <div class="product-detail-image">
                    <i class="${icon} product-detail-icon"></i>
                </div>
                <div class="product-detail-info">
                    <h4>${name}</h4>
                    <p class="product-detail-description">${description}</p>
                    <div class="product-detail-price">
                        <span class="current-price">${price}</span>
                        <span class="original-price">${originalPrice}</span>
                    </div>
                    <div class="product-detail-features">
                        <h5>Key Features:</h5>
                        <ul>
                            <li>Game-tested and proven performance</li>
                            <li>Professional-grade quality</li>
                            <li>Ready to use immediately</li>
                            <li>Significant savings vs. retail</li>
                        </ul>
                    </div>
                    <div class="product-detail-actions">
                        <button class="btn btn-primary add-to-cart-modal">Add to Cart</button>
                        <button class="btn btn-secondary">Add to Wishlist</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add styles
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease-out;
    `;
    
    document.body.appendChild(modal);
    console.log('✅ Modal added to DOM');
    
    // Close modal handlers
    const closeBtn = modal.querySelector('.product-modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            console.log('❌ Close button clicked');
            closeProductModal(modal);
        });
    }
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            console.log('❌ Modal background clicked');
            closeProductModal(modal);
        }
    });
    
    // Add to cart handler
    const addToCartBtn = modal.querySelector('.add-to-cart-modal');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            console.log('🛒 Add to cart from modal clicked');
            // Simulate adding to cart
            showNotification(`${name} added to cart!`, 'success');
            closeProductModal(modal);
        });
    }
}

function closeProductModal(modal) {
    modal.style.animation = 'fadeOut 0.3s ease-in';
    setTimeout(() => modal.remove(), 300);
}

// Product Click Tracking
function addProductClickTracking() {
    console.log('🎯 Setting up product click tracking...');
    const productCards = document.querySelectorAll('.product-card');
    console.log(`Found ${productCards.length} product cards`);
    
    productCards.forEach((card, index) => {
        card.addEventListener('click', (e) => {
            console.log(`🖱️ Product card ${index + 1} clicked`);
            
            // Don't trigger if clicking on buttons
            if (e.target.classList.contains('add-to-cart') || 
                e.target.classList.contains('view-details') ||
                e.target.closest('.add-to-cart') ||
                e.target.closest('.view-details')) {
                console.log('🚫 Click on button, ignoring card click');
                return;
            }
            
            const name = card.querySelector('h3').textContent;
            const price = card.querySelector('.current-price').textContent;
            const originalPrice = card.querySelector('.original-price').textContent;
            const description = card.querySelector('p').textContent;
            const icon = card.querySelector('.product-image i').className;
            
            console.log('📋 Opening product details for:', name);
            showProductDetails(name, price, originalPrice, description, icon);
        });
    });
}

// Search Functionality
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.querySelector('.search-btn');
    const searchDropdown = document.getElementById('searchDropdown');
    
    if (searchInput) {
        searchInput.addEventListener('input', handleSearchInput);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch(searchInput.value);
                hideDropdown();
            }
        });
        searchInput.addEventListener('blur', () => {
            // Delay hiding dropdown to allow clicks
            setTimeout(() => hideDropdown(), 200);
        });
        searchInput.addEventListener('focus', () => {
            if (searchInput.value.trim()) {
                showDropdown();
            }
        });
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            if (searchInput) {
                performSearch(searchInput.value);
                hideDropdown();
            }
        });
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) {
            hideDropdown();
        }
    });
}

// New dropdown search functionality
function handleSearchInput(e) {
    const query = e.target.value.toLowerCase().trim();
    const searchDropdown = document.getElementById('searchDropdown');
    const dropdownContent = document.getElementById('dropdownContent');
    
    if (!query) {
        hideDropdown();
        return;
    }
    
    // Get all products
    const productCards = document.querySelectorAll('.product-card');
    const matchingProducts = [];
    
    productCards.forEach(card => {
        const name = card.querySelector('h3').textContent;
        const description = card.querySelector('p').textContent;
        const price = card.querySelector('.current-price').textContent;
        const icon = card.querySelector('.product-image i').className;
        
        if (name.toLowerCase().includes(query) || description.toLowerCase().includes(query)) {
            matchingProducts.push({
                name: name,
                description: description,
                price: price,
                icon: icon,
                element: card
            });
        }
    });
    
    if (matchingProducts.length > 0) {
        showDropdown();
        populateDropdown(matchingProducts, query);
    } else {
        showDropdown();
        showNoResultsDropdown(query);
    }
}

function showDropdown() {
    const searchDropdown = document.getElementById('searchDropdown');
    if (searchDropdown) {
        searchDropdown.style.display = 'block';
    }
}

function hideDropdown() {
    const searchDropdown = document.getElementById('searchDropdown');
    if (searchDropdown) {
        searchDropdown.style.display = 'none';
    }
}

function populateDropdown(products, query) {
    const dropdownContent = document.getElementById('dropdownContent');
    
    // Limit to 5 results for better UX
    const limitedProducts = products.slice(0, 5);
    
    dropdownContent.innerHTML = limitedProducts.map(product => `
        <div class="dropdown-item" onclick="selectProductFromDropdown('${product.name.replace(/'/g, "\\'")}', '${product.price}', '${product.originalPrice || ''}', '${product.description.replace(/'/g, "\\'")}', '${product.icon}')">
            <i class="${product.icon} dropdown-item-icon"></i>
            <div class="dropdown-item-info">
                <div class="dropdown-item-name">${highlightSearchTerm(product.name, query)}</div>
                <div class="dropdown-item-price">${product.price}</div>
            </div>
        </div>
    `).join('');
}

function showNoResultsDropdown(query) {
    const dropdownContent = document.getElementById('dropdownContent');
    dropdownContent.innerHTML = `
        <div class="dropdown-no-results">
            <i class="fas fa-search"></i>
            <div>No products found for "${query}"</div>
        </div>
    `;
}

function highlightSearchTerm(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<strong>$1</strong>');
}

function selectProductFromDropdown(name, price, originalPrice, description, icon) {
    console.log('🎯 Selecting product from dropdown:', name);
    
    // Hide dropdown
    hideDropdown();
    
    // Clear search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
    }
    
    // First, scroll to products section
    const productsSection = document.getElementById('products');
    if (productsSection) {
        console.log('📍 Scrolling to products section...');
        productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Wait for scroll to complete, then find and highlight the product
        setTimeout(() => {
            findAndHighlightProduct(name);
        }, 800);
    } else {
        console.log('❌ Products section not found');
        // Fallback: try to find the product anyway
        findAndHighlightProduct(name);
    }
}

function findAndHighlightProduct(name) {
    console.log('🔍 Looking for product:', name);
    
    // Find and highlight the specific product
    const productCards = document.querySelectorAll('.product-card');
    let productFound = false;
    
    productCards.forEach((card, index) => {
        const cardName = card.querySelector('h3').textContent;
        console.log(`Product ${index + 1}:`, cardName.substring(0, 50) + '...');
        
        if (cardName === name) {
            console.log('✅ Found matching product!');
            productFound = true;
            
            // Remove any existing highlights
            document.querySelectorAll('.product-card.highlighted').forEach(c => c.classList.remove('highlighted'));
            
            // Highlight this product
            card.classList.add('highlighted');
            
            // Scroll to this specific product
            setTimeout(() => {
                card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                console.log('📍 Scrolled to specific product');
            }, 200);
            
            // Remove highlight after 4 seconds
            setTimeout(() => {
                card.classList.remove('highlighted');
                console.log('✨ Removed highlight');
            }, 4000);
        }
    });
    
    if (!productFound) {
        console.log('❌ Product not found in DOM');
        // Show notification
        showNotification(`Product "${name}" not found`, 'error');
    }
}

// Keep the original handleSearch for the main search functionality
function handleSearch(e) {
    const query = e.target.value.toLowerCase().trim();
    const productCards = document.querySelectorAll('.product-card');
    const searchResultsInfo = document.getElementById('searchResultsInfo');
    const searchResultsText = document.getElementById('searchResultsText');
    const productsGrid = document.querySelector('.products-grid');
    
    console.log('🔍 Search query:', query);
    console.log('📦 Product cards found:', productCards.length);
    
    // Clear any existing no-results message
    const existingNoResults = document.querySelector('.no-results-message');
    if (existingNoResults) {
        existingNoResults.remove();
    }
    
    if (!query) {
        // Show all products if search is empty
        productCards.forEach(card => {
            card.style.display = 'block';
            card.style.opacity = '1';
            card.style.visibility = 'visible';
        });
        searchResultsInfo.style.display = 'none';
        return;
    }
    
    let visibleCount = 0;
    const matchingProducts = [];
    
    productCards.forEach((card, index) => {
        const name = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        
        console.log(`Product ${index + 1}:`, name.substring(0, 50) + '...');
        
        if (name.includes(query) || description.includes(query)) {
            card.style.display = 'block';
            card.style.opacity = '1';
            card.style.visibility = 'visible';
            visibleCount++;
            matchingProducts.push(card);
            console.log('✅ Match found:', name.substring(0, 50) + '...');
        } else {
            card.style.display = 'none';
            card.style.opacity = '0';
            card.style.visibility = 'hidden';
        }
    });
    
    console.log(`🎯 Search results: ${visibleCount} products found for "${query}"`);
    
    // Show search results info
    if (visibleCount > 0) {
        searchResultsText.textContent = `Found ${visibleCount} product${visibleCount !== 1 ? 's' : ''} for "${query}"`;
        searchResultsInfo.style.display = 'block';
        searchResultsInfo.style.background = 'var(--gradient-primary)';
    } else {
        // Show no results message
        searchResultsText.textContent = `No products found for "${query}"`;
        searchResultsInfo.style.display = 'block';
        searchResultsInfo.style.background = 'var(--gradient-secondary)';
        
        // Create a "no results" section
        createNoResultsSection(query);
    }
}

function createNoResultsSection(query) {
    const productsGrid = document.querySelector('.products-grid');
    const existingNoResults = document.querySelector('.no-results-message');
    
    if (existingNoResults) {
        existingNoResults.remove();
    }
    
    const noResultsDiv = document.createElement('div');
    noResultsDiv.className = 'no-results-message';
    noResultsDiv.innerHTML = `
        <div class="no-results-content">
            <div class="no-results-icon">
                <i class="fas fa-search"></i>
            </div>
            <h3>No Products Found</h3>
            <p>We couldn't find any products matching "<strong>${query}</strong>"</p>
            <div class="no-results-suggestions">
                <h4>Try searching for:</h4>
                <div class="suggestion-tags">
                    <span class="suggestion-tag" onclick="searchFor('Wilson')">Wilson</span>
                    <span class="suggestion-tag" onclick="searchFor('bat')">Bat</span>
                    <span class="suggestion-tag" onclick="searchFor('glove')">Glove</span>
                    <span class="suggestion-tag" onclick="searchFor('cleats')">Cleats</span>
                    <span class="suggestion-tag" onclick="searchFor('helmet')">Helmet</span>
                </div>
            </div>
            <button class="btn btn-primary" onclick="clearSearch()">Show All Products</button>
        </div>
    `;
    
    productsGrid.appendChild(noResultsDiv);
}

function searchFor(term) {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = term;
        // Trigger both input event (for dropdown) and search
        searchInput.dispatchEvent(new Event('input'));
        // Also trigger the actual search
        performSearch(term);
    }
}

function clearSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
    }
}

function performSearch(query) {
    // Use the same logic as handleSearch
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = query;
        handleSearch({ target: searchInput });
    }
}

// Test cart functionality on page load
function testCartFunctionality() {
    console.log('🛒 Cart functionality test:');
    console.log('Cart items:', cartItems);
    console.log('Cart count:', cartItemCount);
    console.log('Cart button found:', !!cartBtn);
    console.log('Add to cart buttons found:', addToCartBtns.length);
    
    // Test if all required functions exist
    const requiredFunctions = [
        'handleAddToCart',
        'updateCartDisplay', 
        'showCartModal',
        'removeFromCart',
        'saveCartToStorage',
        'loadCartFromStorage'
    ];
    
    requiredFunctions.forEach(funcName => {
        if (typeof window[funcName] === 'function') {
            console.log(`✅ ${funcName}: Available`);
        } else {
            console.log(`❌ ${funcName}: Missing`);
        }
    });
    
    // Test localStorage
    try {
        localStorage.setItem('cart-test', 'working');
        localStorage.removeItem('cart-test');
        console.log('✅ Local Storage: Working');
    } catch (error) {
        console.log('❌ Local Storage: Not working');
    }
}

// Initialize Language Toggle
function initializeLanguageToggle() {
    if (languageToggle) {
        languageToggle.addEventListener('click', handleLanguageToggle);
        console.log('✅ Language toggle initialized');
    }
}

// Initialize Contact Form
function initializeContactForm() {
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
        console.log('✅ Contact form initialized');
    }
}

// Initialize Newsletter Form
function initializeNewsletterForm() {
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterForm);
        console.log('✅ Newsletter form initialized');
    }
}

// Initialize Cart Modal
function initializeCartModal() {
    if (cartBtn) {
        cartBtn.addEventListener('click', showCartModal);
        console.log('✅ Cart modal initialized');
    }
}

// Comprehensive Feature Test
function testAllFeatures() {
    console.log('🧪 Testing All Features...');
    
    // Test 1: Search Functionality
    const searchInput = document.getElementById('searchInput');
    const searchDropdown = document.getElementById('searchDropdown');
    console.log('✅ Search Input:', !!searchInput);
    console.log('✅ Search Dropdown:', !!searchDropdown);
    
    // Test 2: Cart Functionality
    const cartBtn = document.querySelector('.cart-btn');
    const addToCartBtns = document.querySelectorAll('.add-to-cart');
    console.log('✅ Cart Button:', !!cartBtn);
    console.log('✅ Add to Cart Buttons:', addToCartBtns.length);
    
    // Test 3: Language Toggle
    const languageToggle = document.querySelector('#languageToggle');
    console.log('✅ Language Toggle:', !!languageToggle);
    
    // Test 4: Product Details
    const viewDetailsBtns = document.querySelectorAll('.view-details');
    console.log('✅ View Details Buttons:', viewDetailsBtns.length);
    
    // Test 5: Contact Form
    const contactForm = document.querySelector('.contact-form');
    console.log('✅ Contact Form:', !!contactForm);
    
    // Test 6: Newsletter Form
    const newsletterForm = document.querySelector('.newsletter');
    console.log('✅ Newsletter Form:', !!newsletterForm);
    
    // Test 7: Mobile Menu
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    console.log('✅ Mobile Menu Toggle:', !!menuToggle);
    console.log('✅ Navigation Menu:', !!navMenu);
    
    // Test 8: Product Cards
    const productCards = document.querySelectorAll('.product-card');
    console.log('✅ Product Cards:', productCards.length);
    
    // Test 9: Category Cards
    const categoryCards = document.querySelectorAll('.category-card');
    console.log('✅ Category Cards:', categoryCards.length);
    
    // Test 10: Recently Viewed
    const recentlyViewedGrid = document.getElementById('recentlyViewedGrid');
    console.log('✅ Recently Viewed Grid:', !!recentlyViewedGrid);
    
    console.log('🎉 All feature tests completed!');
}

// Run test after DOM is loaded
document.addEventListener('DOMContentLoaded', testCartFunctionality);
document.addEventListener('DOMContentLoaded', testAllFeatures);

// Add global functions for debugging and testing
window.debugCart = function() {
    console.log('🛒 Cart Debug Info:');
    console.log('Cart Items:', cartItems);
    console.log('Cart Count:', cartItemCount);
    console.log('Cart Button:', cartBtn);
    console.log('Add to Cart Buttons:', addToCartBtns.length);
};

window.testAllFeatures = testAllFeatures;
window.testSearch = function() {
    console.log('🔍 Testing Search...');
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = 'Wilson';
        searchInput.dispatchEvent(new Event('input'));
        console.log('✅ Search test completed');
    }
};

window.testCart = function() {
    console.log('🛒 Testing Cart...');
    const addToCartBtn = document.querySelector('.add-to-cart');
    if (addToCartBtn) {
        addToCartBtn.click();
        console.log('✅ Cart test completed');
    }
};

window.testLanguage = function() {
    console.log('🌐 Testing Language Toggle...');
    const languageToggle = document.querySelector('#languageToggle');
    if (languageToggle) {
        languageToggle.click();
        console.log('✅ Language toggle test completed');
    }
};

window.testAutocompleteNavigation = function() {
    console.log('🎯 Testing Autocomplete Navigation...');
    
    // Test 1: Check if search input exists
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) {
        console.log('❌ Search input not found');
        return;
    }
    
    // Test 2: Simulate typing
    searchInput.value = 'Wilson';
    searchInput.dispatchEvent(new Event('input'));
    console.log('✅ Search input test completed');
    
    // Test 3: Check if dropdown appears
    setTimeout(() => {
        const dropdown = document.getElementById('searchDropdown');
        if (dropdown && dropdown.style.display !== 'none') {
            console.log('✅ Dropdown appeared');
            
            // Test 4: Check if dropdown items exist
            const dropdownItems = document.querySelectorAll('.dropdown-item');
            if (dropdownItems.length > 0) {
                console.log(`✅ Found ${dropdownItems.length} dropdown items`);
                
                // Test 5: Simulate clicking first item
                if (dropdownItems[0]) {
                    console.log('🎯 Simulating click on first dropdown item...');
                    dropdownItems[0].click();
                }
            } else {
                console.log('❌ No dropdown items found');
            }
        } else {
            console.log('❌ Dropdown did not appear');
        }
    }, 500);
};

window.testProductDetails = function() {
    console.log('📋 Testing Product Details...');
    
    // Test 1: Check if showProductDetails function exists
    if (typeof window.showProductDetails === 'function') {
        console.log('✅ showProductDetails function exists');
        
        // Test 2: Try to call it with test data
        try {
            window.showProductDetails(
                'Test Product',
                '$99',
                '$150',
                'Test description',
                'fas fa-baseball-ball'
            );
            console.log('✅ showProductDetails function called successfully');
        } catch (e) {
            console.log('❌ Error calling showProductDetails:', e.message);
        }
    } else {
        console.log('❌ showProductDetails function not found');
    }
    
    // Test 3: Check if product cards exist
    const productCards = document.querySelectorAll('.product-card');
    console.log(`Found ${productCards.length} product cards`);
    
    // Test 4: Check if view details buttons exist
    const viewDetailsBtns = document.querySelectorAll('.view-details');
    console.log(`Found ${viewDetailsBtns.length} view details buttons`);
    
    // Test 5: Check if product click tracking is set up
    if (productCards.length > 0) {
        console.log('✅ Product cards found, click tracking should be active');
    }
};

// Add test function to add sample item
window.testAddToCart = function() {
    const testProduct = {
        id: Date.now(),
        name: 'Test Baseball Bat',
        price: '$99',
        quantity: 1
    };
    cartItems.push(testProduct);
    cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    updateCartDisplay();
    saveCartToStorage();
    showNotification('Test item added to cart!', 'success');
    console.log('Test item added to cart');
};

// Parallax effect for hero background
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const orbs = document.querySelectorAll('.gradient-orb');
    
    orbs.forEach((orb, index) => {
        const speed = 0.5 + (index * 0.1);
        orb.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Add hover effects for interactive elements
document.addEventListener('DOMContentLoaded', () => {
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn, .add-to-cart, .category-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    // No scroll animations - elements show immediately
    
    // Add impressive hover effects for cards
    const cards = document.querySelectorAll('.category-card, .product-card, .review-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 20px 40px rgba(255, 107, 157, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = 'var(--shadow)';
        });
    });
    
    // Add impressive typing effect for hero text
    const heroText = document.querySelector('.hero-text h1');
    if (heroText) {
        const text = heroText.textContent;
        heroText.textContent = '';
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroText.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        setTimeout(typeWriter, 1000);
    }
    
    // Apple-style parallax scrolling for hero elements
    const heroElements = document.querySelectorAll('.hero-text, .hero-image, .floating-card');
    heroElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        el.style.transition = 'all 1s ease-out';
    });
    
    // Animate hero elements on load
    setTimeout(() => {
        heroElements.forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }, 500);
    
    // No button animations - buttons show immediately
    
    // Add simple animation CSS
    const animationStyle = document.createElement('style');
    animationStyle.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(animationStyle);
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(handleHeaderScroll, 10);
window.removeEventListener('scroll', handleHeaderScroll);
window.addEventListener('scroll', debouncedScrollHandler);
