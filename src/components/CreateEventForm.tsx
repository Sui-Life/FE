import React, { useState } from 'react';
import { Button } from './Button';
import { LoadingSpinner } from './LoadingSpinner';
import { Icons } from '@/constants';

interface CreateEventFormData {
    name: string;
    description: string;
    instructions: string;
    rewardAmount: number;
    rewardAsset: 'SUI';
    imageUrl: string;
}

interface FormErrors {
    name?: string;
    description?: string;
    instructions?: string;
    rewardAmount?: string;
    imageUrl?: string;
}

interface CreateEventFormProps {
    onCreate: (data: CreateEventFormData) => Promise<void>;
    isLoading?: boolean;
    runBalance: number;
}

export const CreateEventForm: React.FC<CreateEventFormProps> = ({ onCreate, isLoading = false, runBalance }) => {
    const [formData, setFormData] = useState<CreateEventFormData>({
        name: '',
        description: '',
        instructions: '',
        rewardAmount: 1, // Default 1 SUI
        rewardAsset: 'SUI',
        imageUrl: ''
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [imagePreview, setImagePreview] = useState<string>('');

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Event name is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.instructions.trim()) newErrors.instructions = 'Instructions are required';
        if (formData.rewardAmount <= 0) newErrors.rewardAmount = 'Reward must be greater than 0';

        if (!formData.imageUrl.trim()) {
            newErrors.imageUrl = 'Event image URL is required';
        } else {
            try {
                new URL(formData.imageUrl);
            } catch {
                newErrors.imageUrl = 'Please enter a valid URL';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleImageUrlChange = (url: string) => {
        handleInputChange('imageUrl', url);
        if (url.trim()) {
            try {
                new URL(url);
                setImagePreview(url);
                setErrors(prev => ({ ...prev, imageUrl: '' }));
            } catch {
                setImagePreview('');
            }
        } else {
            setImagePreview('');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        try {
            await onCreate(formData);
            setFormData({
                name: '',
                description: '',
                instructions: '',
                rewardAmount: 1,
                rewardAsset: 'SUI',
                imageUrl: ''
            });
            setImagePreview('');
        } catch (error) {
            console.error('Creation failed:', error);
        }
    };

    const handleInputChange = (field: keyof CreateEventFormData, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    return (
        <div className="max-w-2xl mx-auto fade-in">
            <div className="bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        <Icons.Zap /> Create New Event
                    </h2>
                    <p className="text-slate-400 text-sm">Set up a challenge, lock rewards, and let the race begin.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Event Name */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Event Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:border-transparent"
                            placeholder="e.g. 5km Morning Sprint"
                            maxLength={50}
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:border-transparent min-h-[80px]"
                            placeholder="Briefly describe what this event is about..."
                        />
                        {errors.description && <p className="mt-1 text-sm text-red-400">{errors.description}</p>}
                    </div>

                    {/* Instructions */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Challenge Instructions</label>
                        <textarea
                            value={formData.instructions}
                            onChange={(e) => handleInputChange('instructions', e.target.value)}
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:border-transparent min-h-[100px]"
                            placeholder="Step-by-step instructions for participants (e.g. record with Strava, upload screenshot)..."
                        />
                        {errors.instructions && <p className="mt-1 text-sm text-red-400">{errors.instructions}</p>}
                    </div>

                    {/* Reward Amount - SUI Only */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Reward Amount (SUI)</label>
                        <input
                            type="number"
                            min="0.1"
                            step="0.1"
                            value={formData.rewardAmount}
                            onChange={(e) => handleInputChange('rewardAmount', parseFloat(e.target.value) || 0)}
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:border-transparent"
                        />
                        {errors.rewardAmount && <p className="mt-1 text-sm text-red-400">{errors.rewardAmount}</p>}
                    </div>

                    {/* Image URL */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Event Image URL</label>
                        <input
                            type="url"
                            value={formData.imageUrl}
                            onChange={(e) => handleImageUrlChange(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:border-transparent"
                            placeholder="https://..."
                        />
                        {errors.imageUrl && <p className="mt-1 text-sm text-red-400">{errors.imageUrl}</p>}

                        {imagePreview && (
                            <div className="mt-4 relative">
                                <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg border border-slate-700" />
                                <button
                                    type="button"
                                    onClick={() => { setImagePreview(''); handleInputChange('imageUrl', ''); }}
                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="pt-4">
                        <div className="mb-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                            <div className="flex justify-between items-center text-sm mb-2">
                                <span className="text-slate-400">Creation Fee:</span>
                                <span className="font-mono text-[#39FF14]">10 RUN</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400">Your Balance:</span>
                                <span className={`font-mono ${runBalance < 10 ? 'text-red-400' : 'text-white'}`}>
                                    {runBalance.toFixed(2)} RUN
                                </span>
                            </div>
                            {runBalance < 10 && (
                                <p className="text-xs text-red-400 mt-2 bg-red-400/10 p-2 rounded">
                                    ⚠️ Insufficient RUN tokens. You need at least 10 RUN to create an event.
                                </p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading || runBalance < 10}
                            className="w-full bg-[#39FF14] hover:bg-[#32e612] text-black font-extrabold uppercase py-4 rounded-xl shadow-[0_0_20px_rgba(57,255,20,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <LoadingSpinner size="small" />
                                    <span className="ml-2">Creating Event NFT...</span>
                                </div>
                            ) : (
                                'Create Event'
                            )}
                        </Button>
                        <p className="text-center text-xs text-slate-500 mt-3">
                            * 10 RUN fee will be burned. Reward SUI will be locked.
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};
