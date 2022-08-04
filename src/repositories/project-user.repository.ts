import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {MongodDBDataSource} from '../datasources';
import {Project, ProjectUser, ProjectUserRelations, User} from '../models';
import {ProjectRepository} from './project.repository';
import {UserRepository} from './user.repository';

export class ProjectUserRepository extends DefaultCrudRepository<
  ProjectUser,
  typeof ProjectUser.prototype.id,
  ProjectUserRelations
> {

  public readonly user: BelongsToAccessor<User, typeof ProjectUser.prototype.id>;

  public readonly project: BelongsToAccessor<Project, typeof ProjectUser.prototype.id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodDBDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>, @repository.getter('ProjectRepository') protected projectRepositoryGetter: Getter<ProjectRepository>,
  ) {
    super(ProjectUser, dataSource);
    this.project = this.createBelongsToAccessorFor('project', projectRepositoryGetter,);
    this.registerInclusionResolver('project', this.project.inclusionResolver);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
