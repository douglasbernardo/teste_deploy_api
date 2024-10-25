import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  private readonly client: OAuth2Client;
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {
    this.client = new OAuth2Client(
      '335638704279-dg7t8s2qnmrogjkj3lkfo6jbfste7417.apps.googleusercontent.com',
    );
  }

  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.userService.find_user(username);
    if (!user) {
      throw new UnauthorizedException('E-mail não encontrado');
    }
    const passwordIsValid = bcrypt.compareSync(pass, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('A senha digitada é inválida');
    }
    return {
      user,
      access_token: await this.jwtService.signAsync({
        sub: user.email,
        username: user.name,
      }),
    };
  }
  async verify_google_token(access_token: string) {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: access_token,
        audience:
          '335638704279-dg7t8s2qnmrogjkj3lkfo6jbfste7417.apps.googleusercontent.com',
      });
      const payload = ticket.getPayload();

      const user = await this.userService.find_user(payload.email);
      if (!user) {
        return this.userService.add_user({
          name: payload.name,
          email: payload.email,
          fromGoogle: true,
          googlePicture: payload.picture,
        });
      }
      return {
        user: {
          name: payload.name,
          email: payload.email,
        },
        access_token: await this.jwtService.signAsync({
          sub: payload.email,
          username: payload.name,
        }),
      };
    } catch (error) {
      console.log(error);
    }
  }
  async signIn_google() {}
}
