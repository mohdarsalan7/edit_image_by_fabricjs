import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FiType,
  FiSquare,
  FiCircle,
  FiTriangle,
  FiLayers,
  FiArrowUp,
  FiArrowDown,
  FiTrash2,
  FiDownload,
  FiChevronLeft,
} from 'react-icons/fi';

const Editor = () => {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  const [error, setError] = useState({
    isLoading: true,
    hasError: false,
    isDownloading: false,
  });
  const [activeTool, setActiveTool] = useState(null);
  const [textContent, setTextContent] = useState('');
  const [fontSize, setFontSize] = useState(24);
  const [fontColor, setFontColor] = useState('#000000');
  const [shapeColor, setShapeColor] = useState('#FF0000');
  const [selectedObject, setSelectedObject] = useState(null);

  // Initialize canvas
  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      backgroundColor: '#f8fafc',
      preserveObjectStacking: true,
    });
    fabricRef.current = canvas;

    // Event handlers
    canvas.on('selection:created', () => {
      const obj = canvas.getActiveObject();
      setSelectedObject(obj);
      if (obj?.type === 'textbox') {
        setTextContent(obj.text);
        setFontSize(obj.fontSize);
        setFontColor(obj.fill);
        setActiveTool('text');
      }
    });

    canvas.on('selection:cleared', () => {
      setSelectedObject(null);
      setActiveTool(null);
    });

    return () => canvas.dispose();
  }, []);

  // Load image
  // Load image
  useEffect(() => {
    if (!state?.imgUrl || !fabricRef.current) return;

    setError({ isLoading: true, hasError: false, isDownloading: false });

    fabric.Image.fromURL(
      state.imgUrl,
      (img) => {
        const canvas = fabricRef.current;

        img.set({
          left: canvas.width / 2,
          top: canvas.height / 2,
          originX: 'center',
          originY: 'center',
          scaleX: 1.5,
          scaleY: 1.5,
        });

        canvas.clear().add(img).setActiveObject(img).renderAll();
        setError((prev) => ({ ...prev, isLoading: false }));
      },
      {
        crossOrigin: 'anonymous',
        errorHandler: () =>
          setError({ isLoading: false, hasError: true, isDownloading: false }),
      },
    );
  }, [state?.imgUrl]);

  // Add text to canvas
  const addText = () => {
    const canvas = fabricRef.current;
    const text = new fabric.Textbox(textContent || 'Edit me', {
      left: canvas.width / 2,
      top: canvas.height / 2,
      fontSize,
      fill: fontColor,
      fontFamily: 'Arial',
      originX: 'center',
      originY: 'center',
      hasControls: true,
      padding: 10,
      borderColor: '#3b82f6',
      cornerColor: '#3b82f6',
      cornerSize: 8,
      transparentCorners: false,
    });

    canvas.add(text).setActiveObject(text).renderAll();
    setSelectedObject(text);
    setActiveTool('text');
  };

  // Update selected text
  const updateText = () => {
    const obj = fabricRef.current.getActiveObject();
    if (obj?.type === 'textbox') {
      obj.set({ text: textContent, fontSize, fill: fontColor });
      fabricRef.current.renderAll();
    }
  };

  // Add shape to canvas
  const addShape = (type) => {
    const canvas = fabricRef.current;
    const center = { left: canvas.width / 2, top: canvas.height / 2 };
    let shape;

    switch (type) {
      case 'rectangle':
        shape = new fabric.Rect({
          width: 100,
          height: 100,
          fill: shapeColor,
          ...center,
          originX: 'center',
          originY: 'center',
        });
        break;
      case 'circle':
        shape = new fabric.Circle({
          radius: 50,
          fill: shapeColor,
          ...center,
          originX: 'center',
          originY: 'center',
        });
        break;
      case 'triangle':
        shape = new fabric.Triangle({
          width: 100,
          height: 100,
          fill: shapeColor,
          ...center,
          originX: 'center',
          originY: 'center',
        });
        break;
      default:
        return;
    }

    canvas.add(shape).setActiveObject(shape).renderAll();
    setSelectedObject(shape);
    setActiveTool('shape');
  };

  // Layer operations
  const bringForward = () => {
    const obj = fabricRef.current.getActiveObject();
    if (obj) {
      obj.bringForward();
      fabricRef.current.renderAll();
    }
  };

  const sendBackward = () => {
    const obj = fabricRef.current.getActiveObject();
    if (obj) {
      obj.sendBackwards();
      fabricRef.current.renderAll();
    }
  };

  const deleteSelected = () => {
    const obj = fabricRef.current.getActiveObject();
    if (obj) {
      fabricRef.current.remove(obj).renderAll();
      setSelectedObject(null);
    }
  };

  // Download image
  const downloadImage = () => {
    if (error.isLoading || error.hasError) return;

    setError((prev) => ({ ...prev, isDownloading: true }));

    try {
      const link = document.createElement('a');
      link.href = fabricRef.current.toDataURL({ format: 'png', quality: 1 });
      link.download = `design-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setError((prev) => ({ ...prev, isDownloading: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded-lg transition-colors"
          >
            <FiChevronLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className="text-xl font-bold">Image Editor</h1>
          <button
            onClick={downloadImage}
            disabled={error.isLoading || error.hasError}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              error.isLoading || error.hasError
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            <FiDownload className="w-5 h-5" />
            <span>{error.isDownloading ? 'Exporting...' : 'Export'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4 p-4">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Text Tool */}
            <div className="bg-gray-100 rounded-lg p-4">
              <h2 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                <FiType className="text-blue-600" />
                <span>Text</span>
              </h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Content
                  </label>
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
                    <label className="block text-sm text-gray-600 mb-1">
                      Size
                    </label>
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
                    <label className="block text-sm text-gray-600 mb-1">
                      Color
                    </label>
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
                  onClick={
                    selectedObject?.type === 'textbox' ? updateText : addText
                  }
                  className={`w-full py-2 px-4 rounded-md transition-colors ${
                    selectedObject?.type === 'textbox'
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {selectedObject?.type === 'textbox'
                    ? 'Update Text'
                    : 'Add Text'}
                </button>
              </div>
            </div>

            {/* Shapes Tool */}
            <div className="bg-gray-100 rounded-lg p-4">
              <h2 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                <FiLayers className="text-green-600" />
                <span>Shapes</span>
              </h2>

              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => addShape('rectangle')}
                    className="p-3 bg-white rounded-md hover:bg-gray-200 transition-colors flex flex-col items-center"
                  >
                    <FiSquare className="w-5 h-5 text-gray-700" />
                    <span className="text-xs mt-1">Rectangle</span>
                  </button>
                  <button
                    onClick={() => addShape('circle')}
                    className="p-3 bg-white rounded-md hover:bg-gray-200 transition-colors flex flex-col items-center"
                  >
                    <FiCircle className="w-5 h-5 text-gray-700" />
                    <span className="text-xs mt-1">Circle</span>
                  </button>
                  <button
                    onClick={() => addShape('triangle')}
                    className="p-3 bg-white rounded-md hover:bg-gray-200 transition-colors flex flex-col items-center"
                  >
                    <FiTriangle className="w-5 h-5 text-gray-700" />
                    <span className="text-xs mt-1">Triangle</span>
                  </button>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Color
                  </label>
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

            {/* Object Actions */}
            {selectedObject && (
              <div className="bg-gray-100 rounded-lg p-4">
                <h2 className="font-medium text-gray-700 mb-3">
                  Object Actions
                </h2>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={bringForward}
                    className="p-2 bg-white rounded-md hover:bg-gray-200 transition-colors flex flex-col items-center"
                    title="Bring forward"
                  >
                    <FiArrowUp className="w-4 h-4 text-gray-700" />
                    <span className="text-xs mt-1">Forward</span>
                  </button>
                  <button
                    onClick={sendBackward}
                    className="p-2 bg-white rounded-md hover:bg-gray-200 transition-colors flex flex-col items-center"
                    title="Send backward"
                  >
                    <FiArrowDown className="w-4 h-4 text-gray-700" />
                    <span className="text-xs mt-1">Backward</span>
                  </button>
                  <button
                    onClick={deleteSelected}
                    className="p-2 bg-red-100 rounded-md hover:bg-red-200 transition-colors flex flex-col items-center text-red-700"
                    title="Delete"
                  >
                    <FiTrash2 className="w-4 h-4" />
                    <span className="text-xs mt-1">Delete</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Canvas Area */}
          <div className="relative flex items-center justify-center bg-gray-200 rounded-lg overflow-hidden">
            {error.isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="mt-4 text-gray-700">Loading your image...</p>
                </div>
              </div>
            )}

            {error.hasError && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10">
                <div className="text-center p-6 bg-red-50 rounded-lg max-w-sm">
                  <p className="text-red-600 font-medium">
                    Oops! Loading failed
                  </p>
                  <p className="text-gray-600 mt-2">
                    We couldn't load your image. Please try another one.
                  </p>
                  <button
                    onClick={() => navigate('/')}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Choose Another Image
                  </button>
                </div>
              </div>
            )}

            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              className={`w-full h-full border-2 border-gray-600  ${
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
