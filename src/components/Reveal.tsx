import { ReactNode } from 'react'
import { useInView } from '@/hooks/useInView'

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
  as?: 'div' | 'section' | 'article'
}

export function Reveal({ children, className = '', delay = 0, as: Tag = 'div' }: RevealProps) {
  const { ref, visible } = useInView<HTMLDivElement>()

  return (
    <Tag
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`reveal ${className}`}
      data-visible={visible || undefined}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}
