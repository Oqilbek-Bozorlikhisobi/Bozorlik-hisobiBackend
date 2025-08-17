import { HttpException } from "@nestjs/common";

export class HistoryNotFoundException extends HttpException{
    constructor(){
        super('History not found', 404)
    }
}

export class AllNotBuyingExption extends HttpException{
    constructor(){
        super('All market lists are not buying', 400)
    }
}