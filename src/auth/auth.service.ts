import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  public async signIn(username: string, password: string) {
    const user = await this.userService.findOne(username, true);

    const isPasswordMatch = await this.comparePassword(password, user.password);

    if (!isPasswordMatch) throw new UnauthorizedException();

    const payload = { sub: user._id, userMail: user.username };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  private async comparePassword(enteredPassword: string, dbPassword: string) {
    return await bcrypt.compare(enteredPassword, dbPassword);
  }
}
