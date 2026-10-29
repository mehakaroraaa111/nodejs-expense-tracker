
import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            error: 'Authentication required'
        });
    }

    const parts = authHeader.trim().split(/\s+/);
    const [scheme, token] = parts;

    if (scheme !== 'Bearer' || !token || parts.length !== 2) {
        return res.status(401).json({
            error: 'Token missing or malformed'
        });
    }

    if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET is not configured');

        return res.status(500).json({
            error: 'Internal server error'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (
            typeof decoded === 'string' ||
            !decoded.userId ||
            typeof decoded.userId !== 'string'
        ) {
            return res.status(401).json({
                error: 'Invalid token payload'
            });
        }

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            error: 'Invalid or expired token'
        });
    }
};
