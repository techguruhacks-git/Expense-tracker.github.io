class ExpenseTracker {

    constructor() {
        this.expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        this.form = document.getElementById('expenseForm');
        this.expensesList = document.getElementById('expensesList');
        
        this.initializeEventListeners();
        this.updateUI();
    }


    initializeEventListeners() {

        this.form.addEventListener('submit', (e) => {

            e.preventDefault();
            this.addExpense();
        });

    }

    addExpense() {

        const description = document.getElementById('description').value.trim();

        const amount = parseFloat(document.getElementById('amount').value);

        const category = document.getElementById('category').value;

        if (!description || isNaN(amount) || amount <= 0 || !category) {

            alert('Please provide valid inputs.');

            return;
        }

        const expense = {

            id: Date.now(),

            description,

            amount,

            category,

            date: new Date().toLocaleDateString('en-IN')
        };

        this.expenses.push(expense);
        this.saveToLocalStorage();
        this.updateUI();
        this.form.reset();
    }

    deleteExpense(id) {

        const index = this.expenses.findIndex(expense => expense.id === id);

        if (index !== -1) {

            const expenseItem = document.querySelector(`[data-id="${id}"]`);
            expenseItem.style.animation = 'slideOut 0.3s ease forwards';

            setTimeout(() => {

                this.expenses.splice(index, 1);
                this.saveToLocalStorage();
                this.updateUI();

            }, 300);
        }
    }

    updateStats() {
        const total = this.expenses.reduce((sum, expense) => sum + expense.amount, 0);

        const average = this.expenses.length > 0 ? total / this.expenses.length : 0;

        document.getElementById('totalExpenses').textContent = total.toFixed(2);

        document.getElementById('averageExpense').textContent = average.toFixed(2);

        document.getElementById('totalItems').textContent = this.expenses.length;
    }

    updateExpensesList() {

        this.expensesList.innerHTML = '';
        this.expenses.sort((a, b) => b.id - a.id).forEach(expense => {

            const expenseElement = document.createElement('div');

            expenseElement.className = 'expense-item';

            expenseElement.dataset.id = expense.id;

            expenseElement.innerHTML = `
                <div class="expense-info">
                    <h4>${expense.description}</h4>
                    <span class="category">${expense.category} • ${expense.date}</span>
                </div>
                <div class="expense-actions">
                    <span class="expense-amount">₹${expense.amount.toFixed(2)}</span>

                    <button class="delete-btn"><i class="fa-regular fa-delete-left" style="color: #ffffff;"></i>Delete</button>

                </div>
            `;

            const deleteBtn = expenseElement.querySelector('.delete-btn');

            deleteBtn.addEventListener('click', () => this.deleteExpense(expense.id));


            this.expensesList.appendChild(expenseElement);

        });
    }

    updateUI() {

        this.updateStats();

        this.updateExpensesList();
    }

    saveToLocalStorage() {

        localStorage.setItem('expenses', JSON.stringify(this.expenses));
    }
}

const expenseTracker = new ExpenseTracker();
