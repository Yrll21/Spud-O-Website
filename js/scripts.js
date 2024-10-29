// Global var
var currentItemId = "";
var totalNumberOfItems = 0;
var totalAmountToPay = 0;
var dataToSubmitArray = [];

function addAmount() {
  amount.value++;
}
function reduceAmount() {
  if (amount.value > 0) amount.value--;
}

function removeItem(event) {
  const itemContainer = event.target.parentNode;
  const itemName = itemContainer.querySelector(
    "#checkout-item-name",
  ).textContent;
  const itemAmount = parseInt(
    itemContainer.querySelector("#item-amount").textContent,
  );
  const itemPrice = getItemPrice(itemName);
  const addOnsPrice = getItemAddOnsPrice(itemContainer);

  // Log current values for debugging
  console.log("Removing item:", itemName);
  console.log("Item Amount:", itemAmount);
  console.log("Item Price:", itemPrice);
  console.log("Add-ons Price:", addOnsPrice);

  // Update the totalNumberOfItems and totalAmountToPay before updating the UI
  totalNumberOfItems -= itemAmount;
  totalAmountToPay -= itemAmount * (itemPrice + addOnsPrice);

  // Log updated totals for debugging
  console.log("Updated Total Number of Items:", totalNumberOfItems);
  console.log("Updated Total Amount to Pay:", totalAmountToPay);

  // Update the UI after calculation
  document.getElementById("cart-count").textContent = totalNumberOfItems;
  document.getElementById("checkout-total-amount").textContent =
    totalAmountToPay;

  // Remove the item container from the UI
  itemContainer.remove();
}

function addNewItem(event) {
  // Reset the value of the add to cart modal
  document.getElementById("amount").value = 0;
  document.getElementById("addon-cheddar").checked = false;
  document.getElementById("addon-jalapeno").checked = false;
  // Get the id of the clicked add to cart button
  let id = event.target.id;
  console.log(id);
  currentItemId = id;
}

function addToItemList(event) {
  // Get current values on the modal when clicking add item to cart button
  let itemAmount = document.getElementById("amount").value;
  let itemPrice = 0;
  if (itemAmount == 0) {
    alert("Please add an amount");
    return;
  }
  let itemName = "";
  switch (currentItemId) {
    case "bbqc-atc-btn":
      itemName = "BBQ Chicken";
      itemPrice = 155;
      break;
    case "bc-atc-btn":
      itemName = "Bacon and Cheddar";
      itemPrice = 155;
      break;
    case "cb-atc-btn":
      itemName = "Cheese and Beans";
      itemPrice = 155;
      break;
    case "cs-atc-btn":
      itemName = "Creamy Spinach";
      itemPrice = 160;
      break;
    case "ccc-atc-btn":
      itemName = "Chilli Con Carne";
      itemPrice = 185;
      break;
    case "cc-atc-btn":
      itemName = "Creamy Curry";
      itemPrice = 155;
      break;
    default:
      break;
  }

  let addOns = "";
  let addOnsPrice = 0;
  if (
    document.getElementById("addon-cheddar").checked &&
    document.getElementById("addon-jalapeno").checked
  ) {
    addOns = "Cheddar and Jalapeno";
    addOnsPrice = 30 + 15;
  } else if (document.getElementById("addon-cheddar").checked) {
    addOns = "Cheddar";
    addOnsPrice = 30;
  } else if (document.getElementById("addon-jalapeno").checked) {
    addOns = "Jalapeno";
    addOnsPrice = 15;
  } else {
    addOns = "None";
  }

  var newItemFormat = `          <!-- Item placeholder-->
          <div>
          <ul class="list-group mt-3">
            <li class="list-group-item d-flex justify-content-between align-items-center">
              <span id="checkout-item-name">${itemName}</span>
              <span id="checkout-item-price">${itemPrice}</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">
              <span id="checkout-item-addon">${addOns}</span>
              <span id="checkout-item-addon-price">${addOnsPrice}</span>
            </li>
          </ul>
          <h6 class="mt-3">Total: <span id="item-amount">${itemAmount}</span></h6>
          <button type="button" class="btn btn-danger btn-sm" onclick="removeItem(event)">Remove</button>
          </div>
          <!-- End of item -->`;

  // append the new item to the checkout modal
  document.getElementById("checkout-item-list").innerHTML += newItemFormat;

  // Update the total amount by appending the new item
  totalAmountToPay += itemAmount * (itemPrice + addOnsPrice);
  document.getElementById("checkout-total-amount").innerHTML = totalAmountToPay;

  // console.log("current item id: ", currentItemId);
  // console.log("item amount: ", itemAmount);
  // console.log("item price: ", itemPrice);
  // console.log("add ons: ", addOns);
  // console.log("add ons price: ", addOnsPrice);
  // console.log("total amount: ", itemAmount * itemPrice + addOnsPrice);
  // console.log("new item format: ", newItemFormat);

  // Append the itemName, itemPrice, and addOns to dataToSubmitArray
  dataToSubmitArray.push({
    itemName: itemName,
    itemPrice: itemPrice,
    addOns: addOns,
    addOnsPrice: addOnsPrice,
    itemAmount: itemAmount,
  });

  console.log(dataToSubmitArray);

  // Append itemAmount to the cart-count using the totalNumberOfItems var
  document.getElementById("cart-count").innerHTML = totalNumberOfItems +=
    parseInt(itemAmount);

  // Reset the value of the add to cart modal
  document.getElementById("amount").value = 0;
  document.getElementById("addon-cheddar").checked = false;
  document.getElementById("addon-jalapeno").checked = false;

  // Do not close modal if value = 0
  if (itemAmount > 0) {
    var atcModal = document.getElementById("atc-modal");
    var modal = bootstrap.Modal.getInstance(atcModal);
    modal.hide();
  }
}

