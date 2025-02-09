console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

const navLinks = $$('nav a');

const currentLink = navLinks.find(
  (a) => a.host === location.host && a.pathname === location.pathname
);

currentLink?.classList.add('current');

const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
const rootElement = document.documentElement;

function applyTheme(theme) {
  rootElement.dataset.theme = theme;
}

function detectSystemTheme() {
  return darkModeMediaQuery.matches ? 'dark' : 'light';
}

const savedTheme = localStorage.getItem('theme') || 'auto';
applyTheme(savedTheme === 'auto' ? detectSystemTheme() : savedTheme);

darkModeMediaQuery.addEventListener('change', () => {
  if (rootElement.dataset.theme === 'auto') {
    applyTheme(detectSystemTheme());
  }
});

const themeSwitcher = document.createElement('select');
themeSwitcher.innerHTML = `
  <option value="auto">Automatic</option>
  <option value="light">Light</option>
  <option value="dark">Dark</option>
`;
themeSwitcher.value = savedTheme;
themeSwitcher.addEventListener('change', (e) => {
  const selectedTheme = e.target.value;
  localStorage.setItem('theme', selectedTheme);
  applyTheme(selectedTheme === 'auto' ? detectSystemTheme() : selectedTheme);
});

document.body.prepend(themeSwitcher);

export async function fetchJSON(url) {
  try {
      const response = await fetch(url); 
      console.log(response); 

      if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
      }

      return await response.json(); 
  } catch (error) {
      console.error("Error fetching JSON data:", error);
      return null; 
  }
}

export function renderProjects(projects, container) {
  console.log("🔄 Running renderProjects function...");

  container.innerHTML = ''; 

  projects.forEach(project => {
      console.log(`📌 Rendering project: ${project.title}`); 

      const article = document.createElement('article');
      article.classList.add('project-item');

      article.innerHTML = `
            <h2>${project.title}</h2>
            <img src="${project.image}" alt="${project.title}">
            <div class="project-info">
                <p>${project.description}</p>
                <p class="project-year"><em>c. ${project.year}</em></p>
            </div>
            <a href="${project.link}" target="_blank">View Project</a>
        `;

      container.appendChild(article);
  });

  console.log("✅ All projects rendered successfully!");
}

export async function fetchGitHubData(username) {
  return fetchJSON(`https://api.github.com/users/${username}`);
}