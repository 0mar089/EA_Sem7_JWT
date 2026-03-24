import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

export const authorizeRoles = (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        const userRole = req.user?.role;

        if (!userRole || !roles.includes(userRole)) {
            return res.status(403).json({ message: 'Acceso denegado: permisos insuficientes' });
        }

        next();
    };
};