let filtroTexto = "";
let filtroTipo = "todos";
let velocidadAsc = true;


// CONSTANTES//
const naves= [
  { nombre: "x-wing", tipo: "caza", velocidad: 100, tripulacion: 1, estado: "operativa", emoji: "🚀" },
  { nombre: "millennium falcon", tipo: "transporte", velocidad: 150, tripulacion: 6, estado: "operativa", emoji: "🛸" },
  { nombre: "y-wing", tipo: "caza", velocidad: 80, tripulacion: 2, estado: "en reparación", emoji: "✈️" },
  { nombre: "a-wing", tipo: "caza", velocidad: 175, tripulacion: 1, estado: "operativa", emoji: "⚡" },
  { nombre: "b-wing", tipo: "fragata", velocidad: 91, tripulacion: 3, estado: "destruida", emoji: "💥" }
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
      <h2 class="seccion-titulo">Hangar de Naves</h2>
      <div class="hangar-controles">
        <input type="text" id="busqueda-nave" placeholder="Buscar una nave" class="input-estilo">
        <select id="filtro-tipo" class="select-estilo">
            <option value="todos">Todos los tipos</option>
            <option value="caza">Caza</option>
            <option value="transporte">Transporte</option>
            <option value="fragata">Fragata</option>
        </select>
        <button id="btn-ordenar">Ordenar por Velocidad ↑</button>
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
        <span class="nave-emoji">${nave.emoji}</span>
        <h3 class="color-Hangar">${nave.nombre}</h3>
        <p>Tipo: ${nave.tipo}</p>
        <p>velocidad: <strong>${nave.velocidad}</strong> MGLT</p>
        <p>Estado: <span class="tag-${nave.estado.replace(' ', '-')}">${nave.estado}</span></p>
    `;
    grid.appendChild(card);
  });

  //Actualizamos el contador//
  document.getElementById('contador-naves').textContent = `Mostrando ${navesAMostrar.length} naves.`;
}







//FILTRAR NAVES//
function filtrarNaves() {
  filtroTexto=document.getElementById('busqueda-nave').value.toLowerCase();
  filtroTipo=document.getElementById('filtro-tipo').value;
  aplicarCambios();
}

function toggleOrden() {
  velocidadAsc=!velocidadAsc;
  //Actualizamos la flecha en el botón con un ternario
  document.getElementById('btn-ordenar').textContent=`Ordenar por Velocidad ${velocidadAsc ? '↑' : '↓'}`;
  aplicarCambios();
}

function aplicarCambios() {
  //Primero filtramos según lo que haya en el input y el select
  let resultado=naves.filter(n => {
    const coincideTexto=n.nombre.toLowerCase().includes(filtroTexto);
    const coincideTipo=filtroTipo==='todos' || n.tipo===filtroTipo;
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
            <input id="n-p" placeholder="Nombre del piloto" required>
            
            <select id="r-p" required>
                <option value="" disabled selected>Selecciona un Rango</option>
                <option value="Recluta">Recluta</option>
                <option value="Teniente">Teniente</option>
                <option value="Capitán">Capitán</option>
                <option value="Comandante">comandante</option>
                <option value="General">General</option>
            </select>

            <select id="s-p" required>
                <option value="" disabled selected>Asignar Nave</option>
                ${naves.map(n => `<option value="${n.nombre}">${n.nombre}</option>`).join('')}
            </select>

            <input type="number" id="v-p" placeholder="Victorias" min="0" required>

            <select id="e-p" required>
                <option value="activo">Activo</option>
                <option value="herido">Herido</option>
                <option value="KIA">KIA (Misión Finalizada)</option>
            </select>

            <button type="submit">Registrar Piloto</button>
        </form>

        <ul id="lista-p">
            ${pilotos.map(p => `
                <li>
                    ${p.rango} ${p.nombre} 
                    - nave: ${p.nave} 
                    - victorias: ${p.victorias} 
                    - estado: <span class="tag-${p.estado}">${p.estado}</span>
                    <button onclick="borrarP(${p.id})">Eliminar</button>
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

function inicializarNav() {
  const navElement=document.getElementById("navegacion-principal");
  navElement.innerHTML="";

  for (let i=0; i<secciones.length; i++) {
    const boton=document.createElement("button");
    boton.textContent=secciones[i].texto;
    boton.classList.add("nav-boton");

    boton.addEventListener("click", () => {
      mostrarSeccion(secciones[i].id);
      document.querySelectorAll(".nav-boton").forEach(b => b.classList.remove("nav-boton--activo"));
      boton.classList.add("nav-boton--activo");
    });
    navElement.appendChild(boton);
  }
  navElement.firstChild.classList.add("nav-boton--activo");
}

//INICIO DE LAS FUNCIONES//
window.onload= () => {
  inicializarNav();
  mostrarTodoElHangar();
  renderPilotos();
  mostrarSeccion('seccion-hangar');
};





const btn = document.getElementById('theme-toggle');

btn.addEventListener('click', (e) => {
    // Función que cambia la clase
    const toggleTheme = () => {
        document.documentElement.classList.toggle('dark');
    };

    // Si el navegador no soporta la API, cambio directo
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