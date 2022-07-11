import React from 'react';

export default function H4(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" className="card" face="4H" height="3.5in" preserveAspectRatio="none" viewBox="-120 -168 240 336" width="2.5in" {...props}>
      <defs>
        <symbol id="SH4" viewBox="-600 -600 1200 1200" preserveAspectRatio="xMinYMid">
          <path d="M0 -300C0 -400 100 -500 200 -500C300 -500 400 -400 400 -250C400 0 0 400 0 500C0 400 -400 0 -400 -250C-400 -400 -300 -500 -200 -500C-100 -500 0 -400 -0 -300Z" fill="red" />
        </symbol>
        <symbol id="VH4" viewBox="-500 -500 1000 1000" preserveAspectRatio="xMinYMid">
          <path d="M50 460L250 460M150 460L150 -460L-300 175L-300 200L270 200" stroke="red" strokeWidth={80} strokeLinecap="square" strokeMiterlimit="1.5" fill="none" />
        </symbol>
      </defs>
      <rect width={239} height={335} x="-119.5" y="-167.5" rx={12} ry={12} fill="white" stroke="black" />
      <use xlinkHref="#VH4" height={70} width={70} x={-122} y={-156} />
      <use xlinkHref="#SH4" height="58.558" width="58.558" x="-116.279" y={-81} />
      <use xlinkHref="#SH4" height={40} width={40} x="-59.668" y="-107.668" />
      <use xlinkHref="#SH4" height={40} width={40} x="19.668" y="-107.668" />
      <g transform="rotate(180)">
        <use xlinkHref="#VH4" height={70} width={70} x={-122} y={-156} />
        <use xlinkHref="#SH4" height="58.558" width="58.558" x="-116.279" y={-81} />
        <use xlinkHref="#SH4" height={40} width={40} x="-59.668" y="-107.668" />
        <use xlinkHref="#SH4" height={40} width={40} x="19.668" y="-107.668" />
      </g>
    </svg>
  );
}
