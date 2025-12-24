document.addEventListener("DOMContentLoaded", () => {
  function loadHTML(id, file) {
    return fetch(file)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load ${file}: ${response.status} ${response.statusText}`);
        }
        return response.text();
      })
      .then((data) => {
        const container = document.getElementById(id);
        if (container) {
          container.innerHTML = data;
          return true; // Success flag
        } else {
          console.warn(`Element with id "${id}" not found in DOM`);
          return false;
        }
      })
      .catch((err) => {
        console.error("Error loading HTML:", err);
        return false;
      });
  }

  // 1. Load Sidebar (left) - content only (assuming you use #sidebar-content inside <aside>)
  loadHTML("sidebar-left", "layout/sidebar.html"); // ← Changed to inner container ID

  // 2. Load Right Sidebar
  loadHTML("sidebar-right", "layout/user.html");

  // 3. Load Navbar + initialize search functionality
  loadHTML("navbar", "layout/navbar.html").then((success) => {
    if (!success) return;

    const wrapper = document.getElementById("searchWrapper");
    const btn = document.getElementById("searchBtn");
    const input = document.getElementById("searchInput");

    if (!wrapper || !btn || !input) {
      console.warn("Search elements not found in navbar.html");
      return;
    }

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      wrapper.classList.toggle("open");
      if (wrapper.classList.contains("open")) {
        input.focus();
      } else {
        input.blur();
      }
    });

    // Close search when clicking outside
    document.addEventListener("click", (e) => {
      if (!wrapper.contains(e.target) && e.target !== btn) {
        wrapper.classList.remove("open");
        input.blur();
      }
    });
  });

  // 4. Load Dashboard (main content) + initialize charts ONLY after script loads
  loadHTML("main-content", "layout/dashboard.html").then((success) => {
    if (!success) {
      console.error("Failed to load dashboard.html – charts cannot initialize");
      return;
    }

    // Create and load charts.js dynamically
    const chartsScript = document.createElement("script");
    chartsScript.src = "../assets/js/charts.js"; // Keep your path
    chartsScript.type = "text/javascript";

    chartsScript.onload = () => {
      // Safely call initCharts only if it exists
      if (typeof window.initCharts === "function") {
        try {
          window.initCharts();
          console.log("Charts initialized successfully");
        } catch (err) {
          console.error("Error during initCharts execution:", err);
        }
      } else {
        console.error("initCharts function not found. Make sure charts.js exposes window.initCharts");
      }
    };

    chartsScript.onerror = () => {
      console.error("Failed to load charts.js script");
    };

    // Append to body (or head) – body is fine
    document.body.appendChild(chartsScript);
  });
});