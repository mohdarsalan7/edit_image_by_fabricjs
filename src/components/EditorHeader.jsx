import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  EditorHeader,
  TextTool,
  ShapeTool,
  ObjectActions,
  CanvasOverlay,
} from './components';

const Editor = () => {
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  const [error, setError] = useState({
    isLoading: true,
    hasError: false,
    isDownloading: false,
  });
  const [textContent, setTextContent] = useState('');
  const [fontSize, setFontSize] = useState(24);
  const [fontColor, setFontColor] = useState('#000000');
  const [shapeColor, setShapeColor] = useState('#FF0000');
  const [selectedObject, setSelectedObject] = useState(null);

  // Canvas initialization and image loading logic remains same as before

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <EditorHeader
          onBack={() => navigate('/')}
          onExport={downloadImage}
          exportState={error}
        />

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4 p-4">
          <div className="space-y-6">
            <TextTool
              textContent={textContent}
              setTextContent={setTextContent}
              fontSize={fontSize}
              setFontSize={setFontSize}
              fontColor={fontColor}
              setFontColor={setFontColor}
              onAddText={addText}
              onUpdateText={updateText}
              selectedObject={selectedObject}
            />

            <ShapeTool
              shapeColor={shapeColor}
              setShapeColor={setShapeColor}
              onAddShape={addShape}
            />

            {selectedObject && (
              <ObjectActions
                onBringForward={bringForward}
                onSendBackward={sendBackward}
                onDelete={deleteSelected}
              />
            )}
          </div>

          <div className="relative flex items-center justify-center bg-gray-200 rounded-lg overflow-hidden">
            <CanvasOverlay
              isLoading={error.isLoading}
              hasError={error.hasError}
              onRetry={() => navigate('/')}
            />

            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              className={`w-full h-full border-2 border-gray-600 ${
                error.isLoading || error.hasError ? 'opacity-30' : 'opacity-100'
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
