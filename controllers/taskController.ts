import { Request, Response } from 'express';
import Task, { TaskDocument } from '../models/tareas';
import User, { IUser } from '../models/user';

export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, assignedTo, dueDate, completed } = req.body;

    // Buscar el usuario por su nombre para obtener su ID
    const user = await User.findOne({ username: assignedTo });

    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }

    const newTask: TaskDocument = await Task.create({
      title,
      description,
      assignedTo: user._id, // Asignar el ID del usuario encontrado
      dueDate,
      completed,
    });

    res.status(201).json(newTask);
  } catch (error: any) {
    console.error('Error al crear la tarea:', error.message);
    res.status(500).json({ error: 'Error al crear la tarea' });
  }
};

export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const tasks: TaskDocument[] = await Task.find().populate('assignedTo').exec();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las tareas' });
  }
};

export const getTaskById = async (req: Request, res: Response): Promise<void> => {
  try {
    const taskId: string = req.params.id;
    const task: TaskDocument | null = await Task.findById(taskId).populate('assignedTo').exec();

    if (!task) {
      res.status(404).json({ error: 'Tarea no encontrada' });
      return;
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la tarea' });
  }
};

export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const taskId: string = req.params.id;
    const { title, description, assignedTo, dueDate, completed } = req.body;
    const updatedTask: TaskDocument | null = await Task.findByIdAndUpdate(
      taskId,
      { title, description, assignedTo, dueDate, completed },
      { new: true }
    );

    if (!updatedTask) {
      res.status(404).json({ message: 'Tarea no encontrada' });
      return;
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la tarea' });
  }
};

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const taskId: string = req.params.id;
    const deletedTask = await Task.findByIdAndDelete(taskId).lean().exec();

    if (!deletedTask) {
      res.status(404).json({ message: 'Tarea no encontrada' });
      return;
    }

    res.status(200).json({ message: 'Tarea eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la tarea' });
  }
};
