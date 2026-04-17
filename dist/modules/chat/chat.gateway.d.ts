import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
export declare class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly chatService;
    server: Server;
    private adminSockets;
    private userRooms;
    constructor(chatService: ChatService);
    afterInit(server: Server): void;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleAdminJoin(client: Socket): Promise<void>;
    handleUserJoin(client: Socket, payload: {
        roomId: string;
        userName?: string;
        email?: string;
    }): Promise<void>;
    handleTrackPage(client: Socket, payload: {
        roomId: string;
        pageTitle: string;
        pageUrl: string;
    }): Promise<void>;
    handleAdminJoinRoom(client: Socket, payload: {
        roomId: string;
    }): Promise<void>;
    handleMessage(client: Socket, payload: {
        roomId: string;
        message: string;
        userName?: string;
        email?: string;
        pageTitle?: string;
        pageUrl?: string;
        attachments?: string[];
    }): Promise<void>;
    handleAdminReply(client: Socket, payload: {
        roomId: string;
        message: string;
        adminName?: string;
        attachments?: string[];
    }): Promise<void>;
    handleMessageRead(client: Socket, payload: {
        messageId: string;
        roomId: string;
    }): Promise<void>;
    handleGetPredefinedResponses(client: Socket): Promise<void>;
    handleRequestTransfer(client: Socket, payload: {
        roomId: string;
    }): Promise<void>;
    handleAgentAcceptedTransfer(client: Socket, payload: {
        roomId: string;
        adminName?: string;
    }): Promise<void>;
    handleRateChatSession(client: Socket, payload: {
        roomId: string;
        rating: number;
    }): Promise<void>;
}
