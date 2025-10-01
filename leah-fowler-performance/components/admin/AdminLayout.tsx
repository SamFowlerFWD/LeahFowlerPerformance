'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { adminLogout } from '@/lib/auth/admin-auth';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Home,
  FileText,
  Users,
  ClipboardList,
  BarChart3,
  Settings,
  LogOut,
  User,
  Shield,
  ChevronRight,
  Menu,
  X,
  Activity,
  Lock,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: ReactNode;
  user?: {
    email: string;
    role: string;
  };
}

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: Home },
  { name: 'Blog Posts', href: '/admin/blog', icon: FileText },
  { name: 'Assessments', href: '/admin/assessments', icon: ClipboardList },
  { name: 'Leads', href: '/admin/leads', icon: Users },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

const superAdminNavigation = [
  { name: 'User Management', href: '/admin/users', icon: Shield },
  { name: 'Audit Logs', href: '/admin/audit-logs', icon: Activity },
  { name: 'Security Settings', href: '/admin/settings/security', icon: Lock },
];

export function AdminLayout({ children, user }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isSuperAdmin = user?.role === 'super_admin';

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const result = await adminLogout();
      if (result.success && result.redirectTo) {
        router.push(result.redirectTo);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const allNavigation = isSuperAdmin
    ? [...navigation, { divider: true }, ...superAdminNavigation]
    : navigation;

  return (
    <div className="min-h-screen bg-[#14213b]">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-64 lg:bg-navy lg:shadow-xl">
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="flex items-center h-16 px-4 border-b border-gold/20 bg-navy">
            <Link href="/admin/dashboard" className="flex items-center">
              <Shield className="h-8 w-8 text-gold mr-3" />
              <div>
                <span className="text-lg font-bold text-white">Admin Panel</span>
                <span className="text-xs text-gold/70 block">Leah Fowler Performance</span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto bg-navy">
            {allNavigation.map((item, index) => {
              if ('divider' in item) {
                return (
                  <div key={`divider-${index}`} className="my-4">
                    <div className="border-t border-gold/20" />
                    <p className="mt-4 mb-2 px-2 text-xs font-semibold text-gold/60 uppercase tracking-wider">
                      Super Admin
                    </p>
                  </div>
                );
              }

              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all min-h-[44px]',
                    isActive
                      ? 'bg-gold/20 text-gold border border-gold/30'
                      : 'text-white/80 hover:bg-gold/10 hover:text-gold'
                  )}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                  {isActive && (
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User info */}
          <div className="border-t border-gold/20 p-4 bg-navy">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-gold/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-gold" />
                </div>
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.email}
                </p>
                <p className="text-xs text-gold/60">
                  {user?.role?.replace('_', ' ')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-sticky bg-navy/95 backdrop-blur-premium shadow-xl border-b border-gold/20">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            {/* Mobile menu button */}
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  className="lg:hidden min-h-[44px] min-w-[44px] p-0 hover:bg-gold/10"
                  aria-label="Open menu"
                >
                  <Menu className="h-6 w-6 text-white" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] sm:w-[350px] p-0 bg-navy">
                <div className="flex flex-col h-full">
                  {/* Mobile Menu Header */}
                  <div className="flex items-center justify-between p-4 border-b border-gold/20 bg-navy">
                    <div className="flex items-center gap-3">
                      <Shield className="h-8 w-8 text-gold" />
                      <div>
                        <h2 className="text-lg font-bold text-white">Admin Panel</h2>
                        <p className="text-xs text-gold/60">{user?.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Navigation */}
                  <nav className="flex-1 py-6 px-4 overflow-y-auto">
                    <div className="space-y-2">
                      {allNavigation.map((item, index) => {
                        if ('divider' in item) {
                          return (
                            <div key={`divider-${index}`} className="my-4">
                              <div className="border-t border-gold/20" />
                              <p className="mt-4 mb-2 px-2 text-xs font-semibold text-gold/60 uppercase tracking-wider">
                                Super Admin
                              </p>
                            </div>
                          );
                        }

                        const isActive = pathname === item.href;
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsSidebarOpen(false)}
                            className={cn(
                              'flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all min-h-[48px]',
                              isActive
                                ? 'bg-gold/20 text-gold border border-gold/30'
                                : 'text-white/80 hover:bg-gold/10 hover:text-gold'
                            )}
                          >
                            <item.icon className="h-5 w-5" />
                            {item.name}
                          </Link>
                        );
                      })}
                    </div>
                  </nav>

                  {/* Mobile Menu Footer */}
                  <div className="p-4 border-t border-gold/20">
                    <Button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="w-full justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 min-h-[48px]"
                    >
                      <LogOut className="h-4 w-4" />
                      {isLoggingOut ? 'Signing out...' : 'Sign Out'}
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <div className="flex-1" />

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center min-h-[44px] hover:bg-gold/10">
                  <div className="h-8 w-8 rounded-full bg-gold/20 flex items-center justify-center mr-2">
                    <User className="h-4 w-4 text-gold" />
                  </div>
                  <span className="hidden sm:inline-block text-sm text-white">
                    {user?.email?.split('@')[0]}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white border-gold/20">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {isLoggingOut ? 'Signing out...' : 'Sign Out'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-white min-h-[calc(100vh-64px)]">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}