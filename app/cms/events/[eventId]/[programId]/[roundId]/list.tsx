'use client'
import { Tables } from '@/database.types'

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { useState } from 'react'
import { SearchIcon, XIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RoundWithProgram } from '@/app/cms/events/[eventId]/[programId]/[roundId]/page'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'

export function AthleteList({
  athletes,
  registeredAthletes = [],
  roundId,
}: {
  athletes: Tables<'athletes'>[]
  registeredAthletes: RoundWithProgram['competeRoundAthletes']
  roundId: string
}) {
  const [selectedAthletes, setSelectedAthlete] = useState(
    registeredAthletes
      .map((registeredAthlete) => registeredAthlete.athlete)
      .filter((athlete) => !!athlete),
  )
  const [open, setOpen] = useState(false)

  const supabase = createClient()

  const addMoreAthlete = async (athlete: Tables<'athletes'>) => {
    setSelectedAthlete([...selectedAthletes, athlete])

    await supabase.from('competeRoundAthletes').insert({
      competeRoundId: roundId,
      athleteId: athlete.id,
    })

    toast.success('Athlete added')
  }
  const removeAthlete = async (athlete: Tables<'athletes'>) => {
    setSelectedAthlete(
      selectedAthletes.filter((selectedAthlete) => selectedAthlete !== athlete),
    )

    await supabase
      .from('competeRoundAthletes')
      .delete()
      .eq('competeRoundId', roundId)
      .eq('athleteId', athlete.id)

    toast.success('Athlete removed')
  }

  const selectedAthleteIds = selectedAthletes.map((athlete) => athlete?.id)

  const filteredAthletes = athletes.filter(
    (athlete) => !selectedAthleteIds.includes(athlete.id),
  )

  return (
    <div>
      <Button
        className="rounded-full"
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
      >
        <SearchIcon className="text-muted-foreground" size={20} />
      </Button>
      <div className="flex flex-col space-y-2">
        {selectedAthletes.map((athlete) => (
          <div
            key={athlete.id}
            className="flex items-center rounded-xl border px-4 py-2"
          >
            <Link href={`/cms/athletes/${athlete.id}`} className="underline">
              {athlete.name}
            </Link>
            <Button
              className="-mr-3 ml-auto rounded-full"
              variant="ghost"
              size="icon"
              onClick={() => {
                if (
                  confirm(
                    `Are you sure you want to remove ${athlete.name} from this round?`,
                  )
                ) {
                  removeAthlete(athlete)
                }
              }}
            >
              <XIcon size={16} />
            </Button>
          </div>
        ))}
      </div>

      <CommandDialog title="Athletes" open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type athlete name" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {filteredAthletes.length > 0 && (
            <CommandGroup heading="Athletes">
              {filteredAthletes.map((athlete) => (
                <CommandItem
                  key={athlete.id}
                  onSelect={() => {
                    addMoreAthlete(athlete)
                    setOpen(false)
                  }}
                >
                  {athlete.name}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </div>
  )
}
