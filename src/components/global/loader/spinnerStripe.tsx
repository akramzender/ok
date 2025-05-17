import React from "react";

interface Props {
  color?: string; // Allow users to customize the spinner color
}

export const Spinners = ({ color = "#00a87e" }: Props) => {
  return (
    <div role="status" className="flex items-center justify-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 200"
        className="h-24 w-24"
      >
        {/* Circle 1 */}
        <circle
          fill={color}
          stroke={color}
          strokeWidth="10"
          r="10"
          cx="40"
          cy="65"
        >
          <animate
            attributeName="cy"
            calcMode="spline"
            dur="1.5s"
            values="65;135;65"
            keySplines=".5 0 .5 1;.5 0 .5 1"
            repeatCount="indefinite"
            begin="-.4s"
          />
        </circle>
        {/* Circle 2 */}
        <circle
          fill={color}
          stroke={color}
          strokeWidth="10"
          r="10"
          cx="100"
          cy="65"
        >
          <animate
            attributeName="cy"
            calcMode="spline"
            dur="1.5s"
            values="65;135;65"
            keySplines=".5 0 .5 1;.5 0 .5 1"
            repeatCount="indefinite"
            begin="-.2s"
          />
        </circle>
        {/* Circle 3 */}
        <circle
          fill={color}
          stroke={color}
          strokeWidth="10"
          r="10"
          cx="160"
          cy="65"
        >
          <animate
            attributeName="cy"
            calcMode="spline"
            dur="1.5s"
            values="65;135;65"
            keySplines=".5 0 .5 1;.5 0 .5 1"
            repeatCount="indefinite"
            begin="0s"
          />
        </circle>
      </svg>
    </div>
  );
};