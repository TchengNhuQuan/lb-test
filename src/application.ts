import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import 'dotenv/config';
import path from 'path';
import {MySequence} from './sequence';


import {AuthenticationComponent} from '@loopback/authentication';
import {
  UserServiceBindings
} from '@loopback/authentication-jwt';
import {DbDataSource} from './datasources';
import {JWTAuthenticationComponent} from './services/jwt-component';


export class TodoListApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    this.component(AuthenticationComponent);
    this.component(JWTAuthenticationComponent);
    this.dataSource(DbDataSource, UserServiceBindings.DATASOURCE_NAME);

    // this.bind(TokenServiceBindings.TOKEN_SECRET).to(
    //   TokenServiceConstants.TOKEN_SECRET_VALUE,
    // );
    // this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(
    //   TokenServiceConstants.TOKEN_EXPIRES_IN_VALUE,
    // );
    // this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JWTService);

  }
}

export {ApplicationConfig};

export class GettingStartedApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
