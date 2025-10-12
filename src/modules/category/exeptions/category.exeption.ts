import { HttpException } from "@nestjs/common";

export class CategoryNotFoundException extends HttpException{
    constructor(){
        super('Category not found', 404)
    }
}

export class CategoryCannotBeOwnParentException extends HttpException{
    constructor(){
        super('Category cannot be its own parent', 400);
    }
}