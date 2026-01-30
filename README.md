# 🌟 SuiLife - Real-Life Quest Platform

<div align="center">

<img src="./public/logo.png" alt="SuiLife Logo" width="120" />

**Complete real-life missions, earn LIFE tokens, and get rewarded on the Sui blockchain.**

[![React](https://img.shields.io/badge/React-19.2-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Sui](https://img.shields.io/badge/Sui-Blockchain-4da2ff?logo=sui)](https://sui.io/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite)](https://vitejs.dev/)

</div>

---

## 📖 Overview

**SuiLife** is a decentralized Web3 application that bridges real-world activities with blockchain rewards. Creators can design quests with specific requirements, and participants complete real-life missions to earn LIFE tokens as rewards.

### ✨ Key Features

- 🎯 **Create Quests** - Design missions with custom requirements, rewards, and deadlines
- 🏃 **Join & Complete** - Participate in quests and submit proof of completion
- ✅ **Verification System** - Quest creators verify participant submissions
- 💰 **Claim Rewards** - Verified participants claim LIFE token rewards
- 💱 **Buy LIFE Tokens** - Exchange SUI for LIFE tokens directly in-app
- 📊 **Dashboard** - Track your created quests and participation status

---

## 🛠️ Tech Stack

| Category             | Technology                        |
| -------------------- | --------------------------------- |
| **Frontend**         | React 19, TypeScript              |
| **Build Tool**       | Vite 6.2                          |
| **Blockchain**       | Sui Network (Testnet)             |
| **Sui Integration**  | @mysten/dapp-kit, @mysten/sui     |
| **State Management** | TanStack React Query              |
| **Styling**          | TailwindCSS                       |
| **Fonts**            | Plus Jakarta Sans, JetBrains Mono |

---

## 📁 Project Structure

```
FE/
├── public/
│   └── logo.png              # App logo
├── src/
│   ├── components/           # React components
│   │   ├── EventCard.tsx     # Quest card display
│   │   ├── EventDetail.tsx   # Quest detail view
│   │   ├── EventList.tsx     # Quest listing
│   │   ├── CreateEventForm.tsx # Quest creation form
│   │   ├── Dashboard.tsx     # User dashboard
│   │   ├── Navigation.tsx    # App navigation
│   │   ├── BuyLifeModal.tsx  # Token purchase modal
│   │   └── ...
│   ├── hooks/                # Custom React hooks
│   │   ├── useAllEvents.ts   # Fetch all quests
│   │   ├── useCreateEvent.ts # Create quest transaction
│   │   ├── useJoinEvent.ts   # Join quest transaction
│   │   ├── useSubmitProof.ts # Submit proof transaction
│   │   ├── useClaimReward.ts # Claim reward transaction
│   │   ├── useBuyLife.ts     # Buy LIFE tokens
│   │   └── ...
│   ├── config/
│   │   └── contract.ts       # Smart contract configuration
│   ├── constants/            # App constants & icons
│   ├── types/                # TypeScript type definitions
│   └── App.tsx               # Main application component
├── index.html                # HTML entry point
├── index.tsx                 # App entry point with providers
├── vite.config.ts            # Vite configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies & scripts
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **pnpm** (recommended) or npm
- **Sui Wallet** browser extension

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd sui-life/FE
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Configure environment** (optional)

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server**

   ```bash
   pnpm dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173
   ```

---

## 📜 Available Scripts

| Command        | Description              |
| -------------- | ------------------------ |
| `pnpm dev`     | Start development server |
| `pnpm build`   | Build for production     |
| `pnpm preview` | Preview production build |

---

## ⚙️ Configuration

### Smart Contract Configuration

Update the contract addresses in `src/config/contract.ts`:

```typescript
export const CONTRACT_CONFIG = {
  EVENT_PACKAGE_ID: "0x...", // Event module package ID
  TOKEN_PACKAGE_ID: "0x...", // Token module package ID
  TOKEN_VAULT_ID: "0x...", // Token vault object ID
  TOKEN_PRICE_ID: "0x...", // Token price object ID
  TOKEN_STATE_ID: "0x...", // Token state object ID
  NETWORK: "testnet", // Network: testnet | mainnet
};
```

---

## 🎮 How It Works

### For Quest Creators

1. Connect your Sui wallet
2. Navigate to "Buat Misi" (Create Quest)
3. Fill in quest details (title, description, requirements, reward, deadline)
4. Pay the reward pool in LIFE tokens
5. Verify participant submissions from your dashboard

### For Participants

1. Connect your Sui wallet
2. Browse available quests in "Jelajahi Misi"
3. Join a quest you want to complete
4. Complete the real-life mission
5. Submit proof of completion
6. Wait for creator verification
7. Claim your LIFE token reward!

---

## 🪙 LIFE Token

LIFE is the native reward token of the SuiLife platform:

- **Purchase**: Exchange SUI tokens for LIFE
- **Stake as Rewards**: Creators stake LIFE tokens as quest rewards
- **Earn**: Participants earn LIFE by completing verified quests

---

## 🌐 Network

Currently deployed on **Sui Testnet**.

To get testnet SUI tokens:

- Visit [Sui Testnet Faucet](https://suifaucet.com/)
- Request tokens to your wallet address

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

<div align="center">

**Built with ❤️ on Sui Blockchain**

</div>
