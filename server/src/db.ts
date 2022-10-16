import {
  AttributeValue,
  DeleteItemCommand,
  PutItemCommand,
  QueryCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { ddbClient } from "./ddb";

export interface User {
  user_id: string;
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

export interface Subscription {
  email: string;
  music_id: string;
}

export const insertItem = async (tableName: string, item: any) => {
  const params = {
    TableName: tableName,
    Item: item,
  };

  const command = new PutItemCommand(params);
  await ddbClient.send(command);
};

export interface DeleteKey {
  [hashKey: string]: Record<"S", string>;
}

export const deleteItem = async (tableName: string, deleteKey: DeleteKey) => {
  const params = {
    TableName: tableName,
    Key: deleteKey,
  };

  const command = new DeleteItemCommand(params);
  await ddbClient.send(command);
};

export const getLoginUser = async (
  email: string
): Promise<User | undefined> => {
  var params = {
    KeyConditionExpression: "email = :e",
    ExpressionAttributeValues: {
      ":e": { S: email },
    },
    IndexName: "email_index",
    TableName: "login",
  };

  const command = new QueryCommand(params);
  const response = await ddbClient.send(command);
  const userData = response.Items?.[0];
  if (!userData) {
    return undefined;
  }

  return {
    user_id: userData.user_id.S ?? "",
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

export const getUserSubscriptions = async (userId: string): Promise<Song[]> => {
  var params = {
    KeyConditionExpression: "user_id = :uid",
    ExpressionAttributeValues: {
      ":uid": { S: userId },
    },
    IndexName: "user_id_index",
    TableName: "subscriptions",
  };

  try {
    const subData = await ddbClient.send(new QueryCommand(params));
    if (!subData.Items) {
      return [];
    }

    const exprAttrVals: Record<string, AttributeValue> = {};
    subData.Items.forEach((el, i) => {
      exprAttrVals[`:song${i}`] = { S: el.music_id.S ?? "" };
    });

    const songParams = {
      TableName: "music",
      FilterExpression: `music_id IN (${Object.keys(exprAttrVals).join(", ")})`,
      ExpressionAttributeValues: exprAttrVals,
    };

    const songData = await ddbClient.send(new ScanCommand(songParams));

    return (
      songData?.Items?.map((song) => {
        return {
          web_url: song.web_url?.S ?? "",
          artist: song.artist?.S ?? "",
          music_id: song.music_id?.S ?? "",
          year: song.year?.S ?? "",
          img_url: song.img_url?.S ?? "",
          title: song.title?.S ?? "",
        };
      }) ?? []
    );
  } catch (err) {
    console.log("Error", err);
    throw err;
  }
};
