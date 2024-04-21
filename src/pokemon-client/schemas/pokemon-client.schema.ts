import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PokemonClientDocument = HydratedDocument<PokemonClient>;

@Schema()
export class PokemonClient {
  @Prop()
  name: string;

  @Prop()
  types: string[];

  @Prop()
  image: string;

  @Prop()
  pokedex: number;
}

export const PokemonClientSchema = SchemaFactory.createForClass(PokemonClient);
