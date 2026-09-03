import { motion } from 'framer-motion';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-primary relative overflow-hidden flex flex-col items-center justify-center px-4">
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-bg-secondary via-bg-primary to-bg-primary opacity-80" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-accent/5 rounded-full blur-3xl" />

      <motion.div
        className="relative z-10 text-center max-w-3xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <p className="text-gold-light/80 text-sm tracking-[0.3em] uppercase mb-4 font-medium">
          Krishna Security Lab
        </p>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-50 mb-6 leading-tight">
          ENTER THE{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-light to-gold">
            SECURITY LAB
          </span>
        </h1>

        <p className="text-slate-400 text-lg sm:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
          Learn how vulnerabilities work.
          <br />
          Break them in a controlled environment.
          <br />
          Fix them like a security engineer.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            className="px-8 py-3.5 bg-gold text-bg-primary font-semibold rounded-lg
                       hover:bg-gold-light transition-colors shadow-gold
                       focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-bg-primary"
          >
            ENTER LAB
          </button>
          <button
            className="px-8 py-3.5 border border-slate-600 text-slate-200 font-medium rounded-lg
                       hover:border-gold/50 hover:text-gold-light transition-colors
                       focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-bg-primary"
          >
            EXPLORE CHALLENGES
          </button>
        </div>
      </motion.div>

      <p className="absolute bottom-6 text-slate-600 text-xs tracking-wider">
        Phase 1 · Foundation in progress
      </p>
    </div>
  );
}
