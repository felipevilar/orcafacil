export function calcProfit(
  buyPrice,
  sellPrice,
  taxes = 0,
  taxesIsPercentage,
  inCurrency,
  discount = 0,
  formatted = true,
) {
  let profit;
  let cost;

  if (!taxesIsPercentage) {
    cost = buyPrice + taxes;
  } else {
    let taxesInCurrency = (taxes / 100) * buyPrice;
    cost = buyPrice + taxesInCurrency;
  }

  profit = sellPrice - cost - discount;
  
  if(!formatted) return profit;
  if (inCurrency) return formatter.format(profit);

  if(cost == 0) return "100,00%";
  return formatterNum.format((profit / cost) * 100) + "%";
}

export const convertToNumber = function(str) {
  if (typeof str === "string") return Number(Number(str.replace(/,/g, ".")).toFixed(2));

  return str;
};
// Create our number formatter.
export const formatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export const formatterNum = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export default {
  calcProfit,
  formatter,
  formatterNum,
  convertToNumber,
};
