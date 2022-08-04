import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyRepositoryFactory, repository} from '@loopback/repository';
import {MongodDBDataSource} from '../datasources';
import {ProjectUser, Task, User, UserRelations} from '../models';
import {ProjectUserRepository} from './project-user.repository';
import {TaskRepository} from './task.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {

  public readonly tasks: HasManyRepositoryFactory<Task, typeof User.prototype.id>;

  public readonly projectUsers: HasManyRepositoryFactory<ProjectUser, typeof User.prototype.id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodDBDataSource, @repository.getter('TaskRepository') protected taskRepositoryGetter: Getter<TaskRepository>, @repository.getter('ProjectUserRepository') protected projectUserRepositoryGetter: Getter<ProjectUserRepository>,
  ) {
    super(User, dataSource);
    this.projectUsers = this.createHasManyRepositoryFactoryFor('projectUsers', projectUserRepositoryGetter,);
    this.registerInclusionResolver('projectUsers', this.projectUsers.inclusionResolver);
    this.tasks = this.createHasManyRepositoryFactoryFor('tasks', taskRepositoryGetter,);
    this.registerInclusionResolver('tasks', this.tasks.inclusionResolver);
  }
}
