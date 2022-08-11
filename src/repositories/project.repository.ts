import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyRepositoryFactory, repository} from '@loopback/repository';
import {MongodDBDataSource} from '../datasources';
import {Project, ProjectRelations, ProjectUser, Task} from '../models';
import {ProjectUserRepository} from './project-user.repository';
import {TaskRepository} from './task.repository';

export class ProjectRepository extends DefaultCrudRepository<
  Project,
  typeof Project.prototype.id,
  ProjectRelations
> {

  public readonly task: HasManyRepositoryFactory<Task, typeof Project.prototype.id>;

  public readonly projectUsers: HasManyRepositoryFactory<ProjectUser, typeof Project.prototype.id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodDBDataSource,
    @repository.getter('TaskRepository')
    protected taskRepositoryGetter: Getter<TaskRepository>,
    @repository.getter('ProjectUserRepository')
    protected projectUserRepositoryGetter: Getter<ProjectUserRepository>,
  ) {
    super(Project, dataSource);
  }
}
