# UI/UX Specification

## Theme
Ancient Vrindavan × Futuristic Cybersecurity  
Dark night, deep blue/black, gold highlights, neon cyan, subtle temple silhouettes, peacock-feather motifs (abstract), glassmorphism, particles.

## Colors
- bg-primary: #05070f
- accent-gold: #d4af37 / #f0c75e
- accent-cyan: #22d3ee
- accent-emerald: #34d399 (success)
- accent-rose: #fb7185 (danger)
- text-primary: #f1f5f9

## Key Pages
- `/` Landing (cinematic hero)
- `/login` `/register`
- `/dashboard` (XP, level, mission, security score)
- `/world` (full 3D temple)
- `/challenges` `/challenges/:id`
- `/lab` `/terminal` `/knowledge`
- `/progress` `/leaderboard` `/profile` `/settings` `/admin`

## Components
Button, Card (glass), Input, Modal, Badge, ProgressBar, Terminal, ChallengeCard, Toast

## Rules
- prefers-reduced-motion respected
- Desktop-first for 3D, graceful degradation to 2D on mobile
- Keyboard accessible, ARIA labels
