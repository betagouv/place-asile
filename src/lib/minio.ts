import { Client } from "minio";

export const minioClient = new Client({
    endPoint: process.env.S3_URL!,
    accessKey: process.env.S3_ACCESS!,
    secretKey: process.env.S3_SECRET!,
    useSSL: true,
});

export const checkBucket = async (bucketName: string): Promise<void> => {
    const exists = await minioClient.bucketExists(bucketName);
    if (exists) {
        console.log("Bucket " + bucketName + " exists.");
    } else {
        await minioClient.makeBucket(bucketName);
        console.log("Bucket " + bucketName + " created.");
    }
};

export const getObject = async (
    bucketName: string,
    objectName: string
) => {
    return minioClient.getObject(bucketName, objectName);
};

