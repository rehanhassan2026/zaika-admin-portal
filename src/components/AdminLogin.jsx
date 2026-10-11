import React, { useState } from 'react'
import {
  UtensilsCrossed,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  AlertCircle
} from 'lucide-react'

export const DEMO_ADMIN_EMAIL = 'admin@zaikaroyale.com'
export const DEMO_ADMIN_PASSWORD = 'admin123'

export function AdminLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const cleanEmail = email.trim().toLowerCase()
    const cleanPass = password.trim()

    setTimeout(() => {
      // Validate credentials (accepts demo credentials or zaika@2026)
      if (
        (cleanEmail === DEMO_ADMIN_EMAIL.toLowerCase() && (cleanPass === DEMO_ADMIN_PASSWORD || cleanPass === 'zaika@2026')) ||
        (cleanEmail === 'admin' && cleanPass === 'admin')
      ) {
        localStorage.setItem('zaika_admin_auth', 'true')
        localStorage.setItem('zaika_admin_user', cleanEmail)
        onLoginSuccess()
      } else {
        setError('Ghalat email ya password! Baraye meharbani demo credentials check karein.')
        setIsSubmitting(false)
      }
    }, 400)
  }

  const handleFillDemo = () => {
    setEmail(DEMO_ADMIN_EMAIL)
    setPassword(DEMO_ADMIN_PASSWORD)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      
      {/* Background Radial Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-rose-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Outer Card Container */}
      <div className="w-full max-w-md relative z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 rounded-3xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 items-center justify-center shadow-xl shadow-amber-500/20 mb-4 border border-amber-300/40">
            <UtensilsCrossed className="w-8 h-8 text-neutral-950" />
          </div>
          
          <h1 className="text-3xl font-black text-white tracking-tight font-serif">
            Zaika<span className="text-amber-400">Royale</span>
          </h1>
          <p className="text-xs uppercase font-extrabold tracking-widest text-amber-400/80 mt-1">
            Operations &amp; Kitchen Portal
          </p>
          <p className="text-sm text-neutral-400 mt-2">
            Sign in to manage incoming customer orders and deliveries
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-neutral-900/90 backdrop-blur-xl border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80">
          
          {error && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Input */}
            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@zaikaroyale.com"
                  className="w-full pl-10 pr-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 text-sm placeholder-neutral-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 text-sm placeholder-neutral-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-500 hover:text-neutral-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-neutral-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition active:scale-98 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access Button */}
          <div className="mt-6 pt-5 border-t border-neutral-800/80">
            <button
              type="button"
              onClick={handleFillDemo}
              className="w-full py-2.5 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Fill Demo Credentials (Auto-Fill)</span>
            </button>
          </div>

          {/* Demo Credentials Box */}
          <div className="mt-4 p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800 text-[11px] text-neutral-400 space-y-1">
            <div className="flex items-center gap-1.5 text-neutral-300 font-bold mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Demo Login Credentials:</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Email:</span>
              <span className="text-amber-300 font-mono font-semibold select-all">admin@zaikaroyale.com</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Password:</span>
              <span className="text-amber-300 font-mono font-semibold select-all">admin123</span>
            </div>
          </div>

        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-neutral-500 mt-6">
          Zaika Royale Bistro Operations • ASF Tower, Airport Road, Karachi
        </p>

      </div>
    </div>
  )
}
