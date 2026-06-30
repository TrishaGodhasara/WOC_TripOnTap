// Select all destination cards
var cards = document.querySelectorAll(".card");

// Loop through each card
for (var i = 0; i < cards.length; i++) {
  cards[i].addEventListener("click", function () {

    // Get destination page name from data attribute
    var page = this.getAttribute("data-page");

    // Navigate to the destination page
    if (page) {
      window.location.href = page;
    }

  });
}
// ===== DESTINATION SEARCH FUNCTIONALITY =====

var searchInput = document.getElementById("searchInput");
var cards = document.querySelectorAll(".card");

searchInput.addEventListener("keyup", function () {
  var searchText = searchInput.value.toLowerCase();

  for (var i = 0; i < cards.length; i++) {
    var destinationName = cards[i]
      .querySelector("h3")
      .innerText
      .toLowerCase();

    if (destinationName.includes(searchText)) {
      cards[i].style.display = "block";
    } else {
      cards[i].style.display = "none";
    }
  }
});
// ===== FORM VALIDATION =====

var form = document.getElementById("trip-form");

form.addEventListener("submit", function (event) {
  event.preventDefault(); // stop form submission

  var email = document.getElementById("email").value;
  var phone = document.getElementById("phone").value;

  // Email validation (must contain @)
  if (email.indexOf("@") === -1) {
    alert("Please enter a valid email address with '@'");
    return;
  }

  // Phone number validation (must be exactly 9 digits)
  if (phone.length !== 9 || isNaN(phone)) {
    alert("Phone number must contain exactly 9 digits");
    return;
  }

  // If all validations pass
  alert("Form submitted successfully! We will contact you soon.");

  // Optional: reset form after submission
  form.reset();
});

