import type { CollectionConfig } from 'payload'

export const Submissions: CollectionConfig = {
  slug: 'submissions',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'createdAt'],
  },
  access: {
    create: () => true, // Anyone can submit
    read: ({ req: { user } }) => !!user, // Only logged-in users can read
    update: () => false, // No one can update via API
    delete: ({ req: { user } }) => !!user, // Only logged-in users can delete
  },
  fields: [
    {
      name: 'submissionDisplay',
      type: 'ui',
      admin: {
        components: {
          Field: '/components/SubmissionView#SubmissionView',
        },
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        hidden: true,
      },
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      admin: {
        hidden: true,
      },
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      admin: {
        hidden: true,
      },
    },
    {
      name: 'source',
      type: 'text',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation === 'create') {
          try {
            await req.payload.sendEmail({
              to: process.env.CONTACT_FORM_RECIPIENT || 'info@ma3world.com',
              from: process.env.SMTP_FROM || 'no-reply@ma3world.com',
              subject: `New Contact Form Submission from ${doc.name}`,
              html: `
                <h1>New Contact Form Submission</h1>
                <p><strong>Name:</strong> ${doc.name}</p>
                <p><strong>Email:</strong> ${doc.email}</p>
                <p><strong>Message:</strong></p>
                <p>${doc.message}</p>
                <p><strong>Source:</strong> ${doc.source || 'Direct'}</p>
              `,
            })
          } catch (error) {
            req.payload.logger.error({ err: error }, 'Error sending contact form email')
          }
        }
      },
    ],
  },
}
