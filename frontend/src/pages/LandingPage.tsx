import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { Button } from '@/components/ui';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-primary relative overflow-hidden flex flex-col items-center justify-center px-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-bg-secondary via-bg-primary to-bg-primary opacity-90" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-accent/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        className="relative z-10 text-center max-w-3xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="inline-flex items-center gap-2 text-gold-light/80 text-sm tracking-[0.25em] uppercase mb-6 font-medium">
          <Shield className="w-4 h-4" />
          Krishna Security Lab
        </div>

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
          <Link to="/register">
            <Button size="lg" variant="primary">
              ENTER LAB
            </Button>
          </Link>
          <Link to="/login">
            <Button size="lg" variant="secondary">
              SIGN IN
            </Button>
          </Link>
        </div>
      </motion.div>

      <p className="absolute bottom-6 text-slate-600 text-xs tracking-wider">
        Learn Security · Break It · Fix It
      </p>
    </div>
  );
}
