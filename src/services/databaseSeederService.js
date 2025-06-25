import { financeService } from './financeService.js';

export class DatabaseSeederService {
    async seedDatabase() {
        try {
            console.log('Starting database seeding...');

            // Check if data already exists
            const existingAccounts = await financeService.getAccounts();
            if (existingAccounts.length > 0) {
                console.log('Database already contains data. Skipping seeding.');
                return;
            }

            // 1. Create sample accounts
            console.log('Creating sample accounts...');
            const accounts = await this.createSampleAccounts();

            // 2. Create sample categories (if needed - categories might be default)
            console.log('Creating sample categories...');
            await this.createSampleCategories();

            // 3. Create sample tags
            console.log('Creating sample tags...');
            await this.createSampleTags();

            // 4. Create sample transactions
            console.log('Creating sample transactions...');
            await this.createSampleTransactions(accounts);

            // 5. Create sample budgets
            console.log('Creating sample budgets...');
            await this.createSampleBudgets();

            // 6. Create sample scheduled transactions
            console.log('Creating sample scheduled transactions...');
            await this.createSampleScheduledTransactions(accounts);

            console.log('Database seeding completed successfully!');
            return true;
        } catch (error) {
            console.error('Error seeding database:', error);
            throw error;
        }
    }

    async createSampleAccounts() {
        const accountsData = [
            {
                name: 'Checking Account',
                account_type: 'checking',
                balance: 2500.00
            },
            {
                name: 'Savings Account',
                account_type: 'savings',
                balance: 15000.00
            },
            {
                name: 'Credit Card',
                account_type: 'credit_card',
                balance: -850.00
            },
            {
                name: 'Cash Wallet',
                account_type: 'cash',
                balance: 200.00
            },
            {
                name: 'Investment Account',
                account_type: 'investment',
                balance: 8500.00
            }
        ];

        const createdAccounts = [];
        for (const accountData of accountsData) {
            const account = await financeService.createAccount(accountData);
            createdAccounts.push(account);
        }

        return createdAccounts;
    }

    async createSampleCategories() {
        // Categories might already exist as defaults, so we'll only create if needed
        const existingCategories = await financeService.getCategories();

        if (existingCategories.length === 0) {
            const categoriesData = [
                { name: 'Food & Drinks', description: 'Restaurants, groceries, beverages', icon: '🍔', color: '#FF6B6B' },
                { name: 'Transportation', description: 'Gas, public transport, car maintenance', icon: '🚗', color: '#4ECDC4' },
                { name: 'Shopping', description: 'Clothing, electronics, general shopping', icon: '🛍️', color: '#45B7D1' },
                { name: 'Bills & Utilities', description: 'Electricity, water, internet, phone', icon: '💡', color: '#FFEAA7' },
                { name: 'Income', description: 'Salary, freelance, investments', icon: '💰', color: '#82E0AA' }
            ];

            for (const categoryData of categoriesData) {
                await financeService.createCategory(categoryData);
            }
        }
    }

    async createSampleTags() {
        const tagsData = [
            { name: 'Business', description: 'Business related expenses', color: '#3B82F6' },
            { name: 'Personal', description: 'Personal expenses', color: '#10B981' },
            { name: 'Emergency', description: 'Emergency fund related', color: '#EF4444' },
            { name: 'Vacation', description: 'Vacation and travel', color: '#F59E0B' },
            { name: 'Health', description: 'Health and medical', color: '#8B5CF6' }
        ];

        for (const tagData of tagsData) {
            await financeService.createTag(tagData);
        }
    }

