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
    gradient: 'from-gold to-amber-600',
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
    href: 'mailto:leah@leahfowlerperformance.com',
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
    <section id="contact" className="py-32 sm:py-40 md:py-48 lg:py-56 xl:py-64 bg-white relative overflow-hidden">
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
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-gold/10 to-transparent rounded-full blur-3xl"
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

      <div className="relative z-10 max-w-8xl mx-auto px-8 sm:px-12 md:px-16 lg:px-20 xl:px-24">
        {/* Premium Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24 md:mb-32"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-gradient-to-r from-gold/10 to-amber-100/20 backdrop-blur-sm border border-gold/20 text-gold-dark text-base font-semibold mb-12 shadow-lg"
          >
            <Zap className="h-6 w-6" />
            START YOUR TRANSFORMATION
            <Zap className="h-6 w-6" />
          </motion.div>
          
          <h2 className="text-6xl md:text-7xl lg:text-8xl font-playfair font-bold text-navy mb-12 leading-tight">
            Ready to
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gold to-amber-600">
              Reclaim You?
            </span>
          </h2>
          
          <p className="text-2xl md:text-3xl text-gray-600 max-w-5xl mx-auto leading-relaxed">
            Your journey back to yourself begins with understanding.
            Let&apos;s talk parent to parent about reclaiming your identity.
          </p>
        </motion.div>

        {/* Contact Methods Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid md:grid-cols-3 gap-12 md:gap-14 lg:gap-16 max-w-6xl mx-auto mb-32 md:mb-40"
        >
          {contactMethods.map((method, index) => (
            <motion.div
              key={method.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="relative"
            >
              {method.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-gold to-amber-500 text-white text-sm font-bold shadow-lg">
                    <Star className="h-4 w-4" />
                    MOST POPULAR
                  </span>
                </div>
              )}
              <div className={`h-full bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-10 md:p-12 border ${
                method.popular ? 'border-gold/30 ring-2 ring-gold/20' : 'border-gray-100'
              }`}>
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${method.gradient} mb-6`}>
                  <method.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-navy text-xl md:text-2xl mb-4">{method.title}</h3>
                <p className="text-gray-600 text-base md:text-lg mb-6">{method.value}</p>
                <a
                  href={method.href}
                  className={`inline-flex items-center gap-2 font-semibold bg-gradient-to-r ${method.gradient} bg-clip-text text-transparent hover:gap-3 transition-all`}
                >
                  {method.action}
                  <ArrowRight className="h-5 w-5 text-gold" />
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          {/* Glow effect */}
          <div className="absolute -inset-4 bg-gradient-to-r from-gold/10 via-amber-200/10 to-sage/10 rounded-3xl blur-2xl opacity-50" />
          
          <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="grid lg:grid-cols-5 gap-0">
              {/* Left Side - Premium Info Panel */}
              <div className="lg:col-span-2 bg-gradient-to-br from-navy via-navy/95 to-navy-dark p-14 lg:p-16 xl:p-20 text-white">
                <h3 className="text-4xl md:text-5xl font-bold mb-10">
                  Why Parents Trust This Journey
                </h3>
                
                <div className="space-y-8 mb-12">
                  <div className="flex items-start gap-6">
                    <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                      <Award className="h-6 w-6 text-gold" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-2">Parent Who Understands</h4>
                      <p className="text-white/70 text-base">From postnatal struggle to Spartan Ultra - I&apos;ve lived this journey</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-6">
                    <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                      <Shield className="h-6 w-6 text-gold" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-2">Safe Space to Share</h4>
                      <p className="text-white/70 text-base">No judgement, just understanding from one parent to another</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-6">
                    <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                      <Globe className="h-6 w-6 text-gold" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-2">Community of Warriors</h4>
                      <p className="text-white/70 text-base">200+ parents supporting each other&apos;s journeys</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-6">
                    <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                      <BadgeCheck className="h-6 w-6 text-gold" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-2">Real Transformation</h4>
                      <p className="text-white/70 text-base">92% of parents feel themselves again within 12 weeks</p>
                    </div>
                  </div>
                </div>

                {/* Training Location Info */}
                <div className="space-y-6 p-8 md:p-10 bg-white/5 backdrop-blur-sm rounded-2xl">
                  <div className="flex items-center gap-4">
                    <Clock className="h-6 w-6 text-gold" />
                    <div>
                      <p className="font-semibold text-lg">Flexible Hours</p>
                      <p className="text-base text-white/70">Early mornings, school runs, evenings</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <MapPin className="h-6 w-6 text-gold" />
                    <div>
                      <p className="font-semibold text-lg">Location</p>
                      <p className="text-base text-white/70">Norfolk, UK & Virtual</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Phone className="h-6 w-6 text-gold" />
                    <div>
                      <p className="font-semibold text-lg">Direct Line</p>
                      <p className="text-base text-white/70">Available upon booking</p>
                    </div>
                  </div>
                </div>
                
                {/* Trust Badge */}
                <div className="mt-12 text-center">
                  <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-gold/20 to-amber-600/20 backdrop-blur-sm border border-gold/30">
                    <Star className="h-5 w-5 text-gold" />
                    <span className="text-base font-semibold">500+ Parents Reclaimed</span>
                  </div>
                </div>
              </div>

              {/* Right Side - Premium Form */}
              <div className="lg:col-span-3 p-14 lg:p-16 xl:p-20">
                <div className="mb-12">
                  <h3 className="text-4xl md:text-5xl font-bold text-navy mb-4">
                    Start Your Identity Reclamation
                  </h3>
                  <p className="text-gray-600 text-lg">
                    Share your story below and I&apos;ll reach out parent to parent within 24 hours.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Name & Email */}
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <Label htmlFor="contact-name" className="text-navy font-semibold mb-2 block">
                        Full Name *
                      </Label>
                      <Input
                        id="contact-name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Sarah Johnson"
                        required
                        className="h-14 text-base border-gray-200 focus:border-gold focus:ring-gold"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact-email" className="text-navy font-semibold mb-2 block">
                        Email Address *
                      </Label>
                      <Input
                        id="contact-email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="sarah@gmail.com"
                        required
                        className="h-14 text-base border-gray-200 focus:border-gold focus:ring-gold"
                      />
                    </div>
                  </div>

                  {/* Phone & Company */}
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <Label htmlFor="contact-phone" className="text-navy font-semibold mb-2 block">
                        Phone Number *
                      </Label>
                      <Input
                        id="contact-phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+44 7XXX XXXXXX"
                        required
                        className="h-14 text-base border-gray-200 focus:border-gold focus:ring-gold"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact-parenthood" className="text-navy font-semibold mb-2 block">
                        Parenthood Stage *
                      </Label>
                      <Select onValueChange={(value) => handleSelectChange('parenthoodStage', value)}>
                        <SelectTrigger className="h-14 text-base border-gray-200 focus:border-gold focus:ring-gold">
                          <SelectValue placeholder="Select your stage" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pregnant">Pregnant</SelectItem>
                          <SelectItem value="newborn">Newborn (0-6 months)</SelectItem>
                          <SelectItem value="baby">Baby (6-12 months)</SelectItem>
                          <SelectItem value="toddler">Toddler (1-3 years)</SelectItem>
                          <SelectItem value="preschool">Pre-school (3-5 years)</SelectItem>
                          <SelectItem value="school">School age (5+ years)</SelectItem>
                          <SelectItem value="multiple">Multiple ages</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Role & Programme Interest */}
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <Label htmlFor="contact-challenge" className="text-navy font-semibold mb-2 block">
                        Biggest Challenge *
                      </Label>
                      <Select onValueChange={(value) => handleSelectChange('biggestChallenge', value)}>
                        <SelectTrigger className="h-12 border-gray-200 focus:border-gold focus:ring-gold">
                          <SelectValue placeholder="What's your main struggle?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lost-identity">Lost sense of self</SelectItem>
                          <SelectItem value="body-changed">Body doesn&apos;t feel mine</SelectItem>
                          <SelectItem value="no-time">No time for myself</SelectItem>
                          <SelectItem value="guilt">Constant parent guilt</SelectItem>
                          <SelectItem value="exhausted">Completely exhausted</SelectItem>
                          <SelectItem value="isolated">Feeling isolated</SelectItem>
                          <SelectItem value="confidence">Lost confidence</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="contact-programme" className="text-navy font-semibold mb-2 block">
                        Programme Interest
                      </Label>
                      <Select onValueChange={(value) => handleSelectChange('programme', value)}>
                        <SelectTrigger className="h-12 border-gray-200 focus:border-gold focus:ring-gold">
                          <SelectValue placeholder="Select a programme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="reclamation">Identity Reclamation (£350/month)</SelectItem>
                          <SelectItem value="warrior">Warrior Parent (£199/month)</SelectItem>
                          <SelectItem value="online">Online Community (£97/month)</SelectItem>
                          <SelectItem value="group">Small Group (£79/month)</SelectItem>
                          <SelectItem value="unsure">Help me choose</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Preferred Time Slot */}
                  <div>
                    <Label htmlFor="contact-timeslot" className="text-navy font-semibold mb-2 block">
                      Preferred Consultation Time (GMT)
                    </Label>
                    <Select onValueChange={(value) => handleSelectChange('timeSlot', value)}>
                      <SelectTrigger className="h-12 border-gray-200 focus:border-gold focus:ring-gold">
                        <SelectValue placeholder="Select a time slot" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((slot) => (
                          <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Goals */}
                  <div>
                    <Label htmlFor="contact-mirrormoment" className="text-navy font-semibold mb-3 block">
                      Tell Me Your Mirror Moment *
                    </Label>
                    <textarea
                      id="contact-mirrormoment"
                      name="mirrorMoment"
                      value={formData.mirrorMoment}
                      onChange={handleChange}
                      placeholder="When did you look in the mirror and not recognise yourself? What made you search for help today?"
                      rows={4}
                      required
                      className="w-full px-6 py-4 text-base rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-all duration-200 resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="space-y-6">
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full h-16 text-xl font-bold bg-gradient-to-r from-gold to-amber-600 hover:from-amber-600 hover:to-gold text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 rounded-xl"
                      disabled={isSubmitted}
                    >
                      {isSubmitted ? (
                        <>
                          <CheckCircle className="h-6 w-6 mr-3" />
                          Request Submitted Successfully!
                        </>
                      ) : (
                        <>
                          Begin Your Journey Home
                          <ArrowRight className="h-6 w-6 ml-3" />
                        </>
                      )}
                    </Button>
                    
                    <div className="flex items-start gap-3 text-sm text-gray-500">
                      <Shield className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      <p>
                        Your information is 100% secure and will never be shared. 
                        By submitting, you agree to receive communication about our programmes.
                      </p>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-24 md:mt-32 text-center"
        >
          <p className="text-gray-600 text-lg mb-6">
            Prefer to speak directly? Call us on{' '}
            <a href="tel:+447XXXXXXXXX" className="font-semibold text-gold hover:text-gold-dark transition-colors">
              +44 7XXX XXXXXX
            </a>
          </p>
          <div className="inline-flex items-center gap-6 px-10 py-5 rounded-full bg-gray-50 border border-gray-200">
            <span className="text-base text-gray-600">Response time:</span>
            <span className="font-semibold text-navy text-lg">Within 24 hours</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}