import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { MessageService } from './message.service';
import { User } from '../user/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Message, User])],
    providers: [MessageService],
    exports: [MessageService],
})
export class MessageModule { }
