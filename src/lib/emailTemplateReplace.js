const { formatCurrencyUSD } = require("./filters");

function createProductList(products) {
  const list = products.map((p) => {
    return `
    <tr style="border-collapse: collapse">
      <td
        style="
          padding: 5px 10px 5px 0;
          margin: 0;
        "
        width="80%"
        align="left"
      >
        <p
          style="
            margin: 0;
            -webkit-text-size-adjust: none;
            -ms-text-size-adjust: none;
            mso-line-height-rule: exactly;
            font-family: 'open sans',
              'helvetica neue', helvetica,
              arial, sans-serif;
            line-height: 24px;
            color: #333333;
            font-size: 12px;
          "
        >
          ${p.title} x ${p.quantity}
        </p>
      </td>
      <td
        style="padding: 5px 0; margin: 0"
        width="20%"
        align="left"
      >
        <p
          style="
            margin: 0;
            -webkit-text-size-adjust: none;
            -ms-text-size-adjust: none;
            mso-line-height-rule: exactly;
            font-family: 'open sans',
              'helvetica neue', helvetica,
              arial, sans-serif;
            line-height: 24px;
            color: #333333;
            font-size: 12px;
          "
        >
          $${formatCurrencyUSD(p.price)}
        </p>
      </td>
    </tr>
    `;
  });
  return list.join("");
}

function orderTotal(products) {
  const total = products.reduce((acc, p) => {
    return acc + p.price * p.quantity;
  }, 0);
  return formatCurrencyUSD(total);
}

async function fillTemplate(template, data) {
  const regex = /{{\s*([^}]+)\s*}}/g;
  const matches = String(template).match(regex);

  if (matches && matches.length) {
    matches.forEach((m) => {
      var prop = m.replace("{{", "").replace("}}", ""); // trims all but the prop name

      if (!template.replace) {
        console.error(
          "TEMPLATE REPLACE IS NO LONGER A FUNCTION, SOMETHIN FUCKED UP"
        );
      }

      const orderType = data.orderType === "delivery" ? true : false;

      switch (prop) {
        case "orderId":
          template = template.replace(m, data.id);
          break;
        case "products":
          const productsHtml = createProductList(data.products);
          template = template.replace(m, productsHtml);
          break;
        case "orderTotal":
          const total = orderTotal(data.products);
          template = template.replace(m, total);
        case "deliveryAddress":
          if (orderType) {
            template = template.replace(m, data.address);
          } else {
            template = template.replace(m, process.env.MY_ADDRESS);
          }
          break;
        case "orderType":
          if (orderType) {
            template = template.replace(m, "Delivery");
          } else {
            template = template.replace(m, "Pickup");
          }
          break;
        case "deliveryDate":
          template = template.replace(m, data.orderTypeDate);
          break;
        default:
          template = template.replace(m, "NOT FOUND");
          break;
      }
    });
  }

  return template;
}

module.exports = {
  fillTemplate,
};
