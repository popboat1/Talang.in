type AnimatedHeadingProps = {
  as?: 'h1' | 'h2'
  text: string
  className?: string
  delayStep?: number
}

export default function AnimatedHeading({ as = 'h1', text, className = '', delayStep = 46 }: AnimatedHeadingProps) {
  const Tag = as
  const words = text.split(' ')

  return (
    <Tag className={className} aria-label={text}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="headline-word" aria-hidden="true">
          <span style={{ animationDelay: `${index * delayStep}ms` }}>{word}&nbsp;</span>
        </span>
      ))}
    </Tag>
  )
}
