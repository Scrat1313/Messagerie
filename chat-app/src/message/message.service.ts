import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { User } from '../user/user.entity';

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(Message)
        private readonly messageRepo: Repository<Message>,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) { }

    async sendMessage(senderId: number, receiverId: number, content: string) {
        const sender = await this.userRepo.findOneBy({ id: senderId });
        const receiver = await this.userRepo.findOneBy({ id: receiverId });

        if (!sender || !receiver) {
            throw new Error('Sender or receiver not found');
        }

        const message = this.messageRepo.create({
            content,
            sender: { id: sender.id },
            receiver: { id: receiver.id },
        });

        return this.messageRepo.save(message);
    }

    async getConversationBetween(userId1: number, userId2: number) {
        return this.messageRepo.find({
            where: [
                { sender: { id: userId1 }, receiver: { id: userId2 } },
                { sender: { id: userId2 }, receiver: { id: userId1 } },
            ],
            relations: ['sender', 'receiver'],
            order: { timestamp: 'ASC' },
        });
    }
}
