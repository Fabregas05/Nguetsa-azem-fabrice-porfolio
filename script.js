'use strict';

//Opening or closing side bar

const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }

const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

sidebarBtn.addEventListener("click", function() {elementToggleFunc(sidebar); })

//Activating Modal-testimonial

const testimonialsItem = document.querySelectorAll('[data-testimonials-item]');
const modalContainer = document.querySelector('[data-modal-container]');
const modalCloseBtn = document.querySelector('[data-modal-close-btn]');
const overlay = document.querySelector('[data-overlay]');

const modalImg = document.querySelector('[data-modal-img]');
const modalTitle = document.querySelector('[data-modal-title]');
const modalText = document.querySelector('[data-modal-text]');

const testimonialsModalFunc = function () {
    modalContainer.classList.toggle('active');
    overlay.classList.toggle('active');
}

for (let i = 0; i < testimonialsItem.length; i++) {
    testimonialsItem[i].addEventListener('click', function () {
        modalImg.src = this.querySelector('[data-testimonials-avatar]').src;
        modalImg.alt = this.querySelector('[data-testimonials-avatar]').alt;
        modalTitle.innerHTML = this.querySelector('[data-testimonials-title]').innerHTML;
        modalText.innerHTML = this.querySelector('[data-testimonials-text]').innerHTML;

        testimonialsModalFunc();
    })
}

//Activating close button in modal-testimonial

modalCloseBtn.addEventListener('click', testimonialsModalFunc);
overlay.addEventListener('click', testimonialsModalFunc);

//Activating Filter Select and filtering options

const select = document.querySelector('[data-select]');
const selectItems = document.querySelectorAll('[data-select-item]');
const selectValue = document.querySelector('[data-select-value]');
const filterBtn = document.querySelectorAll('[data-filter-btn]');

select.addEventListener('click', function () {elementToggleFunc(this); });

for(let i = 0; i < selectItems.length; i++) {
    selectItems[i].addEventListener('click', function() {

        // use data-select-item value if present (keeps logic independent of visible language)
        let selectedValue = this.dataset.selectItem ? this.dataset.selectItem.toLowerCase() : this.innerText.toLowerCase();
        selectValue.innerText = this.innerText;
        elementToggleFunc(select);
        filterFunc(selectedValue);

    });
}

const filterItems = document.querySelectorAll('[data-filter-item]');

const filterFunc = function (selectedValue) {
    for(let i = 0; i < filterItems.length; i++) {
        if(selectedValue == "all") {
            filterItems[i].classList.add('active');
        } else if (selectedValue == filterItems[i].dataset.category) {
            filterItems[i].classList.add('active');
        } else {
            filterItems[i].classList.remove('active');
        }
    }
}

//Enabling filter button for larger screens 

let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {
    
    filterBtn[i].addEventListener('click', function() {

        // prefer data-filter-btn value if present
        let selectedValue = this.dataset.filterBtn ? this.dataset.filterBtn.toLowerCase() : this.innerText.toLowerCase();
        selectValue.innerText = this.innerText;
        filterFunc(selectedValue);

        lastClickedBtn.classList.remove('active');
        this.classList.add('active');
        lastClickedBtn = this;

    })
}

// Enabling Contact Form

const form = document.querySelector('[data-form]');
const formInputs = document.querySelectorAll('[data-form-input]');
const formBtn = document.querySelector('[data-form-btn]');

for(let i = 0; i < formInputs.length; i++) {
    formInputs[i].addEventListener('input', function () {
        if(form.checkValidity()) {
            formBtn.removeAttribute('disabled');
        } else { 
            formBtn.setAttribute('disabled', '');
        }
    })
}

// ==========================
// Envoi du formulaire de contact
// ==========================

// Configuration EmailJS : remplacez ces valeurs par vos identifiants EmailJS
const EMAILJS_USER = 'YOUR_EMAILJS_USER_ID';
const EMAILJS_SERVICE = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE = 'YOUR_TEMPLATE_ID';

// initialisation EmailJS si l'utilisateur a renseigné la clé
if (typeof emailjs !== 'undefined' && EMAILJS_USER !== 'YOUR_EMAILJS_USER_ID') {
    try { emailjs.init(EMAILJS_USER); } catch(e) { /* ignore */ }
}

const toast = document.getElementById('email-toast');
const toastMsg = document.getElementById('email-toast-msg');
const toastClose = document.getElementById('email-toast-close');

