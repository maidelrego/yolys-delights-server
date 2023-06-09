"use strict";

/**
 * rating controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::rating.rating", ({ strapi }) => ({
  async create(ctx) {
    const { data } = ctx.request.body;
    try {
      const rating = await strapi
        .service("api::rating.rating")
        .create({ data: { ...data } });

      return { rating };
    } catch (error) {
      console.log("error", error);
      ctx.response.status = 500;
      return { error };
    }
  },
}));
