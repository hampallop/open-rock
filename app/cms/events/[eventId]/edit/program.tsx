'use client'
import { EventWithCompetePrograms } from '@/app/cms/events/[eventId]/edit/page'
import { Button } from '@/components/ui/button'
import { RadioGroup } from '@/components/ui/radio-group'
import supabase from '@/utils/supabase'
import { PencilIcon } from 'lucide-react'
import { useState } from 'react'
import { RadioGroupItemEnhanced } from '@/components/radio-group-item-enhanced'
import { RouteEditDialog } from '@/components/route-edit-dialog'
import { CheckboxEnhanced } from '@/components/checkbox-enhance'

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
  console.log('optimisticCompetePrograms', optimisticCompetePrograms)

  const [isRouteEditDialogOpen, setIsRouteEditDialogOpen] = useState(false)
  const [routeEditDialogProperties, setRouteEditDialogProperties] = useState({
    roundId: '',
    title: '',
    routeAmount: 0,
  })

  return (
    <>
      <h2 className="text-2xl font-medium mb-2">Programs</h2>

      {optimisticCompetePrograms?.map((program) => (
        <div key={program.id} className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">{program.name}</h3>
            <Button className="rounded-full p-4 h-fit" variant={'secondary'}>
              <PencilIcon size={16} />
            </Button>
          </div>

          <p className="mt-4 mb-1 text-muted-foreground">Discipline</p>
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

          <p className="mt-4 mb-1 text-muted-foreground">Rule</p>
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

          <p className="mt-4 mb-1 text-muted-foreground">Rounds</p>
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
                  className="ml-auto underline -m-2 p-2 hover:bg-primary/5 transition-colors rounded-lg text-muted-foreground text-xs"
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
        </div>
      ))}
    </>
  )
}
