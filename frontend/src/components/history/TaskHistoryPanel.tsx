import React from 'react';

export const TaskHistoryPanel: React.FC = () => {
    return (
        <div className="w-80 border-l border-gray-200 bg-white h-full p-4 overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">Task History</h2>
            {/* History components will go here */}
            <p className="text-sm text-gray-500 italic">No history available.</p>
        </div>
    );
};
