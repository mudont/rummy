import React from 'react';

export default function SA(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" className="card" face="AS" height="3.5in" preserveAspectRatio="none" viewBox="-120 -168 240 336" width="2.5in" {...props}>
      <defs>
        <symbol id="VSA" viewBox="-500 -500 1000 1000" preserveAspectRatio="xMinYMid">
          <path d="M-270 460L-110 460M-200 450L0 -460L200 450M110 460L270 460M-120 130L120 130" stroke="black" strokeWidth={80} strokeLinecap="square" strokeMiterlimit="1.5" fill="none" />
        </symbol>
        <symbol id="SSA" viewBox="-600 -600 1200 1200" preserveAspectRatio="xMinYMid">
          <path d="M0 -500C100 -250 355 -100 355 185A150 150 0 0 1 55 185A10 10 0 0 0 35 185C35 385 85 400 130 500L-130 500C-85 400 -35 385 -35 185A10 10 0 0 0 -55 185A150 150 0 0 1 -355 185C-355 -100 -100 -250 0 -500Z" />
        </symbol>
      </defs>
      <rect width={239} height={335} x="-119.5" y="-167.5" rx={12} ry={12} fill="white" stroke="black" />
      <use xlinkHref="#SSA" fill="black" height={104} width={104} x={-52} y={-52} stroke="black" strokeWidth={100} strokeDasharray="100,100" strokeLinecap="round" />
      <use xlinkHref="#SSA" fill="black" height={104} width={104} x={-52} y={-52} stroke="white" strokeWidth={50} />
      <use xlinkHref="#SSA" fill="black" height={104} width={104} x={-52} y={-52} />
      <path transform="translate(0,-10)rotate(45)scale(1.075)translate(-14,-14)" fill="white" stroke="none" d="M4,4h7v7h-7M5,5v5h5v-5M12,4h5v3h-1v2h1v2h-1v-2h-1v2h-1v-2h-1v2h-1v-2h1v-1h-1M13,5v1h2v1h1v-2M18,4h7v7h-7M19,5v5h5v-5M6,6h3v3h-3M20,6h3v3h-3M4,12h2v1h2v-1h3v1h-1v1h3v-1h2v-1h1v1h2v3h1v-4h1v1h1v-1h4v1h-1v1h1v1h-1v1h1v1h-2v1h-2v-1h2v-2h-2v1h-2v1h-3v1h3v2h1v-1h1v1h-1v2h-1v2h1v-1h1v-2h1v-1h1v-1h1v-1h1v2h-1v1h1v1h-2v1h-1v2h-6v-1h-1v1h-1v-1h-1v1h-1v-2h1v-2h-1v-2h1v-1h-1v-1h-2v-1h1v-1h-3v1h1v1h-1v-1h-3v1h-1v-3h2v-1h-2M8,13v1h1v-1M15,13v2h1v1h1v-2h-1v-1M21,13v1h2v-1M6,14v1h2v-1M13,14v1h-1v2h1v-1h2v-1h-1v-1M20,14v1h1v-1M23,14v1h1v-1M15,18v1h1v-1M4,18h7v7h-7M5,19v5h5v-5M13,19v2h1v1h1v-1h1v3h1v-3h2v-1h-1v-1h-1v1h-2v-1M6,20h3v3h-3M14,23v1h1v-1M24,23h1v2h-2v-1h1" />
      <text fontSize={15} fontFamily="Bariol" fill="black" textAnchor="middle" y="77.5">www.me.uk</text>
      <text fontSize={15} fontFamily="Bariol" fill="black" textAnchor="middle" y="92.5">/cards/</text>
      <use xlinkHref="#VSA" height={70} width={70} x={-122} y={-156} />
      <use xlinkHref="#SSA" fill="black" height="58.558" width="58.558" x="-116.279" y={-81} />
      <g transform="rotate(180)">
        <use xlinkHref="#VSA" height={70} width={70} x={-122} y={-156} />
        <use xlinkHref="#SSA" fill="black" height="58.558" width="58.558" x="-116.279" y={-81} />
      </g>
    </svg>
  );
}
