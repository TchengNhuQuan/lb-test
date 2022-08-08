import {Credentials} from '@loopback/authentication-jwt';
import {HttpErrors} from '@loopback/rest';
import isemail from 'isemail';
import {UserRepository} from "../repositories/user.repository";

export async function validateCredentials(credentials: Credentials, userRepository: UserRepository) {
  if (!isemail.validate(credentials.email)) {
    throw new HttpErrors.UnprocessableEntity('invalid email');
  }

  const user = await userRepository.findOne({
    where: {
      email: credentials.email
    }
  });

  if (user !== null) {
    throw new HttpErrors.UnprocessableEntity('email existed');
  }

  if (credentials.email.length < 8) {
    throw new HttpErrors.UnprocessableEntity('email length should be greater than 8');
  }

  if (credentials.password.length < 8) {
    throw new HttpErrors.UnprocessableEntity('password length should be greater than 8');
  }
}


