let filtroTexto = "";
let filtroTipo = "todos";
let velocidadAsc = true;


// CONSTANTES//
const naves= [
  { nombre: "x-wing", tipo: "caza", velocidad: 100, tripulacion: 1, estado: "operativa", imagen:"Xwing.webp" },
  { nombre: "millennium falcon", tipo: "transporte", velocidad: 150, tripulacion: 6, estado: "operativa", imagen:"Millennium_Falcon.webp" },
  { nombre: "y-wing", tipo: "caza", velocidad: 80, tripulacion: 2, estado: "en reparación", imagen:"Y-wing.webp" },
  { nombre: "a-wing", tipo: "caza", velocidad: 175, tripulacion: 1, estado: "operativa", imagen:"A-wing.webp" },
  { nombre: "b-wing", tipo: "fragata", velocidad: 91, tripulacion: 3, estado: "destruida", imagen:"B-wing.webp" }
];
let pilotos= JSON.parse(localStorage.getItem('pilotos')) || [

  {id: 1, nombre: "luke skywalker", rango: "Comandante", nave: "X-Wing", victorias: 12, estado: "activo" },
  {id: 2, nombre: "han solo", rango: "Capitán", nave: "Millennium Falcon", victorias: 8,  estado: "activo" },
  {id: 3, nombre: "wedge antilles", rango: "Teniente", nave: "X-Wing", victorias: 15, estado: "herido" },
  {id: 4, nombre: "leia organa", rango: "General", nave: "A-Wing", victorias: 5,  estado: "activo" },

];
const secciones= [
  { texto: "hangar de naves", id: "seccion-hangar" },
  { texto: "registro de pilotos", id: "seccion-pilotos" },
  { texto: "panel de misiones", id: "seccion-misiones" },
  { texto: "mando de la alianza", id: "seccion-mando" }
];


//HANGAR//
function mostrarTodoElHangar(navesAMostrar=naves) {
  const contenedor=document.getElementById('seccion-hangar');
  
  //si no hay input lo creamos//
  if (!document.getElementById('busqueda-nave')) {
    contenedor.innerHTML= `
      <h2 class="seccion-titulo">hangar de Naves</h2>
      <div class="hangar-controles">
        <input type="text" id="busqueda-nave" placeholder="buscar una nave" class="input-estilo">
        <select id="filtro-tipo" class="select-estilo">
            <option value="todos">todos los tipos</option>
            <option value="caza">caza</option>
            <option value="transporte">transporte</option>
            <option value="fragata">fragata</option>
        </select>
        <button id="btn-ordenar" class="button-content">ordenar por velocidad ↑</button>
      </div>
      <p id="contador-naves" class="contador-naves"></p>
      <div id="grid-naves" class="naves-grid"></div>
    `;
    document.getElementById('busqueda-nave').addEventListener('input', filtrarNaves);
    document.getElementById('filtro-tipo').addEventListener('change', filtrarNaves);
    document.getElementById('btn-ordenar').onclick = toggleOrden;
  }
  const grid=document.getElementById('grid-naves');
  grid.innerHTML="";
  
  navesAMostrar.forEach(nave => {
    const card=document.createElement('div');
    card.className='nave-card';
    card.innerHTML=`
    <div class="nave-card-interior">
      <div class="nave-info">
        <h3 class="color-Hangar">${nave.nombre}</h3>
        <p>tipo: ${nave.tipo}</p>
        <p>velocidad: <strong>${nave.velocidad}</strong> MGLT</p>
        <p>tripulacion: ${nave.tripulacion}</p>
        <p>estado: <span class="tag-${nave.estado.replace(' ', '-')}">${nave.estado}</span></p>
      </div>
      <img class="nave-imagen" src="images/${nave.imagen}" alt="${nave.nombre}">
    </div>`;
    grid.appendChild(card);
  });

  //Actualizamos el contador//
  document.getElementById('contador-naves').textContent = `Mostrando: ${navesAMostrar.length} naves`;
}

