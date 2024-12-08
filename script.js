const githubUsername = 'BenjaminLTakaki';

const apiUrl = `https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=6`;

async function fetchRepos() {
    try {
        const response = await fetch(apiUrl);
        const repos = await response.json();
        const repoList = document.getElementById('repos');
        
        repos.forEach(repo => {
            const repoItem = document.createElement('div');
            repoItem.classList.add('repo');
            repoItem.innerHTML = `
                <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
                <p>${repo.description || 'No description available.'}</p>
            `;
            repoList.appendChild(repoItem);
        });
    } catch (error) {
        console.error('Error fetching repos:', error);
    }
}

document.addEventListener('DOMContentLoaded', fetchRepos);
