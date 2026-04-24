export function generateClampCSS(minWidth, maxWidth, minFontSize, maxFontSize) {
  const n = maxFontSize - minFontSize;
  const m = maxWidth / 16 - minWidth / 16;
  const slope = n / m;

  const x = minWidth / 16;
  const yInter = -x * slope + minFontSize;

  return {
    slope: slope,
    css: `font-size: clamp(${minFontSize}rem, ${yInter}rem + ${
      slope * 100
    }vw, ${maxFontSize}rem) !important;`,
  };
}

// Usage example:
const result = generateClampCSS(1536, 2560, 1.2, 2.2); //  (minWidth, maxWidth, minSize, maxSize) -> minWidth, maxWidth : screen sizes in px.   minSize, mazSize : element size in rem
console.log(result.css);