//FILTRAR NAVES//
function filtrarNaves() {
  filtroTexto = document.getElementById('busqueda-nave').value.toLowerCase();
  filtroTipo = document.getElementById('filtro-tipo').value;
  aplicarCambios();
}

function toggleOrden() {
  velocidadAsc=!velocidadAsc;
  //Actualizamos la flecha en el botón con un ternario
  document.getElementById('btn-ordenar').textContent=`ordenar por velocidad ${velocidadAsc ? '↑' : '↓'}`;
  aplicarCambios();
}

function aplicarCambios() {
  //Primero filtramos según lo que haya en el input y el select
  let resultado = naves.filter(n => {
    const coincideTexto = n.nombre.toLowerCase().includes(filtroTexto);
    const coincideTipo = filtroTipo == 'todos' || n.tipo == filtroTipo;
    return coincideTexto && coincideTipo;
  });

  //Luego ordenamos ese resultado filtrado
  resultado.sort((a, b) => {
    return velocidadAsc ? a.velocidad - b.velocidad : b.velocidad - a.velocidad;
  });

  //Mostramos solo las naves resultantes
  mostrarTodoElHangar(resultado);
}

//PILOTOS//
function renderPilotos() {
    const sec=document.getElementById('seccion-pilotos');
    sec.innerHTML=`
        <h2 class="seccion-titulo">Registro de Pilotos</h2>
        <form id="form-p" onsubmit="crearPiloto(event)">
            <input id="n-p" class="form-separacion" placeholder="nombre del piloto" required>
            
            <select id="r-p" class="form-separacion" required>
                <option value="" disabled selected>Selecciona un Rango</option>
                <option value="Recluta">Recluta</option>
                <option value="Teniente">Teniente</option>
                <option value="Capitán">Capitán</option>
                <option value="Comandante">comandante</option>
                <option value="General">General</option>
            </select>

            <select id="s-p" class="form-separacion" required>
                <option value="" disabled selected>Asignar Nave</option>
                ${naves.map(n => `<option value="${n.nombre}">${n.nombre}</option>`).join('')}
            </select>

            <input type="number" class="form-separacion" id="v-p" placeholder="victorias" min="0" required>

            <select id="e-p" class="form-separacion" required>
                <option value="activo">Activo</option>
                <option value="herido">Herido</option>
                <option value="KIA">KIA (Misión Finalizada)</option>
            </select>

            <button type="submit" class="button-content">Registrar Piloto</button>
        </form>

        <ul id="lista-p">
            ${pilotos.map(p => `
                <li>
                    ${p.rango} ${p.nombre} 
                    - nave: ${p.nave} 
                    - victorias: ${p.victorias} 
                    - estado: <span class="tag-${p.estado}">${p.estado}</span>
                    <button class="button-content" onclick="borrarP(${p.id})">Eliminar</button>
                </li>
            `).join('')}
        </ul>
    `;
}

function crearPiloto(e) {
    e.preventDefault();
    const p= { 
        id: Date.now(), 
        nombre: document.getElementById('n-p').value, 
        rango: document.getElementById('r-p').value,
        nave: document.getElementById('s-p').value, 
        victorias: parseInt(document.getElementById('v-p').value), 
        estado: document.getElementById('e-p').value
    };

    pilotos.push(p);
    localStorage.setItem('pilotos', JSON.stringify(pilotos));
    renderPilotos();
}

function borrarP(id) {
    if (confirm("¿Quieres eliminar este piloto?")) {
        pilotos=pilotos.filter(p => p.id!==id);
        localStorage.setItem('pilotos', JSON.stringify(pilotos));
        renderPilotos();
    }
}

//MENU NAVEGACIÓN//
function mostrarSeccion(idSeccion) {
  const todasLasSecciones=document.querySelectorAll(".seccion");
  todasLasSecciones.forEach(sec => {
    sec.classList.add("seccion--oculta");
    sec.classList.remove("seccion--activa");
  });
  const activa=document.getElementById(idSeccion);
  activa.classList.remove("seccion--oculta");
  activa.classList.add("seccion--activa");
}

// function inicializarNav() {
//   const navElement=document.getElementById("navegacion-principal");
//   navElement.innerHTML="";

