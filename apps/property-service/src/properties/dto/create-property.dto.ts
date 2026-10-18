import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsNumber,
  IsInt,
  Min,
  IsOptional,
} from 'class-validator';

export class CreatePropertyDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  city!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  country!: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsNumber({
    maxDecimalPlaces: 2,
    allowNaN: false,
    allowInfinity: false,
  })
  @Min(0.01)
  pricePerNight!: number;

  @IsInt()
  @Min(1)
  maxGuests!: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  bedrooms?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  bathrooms?: number;
}
