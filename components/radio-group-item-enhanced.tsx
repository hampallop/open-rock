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
        'flex cursor-pointer items-center space-x-2 rounded-2xl border p-6 transition-colors hover:bg-primary/10',
        active && 'bg-secondary ring ring-2 ring-primary',
      )}
    >
      <RadioGroupItem value={value} id={id} />
      {children}
    </Label>
  )
}
