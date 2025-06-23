import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { User } from '../user/user.entity';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessageController {
    constructor(private readonly messageService: MessageService) { }

    @Post()
    async send(
        @GetUser() sender: User,
        @Body() body: { receiverId: number; content: string },
    ) {
        return this.messageService.sendMessage(sender.id, body.receiverId, body.content);
    }

    @Get('conversation')
    async getConversation(
        @GetUser() user: User,
        @Body() body: { withUserId: number },
    ) {
        return this.messageService.getConversation(user.id, body.withUserId);
    }

    
}
