import { Injectable } from '@nestjs/common';
import { POKEMON_BASE_URL } from '../constants/pokemon-base-url.constant';
import { POKEMON_LIMIT } from '../constants/pokemon-limit.constant';
import { IAllPokemonsApiDto } from './interfaces/all-pokemons-api-dto.interface';
import { IPokemonApiDto } from './interfaces/pokemon-api-dto.interface';
import { InjectModel } from '@nestjs/mongoose';
import { PokemonClient } from './schemas/pokemon-client.schema';
import { Model } from 'mongoose';
import { IPokemon } from '../interfaces/pokemon.interface';

@Injectable()
export class PokemonClientService {
  constructor(
    @InjectModel(PokemonClient.name)
    private pokemonClientModel: Model<PokemonClient>,
  ) {}

  public async onInit() {
    return await this.createPokemonBaseData();
  }

  private async createPokemonBaseData() {
    const pokemonDataExists = await this.checkIfPokemonDataExists();

    if (pokemonDataExists) return;

    const urlRequest: string = `${POKEMON_BASE_URL}/pokemon?limit=${POKEMON_LIMIT}&offset=0`;

    const response = await fetch(urlRequest);
    const data: IAllPokemonsApiDto = await response.json();

    const pokemonUrls = this.getAllPokemonUrls(data);
    const pokemonData = await this.getAllPokemonData(pokemonUrls);

    const createdPokemons = await Promise.all(
      pokemonData.map(async (pokemon) => {
        const newPokemon = new this.pokemonClientModel(pokemon);
        return await newPokemon.save();
      }),
    );

    return createdPokemons;
  }

  private async checkIfPokemonDataExists() {
    const pokemonData = await this.pokemonClientModel.find();
    return pokemonData.length > 0;
  }

  private getAllPokemonUrls({ results }: IAllPokemonsApiDto): string[] {
    return results.map(({ url }) => url);
  }

  private async getAllPokemonData(urlList: string[]): Promise<IPokemon[]> {
    const pokemonData = urlList.map(
      async (url) => await this.makePokemonUrlRequest(url),
    );

    return await Promise.all(pokemonData);
  }

  private async makePokemonUrlRequest(url: string): Promise<IPokemon> {
    const response = await fetch(url);
    const data: IPokemonApiDto = await response.json();

    return this.buildPokemonData(data);
  }

  private buildPokemonData({
    name,
    types,
    sprites,
    id,
  }: IPokemonApiDto): IPokemon {
    const getTypes = this.buildPokemonTypes(types);
    const image = this.buildPokemonImage(sprites);

    const pokemonData: IPokemon = {
      name,
      types: getTypes,
      pokedex: id,
      image,
    };

    return pokemonData;
  }

  private buildPokemonTypes(types: IPokemonApiDto['types']): string[] {
    return types.map(({ type }) => type.name);
  }

  private buildPokemonImage(sprites: IPokemonApiDto['sprites']): string {
    return sprites.other['official-artwork'].front_default;
  }
}
