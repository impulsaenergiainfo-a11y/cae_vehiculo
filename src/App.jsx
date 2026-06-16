import { useState, useMemo } from "react";

// ===== Identidad de marca Impulsa Energía =====
const BRAND = {
  yellow: "#F5E800",
  lime: "#A8C800",
  titanite: "#7A9B3C",
  black: "#111111",
  white: "#FFFFFF",
  gray: "#3D3D3D",
  grayLight: "#73736E",
  bg: "#FAFAF7",
  border: "#E8E8E2",
};

// ===== Constantes técnicas (ficha TRA050) =====
const FUELS = {
  gasolina: { label: "Gasolina", kwhPorLitro: 9.19, precioLitro: 1.55 },
  diesel: { label: "Diésel", kwhPorLitro: 9.97, precioLitro: 1.45 },
};

const KM_TURISMO = 13073;
const PRECIO_CAE_KWH = 0.14;
const PRECIO_ELEC = 0.15;

const fmt = (n, d = 0) =>
  n.toLocaleString("es-ES", { maximumFractionDigits: d, minimumFractionDigits: d });

const floor10 = (n) => Math.floor(n / 10) * 10;

// Isotipo: rayo perfilado en tres tramos (amarillo → lima → verde), fiel al logo
const Rayo = ({ size = 34 }) => (
  <svg width={size} height={size * 1.15} viewBox="0 0 100 115" fill="none" style={{ display: "block", flexShrink: 0 }}>
    <defs>
      <mask id="boltMask">
        <path
          d="M57 6 L22 60 H44 L32 109 L80 47 H56 L69 6 Z"
          fill="none" stroke="#fff" strokeWidth="11" strokeLinejoin="miter"
        />
      </mask>
    </defs>
    <g mask="url(#boltMask)">
      <rect x="0" y="0" width="100" height="41" fill={BRAND.yellow} />
      <rect x="0" y="45" width="100" height="22" fill={BRAND.lime} />
      <rect x="0" y="71" width="100" height="44" fill={BRAND.titanite} />
    </g>
  </svg>
);

