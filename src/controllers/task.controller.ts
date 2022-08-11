import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {Count, CountSchema, Filter, FilterExcludingWhere, repository, Where} from '@loopback/repository';
import {del, get, getModelSchemaRef, HttpErrors, param, patch, post, put, requestBody, response} from '@loopback/rest';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {Task} from '../models';
import {TaskRepository} from '../repositories';

@authenticate('jwt')
export class TaskController {
  constructor(
    @repository(TaskRepository)
    public taskRepository : TaskRepository,
  ) {}

  @post('/tasks')
  @response(200, {
    description: 'Task model instance',
    content: {'application/json': {schema: getModelSchemaRef(Task)}},
  })
  async create(
    @inject(SecurityBindings.USER, {optional: true})
    currentUserProfile: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Task, {
            title: 'NewTask',
            exclude: ['id'],
          }),
        },
      },
    })
    task: Omit<Task, 'id'>,
  ): Promise<Task> {
    return this.taskRepository.create({
      ...task,
      createdBy: currentUserProfile.id,
    });
  }

  @get('/tasks/count')
  @response(200, {
    description: 'Task model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Task) where?: Where<Task>,
  ): Promise<Count> {
    return this.taskRepository.count(where);
  }

  @post('/tasks/link/{id}/{id2}')
  @response(200, {
    description: 'Task model instance',
    content: {'application/json': {schema: getModelSchemaRef(Task)}},
  })
  async linkTaskWithTask(
    @param.path.string('id') id: string,
    @param.path.string('id2') id2:string,
  ): Promise<void> {
    const currentProject:Task = await this.taskRepository.findById(id);
    const linkProject:Task = await this.taskRepository.findById(id2);
    if (String(currentProject.projectId) == String(linkProject.projectId)) {
      return this.taskRepository.updateById(id, {linkId: id2});
    } else {
      throw new HttpErrors.Unauthorized("Unable to link task because they not in the same project");
    }
  }

  @get('/tasks')
  @response(200, {
    description: 'Array of Task model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Task, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Task) filter?: Filter<Task>,
  ): Promise<Task[]> {
    return this.taskRepository.find(filter);
  }

  @patch('/tasks')
  @response(200, {
    description: 'Task PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Task, {partial: true}),
        },
      },
    })
    task: Task,
    @param.where(Task) where?: Where<Task>,
  ): Promise<Count> {
    return this.taskRepository.updateAll(task, where);
  }

  @get('/tasks/{id}')
  @response(200, {
    description: 'Task model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Task, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Task, {exclude: 'where'}) filter?: FilterExcludingWhere<Task>
  ): Promise<Task> {
    return this.taskRepository.findById(id, filter);
  }

  @patch('/tasks/{id}')
  @response(204, {
    description: 'Task PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Task, {partial: true}),
        },
      },
    })
    task: Task,
  ): Promise<void> {
    await this.taskRepository.updateById(id, task);
  }

  @put('/tasks/{id}')
  @response(204, {
    description: 'Task PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() task: Task,
  ): Promise<void> {
    await this.taskRepository.replaceById(id, task);
  }

  @del('/tasks/{id}')
  @response(204, {
    description: 'Task DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.taskRepository.deleteById(id);
  }
}
