import { useEffect, useRef } from "react";

// Leaflet CSS must be in your index.html or global CSS:
// <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
// npm install leaflet @types/leaflet

import type { Map as LeafletMap } from "leaflet";

interface ContactMapProps {
  lat?: number;
  lng?: number;
  zoom?: number;
}

export default function ContactMap({
  lat = 25.2048,
  lng = 55.2708,
  zoom = 13,
}: ContactMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Dynamically import leaflet to avoid SSR issues
    import("leaflet").then((L) => {
      // Fix default icon paths broken by bundlers
      delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!, {
        center: [lat, lng],
        zoom,
        zoomControl: true,
        scrollWheelZoom: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      // Custom cyan marker
      const customIcon = L.divIcon({
        className: "",
        html: `<div style="
          width:32px;height:32px;
          background:linear-gradient(135deg,#38bdf8,#06b6d4);
          border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);
          border:3px solid white;
          box-shadow:0 4px 12px rgba(56,189,248,0.5);
        "></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      L.marker([lat, lng], { icon: customIcon })
        .addTo(map)
        .bindPopup(
          `<div style="font-family:'Nunito Sans',sans-serif;font-size:13px;font-weight:600;color:#1a2e3b">
            Level 5, 221 Business Tower<br/>
            Sheikh Zayed Road, Dubai, UAE
          </div>`
        );

      mapInstanceRef.current = map;
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lng, zoom]);

  return (
    <div
      ref={mapRef}
      className="w-full h-full rounded-2xl overflow-hidden"
      style={{ minHeight: 460 }}
    />
  );
}