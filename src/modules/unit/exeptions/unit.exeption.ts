import { HttpException } from "@nestjs/common";

export class UnitNotFoundException extends HttpException{
    constructor(){
        super('Unit not found', 404)
    }
}