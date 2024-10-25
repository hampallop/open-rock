'use client'
import { SubmitButton } from '@/components/submit-button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Tables } from '@/database.types'
import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'

const createAthleteAction =
  ({ inputName }: { inputName: string }) =>
  async (formData: FormData) => {
    const name = formData.get(inputName)?.toString()

    const supabase = await createClient()

    const { data: newAthlete } = await supabase
      .from('athletes')
      .insert({ name })
      .select()
      .single()

    return newAthlete as Tables<'athletes'>
  }

export function CreateAthleteDialog({
  children,
  onSave,
}: {
  children: React.ReactNode
  onSave?: (athlete: Tables<'athletes'>) => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create athlete</DialogTitle>
        </DialogHeader>
        <form>
          <Input name="name" placeholder="Athlete name" />
          <div className="flex mt-4">
            <SubmitButton
              formAction={async (formData) => {
                const newAthlete = await createAthleteAction({
                  inputName: 'name',
                })(formData)

                if (newAthlete) {
                  onSave?.(newAthlete)
                }
                setOpen(false)
              }}
              pendingText="Saving..."
              className="ml-auto"
            >
              Create and continue
            </SubmitButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
