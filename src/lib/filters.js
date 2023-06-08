function formatCurrencyUSD(value) {
  const numberValue = Number(value);
  const formattedValue = numberValue.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
  return formattedValue;
}

module.exports = { formatCurrencyUSD }
