import React, { useState } from 'react';
import { Button } from './Button';
import { Icons } from '@/constants';
import { LoadingSpinner } from './LoadingSpinner';

interface BuyRunModalProps {
    isOpen: boolean;
    onClose: () => void;
    onBuy: (amount: number) => Promise<void>;
    suiBalance: number;
}

export const BuyRunModal: React.FC<BuyRunModalProps> = ({ isOpen, onClose, onBuy, suiBalance }) => {
    const [amount, setAmount] = useState<number>(1);
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleBuy = async () => {
        setIsLoading(true);
        await onBuy(amount);
        setIsLoading(false);
        onClose();
    };

    const runRate = 1000; // 1 SUI = 1000 RUN

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm fade-in">
            <div className="bg-[#0b0e14] border border-slate-800 rounded-2xl w-full max-w-md p-6 relative shadow-[0_0_40px_rgba(57,255,20,0.1)]">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-500 hover:text-white"
                >
                    ✕
                </button>

                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-[#39FF14] flex items-center justify-center text-black text-xs font-bold">$</span>
                    Buy RUN Tokens
                </h3>

                <div className="space-y-6">
                    <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                        <div className="flex justify-between mb-2">
                            <label className="text-sm text-slate-400">Pay with SUI</label>
                            <span className="text-xs text-slate-500">Balance: {suiBalance.toFixed(3)} SUI</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                value={amount}
                                step="0.001"
                                min="0.001"
                                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                                className="bg-transparent text-2xl font-bold text-white outline-none w-full"
                            />
                            <div className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-lg">
                                <span className="w-4 h-4 rounded-full bg-blue-500"></span>
                                <span className="font-bold text-sm">SUI</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center text-slate-500">
                        <Icons.ArrowRight className="rotate-90" />
                    </div>

                    <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                        <div className="flex justify-between mb-2">
                            <label className="text-sm text-slate-400">Receive RUN</label>
                            <span className="text-xs text-slate-500">Rate: 0.001 SUI = 1 RUN</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                value={amount * runRate}
                                disabled
                                className="bg-transparent text-2xl font-bold text-[#39FF14] outline-none w-full"
                            />
                            <div className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-lg">
                                <span className="w-4 h-4 rounded-full bg-[#39FF14]"></span>
                                <span className="font-bold text-sm">RUN</span>
                            </div>
                        </div>
                    </div>

                    <Button
                        onClick={handleBuy}
                        disabled={isLoading || amount <= 0 || amount > suiBalance}
                        className="w-full bg-[#39FF14] hover:bg-[#32e612] text-black font-extrabold uppercase py-4 rounded-xl"
                    >
                        {isLoading ? <LoadingSpinner size="small" /> : 'Confirm Swap'}
                    </Button>
                </div>
            </div>
        </div>
    );
};
