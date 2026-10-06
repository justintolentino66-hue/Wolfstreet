// Shared auth page background: grey base + mandala watermark + dark right panels

export function AuthBackground({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative min-h-screen overflow-hidden flex items-center justify-center"
      style={{ backgroundColor: "#ccccd4" }}
    >
      {/* Mandala watermark — centred in the grey zone */}
      <div className="absolute inset-0 flex items-center justify-start pointer-events-none select-none"
           style={{ paddingLeft: "8%" }}>
        <MandalaSVG />
      </div>

      {/* Dark geometric right-side panels */}
      <DarkPanels />

      {/* Page content */}
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}

/* ── Mandala ──────────────────────────────────────────────────────────────── */
function MandalaSVG() {
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: 420, height: 420, opacity: 0.92 }}
    >
      {/* Outer ring – 8 large petals */}
      {Array.from({ length: 8 }, (_, i) => (
        <g key={`a${i}`} transform={`rotate(${i * 45} 200 200)`}>
          <path
            d="M200,200 C228,155 238,105 200,65 C162,105 172,155 200,200"
            fill="rgba(195,135,150,0.18)"
          />
        </g>
      ))}
      {/* Outer ring – 8 petals offset 22.5° */}
      {Array.from({ length: 8 }, (_, i) => (
        <g key={`b${i}`} transform={`rotate(${i * 45 + 22.5} 200 200)`}>
          <path
            d="M200,200 C222,162 228,125 200,90 C172,125 178,162 200,200"
            fill="rgba(195,135,150,0.14)"
          />
        </g>
      ))}
      <circle cx="200" cy="200" r="135" stroke="rgba(195,135,150,0.14)" strokeWidth="1" />

      {/* Mid ring – 8 petals */}
      {Array.from({ length: 8 }, (_, i) => (
        <g key={`c${i}`} transform={`rotate(${i * 45} 200 200)`}>
          <path
            d="M200,200 C218,167 224,140 200,112 C176,140 182,167 200,200"
            fill="rgba(195,135,150,0.22)"
          />
        </g>
      ))}
      <circle cx="200" cy="200" r="88" stroke="rgba(195,135,150,0.18)" strokeWidth="1" />

      {/* Inner ring – 6 petals */}
      {Array.from({ length: 6 }, (_, i) => (
        <g key={`d${i}`} transform={`rotate(${i * 60} 200 200)`}>
          <path
            d="M200,200 C212,176 216,158 200,140 C184,158 188,176 200,200"
            fill="rgba(195,135,150,0.3)"
          />
        </g>
      ))}
      <circle cx="200" cy="200" r="55" stroke="rgba(195,135,150,0.22)" strokeWidth="1" />

      {/* Dot ring */}
      {Array.from({ length: 12 }, (_, i) => {
        const a = ((i * 30 - 90) * Math.PI) / 180;
        return (
          <circle
            key={`dot${i}`}
            cx={200 + 35 * Math.cos(a)}
            cy={200 + 35 * Math.sin(a)}
            r="2.5"
            fill="rgba(195,135,150,0.35)"
          />
        );
      })}

      {/* Centre */}
      <circle cx="200" cy="200" r="18" fill="rgba(195,135,150,0.28)" />
      <circle cx="200" cy="200" r="8"  fill="rgba(195,135,150,0.42)" />
      <circle cx="200" cy="200" r="3"  fill="rgba(195,135,150,0.6)"  />
    </svg>
  );
}

/* ── Dark right-side panels ───────────────────────────────────────────────── */
function DarkPanels() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Deepest / rightmost black fill */}
      <div
        style={{
          position: "absolute", inset: 0,
          background: "#0e0e14",
          clipPath: "polygon(60% 0%, 100% 0%, 100% 100%, 50% 100%)",
        }}
      />
      {/* Mid dark-grey layer */}
      <div
        style={{
          position: "absolute", inset: 0,
          background: "#1b1b24",
          clipPath:
            "polygon(67% 0%, 100% 0%, 100% 70%, 83% 84%, 60% 52%, 70% 22%)",
        }}
      />
      {/* Top-right lighter accent */}
      <div
        style={{
          position: "absolute", inset: 0,
          background: "#26262f",
          clipPath: "polygon(77% 0%, 100% 0%, 100% 40%, 87% 44%)",
        }}
      />
    </div>
  );
}
