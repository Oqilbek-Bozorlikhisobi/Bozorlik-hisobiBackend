import { PartialType } from '@nestjs/swagger';
import { CreateBunnerDto } from './create-bunner.dto';

export class UpdateBunnerDto extends PartialType(CreateBunnerDto) {}
