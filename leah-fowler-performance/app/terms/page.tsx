'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, FileText, Users, Award } from 'lucide-react'

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-navy-dark">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-b from-navy via-navy/95 to-navy-dark py-16 sm:py-20 md:py-24"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
            <span className="font-body">Back to Home</span>
          </Link>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-normal text-white mb-6 leading-tight">
            Terms & Conditions
          </h1>

          <p className="text-lg sm:text-xl text-white/90 font-body leading-relaxed max-w-3xl">
            Please read these terms carefully before using our services. By making payment or signing up for any service, you agree to be bound by these terms and conditions.
          </p>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-12 sm:py-16 md:py-20">

        {/* Online Coaching Terms - Placeholder */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 sm:mb-20"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#e7007d]/20 to-[#c70069]/20">
              <FileText className="h-6 w-6 text-[#e7007d]" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-normal text-navy dark:text-white">
              Online Coaching Terms
            </h2>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none font-body">
            <div className="bg-gray-50 dark:bg-navy-light/50 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-white/10">

              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-6 leading-relaxed italic">
                Thank you for using our Services. Our "Services" include our website, our app, and the coaching services you connect to through our website or app. Please do read these Terms of Use ("Terms") carefully. By using our Services, you agree to these Terms. If you do not agree to these, do not download or use our Services (if you&apos;ve already downloaded our app, you will need to delete this immediately).
              </p>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                Last updated: 6th October 2024
              </p>

              {/* TL;DR Section */}
              <div className="bg-gradient-to-br from-[#e7007d]/10 to-[#c70069]/10 border-2 border-[#e7007d]/30 rounded-2xl p-6 sm:p-8 mb-10">
                <h4 className="text-2xl sm:text-3xl font-heading font-normal text-[#e7007d] mb-4 flex items-center gap-2">
                  <span>TL;DR - Key Points</span>
                </h4>
                <ul className="space-y-3 text-gray-800 dark:text-gray-200">
                  <li className="flex items-start gap-3">
                    <span className="text-[#e7007d] font-bold mt-1">•</span>
                    <span><strong>Not Medical Advice:</strong> Our services are for information and entertainment only. Consult your doctor before starting any programme.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#e7007d] font-bold mt-1">•</span>
                    <span><strong>Use At Your Own Risk:</strong> Exercise carries risks. You are solely responsible for your safety.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#e7007d] font-bold mt-1">•</span>
                    <span><strong>Age Requirement:</strong> You must be 18+ or have parental consent.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#e7007d] font-bold mt-1">•</span>
                    <span><strong>Cancellation:</strong> You waive your 14-day withdrawal right once you access digital content.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#e7007d] font-bold mt-1">•</span>
                    <span><strong>Termination:</strong> Requires 1 month&apos;s notice, effective from next billing period.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#e7007d] font-bold mt-1">•</span>
                    <span><strong>Governing Law:</strong> These terms are governed by the laws of England and Wales.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#e7007d] font-bold mt-1">•</span>
                    <span><strong>No Guarantees:</strong> We cannot guarantee specific results like weight loss or muscle gain.</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-8 text-gray-700 dark:text-gray-300">

                <div>
                  <h4 className="text-xl sm:text-2xl font-heading font-normal text-navy dark:text-white mt-8 mb-3">
                    1. Who We Are and What This Agreement Does
                  </h4>
                  <p className="leading-relaxed mb-4">
                    We are Aphrodite Fitness, a business in United Kingdom. Our address is The Orchard, Common Road, East Tuddenham.
                  </p>
                  <p className="leading-relaxed">
                    These Terms govern your access to and use of our Services. These Terms set out:
                  </p>
                  <ul className="list-disc pl-6 mt-2 space-y-2">
                    <li>your legal rights and responsibilities;</li>
                    <li>our legal rights and responsibilities; and</li>
                    <li>certain key information required by law.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-xl sm:text-2xl font-heading font-normal text-navy dark:text-white mt-8 mb-3">
                    2. How to Contact Us
                  </h4>
                  <p className="leading-relaxed mb-4">
                    <strong>Contacting us:</strong> We are here to help. If you wish to contact us for any reason, please email us at leah@aphroditefitness.co.uk
                  </p>
                  <p className="leading-relaxed mb-4">
                    <strong>How we will communicate with you:</strong> If we have to contact you, we will do so by email, by SMS or by pre-paid post, using the contact details you have provided to us.
                  </p>
                  <p className="leading-relaxed">
                    By signing up to be contacted on our website, you acknowledge that we (or our representative) may contact you to tell you more about our services.
                  </p>
                </div>

                <div>
                  <h4 className="text-xl sm:text-2xl font-heading font-normal text-navy dark:text-white mt-8 mb-3">
                    3. How You May Use Our Services
                  </h4>
                  <p className="leading-relaxed mb-4">
                    In return for your agreeing to comply with these Terms you may:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mb-4">
                    <li>download a copy of our website and app onto your personal device and use the Services for your personal purposes only.</li>
                    <li>if you download our app, receive and use any free app updates with "patches" and corrections of errors as we may provide to you.</li>
                    <li>order coaching services from us, which we may agree to provide to you on the terms set out below.</li>
                  </ul>
                  <p className="leading-relaxed mb-4">
                    You must be at least 18 years old or have parental consent to accept these Terms and download or use our Services. If you are under 18 and have parental consent, we recommend that your parents participate in your coaching session and that they advise you on your use of our Services.
                  </p>
                  <p className="leading-relaxed mb-4">
                    If you are under 18 years of age and have not obtained your parents&apos; consent to participate in a coaching session with us, we cannot accept you as a client.
                  </p>
                  <p className="leading-relaxed">
                    Any plans delivered as part of the Services (e.g. meal and workout plans) can be accessed online. Access to any plans expires upon termination of the Services (you are therefore encouraged to save/print any plans at your own convenience).
                  </p>
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-6 rounded-r-xl">
                  <h4 className="text-xl sm:text-2xl font-heading font-normal text-amber-900 dark:text-amber-100 mb-3">
                    4. Our Services Are Not Medical Advice
                  </h4>
                  <p className="leading-relaxed mb-4 text-amber-900 dark:text-amber-100">
                    Our Services, including all meal and workout plans, are provided for general information and entertainment purposes only. We do not offer health, medical, dietary, nutrition, or professional advice which you or anyone else should rely on. The members of Aphrodite Fitness are not doctors, dietitians, or nutritionists and your use of our services does not create a doctor-patient, dietician patient, or nutritionist-patient relationship between you and any of the members of Aphrodite Fitness.
                  </p>
                  <p className="leading-relaxed mb-4 text-amber-900 dark:text-amber-100">
                    We do not and cannot diagnose, treat, cure, or prevent any disease, medical condition, or symptom. If you have questions regarding medical issues or potential impacts of the programme, you should consult with your personal healthcare provider before using our services. You should always speak with your personal healthcare provider before starting any workout plan or making any changes to your diet.
                  </p>
                  <p className="leading-relaxed text-amber-900 dark:text-amber-100">
                    It is outside our scope of practice to prescribe a supplement or a particular dosage to our clients. We do not recommend diets, foods, supplements, workouts, or exercises to prevent, treat, diagnose, or cure any disease, medical condition, or symptom. All meal plans provided through our services are only suggestions and are not a substitute for the advice of a doctor, nutritionist, dietician, or other medical provider. Meal plans do not guarantee any particular health outcome, including weight loss or other standard health markers.
                  </p>
                </div>

                <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-6 rounded-r-xl">
                  <h4 className="text-xl sm:text-2xl font-heading font-normal text-red-900 dark:text-red-100 mb-3">
                    5. Use of Our Services Is At Your Own Risk
                  </h4>
                  <p className="leading-relaxed mb-4 font-bold text-red-900 dark:text-red-100">
                    YOU ARE SOLELY RESPONSIBLE FOR YOUR INTERACTIONS WITH US, OUR MEAL PLANS, AND OUR WORKOUT PLANS. USE OF OUR SERVICES IS AT YOUR OWN RISK.
                  </p>
                  <p className="leading-relaxed mb-4 text-red-900 dark:text-red-100">
                    If you experience faintness, dizziness, shortness of breath, pain, or any other medical issue while exercising, stop and seek medical attention immediately. Exercise carries certain risks of injury and you are undertaking all exercises at your own risk.
                  </p>
                  <p className="leading-relaxed mb-4 text-red-900 dark:text-red-100">
                    All allergies, intolerances, injuries, illnesses, and diseases must always be communicated in the intake questionnaire. You must always carefully review the contents of your meal plan for anything that you may be allergic or intolerant to. Restriction on calorie intake may lead to anxiety, eating disorders, depression, fatigue, and other mental and physical health issues. You should seek help immediately if you experience any such issues.
                  </p>
                  <p className="leading-relaxed text-red-900 dark:text-red-100">
                    Always make sure that you have enough space when performing any activities. Make sure that nothing around you can cause harm or impair movement. If you choose to use any fitness equipment, doing so is at your own risk.
                  </p>
                </div>

                <div>
                  <h4 className="text-xl sm:text-2xl font-heading font-normal text-navy dark:text-white mt-8 mb-3">
                    6. Ordering Coaching Services
                  </h4>
                  <p className="leading-relaxed mb-4">
                    You may order our services by signing up through the contact form on our website. We or our sales representative will then contact you to learn more about you and your wishes. If there&apos;s a fit between us, you will be sent an email containing the details for your coaching as agreed between us, as well as a payment link.
                  </p>
                  <p className="leading-relaxed mb-4">
                    Our acceptance of your order will take place when we email you to accept it, at which point our contract for coaching services will come into existence between you and us. If we are unable to accept your order, we will inform you of this and will not charge you for the coaching services. This might be because of unexpected limits on our resources which we could not reasonably plan for, because a credit reference we have obtained for you does not meet our minimum requirements, or because we have identified an error in the price or description of the services.
                  </p>
                  <p className="leading-relaxed mb-4">
                    You may at any time change the information in your order until it has been accepted by emailing leah@aphroditefitness.co.uk. Once an order is accepted, a copy of these Terms will be emailed to you directly together with an order confirmation.
                  </p>
                  <p className="leading-relaxed">
                    Once the order is complete, the Service will be available to you as detailed in your order confirmation. The Service will continue (and these Terms will stay in force) for the duration of your programme.
                  </p>
                </div>

                <div>
                  <h4 className="text-xl sm:text-2xl font-heading font-normal text-navy dark:text-white mt-8 mb-3">
                    7. Payment Terms
                  </h4>
                  <p className="leading-relaxed mb-4">
                    Any Services to be paid for, will be displayed prior to payment and include an overview of each month&apos;s payments. All fees, charges, VAT and delivery costs (if applicable) are included in the price (which will be further specified during checkout). Payment can be all at once (up-front) or in monthly arrears (as specified in the order form).
                  </p>
                  <p className="leading-relaxed mb-4">
                    If you agree to receive our paid-for Services (including our coaching services), you will be signed up for payment through a third party service. With automatic signup, your card details will be encrypted during transmission through Secure Sockets Layer (SSL) encryption. This encryption ensures a high level of security regarding unauthorised access to your information.
                  </p>
                  <p className="leading-relaxed">
                    Your payment terms will depend on the precise services that are agreed between you and us. Any payment via this service will effectively discharge you from your payment obligation. A copy of these payment terms will be set out in your order confirmation.
                  </p>
                </div>

                <div>
                  <h4 className="text-xl sm:text-2xl font-heading font-normal text-navy dark:text-white mt-8 mb-3">
                    8. Whose Devices Can I Use the App On?
                  </h4>
                  <p className="leading-relaxed">
                    You can only download, install and use the App on a device that you own or have permission to use for these purposes. You will be responsible for complying with these Terms and for any use that is made of this App on another device, whether or not you own the device and/or if such use is with your knowledge or consent.
                  </p>
                </div>

                <div>
                  <h4 className="text-xl sm:text-2xl font-heading font-normal text-navy dark:text-white mt-8 mb-3">
                    9. If You Download Our App, the App Store&apos;s Terms Also Apply
                  </h4>
                  <p className="leading-relaxed">
                    The ways in which you can use our app may be subject to the Apple App Store or Google Play Store (each, an App Store) rules and policies, and the App Store&apos;s rules and policies will apply instead of these Terms where there are differences between the two.
                  </p>
                </div>

                <div>
                  <h4 className="text-xl sm:text-2xl font-heading font-normal text-navy dark:text-white mt-8 mb-3">
                    10. Compatible Device
                  </h4>
                  <p className="leading-relaxed">
                    The app should only be downloaded to and installed on a compatible device. Please read the App Store listing for the app before downloading to ensure that your device is compatible.
                  </p>
                </div>

                <div>
                  <h4 className="text-xl sm:text-2xl font-heading font-normal text-navy dark:text-white mt-8 mb-3">
                    11. Updates and Changes to the Services
                  </h4>
                  <p className="leading-relaxed mb-4">
                    From time to time we may update and change the Services (including our app and website) to improve performance, enhance functionality, reflect changes to the operating system or address security issues. Please ensure you accept all updates in respect of the Services, including our app. You will be notified of all significant changes to the app and all updates will be provided free of charge.
                  </p>
                  <p className="leading-relaxed mb-4">
                    If you choose not to install such updates or if you opt out of automatic updates you may not be able to continue using our Services (including our app) or the functionality may be reduced. Should an update in itself reduce functionality or your ability to use our Service, you are permitted to cancel your subscription within 30 days from the notification.
                  </p>
                  <p className="leading-relaxed">
                    Please note that the app may be subject to your local laws on the sale of goods and the rules on non conformity and defects found in such laws apply to the app.
                  </p>
                </div>

                <div>
                  <h4 className="text-xl sm:text-2xl font-heading font-normal text-navy dark:text-white mt-8 mb-3">
                    12. Your Account
                  </h4>
                  <p className="leading-relaxed mb-4">
                    You must keep any login details such as username, password and security questions confidential and not disclose them to any other person. If you have any reason to believe that they have been compromised, you must promptly reset them using our &apos;Forgotten Password&apos; feature.
                  </p>
                  <p className="leading-relaxed mb-4">
                    You must not under any circumstances allow any other person to access the platform using your login details. Not only will it affect the functionality of the Services as statistics and tracking will not be correct, but you will also be responsible for any actions taken by a person using your user account, whether or not with your knowledge or consent.
                  </p>
                  <p className="leading-relaxed">
                    Allowing others to access the Services using your login details is a breach of these Terms and may result in your right to use the Services being suspended or us ending your right to use the Services.
                  </p>
                </div>

                <div>
                  <h4 className="text-xl sm:text-2xl font-heading font-normal text-navy dark:text-white mt-8 mb-3">
                    13. You May Not Transfer the Services to Someone Else
                  </h4>
                  <p className="leading-relaxed">
                    We are giving you personally the right to use the Services as set out in these Terms. You may not transfer the Services to someone else, whether for money, for anything else or for free except as permitted under the terms of the App Store. If you sell any device on which our app is installed, you must remove the app from it.
                  </p>
                </div>

                <div>
                  <h4 className="text-xl sm:text-2xl font-heading font-normal text-navy dark:text-white mt-8 mb-3">
                    14. Your Privacy
                  </h4>
                  <p className="leading-relaxed mb-4">
                    We only use any personal information we collect through your use of our Services in the ways set out in our Privacy Notice.
                  </p>
                  <p className="leading-relaxed">
                    Internet transmissions are never completely private or secure. This means there is a risk that any information you send using our Services (including our website or app) may be read or intercepted by others, even if there is a special notice that a particular transmission is encrypted.
                  </p>
                </div>

                <div>
                  <h4 className="text-xl sm:text-2xl font-heading font-normal text-navy dark:text-white mt-8 mb-3">
                    15. Intellectual Property Rights
                  </h4>
                  <p className="leading-relaxed mb-4">
                    All intellectual property rights in the Services (including our app and website) throughout the world belong to us and our licensors. The rights in the Services are licensed (not sold) to you. You have no intellectual property rights in, or to, the Services other than the right to use them in accordance with these Terms.
                  </p>
                  <p className="leading-relaxed mb-4">
                    These Terms grant you a personal, non-transferable and non-exclusive right to use our Services. We grant you this right for the sole purpose of receiving the Services as permitted in these Terms.
                  </p>
                  <p className="leading-relaxed mb-4">
                    Our Services (including our app and website) are protected by copyright, trademark, and other intellectual property laws. Nothing in these Terms gives you a right to use the Aphrodite Fitness name or any of the Aphrodite Fitness trademarks, logos, domain names, other distinctive brand features, and other proprietary rights (whether they belong to us or our licensors). All right, title, and interest in and to our Services (excluding content provided by you) are and will remain the exclusive property of us and our licensors.
                  </p>
                  <p className="leading-relaxed mb-4">
                    Any feedback, comments, or suggestions you may provide regarding our Services (including our app and website) is entirely voluntary and we will be free to use such feedback, comments or suggestions as we see fit and without any obligation to you.
                  </p>
                  <p className="leading-relaxed mb-4">
                    We will treat any content you upload via the Services as belonging to us. You must not upload any content unless you have a right to do so and such content complies with the Acceptable Use Restrictions section below.
                  </p>
                  <p className="leading-relaxed">
                    If anyone else suggests our Services or their use in line with these Terms infringes their IP, we are responsible for investigating and defending that claim.
                  </p>
                </div>

                <div>
                  <h4 className="text-xl sm:text-2xl font-heading font-normal text-navy dark:text-white mt-8 mb-3">
                    16. Licence Restrictions
                  </h4>
                  <p className="leading-relaxed mb-4">
                    You agree that you will:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mb-4">
                    <li>not sub-license or otherwise make available our Services (including the app or any workout or meal plans) to any person without prior written consent from us;</li>
                    <li>not copy the Services (including our app and website), except as part of the normal use of the Services or where it is necessary for the purpose of back-up or operational security;</li>
                    <li>not translate, merge, adapt, vary, alter or modify, the whole or any part of the Services (including the app and website);</li>
                    <li>not combine or incorporate the Services in or with any other programs, except as necessary to use the Services on devices as permitted in these Terms;</li>
                    <li>not disassemble, de-compile, reverse engineer or create derivative works based on the whole or any part of the Services, nor attempt to do any such things, unless to the extent as expressly permitted by applicable laws;</li>
                    <li>comply with all applicable laws and regulations that apply to the technology used or supported by the Services.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-xl sm:text-2xl font-heading font-normal text-navy dark:text-white mt-8 mb-3">
                    17. Acceptable Use Restrictions
                  </h4>
                  <p className="leading-relaxed mb-4">
                    You may use our Services (including our app and website) only for lawful purposes. You must:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mb-4">
                    <li>not use the Services in any unlawful manner, for any unlawful purpose, or in any manner inconsistent with these Terms;</li>
                    <li>not act fraudulently or maliciously;</li>
                    <li>not access, use, distribute or transmit malicious code, such as viruses, or harmful data, into the any Services (including the app or website) or any operating system;</li>
                    <li>not infringe our intellectual property rights or those of any third party in relation to your use of the any Services;</li>
                    <li>not transmit any material that is defamatory, discriminatory, threatening, obscene, sexually explicit, offensive or otherwise objectionable in relation to your use of any Services;</li>
                    <li>not use the any Services in a way that could damage, overburden, impair or compromise our systems or security or interfere with other users;</li>
                    <li>not collect or harvest any information or data from any Services or our systems or attempt to decipher any transmissions to or from the servers running any Services.</li>
                  </ul>
                  <p className="leading-relaxed mb-4">
                    Further, if you take part in the group chat functionality in our App, you must:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mb-4">
                    <li>not spread dangerous information or misinformation (e.g. inspire other users on the App not to eat);</li>
                    <li>not discuss or organise criminal activities;</li>
                    <li>not engage in spam/promotions; and</li>
                    <li>not engage in hate speech, body-negativity or bullying.</li>
                  </ul>
                  <p className="leading-relaxed">
                    We reserve the right to delete your content and/or account permanently if we find that you violate these rules.
                  </p>
                </div>

                <div>
                  <h4 className="text-xl sm:text-2xl font-heading font-normal text-navy dark:text-white mt-8 mb-3">
                    18. Our Responsibility for Loss or Damage Suffered by You
                  </h4>
                  <p className="leading-relaxed mb-4">
                    <strong>Limitations to the Services:</strong> We have not developed our Services to meet your every need. To the extent we provide any personalised exercise routines or meal plans, you recognise that you carry these out at your own risk. If you have any concerns about these Services and your health, you must consult your GP or healthcare professional.
                  </p>
                  <p className="leading-relaxed mb-4">
                    You use the information provided through the Services at your own risk. Although we make reasonable efforts to update the information provided by the Services, we make no representations, warranties or guarantees, whether express or implied that such information is accurate, complete or up to date. You may receive advice from third parties through the Services however we accept no liability for any advice received from third parties using the Services.
                  </p>
                  <p className="leading-relaxed mb-4">
                    <strong>Please back-up content and data used with the app:</strong> We recommend that you back up any content and data used in connection with the app, to protect yourself in case of problems with the app or the Services.
                  </p>
                  <p className="leading-relaxed">
                    <strong>We are not responsible for delays outside our control:</strong> If our supply of the coaching services is delayed by an event outside our control then we will contact you as soon as possible to let you know and we will take steps to minimise the effect of the delay. Provided we do this we will not be liable for delays caused by the event, but if there is a risk of substantial delay you may contact us to discuss your potential rights to end the contract and receive a refund for any services you have paid for but not received.
                  </p>
                </div>

                <div>
                  <h4 className="text-xl sm:text-2xl font-heading font-normal text-navy dark:text-white mt-8 mb-3">
                    19. Limitations of Liability
                  </h4>
                  <p className="leading-relaxed mb-4">
                    For clarification, these Terms do not limit our liability for fraud, fraudulent misrepresentation, death, personal injury or any other liability to the extent that applicable law would prohibit such a limitation.
                  </p>
                  <p className="leading-relaxed mb-4 font-bold">
                    Limitation on Damages:
                  </p>
                  <p className="leading-relaxed mb-4 uppercase text-sm">
                    IN NO EVENT WILL APHRODITE FITNESS, ITS OWNER(S) EMPLOYEES, AGENTS OR AFFILIATES, BE LIABLE TO THE OTHER PARTY FOR ANY CONSEQUENTIAL, INCIDENTAL, INDIRECT, SPECIAL, PUNITIVE OR EXEMPLARY DAMAGES, COSTS OR EXPENSES (INCLUDING, BUT NOT LIMITED TO, LOST PROFITS, LOST REVENUES AND/OR LOST SAVINGS), WHETHER BASED UPON A CLAIM OR ACTION OF CONTRACT, WARRANTY, NEGLIGENCE, STRICT LIABILITY OR OTHERWISE, ARISING FROM A BREACH OR ALLEGED BREACH OF THESE TERMS, OR THE USE OF ANY SERVICES PROVIDED HEREUNDER.
                  </p>
                  <p className="leading-relaxed mb-4 font-bold">
                    Liability Cap:
                  </p>
                  <p className="leading-relaxed mb-4 uppercase text-sm">
                    IN NO EVENT SHALL OUR LIABILITY TO YOU FOR ANY BREACH OR ALLEGED BREACH OF THESE TERMS WITH RESPECT TO ANY CLAIMS HEREUNDER EXCEED A MAXIMUM AGGREGATE AMOUNT OF THE AMOUNT PAID BY YOU TO US DURING THE 6 MONTHS IMMEDIATELY PRECEDING THE CLAIM.
                  </p>
                  <p className="leading-relaxed mb-4 font-bold">
                    Applicability:
                  </p>
                  <p className="leading-relaxed uppercase text-sm">
                    THE FOREGOING DISCLAIMERS AND LIMITATIONS OF LIABILITY SHALL APPLY EVEN IF THE PARTIES HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES AND NOTWITHSTANDING THE FAILURE OF ANY ESSENTIAL PURPOSE THEREOF.
                  </p>
                </div>

                <div>
                  <h4 className="text-xl sm:text-2xl font-heading font-normal text-navy dark:text-white mt-8 mb-3">
                    20. What Will Happen If You Do Not Give Required Information to Us
                  </h4>
                  <p className="leading-relaxed">
                    We may need certain information from you so that we can supply our coaching services to you, for example, on your body and wellbeing, including height, weight, body statistics, workouts, mood, meals, nutrition and general wellbeing. We will contact you to ask for this information. If you do not give us this information within a reasonable time of us asking for it, or if you give us incomplete or incorrect information, we may either end the contract or make an additional charge of a reasonable sum to compensate us for any extra work that is required as a result. We will not be responsible for supplying services late or not supplying any part of them if this is caused by you not giving us the information we need within a reasonable time of us asking for it.
                  </p>
                </div>

                <div>
                  <h4 className="text-xl sm:text-2xl font-heading font-normal text-navy dark:text-white mt-8 mb-3">
                    21. We Are Not Responsible for Other Websites
                  </h4>
                  <p className="leading-relaxed mb-4">
                    Our Services may contain links to other independent websites which are not provided by us. Such independent sites are not under our control, and we are not responsible for and have not checked and approved their content or their privacy policies (if any).
                  </p>
                  <p className="leading-relaxed">
                    You will need to make your own independent judgement about whether to use any such independent sites, including whether to buy any products or services offered by them.
                  </p>
                </div>

                <div>
                  <h4 className="text-xl sm:text-2xl font-heading font-normal text-navy dark:text-white mt-8 mb-3">
                    22. Ending This Agreement
                  </h4>
                  <p className="leading-relaxed mb-4">
                    You may choose to end your agreement with us at the end of your minimum commitment period. To do so, you must provide us with at least 1 month&apos;s notice. If you end our agreement in this way, your termination will only be effective from the first day of the following billing period.
                  </p>
                  <p className="leading-relaxed mb-4">
                    <strong>If you don&apos;t comply with these Terms (including failure to pay):</strong> We may end your rights to use the Services at any time by contacting you if we reasonably believe that you have not complied with these Terms in a serious way. This may include if you fail to make a payment. If what you have done can be put right we will give you a reasonable opportunity to do so. If we end your right to use the Services in this way, we may retain payments you have already made to cover our costs and/or compensate us for our losses resulting from your failure to comply.
                  </p>
                  <p className="leading-relaxed mb-4">
                    <strong>We may end the contract if it becomes impossible or impractical to provide our Services:</strong> If we decide to suspend or stop providing any part of our Services in this way, we will let you know if we are going to do this. If you have paid for our Services in advance, you may be entitled to a proportionate refund of the money you have paid in advance and for the time you haven&apos;t been able to use our Services because we have ended the contract.
                  </p>
                  <p className="leading-relaxed mb-4">
                    <strong>Exercising your right to change your mind:</strong> By accepting these terms, you agree that you can access digital content in the form of workouts, training programmes and meal plans before your normal 14-day withdrawal period has expired. Therefore, you expressly waive your right of withdrawal from the moment you access your digital content. Until you get access, you have the right of withdrawal under the general rules of the Consumer Contracts Regulations.
                  </p>
                  <p className="leading-relaxed mb-4">
                    Notice of withdrawal must be given digitally by email to leah@aphroditefitness.co.uk and must be received by us before you have accessed the Digital Content. In the subject field, please write &quot;Withdrawal&quot;.
                  </p>
                  <p className="leading-relaxed mb-4">
                    <strong>Your legal rights:</strong> We are under a legal duty to supply services that are in conformity with this contract. Nothing in these Terms will affect your legal rights.
                  </p>
                  <p className="leading-relaxed mb-4">
                    If this agreement comes to an end:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>you must stop all activities authorised by these Terms, including your use of the app and the coaching services;</li>
                    <li>you must delete or remove the app from all devices in your possession and immediately destroy all copies of the app which you have and confirm to us that you have done this;</li>
                    <li>we may remotely access your devices and remove the app from them and cease providing you with access to the support services.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-xl sm:text-2xl font-heading font-normal text-navy dark:text-white mt-8 mb-3">
                    23. We May Transfer This Agreement to Someone Else
                  </h4>
                  <p className="leading-relaxed">
                    We may transfer our rights and obligations under these Terms to another organisation, for example if we are acquired by a third party, provided that we remain liable towards you for the performance by the assignee. We may always transfer our rights and obligations under these Terms to another organisation in connection with a business sale. We will always tell you in writing if this happens and we will ensure that the transfer will not affect your rights under these Terms.
                  </p>
                </div>

                <div>
                  <h4 className="text-xl sm:text-2xl font-heading font-normal text-navy dark:text-white mt-8 mb-3">
                    24. You Need Our Consent to Transfer Your Rights to Someone Else
                  </h4>
                  <p className="leading-relaxed">
                    You may only transfer your rights or your obligations under these Terms to another person if we agree in writing.
                  </p>
                </div>

                <div>
                  <h4 className="text-xl sm:text-2xl font-heading font-normal text-navy dark:text-white mt-8 mb-3">
                    25. Third Party Rights
                  </h4>
                  <p className="leading-relaxed">
                    The App Store and its group of companies can enforce these Terms on our behalf to ensure you comply. Other than this, third parties do not have any rights to enforce these Terms.
                  </p>
                </div>

                <div>
                  <h4 className="text-xl sm:text-2xl font-heading font-normal text-navy dark:text-white mt-8 mb-3">
                    26. If a Court Finds Part of This Contract Illegal, the Rest Will Continue in Force
                  </h4>
                  <p className="leading-relaxed">
                    Each of the paragraphs of these Terms operates separately. If any court or relevant authority decides that any of them are unlawful, the remaining paragraphs will remain in full force and effect.
                  </p>
                </div>

                <div>
                  <h4 className="text-xl sm:text-2xl font-heading font-normal text-navy dark:text-white mt-8 mb-3">
                    27. Even If We Delay in Enforcing These Terms, We Can Still Enforce It Later
                  </h4>
                  <p className="leading-relaxed">
                    Even if we delay in enforcing these Terms, we can still enforce it later. If we do not insist immediately that you do anything you are required to do under these Terms, or if we delay in taking steps against you in respect of your failure to comply with these Terms, that will not mean that you do not have to do those things and it will not prevent us taking steps against you at a later date.
                  </p>
                </div>

                <div>
                  <h4 className="text-xl sm:text-2xl font-heading font-normal text-navy dark:text-white mt-8 mb-3">
                    28. Governing Law and Jurisdiction
                  </h4>
                  <p className="leading-relaxed">
                    These Terms are governed by the laws of England and Wales, provided that this choice of law does not affect the protection you enjoy under the mandatory law of your country of residence. You can bring legal proceedings in respect of the Services in the competent courts.
                  </p>
                </div>

                <div>
                  <h4 className="text-xl sm:text-2xl font-heading font-normal text-navy dark:text-white mt-8 mb-3">
                    29. Complaints
                  </h4>
                  <p className="leading-relaxed">
                    If you want to complain about the Service, feel free to contact us by writing an email at leah@aphroditefitness.co.uk. Your complaint will be duly processed in accordance with market practices without undue delay.
                  </p>
                </div>

              </div>
            </div>
          </div>
        </motion.section>

        {/* Personal Training Terms */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16 sm:mb-20"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-normal text-navy dark:text-white">
              Personal Training Sessions
            </h2>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none font-body">
            <div className="bg-gray-50 dark:bg-navy-light/50 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-white/10">

              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                This Personal Training Contract (the &quot;Contract&quot;) is entered into on the date of signing up (the &quot;Effective Date&quot;), by and between Aphrodite Fitness, with an address of Common Road, East Tuddenham (the &quot;Company&quot;) and yourself, also individually referred to as the &quot;Party&quot;, and collectively the &quot;Parties.&quot;
              </p>

              <h3 className="text-2xl sm:text-3xl font-heading font-normal text-navy dark:text-white mt-8 mb-4">
                Terms and Conditions
              </h3>

              <div className="space-y-6 text-gray-700 dark:text-gray-300">
                <p className="leading-relaxed">
                  The Parties agree to the following terms and conditions:
                </p>

                <div className="space-y-4">
                  <p className="leading-relaxed">
                    The Client is engaging the Company for personal training services to be provided by the Company&apos;s Trainer(s) (the &quot;Trainer&quot;).
                  </p>

                  <p className="leading-relaxed">
                    Personal Training sessions will last 60 minutes, unless otherwise agreed.
                  </p>

                  <p className="leading-relaxed">
                    The Trainer will create an exercise programme geared to the Client&apos;s fitness level and experience in order to meet the Client&apos;s objectives.
                  </p>

                  <p className="leading-relaxed">
                    The Client agrees to sign Informed Consent form when asked to do so.
                  </p>

                  <p className="leading-relaxed">
                    The Client agrees to inform the Company and its Trainer(s) of any and all conditions, medical or otherwise, that may affect the Client&apos;s ability to participate in Training Sessions.
                  </p>
                </div>

                <h4 className="text-xl sm:text-2xl font-heading font-normal text-navy dark:text-white mt-8 mb-3">
                  Training Sessions
                </h4>
                <p className="leading-relaxed">
                  Training Sessions may include, but are not limited to, the following activities: testing of physical fitness; exercise; aerobics and aerobic conditioning; cardiovascular training; weight lifting and training; and stretching. The session may need to be delivered online via Zoom or similar.
                </p>

                <h4 className="text-xl sm:text-2xl font-heading font-normal text-navy dark:text-white mt-8 mb-3">
                  Training Package and Payments
                </h4>
                <p className="leading-relaxed">
                  The Client is purchasing a monthly block (irrespective of 4 or 5 weeks) Training Sessions at a rate of £120 per calendar month (or otherwise agreed for more sessions). All Training Sessions must be used within 31 days of the Effective Date of this Contract. If the Client wishes to purchase additional Training Sessions, the Parties will enter into an amendment to this Contract. All payments must be made at the start of each calendar month before starting any sessions. No sessions are scheduled in Christmas, Easter, school half term and parts of the summer holiday. The package consists of 42 sessions per calendar year, the client will be programmed a workout to do from their home or gym for the remaining 10 weeks of the year.
                </p>

                <h4 className="text-xl sm:text-2xl font-heading font-normal text-navy dark:text-white mt-8 mb-3">
                  Cancellation of Training Session
                </h4>
                <p className="leading-relaxed">
                  The Client shall provide twenty-four (24) hour notice of any necessary cancellation of a scheduled Training Session. Failure to provide twenty-four (24) hour notice may result in the Client being charged the full rate for the cancelled/missed Training Session, at the discretion of the company. The Company and its Trainer(s) will endeavour to also provide the Client twenty-four (24) hour notice of any scheduled Training Session that may need to be cancelled; however, there may be instances where this is not practicable, and such would not constitute breach of this Contract on behalf of the Company. Alternative options for delivery, i.e. over Zoom can be arranged.
                </p>

                <h4 className="text-xl sm:text-2xl font-heading font-normal text-navy dark:text-white mt-8 mb-3">
                  Indemnity
                </h4>
                <p className="leading-relaxed">
                  The Client agrees to indemnify and hold harmless the Company and its Trainer(s) for any injuries, illnesses, and the like experienced as the result of the Client&apos;s Training Sessions.
                </p>

                <h4 className="text-xl sm:text-2xl font-heading font-normal text-navy dark:text-white mt-8 mb-3">
                  Termination
                </h4>
                <p className="leading-relaxed">
                  Either Party may terminate this Contract upon thirty (30) days prior written notice to the other Party. In the event of termination by either Party, the Company shall refund the Client all monies paid for any unused Training Sessions.
                </p>

                <h4 className="text-xl sm:text-2xl font-heading font-normal text-navy dark:text-white mt-8 mb-3">
                  Warranties
                </h4>
                <p className="leading-relaxed">
                  While the Company and its Trainer(s) fully believe exercise, specifically exercised personalised to the Client, is beneficial to the Client&apos;s health and wellness, the Company and its Trainer(s) cannot guarantee the results of Training Sessions. The Company and its Trainer(s) make no representations and/or warranties that the Client will lose weight, gain muscle mass, be able to engage in any specific physical and/or athletic activity, or will attain any other particular and/or specific results. The Company and its Trainer(s) strongly encourage the Client to follow a healthy diet in conjunction with personal training and continued exercise.
                </p>

                <h4 className="text-xl sm:text-2xl font-heading font-normal text-navy dark:text-white mt-8 mb-3">
                  Entire Agreement
                </h4>
                <p className="leading-relaxed">
                  This document reflects the entire agreement between the Parties and reflects a complete understanding of the Parties with respect to the subject matter. This Contract supersedes all prior written and oral representations. The Contract may not be amended, altered, or supplemented except in writing signed by both the Company and the Client.
                </p>

                <h4 className="text-xl sm:text-2xl font-heading font-normal text-navy dark:text-white mt-8 mb-3">
                  Dispute Resolution and Legal Fees
                </h4>
                <p className="leading-relaxed">
                  In the event of a dispute arising out of this Contract that cannot be resolved by mutual agreement, the Parties agree to engage in mediation. If the matter cannot be resolved through mediation, and legal action ensues, the successful Party will be entitled to its legal fees, including, but not limited to its legal fees.
                </p>

                <h4 className="text-xl sm:text-2xl font-heading font-normal text-navy dark:text-white mt-8 mb-3">
                  Legal and Binding Contract
                </h4>
                <p className="leading-relaxed">
                  This Contract is legal and binding between the Parties as stated above. This Contract may be entered into and is legal and binding both in the United Kingdom and throughout Europe. The Parties each represent that they have the authority to enter into this Contract.
                </p>

                <h4 className="text-xl sm:text-2xl font-heading font-normal text-navy dark:text-white mt-8 mb-3">
                  Severability
                </h4>
                <p className="leading-relaxed">
                  If any provision of this Contract shall be held to be invalid or unenforceable for any reason, the remaining provisions shall continue to be valid and enforceable. If the Court finds that any provision of this Contract is invalid or unenforceable, but that by limiting such provision it would become valid and enforceable, then such provision shall be deemed to be written, construed, and enforced as so limited.
                </p>

                <h4 className="text-xl sm:text-2xl font-heading font-normal text-navy dark:text-white mt-8 mb-3">
                  Waiver
                </h4>
                <p className="leading-relaxed">
                  The failure of either Party to enforce any provision of this Contract shall not be construed as a waiver or limitation of that Party&apos;s right to subsequently enforce and compel strict compliance with every provision of this Contract.
                </p>

                <h4 className="text-xl sm:text-2xl font-heading font-normal text-navy dark:text-white mt-8 mb-3">
                  Applicable Law
                </h4>
                <p className="leading-relaxed">
                  This Contract shall be governed and construed in accordance with the laws of the country where the Training Sessions will occur, without giving effect to any conflicts of laws provisions.
                </p>

                <div className="bg-[#e7007d]/10 border-l-4 border-[#e7007d] p-6 mt-8 rounded-r-xl">
                  <p className="font-bold text-navy dark:text-white mb-3 text-lg">
                    Agreement Acknowledgement
                  </p>
                  <p className="leading-relaxed">
                    BY MAKING PAYMENT THE CLIENT IS AGREEING TO THESE TERMS. THE CLIENT ACKNOWLEDGES HAVING READ AND UNDERSTOOD THIS CONTRACT AND THAT THE CLIENT IS SATISFIED WITH THE TERMS AND CONDITIONS CONTAINED IN THIS CONTRACT. THE CLIENT IS ENTITLED TO A COPY OF THIS CONTRACT AT ANY TIME.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gradient-to-br from-[#e7007d]/10 to-[#c70069]/10 rounded-2xl p-8 sm:p-10 border border-[#e7007d]/20"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-[#e7007d]/20">
              <Award className="h-6 w-6 text-[#e7007d]" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-normal text-navy dark:text-white">
              Questions?
            </h2>
          </div>

          <p className="font-body text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            If you have any questions about these terms and conditions, please don&apos;t hesitate to contact us.
          </p>

          <div className="space-y-3">
            <p className="font-body text-gray-700 dark:text-gray-300">
              <strong className="font-bold text-navy dark:text-white">Email:</strong>{' '}
              <a href="mailto:leah@strengthpt.co.uk" className="text-[#e7007d] hover:underline">
                leah@strengthpt.co.uk
              </a>
            </p>
            <p className="font-body text-gray-700 dark:text-gray-300">
              <strong className="font-bold text-navy dark:text-white">Phone:</strong>{' '}
              <a href="tel:+447990600958" className="text-[#e7007d] hover:underline">
                07990 600958
              </a>
            </p>
            <p className="font-body text-gray-700 dark:text-gray-300">
              <strong className="font-bold text-navy dark:text-white">Address:</strong> Common Road, East Tuddenham
            </p>
          </div>
        </motion.section>

        {/* Last Updated */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="font-body text-sm text-gray-500 dark:text-gray-400">
            Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </motion.div>
      </div>
    </div>
  )
}
