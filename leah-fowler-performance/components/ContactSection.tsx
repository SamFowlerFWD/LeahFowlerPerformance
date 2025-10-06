"use client"

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  Star,
  Shield,
  Award,
  ArrowRight,
  Video,
  Globe,
  BadgeCheck,
  Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const contactMethods = [
  {
    icon: Calendar,
    title: 'Identity Breakthrough Session',
    value: 'Free 30-min mirror moment call',
    action: 'Start Your Journey',
    href: '#booking',
    gradient: 'from-[#e7007d] to-amber-600',
    popular: true
},
  {
    icon: Video,
    title: 'Virtual Parent Sessions',
    value: 'Connect from anywhere',
    action: 'Join From Home',
    href: '#virtual',
    gradient: 'from-pink-500 to-purple-600',
    popular: false
},
  {
    icon: Mail,
    title: 'Message Another Parent',
    value: "I understand, let's talk",
    action: 'Share Your Story',
    href: 'mailto:leah@aphroditefitness.co.uk',
    gradient: 'from-emerald-500 to-teal-600',
    popular: false
},
]

const timeSlots = [
  '5:30 AM - 6:30 AM (Before school run)',
  '9:30 AM - 10:30 AM (After drop-off)',
  '11:00 AM - 12:00 PM (Morning slot)',
  '1:00 PM - 2:00 PM (Lunch break)',
  '7:30 PM - 8:30 PM (After bedtime)',
  '8:30 PM - 9:30 PM (Evening slot)',
]

export default function ContactSection() {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    parenthoodStage: '',
    biggestChallenge: '',
    programme: '',
    timeSlot: '',
    mirrorMoment: ''
})
  const [isSubmitted, setIsSubmitted] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    setIsSubmitted(true)
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        name: '',
        email: '',
        phone: '',
        parenthoodStage: '',
        biggestChallenge: '',
        programme: '',
        timeSlot: '',
        mirrorMoment: ''
})
    }, 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
})
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
})
  }

  return (
    <section id="contact" className="py-8 sm:py-12 md:py-16 lg:py-24 xl:py-32 bg-white relative overflow-hidden">
      {/* Premium Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50" />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.1, 0.05]
}}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-[#e7007d]/10 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.05, 0.1, 0.05]
}}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-sage/10 to-transparent rounded-full blur-3xl"
        />
      </div>

      {/* Contact section removed per request */}
    </section>
  )
}