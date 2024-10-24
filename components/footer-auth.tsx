import { signOutAction } from '@/app/actions'
import { FooterNav } from '@/components/footer-nav'
import { createClient } from '@/utils/supabase/server'

import { GlobeIcon, LogOutIcon, SquarePlusIcon } from 'lucide-react'

export async function FooterAuth() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <footer className="h-20 w-full border-t flex items-center bg-card px-5 py-2 justify-between">
      <section className="flex max-w-screen-md mx-auto w-full bg-background space-x-2">
        <FooterNav link="/">
          <GlobeIcon className="mb-1" />
          <span className="text-xs">Home</span>
        </FooterNav>
        <FooterNav link="/cms/events">
          <SquarePlusIcon className="mb-1" />
          <span className="text-xs">Manage events</span>
        </FooterNav>
        {user ? (
          <form action={signOutAction}>
            <button
              type="submit"
              className={
                'text-muted-foreground flex flex-col items-center cursor-pointer hover:bg-accent rounded-xl p-2'
              }
            >
              <LogOutIcon className="mb-1" />
              <span className="text-xs">Sign out</span>
            </button>
          </form>
        ) : (
          <FooterNav link="/sign-in">
            <GlobeIcon className="mb-1" />
            <span className="text-xs">Sign in</span>
          </FooterNav>
        )}
      </section>
    </footer>
  )
}
