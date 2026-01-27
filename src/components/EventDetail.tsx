import React, { useState } from "react";
import { Event } from "@/types";
import { Button } from "./Button";
import { Icons } from "@/constants";

interface EventDetailProps {
  event: Event;
  onBack: () => void;
  onJoin: (eventId: string) => void;
  onSubmitProof: (
    eventId: string,
    proof: string,
    participantId: string,
  ) => void;
  onClaim: (eventId: string, vaultId: string, submissionId?: string) => void;
  userAddress?: string;
  isJoined: boolean;
  isSubmitted: boolean;
  participantObjectId?: string;
}

export const EventDetail: React.FC<EventDetailProps> = ({
  event,
  onBack,
  onJoin,
  onSubmitProof,
  onClaim,
  userAddress,
  isJoined,
  isSubmitted,
  participantObjectId,
}) => {
  const [proofLink, setProofLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock participants for now (ideally fetch these)
  const participants = [
    {
      address: "0x12..34",
      status: "Approved",
      proof: "https://strava.com/...",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!participantObjectId) return;

    setIsSubmitting(true);
    try {
      await onSubmitProof(event.id, proofLink, participantObjectId);
      setProofLink("");
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fade-in max-w-5xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-6 transition-colors"
      >
        <Icons.ArrowRight /> Back to Quests
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: NFT & Stats */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl overflow-hidden border border-[#6FD6F7]/30 shadow-lg">
            <div className="relative aspect-square">
              <img
                src={event.imageUrl}
                alt={event.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded border border-[#6FD6F7]/50">
                <span className="text-[#6FD6F7] text-xs font-bold uppercase">
                  Quest NFT
                </span>
              </div>
            </div>
            <div className="p-4 border-t border-slate-200 bg-slate-50">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-400 text-xs uppercase font-bold">
                  Reward Pool
                </span>
                <span className="text-[#6FD6F7] font-bold text-xl">
                  {event.rewardAmount} {event.rewardAsset}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-xs uppercase font-bold">
                  Status
                </span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded ${
                    event.status === "OPEN"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {event.status}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="text-slate-800 font-bold mb-4 flex items-center gap-2">
              <Icons.Target /> VAULT STATUS
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Vault ID</span>
                <span className="text-slate-300 font-mono text-xs">
                  {event.vaultId
                    ? `${event.vaultId.slice(0, 6)}...${event.vaultId.slice(-4)}`
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Locked</span>
                <span className="text-slate-300">Yes</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Claimed</span>
                <span className="text-slate-300">
                  {event.status === "CLAIMED" ? "Yes" : "No"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Details & Actions */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight mb-2">
              {event.name}
            </h1>
            <p className="text-slate-400 flex items-center gap-2">
              Host:{" "}
              <span className="text-[#6FD6F7] font-mono">
                {event.creator.slice(0, 6)}...{event.creator.slice(-4)}
              </span>
            </p>
          </div>

          <div className="prose prose-invert max-w-none">
            <h3 className="text-slate-800">Quest Description</h3>
            <p className="text-slate-600">{event.description}</p>

            <h3 className="text-slate-800 mt-6">Instructions</h3>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <p className="text-slate-600 whitespace-pre-wrap">
                {event.instructions}
              </p>
            </div>
          </div>

          {/* Action Area */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg space-y-6">
            {/* Status Messages */}
            {event.status === "CLAIMED" && (
              <div className="bg-slate-100 p-4 rounded-xl text-center border border-slate-200">
                <h3 className="text-xl font-bold text-slate-600">
                  Quest Completed
                </h3>
                <p className="text-slate-500">
                  This quest has ended and reward has been claimed.
                </p>
              </div>
            )}

            {/* Participant Actions */}
            {isSubmitted && event.status === "OPEN" ? (
              <div className="bg-green-500/10 rounded-xl p-6 border border-green-500/20 text-center space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/20 text-green-400">
                  <Icons.Check className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Proof Submitted!
                  </h3>
                  <p className="text-slate-400 text-sm">
                    Your proof has been submitted. Claim your reward now!
                  </p>
                </div>
                <Button
                  onClick={() => onClaim(event.id, event.vaultId)}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold animate-pulse"
                >
                  CLAIM REWARD NOW 🏆
                </Button>
              </div>
            ) : !isSubmitted && isJoined && event.status === "OPEN" ? (
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4">
                  Submit Your Proof
                </h3>
                <form onSubmit={handleSubmit} className="flex gap-4">
                  <input
                    type="text"
                    value={proofLink}
                    onChange={(e) => setProofLink(e.target.value)}
                    placeholder="Paste your photo proof link (Google Drive, Imgur, etc.)"
                    className="flex-1 bg-white border border-slate-300 rounded-lg px-4 text-slate-800 focus:border-[#6FD6F7] outline-none"
                    required
                  />
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#6FD6F7] hover:bg-[#5BBCE0] text-black font-bold whitespace-nowrap"
                  >
                    {isSubmitting ? "Verifying..." : "Submit Proof"}
                  </Button>
                </form>
              </div>
            ) : !isJoined && event.status === "OPEN" ? (
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4">
                  Join This Quest
                </h3>
                <Button
                  onClick={() => onJoin(event.id)}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  <Icons.Flag /> Join Quest & Start Your Mission
                </Button>
              </div>
            ) : null}
          </div>

          {/* Participants */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              Live Submissions{" "}
              <span className="text-slate-500 text-sm font-normal">
                ({participants.length})
              </span>
            </h3>
            <div className="space-y-3">
              {participants.map((p, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-xs font-mono text-slate-600">
                      {p.address.slice(2, 4)}
                    </div>
                    <div>
                      <p className="text-sm font-mono text-slate-600">
                        {p.address}
                      </p>
                      <a
                        href="#"
                        className="text-xs text-indigo-400 hover:text-indigo-300"
                      >
                        View Proof
                      </a>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded ${
                      p.status === "Approved"
                        ? "bg-green-900 text-green-300"
                        : "bg-yellow-900 text-yellow-300"
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
