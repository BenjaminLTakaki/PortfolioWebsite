emailjs.init("5XhzQ2uxmMYO1HHL_"); 

const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Back to Top Button Functionality
const backToTopBtn = document.querySelector('.back-to-top');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Handle Contact Form Submission
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', function(event) {
    event.preventDefault();

    emailjs.sendForm('service_0uetwny', 'template_r6nz0s3', this)
        .then(() => {
            alert('Message sent successfully!');
            contactForm.reset();
        }, (error) => {
            console.error('Error sending message:', error);
            alert('Failed to send message. Please try again.');
        });
});

// Fetch GitHub Repositories
const githubUsername = 'BenjaminLTakaki';
const apiUrl = `https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=6`;

async function fetchRepos() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const repos = await response.json();
        const repoList = document.getElementById('repos');

        repos.forEach(repo => {
            const repoItem = document.createElement('div');
            repoItem.classList.add('repo');
            repoItem.innerHTML = `
                <h3><a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">${repo.name}</a></h3>
                <p>${repo.description || 'No description available.'}</p>
            `;
            repoList.appendChild(repoItem);
        });
    } catch (error) {
        console.error('Error fetching repos:', error);
    }
}

document.addEventListener('DOMContentLoaded', fetchRepos);