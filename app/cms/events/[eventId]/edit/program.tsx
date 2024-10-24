'use client'
import { EventWithCompetePrograms } from '@/app/cms/events/[eventId]/edit/page'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'
import supabase from '@/utils/supabase'
import { PencilIcon } from 'lucide-react'
import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'

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
            className="grid grid-cols-3 gap-2"
            value={program.discipline}
            onValueChange={(value: string) => {
              handleCompeteProgramChange({
                programId: program.id,
                discipline: value,
              })
            }}
          >
            {disciplines.map((disciplineOption) => (
              <Label
                key={disciplineOption.value}
                htmlFor={`${program.id}-${disciplineOption.value}`}
                className={cn(
                  'hover:bg-primary/10 transition-colors cursor-pointer flex items-center border p-6 space-x-2 rounded-2xl',
                  program.discipline === disciplineOption.value &&
                    'ring ring-primary ring-2 bg-secondary',
                )}
              >
                <RadioGroupItem
                  value={disciplineOption.value}
                  id={`${program.id}-${disciplineOption.value}`}
                />
                <span>{disciplineOption.label}</span>
              </Label>
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
              <Label
                key={ruleOption.value}
                htmlFor={`${program.id}-${ruleOption.value}`}
                className={cn(
                  'hover:bg-primary/10 transition-colors cursor-pointer flex items-center border p-6 space-x-2 rounded-2xl',
                  program.rule === ruleOption.value &&
                    'ring ring-primary ring-2 bg-secondary',
                )}
              >
                <RadioGroupItem
                  value={ruleOption.value}
                  id={`${program.id}-${ruleOption.value}`}
                />
                <span>{ruleOption.label}</span>
              </Label>
            ))}
          </RadioGroup>

          <p className="mt-4 mb-1 text-muted-foreground">Rounds</p>
          <div className="flex flex-col space-y-4">
            {program.competeRounds?.map((round) => (
              <Label
                key={round.id}
                htmlFor={`${program.id}-${round.name}`}
                className={cn(
                  'hover:bg-primary/10 transition-colors cursor-pointer flex items-center border p-6 space-x-2 rounded-2xl',
                  round.status === 'ACTIVE' &&
                    'ring ring-primary ring-2 bg-secondary',
                )}
              >
                <Checkbox
                  id={`${program.id}-${round.name}`}
                  checked={round.status === 'ACTIVE'}
                  onCheckedChange={(checked: boolean) => {
                    handleRoundChange({
                      programId: program.id,
                      round: round.name,
                      checked,
                    })
                  }}
                />
                <span>{round.name}</span>
              </Label>
            ))}
          </div>
        </div>
      ))}
    </>
  )
}
