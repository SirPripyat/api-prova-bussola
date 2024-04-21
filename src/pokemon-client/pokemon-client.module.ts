import { Module } from '@nestjs/common';
import { PokemonClientService } from './pokemon-client.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PokemonClient,
  PokemonClientSchema,
} from './schemas/pokemon-client.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: PokemonClient.name,
        schema: PokemonClientSchema,
      },
    ]),
  ],
  exports: [PokemonClientService],
  providers: [PokemonClientService],
})
export class PokemonClientModule {}
