import L from "leaflet";

/**
 * Creates an SVG pie-chart DivIcon for map markers.
 * Green = deployed, Blue = stored, center shows total count.
 */
export function createPieIcon(
  deployed: number,
  stored: number,
  size: number = 40
): L.DivIcon {
  const total = deployed + stored;
  if (total === 0) {
    return L.divIcon({ className: "pie-marker", iconSize: [size, size] });
  }

  const half = size / 2;
  const r = half - 2; // leave 2px padding
  const deployedAngle = (deployed / total) * 360;

  // Colors matching the dashboard
  const deployedColor = "#22c55e"; // green-500
  const storedColor = "#3b82f6";   // blue-500

  let slices = "";
  if (deployed === total) {
    // All deployed
    slices = `<circle cx="${half}" cy="${half}" r="${r}" fill="${deployedColor}" fill-opacity="0.85" stroke="${deployedColor}" stroke-width="1.5"/>`;
  } else if (stored === total) {
    // All stored
    slices = `<circle cx="${half}" cy="${half}" r="${r}" fill="${storedColor}" fill-opacity="0.85" stroke="${storedColor}" stroke-width="1.5"/>`;
  } else {
    // Pie chart with two slices
    const startAngle = -90; // start from top
    const endAngle1 = startAngle + deployedAngle;

    const path1 = describeArc(half, half, r, startAngle, endAngle1);
    const path2 = describeArc(half, half, r, endAngle1, startAngle + 360);

    slices = `
      <path d="${path1} L${half},${half} Z" fill="${deployedColor}" fill-opacity="0.85" stroke="white" stroke-width="0.5"/>
      <path d="${path2} L${half},${half} Z" fill="${storedColor}" fill-opacity="0.85" stroke="white" stroke-width="0.5"/>
    `;
  }

  // Font size scales with icon size
  const fontSize = Math.max(9, Math.min(14, size * 0.3));
  const countText = total >= 1000 ? `${(total / 1000).toFixed(1)}k` : total.toString();

  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      ${slices}
      <circle cx="${half}" cy="${half}" r="${Math.max(8, r * 0.45)}" fill="white" fill-opacity="0.95"/>
      <text x="${half}" y="${half}" text-anchor="middle" dominant-baseline="central"
            font-size="${fontSize}" font-weight="700" fill="#1f2937" font-family="Arial, sans-serif">
        ${countText}
      </text>
    </svg>
  `;

  return L.divIcon({
    className: "pie-marker",
    html: svg,
    iconSize: [size, size],
    iconAnchor: [half, half],
    popupAnchor: [0, -half],
  });
}

/**
 * Creates a cluster icon with pie chart showing aggregate deployed/stored.
 */
export function createClusterIcon(
  deployed: number,
  stored: number,
  childCount: number
): L.DivIcon {
  // Scale size based on child count
  const size = Math.min(70, Math.max(40, 35 + Math.log2(childCount + 1) * 6));
  return createPieIcon(deployed, stored, size);
}

// ── SVG arc helper ───────────────────────────────────────────────────

function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angleDeg: number
): { x: number; y: number } {
  const rad = (Math.PI / 180) * angleDeg;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
): string {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}
