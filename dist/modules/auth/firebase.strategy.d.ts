import { Strategy } from 'passport-firebase-jwt';
import { ConfigService } from '@nestjs/config';
declare const FirebaseStrategy_base: new (...args: [options: any, verify: any] | [options: any]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class FirebaseStrategy extends FirebaseStrategy_base {
    private configService;
    constructor(configService: ConfigService);
    validate(token: string): Promise<import("node_modules/firebase-admin/lib/auth/token-verifier").DecodedIdToken | {
        uid: string;
        email: string;
        email_verified: boolean;
    }>;
}
export {};
