import {
  CreateTableCommand,
  CreateTableCommandInput,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";
import { ddbClient } from "./ddb";
import { s3Client } from "./s3";
import musicData from "../a2.json";
import axios from "axios";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { insertItem } from "./db";

const BUCKET_URL =
  "https://steph-cc-assignment-2.s3.ap-southeast-2.amazonaws.com/";

export const loginTableParams: CreateTableCommandInput = {
  AttributeDefinitions: [
    {
      AttributeName: "email",
      AttributeType: "S",
    },
    {
      AttributeName: "user_name",
      AttributeType: "S",
    },
  ],
  KeySchema: [
    {
      AttributeName: "email", // hash key
      KeyType: "HASH",
    },
    {
      AttributeName: "user_name", // sort key
      KeyType: "RANGE",
    },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 10,
    WriteCapacityUnits: 10,
  },
  TableName: "login",
};

export const musicTableParams: CreateTableCommandInput = {
  AttributeDefinitions: [
    {
      AttributeName: "music_id",
      AttributeType: "S",
    },
    {
      AttributeName: "title",
      AttributeType: "S",
    },
  ],
  KeySchema: [
    {
      AttributeName: "music_id", // hash key
      KeyType: "HASH",
    },
    {
      AttributeName: "title", // sort key
      KeyType: "RANGE",
    },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 10,
    WriteCapacityUnits: 10,
  },
  TableName: "music",
};

export const subTableParams: CreateTableCommandInput = {
  AttributeDefinitions: [
    {
      AttributeName: "email",
      AttributeType: "S",
    },
    {
      AttributeName: "music_id",
      AttributeType: "S",
    },
  ],
  KeySchema: [
    {
      AttributeName: "email", // hash key
      KeyType: "HASH",
    },
    {
      AttributeName: "music_id", // sort key
      KeyType: "RANGE",
    },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 10,
    WriteCapacityUnits: 10,
  },
  TableName: "subscriptions",
};

const createTable = async (params: CreateTableCommandInput) => {
  try {
    await ddbClient.send(new CreateTableCommand(params));
  } catch (err: any) {
    // if table is already created, do nothing
    if (err && err.name === "ResourceInUseException") {
      return;
    } else {
      // if it's any other error, throw it
      throw err;
    }
  }
};

const uploadFromUrl = async (imageName: string, imageURL: string) => {
  const fetchResponse = await axios.get(encodeURI(imageURL), {
    responseType: "arraybuffer",
  });

  const bucketParams = {
    Bucket: "steph-cc-assignment-2",
    Key: imageName,
    Body: fetchResponse.data,
    ACL: "public-read",
  };

  try {
    await s3Client.send(new PutObjectCommand(bucketParams));
    return bucketParams.Bucket + "/" + bucketParams.Key;
  } catch (err) {
    console.log("Error uploading song image", err);
    return undefined;
  }
};

const addUsers = async () => {
  const insertPromises = [];
  for (let i = 0; i < 10; i++) {
    insertPromises.push(
      insertItem("login", {
        email: { S: `s3272974${i}@student.rmit.edu.au` },
        user_name: { S: `Stephanie Ridnell${i}` },
        password: { S: generateUserPassword(i) },
      })
    );
  }
  try {
    await Promise.all(insertPromises);
  } catch (err) {
    console.log("error inserting users into login table");
    throw err;
  }
};

const generateUserPassword = (startingNumber: number) => {
  let password = "";
  while (password.length < 6) {
    if (startingNumber === 10) {
      startingNumber = 0;
    }
    password += startingNumber;
    startingNumber++;
  }
  return password;
};

const addMusic = async () => {
  const insertPromises = musicData.songs.map(async (song, i) => {
    const imageName = song.img_url.match(
      /[^/\\&\?]+\.\w{3,4}(?=([\?&].*$|$))/
    )?.[0];
    await uploadFromUrl(imageName ?? "song" + i, song.img_url);
    return insertItem("music", {
      music_id: { S: "song" + i }, // using incremental ids here so i can run the seed as many times as i want without duplicating data
      title: { S: song.title },
      artist: { S: song.artist },
      year: { S: song.year },
      web_url: { S: song.web_url },
      img_url: { S: imageName ? BUCKET_URL + imageName : song.img_url },
    });
  });

  try {
    await Promise.all(insertPromises);
  } catch (err) {
    console.log("error inserting songs into music table");
    throw err;
  }
};

export const seedTables = async () => {
  try {
    await createTable(loginTableParams);
    console.log("Login table created");
    await addUsers();
    console.log("Login table seeded");
    await createTable(musicTableParams);
    console.log("Music table created");
    await addMusic();
    console.log("Music table seeded");
    await createTable(subTableParams);
    console.log("Subscription table created");
    return "3 tables created";
  } catch (err) {
    throw err;
  }
};
