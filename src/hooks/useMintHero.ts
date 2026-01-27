import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSignAndExecuteTransaction, useCurrentAccount } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { CONTRACT_CONFIG } from '@/config/contract';

interface MintHeroData {
  name: string;
  imageUrl: string;
}

interface UseMintHeroOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  showToast?: (message: string, type: 'success' | 'error') => void;
}

export const useMintHero = (options?: UseMintHeroOptions) => {
  const queryClient = useQueryClient();
  const currentAccount = useCurrentAccount();
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  return useMutation({
    mutationFn: async (data: MintHeroData) => {
      if (!currentAccount) {
        throw new Error('Please connect your wallet first');
      }

      const tx = new Transaction();
      tx.moveCall({
        target: `${CONTRACT_CONFIG.PACKAGE_ID}::${CONTRACT_CONFIG.MODULE_NAME}::mint_hero`,
        arguments: [
          tx.pure.string(data.name),
          tx.pure.string(data.imageUrl)
        ]
      });

      const result = await signAndExecuteTransaction({
        transaction: tx
      });

      return result;
    },
    onSuccess: async (result) => {
      options?.showToast?.('Hero successfully minted! Refreshing collection...', 'success');

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
      console.error('Error minting hero:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to mint hero. Please try again.';
      options?.showToast?.(errorMessage, 'error');
      options?.onError?.(error instanceof Error ? error : new Error(errorMessage));
    }
  });
};

