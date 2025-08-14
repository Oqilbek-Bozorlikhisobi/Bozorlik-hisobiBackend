import { HttpException, HttpStatus } from '@nestjs/common';

export class EmailOrPasswordIncorrect extends HttpException {
  constructor() {
    super('Login or password is wrong!', 401);
  }
}

export class RefreshTokenIsMissingExeption extends HttpException {
  constructor() {
    super('Refresh token is missing', 401);
  }
}

export class InvalidRefreshToken extends HttpException {
  constructor() {
    super('Invalid refresh token', 401);
  }
}

export class PhoneNumberOrPasswordIncorrect extends HttpException {
  constructor() {
    super('Phone number or password is wrong!', 401);
  }
}


export class OtpDidntSend extends HttpException {
  constructor() {
    super('Otp did not send', 400);
  }
}