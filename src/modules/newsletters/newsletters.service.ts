import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NewsletterDocument, Newsletter } from './schemas/newsletter.schema';
import { NewsletterCategoryDocument, NewsletterCategory } from './schemas/newsletter-category.schema';
import { NewsletterSubscriptionDocument, NewsletterSubscription } from './schemas/newsletter-subscription.schema';
import { PaymentsService } from '../payments/payments.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class NewslettersService {
  constructor(
    @InjectModel(Newsletter.name) private newsletterModel: Model<NewsletterDocument>,
    @InjectModel(NewsletterCategory.name) private categoryModel: Model<NewsletterCategoryDocument>,
    @InjectModel(NewsletterSubscription.name) private subscriptionModel: Model<NewsletterSubscriptionDocument>,
    private paymentsService: PaymentsService,
    private mailService: MailService,
  ) {}

  // ================= CATEGORIES =================
  async getCategories() {
    return this.categoryModel.find().sort({ createdAt: -1 }).exec();
  }

  async createCategory(data: Partial<NewsletterCategory>) {
    const existing = await this.categoryModel.findOne({ title: data.title });
    if (existing) throw new ConflictException('Category with this title already exists');
    return new this.categoryModel(data).save();
  }

  async updateCategory(id: string, data: Partial<NewsletterCategory>) {
    const category = await this.categoryModel.findByIdAndUpdate(id, data, { new: true }).exec();
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async deleteCategory(id: string) {
    return this.categoryModel.findByIdAndDelete(id).exec();
  }

  // ================= NEWSLETTERS (CAMPAIGNS) =================
  async getNewsletters() {
    return this.newsletterModel.find().populate('category').sort({ createdAt: -1 }).exec();
  }

  async getNewsletter(id: string) {
    const nl = await this.newsletterModel.findById(id).populate('category').exec();
    if (!nl) throw new NotFoundException('Newsletter not found');
    return nl;
  }

  async createNewsletter(data: Partial<Newsletter>) {
    return new this.newsletterModel(data).save();
  }

  async updateNewsletter(id: string, data: Partial<Newsletter>) {
    const nl = await this.newsletterModel.findByIdAndUpdate(id, data, { new: true }).exec();
    if (!nl) throw new NotFoundException('Newsletter not found');
    return nl;
  }

  async deleteNewsletter(id: string) {
    return this.newsletterModel.findByIdAndDelete(id).exec();
  }

  async publishNewsletter(id: string) {
    const nl = await this.getNewsletter(id);
    if (nl.status === 'PUBLISHED') throw new ConflictException('Newsletter is already published');

    // Find subscribers
    const subscribers = await this.subscriptionModel.find({
      isPaid: true,
      categories: { $in: [(nl.category as any)._id] }
    }).exec();

    // Send emails in background
    for (const sub of subscribers) {
      await this.mailService.sendMail(sub.email, nl.subject, nl.htmlContent);
    }

    nl.status = 'PUBLISHED';
    return nl.save();
  }

  // ================= SUBSCRIPTIONS =================
  async getSubscriptions() {
    return this.subscriptionModel.find().populate('categories').sort({ createdAt: -1 }).exec();
  }

  async subscribe(email: string, categoryIds: string[] = [], fullName?: string, proofOfPayment?: string) {
    let categories: any[] = [];
    if (categoryIds && categoryIds.length > 0) {
      categories = await this.categoryModel.find({ _id: { $in: categoryIds } }).exec();
      if (categories.length === 0) throw new NotFoundException('No valid categories found');
    }

    const totalAmount = categories.reduce((sum, cat) => sum + cat.price, 0);
    
    // Check if subscription exists
    let subscription = await this.subscriptionModel.findOne({ email }).exec();
    if (!subscription) {
      subscription = new this.subscriptionModel({
        email,
        categories: categoryIds,
        totalAmount,
        isPaid: totalAmount === 0,
      });
    } else {
      // Update existing subscription
      subscription.categories = categoryIds as any;
      subscription.totalAmount = totalAmount;
      subscription.isPaid = totalAmount === 0; // If they picked free ones only, they are paid.
      if (proofOfPayment) {
        subscription.proofOfPayment = proofOfPayment;
      }
    }

    if (proofOfPayment && !subscription.proofOfPayment) {
      subscription.proofOfPayment = proofOfPayment;
    }

    if (totalAmount > 0) {
      await subscription.save();
      return { success: true, message: 'Subscription created. Pending payment verification.', subscription };
    }

    await subscription.save();
    return { success: true, message: 'Subscribed successfully', subscription };
  }

  async handlePaymentCallback(email: string) {
    // In a full implementation, this is triggered by Paystack webhook
    // We mock it for the sake of completion based on email
    await this.subscriptionModel.updateOne({ email }, { isPaid: true }).exec();
    return { success: true };
  }
}
