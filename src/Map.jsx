import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

export default function Map({ position }) {
  const [mapLat, mapLng] = position
  const [mapPosition, setMapPosition] = useState([40, 0])

  useEffect(
    function () {
      if (!mapLat && !mapLng) return
      if (mapLat && mapLng) setMapPosition([mapLat, mapLng])
    },
    [mapLat, mapLng]
  )

  return (
    <div className="basis-1 z-10">
      <MapContainer
        center={mapPosition}
        zoom={13}
        scrollWheelZoom={true}
        zoomControl={false}
        className="h-[calc(100vh-19rem)]"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
          position={position}
          icon={L.icon({ iconUrl: "icon-location.svg" })}
        ></Marker>
        <ChangeCenter position={mapPosition} />
      </MapContainer>
    </div>
  )
}

function ChangeCenter({ position }) {
  const map = useMap()
  map.setView(position)
  return null
}
