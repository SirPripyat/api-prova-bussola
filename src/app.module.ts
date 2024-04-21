import {
  MiddlewareConsumer,
  Module,
  NestModule,
  OnModuleInit,
  RequestMethod,
} from '@nestjs/common';
import { PokemonClientModule } from './pokemon-client/pokemon-client.module';
import { PokemonClientService } from './pokemon-client/pokemon-client.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { LoggerMiddleware } from './commons/middlewares/logger.middleware';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/api-prova-bussola'),
    PokemonClientModule,
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements OnModuleInit, NestModule {
  constructor(private readonly pokemonClientService: PokemonClientService) {}

  async onModuleInit() {
    await this.pokemonClientService.onInit();
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
