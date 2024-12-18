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
import supabase from '@/utils/supabase'
import { format } from 'date-fns'
import { useState } from 'react'
import { EventWithCompetePrograms } from '@/app/cms/events/[eventId]/edit/page'

export function InfoSection({ event }: { event: EventWithCompetePrograms }) {
  const [dialogType, setDialogType] = useState<keyof Tables<'events'> | null>(
    null,
  )
  const [optimisticEvent, setOptimisticEvent] = useState(event)

  const saveInfoAction =
    ({
      fieldName,
      inputName,
    }: {
      fieldName: keyof Tables<'events'>
      inputName: string
    }) =>
    async (formData: FormData) => {
      const changeValue = formData.get(inputName)?.toString()
      const { data: updatedEvent } = await supabase
        .from('events')
        .update({ [fieldName]: changeValue })
        .eq('id', event.id)
        .select()
        .single()

      setOptimisticEvent(updatedEvent)
      setDialogType(null)
    }

  return (
    <>
      <h1 className="mb-8 mt-2 text-3xl font-medium">Edit event</h1>
      <div className="flex flex-col gap-2">
        <div className="mb-4 flex justify-between border-b pb-4">
          <div>
            <p>Event Name</p>
            <p className="text-muted-foreground">{optimisticEvent?.name}</p>
          </div>
          <Dialog
            open={dialogType === 'name'}
            onOpenChange={(checked: boolean) =>
              checked ? setDialogType('name') : setDialogType(null)
            }
          >
            <DialogTrigger className="mb-auto text-sm font-medium leading-6 underline">
              Edit
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit event name</DialogTitle>
              </DialogHeader>
              <form>
                <div>
                  <Input
                    name="eventName"
                    defaultValue={optimisticEvent?.name ?? ''}
                  />
                </div>
                <div className="mt-4 flex">
                  <SubmitButton
                    formAction={saveInfoAction({
                      fieldName: 'name',
                      inputName: 'eventName',
                    })}
                    pendingText="Saving..."
                    className="ml-auto"
                  >
                    Save and continue
                  </SubmitButton>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="mb-4 flex justify-between border-b pb-4">
          <div>
            <p>Location</p>
            <p className="text-muted-foreground">
              {optimisticEvent?.location || 'N/A'}
            </p>
          </div>
          <Dialog
            open={dialogType === 'location'}
            onOpenChange={(checked: boolean) =>
              checked ? setDialogType('location') : setDialogType(null)
            }
          >
            <DialogTrigger className="mb-auto text-sm font-medium leading-6 underline">
              Edit
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit location</DialogTitle>
              </DialogHeader>
              <form>
                <div>
                  <Input
                    name="location"
                    defaultValue={optimisticEvent?.location ?? ''}
                  />
                </div>
                <div className="mt-4 flex">
                  <SubmitButton
                    formAction={saveInfoAction({
                      fieldName: 'location',
                      inputName: 'location',
                    })}
                    pendingText="Saving..."
                    className="ml-auto"
                  >
                    Save and continue
                  </SubmitButton>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="mb-4 flex justify-between border-b pb-4">
          <div>
            <p>Start date</p>
            <p className="text-muted-foreground">
              {format(optimisticEvent?.startedAt, 'PPP')}
            </p>
          </div>
          <Dialog
            open={dialogType === 'startedAt'}
            onOpenChange={(checked: boolean) =>
              checked ? setDialogType('startedAt') : setDialogType(null)
            }
          >
            <DialogTrigger className="mb-auto text-sm font-medium leading-6 underline">
              Edit
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit start date</DialogTitle>
              </DialogHeader>
              <form>
                <div>
                  <Input
                    name="startedAt"
                    type="date"
                    defaultValue={format(
                      optimisticEvent?.startedAt,
                      'yyyy-MM-dd',
                    )}
                  />
                </div>
                <div className="mt-4 flex">
                  <SubmitButton
                    formAction={saveInfoAction({
                      fieldName: 'startedAt',
                      inputName: 'startedAt',
                    })}
                    pendingText="Saving..."
                    className="ml-auto"
                  >
                    Save and continue
                  </SubmitButton>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="mb-8 flex justify-between border-b pb-4">
          <div>
            <p>End date</p>
            <p className="text-muted-foreground">
              {format(optimisticEvent?.endedAt, 'PPP')}
            </p>
          </div>
          <Dialog
            open={dialogType === 'endedAt'}
            onOpenChange={(checked: boolean) =>
              checked ? setDialogType('endedAt') : setDialogType(null)
            }
          >
            <DialogTrigger className="mb-auto text-sm font-medium leading-6 underline">
              Edit
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit end date</DialogTitle>
              </DialogHeader>
              <form>
                <div>
                  <Input
                    name="endedAt"
                    type="date"
                    defaultValue={format(
                      optimisticEvent?.endedAt,
                      'yyyy-MM-dd',
                    )}
                  />
                </div>
                <div className="mt-4 flex">
                  <SubmitButton
                    formAction={saveInfoAction({
                      fieldName: 'endedAt',
                      inputName: 'endedAt',
                    })}
                    pendingText="Saving..."
                    className="ml-auto"
                  >
                    Save and continue
                  </SubmitButton>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  )
}
