import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button, Card, Badge } from '@/components/ui';
import { getArticle } from '@/data/knowledge';

export default function KnowledgeArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? getArticle(slug) : undefined;

  if (!article) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center text-slate-400">
        Article not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <header className="border-b border-slate-800/80 bg-bg-secondary/50 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-4">
          <Link to="/knowledge">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
              Knowledge
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <div>
          <Badge className="mb-2">{article.category}</Badge>
          <h1 className="text-2xl font-bold text-slate-50">{article.title}</h1>
          <p className="text-slate-400 mt-1">{article.summary}</p>
          {article.owasp && (
            <p className="text-xs text-cyan-accent mt-2">{article.owasp}</p>
          )}
        </div>

        {article.sections.map((s) => (
          <Card key={s.heading}>
            <h2 className="font-semibold text-gold-light mb-2">{s.heading}</h2>
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{s.body}</p>
          </Card>
        ))}

        {article.relatedChallenge && (
          <Link to={`/challenges/${article.relatedChallenge}`}>
            <Button variant="cyber">Open related challenge</Button>
          </Link>
        )}
      </main>
    </div>
  );
}
