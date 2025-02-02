import { fetchJSON, renderProjects } from './global.js';
import { fetchGitHubData } from './global.js';

async function loadLatestProjects() {
    console.log("🔄 Fetching latest projects...");

    try {
        // Fetch all projects from JSON
        const projects = await fetchJSON('./lib/projects.json');
        console.log("✅ Projects fetched:", projects);

        if (!projects || projects.length === 0) {
            console.error("❌ No projects found.");
            return;
        }

        // Select only the first 3 projects
        const latestProjects = projects.slice(0, 3);
        console.log("✅ Latest projects selected:", latestProjects);

        // Find the projects container in index.html
        const projectsContainer = document.querySelector('.projects');
        if (!projectsContainer) {
            console.error("❌ Projects container not found on homepage.");
            return;
        }

        // Render the latest projects
        renderProjects(latestProjects, projectsContainer);
        console.log("✅ Latest projects displayed successfully!");
    } catch (error) {
        console.error("❌ Error loading latest projects:", error);
    }
}

// Call the function when the page loads
loadLatestProjects();

async function loadGitHubProfile() {
    console.log("🔄 Fetching GitHub profile...");
    
    const username = "jerricjiang9"; // Replace with your GitHub username
    const container = document.querySelector("#github-container");

    if (!container) {
        console.error("❌ GitHub container not found!");
        return;
    }

    try {
        const githubData = await fetchGitHubData(username);
        
        if (!githubData) {
            container.innerHTML = "<p>Failed to load GitHub data.</p>";
            return;
        }

        // Update the container with GitHub data
        container.innerHTML = `
            <img src="${githubData.avatar_url}" alt="GitHub Avatar" width="100">
            <p><strong>Username:</strong> ${githubData.login}</p>
            <dl>
                <dt>Public Repos:</dt><dd>${githubData.public_repos}</dd>
                <dt>Public Gists:</dt><dd>${githubData.public_gists}</dd>
                <dt>Followers:</dt><dd>${githubData.followers}</dd>
                <dt>Following:</dt><dd>${githubData.following}</dd>
            </dl>
            <a href="${githubData.html_url}" target="_blank">View Profile</a>
        `;
        console.log("✅ GitHub profile displayed successfully!");
    } catch (error) {
        console.error("❌ Error displaying GitHub profile:", error);
    }
}

loadGitHubProfile();