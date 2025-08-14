import { HttpException, HttpStatus } from '@nestjs/common';

export class AdminNotFound extends HttpException {
  constructor() {
    super('Admin not found', HttpStatus.NOT_FOUND);
  }
}

export class AdminAlreadyExists extends HttpException {
  constructor() {
    super('Admin already exists', 409);
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