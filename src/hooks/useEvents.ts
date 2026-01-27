import { useQueryClient } from '@tanstack/react-query';
import { useSuiClientQuery } from '@mysten/dapp-kit';
import { Event } from '@/types';
import { CONTRACT_CONFIG } from '@/config/contract';

// Helper to parse strings from Move vector<u8>
const bytesToString = (data: any): string => {
    if (typeof data === 'string') return data;
    if (Array.isArray(data)) return new TextDecoder().decode(new Uint8Array(data));
    return '';
};

export const useEvents = (ownerAddress: string | null) => {
    const queryClient = useQueryClient();

    const {
        data: ownedObjects,
        isPending: isLoading,
        error,
        refetch: refreshEvents
    } = useSuiClientQuery(
        'getOwnedObjects',
        {
            owner: ownerAddress || '',
            filter: {
                StructType: `${CONTRACT_CONFIG.EVENT_PACKAGE_ID}::event::Event`
            },
            options: {
                showContent: true,
                showDisplay: true
            }
        },
        {
            enabled: !!ownerAddress,
            staleTime: 10000,
            refetchInterval: 10000,
        }
    );

    // Parse events from the query result
    const events: Event[] = ownedObjects?.data?.map((obj: any) => {
        const content = obj.data?.content;

        if (!content) return null;

        return {
            id: obj.data?.objectId || '',
            name: bytesToString(content.fields?.name) || 'Unknown Event',
            creator: content.fields?.creator || '',
            description: bytesToString(content.fields?.description) || '',
            instructions: bytesToString(content.fields?.instructions) || '',
            rewardAmount: Number(content.fields?.reward_amount || 0) / 1_000_000_000, // Convert MIST to SUI
            rewardAsset: bytesToString(content.fields?.reward_asset) as 'SUI' | 'RUN',
            status: (content.fields?.reward_claimed ? 'CLAIMED' : 'OPEN') as 'OPEN' | 'CLAIMED',
            imageUrl: bytesToString(content.fields?.image_url) || '',
            participantsCount: 0, // Not in contract
            createdAt: Date.now(),
            vaultId: content.fields?.vault_id || '',
            winner: content.fields?.winner?.fields?.vec?.[0] || undefined // Option<address> handling
        };
    }).filter((event: Event | null): event is Event => event !== null) || [];

    return {
        events,
        isLoading,
        error,
        refreshEvents
    };
};
