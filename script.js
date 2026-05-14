document.addEventListener("DOMContentLoaded", () => {
    initializeEmail();
    initializeBinaryRows();
    initializeSignalCanvas();
    initializeCursor();
    initializeMenu();
    initializeSmoothAnchors();
    initializeProjectPreview();
    initializeMotion();
    initializeContactForm();
    fetchGitHubRepos();
});

function initializeEmail() {
    if (typeof emailjs !== "undefined") {
        emailjs.init("5XhzQ2uxmMYO1HHL_");
    }
}

function initializeBinaryRows() {
    const rows = document.querySelectorAll(".binary-row");
    const pattern = Array.from({ length: 180 }, (_, index) => ((index * 7 + index) % 5 > 1 ? "1" : "0")).join(" ");
    rows.forEach((row) => {
        row.textContent = `${pattern} ${pattern}`;
    });
}

function initializeSignalCanvas() {
    const canvas = document.getElementById("signal-canvas");
    if (!canvas) return;

    const context = canvas.getContext("2d");
    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const dots = [];
    let width = 0;
    let height = 0;
    let animationFrame = null;

    const resize = () => {
        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width * ratio;
        canvas.height = height * ratio;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        context.setTransform(ratio, 0, 0, ratio, 0, 0);

        dots.length = 0;
        const count = Math.min(120, Math.floor((width * height) / 16000));
        for (let index = 0; index < count; index += 1) {
            dots.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.26,
                vy: (Math.random() - 0.5) * 0.26,
                r: Math.random() * 1.7 + 0.45
            });
        }
    };

    const draw = () => {
        context.clearRect(0, 0, width, height);
        context.fillStyle = "rgba(215, 255, 63, 0.55)";
        context.strokeStyle = "rgba(46, 242, 255, 0.12)";
        context.lineWidth = 1;

        dots.forEach((dot, index) => {
            const dx = pointer.x - dot.x;
            const dy = pointer.y - dot.y;
            const distance = Math.hypot(dx, dy);
            const force = Math.max(0, 1 - distance / 260);

            dot.x += dot.vx - dx * force * 0.003;
            dot.y += dot.vy - dy * force * 0.003;

            if (dot.x < -20) dot.x = width + 20;
            if (dot.x > width + 20) dot.x = -20;
            if (dot.y < -20) dot.y = height + 20;
            if (dot.y > height + 20) dot.y = -20;

            context.globalAlpha = 0.24 + force * 0.55;
            context.beginPath();
            context.arc(dot.x, dot.y, dot.r + force * 1.8, 0, Math.PI * 2);
            context.fill();

            for (let nextIndex = index + 1; nextIndex < dots.length; nextIndex += 1) {
                const next = dots[nextIndex];
                const gap = Math.hypot(dot.x - next.x, dot.y - next.y);
                if (gap < 92) {
                    context.globalAlpha = (1 - gap / 92) * 0.18;
                    context.beginPath();
                    context.moveTo(dot.x, dot.y);
                    context.lineTo(next.x, next.y);
                    context.stroke();
                }
            }
        });

        context.globalAlpha = 0.12;
        context.fillStyle = "#e7e1d4";
        context.font = "10px IBM Plex Mono, monospace";
        for (let y = 24; y < height; y += 64) {
            const value = Math.round((pointer.x + y) % 255).toString(2).padStart(8, "0");
            context.fillText(value, 18, y);
        }

        animationFrame = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", (event) => {
        pointer.x = event.clientX;
        pointer.y = event.clientY;
    }, { passive: true });

    resize();
    draw();

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            cancelAnimationFrame(animationFrame);
        } else {
            draw();
        }
    });
}

function initializeCursor() {
    const cursor = document.querySelector(".cursor");
    const follower = document.querySelector(".cursor-follower");
    if (!cursor || !follower || window.matchMedia("(hover: none), (pointer: coarse)").matches) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let followerX = mouseX;
    let followerY = mouseY;

    window.addEventListener("pointermove", (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
        cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    }, { passive: true });

    const animate = () => {
        followerX += (mouseX - followerX) * 0.16;
        followerY += (mouseY - followerY) * 0.16;
        follower.style.transform = `translate(${followerX}px, ${followerY}px) translate(-50%, -50%)`;
        requestAnimationFrame(animate);
    };
    animate();

    bindCursorStates();
    bindMagneticElements();
}

