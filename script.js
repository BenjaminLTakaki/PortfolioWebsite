const githubUsername = 'BenjaminLTakaki';

const apiUrl = `https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=6`;

async function fetchRepos() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const repos = await response.json();
        displayRepos(repos);
    } catch (error) {
        console.error('Error fetching repositories:', error);
        document.getElementById('repos').innerHTML = '<p>Unable to fetch repositories at this time.</p>';
    }
}

function displayRepos(repos) {
    const reposContainer = document.getElementById('repos');
    if (repos.length === 0) {
        reposContainer.innerHTML = '<p>No repositories found.</p>';
        return;
    }

    repos.forEach(repo => {
        const repoElement = document.createElement('div');
        repoElement.classList.add('repo');

        repoElement.innerHTML = `
            <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
            <p>${repo.description ? repo.description : 'No description provided.'}</p>
            <a href="${repo.html_url}" target="_blank">View Repository</a>
        `;

        reposContainer.appendChild(repoElement);
    });
}

document.addEventListener('DOMContentLoaded', fetchRepos);
