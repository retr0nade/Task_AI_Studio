import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useIdeas } from '../../hooks/useIdeas';
import { Idea } from '../../types/idea';
import { IdeaModal } from '../IdeaModal';
import { useToast } from '../ToastProvider';

export const Sidebar: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { ideas, loading, error, updateIdea, deleteIdea } = useIdeas();

    const [isIdeaModalOpen, setIsIdeaModalOpen] = useState(false);
    const [editingIdea, setEditingIdea] = useState<Idea | null>(null);

    const handleEditIdea = (idea: Idea, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setEditingIdea(idea);
        setIsIdeaModalOpen(true);
    };

    const handleDeleteIdea = async (idea: Idea, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (window.confirm(`Are you sure you want to delete "${idea.title}"? This will permanently delete all associated tasks and history.`)) {
            try {
                await deleteIdea(idea.id);
                showToast('Idea deleted successfully', 'success');
                // If we are currently viewing the deleted idea, redirect to home
                if (location.pathname.startsWith(`/ideas/${idea.id}`)) {
                    navigate('/ideas');
                }
            } catch (err) {
                showToast('Failed to delete idea', 'error');
            }
        }
    };

    const handleModalSubmit = async (title: string, description: string) => {
        if (editingIdea) {
            await updateIdea(editingIdea.id, title, description);
            showToast('Idea updated successfully', 'success');
        }
    };

    return (
        <aside className="w-64 bg-white border-r border-gray-200 shadow-sm h-full flex flex-col">
            <div className="p-6 border-b border-gray-100 flex-shrink-0">
                <h2 className="text-xl font-bold text-gray-800">Task AI Studio</h2>
            </div>

            <div className="p-4 flex-shrink-0">
                <Link
                    to="/ideas"
                    className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium text-sm"
                >
                    + New Idea
                </Link>
            </div>

            <nav className="p-4 flex-1 overflow-y-auto">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Your Ideas
                </h3>

                {loading && (
                    <div className="text-sm text-gray-500 py-2">Loading ideas...</div>
                )}

                {error && (
                    <div className="text-sm text-red-500 bg-red-50 p-2 rounded mb-2">
                        {error}
                    </div>
                )}

                {!loading && !error && ideas.length === 0 && (
                    <div className="text-sm text-gray-500 italic py-2">No ideas created yet.</div>
                )}

                {!loading && ideas.length > 0 && (
                    <ul className="space-y-1">
                        {ideas.map((idea) => {
                            const isActive = location.pathname.startsWith(`/ideas/${idea.id}`);
                            return (
                                <li key={idea.id}>
                                    <Link
                                        to={`/ideas/${idea.id}`}
                                        className={`flex items-center justify-between group px-3 py-2 rounded-md transition-colors text-sm ${isActive
                                            ? 'bg-blue-50 text-blue-700 font-medium'
                                            : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        <span className="truncate pr-2">{idea.title}</span>
                                        <div className={`flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? 'opacity-100' : ''}`}>
                                            <button
                                                onClick={(e) => handleEditIdea(idea, e)}
                                                className="p-1 text-gray-400 hover:text-blue-600 rounded"
                                                title="Edit Idea"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                            </button>
                                            <button
                                                onClick={(e) => handleDeleteIdea(idea, e)}
                                                className="p-1 text-gray-400 hover:text-red-600 rounded"
                                                title="Delete Idea"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                            </button>
                                        </div>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </nav>

            <IdeaModal
                isOpen={isIdeaModalOpen}
                onClose={() => setIsIdeaModalOpen(false)}
                initialData={editingIdea || undefined}
                onSubmit={handleModalSubmit}
            />
        </aside>
    );
};
