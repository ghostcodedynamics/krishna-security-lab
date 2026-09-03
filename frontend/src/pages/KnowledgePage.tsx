import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { Button, Card, Badge } from '@/components/ui';
import { knowledgeArticles } from '@/data/knowledge';

export default function KnowledgePage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <header className="border-b border-slate-800/80 bg-bg-secondary/50 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-4">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </Button>
          </Link>
          <div className="flex items-center gap-2 text-gold-light">
            <BookOpen className="w-4 h-4" />
            <span className="text-sm font-medium">Knowledge Center</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-slate-50 mb-2">Knowledge Center</h1>
        <p className="text-slate-400 mb-8">
          Theory behind each lab — what, why, and how to fix.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {knowledgeArticles.map((a) => (
            <Link key={a.slug} to={`/knowledge/${a.slug}`}>
              <Card hover className="h-full cursor-pointer">
                <Badge className="mb-2">{a.category}</Badge>
                <h2 className="font-semibold text-slate-50 mb-1">{a.title}</h2>
                <p className="text-sm text-slate-400 line-clamp-2">{a.summary}</p>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
