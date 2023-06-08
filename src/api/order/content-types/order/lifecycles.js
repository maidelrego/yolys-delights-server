
module.exports = {
  async afterUpdate(event) {    // Connected to "Save" button in admin panel
      const { result } = event;

      try{
          await strapi.plugins['email'].services.email.send({
            to: 'maesabroso@gmail.com',
            from: 'yolydelights@gmail.com', // e.g. single sender verification in SendGrid
            replyTo: 'yolydelights@gmail.com',
            subject: 'The Strapi Email plugin worked successfully',
            text: '${fieldName}', // Replace with a valid field ID
            html: 'Hello world!', 
              
          })
      } catch(err) {
          console.log('YOOOO', err.response.body.errors);
      }
  }
}