import {
    Controller,
    Get,
    Post,
    Body,
    UseGuards,
    Param,
} from '@nestjs/common';
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
        return this.messageService.sendMessage(
            sender.id,
            body.receiverId,
            body.content,
        );
    }

    @Get(':userId')
    async getConversation(
        @GetUser() user: User,
        @Param('userId') withUserId: string,
    ) {
        return this.messageService.getConversationBetween(
            user.id,
            parseInt(withUserId),
        );
    }

    @Get()
    async getAllConversations(@GetUser() user: User) {
        return this.messageService.getAllMessagesForUser(user.id);
    }
}
