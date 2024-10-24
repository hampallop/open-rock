import { FooterAuth } from '@/components/footer-auth'
import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/server'
import { PlusIcon } from 'lucide-react'
import Link from 'next/link'

function Navbar() {
  return (
    <nav className="flex justify-between items-center px-5 py-3 min-h-16">
      <Button
        asChild
        className="ml-auto rounded-full p-2"
        variant={'secondary'}
      >
        <Link href="/cms/athletes/create">
          <PlusIcon />
        </Link>
      </Button>
    </nav>
  )
}

export default async function AthletesPage() {
  const supabase = await createClient()
  const { data: athletes } = await supabase.from('athletes').select()

  if (!athletes) {
    return <div>No athletes found</div>
  }

  return (
    <main className="flex flex-col min-h-screen max-h-screen max-w-screen-md mx-auto">
      <Navbar />
      <div className="flex flex-col bg-background px-5">
        <h1 className="text-3xl font-medium mb-4 mb-4">Athletes</h1>
      </div>
      <div className="overflow-y-auto px-5 py-2 flex-grow">
        <div className="flex flex-col">
          {athletes.map((athlete) => (
            <Link
              key={athlete.id}
              href={`/cms/athletes/${athlete.id}`}
              className="text-lg font-medium transition-colors hover:bg-primary/10 rounded-xl p-4 -mx-2"
            >
              {athlete.name}
            </Link>
          ))}
        </div>
      </div>
      <FooterAuth />
    </main>
  )
}
