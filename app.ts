import express, { Express } from 'express';
import connectDB from './database/config';
import authController from './controllers/authController';
import { authenticateToken } from './middleware/authMiddleware';
import dotenv from 'dotenv';
import listEndpoints from 'express-list-endpoints';
import router from './routes/taskRoutes';
import errorHandler from './middleware/errorsMiddleware';// Importa el módulo CORS
const cors = require('cors');



dotenv.config();

const app: Express = express(); // Cambia el tipo de 'app' a 'Express'

app.use(express.json());

// Conexión a la base de datos
connectDB();

// Habilita CORS para todos los orígenes (en desarrollo)
app.use(cors());

// Rutas de autenticación
app.use('/auth', authController.router);

// Manejo de errores
app.use(errorHandler);

app.use('/api', router); // Usar las rutas de tareas

// Resto de la configuración y el inicio del servidor

// Ruta protegida que requiere autenticación
app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Ruta protegida. Acceso concedido.' });
});

const PORT: number = parseInt(process.env.PORT as string, 10) || 3000;
app.listen(PORT, () => {
  // Obtener y mostrar las rutas disponibles en la consola
  const routes = listEndpoints(app);
  console.log('Rutas disponibles:');
  routes.forEach((route: any) => {
    console.log(`${route.methods.join(', ')} - ${route.path}`);
  });

  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

