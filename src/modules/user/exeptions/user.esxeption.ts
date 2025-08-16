import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFound extends HttpException {
  constructor() {
    super('User not found', HttpStatus.NOT_FOUND);
  }
}

export class UserAlreadyExists extends HttpException {
  constructor() {
    super('User already exists', 409);
  }
}

export class PassworsDontMatch extends HttpException {

  constructor() {
    super('Passwords do not match', HttpStatus.BAD_REQUEST);
  }
}

export class PasswordOrconfirmPassowrdDidntExists extends HttpException {
  constructor() {
    super('Password or confirmPassword did not exists', HttpStatus.BAD_REQUEST);
  }
}

export class SmsNotSendedExeption extends HttpException {
  constructor() {
    super('Sms not sended', HttpStatus.BAD_REQUEST);
  }
}