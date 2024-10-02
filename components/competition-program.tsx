'use client'

import { useState } from 'react'
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

export function CompetitionProgram() {
  const [activeTab, setActiveTab] = useState('qualification')

  const program = {
    id: 1,
    name: 'Boulder Male',
    eventId: 1,
    rounds: [
      {
        name: 'Qualification',
        athletes: [
          { id: 1, name: 'John Doe', country: 'USA', score: 4 },
          { id: 2, name: 'Jane Smith', country: 'GBR', score: 3 },
          { id: 3, name: 'Alex Johnson', country: 'FRA', score: 5 },
        ],
      },
      {
        name: 'Semi-Final',
        athletes: [
          { id: 1, name: 'John Doe', country: 'USA', score: 3 },
          { id: 3, name: 'Alex Johnson', country: 'FRA', score: 4 },
        ],
      },
      {
        name: 'Final',
        athletes: [{ id: 3, name: 'Alex Johnson', country: 'FRA', score: 2 }],
      },
    ],
  }

  return (
    <Layout title={program.name} backLink={`/events/${program.eventId}`}>
      <Tabs defaultValue="qualification" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          {program.rounds.map((round) => (
            <TabsTrigger key={round.name} value={round.name.toLowerCase()}>
              {round.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {program.rounds.map((round) => (
          <TabsContent key={round.name} value={round.name.toLowerCase()}>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px]">Rank</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead className="w-[80px] text-right">Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {round.athletes.map((athlete, index) => (
                    <TableRow key={athlete.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{athlete.name}</TableCell>
                      <TableCell>{athlete.country}</TableCell>
                      <TableCell className="text-right">
                        {athlete.score}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </Layout>
  )
}
