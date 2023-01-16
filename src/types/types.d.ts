import mongoose from "mongoose";

export interface ProofSession {
  sessionId: string;
  createdAt: number | undefined;
  consumedAt: number | undefined;
}

export interface APIKey {
  key: string;
  active: boolean;
}

/**
 * START Backend types
 */

export interface ProofClientDoc {
  clientId: string;
  name: string;
  username: string;
  passwordDigest: string;
  apiKeys: APIKey[];
  _id?: string | undefined;
  __v?: number | undefined;
}

export type ProofClientModel = mongoose.Model<ProofClientDoc>;

export interface ProofSessionDoc {
  sessionId: string;
  clientId: string;
  createdAt: number;
  consumedAt?: number | undefined;
  consumedBy?: string | undefined;
  _id?: string | undefined;
  __v?: number | undefined;
}

export type ProofSessionModel = mongoose.Model<ProofSessionDoc>;
