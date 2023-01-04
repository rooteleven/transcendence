import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import * as argon from 'argon2'
import { AuthDto } from "./dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { JwtService } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
	constructor(private prisma: PrismaService,
				private jwt: JwtService,
				private config: ConfigService) {
	}

	async signup(dto: AuthDto) {
		const hash = await argon.hash(dto.password);
		try {
			const user = await this.prisma.user.create({
				data : {
					email: dto.email,
					hash,
				},
			});
			return this.signToken(user.id, user.email);
		}
		catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2002') {
					throw new ForbiddenException(
						'Credentials taken',
					);
				}
			}
			throw error;
		}
	}

	async signin(dto: AuthDto) {
		const user = await this.prisma.user.findUnique({
			where: {
				email: dto.email,
			},
		});
		if (!user) {
			throw new ForbiddenException(
				'Credentials incorrect',
			);
		}
		const pwMatches = await argon.verify(user.hash, dto.password);
		if (!pwMatches) {
			throw new ForbiddenException(
				'Credentials incorrect',
			)
		}
		return this.signToken(user.id, user.email);
	}

	/* JWTs are often used to authenticate users.
	When a user logs in, the server creates a JWT that contains user data (such as the user's ID, email, and other information) and signs it.
	The JWT is then sent back to the user's computer, where it is stored locally (typically in a browser cookie).
	From then on, whenever the user makes a request to the server, the JWT is included in the request header.
	The server can then verify the JWT and determine that the user is authenticated.*/

	async signToken(userId: number,
				email: string) : Promise<{ access_token: string }>{
		const payload = {
			sub: userId,
			email,
		};
		const secret = this.config.get('JWT_SECRET');
		const token = await this.jwt.signAsync(payload, {
			expiresIn: '15m',
			secret: secret,
		});
		return {
			access_token: token,
		}
	}
}