import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSignAndExecuteTransaction, useCurrentAccount } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { CONTRACT_CONFIG } from '@/config/contract';

interface BuyRunData {
    amountSui: number;
}

interface UseBuyRunOptions {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
    showToast?: (message: string, type: 'success' | 'error') => void;
}

export const useBuyRun = (options?: UseBuyRunOptions) => {
    const queryClient = useQueryClient();
    const currentAccount = useCurrentAccount();
    const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();

    return useMutation({
        mutationFn: async (data: BuyRunData) => {
            if (!currentAccount) {
                throw new Error('Please connect your wallet first');
            }

            const tx = new Transaction();

            // Calculate amount in MIST
            const amountMist = BigInt(Math.floor(data.amountSui * 1_000_000_000));

            // Expected RUN amount (1 SUI = 1000 RUN based on contract 1000 run_per_sui)
            // But function takes 'amount_run' as argument.
            // Wait, let's re-read the move code.
            // buy_run(vault, price, amount_run, sui_coin, state)
            // It calculates required_sui = (amount_run + price.run_per_sui - 1) / price.run_per_sui
            // If we want to spend X SUI, we should calculate how much RUN we get.
            // Price is 1000 RUN per 1 SUI.
            // So if input is 1 SUI, amount_run should be 1000 * 1_000_000_000 (if 9 decimals).
            // The `init` function sets initial supply as 1000 * 1_000_000_000.
            // The `create_currency` sets decimals to 9.
            // So 1 RUN token = 1_000_000_000 raw units.
            // Price is 1_000 (run_per_sui).
            // Logic: required_sui = amount_run / 1000.  (simplified)
            // So amount_run = amount_sui_mist * 1000.

            const amountRun = amountMist * BigInt(1000);

            // Split coin for payment
            const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(amountMist)]);

            tx.moveCall({
                target: `${CONTRACT_CONFIG.TOKEN_PACKAGE_ID}::${CONTRACT_CONFIG.TOKEN_MODULE_NAME}::${CONTRACT_CONFIG.FUNCTIONS.BUY_RUN}`,
                arguments: [
                    tx.object(CONTRACT_CONFIG.TOKEN_VAULT_ID),
                    tx.object(CONTRACT_CONFIG.TOKEN_PRICE_ID),
                    tx.pure.u64(amountRun),
                    coin,
                    tx.object(CONTRACT_CONFIG.TOKEN_STATE_ID)
                ]
            });

            const result = await signAndExecuteTransaction({
                transaction: tx
            });

            return result;
        },
        onSuccess: async () => {
            options?.showToast?.('Successfully swapped SUI for RUN!', 'success');
            // Invalidate balance queries - assuming we have one for RUN usually.
            // But we only have getOwnedObjects usage so far.
            // If we add getCoinBalance for RUN later, we should invalidate it here.
            queryClient.invalidateQueries({ queryKey: ['getBalance'] }); // Refetch SUI balance at least
            options?.onSuccess?.();
        },
        onError: (error) => {
            console.error('Error buying RUN:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to buy RUN.';
            options?.showToast?.(errorMessage, 'error');
            options?.onError?.(error instanceof Error ? error : new Error(errorMessage));
        }
    });
};
