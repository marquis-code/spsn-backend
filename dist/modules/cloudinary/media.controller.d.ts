import { CloudinaryService } from './cloudinary.service';
export declare class MediaController {
    private readonly cloudinaryService;
    constructor(cloudinaryService: CloudinaryService);
    uploadFile(file: Express.Multer.File): Promise<{
        url: any;
        public_id: any;
        original_name: string;
        format: any;
        bytes: any;
    }>;
}
