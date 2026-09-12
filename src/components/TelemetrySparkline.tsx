import React from 'react';

interface TelemetrySparklineProps {
  data: number[];
  color?: string;
  height?: number;
  width?: number;
}

export const TelemetrySparkline: React.FC<TelemetrySparklineProps> = ({
  data,
  color = '#00f0ff',
  height = 24,
  width = 72
}) => {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data
    .map((val, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 4) - 2;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  const fillPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      {/* Area fill */}
      <polygon points={fillPoints} fill={`url(#grad-${color.replace('#', '')})`} />
      {/* Line */}
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
      {/* End glowing point */}
      {data.length > 0 && (
        <circle
          cx={width}
          cy={height - ((data[data.length - 1] - min) / range) * (height - 4) - 2}
          r="2"
          fill={color}
          className="animate-pulse"
        />
      )}
    </svg>
  );
};
