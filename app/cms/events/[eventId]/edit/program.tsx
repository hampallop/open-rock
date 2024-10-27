'use client'
import { EventWithCompetePrograms } from '@/app/cms/events/[eventId]/edit/page'
import { RadioGroup } from '@/components/ui/radio-group'
import supabase from '@/utils/supabase'
import { useState } from 'react'
import { RadioGroupItemEnhanced } from '@/components/radio-group-item-enhanced'
import { RouteEditDialog } from '@/components/route-edit-dialog'
import { CheckboxEnhanced } from '@/components/checkbox-enhance'
import { ProgramNameEditDialog } from '@/components/program-name-edit-dialog'

const disciplines = [
  { label: 'Boulder', value: 'boulder' },
  { label: 'Lead', value: 'lead' },
  { label: 'Speed', value: 'speed' },
]
const rules = {
  boulder: [
    { label: 'Top zone', value: 'boulder-top-zone' },
    { label: 'Point', value: 'boulder-point' },
  ],
  lead: [{ label: 'Hold Count', value: 'lead-hold-count' }],
  speed: [{ label: 'Time', value: 'speed-time' }],
} as Record<string, { label: string; value: string }[]>

const roundOrder = ['Qualifications', 'Semi-Final', 'Final']
const getRoundIndex = (roundName: string) =>
  roundOrder.findIndex((x) => x === roundName)

