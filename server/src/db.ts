import { PutItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";
import { ddbClient } from "./ddb";

export interface User {
  password: string;
  email: string;
  user_name: string;
}

export const insertItem = async (tableName: string, item: any) => {
  const params = {
    TableName: tableName,
    Item: item,
  };

  const command = new PutItemCommand(params);
  await ddbClient.send(command);
};

export const getLoginUser = async (
  email: string
): Promise<User | undefined> => {
  const input = {
    KeyConditionExpression: "email = :e",
    ExpressionAttributeValues: {
      ":e": { S: email },
    },
    TableName: "login",
  };

  const command = new QueryCommand(input);
  const response = await ddbClient.send(command);
  const userData = response.Items?.[0];
  if (!userData) {
    return undefined;
  }

  return {
    password: userData.password.S ?? "",
    email: userData.email.S ?? "",
    user_name: userData.user_name.S ?? "",
  };
};
