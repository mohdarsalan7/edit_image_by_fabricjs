import { FiArrowUp, FiArrowDown, FiTrash2 } from 'react-icons/fi';

export const ObjectActions = ({ onBringForward, onSendBackward, onDelete }) => (
  <div className="bg-gray-100 rounded-lg p-4">
    <h2 className="font-medium text-gray-700 mb-3">Object Actions</h2>
    <div className="grid grid-cols-3 gap-2">
      <button
        onClick={onBringForward}
        className="p-2 bg-white rounded-md hover:bg-gray-200 transition-colors flex flex-col items-center"
        title="Bring forward"
      >
        <FiArrowUp className="w-4 h-4 text-gray-700" />
        <span className="text-xs mt-1">Forward</span>
      </button>
      <button
        onClick={onSendBackward}
        className="p-2 bg-white rounded-md hover:bg-gray-200 transition-colors flex flex-col items-center"
        title="Send backward"
      >
        <FiArrowDown className="w-4 h-4 text-gray-700" />
        <span className="text-xs mt-1">Backward</span>
      </button>
      <button
        onClick={onDelete}
        className="p-2 bg-red-100 rounded-md hover:bg-red-200 transition-colors flex flex-col items-center text-red-700"
        title="Delete"
      >
        <FiTrash2 className="w-4 h-4" />
        <span className="text-xs mt-1">Delete</span>
      </button>
    </div>
  </div>
);
