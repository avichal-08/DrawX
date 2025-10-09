# DrawX Code Statistics

## Total Lines of Code: **1,765**

This report provides a comprehensive breakdown of the codebase statistics for the DrawX repository.

---

## Breakdown by File Type

| File Type | Lines of Code |
|-----------|---------------|
| TypeScript (.ts) | 941 |
| TypeScript React (.tsx) | 686 |
| JavaScript (.js) | 128 |
| JavaScript Module (.mjs) | 10 |
| **Total** | **1,765** |

---

## Breakdown by Directory

| Directory | Lines of Code |
|-----------|---------------|
| apps/web | 1,388 |
| packages | 192 |
| apps/api | 185 |
| **Total** | **1,765** |

---

## Top 20 Files by Lines of Code

| Rank | File | Lines |
|------|------|-------|
| 1 | ./apps/web/draw/index.ts | 182 |
| 2 | ./apps/web/app/room/[slug]/page.tsx | 181 |
| 3 | ./apps/web/chat/index.tsx | 118 |
| 4 | ./apps/web/app/choice/create/page.tsx | 82 |
| 5 | ./apps/web/app/check/page.tsx | 82 |
| 6 | ./apps/api/src/ws/index.ts | 73 |
| 7 | ./apps/api/src/app.ts | 57 |
| 8 | ./apps/web/app/choice/join/page.tsx | 56 |
| 9 | ./apps/web/draw/shapes/text.ts | 54 |
| 10 | ./packages/eslint-config/next.js | 49 |
| 11 | ./apps/web/app/api/chat/save/route.ts | 42 |
| 12 | ./packages/eslint-config/react-internal.js | 39 |
| 13 | ./apps/web/app/lib/auth.ts | 39 |
| 14 | ./apps/api/src/authMiddleware.ts | 38 |
| 15 | ./apps/web/draw/shapes/circle.ts | 37 |
| 16 | ./apps/web/app/api/chat/get/route.ts | 37 |
| 17 | ./apps/web/app/page.tsx | 35 |
| 18 | ./apps/web/app/layout.tsx | 34 |
| 19 | ./apps/web/app/api/strokes/save/route.ts | 34 |
| 20 | ./apps/web/app/api/join-room/route.ts | 33 |

---

## Project Structure

### apps/api (185 lines)
- WebSocket server implementation
- Authentication middleware
- API application setup

### apps/web (1,388 lines)
- Main web application (Next.js)
- Drawing functionality
- Chat functionality
- API routes
- UI pages and components

### packages (192 lines)
- Shared UI components
- ESLint configuration
- Database client

---

## Summary

The DrawX codebase consists of **1,765 lines of code** spread across **45 files**. The majority of the code is written in TypeScript (53.3%) and TypeScript React (38.9%), with smaller portions in JavaScript and JavaScript modules.

The largest component is the web application (apps/web) which accounts for 78.6% of the total codebase, followed by shared packages (10.9%) and the API server (10.5%).

---

*Generated on: $(date)*
*Methodology: Line count includes all TypeScript (.ts, .tsx), JavaScript (.js, .jsx), and JavaScript Module (.mjs) files, excluding node_modules, .next, dist, and .turbo directories.*
