import { readFile,writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { getAllExpenses,
    createExpense as createExpenseService,
    updateExpense as updateExpenseService,
    deleteExpense as deleteExpenseService
 } from '../services/expenseService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const expensesFile = path.join(__dirname, '..', 'expenses.json');

export const getExpenses = asyncHandler(async (req, res) => {
    const expenses = await getAllExpenses();

    res.json(expenses);
});
export const createExpense = asyncHandler(async (req, res) => {
    const { title, amount, category } = req.body;
if(!title || !amount || !category){
    return res.status(404).json({
        error:'Title,amount,category are required'
    });
};
if(typeof amount !== 'number' || amount <=0){
    return res.status(404).json({
        error:'Amount must be a positive number '
    });
};
    const newExpense = await createExpenseService(
        title,
        amount,
        category
    );

    res.status(201).json(newExpense);
});
export const updateExpense = asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
 if(isNaN(id)){
    return res.status(404).json({
        error:'invalid expense ID'
    });
 }
    const { title, amount, category } = req.body;
   if (!title || !amount || !category) {
        return res.status(400).json({
            error: 'Title, amount and category are required'
        });
    }

    if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({
            error: 'Amount must be a positive number'
        });
    }


    const expense = await updateExpenseService(
        id,
        title,
        amount,
        category
    );



    if (!expense) {
        return res.status(404).json({
            error: 'Expense not found'
        });
    }

    res.json({
        message: 'Expense updated successfully',
        expense: expense
    });
});
export const deleteExpense = asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
  if (isNaN(id)) {
        return res.status(400).json({
            error: 'Invalid expense ID'
        });
    }
    const deleted = await deleteExpenseService(id);

    if (!deleted) {
        return res.status(404).json({
            error: 'Expense not found'
        });
    }

    res.json({
        message: 'Expense deleted successfully'
    });
});