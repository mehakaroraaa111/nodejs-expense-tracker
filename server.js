
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import expenseRoutes from './routes/expenseRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { authMiddleware } from './controllers/middleware/authMiddleware.js';
import { connectDB } from './config/db.js';

const app = express();


app.use(cors({
  origin: 'http://localhost:5173'
}));

app.use(express.json());


// Authentication is required for expense routes
app.use('/expenses', authMiddleware, expenseRoutes);

// Signup and login routes
app.use('/auth', authRoutes);

// 404 - Route not found
app.use((req, res) => {
    res.status(404).json({
        error: 'Route not found'
    });
});

// Central error handler
app.use((err, req, res, next) => {
    console.error(err);

    if (res.headersSent) {
        return next(err);
    }

    res.status(500).json({
        error: 'Something went wrong'
    });
});

const startServer = async () => {
    try {
        await connectDB();

        const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
    } catch (error) {
        console.error('Server startup failed:', error.message);
        process.exit(1);
    }
};

startServer();
