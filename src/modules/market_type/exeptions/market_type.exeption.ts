import { HttpException } from "@nestjs/common";

export class MarketTypeNotFoundExeption extends HttpException{
    constructor(){
        super('MarketType not found', 404)
    }
}