import React from "react";
import { Event } from "@/types";
import { Icons } from "@/constants";

interface EventCardProps {
  event: Event;
  isJoined?: boolean;
  isSubmitted?: boolean;
  onJoin?: (id: string) => void;
  onView?: (id: string) => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  isJoined = false,
  isSubmitted = false,
  onJoin,
}) => {
  const isEnded = event.status === "CLAIMED";

  const getStatusBadge = () => {
    if (isEnded) {
      return (
        <span className="px-2 py-1 backdrop-blur-md border rounded text-[10px] font-bold uppercase tracking-widest bg-slate-100 border-slate-300 text-slate-500">
          ENDED
        </span>
      );
    }
    if (isSubmitted) {
      return (
        <span className="px-2 py-1 backdrop-blur-md border rounded text-[10px] font-bold uppercase tracking-widest bg-green-500/20 border-green-500/30 text-green-400">
          SUBMITTED
        </span>
      );
    }
    if (isJoined) {
      return (
        <span className="px-2 py-1 backdrop-blur-md border rounded text-[10px] font-bold uppercase tracking-widest bg-blue-500/20 border-blue-500/30 text-blue-400">
          JOINED
        </span>
      );
    }
    return (
      <span className="px-2 py-1 backdrop-blur-md border rounded text-[10px] font-bold uppercase tracking-widest bg-[#6FD6F7]/10 border-[#6FD6F7]/20 text-[#6FD6F7]">
        OPEN
      </span>
    );
  };

  const getButtonContent = () => {
    if (isEnded) {
      return {
        text: "See Results",
        className:
          "bg-slate-200 text-slate-500 hover:bg-slate-300 cursor-pointer",
        icon: <Icons.Trophy className="w-4 h-4" />,
      };
    }
    if (isSubmitted) {
      return {
        text: "View Status",
        className:
          "bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200",
        icon: <Icons.Check className="w-4 h-4" />,
      };
    }
    if (isJoined) {
      return {
        text: "Submit Proof",
        className: "bg-blue-600 text-white hover:bg-blue-500",
        icon: <Icons.Flag className="w-4 h-4" />,
      };
    }
    return {
      text: "Join Quest",
      className: "bg-[#6FD6F7] text-black hover:bg-[#5BBCE0]",
      icon: <Icons.Flag className="w-4 h-4" />,
    };
  };

  const buttonConfig = getButtonContent();

  return (
    <div className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-[#6FD6F7] transition-all duration-300 shadow-sm hover:shadow-lg">
      <div className="relative aspect-video overflow-hidden bg-slate-950">
        <img
          src={event.imageUrl}
          alt={event.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-80" />

        <div className="absolute top-3 left-3 flex gap-2">
          {getStatusBadge()}
        </div>

        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
          <div>
            <h3 className="text-xl font-bold text-slate-800 tracking-tight">
              {event.name}
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-1">
              By {event.creator.slice(0, 6)}...{event.creator.slice(-4)}
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1 space-y-4">
        <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase">
            Reward
          </span>
          <div className="flex items-center gap-1">
            <span className="text-lg font-bold text-[#6FD6F7]">
              {event.rewardAmount}
            </span>
            <span className="text-lg font-bold text-[#4DA2FF]">SUI</span>
          </div>
        </div>

        <button
          onClick={() => onJoin?.(event.id)}
          className={`w-full h-11 rounded-lg font-bold text-xs uppercase transition-colors flex items-center justify-center gap-2 ${buttonConfig.className}`}
        >
          {buttonConfig.icon} {buttonConfig.text}
        </button>
      </div>
    </div>
  );
};
