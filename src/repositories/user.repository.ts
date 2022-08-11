import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyRepositoryFactory, repository, HasOneRepositoryFactory} from '@loopback/repository';
import {MongodDBDataSource} from '../datasources';
import {ProjectUser, Task, User, UserRelations, UserCredentials} from '../models';
import {ProjectUserRepository} from './project-user.repository';
import {TaskRepository} from './task.repository';
import {UserCredentialsRepository} from './user-credentials.repository';

export type Credentials = {
  email: string;
  password: string;
};

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {

  public readonly tasks: HasManyRepositoryFactory<Task, typeof User.prototype.id>;

  public readonly projectUsers: HasManyRepositoryFactory<ProjectUser, typeof User.prototype.id>;

  public readonly userCredentials: HasOneRepositoryFactory<UserCredentials,typeof User.prototype.id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodDBDataSource,
    @repository.getter('TaskRepository')
    protected taskRepositoryGetter: Getter<TaskRepository>,
    @repository.getter('ProjectUserRepository')
    protected projectUserRepositoryGetter: Getter<ProjectUserRepository>,
    @repository.getter('UserCredentialsRepository')
    protected userCredentialsRepositoryGetter: Getter<UserCredentialsRepository>,
  ) {
    super(User, dataSource);
    this.projectUsers = this.createHasManyRepositoryFactoryFor('projectUsers', projectUserRepositoryGetter,);
    this.registerInclusionResolver('projectUsers', this.projectUsers.inclusionResolver);
    this.tasks = this.createHasManyRepositoryFactoryFor('tasks', taskRepositoryGetter,);
    this.registerInclusionResolver('tasks', this.tasks.inclusionResolver);
    this.userCredentials = this.createHasOneRepositoryFactoryFor(
      'userCredentials',
      userCredentialsRepositoryGetter,
    );
  }

  async findCredentials(
    userId: typeof User.prototype.id,
  ): Promise<UserCredentials | undefined> {
    try {
      return await this.userCredentials(userId).get();
    } catch (err) {
      if (err.code === 'ENTITY_NOT_FOUND') {
        return undefined;
      }
      throw err;
    }
  }
}
