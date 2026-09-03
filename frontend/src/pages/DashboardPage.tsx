import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, LogOut, Trophy, Target, Zap, Globe, Terminal as TerminalIcon } from 'lucide-react';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  ProgressBar,
  Badge,
  Terminal,
} from '@/components/ui';
import { useAuthStore } from '@/stores/authStore';

export default function DashboardPage() {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      <header className="border-b border-slate-800/80 bg-bg-secondary/50 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-gold-light">
            <Shield className="w-5 h-5" />
            <span className="font-semibold tracking-wide text-sm">Krishna Security Lab</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-400 hidden sm:inline">{user?.name}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-50 mb-1">
            Welcome back, {user?.name || 'Security Engineer'}
          </h1>
          <p className="text-slate-400 mb-8">Continue your mission in the Security Lab</p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card hover>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gold/10">
                  <Zap className="w-5 h-5 text-gold-light" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Level</p>
                  <p className="text-xl font-semibold text-slate-50">{user?.level ?? 1}</p>
                </div>
              </div>
            </Card>
            <Card hover>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-accent/10">
                  <Trophy className="w-5 h-5 text-cyan-accent" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider">XP</p>
                  <p className="text-xl font-semibold text-slate-50">{user?.xp ?? 0}</p>
                </div>
              </div>
            </Card>
            <Card hover>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-accent/10">
                  <Target className="w-5 h-5 text-emerald-accent" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Challenges</p>
                  <p className="text-xl font-semibold text-slate-50">0 / 9</p>
                </div>
              </div>
            </Card>
            <Card hover>
              <Badge variant="gold" size="md">
                Novice
              </Badge>
              <p className="text-xs text-slate-400 mt-2">Current rank</p>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2 mb-8">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>XP Progress</CardTitle>
                <CardDescription>Next level at 500 XP</CardDescription>
              </CardHeader>
              <ProgressBar value={user?.xp ?? 0} max={500} variant="gold" label="Progress" />
            </Card>

            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Current Mission</CardTitle>
                <CardDescription>Explore the Security Temple and prepare for challenges</CardDescription>
              </CardHeader>
              <div className="flex flex-wrap gap-3">
                <Link to="/world">
                  <Button variant="primary" size="md">
                    <Globe className="w-4 h-4" />
                    Enter World
                  </Button>
                </Link>
                <Link to="/challenges">
                  <Button variant="secondary" size="md">
                    View Challenges
                  </Button>
                </Link>
                <Link to="/knowledge">
                  <Button variant="ghost" size="md">
                    Knowledge
                  </Button>
                </Link>
              </div>
            </Card>
          </div>

          <Card variant="glass" className="mb-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TerminalIcon className="w-5 h-5 text-cyan-accent" />
                Lab Terminal
              </CardTitle>
              <CardDescription>Type help for commands</CardDescription>
            </CardHeader>
            <Terminal className="max-h-64" />
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
