import multer, { FileFilterCallback } from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';

import { s3 } from '@/shared/providers/storage/s3Client';

const allowedMimes = ['image/jpeg', 'image/png', 'application/pdf']; // 🔁 edite conforme necessário
const maxSize = 5 * 1024 * 1024; // 5MB

export const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET!,
    acl: 'public-read',
    key: (_, file, cb) => {
      const timestamp = Date.now();
      const extension = path.extname(file.originalname);
      const filename = `${timestamp}-${file.fieldname}${extension}`;
      cb(null, filename);
    },
  }),
  limits: {
    fileSize: maxSize,
  },
  fileFilter: (_request: any, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
      return;
    } else {
      cb(new Error(`Tipo de arquivo não permitido: ${file.mimetype}`));
      return;
    }
  },
});
