// this one is jut to wait for the page to load
document.addEventListener('DOMContentLoaded', () => {

    const themeStylesheet = document.getElementById('theme');
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
        themeStylesheet.href = storedTheme;
    }
    const themeToggle = document.getElementById('input');
    themeToggle.addEventListener('click', () => {
        // if it's light -> go dark
        if (themeStylesheet.href.includes('light')) {
            themeStylesheet.href = 'dark-theme.css';
        } else {
            // if it's dark -> go light
            themeStylesheet.href = 'light-theme.css';
        }
        // save the preference to localStorage
        localStorage.setItem('theme', themeStylesheet.href)
    })
})