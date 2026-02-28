import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useIdeas } from '../../hooks/useIdeas';

export const Sidebar: React.FC = () => {
    const location = useLocation();
    const { ideas, loading, error } = useIdeas();

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
                                        className={`block px-3 py-2 rounded-md transition-colors truncate text-sm ${isActive
                                                ? 'bg-blue-50 text-blue-700 font-medium'
                                                : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        {idea.title}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </nav>
        </aside>
    );
};
