# Database Design

**MongoDB + Mongoose**

## Collections
- **users** — name, email (unique), passwordHash (Argon2), role, xp, level, completedChallenges[], badges[], preferences, timestamps
- **challenges** — slug, title, difficulty, category, description, learningObjective, hints[], flagHash, labId, order, prerequisites[], xpReward, knowledgeSlug
- **challengeAttempts** — userId, challengeId, status, isCorrect, hintsUsed, xpEarned, timestamps
- **progress** — userId (unique), currentLevel, totalXp, securityScoreBreakdown, currentMission
- **badges** — slug, name, description, icon, criteria, rarity
- **labs** — slug, name, dockerImage, port, statusEndpoint, category
- **auditLogs** — userId, action, resource, ip, userAgent, severity, createdAt
- **sessions** — userId, refreshTokenHash, expiresAt, revoked

## Key Indexes
- users: email unique, xp desc
- challenges: slug unique, category+order
- challengeAttempts: userId+challengeId unique
- auditLogs: createdAt, userId+createdAt

## Rules
- Never store plaintext passwords or flags
- Flags stored as strong hashes only
- Fake data only inside labs
