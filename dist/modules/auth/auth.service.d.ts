import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { Member, MemberDocument } from '../members/schemas/member.schema';
export declare class AuthService {
    private memberModel;
    private readonly jwtService;
    constructor(memberModel: Model<MemberDocument>, jwtService: JwtService);
    login(email: string, password: string): Promise<{
        user: Member & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
        token: string;
    } | {
        user: import("mongoose").Document<unknown, {}, MemberDocument, {}, import("mongoose").DefaultSchemaOptions> & Member & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
        token: string;
    }>;
}
