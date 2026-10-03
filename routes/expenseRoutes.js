import express from 'express';
import { readFile,writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { getExpenses,createExpense, updateExpense, deleteExpense } from '../controllers/expenseController.js';
import { logger } from '../../middleware/logger.js';
const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const expensesFile = path.join(__dirname, '..', 'expenses.json');
router.use(logger);
router.get('/',getExpenses);

router.post('/', createExpense);

router.put('/:id', updateExpense)
router.delete('/:id', deleteExpense)
export default router;
