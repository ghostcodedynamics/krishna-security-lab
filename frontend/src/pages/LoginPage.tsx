import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { Button, Input, Card } from '@/components/ui';
import { useAuthStore } from '@/stores/authStore';
import { ApiClientError } from '@/services/api';

const schema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(1, 'Password required'),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, error, clearError } = useAuthStore();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    clearError();
    setSubmitting(true);
    try {
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (err) {
      // error already in store
      if (err instanceof ApiClientError && err.code === 'INVALID_CREDENTIALS') {
        // handled via store
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-gold-light/80 hover:text-gold-light transition-colors">
            <Shield className="w-5 h-5" />
            <span className="tracking-wider text-sm uppercase font-medium">Krishna Security Lab</span>
          </Link>
        </div>

        <Card variant="glass" className="p-8">
          <h1 className="text-2xl font-bold text-slate-50 mb-1">Welcome back</h1>
          <p className="text-slate-400 text-sm mb-6">Sign in to continue your mission</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Password"
              type="password"
              autoComplete="current-password"
              error={errors.password?.message}
              {...register('password')}
            />

            {error && (
              <p className="text-sm text-rose-accent bg-rose-accent/10 border border-rose-accent/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" size="lg" isLoading={submitting}>
              Sign In
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            No account?{' '}
            <Link to="/register" className="text-gold-light hover:underline">
              Create one
            </Link>
          </p>
        </Card>
      </motion.div>
    </div>
  );
}
