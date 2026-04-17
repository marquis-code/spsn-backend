import { Document } from 'mongoose';
export type MemberDocument = Member & Document;
export declare class Member {
    fullName: string;
    email: string;
    phoneNumber: string;
    membershipId: string;
    role: string;
    status: string;
    category: string;
    documents: {
        passport: string;
        qualification: string;
        license: string;
        cv: string;
        id: string;
        proofOfPayment: string;
        referee: string;
    };
    professionalProfile: {
        bio: string;
        portfolio: string;
        education: string[];
        experience: string[];
    };
    expiryDate: Date;
    isActive: boolean;
    organization: string;
    firebaseUid: string;
    profileImage: string;
    password?: string;
}
export declare const MemberSchema: import("mongoose").Schema<Member, import("mongoose").Model<Member, any, any, any, (Document<unknown, any, Member, any, import("mongoose").DefaultSchemaOptions> & Member & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, Member, any, import("mongoose").DefaultSchemaOptions> & Member & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}), any, Member>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Member, Document<unknown, {}, Member, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Member & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    fullName?: import("mongoose").SchemaDefinitionProperty<string, Member, Document<unknown, {}, Member, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Member & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    email?: import("mongoose").SchemaDefinitionProperty<string, Member, Document<unknown, {}, Member, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Member & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    phoneNumber?: import("mongoose").SchemaDefinitionProperty<string, Member, Document<unknown, {}, Member, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Member & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    membershipId?: import("mongoose").SchemaDefinitionProperty<string, Member, Document<unknown, {}, Member, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Member & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    role?: import("mongoose").SchemaDefinitionProperty<string, Member, Document<unknown, {}, Member, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Member & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<string, Member, Document<unknown, {}, Member, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Member & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    category?: import("mongoose").SchemaDefinitionProperty<string, Member, Document<unknown, {}, Member, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Member & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    documents?: import("mongoose").SchemaDefinitionProperty<{
        passport: string;
        qualification: string;
        license: string;
        cv: string;
        id: string;
        proofOfPayment: string;
        referee: string;
    }, Member, Document<unknown, {}, Member, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Member & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    professionalProfile?: import("mongoose").SchemaDefinitionProperty<{
        bio: string;
        portfolio: string;
        education: string[];
        experience: string[];
    }, Member, Document<unknown, {}, Member, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Member & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    expiryDate?: import("mongoose").SchemaDefinitionProperty<Date, Member, Document<unknown, {}, Member, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Member & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isActive?: import("mongoose").SchemaDefinitionProperty<boolean, Member, Document<unknown, {}, Member, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Member & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    organization?: import("mongoose").SchemaDefinitionProperty<string, Member, Document<unknown, {}, Member, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Member & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    firebaseUid?: import("mongoose").SchemaDefinitionProperty<string, Member, Document<unknown, {}, Member, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Member & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    profileImage?: import("mongoose").SchemaDefinitionProperty<string, Member, Document<unknown, {}, Member, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Member & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    password?: import("mongoose").SchemaDefinitionProperty<string | undefined, Member, Document<unknown, {}, Member, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Member & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Member>;
