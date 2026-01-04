import type { CollectionConfig } from 'payload'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'year', 'featured', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly identifier (e.g., "imabari-towel")',
      },
    },
    {
      name: 'category',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'e.g., "Digital Innovation / Art"',
      },
    },
    {
      name: 'year',
      type: 'text',
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Main project thumbnail image',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      localized: true,
      admin: {
        description: 'Short description for listing pages',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Show on homepage projects section',
      },
    },
    // Project Detail Page Fields
    {
      name: 'client',
      type: 'text',
      localized: true,
      admin: {
        description: 'Client name (optional)',
      },
    },
    {
      name: 'heroVideo',
      type: 'text',
      admin: {
        description: 'URL to hero video (optional, e.g., "/video/project.mp4")',
      },
    },
    {
      name: 'content',
      type: 'richText',
      localized: true,
      admin: {
        description: 'Main content body for the project detail page',
      },
    },
    {
      name: 'externalLink',
      type: 'group',
      fields: [
        {
          name: 'url',
          type: 'text',
          admin: {
            description: 'External link URL (e.g., project website)',
          },
        },
        {
          name: 'label',
          type: 'text',
          localized: true,
          admin: {
            description: 'Link button text',
          },
        },
      ],
    },
  ],
}
