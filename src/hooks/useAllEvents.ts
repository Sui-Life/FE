import { useQuery } from "@tanstack/react-query";
import { useSuiClient } from "@mysten/dapp-kit";
import { Event } from "@/types";
import { CONTRACT_CONFIG } from "@/config/contract";

// Helper to parse strings from Move vector<u8>
const bytesToString = (data: any): string => {
  if (typeof data === "string") return data;
  if (Array.isArray(data))
    return new TextDecoder().decode(new Uint8Array(data));
  return "";
};

/**
 * Hook untuk mengambil SEMUA Event yang ada di blockchain
 * Berbeda dengan useEvents yang hanya mengambil event milik user yang login
 */
export const useAllEvents = () => {
  const suiClient = useSuiClient();

  const eventType = `${CONTRACT_CONFIG.EVENT_PACKAGE_ID}::event::Event`;

  const {
    data: events,
    isPending: isLoading,
    error,
    refetch: refreshEvents,
  } = useQuery({
    queryKey: ["allEvents", eventType],
    queryFn: async () => {
      try {
        // Query semua transaksi yang memanggil create_event
        const txBlocks = await suiClient.queryTransactionBlocks({
          filter: {
            MoveFunction: {
              package: CONTRACT_CONFIG.EVENT_PACKAGE_ID,
              module: "event",
              function: "create_event",
            },
          },
          options: {
            showObjectChanges: true,
          },
          limit: 50,
        });

        // Extract Event object IDs from transaction results
        // Shared objects appear as 'created' with objectType matching our Event
        const eventObjectIds: string[] = [];

        for (const tx of txBlocks.data) {
          if (tx.objectChanges) {
            for (const change of tx.objectChanges) {
              if (
                change.type === "created" &&
                change.objectType === eventType
              ) {
                eventObjectIds.push(change.objectId);
              }
            }
          }
        }

        if (eventObjectIds.length === 0) {
          return [];
        }

        // Fetch all Event objects by their IDs
        const objectResponses = await suiClient.multiGetObjects({
          ids: eventObjectIds,
          options: {
            showContent: true,
            showDisplay: true,
            showOwner: true,
          },
        });

        // Parse events from object responses
        const parsedEvents: Event[] = objectResponses
          .filter((obj) => obj.data?.content)
          .map((obj) => {
            const content = obj.data?.content;
            if (!content || content.dataType !== "moveObject") return null;

            const fields = (content as any).fields;

            return {
              id: obj.data?.objectId || "",
              name: bytesToString(fields?.name) || "Unknown Event",
              creator: fields?.creator || "",
              description: bytesToString(fields?.description) || "",
              instructions: bytesToString(fields?.instructions) || "",
              rewardAmount: Number(fields?.reward_amount || 0) / 1_000_000_000,
              rewardAsset: bytesToString(fields?.reward_asset) as "SUI" | "RUN",
              status: (fields?.reward_claimed ? "CLAIMED" : "OPEN") as
                | "OPEN"
                | "CLAIMED",
              imageUrl: bytesToString(fields?.image_url) || "",
              participantsCount: 0,
              createdAt: Date.now(),
              vaultId: fields?.vault_id || "",
              winner: fields?.winner?.fields?.vec?.[0] || undefined,
            };
          })
          .filter((event): event is Event => event !== null);

        return parsedEvents;
      } catch (err) {
        console.error("Error fetching all events:", err);
        throw err;
      }
    },
    staleTime: 10000,
    refetchInterval: 15000, // Refetch every 15 seconds
  });

  return {
    events: events || [],
    isLoading,
    error,
    refreshEvents,
  };
};
