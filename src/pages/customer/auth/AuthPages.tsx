import { type FormEvent, type ReactNode, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon, { type IconName } from '../../../components/Icon'
import Button from '../../../components/Button'
import Modal from '../../../components/Modal'
import { useAuthStore } from './authStore'
import { authApi } from '../../../services/authApi'
import { isAxiosError } from 'axios'

const AUTH_IMAGES = {
    login: '/images/auth/login-editorial.png',
    register: '/images/auth/register-editorial.png',
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface AuthDesktopLayoutProps {
    mode: 'login' | 'register'
    railText: string
    children: ReactNode
}

function AuthDesktopLayout({ mode, railText, children }: AuthDesktopLayoutProps) {
    const isRegister = mode === 'register'

    return (
        <section className="h-[calc(100vh-80px)] min-h-[600px] min-w-[1024px] bg-white overflow-hidden">
            <div className="grid h-full grid-cols-[80px_1fr_450px]">
                <aside
                    className={`relative flex items-center justify-center overflow-hidden ${isRegister ? 'bg-primary text-on-primary' : 'bg-white text-primary'
                        }`}
                    aria-hidden="true"
                >
                    <p className="rotate-90 font-label text-[56px] font-bold leading-none tracking-[0.02em] whitespace-nowrap">
                        {railText}
                    </p>
                </aside>

                <div className="relative overflow-hidden bg-surface-container-low">
                    <img
                        src={AUTH_IMAGES[mode]}
                        alt=""
                        className="h-full w-full object-cover object-top"
                    />
                </div>

                <div className="flex items-center justify-center bg-[#c7c6c6] px-[20px] py-[24px]">
                    {children}
                </div>
            </div>
        </section>
    )
}

interface AuthCardProps {
    title: string
    children: ReactNode
}

function AuthCard({ title, children }: AuthCardProps) {
    return (
        <div className="w-[370px] rounded-[25px] border border-primary/80 bg-white px-[32px] py-[24px] shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
            <h1 className="mb-[16px] text-center font-headline text-[20px] font-medium leading-none text-primary">
                {title}
            </h1>
            {children}
        </div>
    )
}

interface AuthFieldProps {
    id: string
    label: string
    value: string
    onChange: (value: string) => void
    error?: string
    autoComplete?: string
    icon: IconName
    type?: string
    placeholder?: string
}

function AuthField({
    id,
    label,
    value,
    onChange,
    error,
    autoComplete,
    icon,
    type = 'text',
    placeholder,
}: AuthFieldProps) {
    return (
        <div className="mb-[14px]">
            <label
                htmlFor={id}
                className="mb-[6px] block font-label text-[14px] font-semibold leading-none text-primary"
            >
                {label}
            </label>
            <div
                className={`flex h-[42px] items-center rounded-[7px] border bg-[#fbf9f9] px-[9px] shadow-[0_4px_4px_rgba(0,0,0,0.22)] transition-colors ${error ? 'border-error' : 'border-outline'
                    }`}
            >
                <Icon name={icon} size={18} className="mr-[8px] text-on-surface-variant" />
                <input
                    id={id}
                    type={type}
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    autoComplete={autoComplete || 'off'}
                    className="h-full min-w-0 flex-1 bg-transparent font-body text-[13px] font-light text-primary outline-none placeholder:text-on-surface-variant/70"
                    placeholder={placeholder || ""}
                    aria-invalid={!!error}
                    {...(error && { 'aria-describedby': `${id}-error` })}
                />
            </div>
            {error && (
                <p id={`${id}-error`} className="mt-1 font-body text-[11px] text-error">
                    {error}
                </p>
            )}
        </div>
    )
}

interface PasswordFieldProps {
    id: string
    label: string
    value: string
    onChange: (value: string) => void
    error?: string
    autoComplete?: string
}

function PasswordField({
    id,
    label,
    value,
    onChange,
    error,
    autoComplete,
}: PasswordFieldProps) {
    const [visible, setVisible] = useState(false)

    return (
        <div className="mb-[14px]">
            <label
                htmlFor={id}
                className="mb-[6px] block font-label text-[14px] font-semibold leading-none text-primary"
            >
                {label}
            </label>
            <div
                className={`flex h-[42px] items-center rounded-[7px] border bg-[#fbf9f9] px-[9px] shadow-[0_4px_4px_rgba(0,0,0,0.22)] transition-colors ${error ? 'border-error' : 'border-outline'
                    }`}
            >
                <Icon name="lock" size={18} className="mr-[8px] text-on-surface-variant" />
                <input
                    id={id}
                    type={visible ? 'text' : 'password'}
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    autoComplete={autoComplete}
                    className="h-full min-w-0 flex-1 bg-transparent font-body text-[13px] font-light text-primary outline-none placeholder:text-on-surface-variant/70"
                    placeholder="***********************"
                    aria-invalid={!!error}
                    aria-describedby={error ? `${id}-error` : undefined}
                />
                <button
                    type="button"
                    onClick={() => setVisible((current) => !current)}
                    className="ml-2 flex text-primary transition-colors hover:text-secondary"
                    aria-label={visible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                    <Icon name={visible ? 'eye-off' : 'eye'} size={20} />
                </button>
            </div>
            {error && (
                <p id={`${id}-error`} className="mt-1 font-body text-[11px] text-error">
                    {error}
                </p>
            )}
        </div>
    )
}

function validateEmail(email: string) {
    if (!email.trim()) return 'Email là bắt buộc.'
    if (!emailPattern.test(email.trim())) return 'Email chưa đúng định dạng.'
    return ''
}

function validatePassword(password: string) {
    if (!password) return 'Mật khẩu là bắt buộc.'
    return ''
}

function ForgotPasswordModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [step, setStep] = useState<1 | 2>(1)
    const [email, setEmail] = useState('')
    const [token, setToken] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    // Reset state when modal is closed or opened
    const handleClose = () => {
        setStep(1)
        setEmail('')
        setToken('')
        setNewPassword('')
        setConfirmPassword('')
        setError('')
        setSuccessMessage('')
        onClose()
    }

    const handleRequestReset = async (e: FormEvent) => {
        e.preventDefault()
        setError('')
        if (!email.trim()) {
            setError('Vui lòng nhập Email.')
            return
        }

        try {
            setLoading(true)
            await authApi.requestPasswordReset({ email: email.trim().toLowerCase() })
            setSuccessMessage('Nếu email tồn tại, mã khôi phục đã được gửi. Vui lòng kiểm tra hộp thư.')
            setStep(2) // Move to step 2 regardless to prevent email enumeration
        } catch {
            setError('Có lỗi xảy ra. Vui lòng thử lại.')
        } finally {
            setLoading(false)
        }
    }

    const handleResetPassword = async (e: FormEvent) => {
        e.preventDefault()
        setError('')
        if (!token.trim() || !newPassword) {
            setError('Mã xác nhận và mật khẩu mới là bắt buộc.')
            return
        }
        if (newPassword !== confirmPassword) {
            setError('Mật khẩu nhập lại không khớp.')
            return
        }

        try {
            setLoading(true)
            await authApi.resetPassword({
                email: email.trim().toLowerCase(),
                token: token.trim(),
                newPassword: newPassword,
                confirmPassword: confirmPassword
            })
            setSuccessMessage('Mật khẩu đã được khôi phục thành công! Bạn có thể đăng nhập ngay.')
            // Có thể tự động đóng sau vài giây
            setTimeout(() => {
                handleClose()
            }, 3000)
        } catch (err) {
            if (isAxiosError(err) && err.response && err.response.data) {
                setError(typeof err.response.data === 'string' ? err.response.data : 'Có lỗi xảy ra.')
            } else {
                setError('Có lỗi xảy ra khi đặt lại mật khẩu.')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="QUÊN MẬT KHẨU">
            <div className="flex flex-col">
                {error && <div className="mb-4 p-3 bg-error/10 text-error text-sm rounded-md">{error}</div>}
                {successMessage && <div className="mb-4 p-3 bg-tertiary/10 text-tertiary text-sm rounded-md">{successMessage}</div>}

                {step === 1 ? (
                    <form onSubmit={handleRequestReset}>
                        <p className="mb-4 text-sm text-on-surface-variant">
                            Vui lòng nhập email tài khoản của bạn. Chúng tôi sẽ gửi một mã xác nhận để bạn khôi phục mật khẩu.
                        </p>
                        <AuthField
                            id="reset-email"
                            label="EMAIL"
                            icon="mail"
                            value={email}
                            onChange={setEmail}
                            type="email"
                            placeholder="your@email.com"
                        />
                        <div className="mt-4 flex justify-end gap-2">
                            <Button variant="ghost" onClick={handleClose} type="button">Hủy</Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? 'ĐANG GỬI...' : 'GỬI MÃ'}
                            </Button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword}>
                        <p className="mb-4 text-sm text-on-surface-variant">
                            Mã xác nhận đã được gửi đến <span className="font-bold">{email}</span>. Vui lòng nhập mã và mật khẩu mới.
                        </p>
                        <AuthField
                            id="reset-token"
                            label="MÃ XÁC NHẬN"
                            icon="lock"
                            value={token}
                            onChange={setToken}
                            placeholder="Nhập mã khôi phục"
                        />
                        <PasswordField
                            id="reset-new-password"
                            label="MẬT KHẨU MỚI"
                            value={newPassword}
                            onChange={setNewPassword}
                            autoComplete="new-password"
                        />
                        <PasswordField
                            id="reset-confirm-password"
                            label="NHẬP LẠI MẬT KHẨU MỚI"
                            value={confirmPassword}
                            onChange={setConfirmPassword}
                            autoComplete="new-password"
                        />
                        <div className="mt-4 flex justify-end gap-2">
                            <Button variant="ghost" onClick={handleClose} type="button">Hủy</Button>
                            <Button type="submit" disabled={loading || successMessage.includes('thành công')}>
                                {loading ? 'ĐANG XỬ LÝ...' : 'ĐỔI MẬT KHẨU'}
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </Modal>
    )
}

export function LoginPage() {
    const navigate = useNavigate()
    const login = useAuthStore((state) => state.login)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({ email: '', password: '' })
    const [isForgotModalOpen, setForgotModalOpen] = useState(false)

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const nextErrors = {
            email: validateEmail(email),
            password: validatePassword(password),
        }

        setErrors(nextErrors)
        if (nextErrors.email || nextErrors.password) return

        try {
            setLoading(true)
            const response = await authApi.login({
                email: email.trim().toLowerCase(),
                password: password,
            })
            login(response)
            if (response.role === 'Admin') {
                navigate('/admin')
            } else if (response.role === 'Staff') {
                navigate('/staff')
            } else {
                navigate('/')
            }
        } catch (error) {
            if (isAxiosError(error) && error.response && error.response.status === 401) {
                setErrors({ email: '', password: 'Email hoặc mật khẩu không chính xác.' })
            } else {
                setErrors({ email: '', password: 'Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.' })
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <AuthDesktopLayout mode="login" railText="AMAZING">
            <AuthCard title="ĐĂNG NHẬP">
                <form onSubmit={handleSubmit} noValidate>
                    <AuthField
                        id="login-email"
                        label="Email"
                        icon="mail"
                        value={email}
                        onChange={setEmail}
                        error={errors.email}
                        autoComplete="email"
                        type="email"
                        placeholder="your@email.com"
                    />
                    <PasswordField
                        id="login-password"
                        label="MẬT KHẨU"
                        value={password}
                        onChange={setPassword}
                        error={errors.password}
                        autoComplete="current-password"
                    />

                    <button
                        type="button"
                        onClick={() => setForgotModalOpen(true)}
                        className="mb-[12px] ml-auto block border-b border-outline font-body text-[13px] font-light leading-none text-on-surface-variant transition-colors hover:text-primary cursor-pointer"
                    >
                        Quên mật khẩu?
                    </button>

                    <Button
                        type="submit"
                        disabled={loading}
                        fullWidth
                    >
                        {loading ? 'ĐANG XỬ LÝ...' : 'ĐĂNG NHẬP'}
                    </Button>

                    <div className="mt-[10px]">
                        <Button
                            variant="outline"
                            fullWidth
                            onClick={() => navigate('/register')}
                        >
                            ĐĂNG KÝ
                        </Button>
                    </div>

                    <div className="my-[16px] flex items-center gap-2">
                        <span className="h-px flex-1 bg-outline" />
                        <span className="font-body text-[13px] font-light text-on-surface-variant">
                            Đăng nhập với
                        </span>
                        <span className="h-px flex-1 bg-outline" />
                    </div>

                    <button
                        type="button"
                        className="mx-auto flex h-[36px] w-[130px] items-center justify-center gap-3 rounded-[7px] bg-primary font-body text-[13px] font-normal uppercase text-on-primary shadow-[0_4px_4px_rgba(0,0,0,0.25)] transition-colors hover:bg-secondary"
                    >
                        <Icon name="mail" size={16} />
                        EMAIL
                    </button>
                </form>
            </AuthCard>
            <ForgotPasswordModal isOpen={isForgotModalOpen} onClose={() => setForgotModalOpen(false)} />
        </AuthDesktopLayout>
    )
}

export function RegisterPage() {
    const navigate = useNavigate()
    const login = useAuthStore((state) => state.login)
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        general: '',
    })

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const nextErrors = {
            firstName: !firstName.trim() ? 'Tên là bắt buộc.' : '',
            lastName: !lastName.trim() ? 'Họ là bắt buộc.' : '',
            email: validateEmail(email),
            password: validatePassword(password),
            confirmPassword: confirmPassword === password ? '' : 'Mật khẩu nhập lại không khớp.',
            general: '',
        }

        setErrors(nextErrors)

        if (
            nextErrors.firstName ||
            nextErrors.lastName ||
            nextErrors.email ||
            nextErrors.password ||
            nextErrors.confirmPassword
        ) {
            return
        }

        try {
            setLoading(true)
            const response = await authApi.register({
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.trim().toLowerCase(),
                phoneNumber: phoneNumber.trim(),
                password: password,
                confirmPassword: confirmPassword,
            })
            login(response)
            navigate('/')
        } catch (error) {
            if (isAxiosError(error) && error.response && error.response.status === 409) {
                setErrors((prev) => ({ ...prev, email: 'Email này đã được đăng ký.' }))
            } else if (isAxiosError(error) && error.response && error.response.data) {
                const responseData = error.response.data
                setErrors((prev) => ({ ...prev, general: typeof responseData === 'string' ? responseData : 'Có lỗi xảy ra, vui lòng thử lại.' }))
            } else {
                setErrors((prev) => ({ ...prev, general: 'Có lỗi kết nối. Vui lòng thử lại.' }))
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <AuthDesktopLayout mode="register" railText="FASHION">
            <AuthCard title="ĐĂNG KÝ">
                <form onSubmit={handleSubmit} noValidate>
                    {errors.general && (
                        <div className="mb-3 p-2 bg-error/10 text-error text-[13px] rounded-md text-center">
                            {errors.general}
                        </div>
                    )}
                    <div className="flex gap-2 w-full">
                        <div className="flex-1 min-w-0">
                            <AuthField
                                id="register-last-name"
                                label="HỌ"
                                icon="user"
                                value={lastName}
                                onChange={setLastName}
                                error={errors.lastName}
                                placeholder="Nguyễn"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <AuthField
                                id="register-first-name"
                                label="TÊN"
                                icon="user"
                                value={firstName}
                                onChange={setFirstName}
                                error={errors.firstName}
                                placeholder="Văn A"
                            />
                        </div>
                    </div>
                    <AuthField
                        id="register-email"
                        label="EMAIL"
                        icon="mail"
                        value={email}
                        onChange={setEmail}
                        error={errors.email}
                        autoComplete="email"
                        type="email"
                        placeholder="your@email.com"
                    />
                    <AuthField
                        id="register-phone"
                        label="SỐ ĐIỆN THOẠI"
                        icon="call"
                        value={phoneNumber}
                        onChange={setPhoneNumber}
                        type="tel"
                        placeholder="0987654321"
                    />
                    <PasswordField
                        id="register-password"
                        label="MẬT KHẨU"
                        value={password}
                        onChange={setPassword}
                        error={errors.password}
                        autoComplete="new-password"
                    />
                    <PasswordField
                        id="register-confirm-password"
                        label="NHẬP LẠI MẬT KHẨU"
                        value={confirmPassword}
                        onChange={setConfirmPassword}
                        error={errors.confirmPassword}
                        autoComplete="new-password"
                    />

                    <div className="mt-[10px]">
                        <Button
                            type="submit"
                            disabled={loading}
                            fullWidth
                        >
                            {loading ? 'ĐANG XỬ LÝ...' : 'ĐĂNG KÝ'}
                        </Button>
                    </div>

                    <div className="mt-[10px]">
                        <Button
                            variant="outline"
                            fullWidth
                            onClick={() => navigate('/login')}
                        >
                            VỀ ĐĂNG NHẬP
                        </Button>
                    </div>
                </form>
            </AuthCard>
        </AuthDesktopLayout>
    )
}