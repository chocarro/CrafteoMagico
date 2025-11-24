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

    // --- Drag de items --- 

  const sacudir = (el) => {
    el.animate(
      [
        { transform: 'translateX(-6px)' },
        { transform: 'translateX(6px)' },
        { transform: 'translateX(0)' }
      ],
      { duration: 300 }
    );
  };

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

  
  stations.forEach(station => {
    station.addEventListener('dragover', e => {
      if (!currentDragType) return;
      e.preventDefault(); 
      station.classList.add('accept');
    });

    station.addEventListener('dragleave', () =>
      station.classList.remove('accept', 'reject')
    );

    station.addEventListener('drop', e => {
      e.preventDefault();
      station.classList.remove('accept', 'reject');

      const item = document.getElementById(
        e.dataTransfer.getData('text/plain')
      );
      if (!item) return;

      const tipo = currentDragType;

      item.remove();

     //  Procesos de estaciones
      if (aceptaIngrediente(station, tipo)) {
        switch (station.id) {
          case 'forja':
            actualizarProducto('lingote');
            efectoCreacion(station);
            break;

          case 'carpintero':
            actualizarProducto('flechas');
            efectoCreacion(station);
            break;

          case 'alquimia':
            if (alquimiaSlots.length < REQUIRED) {
              const slot = document.createElement('div');
              slot.className = 'slot';
              slot.textContent = tipo;
              slotList.appendChild(slot);

              alquimiaSlots.push(tipo);

              if (alquimiaSlots.length === REQUIRED) {
                const combo = alquimiaSlots.sort().join('+');

                if (combo === 'metal+powder') {
                  actualizarProducto('espada');
                  efectoCreacion(station);
                }

                alquimiaSlots.length = 0;
                slotList.innerHTML = '';
              }
            }
            break;
        }
      }
    });
  });
});

 // Búsqueda de materiales
document.addEventListener('DOMContentLoaded', () => {
  const items = document.querySelectorAll('.item');         

  const regexInput = document.getElementById('regexInput');
  const buscarBtn = document.getElementById('buscarBtn');

  buscarBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const pattern = regexInput.value;
    let regex;

    try {
      regex = new RegExp(pattern, 'i');
    } catch (err) {
      alert('Expresión regular inválida');
      return;
    }

    items.forEach(item => {
      if (regex.test(item.textContent)) {
        item.style.display = '';
        item.classList.add('highlight');
        setTimeout(() => item.classList.remove('highlight'), 1000);
      } else {
        item.style.display = 'none';
      }
    });
  });  
});


