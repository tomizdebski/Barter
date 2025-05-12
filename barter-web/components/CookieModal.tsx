'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image' // Zakładam że używasz Next.js

type Preferences = {
  strictlyNecessary: boolean
  performance: boolean
  targeting: boolean
}

export default function CookieModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [preferences, setPreferences] = useState<Preferences>({
    strictlyNecessary: true,
    performance: false,
    targeting: false,
  })

  useEffect(() => {
    const savedPrefs = localStorage.getItem('cookiePreferences')
    if (!savedPrefs) {
      setIsOpen(true)
    }
  }, [])

  const savePreferences = (prefs: Preferences) => {
    localStorage.setItem('cookiePreferences', JSON.stringify(prefs))
    setIsOpen(false)
  }

  const handleAcceptAll = () => {
    savePreferences({
      strictlyNecessary: true,
      performance: true,
      targeting: true,
    })
  }

  const handleDeclineAll = () => {
    savePreferences({
      strictlyNecessary: true,
      performance: false,
      targeting: false,
    })
  }

  return (
    <>
      {/* === Trigger Button === */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-50 flex items-center gap-2 bg-[#1e1e1e] text-white rounded-full px-4 py-2 hover:pl-6 transition-all group"
      >
        <Image src="icons/cookies.svg" alt="Cookie Icon" width={24} height={24} />
        <span className="opacity-0 group-hover:opacity-100 transition-opacity">
          Cookie Settings
        </span>
      </button>

      {/* === Cookie Modal === */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 left-4 z-50 max-w-md rounded-2xl bg-gradient-to-br from-[#00262b] to-[#00404d] p-6 text-white shadow-[0_0_30px_rgba(0,0,0,0.6)] backdrop-blur-md border border-white/10"
          >
            <h2 className="text-xl font-bold mb-2">This website uses cookies</h2>
            <p className="text-sm mb-4 text-gray-200">
              This website uses cookies to improve user experience. By using our website, you consent to all cookies in accordance with our Cookie Policy.{' '}
              <span className="underline cursor-pointer">Read more</span>
            </p>

            <div className="space-y-2 mb-4">
              <Checkbox label="Strictly Necessary" checked disabled />
              <Checkbox
                label="Performance"
                checked={preferences.performance}
                onChange={() =>
                  setPreferences((prev) => ({ ...prev, performance: !prev.performance }))
                }
              />
              <Checkbox
                label="Targeting"
                checked={preferences.targeting}
                onChange={() =>
                  setPreferences((prev) => ({ ...prev, targeting: !prev.targeting }))
                }
              />
            </div>

            <div className="flex justify-between gap-2 mb-4">
              <button
                onClick={handleAcceptAll}
                className="rounded-full bg-[#aafaf4] text-black px-4 py-2 font-semibold hover:bg-[#c2f7f2] transition"
              >
                Accept All
              </button>
              <button
                onClick={handleDeclineAll}
                className="rounded-full bg-[#aafaf4] text-black px-4 py-2 font-semibold hover:bg-[#c2f7f2] transition"
              >
                Decline All
              </button>
            </div>

            <button
              onClick={() => setShowDetails((prev) => !prev)}
              className="flex items-center gap-2 text-sm underline"
            >
              {showDetails ? 'Hide details' : 'Show details'}
            </button>

            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: 0.2 }}
                    className="mt-4 bg-white text-black rounded-xl p-4 shadow-md"
                  >
                    <div className="flex gap-4 mb-2 flex-wrap">
                      <span className="px-2 py-1 bg-black text-white rounded">Strictly Necessary</span>
                      <span className="px-2 py-1 bg-gray-300 text-black rounded">Performance</span>
                      <span className="px-2 py-1 bg-gray-300 text-black rounded">Targeting</span>
                    </div>
                    <p className="text-sm mb-2">
                      These cookies are essential for basic website functionality like user login and session management.
                    </p>
                    <div className="text-xs">
                      <strong>_GRECAPTCHA</strong> – provided by Google LLC, expires in 6 months
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function Checkbox({
  label,
  checked,
  onChange,
  disabled = false,
}: {
  label: string
  checked: boolean
  onChange?: () => void
  disabled?: boolean
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="w-4 h-4"
      />
      <label className={`uppercase text-sm ${disabled ? 'opacity-60' : ''}`}>{label}</label>
    </div>
  )
}
