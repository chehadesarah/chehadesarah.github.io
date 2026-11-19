/* Reusable navigation and footer for all CEDAR pages. */
(async function loadSharedLayout() {
    async function inject(id, path) {
        const element = document.getElementById(id);
        if (!element) return;

        try {
            const response = await fetch(path);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            element.innerHTML = await response.text();
        } catch (error) {
            console.error(`Unable to load ${path}:`, error);
            element.textContent = "Site navigation is temporarily unavailable.";
        }
    }

    await Promise.all([
        inject("site-header", "partials/header.html"),
        inject("site-footer", "partials/footer.html")
    ]);

    const currentPage = location.pathname.split("/").pop() || "index.html";
    const menu = document.querySelector("#site-header .menu");

    if (menu) {
        for (const link of menu.querySelectorAll("a[href]")) {
            if (link.getAttribute("href") === currentPage) {
                link.classList.add("active");
                link.setAttribute("aria-current", "page");
            }
        }
    }

    const toggle = document.querySelector("#site-header .toggle");
    toggle?.addEventListener("click", () => {
        const opened = menu.classList.toggle("open");
        toggle.setAttribute("aria-expanded", String(opened));
    });

    document.querySelectorAll("[data-year]").forEach(element => {
        element.textContent = new Date().getFullYear();
    });
})();
