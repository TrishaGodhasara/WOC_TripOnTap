
// Navigation toggle (beginner)
var menuBtn = document.querySelector(".menu-btn");
var nav = document.querySelector(".nav-links");

if (menuBtn) {
  menuBtn.addEventListener("click", function () {
    nav.classList.toggle("active");
  });
}

document.addEventListener("DOMContentLoaded", function () {

  const form = document.getElementById("trip-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    let trips = JSON.parse(localStorage.getItem("trips")) || [];

  const tripData = {
  formType: "PlanYourTrip",
  name: document.getElementById("name").value,
  email: document.getElementById("email").value,
  destination: document.getElementById("destination").value,
  travelDate: document.getElementById("date").value,
  people: document.getElementById("people").value,
  message: document.getElementById("message").value,
  age: document.getElementById("age").value,
  phone: document.getElementById("phone").value,
  address: document.getElementById("address").value,

  createdAt: new Date().toLocaleString()
};


    trips.push(tripData);

    localStorage.setItem("trips", JSON.stringify(trips));

    alert("you will be given a call within 24 hours.Trip saved successfully!");

    form.reset();
  });
});
