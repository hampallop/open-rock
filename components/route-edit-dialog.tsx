import { SubmitButton } from '@/components/submit-button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

import { createClient } from '@/utils/supabase/client'

const updateRouteAmountAction =
  ({ roundId, inputName }: { roundId: string; inputName: string }) =>
  async (formData: FormData) => {
    const routeAmount = Number(formData.get(inputName)?.toString())

    const supabase = await createClient()

    await supabase
      .from('competeRounds')
      .update({ routeAmount })
      .eq('id', roundId)

    return routeAmount
  }

export function RouteEditDialog({
  open,
  onOpenChange,
  title,
  routeAmount,
  roundId,
  onSave = () => {},
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  routeAmount: number
  roundId: string
  onSave?: (routeAmount: number) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form>
          <div>
            <Input name="routeAmount" defaultValue={routeAmount} type="tel" />
          </div>
          <div className="mt-4 flex">
            <SubmitButton
              formAction={async (formData) => {
                const routeAmount = await updateRouteAmountAction({
                  roundId,
                  inputName: 'routeAmount',
                })(formData)

                if (routeAmount) {
                  onSave?.(routeAmount)
                }
                onOpenChange(false)
              }}
              pendingText="Saving..."
              className="ml-auto"
            >
              Save and continue
            </SubmitButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
