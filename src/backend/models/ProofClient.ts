import mongoose from "mongoose";

// ProofClients are clients of off-chain proofs
const ProofClientSchema = new mongoose.Schema({
  // TODO: What information do we need to do proper accounting for off-chain proofs?
  // We will need more identifying info for each client, but it will depend on what
  // we use to handle payments.
  clientId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  // passwordDigest == sha256(password + salt)
  passwordDigest: {
    type: String,
    required: true,
  },
  apiKeys: {
    type: [
      {
        type: {
          key: {
            type: String,
            required: true,
          },
          active: {
            type: Boolean,
            required: true,
          },
        },
      },
    ],
    required: true,
  },
  // TODO: Add public encryption key for client. This will be used to encrypt
  // proofs sent to client.
});
const ProofClient =
  mongoose.models.ProofClient ?? mongoose.model("ProofClient", ProofClientSchema);

export default ProofClient;
