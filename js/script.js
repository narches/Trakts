

let map;
let markers = [];

// Initialize the OpenStreetMap using Leaflet
function initMap() {
  map = L.map('map').setView([37.7749, -122.4194], 10); // San Francisco as default center

  // OpenStreetMap Tile Layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
}

// Load tasks from localStorage
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = "";

  // Clear existing markers from the map
  markers.forEach(marker => map.removeLayer(marker));
  markers = []; // Reset the markers array

  tasks.forEach((task, index) => {
    const taskItem = document.createElement("li");
    taskItem.innerHTML = `
      <span><strong>${task.task}</strong> - ${task.location} on ${task.date} at ${task.time}</span>
      <button onclick="deleteTask(${index})">Delete</button>
    `;
    taskList.appendChild(taskItem);
    addMarker(task.location, task.task); // Add marker for each task
  });
}

// Save task to localStorage
function saveTask(task) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  loadTasks();
}

// Add marker to the map
function addMarker(location, taskDescription) {
  const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${location}`;

  // Fetch geolocation data from OpenStreetMap Nominatim API
  fetch(geocodeUrl)
    .then(response => response.json())
    .then(data => {
      if (data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);

        const marker = L.marker([lat, lon]).addTo(map);
        markers.push(marker);

        marker.bindPopup(`<strong>${taskDescription}</strong><br>${location}`);
      }
    })
    .catch(error => console.error('Error fetching location:', error));
}

// Delete task from localStorage
function deleteTask(index) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  loadTasks();
}

// Handle form submission
document.getElementById("task-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const task = document.getElementById("task").value;
  const location = document.getElementById("location").value;
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;

  const newTask = { task, location, date, time };
  saveTask(newTask);

  document.getElementById("task").value = "";
  document.getElementById("location").value = "";
  document.getElementById("date").value = "";
  document.getElementById("time").value = "";
});

// Load tasks and initialize map when the page loads
window.onload = () => {
  initMap();
  loadTasks();
};