//   for (let i=0; i<secciones.length; i++) {
//     const boton=document.createElement("button");
//     boton.textContent=secciones[i].texto;
//     boton.classList.add("nav-boton");

//     boton.addEventListener("click", () => {
//       mostrarSeccion(secciones[i].id);
//       document.querySelectorAll(".nav-boton").forEach(b => b.classList.remove("nav-boton--activo"));
//       boton.classList.add("nav-boton--activo");
//     });
//     navElement.appendChild(boton);
//   }
//   navElement.firstChild.classList.add("nav-boton--activo");
// }

function inicializarNav() {
  const navElement = document.getElementById("navegacion-principal");
  navElement.innerHTML = "";

  for (let i = 0; i < secciones.length; i++) {
    const boton = document.createElement("button");
    boton.textContent = secciones[i].texto;
    boton.classList.add("nav-boton");

    boton.addEventListener("click", () => {
      mostrarSeccion(secciones[i].id);
      document.querySelectorAll(".nav-boton").forEach(b => b.classList.remove("nav-boton--activo"));
      boton.classList.add("nav-boton--activo");
      if (secciones[i].id == 'seccion-mando') renderDashboard();
    });

    navElement.appendChild(boton);
  }
  navElement.firstChild.classList.add("nav-boton--activo");
}

const btn = document.getElementById('theme-toggle');

btn.addEventListener('click', (e) => {
    //Función que cambia la clase a oscuro
    const toggleTheme = () => {
        document.documentElement.classList.toggle('dark');
    };

    if (!document.startViewTransition) {
        toggleTheme();
        return;
    }

    // Si quieres que el círculo salga de donde haces click, 
    // pasamos las coordenadas al CSS antes de empezar
    document.documentElement.style.setProperty('--x', e.clientX + 'px');
    document.documentElement.style.setProperty('--y', e.clientY + 'px');

    // Iniciamos la transición
    document.startViewTransition(toggleTheme);
});

let misiones = JSON.parse(localStorage.getItem('misiones')) || [];

function renderMisiones() {
  const filtroActual = document.getElementById('filtro-dificultad')?.value || 'todas';
  const seccion = document.getElementById('seccion-misiones');

  seccion.innerHTML = `
    <h2 class="seccion-titulo">Panel de Misiones</h2>

    <div class="formulario-contenedor">
      <h3>Nueva misión</h3>
      <form id="form-mision" onsubmit="crearMision(event)">

        <input id="m-nombre" placeholder="Nombre de la misión" required>

        <select id="m-piloto" required>
          <option value="" disabled selected>Asignar piloto</option>
          ${pilotos.filter(p => p.estado == 'activo').map(p => `<option value="${p.nombre}">${p.nombre}</option>`).join('')}
        </select>

        <select id="m-dificultad" required>
          <option value="" disabled selected>Dificultad</option>
          <option value="facil">Fácil</option>
          <option value="media">Media</option>
          <option value="dificil">Difícil</option>
          <option value="suicida">Suicida</option>
        </select>

        <input type="date" id="m-fecha" required>
        <textarea id="m-descripcion" placeholder="Descripción breve" rows="3" required></textarea>

        <button type="submit" class="button-content">Añadir misión</button>
      </form>
    </div>

    <div class="misiones-filtro">
      <label class= "pie-texto">Filtrar por dificultad:</label>
      <select id="filtro-dificultad" onchange="renderMisiones()">
        <option value="todas">Todas</option>
        <option value="facil">Fácil</option>
        <option value="media">Media</option>
        <option value="dificil">Difícil</option>
        <option value="suicida">Suicida</option>
      </select>
    </div>

    <div class="kanban-tablero">
      <div id="columna-pendiente" class="kanban-columna">
        <h3 class="kanban-titulo">Pendiente: <span id="contador-pendiente" class="kanban-contador">0</span></h3>
      </div>
      <div id="columna-en-curso" class="kanban-columna">
        <h3 class="kanban-titulo">En curso: <span id="contador-en-curso" class="kanban-contador">0</span></h3>
      </div>
      <div id="columna-completada" class="kanban-columna">
        <h3 class="kanban-titulo">Completada: <span id="contador-completada" class="kanban-contador">0</span></h3>
      </div>
    </div>
  `;

   document.getElementById('filtro-dificultad').value = filtroActual;

  pintarTarjetas();
}

