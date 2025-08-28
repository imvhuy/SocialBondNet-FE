import { useState, useRef, useCallback } from 'react';
import { profileService } from '../../services/profileService';

const CoverUploader = ({ currentCover, onClose, onUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [cropData, setCropData] = useState(null);
  const fileInputRef = useRef();
  const canvasRef = useRef();

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file) => {
    setError('');

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Vui lòng chọn file ảnh');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('Kích thước file không được vượt quá 5MB');
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
      // Initialize crop area (3:1 aspect ratio)
      const img = new Image();
      img.onload = () => {
        const targetRatio = 3; // 3:1 ratio
        let width, height, x, y;

        if (img.width / img.height > targetRatio) {
          // Image is wider than 3:1, fit by height
          height = img.height;
          width = height * targetRatio;
          x = (img.width - width) / 2;
          y = 0;
        } else {
          // Image is taller than 3:1, fit by width
          width = img.width;
          height = width / targetRatio;
          x = 0;
          y = (img.height - height) / 2;
        }

        setCropData({
          x, y, width, height,
          imageWidth: img.width,
          imageHeight: img.height
        });
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleCropChange = (newCropData) => {
    setCropData(newCropData);
  };

  const getCroppedImage = () => {
    return new Promise((resolve) => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Set canvas size to desired output size (1200x400 for 3:1 ratio)
        const outputWidth = 1200;
        const outputHeight = 400;
        canvas.width = outputWidth;
        canvas.height = outputHeight;

        // Draw cropped image
        ctx.drawImage(
          img,
          cropData.x, cropData.y, cropData.width, cropData.height,
          0, 0, outputWidth, outputHeight
        );

        // Convert to blob
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/jpeg', 0.9);
      };

      img.src = preview;
    });
  };

  const handleUpload = async () => {
    if (!selectedFile || !cropData) return;

    setUploading(true);
    setError('');

    try {
      const croppedBlob = await getCroppedImage();
      const croppedFile = new File([croppedBlob], `cover-${Date.now()}.jpg`, {
        type: 'image/jpeg'
      });

      const response = await profileService.uploadCover(croppedFile);

      // Extract cover URL from response (account/profile structure)
      const coverUrl = response.profile?.coverImage || response.profile?.cover_image || response.coverImage || response.cover_image || response.url;

      onUpload(coverUrl);
    } catch (err) {
      setError(err.message || 'Không thể tải lên ảnh. Vui lòng thử lại.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Cập nhật ảnh bìa</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {!selectedFile ? (
            // File Selection
            <div className="space-y-6">
              {/* Current Cover */}
              <div className="text-center">
                <div className="inline-block relative">
                  <img
                    src={currentCover || '/abstract-geometric-cover.png'}
                    alt="Current cover"
                    className="w-96 h-32 object-cover rounded-lg border-2 border-gray-200"
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">Ảnh bìa hiện tại</p>
              </div>

              {/* Drag & Drop Area */}
              <div
                className={`
                  border-2 border-dashed rounded-xl p-8 text-center transition-all
                  ${dragActive
                    ? 'border-blue-400 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                  }
                `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>

                  <div>
                    <p className="text-xl font-medium text-gray-900">
                      Kéo thả ảnh bìa vào đây
                    </p>
                    <p className="text-gray-600">hoặc</p>
                  </div>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Chọn ảnh từ máy tính
                  </button>

                  <div className="text-sm text-gray-500">
                    <p>Hỗ trợ: JPG, PNG, GIF</p>
                    <p>Kích thước tối đa: 5MB</p>
                    <p>Tỷ lệ khuyến nghị: 3:1 (ví dụ: 1200x400px)</p>
                  </div>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          ) : (
            // Crop Interface
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-lg font-medium text-gray-900 mb-2">Chỉnh sửa ảnh bìa</p>
                <p className="text-sm text-gray-600">Kéo để di chuyển vùng cắt. Ảnh sẽ được cắt theo tỷ lệ 3:1</p>
              </div>

              {/* Crop Area */}
              <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                <CoverImageCropper
                  src={preview}
                  cropData={cropData}
                  onCropChange={handleCropChange}
                />
              </div>

              {/* Preview */}
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-700 mb-2">Xem trước</p>
                  <div className="w-72 h-24 rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-100">
                    <canvas
                      ref={canvasRef}
                      className="w-full h-full object-cover"
                      style={{ display: 'none' }}
                    />
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-xs text-gray-500">Preview (3:1)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setPreview(null);
                    setCropData(null);
                    setError('');
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Chọn ảnh khác
                </button>

                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {uploading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Đang tải lên...</span>
                    </div>
                  ) : (
                    'Cập nhật ảnh bìa'
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Cover Image Cropper Component (3:1 aspect ratio)
const CoverImageCropper = ({ src, cropData, onCropChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef();

  // Return loading state if cropData is not available
  if (!cropData) {
    return (
      <div className="relative inline-block max-w-full max-h-96 overflow-hidden">
        <img
          src={src}
          alt="Cover crop preview"
          className="max-w-full max-h-96 object-contain"
          draggable={false}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="text-white text-sm">Đang tải...</div>
        </div>
      </div>
    );
  }

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    const rect = containerRef.current.getBoundingClientRect();
    setDragStart({
      x: e.clientX - rect.left - cropData.x,
      y: e.clientY - rect.top - cropData.y
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current || !cropData) return;

    const rect = containerRef.current.getBoundingClientRect();
    const newX = e.clientX - rect.left - dragStart.x;
    const newY = e.clientY - rect.top - dragStart.y;

    // Constrain to image boundaries
    const maxX = cropData.imageWidth - cropData.width;
    const maxY = cropData.imageHeight - cropData.height;

    onCropChange({
      ...cropData,
      x: Math.max(0, Math.min(maxX, newX)),
      y: Math.max(0, Math.min(maxY, newY))
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      ref={containerRef}
      className="relative inline-block max-w-full max-h-96 overflow-hidden cursor-move"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <img
        src={src}
        alt="Cover crop preview"
        className="max-w-full max-h-96 object-contain"
        draggable={false}
      />

      {/* Crop Overlay - Only render when cropData is available */}
      {cropData && (
        <div
          className="absolute border-2 border-blue-500 bg-blue-500 bg-opacity-20"
          style={{
            left: cropData.x,
            top: cropData.y,
            width: cropData.width,
            height: cropData.height,
            cursor: isDragging ? 'grabbing' : 'grab'
          }}
          onMouseDown={handleMouseDown}
        >
          {/* Corner handles */}
          <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 border border-white rounded-full" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 border border-white rounded-full" />
          <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 border border-white rounded-full" />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 border border-white rounded-full" />

          {/* 3:1 ratio indicator */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
            3:1
          </div>
        </div>
      )}
    </div>
  );
};

export default CoverUploader;

