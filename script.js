import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCu-1j7-T-tZ66Mb9WiJ-f8u1HUVzivp_0",
  authDomain: "zenlabz.firebaseapp.com",
  projectId: "zenlabz",
  storageBucket: "zenlabz.firebasestorage.app",
  messagingSenderId: "984040589502",
  appId: "1:984040589502:web:adcc1329bc4d8d7b6576ef",
  measurementId: "G-38JX8ZJBSZ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
const stickyCta = document.getElementById('stickyCta');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
    stickyCta.classList.add('show');
  } else {
    navbar.classList.remove('scrolled');
    stickyCta.classList.remove('show');
  }
});

// ===== HAMBURGER =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('active');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
  });
});

// ===== SCROLL REVEAL =====
const reveals = document.querySelectorAll('.reveal');

// Pre-calculate stagger delays for words
document.querySelectorAll('.stagger-text').forEach(stagger => {
  const words = stagger.querySelectorAll('.word');
  words.forEach((word, index) => {
    word.style.transitionDelay = `${index * 80}ms`;
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, parseInt(delay));
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

reveals.forEach(el => revealObserver.observe(el));

// ===== COUNTER ANIMATION =====
function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      el.textContent = target;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start);
    }
  }, 16);
}

const statNums = document.querySelectorAll('.stat-num');
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = parseInt(entry.target.dataset.target);
      animateCounter(entry.target, target);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

statNums.forEach(el => statsObserver.observe(el));

// ===== CONTACT FORM & EMAILJS & FIREBASE =====
if (typeof emailjs !== 'undefined') {
  emailjs.init("i1lykHmNMo3SahyMV");
}

const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', handleSubmit);
}

async function handleSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  const btn = document.getElementById('submitBtn');
  const success = document.getElementById('formSuccess');
  
  // Custom Frontend Validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  
  const email = form.email.value;
  const mobile = form.mobile.value;
  
  if (!emailRegex.test(email)) {
    alert("Please enter a valid email address.");
    form.email.focus();
    return;
  }
  
  if (!phoneRegex.test(mobile)) {
    alert("Please enter a valid mobile number.");
    form.mobile.focus();
    return;
  }

  // Visual loading state
  btn.innerHTML = 'Sending... <span class="btn-arrow">→</span>';
  btn.classList.add('sending');
  btn.disabled = true;

  try {
    // 1. Send via EmailJS
    if (typeof emailjs !== 'undefined') {
      await emailjs.send(
        "zenlabz.contact",
        "template_v2dlgmp",
        {
          first_name: form.fname.value,
          last_name: form.lname.value,
          email: form.email.value,
          phone: form.mobile.value,
          service: form.service.value,
          message: form.message.value,
        },
        "i1lykHmNMo3SahyMV"
      );
    } else {
      console.warn("EmailJS not loaded. Only saving to Firebase.");
    }

    // 2. Save to Firebase
    await addDoc(collection(db, "leads"), {
      firstName: form.fname.value,
      lastName: form.lname.value,
      email: form.email.value,
      phone: form.mobile.value,
      service: form.service.value,
      message: form.message.value,
      createdAt: new Date(),
    });

    btn.innerHTML = 'Message sent successfully 🚀';
    btn.classList.remove('sending');
    success.innerHTML = 'Message sent successfully We\'ll be in touch within 24 hours.';
    success.style.display = 'block';
    form.reset();
    
    setTimeout(() => {
      btn.innerHTML = 'Send Message <span class="btn-arrow">→</span>';
      btn.disabled = false;
      success.style.display = 'none';
    }, 5000);
    
  } catch (error) {
    console.error('Submission Error:', error);
    alert('Failed to submit message. Please try again later.');
    btn.innerHTML = 'Send Message <span class="btn-arrow">→</span>';
    btn.classList.remove('sending');
    btn.disabled = false;
  }
}

