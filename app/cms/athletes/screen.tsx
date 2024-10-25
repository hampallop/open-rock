'use client'
import { CreateAthleteDialog } from '@/app/cms/athletes/create-athlete-dialog'
import { Button } from '@/components/ui/button'
import { Tables } from '@/database.types'
import { PlusIcon } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export function AthletesScreen({
  athletes: initialAthletes,
}: {
  athletes: Tables<'athletes'>[]
}) {
  const [athletes, setAthletes] = useState(initialAthletes)

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
              className="text-lg font-medium transition-colors hover:bg-primary/10 rounded-xl p-4 -mx-2"
            >
              {athlete.name}
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
