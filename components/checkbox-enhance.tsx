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
        'hover:bg-primary/10 transition-colors cursor-pointer flex items-center border p-6 rounded-2xl',
        checked && 'ring ring-primary ring-2 bg-secondary',
        className,
      )}
    >
      <Checkbox id={id} checked={checked} onCheckedChange={onCheckedChange} />
      {children}
    </Label>
  )
}
