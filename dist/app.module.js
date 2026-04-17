"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const cache_manager_1 = require("@nestjs/cache-manager");
const core_1 = require("@nestjs/core");
const throttler_1 = require("@nestjs/throttler");
const cache_manager_redis_yet_1 = require("cache-manager-redis-yet");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const members_module_1 = require("./modules/members/members.module");
const blogs_module_1 = require("./modules/blogs/blogs.module");
const conferences_module_1 = require("./modules/conferences/conferences.module");
const appointments_module_1 = require("./modules/appointments/appointments.module");
const enquiries_module_1 = require("./modules/enquiries/enquiries.module");
const forms_module_1 = require("./modules/forms/forms.module");
const chat_module_1 = require("./modules/chat/chat.module");
const payments_module_1 = require("./modules/payments/payments.module");
const abstracts_module_1 = require("./modules/abstracts/abstracts.module");
const auth_module_1 = require("./modules/auth/auth.module");
const cloudinary_module_1 = require("./modules/cloudinary/cloudinary.module");
const mail_module_1 = require("./modules/mail/mail.module");
const cms_module_1 = require("./modules/cms/cms.module");
const excel_module_1 = require("./modules/excel/excel.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            throttler_1.ThrottlerModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => [
                    {
                        ttl: config.get('THROTTLE_TTL') || 60000,
                        limit: config.get('THROTTLE_LIMIT') || 10,
                    },
                ],
            }),
            cache_manager_1.CacheModule.registerAsync({
                isGlobal: true,
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    store: await (0, cache_manager_redis_yet_1.redisStore)({
                        url: configService.get('REDIS_URL') || 'redis://localhost:6379',
                        ttl: parseInt(configService.get('REDIS_TTL')) || 3600,
                    }),
                }),
                inject: [config_1.ConfigService],
            }),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    uri: configService.get('MONGODB_URI') || 'mongodb://localhost:27017/scpsn',
                }),
                inject: [config_1.ConfigService],
            }),
            members_module_1.MembersModule,
            blogs_module_1.BlogsModule,
            conferences_module_1.ConferencesModule,
            appointments_module_1.AppointmentsModule,
            enquiries_module_1.EnquiriesModule,
            forms_module_1.FormsModule,
            chat_module_1.ChatModule,
            payments_module_1.PaymentsModule,
            abstracts_module_1.AbstractsModule,
            auth_module_1.AuthModule,
            cloudinary_module_1.CloudinaryModule,
            mail_module_1.MailModule,
            cms_module_1.CmsModule,
            excel_module_1.ExcelModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: cache_manager_1.CacheInterceptor,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map