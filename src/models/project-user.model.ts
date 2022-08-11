import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Project, ProjectWithRelations} from './project.model';
import {User, UserWithRelations} from './user.model';

@model()
export class ProjectUser extends Entity {
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
  role: string;

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

  @belongsTo(() => User)
  userId: string;

  @belongsTo(() => Project)
  projectId: string;

  constructor(data?: Partial<ProjectUser>) {
    super(data);
  }
}

export interface ProjectUserRelations {
  // describe navigational properties here
  user?: UserWithRelations
  project?: ProjectWithRelations
}

export type ProjectUserWithRelations = ProjectUser & ProjectUserRelations;
