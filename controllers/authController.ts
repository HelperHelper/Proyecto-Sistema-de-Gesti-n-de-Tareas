import { Request, Response, Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware'; //importa la funcción autenticatetoken
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user';

const router = Router();

router.post('/signup', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    // Verificar si el usuario ya existe en la base de datos
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Si el usuario no existe, crear un nuevo usuario en la base de datos
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser: IUser = new User({ username, password: hashedPassword });

    await newUser.save();

    res.status(201).json({ message: 'Usuario creado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar el usuario' });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    // Verificar si el usuario existe en la base de datos
    const existingUser = await User.findOne({ username });

    if (!existingUser) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Verificar la contraseña
    const passwordMatch = await bcrypt.compare(password, existingUser.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Si las credenciales son válidas, generar un token JWT
    const token = jwt.sign({ userId: existingUser._id }, process.env.SECRETORPRIVATEKEY as string, {
      expiresIn: '1h', // El token expira en 1 hora
    });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

// Función para listar los usuarios almacenados
router.get('/users', async (req: Request, res: Response) => {
  try {
    const users: IUser[] = await User.find({}, 'username'); // Obtener todos los usuarios con sus nombres de usuario

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error al listar los usuarios' });
  }
});

router.get('/protected', authenticateToken, (req: Request, res: Response) => {
  res.json({ message: 'Ruta protegida. Acceso concedido.' });
});

export default {
  router,
};
