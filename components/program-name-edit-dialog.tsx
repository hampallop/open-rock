import { SubmitButton } from '@/components/submit-button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

import { createClient } from '@/utils/supabase/client'

const updateprogramNameAction =
  ({ programId, inputName }: { programId: string; inputName: string }) =>
  async (formData: FormData) => {
    const programName = formData.get(inputName)?.toString()

    const supabase = await createClient()

    await supabase
      .from('competePrograms')
      .update({ name: programName })
      .eq('id', programId)

    return programName
  }

export function ProgramNameEditDialog({
  open,
  onOpenChange,
  programId,
  programName,
  onSave = () => {},
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  programId: string
  programName: string
  onSave?: (programName: string) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit program name</DialogTitle>
        </DialogHeader>
        <form>
          <div>
            <Input name="programName" defaultValue={programName} />
          </div>
          <div className="flex mt-4">
            <SubmitButton
              formAction={async (formData) => {
                const programName = await updateprogramNameAction({
                  programId,
                  inputName: 'programName',
                })(formData)

                if (programName) {
                  onSave?.(programName)
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
