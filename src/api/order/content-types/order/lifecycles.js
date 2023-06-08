const { fillTemplate } = require("../../../../lib/emailTemplateReplace");
const fs = require('fs')
const path = require('path')
module.exports = {
  async afterUpdate(event) {
    const templatePath = path.resolve(__dirname, '..', '..', '..', '..', 'lib', 'template.html');
    const template = fs.readFileSync(templatePath, 'utf8');
    const { result } = event;

    const emailTemplate = await fillTemplate(template, result)

    
    try {
      await strapi.plugins["email"].services.email.send({
        to: result.email,
        from: "yolydelights@gmail.com",
        cc: "maesabroso@gmail.com",
        replyTo: "yolydelights@gmail.com",
        subject: "Yoly's Delights Order Confirmation",
        html: emailTemplate,
      });
    } catch (err) {
      console.log("ERROR", err.response.body.errors);
    }
  },
};
