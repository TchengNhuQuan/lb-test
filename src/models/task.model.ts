import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Project, ProjectWithRelations} from './project.model';
import {User, UserWithRelations} from './user.model';

@model()
export class Task extends Entity {
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
  createdBy: string;

  @property({
    type: 'string',
    required: true,
  })
  assignedTo: string;

  @property({
    type: 'string',
    required: true,
  })
  projectID: string;

  @property({
    type: 'string',
    required: true,
  })
  linkedTaskId: string;

  @property({
    type: 'string',
    required: true,
  })
  taskName: string;

  @property({
    type: 'string',
    required: true,
  })
  description: string;

  @property({
    type: 'boolean',
    default: false,
  })
  isDeleted?: boolean;

  @property({
    type: 'string',
    required: true,
  })
  status: string;

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

  @belongsTo(() => Task, {name: 'link'})
  linkId: string;

  @belongsTo(() => User)
  userId: number;

  @belongsTo(() => Project)
  projectId: number;

  constructor(data?: Partial<Task>) {
    super(data);
  }
}

export interface TaskRelations {
  // describe navigational properties here
  user?: UserWithRelations
  project?: ProjectWithRelations
  link?: TaskWithRelations
}

export type TaskWithRelations = Task & TaskRelations;
