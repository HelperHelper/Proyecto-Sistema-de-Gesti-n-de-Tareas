import { Router } from 'express';

import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from '../controllers/taskController';

const router = Router();

router.post('/createtask', createTask); // Crear una nueva tarea
router.get('/tasks', getTasks); // Obtener la lista de todas las tareas
router.get('/tasks/:id', getTaskById); // Obtener detalles de una tarea específica
router.put('/tasks/:id', updateTask); // Actualizar una tarea existente
router.delete('/tasks/:id', deleteTask); // Eliminar una tarea

export default router;

