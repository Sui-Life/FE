import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSignAndExecuteTransaction, useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { CONTRACT_CONFIG } from '@/config/contract';

interface CreateEventData {
    name: string;
    description: string;
    instructions: string;
    rewardAmount: number;
    rewardAsset: 'SUI' | 'RUN';
    imageUrl: string;
}

interface UseCreateEventOptions {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
    showToast?: (message: string, type: 'success' | 'error') => void;
}

const RUN_COIN_TYPE = `${CONTRACT_CONFIG.TOKEN_PACKAGE_ID}::${CONTRACT_CONFIG.TOKEN_MODULE_NAME}::RUN_TOKEN`;
const EVENT_FEE_AMOUNT = 10_000_000_000n; // 10 RUN with 9 decimals

export const useCreateEvent = (options?: UseCreateEventOptions) => {
    const queryClient = useQueryClient();
    const client = useSuiClient();
    const currentAccount = useCurrentAccount();
    const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();

    return useMutation({
        mutationFn: async (data: CreateEventData) => {
            if (!currentAccount) {
                throw new Error('Please connect your wallet first');
            }

            // Fetch User's RUN Coins
            const { data: runCoins } = await client.getCoins({
                owner: currentAccount.address,
                coinType: RUN_COIN_TYPE
            });

            if (runCoins.length === 0) {
                throw new Error('You do not have any RUN tokens to pay the event fee (10 RUN).');
            }

            // Calculate total balance of RUN
            const totalRunBalance = runCoins.reduce((sum, coin) => sum + BigInt(coin.balance), 0n);
            if (totalRunBalance < EVENT_FEE_AMOUNT) {
                throw new Error('Insufficient RUN balance. You need 10 RUN to create an event.');
            }

            const tx = new Transaction();

            // Handle RUN Fee Payment
            // 1. Merge all RUN coins into primary coin if necessary to ensure sufficient balance in one object
            // If the first coin has enough, we just use it.
            // If not, we merge.
            let primaryCoinInput;

            if (runCoins.length > 1) {
                // Merge all other coins into the first one
                const primaryCoinId = runCoins[0].coinObjectId;
                const coinsToMerge = runCoins.slice(1).map(c => c.coinObjectId);
                tx.mergeCoins(tx.object(primaryCoinId), coinsToMerge.map(id => tx.object(id)));
                primaryCoinInput = tx.object(primaryCoinId);
            } else {
                primaryCoinInput = tx.object(runCoins[0].coinObjectId);
            }

            // 2. Split 10 RUN for the fee
            const [feeCoin] = tx.splitCoins(primaryCoinInput, [tx.pure.u64(EVENT_FEE_AMOUNT)]);

            // Calculate reward amount in MIST (assuming 9 decimals for SUI)
            const rewardInMist = BigInt(data.rewardAmount * 1_000_000_000);

            // Split SUI Payment for Reward
            const [rewardCoin] = tx.splitCoins(tx.gas, [tx.pure.u64(rewardInMist)]);

            // Call create_event
            tx.moveCall({
                target: `${CONTRACT_CONFIG.EVENT_PACKAGE_ID}::${CONTRACT_CONFIG.MODULE_NAME}::${CONTRACT_CONFIG.FUNCTIONS.CREATE_EVENT}`,
                arguments: [
                    tx.pure.string(data.name),
                    tx.pure.string(data.description),
                    tx.pure.string(data.instructions),
                    tx.pure.string(data.imageUrl),
                    tx.pure.u64(rewardInMist),
                    rewardCoin,
                    feeCoin
                ]
            });
            // Objects are transferred inside the move function, no need to handle them here.

            const result = await signAndExecuteTransaction({
                transaction: tx
            });

            return result;
        },
        onSuccess: async (result) => {
            options?.showToast?.('Event created successfully! Fee paid & Reward locked.', 'success');
            queryClient.invalidateQueries({ queryKey: ['getOwnedObjects'] });
            queryClient.invalidateQueries({ queryKey: ['getBalance'] }); // Update balances
            options?.onSuccess?.();
        },
        onError: (error) => {
            console.error('Error creating event:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to create event.';
            options?.showToast?.(errorMessage, 'error');
            options?.onError?.(error instanceof Error ? error : new Error(errorMessage));
        }
    });
};
