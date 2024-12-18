'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Plus, Minus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StepFooter } from '@/components/cms/step-footer'
import { Button } from '@/components/ui/button'

interface CompeteRound {
  name: string
  routeAmount: number
}

interface CompeteProgram {
  name: string
  rounds: CompeteRound[]
}

const roundOptions = [
  { id: 'qualifications', label: 'Qualifications', order: 1 },
  { id: 'semi-final', label: 'Semi-Final', order: 2 },
  { id: 'final', label: 'Final', order: 3 },
]

export default function CreateEventForm() {
  const [step, setStep] = useState(1)
  const [eventName, setEventName] = useState('')
  const [eventLocation, setEventLocation] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [programs, setPrograms] = useState<CompeteProgram[]>([
    { name: '', rounds: [] },
  ])
  const router = useRouter()
  const isValid = {
    1: eventName.length > 0 && startDate.length > 0 && endDate.length > 0,
    2: programs.every((program) => program.name.length > 0),
    3: programs.every((program) => program.rounds.length > 0),
    4: programs.every((program) =>
      program.rounds.every((round) => round.routeAmount > 0),
    ),
  } as Record<number, boolean>
  const isNextValid = isValid[step]

  const handleNextStep = () => {
    setStep(step + 1)
  }

  const handlePrevStep = () => {
    setStep(step - 1)
  }

  const handleProgramNameChange = (index: number, name: string) => {
    const newPrograms = [...programs]
    newPrograms[index] = { ...newPrograms[index], name }
    setPrograms(newPrograms)
  }

  const handleRoundSelection = (programIndex: number, roundName: string) => {
    const newPrograms = [...programs]
    const program = { ...newPrograms[programIndex] }
    const roundIndex = program.rounds.findIndex((r) => r.name === roundName)
    if (roundIndex === -1) {
      program.rounds = [
        ...program.rounds,
        {
          name: roundName,
          routeAmount: roundName === 'Qualifications' ? 5 : 4,
        },
      ].sort(
        (a, b) =>
          (roundOptions.find((roundOption) => a.name === roundOption.label)
            ?.order || 0) -
          (roundOptions.find((roundOption) => b.name === roundOption.label)
            ?.order || 0),
      )
    } else {
      program.rounds = program.rounds.filter((r) => r.name !== roundName)
    }
    newPrograms[programIndex] = program
    setPrograms(newPrograms)
  }

  const handleRouteAmountChange = (
    programIndex: number,
    roundIndex: number,
    amount: number,
  ) => {
    const newPrograms = [...programs]
    const program = { ...newPrograms[programIndex] }
    const round = { ...program.rounds[roundIndex] }
    round.routeAmount = Math.max(1, amount)
    program.rounds = [
      ...program.rounds.slice(0, roundIndex),
      round,
      ...program.rounds.slice(roundIndex + 1),
    ]
    newPrograms[programIndex] = program
    setPrograms(newPrograms)
  }

  const handleSubmit = async () => {
    try {
      const supabase = createClient()
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .insert({
          name: eventName,
          location: eventLocation,
          startedAt: startDate,
          endedAt: endDate,
        })
        .select()
        .single()

      if (eventError) throw eventError
      if (!eventData) throw new Error('Event creation failed')

      const eventId = eventData.id

      for (const program of programs) {
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

      router.push('/cms/events')
    } catch (error) {
      console.error('Error creating event:', error)
    }
  }

  const totalSteps = 5

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="mb-6">
              <h1 className="mb-2 text-2xl font-medium leading-none tracking-tight">
                Fill your event.
              </h1>
            </div>
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
        )
      case 2:
        return (
          <div className="space-y-4">
            <div className="mb-6">
              <h1 className="mb-2 text-2xl font-medium leading-none tracking-tight">
                How many programs do you have?
              </h1>
              <h2 className="text-lg text-muted-foreground">
                E.g., Open Male, Open Female, Intermediate Male, Intermediate
                Female.
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                className="size-10 rounded-full p-1"
                variant={'outline'}
                onClick={() =>
                  setPrograms(programs.slice(0, programs.length - 1))
                }
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-2xl font-bold">{programs.length}</span>
              <Button
                className="size-10 rounded-full p-1"
                variant={'outline'}
                onClick={() =>
                  setPrograms([...programs, { name: '', rounds: [] }])
                }
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {programs.map((program, index) => (
              <div key={index} className="space-y-2">
                <Label htmlFor={`program-${index}`}>Program {index + 1}</Label>
                <Input
                  id={`program-${index}`}
                  value={program.name}
                  onChange={(e) =>
                    handleProgramNameChange(index, e.target.value)
                  }
                  required
                  placeholder="Open Male, Open Female"
                />
              </div>
            ))}
          </div>
        )
      case 3:
        return (
          <div className="space-y-4">
            <div className="mb-6">
              <h1 className="mb-2 text-2xl font-medium leading-none tracking-tight">
                How many rounds does this program have?
              </h1>
            </div>
            {programs.map((program, programIndex) => (
              <div key={programIndex} className="">
                <h3 className="mb-2 text-lg font-semibold">{program.name}</h3>
                <div className="mb-8 space-y-2">
                  {roundOptions.map((option) => (
                    <div
                      key={option.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`${program.name}-${option.id}`}
                        checked={program.rounds.some(
                          (r) => r.name === option.label,
                        )}
                        onCheckedChange={() =>
                          handleRoundSelection(programIndex, option.label)
                        }
                      />
                      <Label htmlFor={`${program.name}-${option.id}`}>
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )
      case 4:
        return (
          <div className="space-y-4">
            <div className="mb-6">
              <h1 className="mb-2 text-2xl font-medium leading-none tracking-tight">
                How many routes each round have?
              </h1>
              <h2 className="text-lg text-muted-foreground">
                E.g., Open Male, Open Female, Intermediate Male, Intermediate
                Female.
              </h2>
            </div>
            {programs.map((program, programIndex) => (
              <Card key={programIndex}>
                <CardHeader className="border-b">
                  <CardTitle>{program.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  {program.rounds.map((round, roundIndex) => (
                    <div
                      key={roundIndex}
                      className="flex items-center space-y-4"
                    >
                      <Label className="mr-auto text-lg text-muted-foreground">
                        {round.name}
                      </Label>
                      <div className="flex items-center space-x-4">
                        <Button
                          className="size-10 rounded-full p-1"
                          variant={'outline'}
                          onClick={() =>
                            handleRouteAmountChange(
                              programIndex,
                              roundIndex,
                              round.routeAmount - 1,
                            )
                          }
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="tabular-nums">
                          {round.routeAmount}
                        </span>
                        <Button
                          className="size-10 rounded-full p-1"
                          variant={'outline'}
                          onClick={() =>
                            handleRouteAmountChange(
                              programIndex,
                              roundIndex,
                              round.routeAmount + 1,
                            )
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        )
      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Summary</h3>
            <div>
              <p>
                <strong>Event Name:</strong> {eventName}
              </p>
              <p>
                <strong>Location:</strong> {eventLocation}
              </p>
              <p>
                <strong>Start Date:</strong> {startDate}
              </p>
              <p>
                <strong>End Date:</strong> {endDate}
              </p>
            </div>
            {programs.map((program, index) => (
              <div key={index}>
                <h4 className="text-lg font-semibold">{program.name}</h4>
                <ul>
                  {program.rounds.map((round, roundIndex) => (
                    <li key={roundIndex}>
                      {round.name}: {round.routeAmount} routes
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <>
      <main className="flex max-h-[calc(100vh-143px)] w-full flex-grow overflow-y-auto py-8">
        <div className="mx-auto h-full w-full max-w-2xl px-5">
          <h2 className="mb-6 text-3xl font-bold">Create Event</h2>
          {renderStepContent()}
        </div>
      </main>
      <StepFooter
        currentStep={step}
        totalSteps={totalSteps}
        onPrevious={handlePrevStep}
        onNext={handleNextStep}
        onSubmit={handleSubmit}
        isNextValid={isNextValid}
      />
    </>
  )
}