    async createSampleTransactions(accounts) {
        // Get categories for reference
        const categories = await financeService.getCategories();
        const tags = await financeService.getTags();

        const foodCategory = categories.find(c => c.name === 'Food & Drinks');
        const transportCategory = categories.find(c => c.name === 'Transportation');
        const incomeCategory = categories.find(c => c.name === 'Income');
        const billsCategory = categories.find(c => c.name === 'Bills & Utilities');
        const shoppingCategory = categories.find(c => c.name === 'Shopping');

        const businessTag = tags.find(t => t.name === 'Business');
        const personalTag = tags.find(t => t.name === 'Personal');

        const checkingAccount = accounts.find(a => a.name === 'Checking Account');
        const savingsAccount = accounts.find(a => a.name === 'Savings Account');
        const creditCard = accounts.find(a => a.name === 'Credit Card');
        const cashWallet = accounts.find(a => a.name === 'Cash Wallet');
        const investmentAccount = accounts.find(a => a.name === 'Investment Account');

        const transactionsData = [
            // Income transactions
            {
                account_id: checkingAccount.account_id,
                description: 'Salary June 2025',
                amount: 3500.00,
                transaction_date: new Date('2025-06-01').toISOString(),
                transaction_type: 'income',
                category_id: incomeCategory?.category_id,
                memo: 'Monthly salary payment'
            },
            {
                account_id: checkingAccount.account_id,
                description: 'Freelance Project',
                amount: 800.00,
                transaction_date: new Date('2025-06-15').toISOString(),
                transaction_type: 'income',
                category_id: incomeCategory?.category_id,
                tag_id: businessTag?.tag_id,
                memo: 'Web development project'
            },
            {
                account_id: savingsAccount.account_id,
                description: 'Interest Payment',
                amount: 25.50,
                transaction_date: new Date('2025-06-01').toISOString(),
                transaction_type: 'income',
                category_id: incomeCategory?.category_id,
                memo: 'Bank interest'
            },

            // Expense transactions
            {
                account_id: checkingAccount.account_id,
                description: 'Grocery Shopping',
                amount: 85.50,
                transaction_date: new Date('2025-06-20').toISOString(),
                transaction_type: 'expense',
                category_id: foodCategory?.category_id,
                tag_id: personalTag?.tag_id,
                memo: 'Weekly groceries'
            },
            {
                account_id: creditCard.account_id,
                description: 'Restaurant Dinner',
                amount: 45.00,
                transaction_date: new Date('2025-06-18').toISOString(),
                transaction_type: 'expense',
                category_id: foodCategory?.category_id,
                tag_id: personalTag?.tag_id,
                memo: 'Dinner with friends'
            },
            {
                account_id: checkingAccount.account_id,
                description: 'Gas Station',
                amount: 60.00,
                transaction_date: new Date('2025-06-17').toISOString(),
                transaction_type: 'expense',
                category_id: transportCategory?.category_id,
                memo: 'Fuel'
            },
            {
                account_id: checkingAccount.account_id,
                description: 'Electric Bill',
                amount: 120.00,
                transaction_date: new Date('2025-06-15').toISOString(),
                transaction_type: 'expense',
                category_id: billsCategory?.category_id,
                memo: 'Monthly electricity'
            },
            {
                account_id: creditCard.account_id,
                description: 'Online Shopping',
                amount: 150.00,
                transaction_date: new Date('2025-06-12').toISOString(),
                transaction_type: 'expense',
                category_id: shoppingCategory?.category_id,
                tag_id: personalTag?.tag_id,
                memo: 'Clothes and accessories'
            },
            {
                account_id: cashWallet.account_id,
                description: 'Coffee Shop',
                amount: 12.50,
                transaction_date: new Date('2025-06-22').toISOString(),
                transaction_type: 'expense',
                category_id: foodCategory?.category_id,
                memo: 'Morning coffee'
            },
            {
                account_id: checkingAccount.account_id,
                description: 'Internet Bill',
                amount: 45.00,
                transaction_date: new Date('2025-06-10').toISOString(),
                transaction_type: 'expense',
                category_id: billsCategory?.category_id,
                memo: 'Monthly internet'
            },

            // Transfer transactions
            {
                account_id: checkingAccount.account_id,
                description: 'Transfer to Savings',
                amount: 500.00,
                transaction_date: new Date('2025-06-01').toISOString(),
                transaction_type: 'transfer',
                transfer_account_id: savingsAccount.account_id,
                memo: 'Monthly savings'
            },
            {
                account_id: checkingAccount.account_id,
                description: 'Investment Contribution',
                amount: 300.00,
                transaction_date: new Date('2025-06-05').toISOString(),
                transaction_type: 'transfer',
                transfer_account_id: investmentAccount.account_id,
                memo: 'Monthly investment'
            }
        ];

        for (const transactionData of transactionsData) {
            await financeService.createTransaction(transactionData);
        }
    }

