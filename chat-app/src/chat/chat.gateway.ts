import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    ConnectedSocket,
    MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from 'src/message/message.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection {
    @WebSocketServer()
    server: Server;

    constructor(private readonly messageService: MessageService) { }

    handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
    }

    @SubscribeMessage('send_message')
    async handleSendMessage(
        @ConnectedSocket() client: Socket,
        @MessageBody()
        data: { senderId: number; receiverId: number; content: string },
    ) {
        const saved = await this.messageService.sendMessage(
            data.senderId,
            data.receiverId,
            data.content,
        );

        this.server.emit(`new_message_${data.receiverId}`, saved);
        return saved;
    }
}
