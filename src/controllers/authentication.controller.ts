import {Credentials} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {getModelSchemaRef, post, requestBody, SchemaObject} from '@loopback/rest';
import {SecurityBindings, UserProfile} from '@loopback/security';
import _ from 'lodash';
import {PasswordHasherBindings, TokenServiceBindings, UserServiceBindings} from '../keys';
import {User, UserCredentials} from '../models';
import {UserRepository} from '../repositories';
import {BcryptHasher, JWTService} from '../services';
import {MyUserService} from '../services/user.service';
import {validateCredentials} from '../services/validator.service';

const CredentialsSchema: SchemaObject = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 8,
    },
  },
};

export const CredentialsRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {schema: CredentialsSchema},
  },
};

export class AuthController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: JWTService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,
    @inject(SecurityBindings.USER, {optional: true})
    public user: UserProfile,
    @repository(UserRepository) protected userRepository: UserRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public hasher: BcryptHasher
  ) {}

  @post('/auth/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })

  async login(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<{token: string}> {
    const user = await this.userService.verifyCredentials(credentials);
    const userProfile = this.userService.convertToUserProfile(user);
    const token = await this.jwtService.generateToken(userProfile);
    return Promise.resolve({token: token})
  }

  @post('/auth/signup', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema:
              getModelSchemaRef(User, {
                title:'NewUser',
             })
            ,
          },
        },
      },
    },
  })

  async signUp(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserCredentials, {
            exclude: ['id', 'createdAt', 'updatedAt', 'userId'],
          }),
        },
      },
    })
    userData: Omit<UserCredentials, 'id'>,
  ) {
    await validateCredentials(
      _.pick(userData, ['email', 'password']),
      this.userRepository
    );
    const hashedPassword = await this.hasher.hashPassword(userData.password)
    const newUser = await this.userRepository.create({
      email: userData.email,
    });
    await this.userRepository.userCredentials(newUser?.id).create({
      email: userData.email,
      password: hashedPassword,
    });
    return newUser;
  }
}
