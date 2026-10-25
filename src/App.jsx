
import { useEffect, useState } from 'react';
import './App.css';

const combinacionesGanadoras = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const marcadorInicial = {
  X: 0,
  O: 0,
  empates: 0,
};

function leerMarcador() {
  try {
    const guardado = localStorage.getItem('domibatalla-marcador');
    return guardado ? { ...marcadorInicial, ...JSON.parse(guardado) } : marcadorInicial;
  } catch {
    return marcadorInicial;
  }
}

function App() {
  const [tablero, setTablero] = useState(Array(9).fill(null));
  const [turno, setTurno] = useState('X');
  const [ganador, setGanador] = useState(null);
  const [combinacionGanadora, setCombinacionGanadora] = useState([]);
  const [marcador, setMarcador] = useState(leerMarcador);

  const empate = !ganador && tablero.every(Boolean);
  const terminado = Boolean(ganador) || empate;

  useEffect(() => {
    localStorage.setItem('domibatalla-marcador', JSON.stringify(marcador));
  }, [marcador]);

  function jugar(indice) {
    if (tablero[indice] || terminado) return;

    const nuevoTablero = [...tablero];
    nuevoTablero[indice] = turno;
    setTablero(nuevoTablero);

    const combinacion = combinacionesGanadoras.find(([a, b, c]) =>
      nuevoTablero[a] &&
      nuevoTablero[a] === nuevoTablero[b] &&
      nuevoTablero[a] === nuevoTablero[c]
    );

    if (combinacion) {
      setGanador(turno);
      setCombinacionGanadora(combinacion);
      setMarcador((actual) => ({
        ...actual,
        [turno]: actual[turno] + 1,
      }));
      return;
    }

    if (nuevoTablero.every(Boolean)) {
      setMarcador((actual) => ({
        ...actual,
        empates: actual.empates + 1,
      }));
      return;
    }

    setTurno(turno === 'X' ? 'O' : 'X');
  }

  function reiniciarPartida() {
    setTablero(Array(9).fill(null));
    setTurno('X');
    setGanador(null);
    setCombinacionGanadora([]);
  }

  function reiniciarMarcador() {
    setMarcador({ ...marcadorInicial });
    reiniciarPartida();
  }

  const nombreTurno = turno === 'X' ? 'JUGADOR 1' : 'JUGADOR 2';

  let estadoPrincipal = `TURNO DE ${nombreTurno}`;
  let detalleEstado = 'ESPERANDO MOVIMIENTO DEL JUGADOR';

  if (ganador) {
    estadoPrincipal =
      ganador === 'X'
        ? '¡VICTORIA DEL JUGADOR 1!'
        : '¡VICTORIA DEL JUGADOR 2!';
    detalleEstado = 'PARTIDA FINALIZADA · GANADOR CONFIRMADO';
  } else if (empate) {
    estadoPrincipal = '¡EMPATE!';
    detalleEstado = 'PARTIDA FINALIZADA · BATALLA EQUILIBRADA';
  }

  const claseEstado = ganador
    ? 'winner'
    : empate
      ? 'draw'
      : turno.toLowerCase();

  return (
    <main className="app-shell">
      <div className="ambient ambient-blue"></div>
      <div className="ambient ambient-red"></div>

      <header className="topbar">
        <a className="brand" href="#inicio" aria-label="DomiBatalla inicio">
          <span className="brand-symbol">DB</span>
          <span className="brand-copy">
            <strong>DOMI<span>BATALLA</span></strong>
            <small>BY JOANFI</small>
          </span>
        </a>

        <div className="live-status">
          <span className="live-dot"></span>
          SISTEMA ACTIVO
        </div>

        <div className="flag-badge" aria-label="Bandera dominicana">
          <span>🔵</span>
          <span>🔴</span>
          <span>⚪</span>
          <small>RD EDITION</small>
        </div>
      </header>

      <section className="hero" id="inicio">
        <p className="eyebrow">
          <span></span>
          REPÚBLICA DOMINICANA · EDICIÓN DIGITAL
          <span></span>
        </p>

        <h1>
          TRES EN <span>RAYA</span>
        </h1>

        <p className="subtitle">ESTRATEGIA · INTELIGENCIA · COMPETENCIA</p>

        <p className="hero-description">
          Dos jugadores. Una batalla. Solo uno puede dominar el tablero.
        </p>
      </section>

      <section className="game-layout">
        <aside className="side-panel player-panel">
          <div className="panel-heading">
            <span className="panel-index">01</span>
            <span>JUGADORES</span>
          </div>

          <div
            className={`player-card player-x ${
              !terminado && turno === 'X' ? 'active' : ''
            }`}
          >
            <div className="player-icon">X</div>
            <div className="player-info">
              <strong>JUGADOR 1</strong>
              <small>FICHA X</small>
              <span className="player-state">
                {!terminado && turno === 'X'
                  ? '● EN TURNO'
                  : '○ EN ESPERA'}
              </span>
            </div>
            <strong className="player-score">{marcador.X}</strong>
          </div>

          <div className="versus">— VS —</div>

          <div
            className={`player-card player-o ${
              !terminado && turno === 'O' ? 'active' : ''
            }`}
          >
            <div className="player-icon">O</div>
            <div className="player-info">
              <strong>JUGADOR 2</strong>
              <small>FICHA O</small>
              <span className="player-state">
                {!terminado && turno === 'O'
                  ? '● EN TURNO'
                  : '○ EN ESPERA'}
              </span>
            </div>
            <strong className="player-score">{marcador.O}</strong>
          </div>

          <div className="panel-footer">
            <span className="status-square"></span>
            DOS JUGADORES · MODO LOCAL
          </div>
        </aside>

        <section className="board-panel">
          <div className="board-topline">
            <span>CAMPO DE BATALLA</span>
            <span>GRID 03 × 03</span>
          </div>

          <div className="game-status" aria-live="polite">
            <span className={`status-icon ${claseEstado}`}>
              {ganador ? '★' : empate ? '=' : turno}
            </span>
            <div>
              <strong>{estadoPrincipal}</strong>
              <small>{detalleEstado}</small>
            </div>
          </div>

          <div className="board" aria-label="Tablero de tres en raya">
            {tablero.map((casilla, indice) => (
              <button
                key={indice}
                type="button"
                className={`cell ${
                  casilla ? `cell-${casilla.toLowerCase()}` : ''
                } ${
                  combinacionGanadora.includes(indice)
                    ? 'winning-cell'
                    : ''
                }`}
                onClick={() => jugar(indice)}
                disabled={Boolean(casilla) || terminado}
                aria-label={`Casilla ${indice + 1}${
                  casilla ? `, ficha ${casilla}` : ', vacía'
                }`}
              >
                {casilla && <span>{casilla}</span>}
                <span className="cell-number">{`0${indice + 1}`}</span>
              </button>
            ))}
          </div>

          <div className="board-bottomline">
            <span>● CONEXIÓN ESTABLE</span>
            <span>{terminado ? 'PARTIDA TERMINADA' : 'ESPERANDO JUGADA'}</span>
          </div>

          <button
            type="button"
            className="reset-button"
            onClick={reiniciarPartida}
          >
            <span>↻</span> NUEVA PARTIDA
          </button>
        </section>

        <aside className="side-panel stats-panel">
          <div className="panel-heading">
            <span className="panel-index">02</span>
            <span>ESTADÍSTICAS</span>
          </div>

          <div className="stat-card">
            <span className="stat-icon blue-text">X</span>
            <div>
              <small>VICTORIAS JUGADOR 1</small>
              <strong className="blue-text">{marcador.X}</strong>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">=</span>
            <div>
              <small>PARTIDAS EMPATADAS</small>
              <strong>{marcador.empates}</strong>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon red-text">O</span>
            <div>
              <small>VICTORIAS JUGADOR 2</small>
              <strong className="red-text">{marcador.O}</strong>
            </div>
          </div>

          <div className="domi-message">
            <span>🇩🇴</span>
            <strong>ORGULLO DOMINICANO. MENTE ESTRATÉGICA.</strong>
            <small>¡Que gane el mejor!</small>
          </div>

          <button
            type="button"
            className="clear-button"
            onClick={reiniciarMarcador}
          >
            REINICIAR MARCADOR
          </button>
        </aside>
      </section>

      <footer className="footer">
        <div className="footer-line"></div>
        <p>
          <span>DOMIBATALLA</span> © 2026 · DESARROLLADO POR JOANFI
        </p>
        <small>HECHO EN REPÚBLICA DOMINICANA</small>
      </footer>
    </main>
  );
}

export default App;
