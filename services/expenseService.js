
import Expense from '../models/Expense.js';

// GET all expenses for a specific user
export const getAllExpenses = async (userId) => {
    return Expense.find({ user: userId });
};

// GET one expense by ID for a specific user
export const getExpenseById = async (id, userId) => {
    return Expense.findOne({
        _id: id,
        user: userId
    });
};

// CREATE expense
export const createExpense = async (
    title,
    amount,
    category,
    userId
) => {
    return Expense.create({
        title,
        amount,
        category,
        user: userId
    });
};

// UPDATE expense
export const updateExpense = async (
    id,
    title,
    amount,
    category,
    userId
) => {
    return Expense.findOneAndUpdate(
        { _id: id, user: userId },
        { title, amount, category },
        {
            returnDocument: 'after',
            runValidators: true
        }
    );
};

// DELETE expense
export const deleteExpense = async (id, userId) => {
    return Expense.findOneAndDelete({
        _id: id,
        user: userId
    });
};