function showToast(message) {
    if (!toast || !toastMsg) return;
    toastMsg.innerText = message;
    toast.classList.add('show');
    toast.setAttribute('aria-hidden', 'false');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
        toast.classList.remove('show');
        toast.setAttribute('aria-hidden', 'true');
    }, 4000);
}

if (toastClose) toastClose.addEventListener('click', () => { toast.classList.remove('show'); toast.setAttribute('aria-hidden', 'true'); });

if (form) {
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const fullname = form.querySelector('[name="fullname"]').value.trim();
        const email = form.querySelector('[name="email"]').value.trim();
        const message = form.querySelector('[name="message"]').value.trim();

        if (!fullname || !email || !message) {
            showToast("Veuillez remplir tous les champs.");
            return;
        }

        // si EmailJS est configuré, envoyer via API client
        if (typeof emailjs !== 'undefined' && EMAILJS_USER !== 'YOUR_EMAILJS_USER_ID') {
            const templateParams = {
                from_name: fullname,
                from_email: email,
                message: message,
                to_email: 'fabricefabregas05@gmail.com'
            };

            emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, templateParams)
                .then(function() {
                    showToast('Message envoyé avec succès.');
                    form.reset();
                    formBtn.setAttribute('disabled', '');
                }, function(error) {
                    console.error('EmailJS error:', error);
                    showToast('Erreur : impossible d\'envoyer le message.');
                });

            return;
        }

        // fallback : ouvrir le client mail (mailto)
        const mailto = `mailto:fabricefabregas05@gmail.com?subject=${encodeURIComponent('Contact depuis site : ' + fullname)}&body=${encodeURIComponent(message + '\n\n--\n' + fullname + ' <' + email + '>')}`;
        window.location.href = mailto;
        showToast('Client mail ouvert — veuillez envoyer le message depuis votre application de messagerie.');
        form.reset();
        formBtn.setAttribute('disabled', '');
    });
}

// Enabling Page Navigation 

const navigationLinks = document.querySelectorAll('[data-nav-link]');
const pages = document.querySelectorAll('[data-page]');

for(let i = 0; i < navigationLinks.length; i++) {
    navigationLinks[i].addEventListener('click', function() {
        
        // determine target page from data-nav-link attribute when available
        let target = this.dataset.navLink ? this.dataset.navLink.toLowerCase() : this.innerHTML.toLowerCase();

        for(let i = 0; i < pages.length; i++) {
            if(target == pages[i].dataset.page) {
                pages[i].classList.add('active');
                navigationLinks[i].classList.add('active');
                window.scrollTo(0, 0);
            } else {
                pages[i].classList.remove('active');
                navigationLinks[i]. classList.remove('active');
            }
        }
    });
}

// Modal pour les réalisations (projets)
const projectItems = document.querySelectorAll('.project-item');
const projectModalContainer = document.querySelector('[data-project-modal-container]');
const projectModalCloseBtn = document.querySelector('[data-project-modal-close-btn]');
const projectOverlay = document.querySelector('[data-project-overlay]');

const projectModalImg = document.querySelector('[data-project-modal-img]');
const projectModalTitle = document.querySelector('[data-project-modal-title]');
const projectModalText = document.querySelector('[data-project-modal-text]');
const projectModalLink = document.querySelector('[data-project-modal-link]');

const projectModalFunc = function () {
    if (!projectModalContainer || !projectOverlay) return;
    projectModalContainer.classList.toggle('active');
    projectOverlay.classList.toggle('active');
}

for (let i = 0; i < projectItems.length; i++) {
    projectItems[i].addEventListener('click', function (e) {
        e.preventDefault();

        const img = this.querySelector('img');
        const title = this.querySelector('.project-title') ? this.querySelector('.project-title').innerText : '';
        const dataElem = this.querySelector('.project-data');
        const desc = dataElem ? dataElem.dataset.projectDesc : '';
        const link = dataElem ? dataElem.dataset.projectLink : '#';

        if (projectModalImg && img) {
            projectModalImg.src = img.src;
            projectModalImg.alt = img.alt || title;
        }

        if (projectModalTitle) projectModalTitle.innerText = title;
        if (projectModalText) projectModalText.innerHTML = '<p>' + desc + '</p>';
        if (projectModalLink) {
            projectModalLink.href = link || '#';
            projectModalLink.style.display = link ? 'inline-flex' : 'none';
        }

        projectModalFunc();
    });
}

if (projectModalCloseBtn) projectModalCloseBtn.addEventListener('click', projectModalFunc);
if (projectOverlay) projectOverlay.addEventListener('click', projectModalFunc);