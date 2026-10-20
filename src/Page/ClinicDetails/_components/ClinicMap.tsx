import { useEffect, useRef } from "react";
import type { Map as LeafletMap, Marker as LeafletMarker } from "leaflet";

interface ClinicMapProps {
  lat?: string | number;
  lng?: string | number;
  clinicName?: string;
  address?: string;
}

export default function ClinicMap({
  lat,
  lng,
  clinicName = "Clinic Location",
  address = "",
}: ClinicMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<LeafletMarker | null>(null);

  const parseCoord = (val?: string | number, fallback = 0): number => {
    if (val === undefined || val === null) return fallback;
    const num = typeof val === "number" ? val : parseFloat(String(val));
    return Number.isFinite(num) ? num : fallback;
  };

  const latitude = parseCoord(lat, 23.8103);
  const longitude = parseCoord(lng, 90.4125);

  useEffect(() => {
    if (!mapRef.current) return;

    import("leaflet").then((L) => {
      delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const customIcon = L.divIcon({
        className: "custom-clinic-pin",
        html: `<div style="
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #38bdf8, #0ea5e9);
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 3px solid white;
          box-shadow: 0 4px 14px rgba(14, 165, 233, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            width: 10px;
            height: 10px;
            background: white;
            border-radius: 50%;
            transform: rotate(45deg);
          "></div>
        </div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36],
      });

      if (!mapRef.current) return;

      if (!mapInstanceRef.current) {
        const map = L.map(mapRef.current, {
          center: [latitude, longitude],
          zoom: 14,
          zoomControl: true,
          scrollWheelZoom: false,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);

        const marker = L.marker([latitude, longitude], { icon: customIcon })
          .addTo(map)
          .bindPopup(
            `<div style="font-family: inherit; padding: 4px;">
              <h4 style="font-weight: 700; color: #0284c7; margin: 0 0 4px; font-size: 14px;">${clinicName}</h4>
              <p style="margin: 0; font-size: 12px; color: #64748b;">${address || "Clinic Address"}</p>
            </div>`
          );

        mapInstanceRef.current = map;
        markerRef.current = marker;
      } else {
        mapInstanceRef.current.setView([latitude, longitude], 14);
        if (markerRef.current) {
          markerRef.current.setLatLng([latitude, longitude]);
          markerRef.current.setPopupContent(
            `<div style="font-family: inherit; padding: 4px;">
              <h4 style="font-weight: 700; color: #0284c7; margin: 0 0 4px; font-size: 14px;">${clinicName}</h4>
              <p style="margin: 0; font-size: 12px; color: #64748b;">${address || "Clinic Address"}</p>
            </div>`
          );
        }
      }
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, [latitude, longitude, clinicName, address]);

  return (
    <div
      ref={mapRef}
      className="w-full h-86 rounded-2xl overflow-hidden border border-gray-100 shadow-sm z-0"
    />
  );
}
