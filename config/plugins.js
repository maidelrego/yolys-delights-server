
module.exports = ({ env }) => ({
    // ...
    email: {
      config: {
        provider: 'strapi-provider-email-resend',
        providerOptions: {
          apiKey: env('RESEND_API_KEY'),
        },
        settings: {
          defaultFrom: 'noreply@yolysdelights.com',
          defaultReplyTo: 'noreply@yolysdelights.com',
          testAddress: 'noreply@yolysdelights.com',
        },
      },
    },
    upload: {
      config: {
        provider: 'cloudinary',
        providerOptions: {
          cloud_name: env('CLOUDINARY_NAME'),
          api_key: env('CLOUDINARY_KEY'),
          api_secret: env('CLOUDINARY_SECRET'),
        },
        actionOptions: {
          upload: {},
          delete: {},
        },
      },
    }
  });