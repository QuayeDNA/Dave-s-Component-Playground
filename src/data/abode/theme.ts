export const G    = '#7ec87e'; // survival green
export const WARN = '#c8522a'; // blood orange / danger
export const PALE = '#c8b89a'; // aged paper
export const BG   = '#0f0d0a';
export const SURF = '#1a1610';
export const BORD = '#3d3020';

export const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Special+Elite&family=Source+Serif+4:ital,wght@0,300;0,400;0,600;1,300;1,400&family=VT323&display=swap');`;

export const CSS = `
  .ag::after{content:'';position:fixed;inset:0;pointer-events:none;z-index:100;opacity:.035;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size:200px 200px;}
  .at{font-family:'Special Elite',cursive;}
  .ab{font-family:'Source Serif 4',Georgia,serif;}
  .am{font-family:'VT323',monospace;}
  .astamp{font-family:'Special Elite',cursive;color:#8b3a1a;border:3px solid #8b3a1a;opacity:.6;
    transform:rotate(-4deg);display:inline-block;padding:.2rem .6rem;letter-spacing:.15em;
    text-transform:uppercase;font-size:.75rem;pointer-events:none;user-select:none;}
  @keyframes flicker{0%,100%{opacity:1}92%{opacity:1}93%{opacity:.4}94%{opacity:1}96%{opacity:.6}97%{opacity:1}}
  .afl{animation:flicker 8s infinite;}
  .abar-track{background:${BORD};height:6px;width:100%;position:relative;overflow:hidden;}
  .abar-fill{height:100%;position:absolute;top:0;left:0;transition:width .8s ease;}
  .abar-fill::after{content:'';position:absolute;inset:0;
    background:repeating-linear-gradient(90deg,transparent,transparent 6px,rgba(0,0,0,.25) 6px,rgba(0,0,0,.25) 7px);}
  .ascan::before{content:'';position:fixed;inset:0;pointer-events:none;z-index:98;
    background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.045) 3px,rgba(0,0,0,0.045) 4px);}
`;

export const TITLE = {
  name: 'Abɔde',
  romanised: 'ABƆDE',
  translation: 'AKAN / TWI: HOMELAND',
  operation: 'OPERATION: HOMELAND · GAME 02 OF 03',
  draft: '0.3',
};
