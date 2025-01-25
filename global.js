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