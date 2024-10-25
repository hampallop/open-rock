import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ChevronLeftIcon, PlusIcon } from 'lucide-react'
import Link from 'next/link'

function Navbar() {
  return (
    <nav className="flex justify-between items-center px-5 py-3 min-h-16">
      <Link href={`/cms/athletes`} className="flex items-center">
        <ChevronLeftIcon />
        <span className="ml-1">Manage athletes</span>
      </Link>
    </nav>
  )
}

export default async function AthleteCreatePage() {
  return (
    <main className="flex flex-col min-h-screen max-w-screen-md mx-auto">
      <Navbar />
      <section className="px-5">
        <h1 className="text-3xl font-medium mb-4 mb-4">Create athletes</h1>

        <div>
          <h2 className="font-medium mb-2">Athletes #1</h2>
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Name" />
        </div>
        <div className="flex justify-end mt-4">
          <Button className="ml-auto rounded-full p-2" variant={'secondary'}>
            <PlusIcon />
          </Button>
        </div>
      </section>
    </main>
  )
}
