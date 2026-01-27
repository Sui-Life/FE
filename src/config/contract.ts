// Contract configuration
export const CONTRACT_CONFIG = {
  // Update this with your actual deployed package ID from testnet
  EVENT_PACKAGE_ID: '0x9612a7bdf6c83ee36af0ada14343da997ce17b40c101bf0f452117d6c99ae06a', // Deployed package ID
  TOKEN_PACKAGE_ID: '0xf554be094beb4e0023dcde223ca00a540a5a21ec3ae25ac551e037377e4fad5f', // 🔥 REPLACE with Token Package ID
  MODULE_NAME: 'event',
  TOKEN_MODULE_NAME: 'run_token',

  // Shared Objects for Token (🔥 REPLACE with IDs from deployment output)
  TOKEN_VAULT_ID: '0xdf68b4736632a169feb091f69b08557132c28e1deb5c42209a1de250a4cc0ebc',
  TOKEN_PRICE_ID: '0x7199016702d3f1be32336a16cee6db5795a8cbbce963bd2551f052e2ea4ede0d',
  TOKEN_STATE_ID: '0x9511e5dc5a1e150b93d9c636e4f3ac1f5bc5c230a8e6010438b8d7c66385ebe6',

  // Network configuration
  NETWORK: 'testnet',

  // Contract functions
  FUNCTIONS: {
    CREATE_EVENT: 'create_event',
    CLAIM_REWARD: 'claim_reward',
    BUY_RUN: 'buy_run',
    JOIN_EVENT: 'join_event',
    SUBMIT_PROOF: 'submit_proof',
  }
};

// Helper to get full function target
export const getFunctionTarget = (functionName: string) => {
  return `${CONTRACT_CONFIG.EVENT_PACKAGE_ID}::${CONTRACT_CONFIG.MODULE_NAME}::${functionName}`;
};