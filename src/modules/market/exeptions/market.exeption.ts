import { HttpException } from '@nestjs/common';

export class MarketNotFoundException extends HttpException {
  constructor() {
    super('Market not found', 404);
  }
}

export class OfferNotFoundException extends HttpException {
  constructor() {
    super('Taklif topilmadi', 404);
  }
}