function pintarTarjetas() {
  // Leemos el filtro seleccionado
  const filtro = document.getElementById('filtro-dificultad').value;

  // Filtramos las misiones según la dificultad
  const misionesFiltradas = misiones.filter(m => {
    return filtro == 'todas' || m.dificultad == filtro;
  });

  // Vaciamos las tres columnas (solo las tarjetas, no el título)
  document.getElementById('columna-pendiente').querySelectorAll('.mision-tarjeta').forEach(t => t.remove());
  document.getElementById('columna-en-curso').querySelectorAll('.mision-tarjeta').forEach(t => t.remove());
  document.getElementById('columna-completada').querySelectorAll('.mision-tarjeta').forEach(t => t.remove());

  // Contadores
  let contPendiente = 0;
  let contEnCurso = 0;
  let contCompletada = 0;

  // Recorremos las misiones filtradas y creamos una tarjeta por cada una
  for (let i = 0; i < misionesFiltradas.length; i++) {
    const m = misionesFiltradas[i];

    const tarjeta = document.createElement('div');
    tarjeta.classList.add('mision-tarjeta');
    tarjeta.innerHTML = `
      <p><strong>${m.nombre}</strong></p>
      <p>${m.descripcion}</p>
      <p>Piloto: ${m.piloto}</p>
      <p>Dificultad: ${m.dificultad}</p>
      <p>Fecha: ${m.fecha}</p>
      <div class="tarjeta-botones">
        ${m.columna != 'pendiente' ? `<button class="button-content" onclick="retrocederMision(${m.id})">Retroceder</button>` : ''}
        ${m.columna != 'completada' ? `<button class="button-content" onclick="avanzarMision(${m.id})">Avanzar</button>` : ''}
        <button class="button-content" onclick="eliminarMision(${m.id})">Eliminar</button>
      </div>
    `;

    // La metemos en la columna que le corresponde
    document.getElementById('columna-' + m.columna).appendChild(tarjeta);

    // Actualizamos el contador correspondiente
    if (m.columna == 'pendiente') contPendiente++;
    else if (m.columna == 'en-curso') contEnCurso++;
    else if (m.columna == 'completada') contCompletada++;
  }

  // Mostramos los contadores
  document.getElementById('contador-pendiente').textContent = contPendiente;
  document.getElementById('contador-en-curso').textContent = contEnCurso;
  document.getElementById('contador-completada').textContent = contCompletada;
}

function avanzarMision(id) {
  const mision = misiones.find(m => m.id === id);
  if (mision.columna == 'pendiente') mision.columna = 'en-curso';
  else if (mision.columna == 'en-curso') mision.columna = 'completada';
  localStorage.setItem('misiones', JSON.stringify(misiones));
  renderMisiones();
}

function retrocederMision(id) {
  const mision = misiones.find(m => m.id === id);
  if (mision.columna == 'completada') mision.columna = 'en-curso';
  else if (mision.columna == 'en-curso') mision.columna = 'pendiente';
  localStorage.setItem('misiones', JSON.stringify(misiones));
  renderMisiones();
}

function eliminarMision(id) {
  if (confirm('¿Quieres eliminar esta misión?')) {
    misiones = misiones.filter(m => m.id !== id);
    localStorage.setItem('misiones', JSON.stringify(misiones));
    renderMisiones();
  }
}

function crearMision(e) {
  e.preventDefault(); // esto es lo que evita que la página se recargue

  const mision = {
    id: Date.now(),
    nombre: document.getElementById('m-nombre').value,
    piloto: document.getElementById('m-piloto').value,
    dificultad: document.getElementById('m-dificultad').value,
    fecha: document.getElementById('m-fecha').value,
    descripcion: document.getElementById('m-descripcion').value,
    columna: 'pendiente' // toda misión nueva empieza aquí
  };

  misiones.push(mision);
  localStorage.setItem('misiones', JSON.stringify(misiones));
  renderMisiones();
}

