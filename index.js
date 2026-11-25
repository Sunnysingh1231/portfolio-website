const typingText = document.querySelector("#text");
const prefersReducedMotion = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

document.documentElement.classList.add("js");

const revealElements = document.querySelectorAll("[data-reveal]");

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
} else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px"
    });

    revealElements.forEach((element) => revealObserver.observe(element));
}

const accessibleRole = document.querySelector("#home_role_accessible");
const roles = ["Java & Spring Boot Developer", "Backend Developer", "Full-Stack Developer"];

if (typingText && !prefersReducedMotion) {
    let roleIndex = 0;
    let characterIndex = 0;
    const typeDelay = 75;
    const deleteDuration = 120;
    const rolePause = 1500;

    function typeNextCharacter() {
        const role = roles[roleIndex];
        const character = document.createElement("span");
        character.className = "typed-character";
        character.textContent = role[characterIndex] === " " ? "\u00a0" : role[characterIndex];
        typingText.appendChild(character);
        characterIndex += 1;

        if (characterIndex === role.length) {
            if (accessibleRole) {
                accessibleRole.textContent = role;
            }
            window.setTimeout(deleteLastCharacter, rolePause);
        } else {
            window.setTimeout(typeNextCharacter, typeDelay);
        }
    }

    function deleteLastCharacter() {
        const character = typingText.lastElementChild;

        if (!character) {
            roleIndex = (roleIndex + 1) % roles.length;
            characterIndex = 0;
            window.setTimeout(typeNextCharacter, 300);
            return;
        }

        character.classList.add("is-removing");
        window.setTimeout(() => {
            character.remove();
            characterIndex -= 1;

            if (characterIndex === 0) {
                roleIndex = (roleIndex + 1) % roles.length;
                window.setTimeout(typeNextCharacter, 300);
            } else {
                deleteLastCharacter();
            }
        }, deleteDuration);
    }

    typingText.textContent = "";
    typeNextCharacter();
}

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".navbar a[href^='#']");

function updateActiveNavLink() {
    const scrollPosition = window.scrollY + 100;
    let activeSection = null;

    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            activeSection = section;
        }
    });

    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
        activeSection = sections[sections.length - 1];
    }

    navLinks.forEach((link) => {
        const isCurrent = activeSection && link.getAttribute("href") === `#${activeSection.id}`;
        link.classList.toggle("active", Boolean(isCurrent));

        if (isCurrent) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
    });
}

window.addEventListener("scroll", updateActiveNavLink, { passive: true });
updateActiveNavLink();

const readMoreButton = document.querySelector(".read_more_btn");
const aboutExtra = document.querySelector("#about_extra");

if (readMoreButton && aboutExtra) {
    readMoreButton.addEventListener("click", (event) => {
        event.preventDefault();
        const expanded = readMoreButton.getAttribute("aria-expanded") !== "true";

        aboutExtra.classList.toggle("is-open", expanded);
        aboutExtra.setAttribute("aria-hidden", String(!expanded));
        readMoreButton.setAttribute("aria-expanded", String(expanded));
        readMoreButton.textContent = expanded ? "Read Less" : "Read More";
    });
}

const menuButton = document.querySelector("#menu_icon");
const navBar = document.querySelector(".navbar");
const menuIcon = menuButton && menuButton.querySelector("i");

function setMenuOpen(isOpen) {
    if (!menuButton || !navBar) {
        return;
    }

    navBar.classList.toggle("active", isOpen);
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");

    if (menuIcon) {
        menuIcon.classList.toggle("fa-bars", !isOpen);
        menuIcon.classList.toggle("fa-xmark", isOpen);
    }
}

if (menuButton) {
    menuButton.addEventListener("click", () => {
        setMenuOpen(menuButton.getAttribute("aria-expanded") !== "true");
    });
}

navLinks.forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        setMenuOpen(false);
    }
});

const contactForm = document.querySelector("#contact_form");

if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!contactForm.reportValidity()) {
            return;
        }

        const formData = new FormData(contactForm);
        const name = String(formData.get("name") || "").trim();
        const email = String(formData.get("email") || "").trim();
        const subject = String(formData.get("subject") || "").trim();
        const message = String(formData.get("message") || "").trim();
        const body = `${message}\n\nFrom: ${name}\nEmail: ${email}`;
        const mailto = `mailto:123saktisingh@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        window.location.href = mailto;
    });
}

const currentYear = document.querySelector("#current_year");

if (currentYear) {
    currentYear.textContent = String(new Date().getFullYear());
}
