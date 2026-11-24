function initializeInfoControl(map) {
  const modal = document.getElementById('info-modal');
  if (!modal) return;
  const gotItBtn = document.getElementById('modal-got-it');

  function openInfoModal() {
    modal.classList.add('open');
    gotItBtn.focus();
  }

  function closeInfoModal() {
    modal.classList.remove('open');
  }

  // Close on 'Got It', backdrop click, or Escape key
  gotItBtn.addEventListener('click', closeInfoModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeInfoModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeInfoModal();
    }
  });

  // Round '?' Leaflet control
  const RoundInfoControl = L.Control.extend({
    options: {
      position: 'topright' // Or 'topleft', 'bottomright', 'bottomleft'
    },

    onAdd: function () {
      const container = L.DomUtil.create('div', 'leaflet-control');
      L.DomEvent.disableClickPropagation(container);

      const btn = L.DomUtil.create('button', 'leaflet-control-info-round', container);
      btn.type = 'button';
      btn.title = 'About this map';
      btn.setAttribute('aria-label', 'About this map');
      btn.textContent = '?';

      L.DomEvent.on(btn, 'click', (e) => {
        L.DomEvent.stop(e);
        openInfoModal();
      });

      return container;
    }
  });

  map.addControl(new RoundInfoControl());
}

function initializeMapOverlay(mapName, mapwarperId, center) {
  const map = L.map(mapName).setView(center || [41.087903, -73.435973], 15);

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

    slider.addEventListener('input', function () {
      const newOpacity = parseFloat(this.value);
      mapwarperOverlay.setOpacity(newOpacity);
      const opacityValueSpan = document.getElementById(opacityValueName);
      opacityValueSpan.textContent = `${Math.round(newOpacity * 100)}%`;
    });
  }

  initializeInfoControl(map);
}

window.onload = function () {
  initializeMapOverlay(mapName, mapwarperId, center);
};
