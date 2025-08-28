import { useState, useEffect } from 'react';
import { profileService } from '../../services/profileService';

const EditProfileModal = ({ isOpen, onClose, profile, onProfileUpdate }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    bio: '',
    website: '',
    location: '',
    birthDate: '',
    gender: '',
    visibility: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Helper function to get visibility text
  const getVisibilityText = (visibility) => {
    const visibilityMap = {
      'PUBLIC': 'Công khai',
      'PRIVATE': 'Riêng tư'
    };
    return visibilityMap[visibility] || visibility;
  };

  useEffect(() => {
    if (profile && isOpen) {
      setFormData({
        fullName: profile.full_name || profile.fullName || profile.name || '',
        bio: profile.bio || '',
        website: profile.website || '',
        location: profile.location || '',
        birthDate: profile.birth_date || profile.birthDate ?
          new Date(profile.birth_date || profile.birthDate).toISOString().split('T')[0] : '',
        gender: profile.gender || '',
        visibility: profile.visibility || ''
      });
    }
  }, [profile, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Format birthDate for backend (LocalDateTime expects full timestamp)
      const submitData = { ...formData };
      if (submitData.birthDate && submitData.birthDate.trim() !== '') {
        // Validate date format (YYYY-MM-DD)
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(submitData.birthDate)) {
          throw new Error('Định dạng ngày sinh không hợp lệ');
        }
        // Convert "2004-05-14" to "2004-05-14T00:00:00" for LocalDateTime
        submitData.birthDate = submitData.birthDate + 'T00:00:00';
      } else {
        // Remove empty birthDate to avoid backend errors
        delete submitData.birthDate;
      }

      // Remove empty fields to avoid backend processing issues
      Object.keys(submitData).forEach(key => {
        if (submitData[key] === '' || submitData[key] === null || submitData[key] === undefined) {
          delete submitData[key];
        }
      });

      const updatedProfile = await profileService.updateProfile(submitData);
      onProfileUpdate(updatedProfile);
      onClose();
    } catch (err) {
      setError(err.message || 'Không thể cập nhật profile. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Chỉnh sửa profile</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Thông tin cơ bản
              </h3>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ và tên *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Nhập họ và tên đầy đủ của bạn"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiểu sử
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="Viết vài dòng về bản thân bạn..."
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.bio.length}/500 ký tự
                </p>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vị trí
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Ví dụ: Hà Nội, Việt Nam"
                />
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="https://example.com"
                />
              </div>

              {/* Birth Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày sinh
                </label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giới tính
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">Chọn giới tính</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
              </div>
            </div>



            {/* Privacy Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Quyền riêng tư
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mức độ hiển thị profile
                  {profile?.visibility && (
                    <span className="ml-2 text-sm text-blue-600 font-normal">
                      (Hiện tại: {getVisibilityText(profile.visibility)})
                    </span>
                  )}
                  {!profile?.visibility && (
                    <span className="ml-2 text-sm text-amber-600 font-normal">
                      (Chưa thiết lập)
                    </span>
                  )}
                </label>
                <select
                  name="visibility"
                  value={formData.visibility}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">Chọn mức độ hiển thị</option>
                  <option value="PUBLIC">Công khai - Mọi người có thể xem và follow</option>
                  <option value="PRIVATE">Riêng tư - Chỉ những người được chấp nhận follow mới xem được</option>
                </select>
                <p className="text-sm text-gray-500 mt-1">
                  <strong>Công khai:</strong> Mọi người có thể xem profile và follow bạn trực tiếp<br />
                  <strong>Riêng tư:</strong> Người khác phải gửi yêu cầu follow và chờ bạn chấp nhận mới xem được profile
                </p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Hủy
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Đang lưu...</span>
                  </div>
                ) : (
                  'Lưu thay đổi'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;

