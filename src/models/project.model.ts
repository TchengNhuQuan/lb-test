import {Entity, hasMany, model, property} from '@loopback/repository';
import {ProjectUser, ProjectUserWithRelations} from './project-user.model';
import {Task, TaskWithRelations} from './task.model';

@model()
export class Project extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  nameProject: string;

  @property({
    type: 'string',
    required: true,
  })
  description: string;

  @property({
    type: 'string',
    required: true,
  })
  status: string;

  @property({
    type: 'boolean',
    default: false,
  })
  isDeleted?: boolean;

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

  @hasMany(() => ProjectUser)
  projectUsers: ProjectUser[];

  @hasMany(() => Task)
  tasks: Task[];

  constructor(data?: Partial<Project>) {
    super(data);
  }
}

export interface ProjectRelations {
  // describe navigational properties here
  tasks?: TaskWithRelations[]
  projectUsers?: ProjectUserWithRelations[]
}

export type ProjectWithRelations = Project & ProjectRelations;
