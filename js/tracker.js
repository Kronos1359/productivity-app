class HabitTracker {
    constructor() {
        this.currentMonth = new Date(2026, 2, 22); // March 2026
        this.habits = JSON.parse(localStorage.getItem('habits')) || [];
        this.monthData = JSON.parse(localStorage.getItem('habitData')) || {};
        this.init();
    }

    init() {
        this.bindEvents();
        this.render();
    }

    bindEvents() {
        document.getElementById('prevMonthBtn').addEventListener('click', () => this.changeMonth(-1));
        document.getElementById('nextMonthBtn').addEventListener('click', () => this.changeMonth(1));
        document.getElementById('addHabitBtn').addEventListener('click', () => this.showAddModal());
        document.getElementById('saveHabitBtn').addEventListener('click', () => this.saveHabit());
        document.getElementById('cancelHabitBtn').addEventListener('click', () => this.hideModal());
        document.getElementById('deleteHabitBtn').addEventListener('click', () => this.deleteHabitFromModal());
        document.getElementById('habitModal').addEventListener('click', (e) => {
            if (e.target === document.getElementById('habitModal')) this.hideModal();
        });
    }

    getMonthKey() {
        const year = this.currentMonth.getFullYear();
        const month = this.currentMonth.getMonth();
        return `${year}-${month}`;
    }

    changeMonth(direction) {
        this.currentMonth.setMonth(this.currentMonth.getMonth() + direction);
        this.render();
        this.saveData();
    }

    render() {
        this.updateMonthDisplay();
        this.renderHabitsGrid();
    }

    updateMonthDisplay() {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const monthName = monthNames[this.currentMonth.getMonth()];
        document.getElementById('trackerMonth').textContent = `${monthName} ${this.currentMonth.getFullYear()}`;
    }

    renderHabitsGrid() {
        const container = document.getElementById('habitsGrid');
        const noHabitsMsg = document.getElementById('noHabitsMessage');
        
        if (this.habits.length === 0) {
            container.style.display = 'none';
            noHabitsMsg.style.display = 'block';
            return;
        }

        container.style.display = 'block';
        noHabitsMsg.style.display = 'none';

        const monthKey = this.getMonthKey();
        const daysInMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0).getDate();
        const monthData = this.monthData[monthKey] || {};

        let html = '<table class="habit-table">';
        
        // Header row
        html += '<tr><th>Habits</th>';
        for (let day = 1; day <= daysInMonth; day++) {
            html += `<th>${day}</th>`;
        }
        html += '</tr>';

        // Habit rows WITH ACTION BUTTONS
        this.habits.forEach((habit) => {
            html += `<tr class="habit-row">`;
            html += `<td>`;
            html += `<div style="display: flex; align-items: center; gap: 12px;">`;
            html += `<span class="habit-color-dot" style="background-color: ${habit.color};"></span>`;
            html += `<span style="flex: 1;">${habit.name} <span class="habit-type">${this.getTypeLabel(habit.type)}</span></span>`;
            html += `<div class="habit-actions">`;
            html += `<button class="edit-habit-btn" data-habit-id="${habit.id}" title="Edit">✏️</button>`;
            html += `<button class="delete-habit-btn" data-habit-id="${habit.id}" title="Delete">🗑️</button>`;
            html += `</div>`;
            html += `</div>`;
            html += `</td>`;
            
            // Data cells
            for (let day = 1; day <= daysInMonth; day++) {
                const dateKey = `${day}`;
                const dayData = monthData[dateKey] || {};
                const value = dayData[habit.id] || '';
                
                html += `<td>`;
                if (habit.type === 'checkbox') {
                    html += `<input type="checkbox" class="habit-input" ${value ? 'checked' : ''} data-habit-id="${habit.id}" data-date="${dateKey}">`;
                } else if (habit.type === 'number') {
                    html += `<input type="number" class="habit-input" min="0" max="999" value="${value || ''}" data-habit-id="${habit.id}" data-date="${dateKey}">`;
                } else {
                    html += `<input type="text" class="habit-input" maxlength="10" value="${value || ''}" data-habit-id="${habit.id}" data-date="${dateKey}">`;
                }
                html += `</td>`;
            }
            html += `</tr>`;
        });

        html += '</table>';
        container.innerHTML = html;

        // Bind input events
        container.querySelectorAll('.habit-input').forEach(input => {
            input.addEventListener('change', (e) => this.updateHabitData(e));
        });

        // Bind action buttons
        container.querySelectorAll('.edit-habit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const habitId = e.target.dataset.habitId;
                this.editHabit(habitId);
            });
        });

        container.querySelectorAll('.delete-habit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const habitId = e.target.dataset.habitId;
                if (confirm(`Delete "${this.habits.find(h => h.id === habitId)?.name || 'Habit'}? All data will be lost.`)) {
                    this.deleteHabit(habitId);
                }
            });
        });
    }

    getTypeLabel(type) {
        const labels = {
            checkbox: '✓ Daily',
            number: '📊 Number',
            text: '📝 Note'
        };
        return labels[type] || '';
    }

    updateHabitData(e) {
        const input = e.target;
        const habitId = input.dataset.habitId;
        const date = input.dataset.date;
        const value = input.type === 'checkbox' ? input.checked : input.value;

        const monthKey = this.getMonthKey();
        if (!this.monthData[monthKey]) this.monthData[monthKey] = {};
        if (!this.monthData[monthKey][date]) this.monthData[monthKey][date] = {};
        this.monthData[monthKey][date][habitId] = value;

        this.saveData();
    }

    showAddModal() {
        document.getElementById('habitName').value = '';
        document.getElementById('habitType').value = 'checkbox';
        document.getElementById('habitColor').value = '#4CAF50';
        document.getElementById('modalTitle').textContent = 'Add New Habit';
        document.getElementById('deleteHabitBtn').style.display = 'none';
        document.getElementById('editingHabitId').value = '';
        document.getElementById('habitModal').style.display = 'block';
    }

    editHabit(habitId) {
        const habit = this.habits.find(h => h.id === habitId);
        if (!habit) return;

        document.getElementById('habitName').value = habit.name;
        document.getElementById('habitType').value = habit.type;
        document.getElementById('habitColor').value = habit.color;
        document.getElementById('modalTitle').textContent = 'Edit Habit';
        document.getElementById('deleteHabitBtn').style.display = 'inline-block';
        document.getElementById('editingHabitId').value = habitId;
        document.getElementById('habitModal').style.display = 'block';
    }

    saveHabit() {
        const name = document.getElementById('habitName').value.trim();
        const type = document.getElementById('habitType').value;
        const color = document.getElementById('habitColor').value;
        const editingId = document.getElementById('editingHabitId').value;

        if (!name) {
            alert('Please enter a habit name');
            return;
        }

        if (editingId) {
            // Update existing
            const habit = this.habits.find(h => h.id === editingId);
            if (habit) {
                habit.name = name;
                habit.type = type;
                habit.color = color;
            }
        } else {
            // Add new
            const newHabit = {
                id: Date.now().toString(),
                name,
                type,
                color
            };
            this.habits.push(newHabit);
        }

        this.hideModal();
        this.saveData();
        this.render();
    }

    deleteHabit(habitId) {
        // Remove habit
        this.habits = this.habits.filter(h => h.id !== habitId);
        
        // Clean up all month data
        Object.keys(this.monthData).forEach(monthKey => {
            Object.keys(this.monthData[monthKey]).forEach(date => {
                delete this.monthData[monthKey][date][habitId];
            });
        });

        this.saveData();
        this.render();
    }

    deleteHabitFromModal() {
        const editingId = document.getElementById('editingHabitId').value;
        if (!editingId || !confirm('Delete this habit? All data will be lost.')) return;
        this.deleteHabit(editingId);
    }

    hideModal() {
        document.getElementById('habitModal').style.display = 'none';
    }

    saveData() {
        localStorage.setItem('habits', JSON.stringify(this.habits));
        localStorage.setItem('habitData', JSON.stringify(this.monthData));
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new HabitTracker();
});