import type { GlobalConfig } from 'payload'
import { revalidateAstroGlobal } from '../hooks/revalidateAstro'

export const Settings: GlobalConfig = {
  slug: 'settings',
  label: {
    en: 'Settings',
    ja: '設定',
  },
  admin: {
    group: 'Admin',
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateAstroGlobal],
  },
  fields: [
    {
      name: 'featuredProjects',
      label: {
        en: 'Featured Projects Order',
        ja: '注目のプロジェクト（表示順）',
      },
      type: 'relationship',
      relationTo: 'projects',
      hasMany: true,
      filterOptions: {
        featured: {
          equals: true,
        },
      },
      admin: {
        description: {
          en: 'Select and drag projects to change their order on the homepage/projects page.',
          ja: 'プロジェクトを選択し、ドラッグしてホームページやプロジェクトページでの表示順を変更します。',
        },
      },
    },
    {
      name: 'showNews',
      label: {
        en: 'Show News in Menu',
        ja: 'メニューにニュースを表示',
      },
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'showJournal',
      label: {
        en: 'Show Journal in Menu',
        ja: 'メニューにジャーナルを表示',
      },
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
