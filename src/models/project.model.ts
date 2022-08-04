import {Entity, model, property, hasMany} from '@loopback/repository';
import {Task, TaskWithRelations} from './task.model';
import {ProjectUser, ProjectUserWithRelations} from './project-user.model';

@model()
export class Project extends Entity {
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
    type: 'boolean',
    required: true,
  })
  updatedAt: boolean;

  @hasMany(() => Task)
  tasks: Task[];

  @hasMany(() => ProjectUser)
  projectUsers: ProjectUser[];

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
