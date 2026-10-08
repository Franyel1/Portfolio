'use client';

import { useId } from 'react';

/** A local vector glass study stays visible while WebGL starts or is unavailable. */
export default function GlassLoopFallback() {
  const id = useId().replaceAll(':', '');
  const paint = (name: string) => `url(#${id}-${name})`;
  return (
    <svg className="glass-loop-fallback" viewBox="0 0 500 500" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-body`} x1="0.1" y1="0" x2="0.9" y2="1">
          <stop stopColor="#bde4f4" />
          <stop offset="0.2" stopColor="#72a7c8" />
          <stop offset="0.48" stopColor="#436e98" />
          <stop offset="0.7" stopColor="#91c2dd" />
          <stop offset="1" stopColor="#315479" />
        </linearGradient>
        <linearGradient id={`${id}-rim`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#f4fdff" stopOpacity="0.8" />
          <stop offset="0.32" stopColor="#add9ef" stopOpacity="0.1" />
          <stop offset="0.65" stopColor="#1e4166" stopOpacity="0.7" />
          <stop offset="1" stopColor="#d0edfa" stopOpacity="0.8" />
        </linearGradient>
        <radialGradient id={`${id}-volume`} cx="0.3" cy="0.2" r="0.85">
          <stop stopColor="#d0ebf8" stopOpacity="0.7" />
          <stop offset="0.36" stopColor="#b4dcec" stopOpacity="0" />
          <stop offset="0.72" stopColor="#163658" stopOpacity="0.4" />
          <stop offset="1" stopColor="#80b2d0" stopOpacity="0.15" />
        </radialGradient>
        <linearGradient id={`${id}-roundness`} x1="0" y1="0" x2="0.9" y2="1">
          <stop stopColor="#d3edf9" stopOpacity="0.55" />
          <stop offset="0.35" stopColor="#89b9d4" stopOpacity="0.2" />
          <stop offset="0.75" stopColor="#bedfec" stopOpacity="0.45" />
          <stop offset="1" stopColor="#6298bc" stopOpacity="0.3" />
        </linearGradient>
        <filter id={`${id}-soft`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        <filter id={`${id}-glint`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2" />
        </filter>
      </defs>
      <g fill="none">
        <circle cx="250" cy="250" r="156" stroke={paint('body')} strokeWidth="98" />
        <circle cx="250" cy="250" r="156" stroke={paint('volume')} strokeWidth="91" />
        <circle
          cx="250"
          cy="250"
          r="156"
          stroke={paint('roundness')}
          strokeWidth="54"
          filter={paint('soft')}
        />
        <circle cx="250" cy="250" r="203" stroke={paint('rim')} strokeWidth="2" />
        <circle cx="250" cy="250" r="108" stroke={paint('rim')} strokeWidth="4" />
        <path
          d="M119 145C73 199 83 292 119 341"
          stroke="#e3f6ff"
          strokeWidth="15"
          strokeLinecap="round"
          opacity="0.48"
          filter={paint('soft')}
        />
        <path
          d="M149 112C175 90 207 81 237 83"
          stroke="#fffaf0"
          strokeWidth="8"
          strokeLinecap="round"
          opacity="0.8"
          filter={paint('glint')}
        />
        <path
          d="M355 151C388 188 396 249 380 286"
          stroke="#c0ecff"
          strokeWidth="12"
          strokeLinecap="round"
          opacity="0.6"
          filter={paint('soft')}
        />
        <path
          d="M175 377C213 401 267 407 306 388"
          stroke="#c7e9f6"
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.55"
          filter={paint('glint')}
        />
      </g>
    </svg>
  );
}
