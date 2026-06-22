import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Max, Min } from 'class-validator';

export class PresignDto {
  @ApiProperty({ example: 'image/vnd.adobe.photoshop' })
  @IsString()
  mimeType!: string;

  @ApiProperty({ example: 10485760 })
  @IsInt()
  @Min(1)
  @Max(500_000_000)
  byteSize!: number;
}
