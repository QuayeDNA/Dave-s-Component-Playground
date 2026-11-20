import './IrregularLoader.css';

const IrregularLoader = () => (
  <div className="irregular-loader" role="status" aria-live="polite">
    <div className="irregular-loader-coin">
      <svg className="irregular-loader-hex" viewBox="0 0 100 100" aria-hidden="true">
        <defs>
          <linearGradient id="irregularHexFill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#a8d8f0" />
            <stop offset="0.55" stopColor="#7eb8e8" />
            <stop offset="1" stopColor="#c8b8f0" />
          </linearGradient>
        </defs>
        <polygon points="50 6 88 27 88 73 50 94 12 73 12 27" fill="url(#irregularHexFill)" />
        <polygon
          points="50 18 78 33 78 67 50 82 22 67 22 33"
          fill="none"
          stroke="rgba(7, 16, 26, 0.38)"
          strokeWidth="2"
        />
      </svg>
    </div>
    <div className="irregular-loader-label">
      <span className="irregular-loader-eyebrow">GEOMETRIA // HEXAGON ARCHIVE</span>
      <span className="irregular-loader-status">Restoring archive record…</span>
    </div>
  </div>
);

export default IrregularLoader;
