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

export function AthleteList({
  athletes,
  registeredAthletes = [],
}: {
  athletes: Tables<'athletes'>[]
  registeredAthletes: RoundWithProgram['competeRoundAthletes']
}) {
  const [selectedAthletes, setSelectedAthlete] = useState(
    registeredAthletes
      .map((registeredAthlete) => registeredAthlete.athlete)
      .filter(Boolean),
  )
  const [open, setOpen] = useState(false)

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
            key={athlete?.id}
            className="flex items-center rounded-xl border p-2"
          >
            <span>{athlete?.name}</span>
            <Button
              className="ml-auto rounded-full"
              variant="ghost"
              size="icon"
              onClick={() =>
                setSelectedAthlete(
                  selectedAthletes.filter(
                    (selectedAthlete) => selectedAthlete !== athlete,
                  ),
                )
              }
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
                    setSelectedAthlete([...selectedAthletes, athlete])
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
