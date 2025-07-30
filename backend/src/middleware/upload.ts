import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const avatarDir = path.join(__dirname, '..', '..', 'uploads', 'avatars');

// Ensure the folder exists
if (!fs.existsSync(avatarDir)) {
    fs.mkdirSync(avatarDir, { recursive: true });
}

// Configure multer storage engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, avatarDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueName = uuidv4() + ext;
        cb(null, uniqueName);
    },
});

// Filter: only allow image files
function fileFilter(
    req: Express.Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback,
) {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'));
    }
}

// Create and export configured Multer instance
const Upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max file size
    fileFilter,
});

export default Upload;
