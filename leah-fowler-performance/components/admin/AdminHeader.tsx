'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase-auth'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  Shield,
  Home,
  Users,
  FileText,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react'

const supabase = createBrowserClient()

interface AdminHeaderProps {
  userEmail?: string
}

export function AdminHeader({ userEmail }: AdminHeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: Home },
    { name: 'Applications', href: '/admin/assessments', icon: Users },
    { name: 'Blog', href: '/admin/blog', icon: FileText },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ]

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <header className="sticky top-0 z-sticky bg-white/95 backdrop-blur-premium border-b border-gray-200/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/admin/dashboard" className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-gold" />
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-navy">Admin Panel</h1>
                <p className="text-xs text-gray-500">Leah Fowler Performance</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                    min-h-[44px]
                    ${active
                      ? 'bg-gold/10 text-gold border border-gold/20'
                      : 'text-gray-700 hover:bg-navy/5 hover:text-navy'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* User Info and Actions */}
          <div className="flex items-center gap-4">
            {/* User Info - Hidden on mobile */}
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-navy">{userEmail}</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>

            {/* Logout Button - Desktop */}
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="hidden md:flex items-center gap-2 text-gray-700 hover:bg-red-50 hover:text-red-600 min-h-[44px]"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>

            {/* Mobile Menu Trigger */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  className="md:hidden min-h-[44px] min-w-[44px] p-0"
                  aria-label="Open menu"
                >
                  <Menu className="h-6 w-6 text-navy" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[350px]">
                <div className="flex flex-col h-full">
                  {/* Mobile Menu Header */}
                  <div className="flex items-center justify-between pb-4 border-b">
                    <div className="flex items-center gap-3">
                      <Shield className="h-8 w-8 text-gold" />
                      <div>
                        <h2 className="text-lg font-bold text-navy">Admin Panel</h2>
                        <p className="text-xs text-gray-500">{userEmail}</p>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Navigation */}
                  <nav className="flex-1 py-6">
                    <div className="space-y-2">
                      {navigation.map((item) => {
                        const Icon = item.icon
                        const active = isActive(item.href)
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`
                              flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all
                              min-h-[48px]
                              ${active
                                ? 'bg-gold/10 text-gold border border-gold/20'
                                : 'text-gray-700 hover:bg-navy/5 hover:text-navy'
                              }
                            `}
                          >
                            <Icon className="h-5 w-5" />
                            {item.name}
                          </Link>
                        )
                      })}
                    </div>
                  </nav>

                  {/* Mobile Menu Footer */}
                  <div className="pt-4 border-t">
                    <Button
                      onClick={handleLogout}
                      className="w-full justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 min-h-[48px]"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}