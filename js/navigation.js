// ============================================
// SECTION NAVIGATION
// ============================================

const buttons = document.querySelectorAll(".sidebar button[data-section]");
const sections = document.querySelectorAll(".section");

// Handle navigation clicks
buttons.forEach(button => {
    button.addEventListener("click", () => {
        const targetSection = button.dataset.section;

        // Hide ALL sections
        sections.forEach(section => {
            section.style.display = "none";
        });

        // Show target section
        const target = document.getElementById(targetSection);
        if (target) {
            target.style.display = "block";
        }

        // Update active button
        buttons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        // Close mobile sidebar after navigation
        closeMobileSidebar();
    });
});

// Show Home on page load
document.addEventListener("DOMContentLoaded", () => {
    sections.forEach(section => section.style.display = "none");
    
    const homeSection = document.getElementById("home");
    const homeButton = document.querySelector('button[data-section="home"]');
    
    if (homeSection) homeSection.style.display = "block";
    if (homeButton) homeButton.classList.add("active");
});

// ============================================
// MOBILE SIDEBAR TOGGLE
// ============================================

const toggleBtn = document.getElementById("toggleSidebar");
const sidebar = document.getElementById("sidebar");

// Create overlay element
let overlay = document.querySelector('.sidebar-overlay');
if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);
}

function openMobileSidebar() {
    sidebar.classList.add("mobile-open");
    overlay.classList.add("active");
}

function closeMobileSidebar() {
    sidebar.classList.remove("mobile-open");
    overlay.classList.remove("active");
}

// Toggle sidebar
toggleBtn.addEventListener("click", () => {
    if (window.innerWidth <= 768) {
        if (sidebar.classList.contains("mobile-open")) {
            closeMobileSidebar();
        } else {
            openMobileSidebar();
        }
    } else {
        // Desktop: collapse/expand
        sidebar.classList.toggle("collapsed");
    }
});

// Close sidebar when clicking overlay
overlay.addEventListener("click", closeMobileSidebar);

// Close sidebar when clicking nav button (mobile only)
buttons.forEach(button => {
    button.addEventListener("click", closeMobileSidebar);
});

// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        closeMobileSidebar();
    }
});

// ============================================
// DESKTOP SIDEBAR COLLAPSE (Optional)
// ============================================

// Your existing desktop collapse works fine with the CSS we have