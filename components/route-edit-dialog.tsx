import { updateRouteAmountAction } from '@/actions/update-route-amount-action'
import { SubmitButton } from '@/components/submit-button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

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
          <div className="flex mt-4">
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
