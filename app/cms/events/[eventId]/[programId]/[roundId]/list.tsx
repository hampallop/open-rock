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

export function AthleteList({ athletes }: { athletes: Tables<'athletes'>[] }) {
  const [selectedAthletes, setSelectedAthlete] = useState<string[]>([])
  const [open, setOpen] = useState(false)

  const filteredAthletes = athletes.filter(
    (athlete) => !selectedAthletes.includes(athlete.name),
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
            key={athlete}
            className="flex items-center rounded-xl border p-2"
          >
            <span>{athlete}</span>
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
                  onSelect={(value) => {
                    setSelectedAthlete([...selectedAthletes, value])
                    setOpen(false)
                  }}
                  value={athlete.name}
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
