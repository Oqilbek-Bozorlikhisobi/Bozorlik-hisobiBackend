import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import { existsSync, mkdirSync } from "fs";
import { diskStorage } from "multer";

export const fileOption: MulterOptions = {
  limits: {
    fileSize: 100000000, // 100MB
  },
  storage: diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = "upload";
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath);
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const ext = file.originalname.split('.').pop(); // Fayl kengaytmasi
      cb(null, `${file.mimetype.split("/")[0]}_${Date.now()}.${ext}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'image/jpeg', // JPEG format
      'image/png',  // PNG format
      'image/gif',  // GIF format
      'image/webp', // WebP format
      'image/svg+xml', // SVG format
      'image/bmp',  // BMP format
      'image/tiff', // TIFF format
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true); // Fayl qabul qilinadi
    } else {
      cb(new Error('Faqat rasm fayllari (JPEG, PNG, GIF, WebP, SVG, BMP, TIFF) qabul qilinadi!'), false);
    }
  },
};
