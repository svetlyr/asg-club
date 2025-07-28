import { z } from 'zod'
import { createEnv } from '@t3-oss/env-nextjs'
// import { fly } from '@t3-oss/env-nextjs/presets-zod'

const env = createEnv({
  server: {
    PAYLOAD_SECRET: z.string().min(1),
    PORT: z.coerce.number().default(3001),

    DATABASE_URL: z
      .url()
      .min(1)
      .default('postgres://asg-user:asg-password@localhost:5432/asg-club-server'),
  },
  client: {
    // NEXT_PUBLIC_PUBLISHABLE_KEY: z.string().min(1),
  },
  experimental__runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
  // extends: [fly()],
})

export default env
