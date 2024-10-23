'use client'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Tables } from '@/database.types'
import { cn } from '@/lib/utils'
import supabase from '@/utils/supabase'
import { PencilIcon } from 'lucide-react'
import { useState } from 'react'

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

export function ProgramSection({
  competePrograms,
}: {
  competePrograms: Tables<'competePrograms'>[]
}) {
  const [optimisticCompetePrograms, setOptimisticCompetePrograms] = useState(
    competePrograms.sort((a, b) => a.name.localeCompare(b.name)),
  )

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
      const newPrograms = optimisticCompetePrograms
        .filter((program) => program.id !== params.programId)
        .concat(updatedPrograms)
        .sort((a, b) => a.name.localeCompare(b.name))

      setOptimisticCompetePrograms(newPrograms)
    }

    return
  }

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
            onValueChange={(value) => {
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
                  'hover:bg-secondary cursor-pointer flex items-center border p-6 space-x-2 rounded-2xl',
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
            onValueChange={(value) => {
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
                  'hover:bg-secondary cursor-pointer flex items-center border p-6 space-x-2 rounded-2xl',
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
        </div>
      ))}
    </>
  )
}