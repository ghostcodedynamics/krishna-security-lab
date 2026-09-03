import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Flag } from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, Badge, Input } from '@/components/ui';
import {
  getChallenge,
  startChallenge,
  submitFlag,
  type ChallengeDetail,
} from '@/services/challenges';
import { ApiClientError } from '@/services/api';
import { useAuthStore } from '@/stores/authStore';

export default function ChallengeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const loadUser = useAuthStore((s) => s.loadUser);
  const [challenge, setChallenge] = useState<ChallengeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [flag, setFlag] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [solution, setSolution] = useState<{ explanation: string; remediation: string } | null>(
    null
  );
  const [submitting, setSubmitting] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);

  useEffect(() => {
    if (!id) return;
    getChallenge(id)
      .then((c) => {
        setChallenge(c);
        if (c.solutionExplanation) {
          setSolution({
            explanation: c.solutionExplanation,
            remediation: c.remediation || '',
          });
        }
      })
      .catch((err) => setMessage({ type: 'error', text: err.message }))
      .finally(() => setLoading(false));
  }, [id]);

  const handleStart = async () => {
    if (!challenge) return;
    try {
      await startChallenge(challenge.id);
      setMessage({ type: 'success', text: 'Challenge started. Open the lab and investigate.' });
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to start',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!challenge || !flag.trim()) return;
    setSubmitting(true);
    setMessage(null);
    try {
      const result = await submitFlag(challenge.id, flag.trim());
      setMessage({
        type: 'success',
        text: `Correct! +${result.xpEarned} XP`,
      });
      if (result.solutionExplanation) {
        setSolution({
          explanation: result.solutionExplanation,
          remediation: result.remediation || '',
        });
      }
      await loadUser();
    } catch (err) {
      const text =
        err instanceof ApiClientError ? err.message : 'Submission failed';
      setMessage({ type: 'error', text });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center text-slate-400">
        Challenge not found
      </div>
    );
  }

  const visibleHints = challenge.hints.slice(0, hintIndex + 1);

  return (
    <div className="min-h-screen bg-bg-primary">
      <header className="border-b border-slate-800/80 bg-bg-secondary/50 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-4">
          <Link to="/challenges">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
              Challenges
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="gold">{challenge.difficulty}</Badge>
              <Badge>{challenge.category}</Badge>
            </div>
            <h1 className="text-2xl font-bold text-slate-50">{challenge.title}</h1>
            <p className="text-slate-400 mt-1">{challenge.xpReward.completed} XP on completion</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Mission</CardTitle>
          </CardHeader>
          <p className="text-slate-300 mb-3">{challenge.description}</p>
          <p className="text-sm text-slate-400">
            <span className="text-gold-light">Objective:</span> {challenge.learningObjective}
          </p>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Target</CardTitle>
          </CardHeader>
          <p className="font-mono text-sm text-cyan-accent mb-4">{challenge.targetApplication}</p>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" onClick={handleStart}>
              Start Challenge
            </Button>
            <a
              href={challenge.targetApplication}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="cyber">
                <ExternalLink className="w-4 h-4" />
                Open Lab
              </Button>
            </a>
          </div>
          <p className="text-xs text-slate-500 mt-3">
            Lab runs locally (see labs/auth). Default seed creds are intentionally weak for learning.
          </p>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hints</CardTitle>
          </CardHeader>
          <ul className="space-y-2 mb-4">
            {visibleHints.map((h) => (
              <li key={h.order} className="text-sm text-slate-300 bg-bg-elevated rounded-lg px-3 py-2">
                Hint {h.order}: {h.text}
              </li>
            ))}
          </ul>
          {hintIndex < challenge.hints.length - 1 && (
            <Button variant="secondary" size="sm" onClick={() => setHintIndex((i) => i + 1)}>
              Reveal next hint
              {challenge.hints[hintIndex + 1]?.xpCost
                ? ` (−${challenge.hints[hintIndex + 1].xpCost} XP later)`
                : ''}
            </Button>
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flag className="w-5 h-5 text-gold-light" />
              Submit Flag
            </CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="KSL{...}"
              value={flag}
              onChange={(e) => setFlag(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" isLoading={submitting}>
              Submit
            </Button>
          </form>
          {message && (
            <p
              className={`mt-3 text-sm rounded-lg px-3 py-2 ${
                message.type === 'success'
                  ? 'bg-emerald-accent/10 text-emerald-accent border border-emerald-accent/20'
                  : 'bg-rose-accent/10 text-rose-accent border border-rose-accent/20'
              }`}
            >
              {message.text}
            </p>
          )}
        </Card>

        {solution && (
          <Card className="border-emerald-accent/30">
            <CardHeader>
              <CardTitle>Solution & Remediation</CardTitle>
            </CardHeader>
            <p className="text-slate-300 text-sm mb-4 whitespace-pre-wrap">{solution.explanation}</p>
            <p className="text-sm text-slate-400">
              <span className="text-emerald-accent font-medium">Remediation:</span>{' '}
              {solution.remediation}
            </p>
          </Card>
        )}
      </main>
    </div>
  );
}
