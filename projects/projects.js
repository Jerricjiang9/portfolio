import { fetchJSON, renderProjects } from '../global.js';

async function loadProjects() {
    console.log("🔄 Running loadProjects function...");

    const projectsContainer = document.querySelector('.projects');
    const projectsTitle = document.querySelector('.projects-title');

    if (!projectsContainer) {
        console.error("❌ Projects container not found!");
        return;
    }

    try {
        const projects = await fetchJSON('../lib/projects.json');
        console.log("✅ Projects fetched:", projects);

        if (!projects || projects.length === 0) {
            console.error("❌ No projects found.");
            return;
        }

        renderProjects(projects, projectsContainer);
        console.log("✅ renderProjects function called successfully!");

        // Update project count in the title
        if (projectsTitle) {
            projectsTitle.textContent = `Projects (${projects.length})`;
            console.log(`✅ Updated project count: ${projects.length}`);
        }
    } catch (error) {
        console.error("❌ Error loading projects:", error);
    }
}

loadProjects(); // Run when page loads