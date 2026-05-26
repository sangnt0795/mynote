import { useAuth } from '../context/AuthContext';
export function PendingPage() {
  const { appUser, refreshUser, logout } = useAuth();
  return <div className="login-page"><div className="login-card compact">
    <h1>Tài khoản chưa được duyệt</h1>
    <p>Email: <b>{appUser?.email}</b></p>
    <p>Trạng thái hiện tại: <b>{appUser?.status}</b>. Root/Admin cần duyệt trước khi sử dụng website.</p>
    <div className="row-actions"><button className="primary-btn" onClick={refreshUser}>Kiểm tra lại</button><button className="ghost-btn" onClick={logout}>Đăng xuất</button></div>
  </div></div>;
}
