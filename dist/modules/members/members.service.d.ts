import { Model } from 'mongoose';
import { MemberDocument } from './schemas/member.schema';
export declare class MembersService {
    private memberModel;
    constructor(memberModel: Model<MemberDocument>);
    create(createMemberDto: any): Promise<MemberDocument>;
    registerMember(payload: any): Promise<MemberDocument>;
    findAll(): Promise<MemberDocument[]>;
    findOne(id: string): Promise<MemberDocument>;
    findByFirebaseUid(firebaseUid: string): Promise<MemberDocument | null>;
    findByEmail(email: string): Promise<MemberDocument | null>;
    update(id: string, updateMemberDto: any): Promise<MemberDocument>;
    delete(id: string): Promise<any>;
}
