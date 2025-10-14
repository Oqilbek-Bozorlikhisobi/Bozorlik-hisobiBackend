import { HttpException } from "@nestjs/common";

export class NotificationNotFoundException extends HttpException{
    constructor(){
        super('Notification not found', 404)
    }
}