"use client"

import type React from "react"

import { useState, useRef } from "react"
import { MapPin, Navigation, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/components/language-provider"

interface Location {
  lat: number
  lng: number
  address: string
}

interface InteractiveMapProps {
  onLocationSelect: (location: Location) => void
  onClose: () => void
  initialLocation?: Location
}

export function InteractiveMap({ onLocationSelect, onClose, initialLocation }: InteractiveMapProps) {
  const { t } = useLanguage()
  const mapRef = useRef<HTMLDivElement>(null)
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(initialLocation || null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isGettingLocation, setIsGettingLocation] = useState(false)

  // Mock map data for demonstration - in real app this would be replaced with Google Maps/OpenStreetMap
  const [mapCenter, setMapCenter] = useState({
    lat: initialLocation?.lat || 41.2995, // Tashkent coordinates
    lng: initialLocation?.lng || 69.2401,
  })

  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!mapRef.current) return

    const rect = mapRef.current.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    // Convert pixel coordinates to lat/lng (simplified calculation)
    const lat = mapCenter.lat + (rect.height / 2 - y) * 0.001
    const lng = mapCenter.lng + (x - rect.width / 2) * 0.001

    const newLocation: Location = {
      lat,
      lng,
      address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
    }

    setSelectedLocation(newLocation)
  }

  const handleGetCurrentLocation = () => {
    setIsGettingLocation(true)
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          const location: Location = {
            lat: latitude,
            lng: longitude,
            address: `Current Location: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
          }
          setSelectedLocation(location)
          setMapCenter({ lat: latitude, lng: longitude })
          setIsGettingLocation(false)
        },
        (error) => {
          console.error("Location error:", error)
          setIsGettingLocation(false)
        },
      )
    }
  }

  const handleSearchLocation = () => {
    if (!searchQuery.trim()) return

    // Mock search - in real app this would use geocoding API
    const mockResults = [
      { lat: 41.2995, lng: 69.2401, address: "Tashkent, Uzbekistan" },
      { lat: 41.3111, lng: 69.2797, address: "Chilanzar, Tashkent" },
      { lat: 41.2646, lng: 69.2163, address: "Yunusabad, Tashkent" },
    ]

    const result = mockResults.find((r) => r.address.toLowerCase().includes(searchQuery.toLowerCase()))
    if (result) {
      setSelectedLocation(result)
      setMapCenter({ lat: result.lat, lng: result.lng })
    }
  }

  const handleConfirmLocation = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl h-[80vh] flex flex-col">
        <CardContent className="p-0 flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[#302dbb] flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              {t("form.select_location") || "Select Your Location"}
            </h3>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Search Bar */}
          <div className="p-4 border-b">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("form.search_location") || "Search for a location..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  onKeyPress={(e) => e.key === "Enter" && handleSearchLocation()}
                />
              </div>
              <Button onClick={handleSearchLocation} variant="outline">
                <Search className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleGetCurrentLocation}
                disabled={isGettingLocation}
                variant="outline"
                className="flex items-center gap-2 bg-transparent"
              >
                <Navigation className="h-4 w-4" />
                {isGettingLocation ? "Getting..." : "Current"}
              </Button>
            </div>
          </div>

          {/* Map Area */}
          <div className="flex-1 relative">
            <div
              ref={mapRef}
              onClick={handleMapClick}
              className="w-full h-full bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900 relative cursor-crosshair overflow-hidden"
              style={{
                backgroundImage: `
                  radial-gradient(circle at 20% 20%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                  radial-gradient(circle at 80% 80%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
                  radial-gradient(circle at 40% 40%, rgba(120, 200, 120, 0.3) 0%, transparent 50%)
                `,
              }}
            >
              {/* Grid overlay to simulate map */}
              <div className="absolute inset-0 opacity-20">
                <svg width="100%" height="100%">
                  <defs>
                    <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                      <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>

              {/* Mock roads */}
              <div className="absolute inset-0">
                <div className="absolute top-1/3 left-0 right-0 h-1 bg-gray-400 opacity-60"></div>
                <div className="absolute top-2/3 left-0 right-0 h-1 bg-gray-400 opacity-60"></div>
                <div className="absolute left-1/3 top-0 bottom-0 w-1 bg-gray-400 opacity-60"></div>
                <div className="absolute left-2/3 top-0 bottom-0 w-1 bg-gray-400 opacity-60"></div>
              </div>

              {/* Selected location marker */}
              {selectedLocation && (
                <div
                  className="absolute transform -translate-x-1/2 -translate-y-full"
                  style={{
                    left: `${50 + (selectedLocation.lng - mapCenter.lng) * 1000}%`,
                    top: `${50 - (selectedLocation.lat - mapCenter.lat) * 1000}%`,
                  }}
                >
                  <div className="relative">
                    <MapPin className="h-8 w-8 text-[#302dbb] drop-shadow-lg" fill="currentColor" />
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#302dbb] rounded-full animate-ping"></div>
                  </div>
                </div>
              )}

              {/* Center crosshair */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-[#302dbb] rounded-full bg-white/80"></div>
              </div>

              {/* Instructions */}
              <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/90 p-3 rounded-lg shadow-lg max-w-xs">
                <p className="text-sm text-muted-foreground">
                  {t("form.map_instructions") || "Click anywhere on the map to select your delivery location"}
                </p>
              </div>
            </div>
          </div>

          {/* Selected Location Info */}
          {selectedLocation && (
            <div className="p-4 border-t bg-muted/50">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{t("form.selected_location") || "Selected Location"}:</p>
                  <p className="text-sm text-muted-foreground">{selectedLocation.address}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Coordinates: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                  </p>
                </div>
                <Button onClick={handleConfirmLocation} className="bg-[#302dbb] hover:bg-[#302dbb]/90">
                  {t("form.confirm_location") || "Confirm Location"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
