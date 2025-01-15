import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { TaskStatus } from './enum/task-status.enum';

@Injectable()
export class TaskService {

  constructor(
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>
  ){}

  async create(user:User, createTaskDto: CreateTaskDto): Promise<Task> {
    const newTask = this.taskRepository.create({...createTaskDto, user});
    return await this.taskRepository.save(newTask);
  }

  async findAll(userId: number, status?: TaskStatus): Promise<Task[]> {

    const whereClause: any = { user: { id: userId } };

    // If status is provided, add it to the filter
    if (status) {
      whereClause.status = status;
    }

    // Fetch tasks based on the constructed filter
    return await this.taskRepository.find({ where: whereClause });
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto, userId: number): Promise<Task> {
        // Find the task by ID
        const task = await this.taskRepository.findOne({
          where: { id },
          relations: ['user'], // Include user to check ownership
        });
    
        if (!task) {
          throw new NotFoundException(`Task with ID ${id} not found`);
        }
        // Check if the logged-in user is the owner of the task
        if (task.user.id !== userId) {
          throw new ForbiddenException('You can only update tasks you have created');
        }
    
        // Update the task with the provided data
        const updatedTask = Object.assign(task, updateTaskDto);
        return this.taskRepository.save(updatedTask);
  }

  async remove(userId: number, id: number): Promise<void> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  
    // Check if the task exists
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  
    // Check if the task belongs to the user
    if (task.user.id !== userId) {
      throw new ForbiddenException('You can only delete tasks you have created');
    }
  
    // Delete the task
    await this.taskRepository.delete(id);
  }
  
}