// HELPER FUNCTIONS
// Helper function to get the price of an item based on its name
function getItemPrice(itemName) {
  switch (itemName) {
    case "BBQ Chicken":
      return 155;
    case "Bacon and Cheddar":
      return 155;
    case "Cheese and Beans":
      return 155;
    case "Creamy Spinach":
      return 160;
    case "Chilli Con Carne":
      return 185;
    case "Creamy Curry":
      return 155;
    default:
      return 0;
  }
}

// Helper function to get the add-ons price of an item
function getItemAddOnsPrice(itemContainer) {
  const addOns = itemContainer.querySelector(
    "#checkout-item-addon",
  ).textContent;
  let addOnsPrice = 0;
  if (addOns.includes("Cheddar")) addOnsPrice += 30;
  if (addOns.includes("Jalapeno")) addOnsPrice += 15;
  return addOnsPrice;
}
// TODO: Add the logic for checking out
//

function checkout() {
  const customerName = document.getElementById("name").value;
  const customerEmail = document.getElementById("email").value;

  // Prepare data to send to Google Form
  const formData = new FormData();

  // Map your fields to Google Form's entry IDs
  dataToSubmitArray.forEach((item, index) => {
    formData.append("entry.1477564829", item.itemName); // Replace with the actual entry ID for Item Name
    formData.append("entry.2062987717", item.itemPrice); // Replace with the actual entry ID for Item Price
    formData.append("entry.1509328554", item.addOns); // Replace with the actual entry ID for Add-Ons
    formData.append("entry.493907925", item.addOnsPrice); // Replace with the actual entry ID for Add-Ons Price
    formData.append("entry.1890790625", item.itemAmount); // Replace with the actual entry ID for Item Amount
    formData.append("entry.160880018", customerName); // Replace with the actual entry ID for Customer Name
    formData.append("entry.719354033", customerEmail); // Replace with the actual entry ID for Customer Email
  });
  // https://docs.google.com/forms/d/e/1FAIpQLSf88BIYZhdLDHLEPrpBPmlW192uc5-2Hqz3asLLv1PL_lvI4w/viewform?usp=sf_link
  // Send data to Google Form using fetch
  fetch(
    "https://docs.google.com/forms/d/e/1FAIpQLSf88BIYZhdLDHLEPrpBPmlW192uc5-2Hqz3asLLv1PL_lvI4w/formResponse",
    {
      method: "POST",
      body: formData,
      mode: "no-cors", // This will bypass the CORS issue
    },
  )
    .then(() => {
      alert("Purchase data submitted!");
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Error submitting purchase data.");
    });
}
