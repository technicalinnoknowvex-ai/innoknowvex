import style from "../styles/aboutUs.module.scss";

export default function Ellipse1() {
  return (
    <svg
      className={style.ellipse1}
      width="600"
      height="600"
      viewBox="0 0 767 767"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_f_37_12)">
        <circle cx="383.5" cy="383.5" r="138.5" fill="#FA9805" fillOpacity="0.74" />
      </g>
      <defs>
        <filter
          id="filter0_f_37_12"
          x="0.566696"
          y="0.566696"
          width="765.867"
          height="765.867"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="122.217" result="effect1_foregroundBlur_37_12" />
        </filter>
      </defs>
    </svg>
  );
}
