import { useState, useRef, useCallback } from 'react';
import { profileService } from '../../services/profileService';

const AvatarUploader = ({ currentAvatar, onClose, onUpload }) => {
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
      // Initialize crop area (center square)
      const img = new Image();
      img.onload = () => {
        const size = Math.min(img.width, img.height);
        const x = (img.width - size) / 2;
        const y = (img.height - size) / 2;
        setCropData({
          x, y, width: size, height: size,
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
        // Set canvas size to desired output size (400x400)
        const outputSize = 400;
        canvas.width = outputSize;
        canvas.height = outputSize;

        // Draw cropped image
        ctx.drawImage(
          img,
          cropData.x, cropData.y, cropData.width, cropData.height,
          0, 0, outputSize, outputSize
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
      const croppedFile = new File([croppedBlob], `avatar-${Date.now()}.jpg`, {
        type: 'image/jpeg'
      });

      const response = await profileService.uploadAvatar(croppedFile);

      // Extract avatar URL from response (account/profile structure)
      const avatarUrl = response.profile?.avatarUrl || response.profile?.avatar || response.avatar || response.url;

      onUpload(avatarUrl);
    } catch (err) {
      setError(err.message || 'Không thể tải lên ảnh. Vui lòng thử lại.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Cập nhật ảnh đại diện</h2>
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
              {/* Current Avatar */}
              <div className="text-center">
                <div className="inline-block relative">
                  <img
                    src={currentAvatar || '/abstract-user-representation.png'}
                    alt="Current avatar"
                    className="w-32 h-32 rounded-full border-4 border-gray-200"
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">Ảnh đại diện hiện tại</p>
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>

                  <div>
                    <p className="text-xl font-medium text-gray-900">
                      Kéo thả ảnh vào đây
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
                <p className="text-lg font-medium text-gray-900 mb-2">Chỉnh sửa ảnh</p>
                <p className="text-sm text-gray-600">Kéo để di chuyển và thay đổi kích thước vùng cắt</p>
              </div>

              {/* Crop Area */}
              <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                <ImageCropper
                  src={preview}
                  cropData={cropData}
                  onCropChange={handleCropChange}
                />
              </div>

              {/* Preview */}
              <div className="flex items-center justify-center space-x-8">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-700 mb-2">Xem trước</p>
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
                    <canvas
                      ref={canvasRef}
                      className="w-full h-full object-cover"
                      style={{ display: 'none' }}
                    />
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-xs text-gray-500">Preview</span>
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
                    'Cập nhật ảnh đại diện'
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

// Simple Image Cropper Component
const ImageCropper = ({ src, cropData, onCropChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef();

  const handleMouseDown = (e) => {
    if (!cropData) return;
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
        alt="Crop preview"
        className="max-w-full max-h-96 object-contain"
        draggable={false}
      />

      {/* Crop Overlay */}
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
        </div>
      )}
    </div>
  );
};

export default AvatarUploader;

