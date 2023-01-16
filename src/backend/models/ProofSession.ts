import mongoose from "mongoose";

// ProofSessions are for off-chain proofs
const ProofSessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
  },
  clientId: {
    type: String,
    required: true,
  },
  createdAt: {
    // UNIX timestamp
    type: Number,
    required: true,
  },
  consumedAt: {
    // UNIX timestamp
    type: Number,
    required: false,
  },
  consumedBy: {
    // IP address
    type: String,
    required: false,
  },
});

const ProofSession =
  mongoose.models.ProofSession ?? mongoose.model("ProofSession", ProofSessionSchema);

export default ProofSession;
