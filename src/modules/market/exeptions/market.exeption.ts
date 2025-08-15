import { HttpException } from "@nestjs/common";

export class MarketNotFoundException extends HttpException{
    constructor(){
        super('Market not found', 404)
    }
}