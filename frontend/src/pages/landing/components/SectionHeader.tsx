import Reveal from './Reveal'

type SectionHeaderProps = {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
}

export default function SectionHeader({ eyebrow, title, description, align = 'center' }: SectionHeaderProps) {
  const isCenter = align === 'center'

  return (
    <Reveal className={`${isCenter ? 'mx-auto text-center' : ''} mb-12 max-w-3xl`}>
      {eyebrow && (
        <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.22em] text-[var(--tl-primary)]">
          {eyebrow}
        </p>
      )}
      <h2 className="text-balance text-3xl font-black leading-tight tracking-[-0.045em] text-[var(--tl-text)] sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[var(--tl-muted)]">
          {description}
        </p>
      )}
    </Reveal>
  )
}
