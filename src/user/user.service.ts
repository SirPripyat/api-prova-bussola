import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { SALT_OR_ROUNDS } from '../constants/salt-or-rounds.constant';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  public async create(createUserDto: CreateUserDto) {
    createUserDto.password = await this.generatePasswordHash(
      createUserDto.password,
    );

    createUserDto.active = true;

    return this.userModel.create(createUserDto);
  }

  public findAll() {
    return this.userModel.find().select('-password').exec();
  }

  public async findOne(username: string, bringPassword: boolean = false) {
    const showPassword = bringPassword ? '' : '-password';

    return await this.userModel
      .findOne({ username })
      .select(showPassword)
      .exec();
  }

  public async update(username: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findOneAndUpdate({ username }, updateUserDto).exec();
  }

  public async remove(username: string) {
    const user = await this.findOne(username);
    return await this.update(username, { active: !user.active });
  }

  private async generatePasswordHash(password: string) {
    return await bcrypt.hash(password, SALT_OR_ROUNDS);
  }
}
