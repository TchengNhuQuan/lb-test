import {Entity, hasMany, model, property, hasOne} from '@loopback/repository';
import {ProjectUser, ProjectUserWithRelations} from './project-user.model';
import {Task, TaskWithRelations} from './task.model';
import {UserCredentialsWithRelations, UserCredentials} from './user-credentials.model';

@model()
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id: string;

  @property({
    type: 'string',
  })
  username: string;

  @property({
    type: 'string',
  })
  fullName: string;

  @property({
    type: 'number',
  })
  age: number;

  @property({
    type: 'string',
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
    default: new Date()
  })
  createdAt?: Date;

  @property({
    type: 'date',
    default: new Date()
  })
  updatedAt?: Date;

  @hasMany(() => Task)
  tasks: Task[];

  @hasMany(() => ProjectUser)
  projectUsers: ProjectUser[];

  @hasOne(() => UserCredentials)
  userCredentials: UserCredentials;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
  tasks?: TaskWithRelations[]
  projectUsers?: ProjectUserWithRelations[]
  userCredentials?: UserCredentialsWithRelations
}

export type UserWithRelations = User & UserRelations;
