import { HttpException } from '@nestjs/common';

export class MarketTypeNotFoundExeption extends HttpException {
  constructor() {
    super('MarketType not found', 404);
  }
}

export class FileIsMissinExeption extends HttpException {
  constructor() {
    super('File is Missing', 404);
  }
}
