import { Label } from '@/components/ui/label'
import { RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'

export function RadioGroupItemEnhanced({
  id,
  active,
  value,
  children,
}: {
  id: string
  active: boolean
  value: string
  children: React.ReactNode
}) {
  return (
    <Label
      htmlFor={id}
      className={cn(
        'hover:bg-primary/10 transition-colors cursor-pointer flex items-center border p-6 space-x-2 rounded-2xl',
        active && 'ring ring-primary ring-2 bg-secondary',
      )}
    >
      <RadioGroupItem value={value} id={id} />
      {children}
    </Label>
  )
}
