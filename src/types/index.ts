export interface Event {
  id: string;
  name: string;
  creator: string;
  description: string;
  instructions: string;
  rewardAmount: number;
  rewardAsset: 'SUI' | 'RUN';
  status: 'OPEN' | 'CLAIMED';
  imageUrl: string;
  participantsCount: number;
  createdAt: number;
  vaultId: string;
  winner?: string;
}

export interface Submission {
  id: string;
  eventId: string;
  submitter: string;
  proofUrl: string;
  timestamp: number;
  status: 'PENDING' | 'VALID' | 'REJECTED';
}

export interface WalletState {
  address: string;
  suiBalance: number;
  runBalance: number;
}