"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = __importStar(require("mongoose"));
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
dotenv.config({ path: path.join(__dirname, '../../.env') });
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    console.error('MONGODB_URI is not defined in .env');
    process.exit(1);
}
const uri = MONGODB_URI;
const MemberSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    phoneNumber: String,
    membershipId: String,
    role: String,
    status: String,
    category: String,
    isActive: Boolean,
    firebaseUid: String,
}, { timestamps: true });
const Member = mongoose.model('Member', MemberSchema);
async function seed() {
    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');
        const users = [
            {
                fullName: 'System Administrator',
                email: 'admin@scpsn.org.ng',
                phoneNumber: '08012345678',
                membershipId: 'ADMIN-001',
                role: 'admin',
                status: 'Active',
                category: 'Full',
                isActive: true,
                firebaseUid: 'mock-admin-uid',
            },
            {
                fullName: 'Test Member',
                email: 'member@scpsn.org.ng',
                phoneNumber: '08098765432',
                membershipId: 'MEM-001',
                role: 'regular',
                status: 'Active',
                category: 'Full',
                isActive: true,
                firebaseUid: 'mock-member-uid',
            }
        ];
        for (const user of users) {
            const existing = await Member.findOne({ email: user.email });
            if (existing) {
                console.log(`User ${user.email} already exists, updating...`);
                await Member.updateOne({ email: user.email }, user);
            }
            else {
                console.log(`Creating user ${user.email}...`);
                await Member.create(user);
            }
        }
        console.log('Seeding complete!');
        process.exit(0);
    }
    catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}
seed();
//# sourceMappingURL=seed-users.js.map