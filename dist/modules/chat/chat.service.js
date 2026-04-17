"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const config_1 = require("@nestjs/config");
const chat_message_schema_1 = require("./schemas/chat-message.schema");
const cms_service_1 = require("../cms/cms.service");
let ChatService = class ChatService {
    chatMessageModel;
    configService;
    cmsService;
    knowledgeBase = [];
    constructor(chatMessageModel, configService, cmsService) {
        this.chatMessageModel = chatMessageModel;
        this.configService = configService;
        this.cmsService = cmsService;
        this.initKnowledgeBase();
    }
    initKnowledgeBase() {
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
    async saveMessage(data) {
        return this.chatMessageModel.create(data);
    }
    async getRoomMessages(roomId, limit = 50) {
        return this.chatMessageModel
            .find({ roomId })
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean()
            .exec();
    }
    async getAllRooms() {
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
    async markRoomAsRead(roomId) {
        await this.chatMessageModel.updateMany({ roomId, sender: { $ne: 'admin' }, isRead: false }, { $set: { isRead: true, status: 'read' } });
    }
    async updateMessageStatus(messageId, status) {
        await this.chatMessageModel.findByIdAndUpdate(messageId, { $set: { status } });
    }
    async rateChatSession(roomId, rating) {
        await this.chatMessageModel.updateMany({ roomId, sender: 'user' }, { $set: { rating } });
    }
    async getPredefinedResponses() {
        const config = await this.cmsService.getConfig();
        return config.predefinedResponses || [];
    }
    async generateAIResponse(message) {
        const lowerMessage = message.toLowerCase();
        const geminiKey = this.configService.get('GEMINI_API_KEY');
        if (geminiKey) {
            try {
                return await this.callGemini(message, geminiKey);
            }
            catch (err) {
                console.error('Gemini API error, falling back to local:', err.message);
            }
        }
        return this.localAIResponse(lowerMessage);
    }
    async callGemini(message, apiKey) {
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
    localAIResponse(message) {
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
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(chat_message_schema_1.ChatMessage.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        config_1.ConfigService,
        cms_service_1.CmsService])
], ChatService);
//# sourceMappingURL=chat.service.js.map