// ===== SMOOTH ACTIVE NAV =====
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(a => {
        a.style.color = '';
        if (a.getAttribute('href') === '#' + entry.target.id) {
          a.style.color = 'var(--gold)';
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// ===== MAGNETIC BUTTONS =====
const magneticBtns = document.querySelectorAll('.magnetic-btn');

magneticBtns.forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Move the button itself
    btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;

    // Move the text inside a bit more for parallax
    const text = btn.querySelector('.magnetic-text');
    if (text) {
      text.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    }
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translate(0px, 0px)';
    const text = btn.querySelector('.magnetic-text');
    if (text) {
      text.style.transform = 'translate(0px, 0px)';
    }
  });
});

// ===== 3D HERO MOCKUP TILT =====
const heroSection = document.querySelector('.hero');
const mockupContainer = document.getElementById('mockupContainer');
const mockupCard = document.getElementById('mockupCard');
const floatingElements = document.querySelectorAll('.floating-element');

if (heroSection && mockupContainer && mockupCard) {
  let isHovering = false;
  let mouseX = 0;
  let mouseY = 0;
  let currentX = 0;
  let currentY = 0;

  // Parallax configuration
  const maxTilt = 15; // Max tilt in degrees

  heroSection.addEventListener('mousemove', (e) => {
    isHovering = true;
    const rect = heroSection.getBoundingClientRect();

    // Calculate normalized mouse position from -1 to 1 relative to hero center
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    mouseX = x * 2;
    mouseY = y * 2;
  });

  heroSection.addEventListener('mouseleave', () => {
    isHovering = false;
    mouseX = 0;
    mouseY = 0;
  });

  // Smooth animation loop using lerp
  function lerp(start, end, factor) {
    return start + (end - start) * factor;
  }

  function update3D() {
    currentX = lerp(currentX, mouseX, 0.05);
    currentY = lerp(currentY, mouseY, 0.05);

    // Calculate rotations
    const rotateY = currentX * maxTilt;
    const rotateX = -currentY * maxTilt;

    // Apply transforms
    mockupCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

    // Apply parallax to floating elements
    floatingElements.forEach(el => {
      const depth = el.dataset.depth || 20;
      const translateX = currentX * depth * -1;
      const translateY = currentY * depth * -1;
      el.style.transform = `translate3d(${translateX}px, ${translateY}px, ${depth}px)`;
    });

    // Parallax background blobs (moving in opposite direction)
    const blobs = document.querySelectorAll('.hero-bg .blob');
    blobs.forEach((blob, index) => {
      const factor = (index + 1) * 15;
      blob.style.transform = `translate(${currentX * -factor}px, ${currentY * -factor}px)`;
    });

    requestAnimationFrame(update3D);
  }

  // Start the animation loop
  update3D();
}

// ===== UNIVERSAL TILT CARDS =====
const tiltCards = document.querySelectorAll('.tilt-card');

tiltCards.forEach(card => {
  // Add glare element dynamically if it doesn't exist
  if (!card.querySelector('.tilt-glare-wrap')) {
    const glareWrap = document.createElement('div');
    glareWrap.className = 'tilt-glare-wrap';
    const glare = document.createElement('div');
    glare.className = 'tilt-glare';
    glareWrap.appendChild(glare);
    card.appendChild(glareWrap);
  }

  card.addEventListener('mousemove', (e) => {
    // Only apply tilt if it's not a touch device
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate rotation (-10 to 10 degrees)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    card.style.transform = `perspective(1500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;

    // Update glare
    const glare = card.querySelector('.tilt-glare');
    if (glare) {
      const angle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI) - 90;
      glare.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
    }
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1500px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
  });
});

// ===== FAQ ACCORDION =====
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');
  const answer = item.querySelector('.faq-answer');

  question.addEventListener('click', () => {
    const isActive = item.classList.contains('active');

    // Close all other faqs
    faqItems.forEach(otherItem => {
      otherItem.classList.remove('active');
      otherItem.querySelector('.faq-answer').style.maxHeight = null;
    });

    // Open the clicked one if it wasn't already open
    if (!isActive) {
      item.classList.add('active');
      answer.style.maxHeight = answer.scrollHeight + "px";
    }
  });
});