function initializeMenu() {
    const button = document.querySelector(".menu-toggle");
    const overlay = document.querySelector(".menu-overlay");
    if (!button || !overlay) return;

    const closeMenu = () => {
        document.body.classList.remove("menu-open");
        button.classList.remove("is-open");
        overlay.classList.remove("is-open");
        button.setAttribute("aria-expanded", "false");
        button.querySelector("span").textContent = "MENU";
    };

    button.addEventListener("click", () => {
        const isOpen = overlay.classList.toggle("is-open");
        document.body.classList.toggle("menu-open", isOpen);
        button.classList.toggle("is-open", isOpen);
        button.setAttribute("aria-expanded", String(isOpen));
        button.querySelector("span").textContent = isOpen ? "CLOSE" : "MENU";
    });

    overlay.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeMenu();
    });
}

function initializeSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", (event) => {
            const target = document.querySelector(anchor.getAttribute("href"));
            if (!target) return;
            event.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });
}

function initializeProjectPreview() {
    const preview = document.querySelector(".project-preview");
    const image = preview?.querySelector("img");
    const rows = document.querySelectorAll(".project-row");
    if (!preview || !image || !rows.length) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let targetX = x;
    let targetY = y;

    window.addEventListener("pointermove", (event) => {
        targetX = event.clientX;
        targetY = event.clientY;
    }, { passive: true });

    const animate = () => {
        x += (targetX - x) * 0.14;
        y += (targetY - y) * 0.14;
        preview.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) rotate(-2deg)`;
        requestAnimationFrame(animate);
    };
    animate();

    rows.forEach((row) => {
        row.addEventListener("mouseenter", () => {
            image.src = row.dataset.image;
            preview.classList.add("is-visible");
        });
        row.addEventListener("mouseleave", () => {
            preview.classList.remove("is-visible");
        });
    });
}

function initializeMotion() {
    if (typeof gsap === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    gsap.from(".hero-title span", {
        yPercent: 110,
        rotate: 2,
        duration: 1.35,
        ease: "expo.out",
        stagger: 0.12
    });

    gsap.from(".hero-kicker span, .hero-lower p, .hero-cta", {
        y: 34,
        opacity: 0,
        duration: 1,
        ease: "expo.out",
        stagger: 0.08,
        delay: 0.25
    });

    gsap.to(".binary-top", {
        xPercent: -18,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });

    gsap.to(".binary-bottom", {
        xPercent: 18,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });

    gsap.utils.toArray(".section-heading h2, .philosophy-copy h2, .stack-grid article, .repo-card").forEach((item) => {
        gsap.from(item, {
            y: 70,
            opacity: 0,
            duration: 1,
            ease: "expo.out",
            scrollTrigger: {
                trigger: item,
                start: "top 84%"
            }
        });
    });

    gsap.to(".stack-marquee", {
        xPercent: -35,
        ease: "none",
        scrollTrigger: {
            trigger: ".stack-section",
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });

    gsap.fromTo(".contact-word", {
        scale: 0.86,
        letterSpacing: "0em"
    }, {
        scale: 1,
        letterSpacing: "0.015em",
        ease: "none",
        scrollTrigger: {
            trigger: ".contact-section",
            start: "top 75%",
            end: "bottom bottom",
            scrub: true
        }
    });
}

function initializeContactForm() {
    const contactForm = document.getElementById("contact-form");
    if (!contactForm) return;

    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        if (typeof emailjs === "undefined") {
            showMessage(contactForm, "Email service is unavailable. Email me directly at bentakaki7@gmail.com.", "error");
            return;
        }

        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = "SENDING";

        emailjs.sendForm("service_0uetwny", "template_r6nz0s3", contactForm)
            .then(() => {
                showMessage(contactForm, "Message sent. Thank you.", "success");
                contactForm.reset();
            })
            .catch((error) => {
                console.error("EmailJS error:", error);
                showMessage(contactForm, "Message failed. Email me directly at bentakaki7@gmail.com.", "error");
            })
            .finally(() => {
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            });
    });
}

function showMessage(form, text, type) {
    form.querySelector(".success-message, .error-message")?.remove();

    const message = document.createElement("div");
    message.className = type === "success" ? "success-message" : "error-message";
    message.textContent = text;
    form.appendChild(message);

    window.setTimeout(() => {
        message.style.opacity = "0";
        message.style.transform = "translateY(-8px)";
        window.setTimeout(() => message.remove(), 400);
    }, 5000);
}

async function fetchGitHubRepos() {
    const reposContainer = document.getElementById("github-repos");
    if (!reposContainer) return;

    try {
        const response = await fetch("https://api.github.com/users/BenjaminLTakaki/repos?sort=updated&per_page=100");
        if (!response.ok) throw new Error(`GitHub API request failed: ${response.status}`);

        const repos = (await response.json())
            .filter((repo) => {
                const repoName = repo.name.toLowerCase();
                return !repo.fork &&
                    repoName !== "portfoliowebsite" &&
                    repoName !== "benjamintakaki.github.io" &&
                    !repoName.includes("portfolio-website") &&
                    !repoName.includes("portfolio_website");
            })
            .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
            .slice(0, 10);

        reposContainer.innerHTML = "";

        if (!repos.length) {
            reposContainer.innerHTML = '<p class="no-repos">No GitHub projects to display.</p>';
            return;
        }

        repos.forEach((repo) => reposContainer.appendChild(createRepoCard(repo)));
        bindCursorStates(reposContainer);
        bindMagneticElements(reposContainer);
        animateRepoCards();
    } catch (error) {
        console.error("Error fetching GitHub repos:", error);
        reposContainer.innerHTML = '<div class="error-message">Could not load GitHub projects right now.</div>';
    }
}

function createRepoCard(repo) {
    const card = document.createElement("article");
    card.className = "repo-card";

    const description = truncateText(repo.description || `A ${repo.language || "software"} project by Benjamin Takaki.`, 130);
    const language = repo.language || "Multi-language";

    card.innerHTML = `
        <h4 title="${escapeHtml(formatRepoName(repo.name))}">${escapeHtml(formatRepoName(repo.name))}</h4>
        <p title="${escapeHtml(description)}">${escapeHtml(description)}</p>
        <div class="repo-meta">${escapeHtml(language)} / UPDATED ${escapeHtml(formatDate(repo.updated_at))}</div>
        <div class="repo-links">
            <a class="magnetic" href="${repo.html_url}" target="_blank" rel="noreferrer" data-cursor="link">VIEW SOURCE</a>
        </div>
    `;

    return card;
}

function bindMagneticElements(scope = document) {
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;

    scope.querySelectorAll(".magnetic:not([data-magnetic-bound])").forEach((element) => {
        element.dataset.magneticBound = "true";
        element.addEventListener("pointermove", (event) => {
            const rect = element.getBoundingClientRect();
            const x = event.clientX - rect.left - rect.width / 2;
            const y = event.clientY - rect.top - rect.height / 2;
            element.style.transform = `translate(${x * 0.13}px, ${y * 0.13}px)`;
        });
        element.addEventListener("pointerleave", () => {
            element.style.transform = "";
        });
    });
}

function bindCursorStates(scope = document) {
    const follower = document.querySelector(".cursor-follower");
    if (!follower || window.matchMedia("(hover: none), (pointer: coarse)").matches) return;

    scope.querySelectorAll("[data-cursor]:not([data-cursor-bound])").forEach((element) => {
        element.dataset.cursorBound = "true";
        element.addEventListener("mouseenter", () => {
            follower.classList.toggle("is-project", element.dataset.cursor === "project");
            follower.classList.toggle("is-link", element.dataset.cursor !== "project");
        });
        element.addEventListener("mouseleave", () => {
            follower.classList.remove("is-link", "is-project");
        });
    });
}

function animateRepoCards() {
    if (typeof gsap === "undefined") return;

    gsap.utils.toArray(".repo-card").forEach((item) => {
        gsap.from(item, {
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: "expo.out",
            scrollTrigger: {
                trigger: item,
                start: "top 88%"
            }
        });
    });
}

function truncateText(text, maxLength) {
    return text.length > maxLength ? `${text.slice(0, maxLength - 3)}...` : text;
}

function formatRepoName(name) {
    return name
        .split(/[-_\s]/)
        .filter(Boolean)
        .map((word) => {
            const lower = word.toLowerCase();
            const known = { api: "API", ui: "UI", ux: "UX", ai: "AI", ml: "ML", css: "CSS", html: "HTML", js: "JS" };
            return known[lower] || `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`;
        })
        .join(" ");
}

function formatDate(value) {
    return new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(new Date(value)).toUpperCase();
}

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);
}

function showLoading() {
    const loadingOverlay = document.createElement("div");
    loadingOverlay.className = "loading-overlay";
    loadingOverlay.innerHTML = `
        <div class="loading-card">
            <div class="loading-spinner"></div>
            <p>Opening project...</p>
            <small>This may take a moment.</small>
        </div>
    `;

    document.body.appendChild(loadingOverlay);
    requestAnimationFrame(() => {
        loadingOverlay.style.opacity = "1";
    });

    window.setTimeout(() => {
        loadingOverlay.style.opacity = "0";
        window.setTimeout(() => loadingOverlay.remove(), 450);
    }, 5000);
}
