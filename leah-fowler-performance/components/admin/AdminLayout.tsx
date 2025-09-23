'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { adminLogout } from '@/lib/auth/admin-auth';
import { Button } from '@/components/ui/button';
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
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out lg:transform-none lg:translate-x-0',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-primary mr-2" />
              <span className="text-xl font-bold">Admin Panel</span>
            </div>
            <button
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {allNavigation.map((item, index) => {
              if ('divider' in item) {
                return (
                  <div key={`divider-${index}`} className="my-4">
                    <div className="border-t border-gray-200" />
                    <p className="mt-4 mb-2 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
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
                    'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
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
          <div className="border-t p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.email}
                </p>
                <p className="text-xs text-gray-500">
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
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex-1" />

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <span className="hidden sm:inline-block text-sm">
                    {user?.email?.split('@')[0]}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
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
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}