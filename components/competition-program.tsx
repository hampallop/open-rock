import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Layout } from '@/components/layout'
import { CompeteProgramWithCompeteRounds } from '@/app/events/[eventId]/programs/[programId]/page'

export function CompetitionProgram({
  competeProgram,
}: {
  competeProgram: CompeteProgramWithCompeteRounds
}) {
  const stickyHeader = (
    <TabsList className="grid w-full grid-cols-3">
      {competeProgram.competeRounds.map((round) => (
        <TabsTrigger key={round.id} value={round.name}>
          {round.name}
        </TabsTrigger>
      ))}
    </TabsList>
  )

  return (
    <Tabs
      defaultValue={competeProgram.competeRounds[0]?.name}
      className="w-full"
    >
      <Layout
        title={competeProgram.name}
        backLink={`/events/${competeProgram.eventId}`}
        stickyHeader={stickyHeader}
      >
        {competeProgram.competeRounds.map((round) => (
          <TabsContent key={round.id} value={round.name}>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px]">Rank</TableHead>
                    <TableHead>Name</TableHead>
                    {Array.from({ length: round.routeAmount || 0 }, (_, i) => (
                      <TableHead key={i} className="w-[80px] text-right">
                        Route {i + 1}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getAthleteResults(round).map((athleteResult, index) => (
                    <TableRow key={athleteResult.athlete.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{athleteResult.athlete.name}</TableCell>
                      {athleteResult.scores.map((score, i) => (
                        <TableCell key={i} className="text-right">
                          {score}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        ))}
      </Layout>
    </Tabs>
  )
}

function getAthleteResults(round: any) {
  const athleteResults: { athlete: any; scores: string[] }[] = []

  round.competeResults.forEach((result: any) => {
    const existingAthlete = athleteResults.find(
      (ar: any) => ar.athlete.id === result.athletes.id,
    )

    if (existingAthlete) {
      existingAthlete.scores[result.routeNo - 1] = result.score
    } else {
      const newAthleteResult = {
        athlete: result.athletes,
        scores: Array(round.routeAmount).fill('-'),
      }
      newAthleteResult.scores[result.routeNo - 1] = result.score
      athleteResults.push(newAthleteResult)
    }
  })

  return athleteResults
}
