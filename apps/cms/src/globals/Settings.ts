import type { GlobalConfig } from 'payload'

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
      admin: {
        description: {
          en: 'Select and drag projects to change their order on the homepage/projects page.',
          ja: 'プロジェクトを選択し、ドラッグしてホームページやプロジェクトページでの表示順を変更します。',
        },
      },
    },
  ],
}
