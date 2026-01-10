import React from 'react'
import { cn } from '@/lib/utils'
import { Button as ButtonPrimitive } from 'react-aria-components'

const Button = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<typeof ButtonPrimitive>>(
  ({ className, ...props }, ref) => (
    <ButtonPrimitive
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
        'bg-primary text-primary-foreground hover:bg-primary/90',
        className
      )}
      {...props}
    />
  )
)

Button.displayName = 'Button'

export { Button }