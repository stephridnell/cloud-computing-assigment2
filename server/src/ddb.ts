import { DynamoDBClient, DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";
const REGION = "ap-southeast-2";
const config: DynamoDBClientConfig = {
  region: REGION,
};
const ddbClient = new DynamoDBClient(config);
export { ddbClient };
