
import mongoose from 'mongoose';

import {
    getAllExpenses,
    createExpense as createExpenseService,
    updateExpense as updateExpenseService,
    deleteExpense as deleteExpenseService,
    getExpenseById
} from '../services/expenseService.js';

import { asyncHandler } from '../utils/asyncHandler.js';

// GET all expenses
export const getExpenses = asyncHandler(async (req, res) => {
    const expenses = await getAllExpenses(req.user.userId);

    res.json(expenses);
});

// GET one expense
export const getExpense = asyncHandler(async (req, res) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            error: 'Invalid expense ID'
        });
    }

    const expense = await getExpenseById(
        id,
        req.user.userId
    );

    if (!expense) {
        return res.status(404).json({
            error: 'Expense not found'
        });
    }

    res.json(expense);
});

// CREATE expense
export const createExpense = asyncHandler(async (req, res) => {
  const { title, amount, category } = req.body ?? {};

    if (
        typeof title !== 'string' ||
        !title.trim() ||
        typeof category !== 'string' ||
        !category.trim() ||
        amount === undefined ||
        typeof amount !== 'number' ||
        !Number.isFinite(amount) ||
        amount <= 0
    ) {
        return res.status(400).json({
            error: 'Valid title, category and positive amount are required'
        });
    }

    const newExpense = await createExpenseService(
        title.trim(),
        amount,
        category.trim(),
        req.user.userId
    );

    res.status(201).json(newExpense);
});

// UPDATE expense
export const updateExpense = asyncHandler(async (req, res) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            error: 'Invalid expense ID'
        });
    }

    const { title, amount, category } = req.body ?? {};

    if (
        typeof title !== 'string' ||
        !title.trim() ||
        typeof category !== 'string' ||
        !category.trim() ||
        amount === undefined ||
        typeof amount !== 'number' ||
        !Number.isFinite(amount) ||
        amount <= 0
    ) {
        return res.status(400).json({
            error: 'Valid title, category and positive amount are required'
        });
    }

    const expense = await updateExpenseService(
        id,
        title.trim(),
        amount,
        category.trim(),
        req.user.userId
    );

    if (!expense) {
        return res.status(404).json({
            error: 'Expense not found'
        });
    }

    res.json({
        message: 'Expense updated successfully',
        expense
    });
});

// DELETE expense
export const deleteExpense = asyncHandler(async (req, res) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            error: 'Invalid expense ID'
        });
    }

    const deleted = await deleteExpenseService(
        id,
        req.user.userId
    );

    if (!deleted) {
        return res.status(404).json({
            error: 'Expense not found'
        });
    }

    res.json({
        message: 'Expense deleted successfully'
    });
});
