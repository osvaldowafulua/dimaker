import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsUrl,
  IsUUID,
  ValidateNested,
} from 'class-validator';

class CheckoutItemDto {
  @ApiProperty()
  @IsUUID()
  assetId!: string;

  @ApiProperty()
  @IsUUID()
  assetVersionId!: string;

  @ApiProperty()
  @IsUUID()
  licenseTypeId!: string;
}

export class CreateCheckoutDto {
  @ApiProperty({ type: [CheckoutItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CheckoutItemDto)
  items!: CheckoutItemDto[];

  @ApiProperty()
  @IsUrl()
  successUrl!: string;

  @ApiProperty()
  @IsUrl()
  cancelUrl!: string;
}
