import { type FormEvent, type ReactNode, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Icon, { type IconName } from '../../components/Icon'
import { useAuthStore } from '../../store/authStore'

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
                    placeholder="your@email.com"
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

export function LoginPage() {
    const navigate = useNavigate()
    const login = useAuthStore((state) => state.login)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState({ email: '', password: '' })

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const nextErrors = {
            email: validateEmail(email),
            password: validatePassword(password),
        }

        setErrors(nextErrors)
        if (nextErrors.email || nextErrors.password) return

        login(email.trim().toLowerCase())
        navigate('/')
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
                        className="mb-[12px] ml-auto block border-b border-outline font-body text-[13px] font-light leading-none text-on-surface-variant transition-colors hover:text-primary"
                    >
                        Quên mật khẩu?
                    </button>

                    <button
                        type="submit"
                        className="h-[42px] w-full rounded-[7px] bg-primary font-label text-[14px] font-bold uppercase text-on-primary shadow-[0_4px_4px_rgba(0,0,0,0.25)] transition-colors hover:bg-secondary"
                    >
                        ĐĂNG NHẬP
                    </button>

                    <Link
                        to="/register"
                        className="mt-[10px] flex h-[42px] w-full items-center justify-center rounded-[7px] border border-outline bg-white font-label text-[14px] font-bold uppercase text-primary shadow-[0_4px_4px_rgba(0,0,0,0.18)] transition-colors hover:border-secondary hover:text-secondary"
                    >
                        ĐĂNG KÝ
                    </Link>

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
        </AuthDesktopLayout>
    )
}

export function RegisterPage() {
    const navigate = useNavigate()
    const register = useAuthStore((state) => state.register)
    const [email, setEmail] = useState('')
    const [birthYear, setBirthYear] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [errors, setErrors] = useState({
        email: '',
        birthYear: '',
        password: '',
        confirmPassword: '',
    })

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const currentYear = new Date().getFullYear()

        const nextErrors = {
            email: validateEmail(email),

            birthYear:
                !birthYear
                    ? 'Năm sinh là bắt buộc.'
                    : Number(birthYear) > currentYear
                    ? 'Năm sinh không hợp lệ.'
                    : '',

            password: validatePassword(password),

            confirmPassword:
                confirmPassword === password
                    ? ''
                    : 'Mật khẩu nhập lại không khớp.',
        }

        setErrors(nextErrors)

        if (
            nextErrors.email ||
            nextErrors.birthYear ||
            nextErrors.password ||
            nextErrors.confirmPassword
        ) {
            return
        }

        register(email.trim().toLowerCase())
        navigate('/')
    }

    return (
        <AuthDesktopLayout mode="register" railText="FASHION">
            <AuthCard title="ĐĂNG KÝ">
                <form onSubmit={handleSubmit} noValidate>
                    <AuthField
                        id="register-email"
                        label="Email"
                        icon="mail"
                        value={email}
                        onChange={setEmail}
                        error={errors.email}
                        autoComplete="email"
                        type="email"
                    />
                    <AuthField
                        id="register-birth-year"
                        label="NĂM SINH"
                        icon="mail"
                        value={birthYear}
                        onChange={setBirthYear}
                        error={errors.birthYear}
                        autoComplete="off"
                        type="number"
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

                    <button
                        type="submit"
                        className="mt-[10px] h-[42px] w-full rounded-[7px] border border-outline bg-white font-label text-[14px] font-bold uppercase text-primary shadow-[0_4px_4px_rgba(0,0,0,0.18)] transition-colors hover:border-secondary hover:text-secondary"
                    >
                        ĐĂNG KÝ
                    </button>
                </form>
            </AuthCard>
        </AuthDesktopLayout>
    )
}