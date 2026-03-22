class HomeDashboard {
    constructor() {
        this.init();
    }

    init() {
        this.renderStaticStats();
        this.createCharts();
    }

    renderStaticStats() {
        // Static demo data - replace with real data later
        document.getElementById('todayHabits').textContent = '4';
        document.getElementById('todayFocus').textContent = '2h 7m';
        document.getElementById('todayTasks').textContent = '8';
        
        document.getElementById('streakCount').textContent = '7';
        document.getElementById('streakHabits').textContent = '3 habits';
        document.getElementById('bestStreak').textContent = '21';
        
        document.getElementById('habitsProgress').textContent = '85%';
        document.getElementById('weeklyAvg').textContent = '4.2';
        document.getElementById('weeklyGoal').textContent = '82%';
    }

    createCharts() {
        try {
            // Destroy existing charts if any
            if (window.homeCharts) {
                window.homeCharts.forEach(chart => chart.destroy());
                window.homeCharts = [];
            } else {
                window.homeCharts = [];
            }

            // Habit completion doughnut
            const habitsCtx = document.getElementById('habitsChart')?.getContext('2d');
            if (habitsCtx) {
                const habitsChart = new Chart(habitsCtx, {
                    type: 'doughnut',
                    data: {
                        datasets: [{
                            data: [0.85, 0.15],
                            backgroundColor: ['#4CAF50', '#e5e7eb'],
                            borderWidth: 0,
                            cutout: '75%'
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        animation: { animateRotate: true, duration: 1500 }
                    }
                });
                window.homeCharts.push(habitsChart);
            }

            // Weekly bar chart
            const weeklyCtx = document.getElementById('weeklyChart')?.getContext('2d');
            if (weeklyCtx) {
                const weeklyChart = new Chart(weeklyCtx, {
                    type: 'bar',
                    data: {
                        labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
                        datasets: [{
                            data: [2, 5, 4, 6, 3, 5, 4],
                            backgroundColor: 'rgba(76, 175, 80, 0.8)',
                            borderColor: '#4CAF50',
                            borderWidth: 2,
                            borderRadius: 8,
                            borderSkipped: false
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                            y: { beginAtZero: true, max: 7, ticks: { display: false }, grid: { display: false } },
                            x: { grid: { display: false }, ticks: { font: { size: 12 } } }
                        },
                        animation: { duration: 1000 }
                    }
                });
                window.homeCharts.push(weeklyChart);
            }
        } catch (error) {
            console.error('Chart creation failed:', error);
        }
    }
}

// Global function for quick buttons (make sure this matches your navigation)
window.showSection = function(sectionId) {
    const btn = document.querySelector(`[data-section="${sectionId}"]`);
    if (btn) {
        btn.click();
    }
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.remove('collapsed');
    }
};

// Initialize ONLY once DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new HomeDashboard();
    });
} else {
    new HomeDashboard();
}