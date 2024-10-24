import { CompetitionProgram } from '@/components/competition-program'
import { createClient } from '@/utils/supabase/server'
import { QueryData } from '@supabase/supabase-js'

async function queryCompeteProgramWithCompeteRounds(programId: string) {
  const supabase = await createClient()
  return supabase
    .from('competePrograms')
    .select('*, competeRounds(*, competeResults(*, athletes(*)))')
    .eq('id', programId)
    .single()
}
export type CompeteProgramWithCompeteRounds = QueryData<
  ReturnType<typeof queryCompeteProgramWithCompeteRounds>
>

export default async function ProgramPage({
  params,
}: {
  params: { eventId: string; programId: string }
}) {
  const { programId } = await params
  const { data: competeProgram, error: _error } =
    await queryCompeteProgramWithCompeteRounds(programId)
  console.log(JSON.stringify(competeProgram, null, 2))
  if (!competeProgram) {
    return <div>No program found</div>
  }
  return <CompetitionProgram competeProgram={competeProgram} />
}
