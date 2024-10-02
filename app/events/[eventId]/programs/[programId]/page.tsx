import { CompetitionProgram } from '@/components/competition-program'

export default function ProgramPage({
  params,
}: {
  params: { programId: string }
}) {
  return <CompetitionProgram />
}
