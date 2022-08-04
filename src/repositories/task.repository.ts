import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {MongodDBDataSource} from '../datasources';
import {Project, Task, TaskRelations, User} from '../models';
import {ProjectRepository} from './project.repository';
import {UserRepository} from './user.repository';

export class TaskRepository extends DefaultCrudRepository<
  Task,
  typeof Task.prototype.id,
  TaskRelations
> {

  public readonly link: BelongsToAccessor<Task, typeof Task.prototype.id>;

  public readonly user: BelongsToAccessor<User, typeof Task.prototype.id>;

  public readonly project: BelongsToAccessor<Project, typeof Task.prototype.id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodDBDataSource, @repository.getter('TaskRepository') protected taskRepositoryGetter: Getter<TaskRepository>, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>, @repository.getter('ProjectRepository') protected projectRepositoryGetter: Getter<ProjectRepository>,
  ) {
    super(Task, dataSource);
    this.project = this.createBelongsToAccessorFor('project', projectRepositoryGetter,);
    this.registerInclusionResolver('project', this.project.inclusionResolver);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
    this.link = this.createBelongsToAccessorFor(
      'parent',
      Getter.fromValue(this),
    ); // for recursive relationship
    // this.task = this.createBelongsToAccessorFor('task', taskRepositoryGetter,);
    this.registerInclusionResolver('link', this.link.inclusionResolver);
  }
}
