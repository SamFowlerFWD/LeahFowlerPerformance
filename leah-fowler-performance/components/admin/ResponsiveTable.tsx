'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ResponsiveTableProps {
  columns: {
    key: string
    label: string
    className?: string
    render?: (value: any, row: any) => React.ReactNode
  }[]
  data: any[]
  onRowAction?: (action: string, row: any) => void
  mobileBreakpoint?: string
}

export function ResponsiveTable({
  columns,
  data,
  onRowAction,
  mobileBreakpoint = 'md'
}: ResponsiveTableProps) {
  return (
    <>
      {/* Desktop Table View */}
      <div className={cn('hidden', `${mobileBreakpoint}:block`, 'rounded-lg border border-gray-200/20 overflow-hidden')}>
        <table className="w-full">
          <thead className="bg-gray-50/50 border-b border-gray-200/20">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                    column.className
                  )}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200/20">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50/50 transition-colors">
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn('px-4 py-4 text-sm text-gray-900', column.className)}
                  >
                    {column.render
                      ? column.render(row[column.key], row)
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className={cn(`${mobileBreakpoint}:hidden`, 'space-y-4')}>
        {data.map((row, rowIndex) => (
          <Card key={rowIndex} className="p-4 hover:shadow-card-hover transition-shadow">
            <div className="space-y-3">
              {columns.map((column) => {
                // Skip rendering if it's an action column on mobile and we have onRowAction
                if (column.key === 'actions' && onRowAction) {
                  return null
                }

                return (
                  <div key={column.key} className="flex flex-col sm:flex-row sm:justify-between gap-1">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {column.label}
                    </span>
                    <div className="text-sm text-gray-900">
                      {column.render
                        ? column.render(row[column.key], row)
                        : row[column.key]}
                    </div>
                  </div>
                )
              })}

              {/* Mobile Action Buttons */}
              {onRowAction && (
                <div className="pt-3 border-t border-gray-200/20 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onRowAction('view', row)}
                    className="flex-1 min-h-[44px]"
                  >
                    View Details
                  </Button>
                  {row.phone && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onRowAction('contact', row)}
                      className="flex-1 min-h-[44px]"
                    >
                      Contact
                    </Button>
                  )}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {data.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No data available</p>
        </div>
      )}
    </>
  )
}