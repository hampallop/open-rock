'use client'

import { useState, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Plus, Minus, Trash2 } from 'lucide-react'
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
  const [isAddProgramOpen, setIsAddProgramOpen] = useState(false)
  const [isAddRoundOpen, setIsAddRoundOpen] = useState(false)
  const [newProgramName, setNewProgramName] = useState('')
  const [newRoundName, setNewRoundName] = useState('')
  const [newRoundRouteAmount, setNewRoundRouteAmount] = useState(4) // Changed initial value to 10
  const [currentProgramIndex, setCurrentProgramIndex] = useState(-1)
  const router = useRouter()

  const handleInputBlur = useCallback(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
  }, [])

  const handleFormSubmit = useCallback(
    (submitFunction: () => void) => {
      return (e: React.FormEvent) => {
        e.preventDefault()
        handleInputBlur()
        setTimeout(submitFunction, 100)
      }
    },
    [handleInputBlur],
  )

  const addProgram = () => {
    if (newProgramName) {
      setPrograms([...programs, { name: newProgramName, rounds: [] }])
      setNewProgramName('')
      setIsAddProgramOpen(false)
    }
  }

  const updateProgram = (index: number, name: string) => {
    const newPrograms = [...programs]
    newPrograms[index].name = name
    setPrograms(newPrograms)
  }

  const deleteProgram = (index: number) => {
    const newPrograms = [...programs]
    newPrograms.splice(index, 1)
    setPrograms(newPrograms)
  }

  const addRound = () => {
    if (newRoundName && currentProgramIndex !== -1) {
      const newPrograms = [...programs]
      newPrograms[currentProgramIndex].rounds.push({
        name: newRoundName,
        routeAmount: newRoundRouteAmount,
      })
      setPrograms(newPrograms)
      setNewRoundName('')
      setNewRoundRouteAmount(1)
      setIsAddRoundOpen(false)
    }
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

  const deleteRound = (programIndex: number, roundIndex: number) => {
    const newPrograms = [...programs]
    newPrograms[programIndex].rounds.splice(roundIndex, 1)
    setPrograms(newPrograms)
  }

  const adjustRouteAmount = (increment: number) => {
    setNewRoundRouteAmount(
      Math.max(1, Math.min(50, newRoundRouteAmount + increment)),
    )
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
      router.push('/cms/events')
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
              className="text-base sm:text-sm" // Increased font size for mobile
            />
          </div>
          <div>
            <Label htmlFor="eventLocation">Location</Label>
            <Input
              id="eventLocation"
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
              required
              className="text-base sm:text-sm" // Increased font size for mobile
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
              className="text-base sm:text-sm" // Increased font size for mobile
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
              className="text-base sm:text-sm" // Increased font size for mobile
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Compete Programs</h3>
          <div className="space-y-4">
            {programs.map((program, programIndex) => (
              <div key={programIndex} className="border p-4 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-md font-semibold">
                    {program.name || `Program ${programIndex + 1}`}
                  </h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteProgram(programIndex)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Input
                  value={program.name}
                  onChange={(e) => updateProgram(programIndex, e.target.value)}
                  placeholder="Program Name"
                  className="mb-2 text-base sm:text-sm"
                />
                <div className="space-y-2">
                  <h5 className="text-sm font-semibold">Rounds</h5>
                  {program.rounds.map((round, roundIndex) => (
                    <div
                      key={roundIndex}
                      className="flex items-center space-x-2"
                    >
                      <Input
                        value={round.name}
                        onChange={(e) =>
                          updateRound(
                            programIndex,
                            roundIndex,
                            'name',
                            e.target.value,
                          )
                        }
                        placeholder="Round Name"
                        className="flex-grow text-base sm:text-sm"
                      />
                      <Input
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
                        className="w-20 text-base sm:text-sm"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteRound(programIndex, roundIndex)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCurrentProgramIndex(programIndex)
                      setIsAddRoundOpen(true)
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Round
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <Sheet open={isAddProgramOpen} onOpenChange={setIsAddProgramOpen}>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddProgramOpen(true)}
                className="mt-4"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Program
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Add New Program</SheetTitle>
                <SheetDescription>
                  Enter the name for the new program.
                </SheetDescription>
              </SheetHeader>
              <form
                onSubmit={handleFormSubmit(addProgram)}
                className="space-y-4 mt-4"
              >
                <div>
                  <Label htmlFor="newProgramName">Program Name</Label>
                  <Input
                    id="newProgramName"
                    value={newProgramName}
                    onChange={(e) => setNewProgramName(e.target.value)}
                    onBlur={handleInputBlur}
                    placeholder="Enter program name"
                    className="text-base sm:text-sm"
                    autoFocus
                  />
                </div>
                <Button type="submit" className="w-full">
                  Add Program
                </Button>
              </form>
            </SheetContent>
          </Sheet>
        </div>

        <Sheet open={isAddRoundOpen} onOpenChange={setIsAddRoundOpen}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Add New Round</SheetTitle>
              <SheetDescription>
                Enter the details for the new round.
              </SheetDescription>
            </SheetHeader>
            <form
              onSubmit={handleFormSubmit(addRound)}
              className="space-y-4 mt-4"
            >
              <div>
                <Label htmlFor="newRoundName">Round Name</Label>
                <Input
                  id="newRoundName"
                  value={newRoundName}
                  onChange={(e) => setNewRoundName(e.target.value)}
                  onBlur={handleInputBlur}
                  placeholder="Enter round name"
                  className="text-base sm:text-sm"
                  autoFocus
                />
              </div>
              <div>
                <Label htmlFor="newRoundRouteAmount">Number of Routes</Label>
                <div className="flex items-center justify-center space-x-2 mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 shrink-0 rounded-full"
                    onClick={() => adjustRouteAmount(-1)}
                    disabled={newRoundRouteAmount <= 1}
                  >
                    <Minus className="h-4 w-4" />
                    <span className="sr-only">Decrease</span>
                  </Button>
                  <div className="flex-1 text-center">
                    <div className="text-5xl sm:text-7xl font-bold tracking-tighter">
                      {newRoundRouteAmount}
                    </div>
                    <div className="text-[0.70rem] uppercase text-muted-foreground">
                      Routes/round
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 shrink-0 rounded-full"
                    onClick={() => adjustRouteAmount(1)}
                    disabled={newRoundRouteAmount >= 50}
                  >
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">Increase</span>
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full">
                Add Round
              </Button>
            </form>
          </SheetContent>
        </Sheet>

        <Button type="submit">Create Event</Button>
      </form>
    </div>
  )
}
