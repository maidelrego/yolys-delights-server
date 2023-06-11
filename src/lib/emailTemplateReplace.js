const { formatCurrencyUSD } = require("./filters");
const moment = require("moment");

function createProductList(products) {
  const list = products.map((p) => {
    return `
    <tr style="border-collapse: collapse">
      <td
        align="left"
        style="
          margin: 0;
          padding-top: 5px;
          padding-bottom: 10px;
          padding-left: 20px;
          padding-right: 20px;
        "
      >
        <table
          cellspacing="0"
          cellpadding="0"
          width="100%"
          style="border-collapse: collapse; border-spacing: 0px"
        >
          <tr style="border-collapse: collapse">
            <td
              align="left"
              style="padding: 0; margin: 0; width: 560px"
            >
              <table
                width="100%"
                cellspacing="0"
                cellpadding="0"
                role="presentation"
                style="
                  border-collapse: collapse;
                  border-spacing: 0px;
                "
              >
                <tr style="border-collapse: collapse">
                  <td
                    align="left"
                    style="padding: 0; margin: 0"
                  >
                    <p
                      style="
                        margin: 0;
                        -webkit-text-size-adjust: none;
                        -ms-text-size-adjust: none;
                        font-family: arial, 'helvetica neue',
                          helvetica, sans-serif;
                        line-height: 21px;
                        color: #333333;
                        font-size: 14px;
                      "
                    >
                      <br />
                    </p>
                    <table
                      style="
                        border-collapse: collapse;
                        border-spacing: 0px;
                        width: 100%;
                      "
                      class="cke_show_border"
                      cellspacing="1"
                      cellpadding="1"
                      border="0"
                      role="presentation"
                    >
                      <tr style="border-collapse: collapse">
                        <td style="padding: 0; margin: 0">
                          ${p.title}
                        </td>
                        <td
                          style="
                            padding: 0;
                            margin: 0;
                            width: 60px;
                            text-align: center;
                          "
                        >
                          ${p.quantity}
                        </td>
                        <td
                          style="
                            padding: 0;
                            margin: 0;
                            width: 100px;
                            text-align: center;
                          "
                        >
                          ${formatCurrencyUSD(p.price)}
                        </td>
                      </tr>
                    </table>
                    <p
                      style="
                        margin: 0;
                        -webkit-text-size-adjust: none;
                        -ms-text-size-adjust: none;
                        font-family: arial, 'helvetica neue',
                          helvetica, sans-serif;
                        line-height: 21px;
                        color: #333333;
                        font-size: 14px;
                      "
                    >
                      <br />
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr style="border-collapse: collapse">
      <td
        align="left"
        style="
          padding: 0;
          margin: 0;
          padding-left: 20px;
          padding-right: 20px;
        "
      >
        <table
          width="100%"
          cellspacing="0"
          cellpadding="0"
          style="border-collapse: collapse; border-spacing: 0px"
        >
          <tr style="border-collapse: collapse">
            <td
              valign="top"
              align="center"
              style="padding: 0; margin: 0; width: 560px"
            >
              <table
                width="100%"
                cellspacing="0"
                cellpadding="0"
                role="presentation"
                style="
                  border-collapse: collapse;
                  border-spacing: 0px;
                "
              >
                <tr style="border-collapse: collapse">
                  <td
                    align="center"
                    style="
                      padding: 0;
                      margin: 0;
                      padding-bottom: 10px;
                      font-size: 0;
                    "
                  >
                    <table
                      width="100%"
                      height="100%"
                      cellspacing="0"
                      cellpadding="0"
                      border="0"
                      role="presentation"
                      style="
                        border-collapse: collapse;
                        border-spacing: 0px;
                      "
                    >
                      <tr style="border-collapse: collapse">
                        <td
                          style="
                            padding: 0;
                            margin: 0;
                            border-bottom: 1px solid #efefef;
                            background: #ffffff none repeat
                              scroll 0% 0%;
                            height: 1px;
                            width: 100%;
                            margin: 0px;
                          "
                        ></td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    `;
  });
  return list.join("");
}

function subTotalCal(products) {
  const total = products.reduce((acc, p) => {
    return acc + p.price * p.quantity;
  }, 0);
  return total;
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
      const subTotal = subTotalCal(data.products);
      const shipping = process.env.SHIPPING_FEE;

      switch (prop) {
        case "customerName":
          template = template.replace(m, data.customerName);
          break;
        case "orderId":
          template = template.replace(m, data.id);
          break;
        case "products":
          const productsHtml = createProductList(data.products);
          template = template.replace(m, productsHtml);
          break;
        case "productsTotal":
          template = template.replace(m, data.products.length);
          break;
        case "subTotal":
          template = template.replace(m, formatCurrencyUSD(subTotal));
          break;
        case "shippingAmount":
          if (orderType) {
            const html = `
            <tr style="border-collapse: collapse">
              <td
                style="
                  padding: 0;
                  margin: 0;
                  text-align: right;
                  font-size: 18px;
                  line-height: 27px;
                "
              >
                Flat-rate Delivery Fee:
              </td>
              <td
                style="
                  padding: 0;
                  margin: 0;
                  text-align: right;
                  font-size: 18px;
                  line-height: 27px;
                "
              >
                ${shipping}
              </td>
            </tr>
            `;
            template = template.replace(m, html);
          } else {
            template = template.replace(m, "");
          }
          break;
        case "orderTotal":
          let total = 0;
          if (orderType) {
            total = Number(subTotal) + Number(shipping);
          } else {
            total = Number(subTotal);
          }
          template = template.replace(m, total.toFixed(2));
          break;
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
          template = template.replace(
            m,
            moment(data.orderTypeDate).format("MM-DD-YYYY hh:mm A")
          );
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
