import fs from "fs";
import mongoose from "mongoose";
import * as AWS from "@aws-sdk/client-s3";
import { GetObjectCommandOutput } from "@aws-sdk/client-s3";
import bcrypt from "bcryptjs";
import { SALT } from "./constants";
import type { ProofClientModel, ProofSessionModel } from "../types/types";
import { ProofClient, ProofSession } from "./models";
import dotenv from "dotenv";
dotenv.config();

// Using global to maintain connection during Next.js hot reloads in dev
// https://github.com/vercel/next.js/pull/17666
global.mongoose = global?.mongoose ?? mongoose;

if (process.env.NODE_ENV === "development") {
  global.mongoose.set("debug", true);
}

async function initializeProofClient(ProofClient: ProofClientModel) {
  if (process.env.NODE_ENV === "development") {
    await ProofClient.deleteOne({
      clientId: "0",
    }).exec();
    const passwordDigest = await bcrypt.hash(
      process.env.ADMIN_PASSWORD as string,
      SALT
    );
    const testClientData = {
      clientId: "0",
      displayName: "Holonym",
      username: "holonym",
      passwordDigest,
      apiKeys: [{ key: "123", active: true }],
    };
    const testClientDoc = await ProofClient.findOne({
      clientId: testClientData.clientId,
    }).exec();
    if (!testClientDoc) {
      const newProofClient = new ProofClient(testClientData);
      await newProofClient.save();
    }
  }
}

async function initializeMongoose(): Promise<typeof mongoose> {
  if (
    global.mongoose.connection.readyState !== 0 &&
    global.mongoose.connection.readyState !== 3
  ) {
    return global.mongoose;
  }

  console.log("Initializing MongoDB connection...");
  if (process.env.NODE_ENV !== "development") {
    // Download certificate used for TLS connection
    try {
      const s3 = new AWS.S3({
        credentials: {
          accessKeyId: process.env.ACCESS_KEY_ID_AWS as string,
          secretAccessKey: process.env.SECRET_ACCESS_KEY_AWS as string,
        },
        region: "us-east-1",
      });
      const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: process.env.MONGO_CERT_FILE_NAME,
      };
      await new Promise<void>((resolve, reject) => {
        console.log("Downloading certificate for MongoDB connection...");
        s3.getObject(
          params,
          async (getObjectErr: any, data: GetObjectCommandOutput | undefined) => {
            if (getObjectErr) reject(getObjectErr);
            const bodyAsString = await data?.Body?.transformToString();
            fs.writeFile(
              // `${__dirname}/${process.env.MONGO_CERT_FILE_NAME}`,
              `./${process.env.MONGO_CERT_FILE_NAME}`,
              bodyAsString as string,
              (writeFileErr) => {
                console.log("entered writeFile cb");
                if (writeFileErr) {
                  console.log("writeFileErr...", writeFileErr);
                  resolve();
                }
                console.log(
                  "Successfully downloaded certificate for MongoDB connection"
                );
                resolve();
              }
            );
          }
        );
      });
    } catch (err) {
      console.log("Unable to download certificate for MongoDB connection.", err);
      return global.mongoose;
    }
  }

  try {
    const mongoConfig = {
      ssl: true,
      sslValidate: true,
      // sslCA: `${__dirname}/${process.env.MONGO_CERT_FILE_NAME}`,
      sslCA: `./${process.env.MONGO_CERT_FILE_NAME}`,
    };
    await global.mongoose.connect(
      process.env.MONGO_DB_CONNECTION_STR as string,
      process.env.NODE_ENV === "development" ? {} : mongoConfig
    );
    console.log("Connected to MongoDB database.");
  } catch (err) {
    console.log("Unable to connect to MongoDB database.", err);
    return global.mongoose;
  }
  await initializeProofClient(ProofClient);
  return global.mongoose;
}

export { initializeMongoose };
