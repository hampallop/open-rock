'use client'
import { CreateAthleteDialog } from '@/app/cms/athletes/create-athlete-dialog'
import { Button } from '@/components/ui/button'
import { Tables } from '@/database.types'
import { EllipsisIcon, PlusIcon, Trash2Icon } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'
import { createClient } from '@/utils/supabase/client'

export function AthletesScreen({
  athletes: initialAthletes,
}: {
  athletes: Tables<'athletes'>[]
}) {
  const [athletes, setAthletes] = useState(initialAthletes)
  const [lastFocusId, setLastFocusId] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedAthlete, setSelectedAthlete] =
    useState<Tables<'athletes'> | null>(null)
  console.log('lastFocusId', lastFocusId)

  const deleteAthlete = async () => {
    setAthletes(
      athletes.filter((athlete) => athlete.id !== selectedAthlete?.id),
    )
    const supabase = await createClient()
    await supabase.from('athletes').delete().eq('id', selectedAthlete?.id)
    toast.success('Athlete deleted')
  }

  return (
    <>
      <nav className="flex justify-between items-center px-5 py-3 min-h-16">
        <CreateAthleteDialog
          onSave={(newAthlete) => {
            setAthletes([...athletes, newAthlete])
          }}
        >
          <Button className="ml-auto rounded-full p-2" variant={'secondary'}>
            <PlusIcon />
          </Button>
        </CreateAthleteDialog>
      </nav>
      <div className="flex flex-col bg-background px-5">
        <h1 className="text-3xl font-medium mb-4 mb-4">Athletes</h1>
      </div>
      <div className="overflow-y-auto px-5 py-2 flex-grow">
        <div className="flex flex-col">
          {athletes.map((athlete) => (
            <Link
              key={athlete.id}
              href={`/cms/athletes/${athlete.id}`}
              className={cn(
                'justify-between items-center flex text-lg font-medium transition-colors hover:bg-primary/10 focus:bg-primary/10 focus-within:bg-primary/10 rounded-xl p-4 -mx-2',
                lastFocusId === athlete.id && 'bg-primary/10',
              )}
            >
              <span className="flex items-center min-h-9">{athlete.name}</span>

              <MenuDropdown
                openDeleteDialog={() => setShowDeleteDialog(true)}
                onOpenChange={(open) => {
                  if (open) {
                    setLastFocusId(athlete.id)
                    setSelectedAthlete(athlete)
                  } else {
                    setLastFocusId(null)
                  }
                }}
              >
                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:bg-primary/10 h-fit p-2 rounded-xl"
                  onClick={(e) => {
                    e.preventDefault()
                  }}
                >
                  <EllipsisIcon size={20} />
                </Button>
              </MenuDropdown>
            </Link>
          ))}
        </div>
      </div>

      <DeleteAthleteDialog
        open={showDeleteDialog}
        onOpenChange={(open) => {
          console.log('open', open)
          setShowDeleteDialog(open)
        }}
        athleteName={selectedAthlete?.name ?? ''}
        onSubmit={() => {
          deleteAthlete()
        }}
      />
    </>
  )
}

function MenuDropdown({
  onOpenChange = () => {},
  openDeleteDialog,
  children,
}: {
  onOpenChange?: (open: boolean) => void
  openDeleteDialog: () => void
  children: React.ReactNode
}) {
  return (
    <DropdownMenu modal={false} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={(e) => {
            e.preventDefault()
            openDeleteDialog()
          }}
        >
          <Trash2Icon /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function DeleteAthleteDialog({
  open,
  onOpenChange,
  athleteName,
  onSubmit,
}: {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  athleteName: string
  onSubmit: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete athlete?</DialogTitle>
          <DialogDescription>
            The {athleteName} will be permanently deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange?.(false)}>
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={() => {
              onSubmit()
              onOpenChange?.(false)
            }}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
