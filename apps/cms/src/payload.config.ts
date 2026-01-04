import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { News } from './collections/News'
import { Projects } from './collections/Projects'
import { Submissions } from './collections/Submissions'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, News, Projects, Submissions],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [],
  localization: {
    locales: [
      {
        label: 'English',
        code: 'en',
      },
      {
        label: '日本語',
        code: 'ja',
      },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  cors: [
    'http://localhost:4321', // Astro dev server
    'http://localhost:3000', // Local CMS
    process.env.ASTRO_URL || '',
  ].filter(Boolean),
})

