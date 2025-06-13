import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet'

const reverseGeocode = async (lat, lon) => {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
  )
  const data = await res.json()
  return (
    data?.address?.city || data?.address?.town || data?.address?.village || ''
  )
}

const ClickHandler = ({ setCitta }) => {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng
      const city = await reverseGeocode(lat, lng)
      if (city) {
        setCitta(city)
      } else {
        alert('Città non riconosciuta. Prova a cliccare in una zona urbana.')
      }
    },
  })
  return null
}

const MapSelector = ({ setCitta }) => {
  return (
    <div style={{ height: '400px', marginBottom: '1rem' }}>
      <MapContainer center={[41.9, 12.5]} zoom={6} style={{ height: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <ClickHandler setCitta={setCitta} />
      </MapContainer>
    </div>
  )
}

export default MapSelector
