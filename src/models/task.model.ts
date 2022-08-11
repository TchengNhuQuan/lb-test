import {belongsTo, Entity, model, property} from '@loopback/repository';
import {ETaskStatus} from '../enums/task';
import {Project, ProjectWithRelations} from './project.model';
import {User, UserWithRelations} from './user.model';

@model()
export class Task extends Entity {
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
  isCreatedByAdmin: boolean;

  @property({
    type: 'boolean',
    default: false,
  })
  isDeleted?: boolean;

  @property({
    type: 'string',
    jsonSchema: {
      enum: Object.values(ETaskStatus)
    },
  })
  status: ETaskStatus;

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
  userId: string;

  @belongsTo(() => Project)
  projectId: string;

  @belongsTo(() => User, {name: 'creator'})
  createdBy: string;

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
