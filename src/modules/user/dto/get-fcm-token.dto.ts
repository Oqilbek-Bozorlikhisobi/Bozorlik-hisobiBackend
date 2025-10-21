import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class GetFcmTokenDto {
  @ApiProperty({
    description: 'fcmToken firebase uchun',
    required: true,
    type: String
  })
  @IsOptional()
  @IsString()
  fcmToken?: string;
}