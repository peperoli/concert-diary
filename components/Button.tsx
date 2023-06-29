import { forwardRef } from 'react'

type ButtonProps = {
  onClick?: any
  type?: 'button' | 'submit' | 'reset' | undefined
  label: string
  style?: 'primary' | 'secondary'
  contentType?: 'text' | 'icon'
  icon?: JSX.Element | string
  disabled?: boolean
  loading?: boolean
  size?: 'small' | 'medium'
  danger?: boolean
  className?: string
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      onClick,
      type = 'button',
      label,
      style,
      contentType = 'text',
      icon,
      disabled,
      loading,
      size = 'medium',
      danger,
      className,
    },
    ref
  ) => {
    return (
      <button
        type={type || 'button'}
        onClick={onClick}
        disabled={disabled || loading}
        className={`btn${style === 'primary' ? ' btn-primary' : ' btn-secondary'}${
          contentType === 'icon' ? ' btn-icon' : ''
        }${size === 'small' ? ' btn-small' : ''}${danger ? ' btn-danger' : ''}${
          className ? ` ${className}` : ''
        }`}
      >
        {loading && (
          <svg
            className="absolute h-icon animate-spin"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="currentColor"
              d="M6.64961 4.67086C6.91028 4.99276 6.86064 5.46503 6.53874 5.72571C5.79603 6.32714 5.22285 7.11172 4.8757 8.00213C4.52854 8.89253 4.41939 9.85803 4.559 10.8035C4.69861 11.7489 5.08216 12.6416 5.67185 13.3937C6.26155 14.1458 7.03703 14.7312 7.92187 15.0923C8.80671 15.4534 9.77038 15.5777 10.7179 15.453C11.6654 15.3282 12.5641 14.9587 13.3253 14.3809C14.0865 13.8031 14.6841 13.0369 15.059 12.1579C15.434 11.2788 15.5734 10.3172 15.4635 9.36786C15.4159 8.95639 15.7109 8.58424 16.1224 8.53663C16.5338 8.48902 16.906 8.78399 16.9536 9.19545C17.0934 10.4037 16.916 11.6276 16.4387 12.7464C15.9615 13.8652 15.201 14.8403 14.2322 15.5757C13.2633 16.3111 12.1196 16.7814 10.9137 16.9401C9.70775 17.0989 8.48127 16.9407 7.35511 16.4811C6.22895 16.0215 5.24197 15.2764 4.49145 14.3193C3.74093 13.3621 3.25278 12.2259 3.07509 11.0226C2.89741 9.81931 3.03633 8.59049 3.47816 7.45725C3.91999 6.32401 4.64949 5.32545 5.59476 4.55999C5.91666 4.29931 6.38893 4.34895 6.64961 4.67086Z"
            />
          </svg>
        )}
        <span className={`flex gap-2 items-center${loading ? ' opacity-0' : ''}`}>
          <>
            {icon}
            <span className={`${contentType === 'icon' ? ' sr-only ' : ''}`}>{label}</span>
          </>
        </span>
      </button>
    )
  }
)
Button.displayName = 'Button'