export default function CalculadoraCAEVE() {
  const [fuel, setFuel] = useState("gasolina");
  const [consumoAntiguo, setConsumoAntiguo] = useState(7.9);
  const [consumoNuevo, setConsumoNuevo] = useState(14.3);
  const [kmAnuales, setKmAnuales] = useState(KM_TURISMO);
  const [verDetalle, setVerDetalle] = useState(false);

  const r = useMemo(() => {
    const f = FUELS[fuel];
    const cefInicial = consumoAntiguo * f.kwhPorLitro;
    const cefFinal = consumoNuevo;
    const ahorroKwh = Math.max(0, ((cefInicial - cefFinal) / 100) * kmAnuales);
    const caeImporte = floor10(ahorroKwh * PRECIO_CAE_KWH);
    const costeCombustible = (consumoAntiguo / 100) * kmAnuales * f.precioLitro;
    const costeElectrico = (consumoNuevo / 100) * kmAnuales * PRECIO_ELEC;
    const ahorroAnual = floor10(Math.max(0, costeCombustible - costeElectrico));
    return { cefInicial, cefFinal, ahorroKwh, caeImporte, ahorroAnual };
  }, [fuel, consumoAntiguo, consumoNuevo, kmAnuales]);

  return (
    <div className="ie-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;800&display=swap');

        .ie-root, .ie-root * { box-sizing: border-box; margin: 0; }
        .ie-root {
          min-height: 100vh;
          background: ${BRAND.bg};
          color: ${BRAND.gray};
          font-family: 'Typograph Pro','Montserrat','Raleway',sans-serif;
        }

        /* ===== Hero ===== */
        .ie-hero {
          background: linear-gradient(165deg, ${BRAND.black} 0%, ${BRAND.gray} 100%);
          padding: 40px 20px 96px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .ie-glow { position: absolute; border-radius: 50%; filter: blur(14px); pointer-events: none; }
        .ie-hero-inner { position: relative; z-index: 1; max-width: 680px; margin: 0 auto; }
        .ie-logo { display: inline-flex; align-items: center; gap: 10px; margin-bottom: 22px; }
        .ie-wordmark { text-align: left; line-height: 1.05; }
        .ie-wordmark-main { color: ${BRAND.white}; font-weight: 800; font-size: 19px; letter-spacing: 2px; white-space: nowrap; }
        .ie-wordmark-main span { font-weight: 300; color: #B8B8B4; }
        .ie-wordmark-sub { color: #9C9C98; font-weight: 300; font-size: 10px; letter-spacing: 3.5px; }
        .ie-hero h1 { font-size: clamp(25px, 4.5vw, 38px); font-weight: 800; line-height: 1.18; color: ${BRAND.white}; margin-bottom: 12px; }
        .ie-hero h1 .y { color: ${BRAND.yellow}; }
        .ie-hero p { color: #C9C9C4; font-size: 15px; line-height: 1.6; font-weight: 300; }
        .ie-hero p strong { color: ${BRAND.lime}; font-weight: 600; }

        /* ===== Layout ===== */
        .ie-content { max-width: 920px; margin: -56px auto 0; padding: 0 16px 44px; position: relative; z-index: 2; }
        .ie-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: start; }
        @media (max-width: 720px) { .ie-grid { grid-template-columns: 1fr; } }
        .ie-col { display: flex; flex-direction: column; gap: 16px; min-width: 0; }

        .ie-card {
          background: ${BRAND.white};
          border-radius: 18px;
          border: 1px solid ${BRAND.border};
          box-shadow: 0 2px 14px rgba(0,0,0,0.05);
          padding: 24px;
          width: 100%;
        }

        /* ===== Formulario ===== */
        .ie-card h2 { font-size: 17px; font-weight: 800; color: ${BRAND.black}; display: flex; align-items: center; gap: 10px; margin-bottom: 22px; }
        .ie-h2-icon { background: ${BRAND.yellow}; width: 30px; height: 30px; border-radius: 9px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }

        .ie-field { margin-bottom: 22px; }
        .ie-field:last-child { margin-bottom: 0; }
        .ie-label-row { display: flex; justify-content: space-between; align-items: baseline; gap: 10px; margin-bottom: 8px; }
        .ie-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: ${BRAND.grayLight}; font-weight: 600; }
        .ie-value { font-size: 14px; font-weight: 800; color: ${BRAND.titanite}; white-space: nowrap; }
        .ie-hint { font-size: 11px; color: ${BRAND.grayLight}; font-weight: 300; margin-top: 5px; line-height: 1.45; }

        .ie-toggle { display: flex; gap: 8px; }
        .ie-toggle button {
          flex: 1; padding: 11px 0; border-radius: 12px; font-size: 15px; cursor: pointer;
          font-family: inherit; transition: all .15s; color: ${BRAND.black};
          background: ${BRAND.bg}; border: 2px solid ${BRAND.border}; font-weight: 400;
        }
        .ie-toggle button.on { background: ${BRAND.yellow}; border-color: ${BRAND.yellow}; font-weight: 800; }

        .ie-slider { width: 100%; accent-color: ${BRAND.lime}; height: 6px; cursor: pointer; display: block; }

        .ie-chip {
          background: ${BRAND.bg}; border: 1px solid ${BRAND.border}; border-radius: 999px;
          padding: 6px 14px; font-size: 12px; font-weight: 600; color: ${BRAND.gray};
          cursor: pointer; font-family: inherit; margin-top: 8px;
        }
        .ie-chip.on { background: ${BRAND.lime}; border-color: ${BRAND.lime}; color: ${BRAND.black}; }

        /* ===== Resultados ===== */
        .ie-result {
          background: linear-gradient(135deg, ${BRAND.yellow} 0%, ${BRAND.lime} 100%);
          border-radius: 18px; padding: 24px; color: ${BRAND.black};
          box-shadow: 0 8px 26px rgba(168, 200, 0, 0.35); width: 100%;
        }
        .ie-kicker { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; opacity: 0.65; }
        .ie-result .ie-big { font-size: clamp(32px, 6vw, 46px); font-weight: 800; line-height: 1.05; margin: 8px 0 4px; }
        .ie-result .ie-sub { font-size: 13px; font-weight: 400; opacity: 0.8; }

        .ie-kicker-g { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; color: ${BRAND.grayLight}; }
        .ie-mid { font-size: 28px; font-weight: 800; color: ${BRAND.titanite}; margin: 6px 0 2px; }
        .ie-sub-g { font-size: 13px; color: ${BRAND.grayLight}; line-height: 1.5; font-weight: 300; }

        .ie-detail-btn { background: none; border: none; color: ${BRAND.titanite}; font-weight: 800; font-size: 14px; cursor: pointer; padding: 0; font-family: inherit; }
        .ie-detail-grid { display: grid; grid-template-columns: 1fr auto; row-gap: 5px; column-gap: 12px; margin-top: 14px; font-size: 13px; line-height: 1.7; }
        .ie-detail-grid .k { font-weight: 300; color: ${BRAND.gray}; }
        .ie-detail-grid .v { font-weight: 700; color: ${BRAND.black}; text-align: right; white-space: nowrap; }
        .ie-detail-grid .hl { color: ${BRAND.titanite}; }
        .ie-detail-note { font-size: 12px; color: ${BRAND.grayLight}; margin-top: 10px; font-weight: 300; line-height: 1.55; }

        /* ===== CTA ===== */
        .ie-cta { border: 2px solid ${BRAND.yellow}; text-align: center; }
        .ie-cta p { font-size: 14px; color: ${BRAND.gray}; margin-bottom: 14px; line-height: 1.55; font-weight: 300; }
        .ie-cta p b { font-weight: 800; }
        .ie-cta p b span { font-weight: 300; }
        .ie-cta-btn {
          display: inline-block; background: ${BRAND.black}; color: ${BRAND.yellow};
          font-weight: 800; font-size: 15px; padding: 13px 30px; border-radius: 999px;
          text-decoration: none; font-family: inherit;
        }
        .ie-cta-contact { font-size: 13px; color: ${BRAND.grayLight}; margin-top: 12px; font-weight: 300; }

        /* ===== Pasos ===== */
        .ie-steps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }
        @media (max-width: 720px) { .ie-steps { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 420px) { .ie-steps { grid-template-columns: 1fr; } }
        .ie-step-n { width: 36px; height: 36px; border-radius: 12px; font-weight: 800; font-size: 17px; display: flex; align-items: center; justify-content: center; margin-bottom: 10px; }
        .ie-step-t { font-weight: 600; font-size: 15px; margin-bottom: 4px; color: ${BRAND.black}; }
        .ie-step-d { font-size: 13px; color: ${BRAND.grayLight}; line-height: 1.55; font-weight: 300; }

        .ie-legal { font-size: 11px; color: #A8A8A2; text-align: center; margin: 22px auto 0; line-height: 1.6; max-width: 760px; font-weight: 300; }
      `}</style>

      {/* ===== Hero ===== */}
      <div className="ie-hero">
        <div className="ie-glow" style={{ top: -130, right: -90, width: 360, height: 360, background: BRAND.yellow, opacity: 0.13 }} />
        <div className="ie-glow" style={{ bottom: -150, left: -110, width: 320, height: 320, background: BRAND.lime, opacity: 0.11 }} />
        <div className="ie-hero-inner">
          <div className="ie-logo">
            <Rayo size={38} />
            <div className="ie-wordmark">
              <div className="ie-wordmark-main">IMPULSA<span> ENERGÍA</span></div>
              <div className="ie-wordmark-sub">ENERGY SOLUTIONS</div>
            </div>
          </div>
          <h1>
            ¿Has comprado un coche eléctrico?<br />
            <span className="y">Te deben dinero.</span>
          </h1>
          <p>
            Al sustituir tu coche de combustión por uno <strong>100% eléctrico</strong> generas un ahorro
            energético que se puede certificar y vender: es el <strong>CAE de Vehículo
            Eléctrico</strong>. Calcula cuánto te corresponde en 20 segundos.
          </p>
          <p style={{ marginTop: 10, fontSize: 12, opacity: 0.7 }}>
            ⚠️ Solo aplicable a vehículos 100% eléctricos. El resto de motorizaciones no tienen acceso a esta subvención.
          </p>
        </div>
      </div>

      {/* ===== Contenido ===== */}
      <div className="ie-content">
        <div className="ie-grid">

          {/* ===== Panel de datos ===== */}
          <div className="ie-card">
            <h2>
              <span className="ie-h2-icon"><Rayo size={18} /></span>
              Tu coche antiguo y el nuevo
            </h2>

            <div className="ie-field">
              <div className="ie-label-row">
                <span className="ie-label">Combustible del coche antiguo</span>
              </div>
              <div className="ie-toggle">
                {Object.entries(FUELS).map(([k, f]) => (
                  <button key={k} className={fuel === k ? "on" : ""} onClick={() => setFuel(k)}>
                    {f.label}
                  </button>
                ))}
              </div>
              <div className="ie-hint">El vehículo nuevo debe ser <strong>100% eléctrico</strong>. Otras motorizaciones no tienen acceso a esta subvención.</div>
            </div>

            <div className="ie-field">
              <div className="ie-label-row">
                <span className="ie-label">Consumo del coche antiguo</span>
                <span className="ie-value">{consumoAntiguo.toLocaleString("es-ES")} L/100 km</span>
              </div>
              <input className="ie-slider" type="range" min={4} max={15} step={0.1}
                value={consumoAntiguo} onChange={(e) => setConsumoAntiguo(Number(e.target.value))} />
              <div className="ie-hint">Lo encuentras en la ficha técnica del vehículo. Un turismo medio: 6–9 L/100 km.</div>
            </div>

            <div className="ie-field">
              <div className="ie-label-row">
                <span className="ie-label">Consumo del eléctrico nuevo</span>
                <span className="ie-value">{consumoNuevo.toLocaleString("es-ES")} kWh/100 km</span>
              </div>
              <input className="ie-slider" type="range" min={10} max={25} step={0.1}
                value={consumoNuevo} onChange={(e) => setConsumoNuevo(Number(e.target.value))} />
              <div className="ie-hint">Según etiqueta energética / ficha IDAE. La mayoría de eléctricos: 13–18 kWh/100 km.</div>
            </div>

            <div className="ie-field">
              <div className="ie-label-row">
                <span className="ie-label">Kilometraje anual</span>
                <span className="ie-value">{fmt(kmAnuales)} km</span>
              </div>
              <input className="ie-slider" type="range" min={5000} max={40000} step={500}
                value={kmAnuales} onChange={(e) => setKmAnuales(Number(e.target.value))} />
              <button
                className={`ie-chip ${kmAnuales === KM_TURISMO ? "on" : ""}`}
                onClick={() => setKmAnuales(KM_TURISMO)}
              >
                Usar estándar turismo ({fmt(KM_TURISMO)} km)
              </button>
            </div>
          </div>

          {/* ===== Panel de resultados ===== */}
          <div className="ie-col">

            <div className="ie-result">
              <div className="ie-kicker">Tu CAE por pasarte al eléctrico</div>
              <div className="ie-big">~{fmt(r.caeImporte)} €</div>
              <div className="ie-sub">pago único · {fmt(r.ahorroKwh)} kWh certificables a 0,14 €/kWh</div>
            </div>

            <div className="ie-card">
              <div className="ie-kicker-g">Además, cada año ahorras</div>
              <div className="ie-mid">~{fmt(r.ahorroAnual)} €/año</div>
              <div className="ie-sub-g">
                en energía: cargar en casa (~{PRECIO_ELEC.toLocaleString("es-ES")} €/kWh) frente a
                repostar {FUELS[fuel].label.toLowerCase()} (~{FUELS[fuel].precioLitro.toLocaleString("es-ES")} €/L)
              </div>
            </div>

            <div className="ie-card">
              <button className="ie-detail-btn" onClick={() => setVerDetalle(!verDetalle)}>
                {verDetalle ? "▾ Ocultar detalle técnico" : "▸ Ver detalle técnico (ficha TRA050)"}
              </button>
              {verDetalle && (
                <>
                  <div className="ie-detail-grid">
                    <span className="k">Consumo antiguo (CEF<sub>i</sub>)</span>
                    <span className="v">{fmt(r.cefInicial, 1)} kWh/100 km</span>
                    <span className="k">Consumo eléctrico (CEF<sub>f</sub>)</span>
                    <span className="v">{fmt(r.cefFinal, 1)} kWh/100 km</span>
                    <span className="k">Factor de conversión</span>
                    <span className="v">{FUELS[fuel].kwhPorLitro} kWh/L {FUELS[fuel].label.toLowerCase()}</span>
                    <span className="k hl" style={{ fontWeight: 600 }}>Ahorro certificable (AE)</span>
                    <span className="v hl">{fmt(r.ahorroKwh)} kWh/año</span>
                    <span className="k">Precio medio aplicado</span>
                    <span className="v">0,14 €/kWh</span>
                  </div>
                  <p className="ie-detail-note">
                    Cálculo según la fórmula oficial de la ficha <strong>TRA050</strong> del catálogo
                    MITECO: AE = (CEF<sub>i</sub> − CEF<sub>f</sub>)/100 × km anuales. Precio medio basado
                    en expedientes CAE reales gestionados. El CAE certifica el ahorro del primer año
                    (pago único). Importes redondeados a la baja.
                  </p>
                </>
              )}
            </div>

            <div className="ie-card ie-cta">
              <p>
                En <b>IMPULSA<span> ENERGÍA</span></b> tramitamos tu CAE de principio a fin.
                Tú solo nos pasas la documentación del coche. <b style={{ fontWeight: 600 }}>Y cobras.</b>
              </p>
              <a
                className="ie-cta-btn"
                style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
                href={`https://wa.me/34640388483?text=${encodeURIComponent(
                  `Hola 👋 He calculado mi CAE de vehículo eléctrico en vuestra web: ~${fmt(r.caeImporte)} €. Me gustaría tramitarlo.`
                )}`}
                target="_blank" rel="noopener noreferrer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.6-6.1c-.3-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.3-.7.8-.8 1-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.4-3c-.3-.4 0-.5.1-.7l.4-.5c.1-.2.1-.3 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1.1 2.7c.1.2 1.9 2.9 4.6 4 .6.3 1.1.5 1.5.6.6.2 1.2.2 1.7.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.6-.3Z"/>
                </svg>
                Quiero cobrar mi CAE
              </a>
              <div className="ie-cta-contact">
                📞 <a href="tel:+34640388483" style={{ color: "inherit", textDecoration: "none" }}>640 388 483</a>
                {" · "}
                <a href="mailto:info@impulsaenergia.es" style={{ color: "inherit", textDecoration: "none" }}>info@impulsaenergia.es</a>
              </div>
            </div>
          </div>
        </div>

        {/* ===== Cómo funciona ===== */}
        <div className="ie-card" style={{ marginTop: 24 }}>
          <h2 style={{ marginBottom: 18 }}>¿Cómo funciona? Así de simple</h2>
          <div className="ie-steps">
            {[
              ["1", "Compras tu eléctrico", "Sustituyes tu coche de gasolina o diésel por un vehículo 100% eléctrico nuevo.", BRAND.yellow, BRAND.black],
              ["2", "Nos pasas los papeles", "Ficha técnica del coche antiguo y del nuevo, factura de compra y poco más.", BRAND.yellow, BRAND.black],
              ["3", "Tramitamos tu CAE", "Calculamos el ahorro con la metodología oficial del MITECO y presentamos el expediente.", BRAND.lime, BRAND.black],
              ["4", "Cobras", "El ahorro certificado se vende en el mercado CAE y recibes tu ingreso en un pago único.", BRAND.titanite, BRAND.white],
            ].map(([n, t, d, bg, fg]) => (
              <div key={n}>
                <div className="ie-step-n" style={{ background: bg, color: fg }}>{n}</div>
                <div className="ie-step-t">{t}</div>
                <div className="ie-step-d">{d}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="ie-legal">
          * Estimación orientativa sin valor contractual, calculada a 0,14 €/kWh, precio medio de
          expedientes CAE gestionados. El CAE no tiene precio regulado; el importe final depende de
          la verificación del expediente, la documentación aportada y las condiciones de mercado en
          el momento de la venta. Actuación amparada en la ficha estandarizada TRA050 — sustitución
          de vehículo de combustión por vehículo eléctrico (RD 36/2023 y Orden TED/815/2023).
          Compatible con el Plan Auto. Impulsa Energía · Impulsa Servicios Energéticos, S.L.
        </p>
      </div>
    </div>
  );
}
