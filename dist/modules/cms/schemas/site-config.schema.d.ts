import { Document } from 'mongoose';
export type SiteConfigDocument = SiteConfig & Document;
export declare class SiteConfig {
    configKey: string;
    heroSlides: {
        tag: string;
        title: string;
        desc: string;
        image: string;
    }[];
    marqueeItems: {
        label: string;
        tag: string;
        icon: string;
    }[];
    pillars: {
        title: string;
        desc: string;
        icon: string;
    }[];
    stats: {
        label: string;
        value: string;
    }[];
    initiatives: {
        title: string;
        desc: string;
        icon: string;
        to: string;
    }[];
    aboutContent: {
        title: string;
        description: string;
        mission: string;
        vision: string;
    };
    contactInfo: {
        email: string;
        phone: string;
        address: string;
    };
    socialLinks: {
        facebook: string;
        twitter: string;
        linkedin: string;
        instagram: string;
    };
    chatbotKnowledge: string[];
    siteName: string;
    siteDescription: string;
    logoUrl: string;
    predefinedResponses: {
        category: string;
        label: string;
        text: string;
    }[];
    publications: {
        title: string;
        description: string;
        fileUrl: string;
        category: string;
        publishDate: Date;
    }[];
}
export declare const SiteConfigSchema: import("mongoose").Schema<SiteConfig, import("mongoose").Model<SiteConfig, any, any, any, (Document<unknown, any, SiteConfig, any, import("mongoose").DefaultSchemaOptions> & SiteConfig & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, SiteConfig, any, import("mongoose").DefaultSchemaOptions> & SiteConfig & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}), any, SiteConfig>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, SiteConfig, Document<unknown, {}, SiteConfig, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<SiteConfig & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    configKey?: import("mongoose").SchemaDefinitionProperty<string, SiteConfig, Document<unknown, {}, SiteConfig, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SiteConfig & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    heroSlides?: import("mongoose").SchemaDefinitionProperty<{
        tag: string;
        title: string;
        desc: string;
        image: string;
    }[], SiteConfig, Document<unknown, {}, SiteConfig, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SiteConfig & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    marqueeItems?: import("mongoose").SchemaDefinitionProperty<{
        label: string;
        tag: string;
        icon: string;
    }[], SiteConfig, Document<unknown, {}, SiteConfig, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SiteConfig & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    pillars?: import("mongoose").SchemaDefinitionProperty<{
        title: string;
        desc: string;
        icon: string;
    }[], SiteConfig, Document<unknown, {}, SiteConfig, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SiteConfig & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    stats?: import("mongoose").SchemaDefinitionProperty<{
        label: string;
        value: string;
    }[], SiteConfig, Document<unknown, {}, SiteConfig, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SiteConfig & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    initiatives?: import("mongoose").SchemaDefinitionProperty<{
        title: string;
        desc: string;
        icon: string;
        to: string;
    }[], SiteConfig, Document<unknown, {}, SiteConfig, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SiteConfig & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    aboutContent?: import("mongoose").SchemaDefinitionProperty<{
        title: string;
        description: string;
        mission: string;
        vision: string;
    }, SiteConfig, Document<unknown, {}, SiteConfig, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SiteConfig & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    contactInfo?: import("mongoose").SchemaDefinitionProperty<{
        email: string;
        phone: string;
        address: string;
    }, SiteConfig, Document<unknown, {}, SiteConfig, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SiteConfig & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    socialLinks?: import("mongoose").SchemaDefinitionProperty<{
        facebook: string;
        twitter: string;
        linkedin: string;
        instagram: string;
    }, SiteConfig, Document<unknown, {}, SiteConfig, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SiteConfig & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    chatbotKnowledge?: import("mongoose").SchemaDefinitionProperty<string[], SiteConfig, Document<unknown, {}, SiteConfig, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SiteConfig & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    siteName?: import("mongoose").SchemaDefinitionProperty<string, SiteConfig, Document<unknown, {}, SiteConfig, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SiteConfig & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    siteDescription?: import("mongoose").SchemaDefinitionProperty<string, SiteConfig, Document<unknown, {}, SiteConfig, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SiteConfig & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    logoUrl?: import("mongoose").SchemaDefinitionProperty<string, SiteConfig, Document<unknown, {}, SiteConfig, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SiteConfig & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    predefinedResponses?: import("mongoose").SchemaDefinitionProperty<{
        category: string;
        label: string;
        text: string;
    }[], SiteConfig, Document<unknown, {}, SiteConfig, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SiteConfig & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    publications?: import("mongoose").SchemaDefinitionProperty<{
        title: string;
        description: string;
        fileUrl: string;
        category: string;
        publishDate: Date;
    }[], SiteConfig, Document<unknown, {}, SiteConfig, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SiteConfig & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, SiteConfig>;
