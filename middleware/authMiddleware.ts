import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';


export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ message: 'Token de autenticación no proporcionado' });
  }
  jwt.verify(token as string, 'your_secret_key', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido' });
    }
    (req as any).user = user;
    next();
  });
};
