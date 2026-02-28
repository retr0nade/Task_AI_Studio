import React, { useEffect } from 'react';
import { Task } from '../../types/task';
import { useTaskHistory } from '../../hooks/useTaskHistory';

interface TaskHistoryPanelProps {
    task: Task | null;
    isOpen: boolean;
    onClose: () => void;
}

export const TaskHistoryPanel: React.FC<TaskHistoryPanelProps> = ({ task, isOpen, onClose }) => {
    const { history, loading, error, fetchHistory, clearHistory } = useTaskHistory();

    useEffect(() => {
        if (isOpen && task) {
            fetchHistory(task.id);
        } else if (!isOpen) {
            // Optional: debounce clear or keep until newly opened
            setTimeout(clearHistory, 300);
        }
    }, [isOpen, task, fetchHistory, clearHistory]);

    // Format utility
    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <>
            {/* Backdrop for mobile or contextual focus */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/10 z-40 transition-opacity"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            {/* Sliding Panel */}
            <div
                className={`fixed top-0 right-0 h-full w-80 lg:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col border-l border-gray-200 ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Task History
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-200"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="p-5 overflow-y-auto flex-1">
                    {task && (
                        <div className="mb-6 pb-4 border-b border-gray-100">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Selected Task</span>
                            <h3 className="text-sm font-semibold text-gray-800 leading-snug">{task.title}</h3>
                        </div>
                    )}

                    {loading ? (
                        <div className="flex justify-center items-center py-10">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : error ? (
                        <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md border border-red-100">
                            {error}
                        </div>
                    ) : history.length === 0 ? (
                        <div className="text-center py-10">
                            <svg className="w-12 h-12 text-gray-200 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            <p className="text-sm text-gray-500">No history elements recorded yet.</p>
                        </div>
                    ) : (
                        <div className="relative border-l-2 border-gray-100 ml-3 space-y-6 pb-4">
                            {history.map((entry) => (
                                <div key={entry.id} className="relative pl-6">
                                    {/* Timeline dot */}
                                    <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-blue-400 ring-4 ring-white" />

                                    <div className="bg-gray-50 rounded-md p-3 border border-gray-100 shadow-sm">
                                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                            <span className="text-[11px] font-medium text-gray-500 bg-white px-1.5 py-0.5 rounded border border-gray-200 shadow-sm">
                                                {entry.from_status.replace('_', ' ')}
                                            </span>
                                            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                            <span className="text-[11px] font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 shadow-sm">
                                                {entry.to_status.replace('_', ' ')}
                                            </span>
                                        </div>

                                        <p className="text-[10px] text-gray-400 font-medium">
                                            {formatDate(entry.changed_at)}
                                        </p>

                                        {entry.note && (
                                            <p className="mt-2 text-xs text-gray-600 italic border-l-2 border-gray-200 pl-2">
                                                "{entry.note}"
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
