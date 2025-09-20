// Utility to fix Leaflet marker icons in Next.js
import L from 'leaflet';

export const fixLeafletIcons = () => {
  // Fix for default markers in react-leaflet with Next.js
  const DefaultIcon = L.Icon.Default;
  
  // Remove the default _getIconUrl method
  delete (DefaultIcon.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
  
  // Set the icon URLs to use local files from public directory
  DefaultIcon.mergeOptions({
    iconRetinaUrl: '/marker-icon-2x.png',
    iconUrl: '/marker-icon.png',
    shadowUrl: '/marker-shadow.png',
  });
};

// Custom icon configurations for different marker types
export const createCustomIcon = (color: string, size: 'small' | 'medium' | 'large' = 'medium') => {
  const iconSizes = {
    small: [20, 32],
    medium: [25, 41],
    large: [30, 49]
  } as const;

  const [width, height] = iconSizes[size];

  return L.divIcon({
    className: `custom-marker-${color}`,
    html: `
      <div style="
        background-color: ${color};
        width: ${width}px;
        height: ${height}px;
        border-radius: 50% 50% 50% 0;
        border: 3px solid white;
        box-shadow: 0 3px 6px rgba(0,0,0,0.3);
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          transform: rotate(45deg);
          color: white;
          font-weight: bold;
          font-size: ${size === 'small' ? '10px' : size === 'medium' ? '12px' : '14px'};
        ">●</div>
      </div>
    `,
    iconSize: [width, height],
    iconAnchor: [width / 2, height],
    popupAnchor: [0, -height],
  });
};