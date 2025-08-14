import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateAdminDto {
    @ApiProperty({
        description: "admin unique login",
        required: true,
        type: String,
        example: "admin"
    })
    @IsString()
    login: string;

    @ApiProperty({
        description: "admin password",
        required: true,
        type: String,
        example: "admin"
    })
    @IsString()
    password: string;

    @ApiProperty({
        description: "admin confirm password",
        required: true,
        type: String,
        example:'admin'
    })
    @IsString()
    confirmPassword: string;
}
