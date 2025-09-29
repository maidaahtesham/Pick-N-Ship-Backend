// src/config/multer.config.ts
import { MulterModuleOptions } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

export const multerOptions: MulterModuleOptions = {
  storage: memoryStorage(),
};