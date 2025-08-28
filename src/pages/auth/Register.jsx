"use client";

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../../services/authService";
import "./Login.css";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    DOB: { day: "", month: "", year: "" },
    gender: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Họ và tên là bắt buộc";
    if (!formData.email.trim()) newErrors.email = "Email là bắt buộc";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Email không hợp lệ";
    if (!formData.password) newErrors.password = "Mật khẩu là bắt buộc";
    else if (formData.password.length < 6)
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    if (!formData.DOB.day || !formData.DOB.month || !formData.DOB.year)
      newErrors.DOB = "Ngày sinh là bắt buộc";
    if (!formData.gender) newErrors.gender = "Giới tính là bắt buộc";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setErrors({});

    try {
      // Send OTP to email
      await authService.sendOTP(formData.email, 'EMAIL_VERIFICATION');
      
      // Prepare user data for OTP verification
      const userData = {
        fullName: formData.fullName,
        email: formData.email,
        dateOfBirth: `${formData.DOB.year}-${formData.DOB.month.padStart(2, "0")}-${formData.DOB.day.padStart(2, "0")}T00:00:00`,
        gender: formData.gender === 'male' ? 'Nam' : formData.gender === 'female' ? 'Nữ' : 'Khác',
        password: formData.password,
        confirmPassword: formData.confirmPassword
      };

      // Navigate to OTP verification with user data
      navigate("/otp-verification", { state: { userData, isRegistration: true } });
    } catch (error) {
      console.error('Send OTP error:', error);
      setErrors({ submit: error.message || 'Không thể gửi mã OTP. Vui lòng thử lại.' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field === "DOB") {
      setFormData({ ...formData, DOB: { ...formData.DOB, ...value } });
    } else {
      setFormData({ ...formData, [field]: value });
    }
    if (errors[field]) setErrors({ ...errors, [field]: "" });
  };

  // Data for dropdowns
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    { value: "1", label: "Tháng 1" },
    { value: "2", label: "Tháng 2" },
    { value: "3", label: "Tháng 3" },
    { value: "4", label: "Tháng 4" },
    { value: "5", label: "Tháng 5" },
    { value: "6", label: "Tháng 6" },
    { value: "7", label: "Tháng 7" },
    { value: "8", label: "Tháng 8" },
    { value: "9", label: "Tháng 9" },
    { value: "10", label: "Tháng 10" },
    { value: "11", label: "Tháng 11" },
    { value: "12", label: "Tháng 12" },
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 60 }, (_, i) => currentYear - 15 - i);

  const EyeIcon = ({ show }) => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      {show ? (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
        />
      ) : (
        <>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </>
      )}
    </svg>
  );

  const SelectDropdown = ({ value, onChange, options, placeholder, error }) => (
    <div className="relative gender-select-wrapper">
      <div className="gender-select">
        <select
          className={error ? "border-red-500" : ""}
          value={value}
          onChange={onChange}
          required
        >
          <option value="" disabled style={{ color: "#94a3b8" }}>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="select-arrow">
          <svg
            className="w-4 h-4 text-slate-200 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden login-background flex flex-col">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 grid-pattern"></div>
        </div>
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        <div className="particle particle-4"></div>
        <div className="particle particle-5"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center">
        <div className="login-card mx-auto">
          <div className="relative">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="logo-container">
                  <div className="logo-icon">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <h1 className="logo-text mb-2">SocialBondNet</h1>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              {/* Full Name */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Họ và tên"
                  className={`form-input ${
                    errors.fullName ? "border-red-500" : ""
                  }`}
                  value={formData.fullName}
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                  required
                />
                <div className="absolute right-4 top-4">
                  <svg
                    className="w-5 h-5 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                {errors.fullName && (
                  <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div className="relative">
                <input
                  type="email"
                  placeholder="Email"
                  className={`form-input ${
                    errors.email ? "border-red-500" : ""
                  }`}
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
                <div className="absolute right-4 top-4">
                  <svg
                    className="w-5 h-5 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </div>
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <label className="text-slate-300 text-sm font-medium">
                  Ngày sinh
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <SelectDropdown
                    value={formData.DOB.day}
                    onChange={(e) =>
                      handleInputChange("DOB", { day: e.target.value })
                    }
                    options={days.map((day) => ({ value: day, label: day }))}
                    placeholder="Ngày"
                    error={errors.DOB}
                  />
                  <SelectDropdown
                    value={formData.DOB.month}
                    onChange={(e) =>
                      handleInputChange("DOB", { month: e.target.value })
                    }
                    options={months}
                    placeholder="Tháng"
                    error={errors.DOB}
                  />
                  <SelectDropdown
                    value={formData.DOB.year}
                    onChange={(e) =>
                      handleInputChange("DOB", { year: e.target.value })
                    }
                    options={years.map((year) => ({
                      value: year,
                      label: year,
                    }))}
                    placeholder="Năm"
                    error={errors.DOB}
                  />
                </div>
                {errors.DOB && (
                  <p className="text-red-400 text-xs mt-1">{errors.DOB}</p>
                )}
              </div>

              {/* Gender */}
              <div>
                <SelectDropdown
                  value={formData.gender}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  options={[
                    { value: "male", label: "Nam" },
                    { value: "female", label: "Nữ" },
                    { value: "other", label: "Khác" },
                  ]}
                  placeholder="Chọn giới tính"
                  error={errors.gender}
                />
                {errors.gender && (
                  <p className="text-red-400 text-xs mt-1">{errors.gender}</p>
                )}
              </div>

              {/* Password */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mật khẩu"
                  className={`form-input ${
                    errors.password ? "border-red-500" : ""
                  }`}
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  required
                />
                <button
                  type="button"
                  className="absolute right-4 top-4 text-slate-400 hover:text-cyan-400 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  <EyeIcon show={showPassword} />
                </button>
                {errors.password && (
                  <p className="text-red-400 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Xác nhận mật khẩu"
                  className={`form-input ${
                    errors.confirmPassword ? "border-red-500" : ""
                  }`}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  required
                />
                <button
                  type="button"
                  className="absolute right-4 top-4 text-slate-400 hover:text-cyan-400 transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex={-1}
                >
                  <EyeIcon show={showConfirmPassword} />
                </button>
                {errors.confirmPassword && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="text-center">
                  <p className="text-red-400 text-sm">{errors.submit}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="submit-button"
              >
                {loading && (
                  <div className="loading-overlay">
                    <div className="loading-spinner"></div>
                  </div>
                )}
                <span className={loading ? "opacity-0" : "opacity-100"}>
                  {loading ? 'Đang gửi mã...' : 'Tạo tài khoản'}
                </span>
              </button>
            </form>

            {/* Toggle to Login */}
            <div className="mt-8 text-center">
              <p className="text-slate-200 mb-4">Đã có tài khoản?</p>
              <Link to="/login" className="toggle-link">
                Đăng nhập ngay
                <div className="toggle-underline"></div>
              </Link>
            </div>

            {/* Social Login */}
            <div className="mt-8">
              <div className="flex items-center mb-6">
                <div className="divider-line"></div>
                <span className="px-4 text-slate-200 text-sm">hoặc</span>
                <div className="divider-line"></div>
              </div>
              <button type="button" className="social-button">
                <svg className="social-icon w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Đăng ký với Google
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center">
        <div className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-center text-slate-200 text-sm">
            <span>© 2024 SocialBondNet</span>
            <div className="flex items-center space-x-4">
              <a href="#" className="hover:text-cyan-400 transition-colors">
                Điều khoản
              </a>
              <a href="#" className="hover:text-cyan-400 transition-colors">
                Bảo mật
              </a>
              <a href="#" className="hover:text-cyan-400 transition-colors">
                Hỗ trợ
              </a>
            </div>
          </div>
        </div>
      </footer>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900/50 to-transparent pointer-events-none"></div>
    </div>
  );
};

export default Register;
