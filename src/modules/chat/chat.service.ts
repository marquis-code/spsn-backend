import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { ChatMessage, ChatMessageDocument } from './schemas/chat-message.schema';
import { CmsService } from '../cms/cms.service';

@Injectable()
export class ChatService {
  private knowledgeBase: string[] = [];

  constructor(
    @InjectModel(ChatMessage.name) private chatMessageModel: Model<ChatMessageDocument>,
    private configService: ConfigService,
    private cmsService: CmsService,
  ) {
    this.initKnowledgeBase();
  }

  private initKnowledgeBase() {
    this.knowledgeBase = [
      'SCPSN stands for Society for Cellular Pathology Scientists of Nigeria.',
      'SCPSN focuses on Histopathology and Cytopathology.',
      'Members can register through the Member Portal at the registration page.',
      'Membership categories include: Student, Associate, Full, and Fellow.',
      'The society organizes conferences, seminars, and webinars for professional development.',
      'Members can submit scientific abstracts through the Abstract Portal.',
      'Payment can be made in both NGN (Nigerian Naira) and USD.',
      'For membership enquiries, visit the Contact page or use this chat.',
      'The Digital Library provides access to scientific journals and newsletters.',
      'Conference schedules and details are available on the Conferences page.',
      'Member registration requires document uploads: Passport, Qualification, License, CV.',
      'Membership renewal dates and status can be checked on the Member Dashboard.',
    ];
  }

  async saveMessage(data: {
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
  }): Promise<ChatMessageDocument> {
    return this.chatMessageModel.create(data);
  }

  async getRoomMessages(roomId: string, limit = 50): Promise<ChatMessageDocument[]> {
    return this.chatMessageModel
      .find({ roomId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()
      .exec() as any;
  }

  async getAllRooms(): Promise<any[]> {
    const rooms = await this.chatMessageModel.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: '$roomId',
          lastMessage: { $first: '$text' },
          lastSender: { $first: '$sender' },
          lastTimestamp: { $first: '$createdAt' },
          senderName: { $first: '$senderName' },
          senderEmail: { $first: '$senderEmail' },
          pageTitle: { $first: '$pageTitle' },
          pageUrl: { $first: '$pageUrl' },
          isTransferredToAgent: { $max: '$isTransferredToAgent' },
          rating: { $max: '$rating' },
          unreadCount: {
            $sum: {
              $cond: [{ $and: [{ $eq: ['$isRead', false] }, { $ne: ['$sender', 'admin'] }] }, 1, 0],
            },
          },
        },
      },
      { $sort: { lastTimestamp: -1 } },
    ]);
    return rooms;
  }

  async markRoomAsRead(roomId: string): Promise<void> {
    await this.chatMessageModel.updateMany(
      { roomId, sender: { $ne: 'admin' }, isRead: false },
      { $set: { isRead: true, status: 'read' } },
    );
  }

  async updateMessageStatus(messageId: string, status: string): Promise<void> {
    await this.chatMessageModel.findByIdAndUpdate(messageId, { $set: { status } });
  }

  async rateChatSession(roomId: string, rating: number): Promise<void> {
    // Save rating on the last message in room or all user messages to keep it simple
    await this.chatMessageModel.updateMany({ roomId, sender: 'user' }, { $set: { rating } });
  }

  async getPredefinedResponses(): Promise<any[]> {
    const config = await this.cmsService.getConfig();
    return config.predefinedResponses || [];
  }

  async generateAIResponse(message: string): Promise<string> {
    const lowerMessage = message.toLowerCase();

    // Try Gemini API first
    const geminiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (geminiKey) {
      try {
        return await this.callGemini(message, geminiKey);
      } catch (err) {
        console.error('Gemini API error, falling back to local:', err.message);
      }
    }

    // Local fallback with knowledge base matching
    return this.localAIResponse(lowerMessage);
  }

  private async callGemini(message: string, apiKey: string): Promise<string> {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const systemPrompt = `You are the SCPSN AI Assistant for the Society for Cellular Pathology Scientists of Nigeria. 
You help users with questions about membership, conferences, abstracts, payments, and general pathology inquiries.
Keep responses concise (2-3 sentences max), friendly, and professional.
Here is your knowledge base:\n${this.knowledgeBase.join('\n')}

If you don't know something specific, direct users to contact the admin through this chat or visit the relevant page.`;

    const result = await model.generateContent([
      { text: systemPrompt },
      { text: `User question: ${message}` },
    ]);

    return result.response.text();
  }

  private localAIResponse(message: string): string {
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return 'Hello! I\'m the SCPSN AI Assistant. I can help you with membership, conferences, abstracts, and general inquiries. How can I assist you today?';
    }

    if (message.includes('conference') || message.includes('event') || message.includes('seminar')) {
      return 'You can find all upcoming and past conferences on our Conferences page. We regularly organize seminars and webinars for professional development. Would you like me to connect you with an admin for specific event details?';
    }

    if (message.includes('membership') || message.includes('join') || message.includes('register') || message.includes('sign up')) {
      return 'To become an SCPSN member, visit our Registration page. You\'ll need to provide your credentials including your License, CV, and Passport photo. Membership categories include Student, Associate, Full, and Fellow.';
    }

    if (message.includes('abstract') || message.includes('submit') || message.includes('paper')) {
      return 'Scientific abstracts can be submitted through our Abstract Portal. Submissions include real-time word count tracking and category selection. Visit the Abstracts page to get started!';
    }

    if (message.includes('payment') || message.includes('pay') || message.includes('dues') || message.includes('fee')) {
      return 'We accept payments in both NGN and USD through our integrated payment system. You can pay for membership dues, exams, and event registrations through the Member Portal.';
    }

    if (message.includes('contact') || message.includes('email') || message.includes('phone') || message.includes('address')) {
      return 'You can reach us through the Contact page on our website, or continue chatting here. An admin will respond when available. For urgent matters, please use the enquiry form.';
    }

    if (message.includes('library') || message.includes('journal') || message.includes('publication')) {
      return 'Our Digital Library provides authenticated access to private scientific journals, newsletters, and exclusive society archives. This is available exclusively to active members.';
    }

    if (message.includes('status') || message.includes('pending') || message.includes('active') || message.includes('renew')) {
      return 'You can check your membership status and renewal dates on your Member Dashboard. If your application is still pending, an admin will review it shortly. Would you like me to connect you with an admin?';
    }

    return 'Thank you for your message! I\'m the SCPSN AI Assistant. I can help with questions about membership, conferences, abstracts, payments, and more. Could you please provide more details about your inquiry? If you\'d prefer, I can connect you with a human admin.';
  }
}
