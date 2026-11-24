  function initializeMapOverlay(mapName, mapwarperId) {
    const map = L.map(mapName).setView([41.087903, -73.435973], 15);

    // 2. Base Tile Layer (OpenStreetMap)
    const osmBaseLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // 3. Overlay Tile Layer (Mapwarper)
    const mapwarperUrl = `https://mapwarper.net/maps/tile/${mapwarperId}/{z}/{x}/{y}.png`;
    const initialOpacity = 0.75; 

    const mapwarperOverlay = L.tileLayer(mapwarperUrl, {
        maxZoom: 18,
        attribution: 'Tiles &copy; <a href="https://mapwarper.net/">Mapwarper</a>',
        opacity: initialOpacity, // Set initial opacity
        transparent: true,      // Allows the base map to show through
    }).addTo(map);

    // 4. Opacity Slider Logic
    const sliderName = 'opacity-slider-' + mapName;
    const opacityValueName = 'opacity-value-' + mapName;
    const slider = document.getElementById(sliderName);
    if (slider) {
      slider.value = initialOpacity; 

      slider.addEventListener('input', function() {
        const newOpacity = parseFloat(this.value);
        mapwarperOverlay.setOpacity(newOpacity);
        const opacityValueSpan = document.getElementById(opacityValueName);
        opacityValueSpan.textContent = `${Math.round(newOpacity * 100)}%`;
      });
    } else {
        // write a console error if the slider is not found
        console.error(`Slider "${sliderName}" not found.`);
    }
  }

  window.onload = function() {
    initializeMapOverlay(mapName, mapwarperId);
  };
