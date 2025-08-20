/**
 * File Service
 * Handles file upload, download, and management operations
 */

const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');

class FileService {
  constructor() {
    this.uploadDir = process.env.UPLOAD_DIR || './uploads';
    this.maxFileSize = parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024; // 10MB
    this.allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'application/pdf'];
    this.initializeUploadDir();
  }

  async initializeUploadDir() {
    try {
      await fs.access(this.uploadDir);
    } catch (error) {
      await fs.mkdir(this.uploadDir, { recursive: true });
    }
  }

  // Configure multer for file uploads
  getMulterConfig() {
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, this.uploadDir);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + extension);
      }
    });

    return multer({
      storage,
      limits: {
        fileSize: this.maxFileSize
      },
      fileFilter: (req, file, cb) => {
        if (this.allowedTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error('File type not allowed'), false);
        }
      }
    });
  }

  // Generate secure filename
  generateSecureFilename(originalName) {
    const extension = path.extname(originalName);
    const hash = crypto.randomBytes(16).toString('hex');
    return `${hash}${extension}`;
  }

  // Upload single file
  async uploadFile(file, userId) {
    try {
      const filename = this.generateSecureFilename(file.originalname);
      const filepath = path.join(this.uploadDir, filename);
      
      await fs.writeFile(filepath, file.buffer);

      return {
        filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        path: filepath,
        url: `/uploads/${filename}`,
        uploadedBy: userId,
        uploadedAt: new Date()
      };
    } catch (error) {
      throw new Error(`File upload failed: ${error.message}`);
    }
  }

  // Delete file
  async deleteFile(filename) {
    try {
      const filepath = path.join(this.uploadDir, filename);
      await fs.access(filepath);
      await fs.unlink(filepath);
      return true;
    } catch (error) {
      throw new Error(`File deletion failed: ${error.message}`);
    }
  }

  // Get file info
  async getFileInfo(filename) {
    try {
      const filepath = path.join(this.uploadDir, filename);
      const stats = await fs.stat(filepath);
      
      return {
        filename,
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
        path: filepath
      };
    } catch (error) {
      throw new Error(`File not found: ${error.message}`);
    }
  }

  // Validate file type
  isAllowedFileType(mimetype) {
    return this.allowedTypes.includes(mimetype);
  }

  // Get file extension from mimetype
  getExtensionFromMimeType(mimetype) {
    const extensions = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/gif': '.gif',
      'video/mp4': '.mp4',
      'application/pdf': '.pdf'
    };
    return extensions[mimetype] || '';
  }

  // Process image (placeholder for future image processing)
  async processImage(filepath, options = {}) {
    // TODO: Implement image processing (resize, compress, etc.)
    // This could use libraries like sharp or jimp
    return filepath;
  }

  // Clean up old files
  async cleanupOldFiles(maxAge = 30 * 24 * 60 * 60 * 1000) { // 30 days
    try {
      const files = await fs.readdir(this.uploadDir);
      const now = Date.now();
      
      for (const file of files) {
        const filepath = path.join(this.uploadDir, file);
        const stats = await fs.stat(filepath);
        
        if (now - stats.mtime.getTime() > maxAge) {
          await fs.unlink(filepath);
        }
      }
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }

  // Get upload statistics
  async getUploadStats() {
    try {
      const files = await fs.readdir(this.uploadDir);
      let totalSize = 0;
      
      for (const file of files) {
        const filepath = path.join(this.uploadDir, file);
        const stats = await fs.stat(filepath);
        totalSize += stats.size;
      }
      
      return {
        totalFiles: files.length,
        totalSize,
        totalSizeMB: Math.round(totalSize / (1024 * 1024) * 100) / 100
      };
    } catch (error) {
      return { totalFiles: 0, totalSize: 0, totalSizeMB: 0 };
    }
  }
}

module.exports = new FileService();
