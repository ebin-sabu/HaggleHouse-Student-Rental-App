// AWS SDK v3 packages
import { S3Client } from '@aws-sdk/client-s3';
import multer from 'multer';
import multerS3 from 'multer-s3';


const s3Client = new S3Client({
    region: process.env.S3_BUCKET_REGION,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
});

const upload = multer({
    storage: multerS3({
        s3: s3Client,
        bucket: 'haggle-house',
        acl: 'public-read',
        key: function (req, file, cb) {
            cb(null, `${Date.now().toString()}-${file.originalname}`);
        }
    })
});

export default upload;