function renderDashboard() {
  let navesOperativas = 0;
  let navesReparacion = 0;
  let navesDestruidas = 0;

  for (let i = 0; i < naves.length; i++) {
    if (naves[i].estado === 'operativa') navesOperativas++;
    else if (naves[i].estado === 'en reparación') navesReparacion++;
    else if (naves[i].estado === 'destruida') navesDestruidas++;
  }

  let naveMasRapida = naves[0];
  for (let i = 1; i < naves.length; i++) {
    if (naves[i].velocidad > naveMasRapida.velocidad) {
      naveMasRapida = naves[i];
    }
  }

  let pilotosActivos = 0;
  let pilotosHeridos = 0;
  let pilotosKIA = 0;

  for (let i = 0; i < pilotos.length; i++) {
    if (pilotos[i].estado === 'activo') pilotosActivos++;
    else if (pilotos[i].estado === 'herido') pilotosHeridos++;
    else if (pilotos[i].estado === 'KIA') pilotosKIA++;
  }

  let pilotoTop = pilotos[0];
  for (let i = 1; i < pilotos.length; i++) {
    if (pilotos[i].victorias > pilotoTop.victorias) {
      pilotoTop = pilotos[i];
    }
  }

  let misionesPendientes = 0;
  let misionesEnCurso = 0;
  let misionesCompletadas = 0;

  for (let i = 0; i < misiones.length; i++) {
    if (misiones[i].columna === 'pendiente') misionesPendientes++;
    else if (misiones[i].columna === 'en-curso') misionesEnCurso++;
    else if (misiones[i].columna === 'completada') misionesCompletadas++;
  }

  const totalMisiones = misiones.length;
  const porcentaje = totalMisiones > 0 ? Math.round((misionesCompletadas / totalMisiones) * 100) : 0;

  document.getElementById('stats-naves').innerHTML = `
    <h3 class="dashboard-subtitulo">Naves</h3>
    <p>total: ${naves.length}</p>
    <p>operativas: ${navesOperativas}</p>
    <p>en reparación: ${navesReparacion}</p>
    <p>destruidas: ${navesDestruidas}</p>
  `;

  document.getElementById('stats-pilotos').innerHTML = `
    <h3 class="dashboard-subtitulo">Pilotos</h3>
    <p>total: ${pilotos.length}</p>
    <p>activos: ${pilotosActivos}</p>
    <p>heridos: ${pilotosHeridos}</p>
    <p>kia: ${pilotosKIA}</p>
  `;

  document.getElementById('stats-misiones').innerHTML = `
    <h3 class="dashboard-subtitulo">Misiones</h3>
    <p>total: ${totalMisiones}</p>
    <p>pendientes: ${misionesPendientes}</p>
    <p>en curso: ${misionesEnCurso}</p>
    <p>completadas: ${misionesCompletadas}</p>
  `;

  document.getElementById('stats-records').innerHTML = `
    <h3 class="dashboard-subtitulo">Récords</h3>
    <p>piloto top: ${pilotoTop ? pilotoTop.nombre + ' (' + pilotoTop.victorias + ' victorias)' : 'sin datos'}</p>
    <p>nave más rápida: ${naveMasRapida ? naveMasRapida.nombre + ' (' + naveMasRapida.velocidad + ' MGLT)' : 'sin datos'}</p>
  `;

  document.getElementById('visualizacion').innerHTML = `
    <h3 class="dashboard-subtitulo">Progreso de misiones</h3>
    <p>Completadas: ${porcentaje}<a id="porcentaje">%</a></p>
    <div class="barra-fondo">
      <div class="barra-progreso" style="width: ${porcentaje}%"></div>
    </div>
  `;
}

//INICIO DE LAS FUNCIONES//
window.onload= () => {
  inicializarNav();
  mostrarTodoElHangar();
  renderPilotos();
  renderMisiones();
  renderDashboard();
  mostrarSeccion('seccion-hangar');
};