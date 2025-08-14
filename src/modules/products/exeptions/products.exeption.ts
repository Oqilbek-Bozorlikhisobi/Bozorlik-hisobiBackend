import { HttpException } from "@nestjs/common";

export class ProductNotFoundExeption extends HttpException{
    constructor(){
        super('Product not found', 404)
    }
}

export class FileIsMissinExeption extends HttpException{
    constructor(){
        super('File is missing', 400)
    }
}