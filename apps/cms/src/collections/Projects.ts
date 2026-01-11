import type { CollectionConfig } from 'payload'
import { revalidateAstro } from '../hooks/revalidateAstro'

export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: {
    singular: {
      en: 'Project',
      ja: 'プロジェクト',
    },
    plural: {
      en: 'Projects',
      ja: 'プロジェクト',
    },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'year', 'featured', 'updatedAt'],
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true
      return {
        _status: {
          equals: 'published',
        },
      }
    },
  },
  versions: {
    drafts: true,
  },
  hooks: {
    afterChange: [revalidateAstro],
  },
  fields: [
    {
      name: 'title',
      label: {
        en: 'Title',
        ja: 'タイトル',
      },
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      label: 'Slug (URL)',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: {
          en: 'URL-friendly identifier (e.g., "imabari-towel")',
          ja: 'URL用識別子（例: imabari-towel）',
        },
      },
    },
    {
      name: 'category',
      label: {
        en: 'Category',
        ja: 'カテゴリー',
      },
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: {
          en: 'e.g., "Digital Innovation / Art"',
          ja: '例: "デジタルイノベーション / アート"',
        },
      },
    },
    {
      name: 'year',
      label: {
        en: 'Year',
        ja: '年度',
      },
      type: 'text',
      required: true,
    },
    {
      name: 'image',
      label: {
        en: 'Main Photo',
        ja: 'メイン写真',
      },
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: {
          en: 'Main project thumbnail image',
          ja: 'プロジェクトのメインサムネイル画像',
        },
      },
    },
    {
      name: 'description',
      label: {
        en: 'Description',
        ja: '説明',
      },
      type: 'textarea',
      required: true,
      localized: true,
      admin: {
        description: {
          en: 'Short description for listing pages',
          ja: '一覧ページ用の短い説明文',
        },
      },
    },
    {
      name: 'featured',
      label: {
        en: 'Featured Project',
        ja: '注目のプロジェクト',
      },
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: {
          en: 'Show on homepage projects section',
          ja: 'ホームページのプロジェクトセクションに表示する',
        },
      },
    },
    // Project Detail Page Fields
    {
      name: 'client',
      label: {
        en: 'Client',
        ja: 'クライアント',
      },
      type: 'text',
      localized: true,
      admin: {
        description: {
          en: 'Client name (optional)',
          ja: 'クライアント名（任意）',
        },
      },
    },
    {
      name: 'heroVideo',
      label: {
        en: 'Hero Video URL',
        ja: 'ヒーロービデオURL',
      },
      type: 'text',
      admin: {
        description: {
          en: 'URL to hero video (optional, e.g., "/video/project.mp4")',
          ja: 'ヒーロービデオへのURL（任意、例: /video/project.mp4）',
        },
      },
    },
    {
      name: 'heroImage',
      label: {
        en: 'Hero Photo',
        ja: 'ヒーロー写真',
      },
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: {
          en: 'Hero background image (optional fallback for video)',
          ja: 'ヒーロー背景画像（ビデオがない場合の任意フォールバック）',
        },
      },
    },
    {
      name: 'content',
      label: {
        en: 'Content',
        ja: 'コンテンツ',
      },
      type: 'richText',
      localized: true,
      admin: {
        description: {
          en: 'Main content body for the project detail page',
          ja: 'プロジェクト詳細ページのメインコンテンツ',
        },
      },
    },
    {
      name: 'externalLink',
      label: {
        en: 'External Link',
        ja: '外部リンク',
      },
      type: 'group',
      fields: [
        {
          name: 'url',
          label: 'URL',
          type: 'text',
          admin: {
            description: {
              en: 'External link URL (e.g., project website)',
              ja: '外部リンクURL（例: プロジェクトのウェブサイト）',
            },
          },
        },
        {
          name: 'label',
          label: {
            en: 'Link Label',
            ja: 'リンクラベル',
          },
          type: 'text',
          localized: true,
          admin: {
            description: {
              en: 'Link button text',
              ja: 'リンクボタンのテキスト',
            },
          },
        },
      ],
    },
  ],
}
