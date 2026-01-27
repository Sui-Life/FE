import React, { useState } from "react";
import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import {
  EventList,
  CreateEventForm,
  Navigation,
  WalletConnect,
  ToastContainer,
  EventDetail,
  BuyRunModal,
  Dashboard,
} from "@/components";
import {
  useEvents,
  useAllEvents,
  useCreateEvent,
  useToast,
  useClaimReward,
  useBuyRun,
  useJoinEvent,
  useSubmitProof,
  useUserParticipation,
} from "@/hooks";
import { Icons } from "@/constants";
import { CONTRACT_CONFIG } from "@/config/contract";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"events" | "create" | "dashboard">(
    "events"
  );
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isBuyRunModalOpen, setIsBuyRunModalOpen] = useState(false);

  const currentAccount = useCurrentAccount();
  const { toasts, showSuccess, showError, removeToast } = useToast();

  // useAllEvents: Fetch ALL events from blockchain (for EventList)
  const {
    events: allEvents,
    isLoading: isAllEventsLoading,
    refreshEvents: refreshAllEvents,
  } = useAllEvents();

  // useEvents: Fetch only MY events (for Dashboard)
  const {
    events: myEvents,
    isLoading: isMyEventsLoading,
    refreshEvents: refreshMyEvents,
  } = useEvents(currentAccount?.address || null);

  const {
    joinedEventIds,
    submittedEventIds,
    participantObjects,
    submissionObjects,
    refetch: refreshParticipation,
  } = useUserParticipation();

  // Fetch SUI Balance
  const { data: balanceData } = useSuiClientQuery(
    "getBalance",
    {
      owner: currentAccount?.address || "",
    },
    {
      enabled: !!currentAccount,
      refetchInterval: 5000,
    }
  );

  const suiBalance = balanceData
    ? Number(balanceData.totalBalance) / 1_000_000_000
    : 0;

  // Fetch RUN Balance
  const { data: runBalanceData } = useSuiClientQuery(
    "getBalance",
    {
      owner: currentAccount?.address || "",
      coinType: `${CONTRACT_CONFIG.TOKEN_PACKAGE_ID}::${CONTRACT_CONFIG.TOKEN_MODULE_NAME}::RUN_TOKEN`,
    },
    {
      enabled: !!currentAccount,
      refetchInterval: 5000,
    }
  );

  const runBalance = runBalanceData
    ? Number(runBalanceData.totalBalance) / 1_000_000_000
    : 0;

  const handleRefresh = async () => {
    // Wait for node indexing
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await Promise.all([
      refreshAllEvents(),
      refreshMyEvents(),
      refreshParticipation(),
    ]);
  };

  const createEventMutation = useCreateEvent({
    onSuccess: async () => {
      setActiveTab("events");
      showSuccess("Event created successfully! Participants can now join.");
      await handleRefresh();
    },
    showToast: (message, type) => {
      if (type === "success") {
        showSuccess(message);
      } else {
        showError(message);
      }
    },
  });

  const claimRewardMutation = useClaimReward({
    onSuccess: async () => {
      showSuccess("Reward claimed successfully! Winner selected.");
      await handleRefresh();
    },
    showToast: (message, type) => {
      if (type === "success") showSuccess(message);
      else showError(message);
    },
  });

  const handleCreateEvent = async (data: any) => {
    if (!currentAccount) {
      showError("Please connect your wallet first");
      return;
    }
    await createEventMutation.mutateAsync(data);
  };

  const handleJoinEvent = (id: string) => {
    if (!currentAccount) {
      showError("Please connect wallet to join race");
      return;
    }
    setSelectedEventId(id);
  };

  const { mutateAsync: buyRun } = useBuyRun({
    onSuccess: () => {
      // Success toast is handled in hook
    },
    showToast: (message, type) => {
      if (type === "success") showSuccess(message);
      else showError(message);
    },
  });

  const joinEventMutation = useJoinEvent({
    onSuccess: async () => {
      showSuccess("Joined Event!");
      await handleRefresh();
    },
    showToast: (m, t) => (t === "success" ? showSuccess(m) : showError(m)),
  });

  const submitProofMutation = useSubmitProof({
    onSuccess: async () => {
      showSuccess("Proof Submitted!");
      await handleRefresh();
    },
    showToast: (m, t) => (t === "success" ? showSuccess(m) : showError(m)),
  });

  const handleBuyRun = async (amount: number) => {
    if (!currentAccount) {
      showError("Please connect your wallet first");
      return;
    }
    await buyRun({ amountSui: amount });
  };

  const selectedEvent = allEvents.find((e) => e.id === selectedEventId);

  return (
    <div className="min-h-screen">
      <nav className="fixed top-0 left-0 right-0 h-16 glass border-b shadow-lg shadow-[#39FF14]/5 z-50 px-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => {
              setActiveTab("events");
              setSelectedEventId(null);
            }}
          >
            <div className="w-8 h-8 bg-[#39FF14] rounded flex items-center justify-center text-black shadow-[0_0_10px_rgba(57,255,20,0.5)]">
              <Icons.Zap />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-white uppercase italic">
              Run<span className="text-[#39FF14]">2</span>Earn
            </span>
          </div>

          <Navigation
            activeTab={activeTab}
            onTabChange={(tab) => {
              setActiveTab(tab);
              setSelectedEventId(null);
            }}
            onBuyRun={() => setIsBuyRunModalOpen(true)}
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end leading-none">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">
              Network: Testnet
            </span>
            {currentAccount && (
              <div className="flex flex-col items-end gap-1">
                <span className="text-[11px] font-mono text-white">
                  {currentAccount.address.slice(0, 6)}...
                  {currentAccount.address.slice(-4)}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-[#39FF14]">
                    {suiBalance.toFixed(3)} SUI
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-[#FFA500]">
                    {runBalance.toFixed(2)} RUN
                  </span>
                </div>
              </div>
            )}
          </div>
          <WalletConnect />
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-24 pb-12">
        {selectedEventId && selectedEvent ? (
          <EventDetail
            event={selectedEvent}
            onBack={() => setSelectedEventId(null)}
            onJoin={(eventId) => {
              joinEventMutation.mutateAsync({ eventId });
            }}
            onSubmitProof={(eventId, proof, participantId) => {
              submitProofMutation.mutateAsync({
                eventId,
                proof,
              });
            }}
            onClaim={(eventId, vaultId) => {
              const submissionId = submissionObjects[eventId];
              if (submissionId) {
                claimRewardMutation.mutateAsync({
                  eventId,
                  vaultId,
                  submissionId,
                });
              } else {
                showError("Submission ID not found. Cannot claim.");
              }
            }}
            userAddress={currentAccount?.address}
            isJoined={joinedEventIds.includes(selectedEvent.id)}
            isSubmitted={submittedEventIds.includes(selectedEvent.id)}
            participantObjectId={participantObjects[selectedEvent.id]}
          />
        ) : (
          <>
            {activeTab === "events" && (
              <EventList
                events={allEvents}
                joinedEventIds={joinedEventIds}
                submittedEventIds={submittedEventIds}
                onJoin={handleJoinEvent}
                onCreateClick={() => setActiveTab("create")}
              />
            )}

            {activeTab === "create" && (
              <div className="py-12">
                <CreateEventForm
                  onCreate={handleCreateEvent}
                  isLoading={createEventMutation.isPending}
                  runBalance={runBalance}
                />
              </div>
            )}

            {activeTab === "dashboard" && (
              <Dashboard
                currentAccount={currentAccount?.address || null}
                myEvents={myEvents || []}
                joinedEvents={
                  allEvents?.filter((e) => joinedEventIds.includes(e.id)) || []
                }
                submittedEventIds={submittedEventIds}
                submissionObjects={submissionObjects}
                onClaim={(eventId, vaultId, submissionId) => {
                  if (submissionId) {
                    claimRewardMutation.mutateAsync({
                      eventId,
                      vaultId,
                      submissionId,
                    });
                  } else {
                    showError("Submission ID not found. Cannot claim.");
                  }
                }}
                onViewEvent={(event) => {
                  setSelectedEventId(event.id);
                }}
              />
            )}
          </>
        )}
      </main>

      <BuyRunModal
        isOpen={isBuyRunModalOpen}
        onClose={() => setIsBuyRunModalOpen(false)}
        onBuy={handleBuyRun}
        suiBalance={suiBalance}
      />

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};
export default App;
