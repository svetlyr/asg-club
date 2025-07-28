import type { CollectionConfig } from 'payload'

export const Gallery: CollectionConfig = {
  slug: 'gallery',
  labels: {
    singular: 'Gallery',
    plural: 'Gallery',
  },
  orderable: true,
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'description', 'image'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      label: 'Description',
      type: 'text',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'width',
          label: 'Width',
          type: 'number',
          admin: {
            width: '40%',
          },
        },
        {
          name: 'height',
          label: 'Height',
          type: 'number',
          admin: {
            width: '40%',
          },
        },
        {
          name: 'unit',
          label: 'Unit',
          type: 'select',
          defaultValue: 'cm',
          options: [
            { label: 'cm', value: 'cm' },
            { label: 'inch', value: 'inch' },
          ],
          admin: {
            width: '20%',
          },
        },
      ],
    },
    {
      name: 'image',
      label: 'Image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
  ],
}
