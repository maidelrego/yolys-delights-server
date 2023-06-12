("use strict");
const stripe = require("stripe")(process.env.STRIPE_KEY);
/**
 * order controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  async create(ctx) {
    const { data } = ctx.request.body;
    const products = data.products;
    try {
      const lineItems = await Promise.all(
        products.map(async (product) => {
          const item = await strapi
            .service("api::product.product")
            .findOne(product.id);

          return {
            price_data: {
              currency: "usd",
              product_data: {
                name: item.title,
              },
              unit_amount: Math.round(item.price * 100),
            },
            quantity: product.quantity,
          };
        })
      );

      const session = await stripe.checkout.sessions.create({
        shipping_address_collection: { allowed_countries: ["US"] },
        payment_method_types: ["card", "klarna", "cashapp"],
        shipping_options: [
          {
            shipping_rate_data: {
              type: "fixed_amount",
              fixed_amount: {
                amount: 0,
                currency: "usd",
              },
              display_name: "Pickup",
            },
          },
          {
            shipping_rate_data: {
              type: "fixed_amount",
              fixed_amount: {
                amount: 699,
                currency: "usd",
              },
              display_name: "Delivery",
            },
          },
        ],
        mode: "payment",
        success_url:
          process.env.CLIENT_URL +
          "/paymentSuccess?session_id={CHECKOUT_SESSION_ID}",
        cancel_url: process.env.CLIENT_URL,
        line_items: lineItems,
      });

      await strapi
        .service("api::order.order")
        .create({ data: { stripeId: session.id, ...data } });

      return { stripeSession: session };
    } catch (error) {
      console.log("error", error);
      ctx.response.status = 500;
      return { error };
    }
  },
}));
