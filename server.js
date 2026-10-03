import express from 'express';

import expenseRoutes from './routes/expenseRoutes.js';

const app = express();

app.use(express.json());

app.use('/expenses', expenseRoutes);

// 404 - Route not found
app.use((req, res) => {
    res.status(404).json({
        error: 'Route not found'
    });
});

// Central error handler
app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({
        error: 'Something went wrong'
    });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});