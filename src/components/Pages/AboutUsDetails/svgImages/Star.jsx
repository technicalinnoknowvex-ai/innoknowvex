import React, { forwardRef } from "react";

const StarIcon = forwardRef(({ className, width = 50, height = 50, fill = "#FF6432", ...props }, ref) => {
  return (
    <svg
      ref={ref}
      className={className}
      width={width}
      height={height}
      viewBox="0 0 42 45"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M20.2936 0.533388C20.3719 -0.177796 21.3282 -0.177796 21.4064 0.533388L22.0624 6.49958C22.9095 14.2035 28.5381 20.2775 35.677 21.1916L41.2057 21.8996C41.8648 21.984 41.8648 23.016 41.2057 23.1005L35.677 23.8084C28.5381 24.7225 22.9095 30.7965 22.0624 38.5004L21.4064 44.4665C21.3282 45.1778 20.3719 45.1778 20.2936 44.4665L19.6376 38.5004C18.7905 30.7965 13.162 24.7225 6.02295 23.8084L0.494273 23.1005C-0.164758 23.016 -0.164758 21.984 0.494273 21.8996L6.02295 21.1916C13.162 20.2775 18.7905 14.2035 19.6376 6.49958L20.2936 0.533388Z"
        fill={fill}
      />
    </svg>
  );
});

StarIcon.displayName = "StarIcon";

export default StarIcon;
