import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui';
import SecurityTempleScene from '@/three/scenes/SecurityTempleScene';
import { useAuthStore } from '@/stores/authStore';

export default function WorldPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      <header className="border-b border-slate-800/80 bg-bg-secondary/60 backdrop-blur-sm z-20">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4" />
                Dashboard
              </Button>
            </Link>
            <div className="flex items-center gap-2 text-gold-light">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium tracking-wide">Security Temple</span>
            </div>
          </div>
          <span className="text-xs text-slate-500 hidden sm:inline">
            {user?.name} · Level {user?.level ?? 1}
          </span>
        </div>
      </header>

      <main className="flex-1 flex flex-col max-w-6xl mx-auto w-full px-4 py-6 gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-slate-50">3D Security World</h1>
            <p className="text-sm text-slate-400">
              Orbit to explore. Chambers unlock as you complete challenges.
            </p>
          </div>
          <div className="flex gap-2 text-xs">
            <span className="px-2 py-1 rounded-full bg-gold/15 text-gold-light border border-gold/30">
              Auth · Available
            </span>
            <span className="px-2 py-1 rounded-full bg-slate-800 text-slate-500 border border-slate-700">
              Others · Locked
            </span>
          </div>
        </div>

        <div className="flex-1 min-h-[420px]">
          <SecurityTempleScene />
        </div>

        <p className="text-center text-xs text-slate-600">
          Drag to orbit · Scroll to zoom · Auto-rotate enabled
        </p>
      </main>
    </div>
  );
}
