import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-firebase-jwt';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseStrategy extends PassportStrategy(Strategy, 'firebase-auth') {
  constructor(private configService: ConfigService) {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: configService.get<string>('FIREBASE_PROJECT_ID'),
          clientEmail: configService.get<string>('FIREBASE_CLIENT_EMAIL'),
          privateKey: configService.get<string>('FIREBASE_PRIVATE_KEY')?.replace(/\\n/g, '\n'),
        }),
      });
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(token: string) {
    // Development Mock Bypass
    if (token.startsWith('mock-token-')) {
      const parts = token.split('-');
      const userId = parts[2];
      // In a real mock, we should fetch the user or just return a mock payload
      // For now, let's return a payload that identifies the user
      return {
        uid: userId,
        email: parts.length > 4 ? parts[4] : 'test@scpsn.org.ng', // Optional email in token
        email_verified: true,
      };
    }

    try {
      const firebaseUser = await admin.auth().verifyIdToken(token);
      if (!firebaseUser) {
        return null;
      }
      return firebaseUser;
    } catch (err) {
      return null;
    }
  }
}
