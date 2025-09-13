// src/globals.d.ts

import * as multer from 'multer';

declare global {
  namespace Express {
    interface Request {
      // You can extend the Request object here if needed
    }
    namespace Multer {
      interface File extends multer.File {}
    }
  }
}