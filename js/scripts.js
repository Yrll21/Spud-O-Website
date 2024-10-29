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

function removeItem(uniqueId) {
  const itemContainer = document.getElementById(`item-${uniqueId}`);
  const itemName = itemContainer.querySelector(
    "#checkout-item-name",
  ).textContent;
  const itemAmount = parseInt(
    itemContainer.querySelector("#item-amount").textContent,
  );
  const itemPrice = getItemPrice(itemName);
  const addOnsPrice = getItemAddOnsPrice(itemContainer);

  // Update the totals
  totalNumberOfItems -= itemAmount;
  totalAmountToPay -= itemAmount * (itemPrice + addOnsPrice);

  // Update the UI totals
  document.getElementById("cart-count").textContent = totalNumberOfItems;
  document.getElementById("checkout-total-amount").textContent =
    totalAmountToPay;

  // Remove the item container from the UI
  itemContainer.remove();

  // Find and remove the item in dataToSubmitArray by its unique ID
  const index = dataToSubmitArray.findIndex((item) => item.id === uniqueId);
  if (index !== -1) {
    dataToSubmitArray.splice(index, 1);
  }

  console.log("Updated dataToSubmitArray:", dataToSubmitArray);
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

  // Generate a unique ID for the new item
  const uniqueId = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  var newItemFormat = `          <!-- Item placeholder-->
          <div id="item-${uniqueId}">
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
          <button type="button" class="btn btn-danger btn-sm" onclick="removeItem('${uniqueId}')">Remove</button>
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
    id: uniqueId,
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
  // Check if dataToSubmitArray is empty
  if (dataToSubmitArray.length === 0) {
    alert("No items in the cart to submit.");
    return; // Exit the function if there are no items
  }

  const customerName = document.getElementById("name").value;
  const customerEmail = document.getElementById("email").value;
  const deliveryLocation = document.getElementById("location").value;
  const gcashReference = document.getElementById("payment-ref").value;
  const deliveryDate = document.getElementById("delivery-date").value;
  const deliveryTime = document.getElementById("delivery-time").value;

  // Delay in milliseconds between each request (e.g., 500ms)
  const delay = 500;

  // Function to submit each item with a delay
  dataToSubmitArray.forEach((item, index) => {
    setTimeout(() => {
      const formData = new FormData();
      formData.append("entry.1477564829", item.itemName); // Replace with the actual entry ID for Item Name
      formData.append("entry.2062987717", item.itemPrice); // Replace with the actual entry ID for Item Price
      formData.append("entry.1509328554", item.addOns); // Replace with the actual entry ID for Add-Ons
      formData.append("entry.493907925", item.addOnsPrice); // Replace with the actual entry ID for Add-Ons Price
      formData.append("entry.1890790625", item.itemAmount); // Replace with the actual entry ID for Item Amount
      formData.append("entry.160880018", customerName); // Replace with the actual entry ID for Customer Name
      formData.append("entry.719354033", customerEmail); // Replace with the actual entry ID for Customer Email
      formData.append("entry.915620030", deliveryLocation);
      formData.append("entry.1940383630", deliveryDate);
      formData.append("entry.2046317432", deliveryTime);
      formData.append("entry.554588921", gcashReference);

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
          console.log("Item submitted:", item);
        })
        .catch((error) => {
          console.error("Error submitting item:", error);
        });
    }, index * delay); // Delay each request based on its index
  });

  alert("Purchase data submitted!");
  clearCheckoutData();
}

// Function to clear cart data and reset the UI
function clearCheckoutData() {
  // Reset global variables
  totalNumberOfItems = 0;
  totalAmountToPay = 0;
  dataToSubmitArray = []; // Clear out the array

  // Clear UI elements
  document.getElementById("checkout-item-list").innerHTML = ""; // Clear all items in the checkout list
  document.getElementById("cart-count").textContent = "0"; // Reset cart count display
  document.getElementById("checkout-total-amount").textContent = "0"; // Reset total amount display

  // Clear form fields
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("location").value = "";
  document.getElementById("payment-ref").value = "";
  document.getElementById("delivery-date").value = "";
  document.getElementById("delivery-time").value = "";

  console.log("Checkout data has been cleared.");
}
