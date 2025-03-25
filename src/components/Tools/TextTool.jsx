import { FiType } from 'react-icons/fi';

export const TextTool = ({
  textContent,
  setTextContent,
  fontSize,
  setFontSize,
  fontColor,
  setFontColor,
  onAddText,
  onUpdateText,
  selectedObject,
}) => (
  <div className="bg-gray-100 rounded-lg p-4">
    <h2 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
      <FiType className="text-blue-600" />
      <span>Text</span>
    </h2>

    <div className="space-y-3">
      <div>
        <label className="block text-sm text-gray-600 mb-1">Content</label>
        <input
          type="text"
          value={textContent}
          onChange={(e) => setTextContent(e.target.value)}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter text"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Size</label>
          <input
            type="number"
            value={fontSize}
            onChange={(e) =>
              setFontSize(Math.max(8, parseInt(e.target.value) || 16))
            }
            className="w-full p-2 border rounded-md"
            min="8"
            max="120"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={fontColor}
              onChange={(e) => setFontColor(e.target.value)}
              className="w-8 h-8 cursor-pointer"
            />
            <span className="text-xs">{fontColor}</span>
          </div>
        </div>
      </div>

      <button
        onClick={selectedObject?.type === 'textbox' ? onUpdateText : onAddText}
        className={`w-full py-2 px-4 rounded-md transition-colors ${
          selectedObject?.type === 'textbox'
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-green-600 hover:bg-green-700 text-white'
        }`}
      >
        {selectedObject?.type === 'textbox' ? 'Update Text' : 'Add Text'}
      </button>
    </div>
  </div>
);
