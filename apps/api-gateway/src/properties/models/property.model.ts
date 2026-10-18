import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Property {
  @Field(() => ID)
  id!: string;

  @Field()
  title!: string;

  @Field()
  location!: string;

  @Field(() => Float)
  pricePerNight!: number;

  @Field(() => Int)
  maxGuests!: number;

  @Field()
  available!: boolean;
}