export function ProgramSection({
  competePrograms,
}: {
  competePrograms: EventWithCompetePrograms['competePrograms']
}) {
  const [optimisticCompetePrograms, setOptimisticCompetePrograms] = useState(
    competePrograms.map((program) => ({
      ...program,
      competeRounds: program.competeRounds.sort(
        (a, b) => getRoundIndex(a.name) - getRoundIndex(b.name),
      ),
    })),
  )

  const handleRoundChange = async ({
    programId,
    round,
    checked,
  }: {
    programId: string
    round: string
    checked: boolean
  }) => {
    const { data: updatedRound } = await supabase
      .from('competeRounds')
      .update({ status: checked ? 'ACTIVE' : 'INACTIVE' })
      .eq('competeProgramId', programId)
      .eq('name', round)
      .select()
      .single()

    if (updatedRound) {
      setOptimisticCompetePrograms(
        optimisticCompetePrograms.map((program) => {
          if (program?.id === programId) {
            return {
              ...program,
              competeRounds: program.competeRounds.map((round) => {
                if (round.id === updatedRound.id) {
                  return updatedRound
                }
                return round
              }),
            }
          }
          return program
        }),
      )
    }
  }
  const handleCompeteProgramChange = async (params: {
    programId: string
    discipline?: string
    rule?: string
  }) => {
    if (!params.discipline && !params.rule) {
      return
    }
    const changeData = params.discipline
      ? {
          discipline: params.discipline,
          rule: rules[params.discipline][0].value,
        }
      : { rule: params.rule }

    const { data: updatedPrograms } = await supabase
      .from('competePrograms')
      .update(changeData)
      .eq('id', params.programId)
      .select()

    if (updatedPrograms) {
      const newPrograms = optimisticCompetePrograms.map((program) => {
        if (program.id === params.programId) {
          return {
            ...program,
            ...changeData,
          } as EventWithCompetePrograms['competePrograms'][number]
        }
        return program
      })

      setOptimisticCompetePrograms(newPrograms)
    }

    return
  }

  const [isRouteEditDialogOpen, setIsRouteEditDialogOpen] = useState(false)
  const [routeEditDialogProperties, setRouteEditDialogProperties] = useState({
    roundId: '',
    title: '',
    routeAmount: 0,
  })
  const [isProgramNameEditDialogOpen, setIsProgramNameEditDialogOpen] =
    useState(false)
  const [programNameEditProperties, setProgramNameEditDialogProperties] =
    useState({ programId: '', programName: '' })

  return (
    <>
      <h2 className="mb-2 text-2xl font-medium">Programs</h2>

      {optimisticCompetePrograms?.map((program) => (
        <div key={program.id} className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium">{program.name}</h3>
            <button
              className="mb-auto text-sm font-medium leading-6 underline"
              onClick={() => {
                setProgramNameEditDialogProperties({
                  programId: program.id,
                  programName: program.name,
                })
                setIsProgramNameEditDialogOpen(true)
              }}
            >
              Edit
            </button>
          </div>
          <p className="mb-1 mt-4 text-muted-foreground">Discipline</p>
          <RadioGroup
            className="grid grid-rows-3 gap-2"
            value={program.discipline}
            onValueChange={(value: string) => {
              handleCompeteProgramChange({
                programId: program.id,
                discipline: value,
              })
            }}
          >
            {disciplines.map((disciplineOption) => (
              <RadioGroupItemEnhanced
                key={disciplineOption.value}
                id={`${program.id}-${disciplineOption.value}`}
                active={program.discipline === disciplineOption.value}
                value={disciplineOption.value}
              >
                <span>{disciplineOption.label}</span>
              </RadioGroupItemEnhanced>
            ))}
          </RadioGroup>
          <p className="mb-1 mt-4 text-muted-foreground">Rule</p>
          <RadioGroup
            className="grid grid-cols-2 gap-2"
            value={program.rule}
            onValueChange={(value: string) => {
              handleCompeteProgramChange({
                programId: program.id,
                rule: value,
              })
            }}
          >
            {rules[program.discipline]?.map((ruleOption) => (
              <RadioGroupItemEnhanced
                key={ruleOption.value}
                id={`${program.id}-${ruleOption.value}`}
                active={program.rule === ruleOption.value}
                value={ruleOption.value}
              >
                <span>{ruleOption.label}</span>
              </RadioGroupItemEnhanced>
            ))}
          </RadioGroup>
          <p className="mb-1 mt-4 text-muted-foreground">Rounds</p>
          <div className="flex flex-col space-y-4">
            {program.competeRounds?.map((round) => (
              <CheckboxEnhanced
                key={round.id}
                id={`${program.id}-${round.name}`}
                checked={round.status === 'ACTIVE'}
                onCheckedChange={(checked: boolean) => {
                  handleRoundChange({
                    programId: program.id,
                    round: round.name,
                    checked,
                  })
                }}
              >
                <span className="ml-2">{round.name}</span>

                <span
                  className="-m-2 ml-auto rounded-lg p-2 text-xs text-muted-foreground underline transition-colors hover:bg-primary/5"
                  onClick={(e) => {
                    e.preventDefault()
                    setRouteEditDialogProperties({
                      roundId: round.id,
                      title: `How many route, ${round.name} round have?`,
                      routeAmount: round.routeAmount ?? 0,
                    })
                    setIsRouteEditDialogOpen(true)
                  }}
                >
                  {round.routeAmount} routes
                </span>
              </CheckboxEnhanced>
            ))}
          </div>

          <RouteEditDialog
            open={isRouteEditDialogOpen}
            onOpenChange={setIsRouteEditDialogOpen}
            title={routeEditDialogProperties.title}
            routeAmount={routeEditDialogProperties.routeAmount}
            roundId={routeEditDialogProperties.roundId}
            onSave={(routeAmount) => {
              setOptimisticCompetePrograms(
                optimisticCompetePrograms.map((program) => ({
                  ...program,
                  competeRounds: program.competeRounds.map((round) => {
                    if (round.id === routeEditDialogProperties.roundId) {
                      return { ...round, routeAmount }
                    }
                    return round
                  }),
                })),
              )
            }}
          />

          <ProgramNameEditDialog
            open={isProgramNameEditDialogOpen}
            onOpenChange={setIsProgramNameEditDialogOpen}
            programId={programNameEditProperties.programId}
            programName={programNameEditProperties.programName}
            onSave={(programName) => {
              setOptimisticCompetePrograms(
                optimisticCompetePrograms.map((program) => {
                  if (program.id === programNameEditProperties.programId) {
                    return {
                      ...program,
                      name: programName,
                    }
                  }
                  return program
                }),
              )
            }}
          />
        </div>
      ))}
    </>
  )
}
