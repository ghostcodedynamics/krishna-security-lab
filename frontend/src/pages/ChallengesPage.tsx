import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft, Lock, CheckCircle2 } from 'lucide-react';
import { Button, Card, Badge } from '@/components/ui';
import { listChallenges, type ChallengeSummary } from '@/services/challenges';
import { ApiClientError } from '@/services/api';

const difficultyVariant: Record<string, 'emerald' | 'gold' | 'rose' | 'cyan'> = {
  easy: 'emerald',
  medium: 'gold',
  hard: 'rose',
  boss: 'cyan',
};

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<ChallengeSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listChallenges()
      .then(setChallenges)
      .catch((err) => {
        setError(err instanceof ApiClientError ? err.message : 'Failed to load challenges');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-bg-primary">
      <header className="border-b border-slate-800/80 bg-bg-secondary/50 backdrop-blur-sm sticky top-0 z-20">
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
              <span className="text-sm font-medium">Challenges</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-slate-50 mb-2">Challenge Board</h1>
        <p className="text-slate-400 mb-8">Discover, exploit (locally), understand, and fix.</p>

        {loading && (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
          </div>
        )}

        {error && (
          <Card className="border-rose-accent/30 bg-rose-accent/5">
            <p className="text-rose-accent">{error}</p>
            <p className="text-sm text-slate-400 mt-2">
              Ensure backend is running and MongoDB is connected, then refresh.
            </p>
          </Card>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {challenges.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link to={c.isLocked ? '#' : `/challenges/${c.slug}`}>
                <Card
                  hover={!c.isLocked}
                  className={c.isLocked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer h-full'}
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <Badge variant={difficultyVariant[c.difficulty] || 'default'}>
                      {c.difficulty}
                    </Badge>
                    <span className="text-xs text-slate-500">{c.xpReward.completed} XP</span>
                  </div>
                  <h3 className="font-semibold text-slate-50 mb-1 flex items-center gap-2">
                    {c.isLocked && <Lock className="w-4 h-4 text-slate-500" />}
                    {c.userStatus === 'completed' && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-accent" />
                    )}
                    {c.title}
                  </h3>
                  <p className="text-sm text-slate-400 line-clamp-2">{c.description}</p>
                  <p className="text-xs text-slate-500 mt-3 uppercase tracking-wider">{c.category}</p>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {!loading && !error && challenges.length === 0 && (
          <p className="text-slate-500 text-center py-12">No challenges seeded yet.</p>
        )}
      </main>
    </div>
  );
}
