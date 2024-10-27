import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ChevronLeftIcon, PlusIcon } from 'lucide-react'
import Link from 'next/link'

function Navbar() {
  return (
    <nav className="flex min-h-16 items-center justify-between px-5 py-3">
      <Link href={`/cms/athletes`} className="flex items-center">
        <ChevronLeftIcon />
        <span className="ml-1">Manage athletes</span>
      </Link>
    </nav>
  )
}

export default async function AthleteCreatePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-screen-md flex-col">
      <Navbar />
      <section className="px-5">
        <h1 className="mb-4 text-3xl font-medium">Create athletes</h1>

        <div>
          <h2 className="mb-2 font-medium">Athletes #1</h2>
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Name" />
        </div>
        <div className="mt-4 flex justify-end">
          <Button className="ml-auto rounded-full p-2" variant={'secondary'}>
            <PlusIcon />
          </Button>
        </div>
      </section>
    </main>
  )
}
