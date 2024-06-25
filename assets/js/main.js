document.addEventListener('DOMContentLoaded', function() {
    // Place your existing JavaScript code here
    const London = new L.LatLng(51.4700, -0.4543);
    const Dubai = new L.LatLng(25.2532, 55.3657);
    const NewYork = new L.LatLng(40.6413, -73.7781);
    let center = London;
    let circle = null;
    let geodesiccircle = null;
    let radius = 12000 * 1000; // Initial radius in meters (corresponding to 12000 km)

    var map = L.map('map').setView([51.505, -0.09], 4);

    // Load and display tile layer on the map (OpenStreetMap tiles)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        noWrap: true,
        bounds: [
            [-90, -180],
            [90, 180]
        ]
    }).addTo(map);

    // Initialize circles on the map
    circle = new L.circle(center, {
        radius: 10,
    }).addTo(map);

    geodesiccircle = new L.GeodesicCircle(center, {
        radius: radius, // Initial radius
        opacity: 1,
        fill: 0,
        noWrap: true,
    }).addTo(map);

    // Select the dropdown button and dropdown content
    const dropdownButton = document.querySelector('.dropdown-button');
    const dropdownContent = document.querySelector('.dropdown-content');
    const dropdownItems = dropdownContent.querySelectorAll('a');

    // Toggle dropdown visibility when button is clicked
    dropdownButton.addEventListener('click', function() {
        dropdownContent.classList.toggle('show');
    });

    // Update map when a dropdown item is clicked
    dropdownItems.forEach(item => {
        item.addEventListener('click', function(event) {
            event.preventDefault();
            let selectedOption = event.target.textContent.trim();

            // Update center based on selection
            switch (selectedOption) {
                case "Dubai":
                    center = Dubai;
                    break;
                case "London":
                    center = London;
                    break;
                case "New York":
                    center = NewYork;
                    break;
                default:
                    break;
            }

            // Remove existing layers
            map.removeLayer(circle);
            map.removeLayer(geodesiccircle);

            // Render new circles on the map
            circle = new L.circle(center, {
                radius: 10,
            }).addTo(map);

            geodesiccircle = new L.GeodesicCircle(center, {
                radius: radius, // Use current radius
                opacity: 1,
                fill: 0,
                noWrap: true,
            }).addTo(map);

            dropdownContent.classList.remove('show'); // Close dropdown after selection
        });
    });

    // Close dropdown if the user clicks outside of it
    window.addEventListener('click', function(event) {
        if (!dropdownButton.contains(event.target)) {
            dropdownContent.classList.remove('show');
        }
    });

    // Handle number input changes
    const radiusInput = document.querySelector('#radius-input');
    if (radiusInput) {
        radiusInput.addEventListener('input', function() {
            let inputValue = parseFloat(radiusInput.value.trim());
            
            // Check if input is valid (greater than or equal to 1)
            if (isNaN(inputValue) || inputValue < 1) {
                radius = 1000; // Set radius to 1 nautical mile if input is empty or below 1
            } else {
                radius = inputValue * 1000; // Convert nautical miles to meters (1 nautical mile = 1852 meters)
            }

            

            // Update geodesic circle radius
            if (geodesiccircle) {
                geodesiccircle.setRadius(radius);
            }
        });
    } else {
        console.error('Element #radius-input not found!');
    }
});