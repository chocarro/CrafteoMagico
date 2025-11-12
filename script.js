document.addEventListener('DOMContentLoaded', () => {
  const items = document.querySelectorAll('.item');
  const stations = document.querySelectorAll('.station');
  const products = {
    lingote: document.querySelector('#prod-lingote .count'),
    flechas: document.querySelector('#prod-flechas .count'),
    espada: document.querySelector('#prod-espada .count')
  };
  const counters = { lingote: 0, flechas: 0, espada: 0 };

  const alquimia = document.getElementById('alquimia');
  const slotList = alquimia.querySelector('.slot-list');
  const alquimiaSlots = [];
  const REQUIRED = parseInt(alquimia.dataset.requires || '2', 10);

  let currentDragType = null;

  // --- Funciones auxiliares ---
  const aceptaIngrediente = (station, tipo) =>
    station.id === 'alquimia' || station.dataset.accept === tipo;

  const efectoCreacion = (station) => {
    station.classList.add('craft-effect');
    setTimeout(() => station.classList.remove('craft-effect'), 500);
  };

  const actualizarProducto = (tipo) => {
    counters[tipo]++;
    products[tipo].textContent = counters[tipo];
  };

  const sacudir = (el) => {
    el.animate(
      [{ transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(0)' }],
      { duration: 300 }
    );
  };

  // --- Drag de items ---
  items.forEach(item => {
    item.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', item.id);
      currentDragType = item.dataset.type;
      item.classList.add('dragging');
    });

    item.addEventListener('dragend', () => {
      item.classList.remove('dragging');
      stations.forEach(s => s.classList.remove('accept', 'reject'));
      currentDragType = null;
    });
  });

  // --- Drag & Drop en estaciones ---
  stations.forEach(station => {
    station.addEventListener('dragover', e => {
      if (!currentDragType) return;

      const puede = aceptaIngrediente(station, currentDragType);
      if (puede) e.preventDefault();

      const libre = station.id !== 'alquimia' || alquimiaSlots.length < REQUIRED;
      station.classList.toggle('accept', puede && libre);
      station.classList.toggle('reject', !puede || !libre);
    });

    station.addEventListener('dragleave', () =>
      station.classList.remove('accept', 'reject')
    );

    station.addEventListener('drop', e => {
      e.preventDefault();
      station.classList.remove('accept', 'reject');

      const item = document.getElementById(e.dataTransfer.getData('text/plain'));
      if (!item || !currentDragType) return;

      const tipo = currentDragType;

      if (!aceptaIngrediente(station, tipo)) return sacudir(station);

      // --- Procesos de estaciones ---
      switch (station.id) {
        case 'forja':
          item.remove();
          actualizarProducto('lingote');
          efectoCreacion(station);
          break;

        case 'carpintero':
          item.remove();
          actualizarProducto('flechas');
          efectoCreacion(station);
          break;

        case 'alquimia':
          if (alquimiaSlots.length >= REQUIRED) return;

          const slot = document.createElement('div');
          slot.className = 'slot';
          slot.textContent = item.textContent;
          slotList.appendChild(slot);

          alquimiaSlots.push(tipo);
          item.remove();

          if (alquimiaSlots.length === REQUIRED) {
            const combo = alquimiaSlots.sort().join('+');
            if (combo === 'metal+powder') {
              actualizarProducto('espada');
              efectoCreacion(station);
            }
            alquimiaSlots.length = 0;
            slotList.innerHTML = '';
          }
          break;
      }
    });
  });
});
