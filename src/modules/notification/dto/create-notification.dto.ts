import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({
    description: 'Notification title in English',
    example: 'New invitation to market',
  })
  @IsString()
  titleEn: string;

  @ApiProperty({
    description: 'Notification title in Russian',
    example: 'Новое приглашение в маркет',
  })
  @IsString()
  titleRu: string;

  @ApiProperty({
    description: 'Notification title in Uzbek (Latin)',
    example: 'Marketga yangi taklif',
  })
  @IsString()
  titleUz: string;

  @ApiProperty({
    description: 'Notification title in Uzbek (Cyrillic)',
    example: 'Маркетга янги таклиф',
  })
  @IsString()
  titleUzk: string;

  @ApiProperty({
    description: 'Notification message in English',
    example: 'You have been invited to join the market "SuperMart".',
  })
  @IsString()
  messageEn: string;

  @ApiProperty({
    description: 'Notification message in Russian',
    example: 'Вас пригласили присоединиться к маркету "SuperMart".',
  })
  @IsString()
  messageRu: string;

  @ApiProperty({
    description: 'Notification message in Uzbek (Latin)',
    example: 'Sizni "SuperMart" marketiga taklif qilishdi.',
  })
  @IsString()
  messageUz: string;

  @ApiProperty({
    description: 'Notification message in Uzbek (Cyrillic)',
    example: 'Сизни "SuperMart" маркетига таклиф қилишди.',
  })
  @IsString()
  messageUzk: string;
}
