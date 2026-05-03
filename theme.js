// ===== THEME TOGGLE =====
// Detects user's system preference and allows manual toggle.
// Saves preference to localStorage for persistence.

(function() {
    const STORAGE_KEY = 'f2h-theme';

    // Determine initial theme: localStorage > system preference > dark
    function getPreferredTheme() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) return stored;

        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        updateToggleIcon(theme);
    }

    function updateToggleIcon(theme) {
        const btn = document.getElementById('theme-toggle');
        if (!btn) return;

        const sunIcon = btn.querySelector('.icon-sun');
        const moonIcon = btn.querySelector('.icon-moon');

        if (sunIcon && moonIcon) {
            if (theme === 'light') {
                sunIcon.style.display = 'none';
                moonIcon.style.display = 'block';
            } else {
                sunIcon.style.display = 'block';
                moonIcon.style.display = 'none';
            }
        }
    }

    // Apply theme immediately to prevent flash
    applyTheme(getPreferredTheme());

    // Listen for system theme changes (when no manual override)
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
        if (!localStorage.getItem(STORAGE_KEY)) {
            applyTheme(e.matches ? 'light' : 'dark');
        }
    });

    // Setup toggle button after DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        const btn = document.getElementById('theme-toggle');
        if (!btn) return;

        // Set correct initial icon
        updateToggleIcon(getPreferredTheme());

        btn.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme') || 'dark';
            const next = current === 'dark' ? 'light' : 'dark';

            applyTheme(next);
            localStorage.setItem(STORAGE_KEY, next);

            // Add a subtle spin animation on click
            btn.classList.add('theme-toggle-spin');
            setTimeout(() => btn.classList.remove('theme-toggle-spin'), 500);
        });
    });
})();
