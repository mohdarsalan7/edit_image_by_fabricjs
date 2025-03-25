import { FiLayers, FiSquare, FiCircle, FiTriangle } from 'react-icons/fi';

export const ShapeTool = ({ shapeColor, setShapeColor, onAddShape }) => (
  <div className="bg-gray-100 rounded-lg p-4">
    <h2 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
      <FiLayers className="text-green-600" />
      <span>Shapes</span>
    </h2>

    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => onAddShape('rectangle')}
          className="p-3 bg-white rounded-md hover:bg-gray-200 transition-colors flex flex-col items-center"
        >
          <FiSquare className="w-5 h-5 text-gray-700" />
          <span className="text-xs mt-1">Rectangle</span>
        </button>
        <button
          onClick={() => onAddShape('circle')}
          className="p-3 bg-white rounded-md hover:bg-gray-200 transition-colors flex flex-col items-center"
        >
          <FiCircle className="w-5 h-5 text-gray-700" />
          <span className="text-xs mt-1">Circle</span>
        </button>
        <button
          onClick={() => onAddShape('triangle')}
          className="p-3 bg-white rounded-md hover:bg-gray-200 transition-colors flex flex-col items-center"
        >
          <FiTriangle className="w-5 h-5 text-gray-700" />
          <span className="text-xs mt-1">Triangle</span>
        </button>
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">Color</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={shapeColor}
            onChange={(e) => setShapeColor(e.target.value)}
            className="w-8 h-8 cursor-pointer"
          />
          <span className="text-xs">{shapeColor}</span>
        </div>
      </div>
    </div>
  </div>
);
