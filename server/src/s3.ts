import { S3Client, S3ClientConfig } from "@aws-sdk/client-s3";
const REGION = "ap-southeast-2";
const config: S3ClientConfig = {
  region: REGION,
};
const s3Client = new S3Client(config);
export { s3Client };
