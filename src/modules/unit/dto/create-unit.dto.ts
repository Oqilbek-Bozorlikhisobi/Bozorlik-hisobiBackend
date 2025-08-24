import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateUnitDto {
    @ApiProperty({
        description: "Product o'lchov birligi",
        example: "kg"
    })
    @IsString()
    name: string
}
