'use client'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CheckIcon, MinusIcon, PlusIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

function JudgeButton({
  onClick,
  type,
  disabled = false,
}: {
  onClick: () => void
  type: 'minus' | 'plus'
  disabled?: boolean
}) {
  const specificClassName =
    type === 'minus'
      ? 'bg-zinc-100 text-zinc-500'
      : 'bg-green-100 text-green-600'
  return (
    <button
      className={cn(
        'flex items-center justify-center rounded-full bg-white p-5',
        specificClassName,
        disabled && 'opacity-50',
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {type === 'minus' && <MinusIcon size={60} />}
      {type === 'plus' && <PlusIcon size={60} />}
    </button>
  )
}

export function JudgeScreen() {
  const [count, setCount] = useState(0)
  const [zone, setZone] = useState<number | null>(null)
  const [top, setTop] = useState<number | null>(null)

  const hasTopAndZone = !!top && !!zone

  return (
    <section className="flex grow flex-col px-5">
      <div className="flex flex-col items-center justify-center">
        <p className="text-base font-medium">Semi Final</p>
        <p className="text-base font-medium text-muted-foreground">Route 3</p>
        <p className="text-3xl font-bold">Name</p>
      </div>
      <div className="mt-16 flex items-center justify-between gap-2">
        <JudgeButton
          onClick={() => {
            if (count > 0) {
              setCount(count - 1)
            }
          }}
          type="minus"
          disabled={!count || hasTopAndZone}
        />
        <div className="flex flex-col text-center">
          <span className="text-6xl font-medium">{count}</span>
          <span className="font-medium text-muted-foreground">ATTEMPTS</span>
        </div>
        <JudgeButton
          onClick={() => setCount(count + 1)}
          type="plus"
          disabled={hasTopAndZone}
        />
      </div>

      <div className="mt-32 flex gap-4">
        <button
          className={cn(
            'relative flex h-36 w-full flex-col rounded-2xl border border-4 border-transparent bg-secondary p-4 disabled:opacity-50',
            zone && 'border-sky-600 bg-sky-100',
          )}
          onClick={() => {
            if (count > 0 && !zone) {
              setZone(count)
            } else if (zone) {
              if (confirm('Are you sure you want to reset the zone?')) {
                setZone(null)
              }
            }
          }}
          disabled={count === 0}
        >
          {zone && (
            <div className="absolute -right-4 -top-4 rounded-full border-2 border-background bg-sky-600 p-2">
              <CheckIcon className="text-white" size={16} strokeWidth={5} />
            </div>
          )}
          <span className="text-4xl font-medium">{zone || 0}</span>
          <span className="mt-auto font-medium text-muted-foreground">
            ZONE
          </span>
        </button>
        <button
          className={cn(
            'relative flex h-36 w-full flex-col rounded-2xl border border-4 border-transparent bg-secondary p-4 disabled:opacity-50',
            top && 'border-green-600 bg-green-100',
          )}
          onClick={() => {
            if (count > 0 && !top) {
              setTop(count)
            } else if (top) {
              if (confirm('Are you sure you want to reset the top?')) {
                setTop(null)
              }
            }
          }}
          disabled={count === 0 || !zone}
        >
          {top && (
            <div className="absolute -right-4 -top-4 rounded-full border-2 border-background bg-green-600 p-2">
              <CheckIcon className="text-white" size={16} strokeWidth={5} />
            </div>
          )}
          <span className="text-4xl font-medium">{top || 0}</span>
          <span className="mt-auto font-medium text-muted-foreground">TOP</span>
        </button>
      </div>
      <div className="mt-auto flex py-4">
        <Button
          onClick={() => {
            toast('sent')
          }}
          size="lg"
          className="w-full"
        >
          Send
        </Button>
      </div>
    </section>
  )
}
