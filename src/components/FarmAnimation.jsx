import { useEffect, useState } from 'react'

function FarmAnimation() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={`farm-animation ${loaded ? 'farm-loaded' : ''}`} aria-hidden="true">
      <svg
        viewBox="0 0 600 520"
        xmlns="http://www.w3.org/2000/svg"
        className="farm-svg"
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="15" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="glow-small" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <linearGradient id="leafGradMain" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="50%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#16a34a" />
          </linearGradient>

          <linearGradient id="leafGradSecondary" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#86efac" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>

          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Center glowing orb */}
        <circle cx="300" cy="260" r="180" fill="url(#centerGlow)" className="center-orb" />

        {/* Floating background particles */}
        {[...Array(15)].map((_, i) => (
          <circle
            key={`particle-bg-${i}`}
            cx={Math.random() * 600}
            cy={Math.random() * 520}
            r={Math.random() * 4 + 2}
            fill="#a7f3d0"
            opacity="0.3"
            className="floating-particle"
            style={{ animationDelay: `${Math.random() * 5}s`, animationDuration: `${5 + Math.random() * 5}s` }}
          />
        ))}

        {/* Swirling smaller leaves */}
        {[...Array(8)].map((_, i) => {
          const angle = (i * 45) * Math.PI / 180;
          const radius = 150;
          const cx = 300 + Math.cos(angle) * radius;
          const cy = 260 + Math.sin(angle) * radius;
          return (
            <g key={`swirl-leaf-${i}`} className="swirl-leaf-container" style={{ transformOrigin: '300px 260px', animationDelay: `${i * -1}s` }}>
              <path
                d={`M${cx} ${cy} Q${cx - 15} ${cy - 20} ${cx} ${cy - 40} Q${cx + 15} ${cy - 20} ${cx} ${cy}Z`}
                fill={i % 2 === 0 ? "url(#leafGradMain)" : "url(#leafGradSecondary)"}
                opacity="0.8"
                filter="url(#glow-small)"
                transform={`rotate(${i * 45} ${cx} ${cy})`}
                className="swirl-leaf-inner"
              />
            </g>
          )
        })}

        {/* Central Glowing Plant/Leaf structure */}
        <g className="main-plant" filter="url(#glow)">
          {/* Stem */}
          <path
            d="M300 450 Q300 350 300 250"
            stroke="url(#leafGradMain)"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />
          {/* Central big leaf */}
          <path
            d="M300 250 Q240 180 300 100 Q360 180 300 250Z"
            fill="url(#leafGradMain)"
            className="pulse-leaf"
          />
          {/* Left leaf */}
          <path
            d="M300 320 Q200 300 150 220 Q220 200 300 320Z"
            fill="url(#leafGradSecondary)"
            className="pulse-leaf-left"
          />
          {/* Right leaf */}
          <path
            d="M300 360 Q400 320 450 240 Q380 230 300 360Z"
            fill="url(#leafGradSecondary)"
            className="pulse-leaf-right"
          />
        </g>

        {/* Foreground glowing orbs */}
        {[...Array(6)].map((_, i) => (
          <circle
            key={`orb-fg-${i}`}
            cx={100 + Math.random() * 400}
            cy={100 + Math.random() * 320}
            r={Math.random() * 8 + 4}
            fill="#86efac"
            filter="url(#glow-small)"
            className="glowing-orb"
            style={{ animationDelay: `${Math.random() * 3}s` }}
          />
        ))}

      </svg>
    </div>
  )
}

export default FarmAnimation
