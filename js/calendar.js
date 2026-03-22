class CalendarApp {
    constructor() {
        this.currentDate = new Date();
        this.events = JSON.parse(localStorage.getItem('calendarEvents')) || {};
        this.init();
    }

    init() {
        this.render();
        this.bindEvents();
        this.updateTodayEvents();
    }

    bindEvents() {
        document.getElementById('prevMonth').addEventListener('click', () => this.prevMonth());
        document.getElementById('nextMonth').addEventListener('click', () => this.nextMonth());
        document.getElementById('addEventBtn').addEventListener('click', () => this.addEvent());
        
        // Enter key for add event
        document.getElementById('eventTitle').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addEvent();
        });
    }

    render() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const today = new Date();
        
        document.getElementById('monthYear').textContent = 
            this.currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();

        let calendarHTML = '';

        // Previous month days
        for (let i = firstDay - 1; i >= 0; i--) {
            calendarHTML += `<div class="calendar-day other-month">${daysInPrevMonth - i}</div>`;
        }

        // Current month days
        for (let day = 1; day <= daysInMonth; day++) {
            const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayEvents = this.events[dateKey] || [];
            const isToday = year === today.getFullYear() && month === today.getMonth() && day === today.getDate();
            
            let eventBadge = '';
            if (dayEvents.length > 0) {
                eventBadge = `<div class="events-count">${dayEvents.length}</div>`;
            }

            calendarHTML += `
                <div class="calendar-day ${isToday ? 'today' : ''} ${dayEvents.length > 0 ? 'has-event' : ''}" 
                     data-date="${dateKey}">
                    <div class="day-number">${day}</div>
                    ${eventBadge}
                </div>
            `;
        }

        document.getElementById('calendarGrid').innerHTML = calendarHTML;

        // Add click handlers to days
        document.querySelectorAll('.calendar-day:not(.other-month)').forEach(day => {
            day.addEventListener('click', (e) => {
                document.getElementById('eventDate').value = e.currentTarget.dataset.date;
                document.getElementById('eventTitle').focus();
            });
        });
    }

    prevMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.render();
    }

    nextMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.render();
    }

    addEvent() {
        const date = document.getElementById('eventDate').value;
        const title = document.getElementById('eventTitle').value.trim();
        const desc = document.getElementById('eventDesc').value.trim();

        if (!date || !title) {
            alert('Please select a date and enter a title');
            return;
        }

        if (!this.events[date]) {
            this.events[date] = [];
        }

        this.events[date].push({
            id: Date.now(),
            title,
            desc,
            created: new Date().toISOString()
        });

        localStorage.setItem('calendarEvents', JSON.stringify(this.events));

        // Clear form
        document.getElementById('eventTitle').value = '';
        document.getElementById('eventDesc').value = '';

        this.render();
        this.updateTodayEvents();
    }

    updateTodayEvents() {
        const today = new Date().toDateString();
        const todayKey = Object.keys(this.events).find(key => 
            new Date(key).toDateString() === today
        );

        const todayEventsList = document.getElementById('todayEventsList');
        const events = todayKey ? this.events[todayKey] : [];

        if (events.length === 0) {
            todayEventsList.innerHTML = '<p style="opacity: 0.7;">No events today</p>';
            return;
        }

        todayEventsList.innerHTML = events.map(event => `
            <div class="event-item">
                <div>
                    <strong>${event.title}</strong>
                    ${event.desc ? `<br><small>${event.desc}</small>` : ''}
                </div>
                <button class="delete-btn" onclick="calendarApp.deleteEvent('${event.id}')">×</button>
            </div>
        `).join('');
    }

    deleteEvent(eventId) {
        const today = new Date().toDateString();
        const todayKey = Object.keys(this.events).find(key => 
            new Date(key).toDateString() === today
        );

        if (todayKey && this.events[todayKey]) {
            this.events[todayKey] = this.events[todayKey].filter(e => e.id != eventId);
            if (this.events[todayKey].length === 0) {
                delete this.events[todayKey];
            }
            localStorage.setItem('calendarEvents', JSON.stringify(this.events));
            this.updateTodayEvents();
        }
    }
}

// Initialize when DOM loads
let calendarApp;
document.addEventListener('DOMContentLoaded', () => {
    calendarApp = new CalendarApp();
});