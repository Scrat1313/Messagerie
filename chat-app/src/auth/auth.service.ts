import {
    Injectable,
    UnauthorizedException,
    ConflictException,
    NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../user/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        private readonly jwtService: JwtService,
    ) { }

    async register(dto: RegisterDto) {
        const existing = await this.userRepo.findOneBy({ username: dto.username });
        if (existing) throw new ConflictException('Username already taken');

        const hashed = await bcrypt.hash(dto.password, 10);
        const user = this.userRepo.create({ username: dto.username, password: hashed });
        await this.userRepo.save(user);

        return { message: 'User registered successfully' };
    }

    async login(dto: LoginDto) {
        const user = await this.userRepo.findOneBy({ username: dto.username });
        if (!user) throw new UnauthorizedException('Invalid credentials');

        const passwordValid = await bcrypt.compare(dto.password, user.password);
        if (!passwordValid) throw new UnauthorizedException('Invalid credentials');

        const payload = { sub: user.id, username: user.username };
        const token = await this.jwtService.signAsync(payload);

        return { access_token: token };
    }

    async validateUser(userId: number): Promise<User> {
        const user = await this.userRepo.findOneBy({ id: userId });
        if (!user) throw new NotFoundException('User not found');
        return user;
    }
}
