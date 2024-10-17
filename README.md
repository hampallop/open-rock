# Developments

1. Install vercel.

   ```bash
   pnpm install -g vercel
   ```

2. Install the dependencies.

   ```bash
   pnpm install
   vercel env pull .env.development.local
   ```

3. Start the development server.

   ```bash
   vercel dev
   ```

## Generate types

Run the following command to generate the types:

```bash
export PROJECT_REF=<your-project-ref>
pnpm update-types
```
