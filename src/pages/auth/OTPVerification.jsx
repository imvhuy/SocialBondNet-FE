"use client";

import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { authService } from "../../services/authService";
import SuccessModal from "../../components/ui/SuccessModal";
import "./Login.css";

const OTPVerification = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loginData, setLoginData] = useState(null);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Get user data from registration
  const userData = location.state?.userData;
  const isRegistration = location.state?.isRegistration || false;
  const userEmail = userData?.email || "user@example.com";

  useEffect(() => {
    // Redirect if no user data
    if (!userData) {
      navigate(isRegistration ? "/register" : "/login");
      return;
    }

    // Start countdown for resend
    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [userData, navigate, isRegistration]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const newOtp = [...otp];

    for (let i = 0; i < pastedData.length && i < 6; i++) {
      if (/^\d$/.test(pastedData[i])) {
        newOtp[i] = pastedData[i];
      }
    }

    setOtp(newOtp);
    setError("");
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      setError("Vui lòng nhập đầy đủ mã OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (isRegistration) {
        // For registration - call sign-up API
        const signUpData = {
          ...userData,
          otpCode: otpCode
        };

        const response = await authService.signUp(signUpData);

        // Decode JWT to get user ID (same as Login.jsx)
        let userId = null;
        try {
          const tokenPayload = JSON.parse(atob(response.accessToken.split('.')[1]));
          userId = tokenPayload.userId;
        } catch (e) {
          console.warn('Could not decode token for user ID:', e);
        }

        // Create user data from response (same structure as Login.jsx)
        const loginData = {
          id: userId,
          email: response.email || userData.email,
          name: response.email ? response.email.split('@')[0] : userData.fullName,
          avatar: response.user?.avatar || "/abstract-user-representation.png"
        };

        // Store complete login data for later use (including tokens)
        setLoginData({
          userData: loginData,
          accessToken: response.accessToken,
          refreshToken: response.refreshToken
        });

        // Show success modal first
        setShowSuccessModal(true);
      } else {
        // For other OTP verification (e.g., password reset)
        // This would be implemented based on your needs
        setError("Chức năng này chưa được hỗ trợ");
      }
    } catch (err) {
      console.error('OTP verification error:', err);
      setError(err.message || "Mã OTP không chính xác");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;

    setCanResend(false);
    setResendCooldown(60);
    setError("");

    try {
      // Resend OTP API call
      await authService.sendOTP(userData.email, 'EMAIL_VERIFICATION');
      alert("Mã OTP mới đã được gửi đến email của bạn!");
    } catch (error) {
      console.error('Resend OTP error:', error);
      setError(error.message || "Không thể gửi lại mã OTP. Vui lòng thử lại.");
      setCanResend(true);
      setResendCooldown(0);
      return;
    }

    // Restart countdown
    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const maskEmail = (email) => {
    const [username, domain] = email.split("@");
    const maskedUsername =
      username.charAt(0) +
      "*".repeat(Math.max(0, username.length - 2)) +
      username.slice(-1);
    return `${maskedUsername}@${domain}`;
  };

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
              <h1 className="logo-text mb-2">Xác thực tài khoản</h1>
              <p className="text-slate-300 text-sm">
                Vui lòng kiểm tra email của bạn để lấy mã xác thực. Mã của bạn
                gồm 6 số.
              </p>
            </div>

            {/* Email Info */}
            <div className="mb-6 p-4 bg-slate-800/30 rounded-lg border border-slate-600/30">
              <p className="text-sm text-slate-300 mb-1">
                Chúng tôi đã gửi mã của bạn tới:
              </p>
              <p className="text-white font-medium">{maskEmail(userEmail)}</p>
            </div>

            {/* OTP Form */}
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              {/* OTP Input */}
              <div className="space-y-2">
                <label className="text-slate-300 text-sm font-medium block text-center">
                  Nhập mã xác thực
                </label>
                <div className="flex justify-center gap-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      className="otp-input"
                      value={digit}
                      onChange={(e) =>
                        handleOtpChange(
                          index,
                          e.target.value.replace(/\D/g, "")
                        )
                      }
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      autoComplete="off"
                    />
                  ))}
                </div>
                {error && (
                  <p className="text-red-400 text-sm text-center mt-2">
                    {error}
                  </p>
                )}
              </div>

              {/* Resend Link */}
              <div className="text-center">
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors"
                  >
                    Không nhận được mã?
                  </button>
                ) : (
                  <p className="text-slate-200 text-sm">
                    Gửi lại mã sau {resendCooldown}s
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={loading || otp.join("").length !== 6}
                  className="submit-button"
                >
                  {loading && (
                    <div className="loading-overlay">
                      <div className="loading-spinner"></div>
                    </div>
                  )}
                  <span className={loading ? "opacity-0" : "opacity-100"}>
                    Xác nhận
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate(isRegistration ? "/register" : "/login")}
                  className="w-full py-3 px-4 text-slate-200 hover:text-white transition-colors text-sm"
                >
                  {isRegistration ? "Quay lại đăng ký" : "Quay lại đăng nhập"}
                </button>
              </div>
            </form>
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

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        title="Đăng ký thành công!"
        message="Chào mừng bạn đến với SocialBondNet! Tài khoản của bạn đã được tạo thành công và bạn có thể bắt đầu khám phá cộng đồng của chúng tôi ngay bây giờ."
        onClose={() => setShowSuccessModal(false)}
        onConfirm={() => {
          setShowSuccessModal(false);
          // Now perform the login and navigate (same as Login.jsx)
          if (loginData) {
            login(loginData.userData, loginData.accessToken, loginData.refreshToken);
            navigate("/");
          }
        }}
      />
    </div>
  );
};

export default OTPVerification;
