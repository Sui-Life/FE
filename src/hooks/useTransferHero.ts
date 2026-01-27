import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSignAndExecuteTransaction, useCurrentAccount } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';

interface TransferHeroData {
  heroId: string;
  recipientAddress: string;
}

interface UseTransferHeroOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  showToast?: (message: string, type: 'success' | 'error') => void;
}

export const useTransferHero = (options?: UseTransferHeroOptions) => {
  const queryClient = useQueryClient();
  const currentAccount = useCurrentAccount();
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  return useMutation({
    mutationFn: async (data: TransferHeroData) => {
      if (!currentAccount) {
        throw new Error('Please connect your wallet first');
      }

      const tx = new Transaction();
      tx.transferObjects([tx.object(data.heroId)], data.recipientAddress);

      const result = await signAndExecuteTransaction({
        transaction: tx
      });

      return result;
    },
    onSuccess: async () => {
      options?.showToast?.('Hero transferred successfully!', 'success');

      // Immediately invalidate and refetch for real-time updates
      // Match any query that contains 'getOwnedObjects' (useSuiClientQuery generates its own keys)
      queryClient.invalidateQueries({ 
        predicate: (query) => {
          const key = query.queryKey;
          return Array.isArray(key) && key.some((k: any) => 
            typeof k === 'string' && k.includes('getOwnedObjects')
          );
        }
      });
      await queryClient.refetchQueries({ 
        predicate: (query) => {
          const key = query.queryKey;
          return Array.isArray(key) && key.some((k: any) => 
            typeof k === 'string' && k.includes('getOwnedObjects')
          );
        }
      });

      // Backup refetch
      setTimeout(async () => {
        await queryClient.refetchQueries({ 
          predicate: (query) => {
            const key = query.queryKey;
            return Array.isArray(key) && key.some((k: any) => 
              typeof k === 'string' && k.includes('getOwnedObjects')
            );
          }
        });
      }, 2000);

      options?.onSuccess?.();
    },
    onError: (error) => {
      console.error('Error transferring hero:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to transfer hero. Please try again.';
      options?.showToast?.(errorMessage, 'error');
      options?.onError?.(error instanceof Error ? error : new Error(errorMessage));
    }
  });
};

