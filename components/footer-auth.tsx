import { signOutAction } from '@/app/actions'
import { FooterNavItem } from '@/components/footer-nav-item'
import { createClient } from '@/utils/supabase/server'

import {
  GlobeIcon,
  LogOutIcon,
  SquarePlusIcon,
  UsersRoundIcon,
} from 'lucide-react'

export async function FooterAuth() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <footer className="grid w-full auto-cols-fr grid-flow-col border-t bg-card px-5">
      <FooterNavItem link="/">
        <GlobeIcon className="mb-1" />
        <span className="text-xs">Home</span>
      </FooterNavItem>
      <FooterNavItem link="/cms/events">
        <SquarePlusIcon className="mb-1" />
        <span className="text-xs">Events</span>
      </FooterNavItem>
      <FooterNavItem link="/cms/athletes">
        <UsersRoundIcon className="mb-1" />
        <span className="text-xs">Athletes</span>
      </FooterNavItem>
      {user ? (
        <form action={signOutAction} className="flex">
          <button
            type="submit"
            className={
              'flex w-full cursor-pointer flex-col items-center rounded-xl p-2 text-muted-foreground hover:bg-accent'
            }
          >
            <LogOutIcon className="mb-1" />
            <span className="text-xs">Sign out</span>
          </button>
        </form>
      ) : (
        <FooterNavItem link="/sign-in">
          <GlobeIcon className="mb-1" />
          <span className="text-xs">Sign in</span>
        </FooterNavItem>
      )}
    </footer>
  )
}
