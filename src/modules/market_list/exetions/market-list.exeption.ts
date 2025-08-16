import { HttpException } from '@nestjs/common';

export class MarketListNotFoundExeption extends HttpException {
  constructor() {
    super('MarketList not found', 404);
  }
}
