import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {MongodDBDataSource} from '../datasources';
import {User, UserCredentials, UserCredentialsRelations} from '../models';
import {UserRepository} from './user.repository';

export class UserCredentialsRepository extends DefaultCrudRepository<
  UserCredentials,
  typeof UserCredentials.prototype.id,
  UserCredentialsRelations
> {

  public readonly user: BelongsToAccessor<User, typeof UserCredentials.prototype.id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodDBDataSource,
    @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
    @repository.getter('UserCredentialsRepository') protected userCredentialsRepositoryGetter: Getter<UserCredentialsRepository>,
  ) {
    super(UserCredentials, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
