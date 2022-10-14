import {
  PutItemCommand,
  QueryCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { ddbClient } from "./ddb";

export interface User {
  password: string;
  email: string;
  user_name: string;
}

export interface Song {
  web_url: string;
  artist: string;
  music_id: string;
  year: string;
  img_url: string;
  title: string;
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

export const getAllMusic = async (): Promise<Song[]> => {
  const params = {
    TableName: "music",
  };
  try {
    const data = await ddbClient.send(new ScanCommand(params));
    if (!data.Items) {
      return [];
    }

    return data.Items.map((song) => {
      return {
        web_url: song.web_url.S ?? "",
        artist: song.artist.S ?? "",
        music_id: song.music_id.S ?? "",
        year: song.year.S ?? "",
        img_url: song.img_url.S ?? "",
        title: song.title.S ?? "",
      };
    });
  } catch (err) {
    console.log("Error", err);
    throw err;
  }
};
