import { Injectable, Logger } from '@nestjs/common';
import translate from 'google-translate-api-x';

@Injectable()
export class TranslationService {
  private readonly logger = new Logger(TranslationService.name);

  // Fields that should NOT be translated
  private readonly excludeFields = [
    'configKey', '_id', '__v', 'id', 'createdAt', 'updatedAt',
    'image', 'logoUrl', 'sidebarLogo', 'heroBg', 'loginBg', 'fileUrl', 'mapEmbedUrl',
    'facebook', 'twitter', 'linkedin', 'instagram', 'telegramLink', 'websiteUrl', 'bannerImage', 'profileImage', 'profilePicture',
    'email', 'phone', 'to', 'link', 'announcementLink', 'guidelinesUrl', 'slug', 'status', 'role', 'type',
    'icon', 'bankName', 'accountNumber', 'accountName', 'author', 'name', 'fullName', 'firstName', 'lastName',
    'siteInitials', 'price', 'newRegistrationFee', 'renewalFee', 'registrationDeadline', 'startDate', 'endDate', 'date', 'token', 'password', 'code'
  ];

  async translateObject(obj: any, targetLang: string): Promise<any> {
    if (!obj) return obj;

    // Handle arrays
    if (Array.isArray(obj)) {
      return Promise.all(obj.map(item => this.translateObject(item, targetLang)));
    }

    // Handle objects
    if (typeof obj === 'object') {
      const translatedObj = {};
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const value = obj[key];
          
          if (this.excludeFields.includes(key) || value instanceof Date) {
            // Do not translate excluded fields or Dates
            translatedObj[key] = value;
          } else if (typeof value === 'string') {
             // Basic URL or string length check
             if (value.trim() === '' || value.startsWith('http://') || value.startsWith('https://')) {
               translatedObj[key] = value;
             } else {
               // Perform translation
               try {
                 const res = await translate(value, { to: targetLang });
                 translatedObj[key] = res.text;
               } catch (error) {
                 this.logger.error(`Translation failed for text: ${value}`, error);
                 translatedObj[key] = value; // Fallback to original
               }
             }
          } else {
             // Recursively translate nested objects
             translatedObj[key] = await this.translateObject(value, targetLang);
          }
        }
      }
      return translatedObj;
    }

    // Return original value if it's not a string, object, or array
    return obj;
  }
}
