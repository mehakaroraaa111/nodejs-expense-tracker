import { readFile,writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const expensesFile = path.join(__dirname, '..', 'expenses.json');

export const getAllExpenses = async () => {
    const data = await readFile(expensesFile, 'utf-8');

    const expenses = JSON.parse(data);

    return expenses;
};
export const createExpense = async (title, amount, category) => {
    const data = await readFile(expensesFile, 'utf-8');

    const expenses = JSON.parse(data);

    const newExpense = {
        id: expenses.length + 1,
        title,
        amount,
        category
    };

    expenses.push(newExpense);

    await writeFile(
        expensesFile,
        JSON.stringify(expenses, null, 2)
    );

    return newExpense;
};
export const updateExpense = async (id, title, amount, category) => {
    const data = await readFile(expensesFile, 'utf-8');

    const expenses = JSON.parse(data);

    const expense = expenses.find(expense => expense.id === id);

    if (!expense) {
        return null;
    }

    expense.title = title;
    expense.amount = amount;
    expense.category = category;

    await writeFile(
        expensesFile,
        JSON.stringify(expenses, null, 2)
    );

    return expense;
};
export const deleteExpense = async (id) => {
    const data = await readFile(expensesFile, 'utf-8');

    const expenses = JSON.parse(data);

    const expenseIndex = expenses.findIndex(
        expense => expense.id === id
    );

    if (expenseIndex === -1) {
        return false;
    }

    expenses.splice(expenseIndex, 1);

    await writeFile(
        expensesFile,
        JSON.stringify(expenses, null, 2)
    );

    return true;
};