    async createSampleBudgets() {
        const categories = await financeService.getCategories();

        const foodCategory = categories.find(c => c.name === 'Food & Drinks');
        const transportCategory = categories.find(c => c.name === 'Transportation');
        const billsCategory = categories.find(c => c.name === 'Bills & Utilities');

        const budgetsData = [
            {
                name: 'Monthly Food Budget',
                amount: 400.00,
                duration: 'monthly',
                start_date: '2025-06-01',
                end_date: '2025-06-30',
                category_id: foodCategory?.category_id,
                include_subcategories: false,
                include_transfers: false,
                include_deposits: false,
                include_income: false
            },
            {
                name: 'Transportation Budget',
                amount: 200.00,
                duration: 'monthly',
                start_date: '2025-06-01',
                end_date: '2025-06-30',
                category_id: transportCategory?.category_id,
                include_subcategories: false,
                include_transfers: false,
                include_deposits: false,
                include_income: false
            },
            {
                name: 'Bills Budget',
                amount: 300.00,
                duration: 'monthly',
                start_date: '2025-06-01',
                end_date: '2025-06-30',
                category_id: billsCategory?.category_id,
                include_subcategories: false,
                include_transfers: false,
                include_deposits: false,
                include_income: false
            },
            {
                name: 'Annual Vacation Fund',
                amount: 2400.00,
                duration: 'yearly',
                start_date: '2025-01-01',
                end_date: '2025-12-31',
                category_id: null,
                include_subcategories: false,
                include_transfers: false,
                include_deposits: false,
                include_income: false
            }
        ];

        for (const budgetData of budgetsData) {
            await financeService.createBudget(budgetData);
        }
    }

    async createSampleScheduledTransactions(accounts) {
        const categories = await financeService.getCategories();

        const incomeCategory = categories.find(c => c.name === 'Income');
        const billsCategory = categories.find(c => c.name === 'Bills & Utilities');

        const checkingAccount = accounts.find(a => a.name === 'Checking Account');
        const savingsAccount = accounts.find(a => a.name === 'Savings Account');

        const scheduledTransactionsData = [
            {
                account_id: checkingAccount.account_id,
                description: 'Monthly Salary',
                amount: 3500.00,
                next_due_date: new Date('2025-07-01').toISOString(),
                schedule_type: 'recurring',
                frequency: 'monthly',
                transaction_type: 'income',
                category_id: incomeCategory?.category_id
            },
            {
                account_id: checkingAccount.account_id,
                description: 'Electric Bill',
                amount: 120.00,
                next_due_date: new Date('2025-07-15').toISOString(),
                schedule_type: 'recurring',
                frequency: 'monthly',
                transaction_type: 'expense',
                category_id: billsCategory?.category_id
            },
            {
                account_id: checkingAccount.account_id,
                description: 'Internet Bill',
                amount: 45.00,
                next_due_date: new Date('2025-07-10').toISOString(),
                schedule_type: 'recurring',
                frequency: 'monthly',
                transaction_type: 'expense',
                category_id: billsCategory?.category_id
            },
            {
                account_id: checkingAccount.account_id,
                description: 'Auto Transfer to Savings',
                amount: 500.00,
                next_due_date: new Date('2025-07-01').toISOString(),
                schedule_type: 'recurring',
                frequency: 'monthly',
                transaction_type: 'transfer',
                transfer_account_id: savingsAccount.account_id
            }
        ];

        for (const scheduledData of scheduledTransactionsData) {
            await financeService.createScheduledTransaction(scheduledData);
        }
    }
}

export const databaseSeeder = new DatabaseSeederService();