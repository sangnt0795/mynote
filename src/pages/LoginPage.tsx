import { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const { signIn } = useAuth();
  const [signingIn, setSigningIn] = useState(false);
  const [errorText, setErrorText] = useState('');

  function getLoginError(error: unknown) {
    const code = typeof error === 'object' && error && 'code' in error ? String((error as { code?: string }).code || '') : '';
    if (code.includes('auth/configuration-not-found')) return 'Firebase Authentication chưa được cấu hình đúng (API key/project không khớp hoặc Auth chưa được khởi tạo trong Firebase Console).';
    if (code.includes('auth/invalid-api-key')) return 'Firebase API key không hợp lệ. Hãy kiểm tra lại VITE_FIREBASE_API_KEY.';
    if (code.includes('auth/popup-closed-by-user')) return 'Bạn đã đóng cửa sổ đăng nhập Google.';
    if (code.includes('auth/popup-blocked')) return 'Trình duyệt đang chặn popup. Hãy cho phép popup và thử lại.';
    if (code.includes('auth/unauthorized-domain')) return 'Domain hiện tại chưa được cấp quyền trên Firebase Authentication.';
    if (code.includes('auth/operation-not-allowed')) return 'Google Sign-In chưa bật trong Firebase Authentication.';
    if (code.includes('auth/network-request-failed')) return 'Lỗi mạng khi đăng nhập. Vui lòng kiểm tra kết nối internet.';
    if (code) return `Đăng nhập thất bại (${code}).`;
    return 'Đăng nhập thất bại. Vui lòng thử lại.';
  }

  async function onSignIn() {
    setSigningIn(true);
    setErrorText('');
    try {
      await signIn();
    } catch (error) {
      console.error('Sign in failed:', error);
      setErrorText(getLoginError(error));
    } finally {
      setSigningIn(false);
    }
  }

  return <div className="login-page">
    <div className="login-card">
      <div className="brand big"><div className="brand-mark"><BookOpen size={24}/></div><div><b>MyNote Skill</b><span>Firebase Firestore Website</span></div></div>
      <h1>Quản lý ghi chú học tập và skill cá nhân</h1>
      <p>Lưu category, topic, note, tag và link media mẫu như Google Drive, Facebook, YouTube.</p>
      <button className="primary-btn" onClick={onSignIn} disabled={signingIn}>{signingIn ? 'Đang đăng nhập...' : 'Đăng nhập bằng Google'}</button>
      {errorText ? <p className="login-error">{errorText}</p> : null}
    </div>
  </div>;
}
