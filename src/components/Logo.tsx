import logoSrc from '../medias/logo.jpeg'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'color' | 'white'
}

export default function Logo({ size = 'md' }: LogoProps) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  }

  return (
    <img
      src={logoSrc}
      alt="Congo Espoir"
      className={`${sizes[size]} object-contain shrink-0 rounded-sm bg-white`}
      loading="eager"
    />
  )
}
