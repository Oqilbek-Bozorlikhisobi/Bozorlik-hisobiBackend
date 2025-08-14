import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class LoginAdminDto {
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
}
