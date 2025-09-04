export function generateClampCSS(minWidth, maxWidth, minFontSize, maxFontSize) {
    const n = maxFontSize - minFontSize;
    const m = (maxWidth / 16) - (minWidth / 16);
    const slope = n / m;
    
    const x = minWidth / 16;
    const yInter = (-x * slope + minFontSize);
    
    return {
        slope: slope,
        css: `font-size: clamp(${minFontSize}rem, ${yInter}rem + ${slope * 100}vw, ${maxFontSize}rem) !important;`
    };
}

// Usage example:
const result = generateClampCSS(320, 640, 1, 5);
console.log(result.css);


/*

320px

640px

1rem

5rem

320px -> 640px

1rem -> 5rem

rem->



*/