import {Entity, hasMany, model, property} from '@loopback/repository';
import {ProjectUser, ProjectUserWithRelations} from './project-user.model';
import {Task, TaskWithRelations} from './task.model';

@model()
export class User extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  username: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'string',
    required: true,
  })
  fullName: string;

  @property({
    type: 'number',
    required: true,
  })
  age: number;

  @property({
    type: 'string',
    required: true,
  })
  gender: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'boolean',
    default: false,
  })
  isDeleted?: boolean;

  @property({
    type: 'boolean',
    default: false,
  })
  isActive?: boolean;

  @property({
    type: 'date',
    required: true,
  })
  createdAt: string;

  @property({
    type: 'date',
    required: true,
  })
  updatedAt: string;

  @hasMany(() => Task)
  tasks: Task[];

  @hasMany(() => ProjectUser)
  projectUsers: ProjectUser[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
  tasks?: TaskWithRelations[]
  projectUsers?: ProjectUserWithRelations[]
}

export type UserWithRelations = User & UserRelations;
