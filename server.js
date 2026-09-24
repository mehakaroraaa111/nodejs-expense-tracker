import { createServer } from 'node:http';
import { readFile, writeFile } from 'node:fs';

const server = createServer((req, res) => {

    if (req.method === 'GET' && req.url === '/expenses') {

        readFile('./expenses.json', 'utf8', (err, data) => {

            if (err) {
                res.writeHead(500, {
                    'Content-Type': 'text/plain'
                });

                res.end('Unable to read expenses');
                return;
            }

            const expenses = JSON.parse(data);

            res.writeHead(200, {
                'Content-Type': 'application/json'
            });

            res.end(JSON.stringify(expenses));
        });

        return;
    }

    if (req.method === 'GET' && req.url === '/expenses/summary') {

        readFile('./expenses.json', 'utf8', (err, data) => {

            if (err) {
                res.writeHead(500, {
                    'Content-Type': 'text/plain'
                });

                res.end('Unable to read expenses');
                return;
            }

            const expenses = JSON.parse(data);

            const totalExpenses = expenses.length;

            const totalAmount = expenses.reduce(
                (total, expense) => total + expense.amount,
                0
            );

            res.writeHead(200, {
                'Content-Type': 'application/json'
            });

            res.end(JSON.stringify({
                totalExpenses,
                totalAmount
            }));
        });

        return;
    }

    if (
        req.method === 'GET' &&
        req.url.startsWith('/expenses/')
    ) {

        const id = req.url.split('/')[2];

        readFile('./expenses.json', 'utf8', (err, data) => {

            if (err) {
                res.writeHead(500, {
                    'Content-Type': 'text/plain'
                });

                res.end('Unable to read expenses');
                return;
            }

            const expenses = JSON.parse(data);

            const expense = expenses.find(
                (expense) => expense.id === Number(id)
            );

            if (!expense) {
                res.writeHead(404, {
                    'Content-Type': 'application/json'
                });

                res.end(JSON.stringify({
                    error: 'Expense not found'
                }));

                return;
            }

            res.writeHead(200, {
                'Content-Type': 'application/json'
            });

            res.end(JSON.stringify(expense));
        });

        return;
    }

    if (
        req.method === 'POST' &&
        req.url === '/expenses'
    ) {

        let body = '';

        req.on('data', (chunk) => {
            body += chunk;
        });

        req.on('end', () => {

            let expense;

            try {
                expense = JSON.parse(body);
            } catch (error) {
                res.writeHead(400, {
                    'Content-Type': 'application/json'
                });

                res.end(JSON.stringify({
                    error: 'Invalid JSON'
                }));

                return;
            }

            if (!expense.title) {
                res.writeHead(400, {
                    'Content-Type': 'application/json'
                });

                res.end(JSON.stringify({
                    error: 'Title is required'
                }));

                return;
            }

            if (
                typeof expense.amount !== 'number' ||
                expense.amount <= 0
            ) {
                res.writeHead(400, {
                    'Content-Type': 'application/json'
                });

                res.end(JSON.stringify({
                    error: 'Amount must be a positive number'
                }));

                return;
            }

            if (!expense.category) {
                res.writeHead(400, {
                    'Content-Type': 'application/json'
                });

                res.end(JSON.stringify({
                    error: 'Category is required'
                }));

                return;
            }

            readFile('./expenses.json', 'utf8', (err, data) => {

                if (err) {
                    res.writeHead(500, {
                        'Content-Type': 'text/plain'
                    });

                    res.end('Unable to read expenses');
                    return;
                }

                const expenses = JSON.parse(data);

                const newExpense = {
                    id: Date.now(),
                    ...expense
                };

                expenses.push(newExpense);

                const jsonData = JSON.stringify(expenses);

                writeFile('./expenses.json', jsonData, (err) => {

                    if (err) {
                        res.writeHead(500, {
                            'Content-Type': 'text/plain'
                        });

                        res.end('Unable to save expenses');
                        return;
                    }

                    res.writeHead(201, {
                        'Content-Type': 'application/json'
                    });

                    res.end(JSON.stringify(newExpense));
                });
            });
        });

        return;
    }

    if (
        req.method === 'PUT' &&
        req.url.startsWith('/expenses/')
    ) {

        const id = req.url.split('/')[2];

        let body = '';

        req.on('data', (chunk) => {
            body += chunk;
        });

        req.on('end', () => {

            let updatedExpense;

            try {
                updatedExpense = JSON.parse(body);
            } catch (error) {
                res.writeHead(400, {
                    'Content-Type': 'application/json'
                });

                res.end(JSON.stringify({
                    error: 'Invalid JSON'
                }));

                return;
            }

            if (!updatedExpense.title) {
                res.writeHead(400, {
                    'Content-Type': 'application/json'
                });

                res.end(JSON.stringify({
                    error: 'Title is required'
                }));

                return;
            }

            if (
                typeof updatedExpense.amount !== 'number' ||
                updatedExpense.amount <= 0
            ) {
                res.writeHead(400, {
                    'Content-Type': 'application/json'
                });

                res.end(JSON.stringify({
                    error: 'Amount must be a positive number'
                }));

                return;
            }

            if (!updatedExpense.category) {
                res.writeHead(400, {
                    'Content-Type': 'application/json'
                });

                res.end(JSON.stringify({
                    error: 'Category is required'
                }));

                return;
            }

            readFile('./expenses.json', 'utf8', (err, data) => {

                if (err) {
                    res.writeHead(500, {
                        'Content-Type': 'text/plain'
                    });

                    res.end('Unable to read expenses');
                    return;
                }

                const expenses = JSON.parse(data);

                const index = expenses.findIndex(
                    (expense) => expense.id === Number(id)
                );

                if (index === -1) {
                    res.writeHead(404, {
                        'Content-Type': 'application/json'
                    });

                    res.end(JSON.stringify({
                        error: 'Expense not found'
                    }));

                    return;
                }

                expenses[index] = {
                    id: Number(id),
                    ...updatedExpense
                };

                const jsonData = JSON.stringify(expenses);

                writeFile('./expenses.json', jsonData, (err) => {

                    if (err) {
                        res.writeHead(500, {
                            'Content-Type': 'text/plain'
                        });

                        res.end('Unable to update expense');
                        return;
                    }

                    res.writeHead(200, {
                        'Content-Type': 'application/json'
                    });

                    res.end(JSON.stringify(expenses[index]));
                });
            });
        });

        return;
    }

    if (
        req.method === 'DELETE' &&
        req.url.startsWith('/expenses/')
    ) {

        const id = req.url.split('/')[2];

        readFile('./expenses.json', 'utf8', (err, data) => {

            if (err) {
                res.writeHead(500, {
                    'Content-Type': 'text/plain'
                });

                res.end('Unable to load expenses');
                return;
            }

            const expenses = JSON.parse(data);

            const expense = expenses.find(
                (expense) => expense.id === Number(id)
            );

            if (!expense) {
                res.writeHead(404, {
                    'Content-Type': 'application/json'
                });

                res.end(JSON.stringify({
                    error: 'Expense not found'
                }));

                return;
            }

            const updatedExpenses = expenses.filter(
                (expense) => expense.id !== Number(id)
            );

            const jsonData = JSON.stringify(updatedExpenses);

            writeFile('./expenses.json', jsonData, (err) => {

                if (err) {
                    res.writeHead(500, {
                        'Content-Type': 'text/plain'
                    });

                    res.end('Unable to delete expense');
                    return;
                }

                res.writeHead(200, {
                    'Content-Type': 'application/json'
                });

                res.end(JSON.stringify({
                    message: 'Expense deleted successfully'
                }));
            });
        });

        return;
    }

    res.writeHead(404, {
        'Content-Type': 'text/plain'
    });

    res.end('Route not found');
});

server.listen(3001, '127.0.0.1', () => {
    console.log('Expense tracker running on port 3001');
});