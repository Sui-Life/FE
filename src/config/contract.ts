// Contract configuration
export const CONTRACT_CONFIG = {
  // Update this with your actual deployed package ID from testnet
  EVENT_PACKAGE_ID:
    "0x3743b6e4b471ec0c878c3e9a243e3c97392ed0824402dd27f6084fd2ae558bc1", // Deployed package ID
  TOKEN_PACKAGE_ID:
    "0x2d1bd20b3021e396cdac5a92e7ab060bcc602dd828f10ec85ba9d6abf59b0e32", // 🔥 REPLACE with Token Package ID
  MODULE_NAME: "event",
  TOKEN_MODULE_NAME: "life_token",

  // Shared Objects for Token (🔥 REPLACE with IDs from deployment output)
  TOKEN_VAULT_ID:
    "0x30d735d8842c57c8a420cb79b89eec761ef6acca9129a33cacc7ba3be48cdafa",
  TOKEN_PRICE_ID:
    "0xfb5be84fd5fd97a929487f1d5b39bfaf5a231964cf6c50b3d634aadf187b3eb1",
  TOKEN_STATE_ID:
    "0xd6de053b64a02ce43b07bd492c10dc8629d633f2fdc5ddf886b0986b26be9044",

  // Network configuration
  NETWORK: "testnet",

  // Contract functions
  FUNCTIONS: {
    CREATE_EVENT: "create_event",
    CLAIM_REWARD: "claim_reward",
    BUY_RUN: "buy_life",
    JOIN_EVENT: "join_event",
    SUBMIT_PROOF: "submit_proof",
    VERIFY_PARTICIPANTS: "verify_participants",
  },
};

// Helper to get full function target
export const getFunctionTarget = (functionName: string) => {
  return `${CONTRACT_CONFIG.EVENT_PACKAGE_ID}::${CONTRACT_CONFIG.MODULE_NAME}::${functionName}`;
};
