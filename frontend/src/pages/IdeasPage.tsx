import React, { useState } from 'react';
import { useIdeas } from '../hooks/useIdeas';
import { useNavigate } from 'react-router-dom';

export const IdeasPage: React.FC = () => {
    const { createIdea, isCreating, error } = useIdeas();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [validationError, setValidationError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !description.trim()) {
            setValidationError('Both Title and Description are required.');
            return;
        }

        setValidationError(null);
        try {
            const newIdea = await createIdea(title.trim(), description.trim());
            setTitle('');
            setDescription('');
            navigate(`/ideas/${newIdea.id}`);
        } catch (err) {
            // Error is caught and surfaced by the `error` state from useIdeas mapping
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto flex flex-col h-full">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Create a New Idea</h1>
                <p className="text-gray-500 mt-2">
                    Describe the application you want to build and the AI will help break it down into manageable sprint tasks.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                {(error || validationError) && (
                    <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm">
                        {validationError || error}
                    </div>
                )}

                <div className="mb-5">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Idea Title
                    </label>
                    <input
                        id="title"
                        type="text"
                        className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="e.g. Real-time chat application"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={isCreating}
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Description
                    </label>
                    <textarea
                        id="description"
                        rows={5}
                        className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                        placeholder="Describe the main features, target audience, and goals of your idea..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={isCreating}
                    />
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isCreating}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-md transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                    >
                        {isCreating ? 'Creating Idea...' : 'Create Idea'}
                    </button>
                </div>
            </form>
        </div>
    );
};
