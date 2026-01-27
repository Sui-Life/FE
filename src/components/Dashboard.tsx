import React from "react";
import { Event } from "@/types";
import { Icons } from "@/constants";
import { Button } from "./Button";

interface DashboardProps {
  currentAccount: string | null;
  myEvents: Event[];
  joinedEvents: Event[];
  submittedEventIds: string[];
  submissionObjects: Record<string, string>; // Add submissionObjects
  onClaim: (eventId: string, vaultId: string, submissionId?: string) => void;
  onViewEvent: (event: Event) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  currentAccount,
  myEvents,
  joinedEvents,
  submittedEventIds,
  onClaim,
  onViewEvent,
}) => {
  const [activeTab, setActiveTab] = React.useState<"joined" | "created">(
    "joined",
  );

  if (!currentAccount) {
    return (
      <div className="text-center py-20 text-slate-400">
        <Icons.Zap />
        <p className="mt-4">
          Please connect your wallet to view your dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="fade-in space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-xs uppercase font-bold mb-2">
            Quests Joined
          </p>
          <p className="text-3xl font-black text-slate-800">
            {joinedEvents.length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-xs uppercase font-bold mb-2">
            Quests Created
          </p>
          <p className="text-3xl font-black text-[#6FD6F7]">
            {myEvents.length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-xs uppercase font-bold mb-2">
            Proofs Submitted
          </p>
          <p className="text-3xl font-black text-blue-400">
            {
              joinedEvents.filter((e) => submittedEventIds.includes(e.id))
                .length
            }
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-xs uppercase font-bold mb-2">
            Total Earnings
          </p>
          <p className="text-3xl font-black text-yellow-400">--</p>
        </div>
      </div>

      {/* Dashboard Tabs */}
      <div className="flex gap-4 border-b border-slate-200 pb-4">
        <button
          onClick={() => setActiveTab("joined")}
          className={`text-sm font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition-all ${
            activeTab === "joined"
              ? "bg-slate-800 text-white"
              : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
          }`}
        >
          Joined Quests
        </button>
        <button
          onClick={() => setActiveTab("created")}
          className={`text-sm font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition-all ${
            activeTab === "created"
              ? "bg-[#6FD6F7] text-slate-800"
              : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
          }`}
        >
          Created Quests
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {activeTab === "joined" && (
          <div>
            {joinedEvents.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <p>
                  You haven't joined any quests yet. Explore and take real
                  action!
                </p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-slate-900/50 text-slate-400 text-xs uppercase">
                  <tr>
                    <th className="p-4">Quest Name</th>
                    <th className="p-4">Reward</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {joinedEvents.map((event) => {
                    const isSubmitted = submittedEventIds.includes(event.id);
                    return (
                      <tr
                        key={event.id}
                        className="hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="p-4 font-bold text-slate-800">
                          {event.name}
                        </td>
                        <td className="p-4 font-mono text-[#6FD6F7]">
                          {event.rewardAmount} {event.rewardAsset}
                        </td>
                        <td className="p-4">
                          {event.status === "CLAIMED" ? (
                            <span className="text-red-400 text-xs bg-red-400/10 px-2 py-1 rounded">
                              Ended
                            </span>
                          ) : isSubmitted ? (
                            <span className="text-blue-400 text-xs bg-blue-400/10 px-2 py-1 rounded">
                              Submitted
                            </span>
                          ) : (
                            <span className="text-yellow-400 text-xs bg-yellow-400/10 px-2 py-1 rounded">
                              In Progress
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <Button
                            onClick={() => onViewEvent(event)}
                            className="text-xs py-1 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700"
                          >
                            View Details
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === "created" && (
          <div>
            {myEvents.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <p>
                  You haven't created any quests yet. Start one and invite
                  others!
                </p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-slate-900/50 text-slate-400 text-xs uppercase">
                  <tr>
                    <th className="p-4">Quest Name</th>
                    <th className="p-4">Participants</th>
                    <th className="p-4">Vault Status</th>
                    <th className="p-4">Creator Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {myEvents.map((event) => (
                    <tr
                      key={event.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="p-4">
                        <div className="font-bold text-slate-800">
                          {event.name}
                        </div>
                        <div className="text-xs text-slate-500 truncate max-w-[200px]">
                          {event.description}
                        </div>
                      </td>
                      <td className="p-4 text-slate-600">
                        {event.participantsCount || 0}
                      </td>
                      <td className="p-4">
                        {event.status === "CLAIMED" ? (
                          <span className="text-slate-500 text-xs bg-slate-800 px-2 py-1 rounded">
                            Disbursed
                          </span>
                        ) : (
                          <span className="text-green-400 text-xs bg-green-400/10 px-2 py-1 rounded">
                            Locked
                          </span>
                        )}
                      </td>
                      <td className="p-4 flex gap-2">
                        <Button
                          onClick={() => onViewEvent(event)}
                          className="text-xs py-1 px-3 bg-slate-800 hover:bg-slate-700 text-white"
                        >
                          View
                        </Button>
                        {event.status === "OPEN" && (
                          <Button
                            onClick={() => onClaim(event.id, event.vaultId)}
                            className="text-xs py-1 px-3 bg-yellow-600 hover:bg-yellow-500 text-white font-bold"
                          >
                            Claim & End
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
