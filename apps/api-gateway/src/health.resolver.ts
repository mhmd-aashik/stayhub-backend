import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class HealthResolver {
  @Query(() => String)
  health(): string {
    return 'StayHub GraphQL Gateway is running!';
  }
}
