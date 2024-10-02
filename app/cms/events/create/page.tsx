'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

interface CompeteRound {
  name: string
  routeAmount: number
}

interface CompeteProgram {
  name: string
  rounds: CompeteRound[]
}

async function upsertBulks({
  eventName,
  eventLocation,
  eventStartDate,
  eventEndDate,
  programs,
}: {
  eventName: string
  eventLocation: string
  eventStartDate: string
  eventEndDate: string
  programs: CompeteProgram[]
}) {
  const supabase = createClient()

  // Create event
  const { data: eventData, error: eventError } = await supabase
    .from('events')
    .insert({
      name: eventName,
      location: eventLocation,
      startedAt: eventStartDate,
      endedAt: eventEndDate,
    })
    .select()
    .single()

  if (eventError) throw eventError
  if (!eventData) throw new Error('Event creation failed')

  const eventId = eventData.id

  // Create programs and rounds
  for (const program of programs) {
    // Create program
    const { data: programData, error: programError } = await supabase
      .from('competePrograms')
      .insert({
        eventId: eventId,
        name: program.name,
      })
      .select()
      .single()

    if (programError) throw programError
    if (!programData) throw new Error('Program creation failed')

    const programId = programData.id

    // Create rounds for the program
    const rounds = program.rounds.map((round) => ({
      competeProgramId: programId,
      name: round.name,
      routeAmount: round.routeAmount,
    }))

    const { error: roundsError } = await supabase
      .from('competeRounds')
      .insert(rounds)

    if (roundsError) throw roundsError
  }

  return true
}

export default function CreateEventPage() {
  const [eventName, setEventName] = useState('')
  const [eventLocation, setEventLocation] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [programs, setPrograms] = useState<CompeteProgram[]>([])
  const router = useRouter()

  const addProgram = () => {
    setPrograms([...programs, { name: '', rounds: [] }])
  }

  const updateProgram = (index: number, name: string) => {
    const newPrograms = [...programs]
    newPrograms[index].name = name
    setPrograms(newPrograms)
  }

  const addRound = (programIndex: number) => {
    const newPrograms = [...programs]
    newPrograms[programIndex].rounds.push({ name: '', routeAmount: 0 })
    setPrograms(newPrograms)
  }

  const updateRound = (
    programIndex: number,
    roundIndex: number,
    field: keyof CompeteRound,
    value: string | number,
  ) => {
    const newPrograms = [...programs]
    newPrograms[programIndex].rounds[roundIndex][field] = value as never
    setPrograms(newPrograms)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await upsertBulks({
        eventName,
        eventLocation,
        eventStartDate: startDate,
        eventEndDate: endDate,
        programs,
      })

      // Reset form and navigate back to events list
      setEventName('')
      setEventLocation('')
      setStartDate('')
      setEndDate('')
      setPrograms([])
      // router.push('/cms/events')
    } catch (error) {
      console.error('Error creating event:', error)
      // Here you might want to show an error message to the user
    }
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Create Event</h2>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="eventName">Event Name</Label>
            <Input
              id="eventName"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="eventLocation">Location</Label>
            <Input
              id="eventLocation"
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Compete Programs</h3>
          <Accordion type="multiple" className="w-full">
            {programs.map((program, programIndex) => (
              <AccordionItem
                value={`program-${programIndex}`}
                key={programIndex}
              >
                <AccordionTrigger>
                  {program.name || `Program ${programIndex + 1}`}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor={`program-${programIndex}-name`}>
                        Program Name
                      </Label>
                      <Input
                        id={`program-${programIndex}-name`}
                        value={program.name}
                        onChange={(e) =>
                          updateProgram(programIndex, e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <h4 className="text-md font-semibold mb-2">Rounds</h4>
                      {program.rounds.map((round, roundIndex) => (
                        <div
                          key={roundIndex}
                          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
                        >
                          <div>
                            <Label
                              htmlFor={`program-${programIndex}-round-${roundIndex}-name`}
                            >
                              Round Name
                            </Label>
                            <Input
                              id={`program-${programIndex}-round-${roundIndex}-name`}
                              value={round.name}
                              onChange={(e) =>
                                updateRound(
                                  programIndex,
                                  roundIndex,
                                  'name',
                                  e.target.value,
                                )
                              }
                              required
                            />
                          </div>
                          <div>
                            <Label
                              htmlFor={`program-${programIndex}-round-${roundIndex}-routes`}
                            >
                              Number of Routes
                            </Label>
                            <Input
                              id={`program-${programIndex}-round-${roundIndex}-routes`}
                              type="number"
                              value={round.routeAmount}
                              onChange={(e) =>
                                updateRound(
                                  programIndex,
                                  roundIndex,
                                  'routeAmount',
                                  parseInt(e.target.value),
                                )
                              }
                              required
                            />
                          </div>
                        </div>
                      ))}
                      <Button
                        type="button"
                        onClick={() => addRound(programIndex)}
                        className="mt-2"
                      >
                        <Plus className="mr-2 h-4 w-4" /> Add Round
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <Button type="button" onClick={addProgram} className="mt-4">
            <Plus className="mr-2 h-4 w-4" /> Add Program
          </Button>
        </div>

        <Button type="submit">Create Event</Button>
      </form>
    </div>
  )
}
