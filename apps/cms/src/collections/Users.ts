import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'username',
  },
  auth: true,
  fields: [
    {
      name: 'username',
      label: 'Username',
      type: 'text',
      required: true,
    },
    // Email is included by default
  ],
}
