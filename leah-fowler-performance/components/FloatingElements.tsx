"use client"

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
 '@/lib/utils'

export default function FloatingElements() {
  const [isWhatsAppHovered, setIsWhatsAppHovered] = React.useState(false)

  return (
    <>
      {/* Floating WhatsApp Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, type: "spring", stiffness: 100 }}
        className="fixed bottom-8 right-8 z-50"
        onMouseEnter={() => setIsWhatsAppHovered(true)}
        onMouseLeave={() => setIsWhatsAppHovered(false)}
      >
        {/* Pulse Animation */}
        <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20" />
        
        {/* Button */}
        <motion.a
          href="https://wa.me/447990600958?text=Hi%20Leah,%20I'm%20interested%20in%20your%20performance%20coaching%20programmes"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="relative flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full shadow-2xl hover:shadow-green-500/30 transition-all duration-300"
        >
          <MessageCircle className="h-8 w-8 text-white fill-white" />
          
          {/* Tooltip */}
          <AnimatePresence>
            {isWhatsAppHovered && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="absolute right-full mr-4 whitespace-nowrap"
              >
                <div className="bg-navy dark:bg-white text-white dark:text-navy px-4 py-2 rounded-lg shadow-xl text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    Chat with Leah on WhatsApp
                  </div>
                  <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-l-8 border-transparent border-l-navy dark:border-l-white" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.a>

        {/* Badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 2.5 }}
          className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center"
        >
          1
        </motion.div>
      </motion.div>

      {/* Quick Action Bar Removed - Cleaner mobile experience without bottom bar */}
    </>
  )
}