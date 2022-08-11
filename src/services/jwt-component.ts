import {registerAuthenticationStrategy} from '@loopback/authentication';
import {Application, Binding, Component, CoreBindings, inject} from '@loopback/core';
import {PasswordHasherBindings, TokenServiceBindings, UserServiceBindings} from '../keys';
import {JWTStrategy} from './authentication.service';
import {BcryptHasher} from './hash.password.bcryptjs.service';
import {JWTService} from './jwt.service';
import {MyUserService} from './user.service';

export class JWTAuthenticationComponent implements Component {

  bindings: Binding[] = [
    Binding.bind(UserServiceBindings.USER_SERVICE).toClass(MyUserService),
    Binding.bind(PasswordHasherBindings.PASSWORD_HASHER).toClass(BcryptHasher),
    Binding.bind(PasswordHasherBindings.ROUNDS).to(10),
    Binding.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JWTService),
    Binding.bind(TokenServiceBindings.TOKEN_SECRET).to(
      process.env.JWT_SECRET_VALUE ?? 'todo123@@',
    ),
    Binding.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(
      process.env.JWT_EXPIRES_IN_VALUE ?? '24h',
    ),
  ];

  constructor(@inject(CoreBindings.APPLICATION_INSTANCE) app: Application) {
    registerAuthenticationStrategy(app, JWTStrategy);
  }
}
