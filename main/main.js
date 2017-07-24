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
