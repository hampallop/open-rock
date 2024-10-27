import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export function CheckboxEnhanced({
  id,
  checked,
  onCheckedChange,
  children,
  className,
}: {
  id: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  children: React.ReactNode
  className?: string
}) {
  return (
    <Label
      htmlFor={id}
      className={cn(
        'flex cursor-pointer items-center rounded-2xl border p-6 transition-colors hover:bg-primary/10',
        checked && 'bg-secondary ring ring-2 ring-primary',
        className,
      )}
    >
      <Checkbox id={id} checked={checked} onCheckedChange={onCheckedChange} />
      {children}
    </Label>
  )
}
