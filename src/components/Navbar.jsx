import { useEffect, useRef, useState } from "react";
import Icono from "./Icono.jsx";
import logo from "../assets/logo.svg";
import "../styles/tokens.css";
import "./Navbar.css";

const DESTINOS = {
  descubrir: "#descubrir",
  planes: "#planes",
  paraArtistas: "#paraArtistas",
  ayuda: "#ayuda",
};

const DESTINOS_MOBILE  = {
  inicio: "#inicio",
  buscar: "#buscar"

}



export default function Navbar({
  textos,
  cargando,
  error,
  recargar,
  idioma,
  cambiarIdioma,
  activo,
  onBuscar,
  textoGrande,
  alternarTexto,
}) {
  const [abierto, setAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const botonMenu = useRef(null);
  const campoBusqueda = useRef(null);
  const nav = textos?.navbar;
  const ingles = idioma === "en";
  const abrir = textos?.menuMovil.abrir ?? (ingles ? "Open menu" : "Abrir menú");
  const cerrar = textos?.menuMovil.cerrar ?? (ingles ? "Close menu" : "Cerrar menú");
  const enlaces = Object.entries(nav?.enlaces?.invitado ?? {}).filter(([clave]) => DESTINOS[clave]);

  useEffect(() => {
    function cerrarConEscape(evento) {
      if (evento.key === "Escape" && abierto) {
        setAbierto(false);
        botonMenu.current?.focus();
      }
    }
    document.addEventListener("keydown", cerrarConEscape);
    return () => document.removeEventListener("keydown", cerrarConEscape);
  }, [abierto]);

  function abrirBusqueda() {
    setAbierto(true);
    requestAnimationFrame(() => campoBusqueda.current?.focus());
  }

  function buscar(evento) {
    evento.preventDefault();
    const consulta = busqueda.trim();
    if (!consulta) return;
    onBuscar(consulta);
    setAbierto(false);
  }

  return (
    <header className="navbar">
      <nav className="navbar-interior" aria-label={nav?.aria.menu ?? "Navegación principal"}>
        <a
          className="navbar-marca"
          href="#inicio"
          aria-label={nav?.logo.aria ?? "Inicio"}
          onClick={() => setAbierto(false)}
        >
          <img src={logo} alt={nav?.logo.aria ?? "Inicio"} />
        </a>

        <div className="navbar-movil-acciones">
          <button
            type="button"
            className="navbar-icono"
            aria-label={nav?.buscador.aria ?? "Buscar"}
            
            // disabled={!nav}
            // onClick={abrirBusqueda}
          >
            <Icono nombre="buscar" />
          </button>
          <button
            ref={botonMenu}
            type="button"
            className="navbar-icono"
            aria-label={abierto ? cerrar : abrir}
            aria-expanded={abierto}
            aria-controls="navbar-panel"
            onClick={() => setAbierto((valor) => !valor)}
          >
            <Icono nombre={abierto ? "cerrar" : "menu"} />
          </button>
        </div>

        <div id="navbar-panel" className={`navbar-panel${abierto ? " is-abierto" : ""}`} aria-busy={cargando}>
          {cargando && (
            <p className="navbar-estado" role="status">
              {ingles ? "Loading navigation…" : "Cargando navegación…"}
            </p>
          )}
          {error && (
            <div className="navbar-estado" role="alert">
              <p>{ingles ? "Navigation could not be loaded." : "No pudimos cargar el menú."}</p>
              <button type="button" onClick={recargar}>
                {ingles ? "Try again" : "Reintentar"}
              </button>
            </div>
          )}
          {nav && (
            <>
              <ul className="navbar-enlaces cuerpo-p-fuerte">
                {enlaces.map(([clave, etiqueta]) => (
                  <li key={clave}>
                    <a
                      href={DESTINOS_MOBILE[clave]}
                      aria-current={activo === clave ? "page" : undefined}
                      onClick={() => setAbierto(false)}
                    >
                      {etiqueta}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
          <div className="navbar-utilidades cuerpo-p-fuerte">
            <label className="navbar-idioma">
              <Icono nombre="idioma" />
              <select
                value={idioma}
                onChange={(evento) => cambiarIdioma(evento.target.value)}
                aria-label={nav?.aria.idioma ?? "Cambiar idioma"}
              >
                <option value="es">ES</option>
                <option value="en">EN</option>
              </select>
            </label>
            <button
              className="navbar-icono navbar-accesibilidad"
              type="button"
              aria-label={ingles ? "Enlarge text" : "Aumentar texto"}
              aria-pressed={textoGrande}
              onClick={alternarTexto}
            >
              <Icono nombre="accesibilidad" />
            </button>
            {nav && (
              <a className="navbar-accion1" href="#ingresar" onClick={() => setAbierto(false)}>
                {nav.botones.invitado.ingresar}
              </a>
            )}
            {nav && (
              <a className="navbar-accion2" href="#crearCuenta" onClick={() => setAbierto(false)}>
                {nav.botones.invitado.crearCuenta}
              </a>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
