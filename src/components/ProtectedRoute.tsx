import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../pages/customer/auth/authStore'

interface ProtectedRouteProps {
    children: React.ReactNode
    allowedRoles: string[]
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const user = useAuthStore((state) => state.user)
    const location = useLocation()

    // Nếu chưa đăng nhập, đá về trang login, kèm the state 'from' để sau khi login xong có thể quay lại
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    // Nếu đã đăng nhập nhưng không có quyền (role không nằm trong danh sách cho phép)
    if (!allowedRoles.includes(user.role)) {
        // Đá về trang chủ 
        return <Navigate to="/" replace />
    }

    // Hợp lệ thì cho phép truy cập
    return <>{children}</>
}
