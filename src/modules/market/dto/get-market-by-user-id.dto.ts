import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsUUID } from "class-validator";

export class GetMarketByUserIdDto {
    @ApiProperty({
        description: "User id bo'yicha barchasini olish",
        example: "550e8400-e29b-41d4-a716-446655440000"
    })
    @IsOptional()
    @IsString()
    @IsUUID()
    search: string;
}