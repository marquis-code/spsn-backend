import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { ChatMessageDocument } from './schemas/chat-message.schema';
import { CmsService } from '../cms/cms.service';
export declare class ChatService {
    private chatMessageModel;
    private configService;
    private cmsService;
    private knowledgeBase;
    constructor(chatMessageModel: Model<ChatMessageDocument>, configService: ConfigService, cmsService: CmsService);
    private initKnowledgeBase;
    saveMessage(data: {
        roomId: string;
        sender: string;
        senderName?: string;
        senderEmail?: string;
        senderId?: string;
        text: string;
        pageTitle?: string;
        pageUrl?: string;
        attachments?: string[];
        isTransferredToAgent?: boolean;
    }): Promise<ChatMessageDocument>;
    getRoomMessages(roomId: string, limit?: number): Promise<ChatMessageDocument[]>;
    getAllRooms(): Promise<any[]>;
    markRoomAsRead(roomId: string): Promise<void>;
    updateMessageStatus(messageId: string, status: string): Promise<void>;
    rateChatSession(roomId: string, rating: number): Promise<void>;
    getPredefinedResponses(): Promise<any[]>;
    generateAIResponse(message: string): Promise<string>;
    private callGemini;
    private localAIResponse;
}
