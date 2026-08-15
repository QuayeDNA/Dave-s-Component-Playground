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
  .astatic{position:relative;display:inline-block;}
  .astatic-t,.astatic-g,.astatic-o,.astatic-n{white-space:inherit;line-height:inherit;}
  .astatic-g,.astatic-o,.astatic-n{position:absolute;top:0;left:0;right:0;pointer-events:none;user-select:none;text-align:inherit;}
  .astatic-t{display:inline-block;animation:astatic-kb 9s infinite;}
  .astatic-g{color:${G};opacity:0;animation:astatic-kg 9s infinite;}
  .astatic-o{color:${WARN};opacity:0;animation:astatic-ko 9s infinite;}
  .astatic-n{-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size:150px 150px;filter:brightness(2) contrast(1.3);opacity:0;animation:astatic-kn 9s infinite;}
  @keyframes astatic-kb{
    0%,86%,96%,100%{opacity:1;transform:translateX(0);}
    87%{opacity:.5;transform:translateX(2px);}
    88%{opacity:.92;transform:translateX(-1px);}
    89%{opacity:.35;transform:translateX(3px);}
    90%{opacity:.9;transform:translateX(-2px);}
    91%{opacity:.6;transform:translateX(1px);}
    92%{opacity:1;transform:translateX(-1px);}
    93%{opacity:.4;transform:translateX(2px);}
    94%{opacity:.85;transform:translateX(-2px);}
    95%{opacity:.65;transform:translateX(1px);}}
  @keyframes astatic-kg{
    0%,86%{opacity:0;transform:translateX(0);}
    87%{opacity:.75;transform:translateX(-3px);}
    88%{opacity:.2;transform:translateX(4px);}
    89%{opacity:.9;transform:translateX(-4px);}
    90%{opacity:.3;transform:translateX(3px);}
    91%{opacity:.65;transform:translateX(-2px);}
    92%{opacity:.15;transform:translateX(4px);}
    93%{opacity:.8;transform:translateX(-3px);}
    94%{opacity:.4;transform:translateX(2px);}
    95%{opacity:.55;transform:translateX(-1px);}
    96%,100%{opacity:0;transform:translateX(0);}}
  @keyframes astatic-ko{
    0%,89%{opacity:0;transform:translateX(0);}
    90%{opacity:.7;transform:translateX(3px);}
    91%{opacity:.25;transform:translateX(-4px);}
    92%{opacity:.85;transform:translateX(2px);}
    93%{opacity:.3;transform:translateX(-3px);}
    94%{opacity:.6;transform:translateX(4px);}
    95%,100%{opacity:0;transform:translateX(0);}}
  @keyframes astatic-kn{
    0%,86%{opacity:0;}
    87%{opacity:.3;}
    88%{opacity:.08;}
    89%{opacity:.36;}
    90%{opacity:.12;}
    91%{opacity:.32;}
    92%{opacity:.06;}
    93%{opacity:.26;}
    94%{opacity:.1;}
    95%{opacity:.2;}
    96%,100%{opacity:0;}}
  @media (prefers-reduced-motion:reduce){
    .astatic-t,.astatic-g,.astatic-o,.astatic-n{animation:none !important;}
    .astatic-t{opacity:1 !important;}
    .astatic-g,.astatic-o,.astatic-n{opacity:0 !important;}}
  .abar-track{background:${BORD};height:6px;width:100%;position:relative;overflow:hidden;}
  .abar-fill{height:100%;position:absolute;top:0;left:0;transition:width .8s ease;}
  .abar-fill::after{content:'';position:absolute;inset:0;
    background:repeating-linear-gradient(90deg,transparent,transparent 6px,rgba(0,0,0,.25) 6px,rgba(0,0,0,.25) 7px);}
  .ascan::before{content:'';position:fixed;inset:0;pointer-events:none;z-index:98;
    background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.045) 3px,rgba(0,0,0,0.045) 4px);}
`;

export const TITLE = {
  name: 'THE LONG ROAD HOME',
  subtitle: 'A father will walk across a fallen Ghana to bring his children home.',
  romanised: 'ABƆDE',
  translation: 'AKAN / TWI: HOMELAND',
  operation: 'OPERATION: HOMELAND · GAME 02 OF 03',
  draft: '0.3',
};
