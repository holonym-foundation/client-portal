export interface ProofSession {
  sessionId: string;
  createdAt: number | undefined;
  consumedAt: number | undefined;
}

export interface APIKey {
  key: string;
  active: boolean;
}
