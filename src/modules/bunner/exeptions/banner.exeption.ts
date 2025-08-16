import { HttpException } from '@nestjs/common';

export class BunnerNotFoundException extends HttpException {
  constructor() {
    super('Bunner not found', 404);
  }
}
