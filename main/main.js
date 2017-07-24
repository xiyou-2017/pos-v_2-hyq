'use strict';
let printReceipt = (inputs) => {
  let items = buildItems(inputs);
  let subtotals = getSubtotals(items);
  let total = getItemsTotal(subtotals);
  getReceipt(total);
}

let buildItems = (inputs) => {
  let cartItems = [];
  let allItems = Item.all();

  for (let input of inputs) {
    let splitInput = input.split('-');
    let barcode = splitInput[0];
    let count = parseFloat(splitInput[1] || 1);
    let cartItem = cartItems.find((cartItem) => cartItem.item.barcode === barcode);
    if (cartItem) {
      cartItem.count += count;
    }
    else {
      let item = allItems.find((item) => item.barcode === barcode);
      item = {
        barcode: item.barcode,
        name: item.name,
        unit: item.unit,
        price: item.price
      };
      cartItems.push({item: item, count: count});
    }
  }
  return cartItems;
}

let getSubtotals = (cartItems) => {
  return cartItems.map(cartItem => {
    let promotionType = getPromotionType(cartItem);
    let {saved, subtotal} = getPromotion(promotionType, cartItem);
    return ({cartItem, saved, subtotal});
  });
}

let getPromotionType = (cartItem) => {
  let promotion = Promotion.all();
  let type = promotion.find((type) => type.barcodes.includes(cartItem.item.barcode));
  return type ? type : "";
}

let getPromotion = (type, cartItem) => {
  let count = 0;
  if (type.type === 'BUY_TWO_GET_ONE_FREE') {
    count = parseInt(cartItem.count / 3);
  }
  let saved = count * cartItem.item.price;
  let subtotal = cartItem.item.price * (cartItem.count - count);

  return ({saved, subtotal});
}

let getItemsTotal = (subtotals) => {
  let total = 0;
  let savedTotal = 0;
  for (let subtotal of subtotals) {
    total += subtotal.subtotal;
    savedTotal += subtotal.saved;
  }
  return ({subtotals, total, savedTotal});
}

let getReceipt = (total) => {
  let receipt = "***" + "<" + "没钱赚商店>收据***\n打印时间：";
  let time = getNowTime();
  receipt = receipt +time.year + "年" + time.month + "月" + time.day + "日" + " " + time.hour + ":" + time.min + ":" + time.second + "\n----------------------\n";
  for (let cart of total.subtotals) {
    receipt = receipt + "名称：" + cart.cartItem.item.name + "，数量：" + cart.cartItem.count + cart.cartItem.item.unit + "，单价：" + cart.cartItem.item.price.toFixed(2) + "(元)，小计：" + cart.subtotal.toFixed(2) + "(元)\n";
  }
  receipt = receipt + "----------------------\n" + "总计：" + total.total.toFixed(2)+ "(元)\n节省：" + total.savedTotal.toFixed(2) + "(元)\n**********************";

  console.log(receipt);
}

let getNowTime = () => {
  let time = new Date();
  let year = time.getFullYear()
  time
  let month = time.getMonth() + 1;
  month = month > 10 ? month : "0" + month;
  let day = time.getDate();
  day = day > 10 ? day : "0" + day;
  let hour = time.getHours();
  hour = hour > 10 ? hour : "0" + hour;
  let min = time.getMinutes();
  min = min > 10 ? min : "0" + min;
  let second = time.getSeconds();
  second = second > 10 ? second : "0" + second;
  return ({year, month, day, hour, min, second});
}

