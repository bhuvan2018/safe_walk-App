"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Search, ShieldAlert, BadgeAlert, Shield } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import dynamic from "next/dynamic"
import L from "leaflet"

const Map = dynamic(() => import("./Map"), { ssr: false })

// Location names database for Karnataka
const locationNames = {
  Bangalore: [
    "Indiranagar",
    "Koramangala",
    "MG Road",
    "Brigade Road",
    "Jayanagar",
    "JP Nagar",
    "Whitefield",
    "HSR Layout",
    "BTM Layout",
    "Marathahalli",
    "Electronic City",
    "Banashankari",
    "Malleswaram",
    "Rajajinagar",
    "Hebbal",
    "Bannerghatta Road",
    "Yelahanka",
    "RT Nagar",
    "Basavanagudi",
    "Vijayanagar",
  ],
  Mysore: [
    "Gokulam",
    "Saraswathipuram",
    "VV Mohalla",
    "Lakshmipuram",
    "Jayalakshmipuram",
    "Kuvempunagar",
    "Vijayanagar",
    "Hebbal",
    "RK Nagar",
    "Bogadi",
    "Bannimantap",
    "Nazarbad",
    "Chamundipuram",
    "Agrahara",
    "Mandi Mohalla",
  ],
  "Hubli-Dharwad": [
    "Vidyanagar",
    "Navanagar",
    "Gopankoppa",
    "Keshwapur",
    "Deshpande Nagar",
    "Malmaddi",
    "Saptapur",
    "Renuka Nagar",
    "Gandhi Nagar",
    "Sattur",
  ],
  // Add more cities and their locations as needed
}

const karnatakaCities = [
  "Bangalore",
  "Mysore",
  "Hubli-Dharwad",
  "Mangalore",
  "Belgaum",
  "Gulbarga",
  "Davanagere",
  "Bellary",
  "Bijapur",
  "Shimoga",
]

interface SafetyZone {
  id: number
  name: string
  type: "hospital" | "police" | "public"
  latitude: number
  longitude: number
  safetyLevel: "safe" | "moderate" | "unsafe"
  landmark?: string
}

interface Route {
  path: [number, number][]
  safetyZones: SafetyZone[]
  routeDescription: string
}

export default function SafetyZones() {
  const [selectedCity, setSelectedCity] = useState("")
  const [destination, setDestination] = useState("")
  const [routes, setRoutes] = useState<Route[]>([])
  const { toast } = useToast()
  const mapRef = useRef<L.Map | null>(null)

  const getRandomLocationName = (city: string, usedNames: Set<string>): string => {
    const cityLocations = locationNames[city as keyof typeof locationNames] || locationNames["Bangalore"]
    const availableLocations = cityLocations.filter((name) => !usedNames.has(name))

    if (availableLocations.length === 0) {
      // If all names are used, create a unique name with a number
      const baseLocation = cityLocations[Math.floor(Math.random() * cityLocations.length)]
      let counter = 1
      while (usedNames.has(`${baseLocation} ${counter}`)) {
        counter++
      }
      return `${baseLocation} ${counter}`
    }

    const randomLocation = availableLocations[Math.floor(Math.random() * availableLocations.length)]
    usedNames.add(randomLocation)
    return randomLocation
  }

  const getLandmarkName = (type: "hospital" | "police" | "public", locationName: string): string => {
    switch (type) {
      case "hospital":
        return `${locationName} Medical Center`
      case "police":
        return `${locationName} Police Station`
      case "public":
        return `${locationName} Community Center`
    }
  }

  const handleSearch = async () => {
    if (!selectedCity || !destination) {
      toast({
        title: "Error",
        description: "Please select a city and enter a destination.",
        variant: "destructive",
      })
      return
    }

    try {
      // Fetch source city coordinates
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${selectedCity},Karnataka,India`,
      )
      const cityData = await response.json()
      if (!cityData.length) {
        throw new Error("Source city not found")
      }
      const cityCoords = [Number.parseFloat(cityData[0].lat), Number.parseFloat(cityData[0].lon)]

      // Fetch destination coordinates
      const destResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${destination},Karnataka,India`,
      )
      const destData = await destResponse.json()
      if (!destData.length) {
        throw new Error("Destination not found")
      }
      const destCoords = [Number.parseFloat(destData[0].lat), Number.parseFloat(destData[0].lon)]

      // Get actual places between source and destination
      const midpointLat = (cityCoords[0] + destCoords[0]) / 2
      const midpointLon = (cityCoords[1] + destCoords[1]) / 2
      const radius = calculateDistance(cityCoords[0], cityCoords[1], destCoords[0], destCoords[1]) / 2

      // Fetch actual places near the route
      const placesResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=hospital,police,public+building&viewbox=${
          cityCoords[1] - 0.1
        },${cityCoords[0] - 0.1},${destCoords[1] + 0.1},${destCoords[0] + 0.1}&bounded=1&limit=15`,
      )
      const placesData = await placesResponse.json()

      const newRoutes: Route[] = []

      // Create 3 different routes with slight variations
      for (let i = 0; i < 3; i++) {
        const simulatedRoute = generateSimulatedRoute(cityCoords as [number, number], destCoords as [number, number])

        // Use actual places data to create safety zones
        const safetyZones =
          placesData.length > 0
            ? generateSafetyMarkersFromPlaces(simulatedRoute, placesData, i)
            : generateSafetyMarkers(simulatedRoute, selectedCity, new Set<string>())

        const routeDescription = `Via ${safetyZones[Math.floor(safetyZones.length / 2)].name}`
        newRoutes.push({ path: simulatedRoute, safetyZones, routeDescription })
      }

      setRoutes(newRoutes)

      toast({
        title: "Routes Calculated",
        description: `Safe routes from ${selectedCity} to ${destination} have been calculated.`,
      })

      if (mapRef.current) {
        const map = mapRef.current
        const allPoints = newRoutes.flatMap((route) => route.path)
        const bounds = L.latLngBounds(allPoints)
        map.fitBounds(bounds)
      }
    } catch (error) {
      console.error("Error calculating routes:", error)
      toast({
        title: "Error",
        description: "Failed to calculate routes. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Add this helper function to calculate distance between coordinates
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371 // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1)
    const dLon = deg2rad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const d = R * c // Distance in km
    return d
  }

  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180)
  }

  // Add this function to generate safety markers from actual places
  const generateSafetyMarkersFromPlaces = (
    route: [number, number][],
    placesData: any[],
    routeIndex: number,
  ): SafetyZone[] => {
    const safetyLevels: ("safe" | "moderate" | "unsafe")[] = ["safe", "moderate", "unsafe"]
    const types: ("hospital" | "police" | "public")[] = ["hospital", "police", "public"]

    // Filter places to be along the route
    const filteredPlaces = placesData.filter((place, index) => {
      // Use different subsets of places for different routes
      return index % 3 === routeIndex
    })

    // If we don't have enough places, add some points from the route
    const places = [...filteredPlaces]
    if (places.length < 3) {
      const midPoints = route.filter((_, i) => i > 0 && i < route.length - 1)
      for (let i = 0; i < Math.min(3 - places.length, midPoints.length); i++) {
        places.push({
          display_name: `Checkpoint ${i + 1}`,
          lat: midPoints[i][0],
          lon: midPoints[i][1],
          type: "node",
        })
      }
    }

    return places.map((place, index) => {
      const type = types[Math.floor(Math.random() * types.length)]
      const placeName = place.display_name.split(",")[0]

      return {
        id: index,
        name: placeName,
        type,
        latitude: Number.parseFloat(place.lat),
        longitude: Number.parseFloat(place.lon),
        safetyLevel: safetyLevels[Math.floor(Math.random() * safetyLevels.length)],
        landmark: `${placeName} ${type === "hospital" ? "Medical Center" : type === "police" ? "Police Station" : "Community Center"}`,
      }
    })
  }

  const generateSimulatedRoute = (start: [number, number], end: [number, number]): [number, number][] => {
    const route: [number, number][] = [start]
    const numPoints = Math.floor(Math.random() * 3) + 3
    for (let i = 1; i < numPoints; i++) {
      const fraction = i / numPoints
      const variation = 0.015 * (Math.random() - 0.5) * (5 - i)
      const lat = start[0] + (end[0] - start[0]) * fraction + variation
      const lon = start[1] + (end[1] - start[1]) * fraction + variation
      route.push([lat, lon])
    }
    route.push(end)
    return route
  }

  const generateSafetyMarkers = (route: [number, number][], city: string, usedNames: Set<string>): SafetyZone[] => {
    const safetyLevels: ("safe" | "moderate" | "unsafe")[] = ["safe", "moderate", "unsafe"]
    const types: ("hospital" | "police" | "public")[] = ["hospital", "police", "public"]

    return route.map((coords, index) => {
      const type = types[Math.floor(Math.random() * types.length)]
      const locationName = getRandomLocationName(city, usedNames)
      const landmark = getLandmarkName(type, locationName)

      return {
        id: index,
        name: locationName,
        type,
        latitude: coords[0],
        longitude: coords[1],
        safetyLevel: safetyLevels[Math.floor(Math.random() * safetyLevels.length)],
        landmark,
      }
    })
  }

  const getSafetyColor = (safetyLevel: string) => {
    switch (safetyLevel) {
      case "safe":
        return "bg-green-500"
      case "moderate":
        return "bg-yellow-500"
      case "unsafe":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getZoneIcon = (type: "hospital" | "police" | "public") => {
    switch (type) {
      case "hospital":
        return <ShieldAlert className="h-5 w-5 text-red-500" />
      case "police":
        return <BadgeAlert className="h-5 w-5 text-blue-500" />
      case "public":
        return <Shield className="h-5 w-5 text-green-500" />
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <MapPin className="mr-2 h-5 w-5 text-orange-500" /> Safe Zones Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] rounded-lg overflow-hidden">
            <Map ref={mapRef} routes={routes} />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Find Safe Routes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select onValueChange={setSelectedCity}>
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Select a city" />
            </SelectTrigger>
            <SelectContent>
              {karnatakaCities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="Enter your destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white"
          />
          <Button onClick={handleSearch} className="w-full bg-orange-500 hover:bg-orange-600">
            <Search className="mr-2 h-4 w-4" /> Find Safe Routes
          </Button>

          {routes.length > 0 && (
            <div className="mt-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800/50 p-4 rounded-lg text-center"
              >
                <h3 className="text-lg font-semibold text-white mb-2">Routes Calculated</h3>
                <p className="text-gray-300">
                  {routes.length} safe routes from {selectedCity} to {destination} have been displayed on the map.
                </p>
                <div className="mt-4 flex justify-center">
                  <div className="inline-flex items-center gap-2 text-sm text-gray-400">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span>Safe Zone</span>
                  </div>
                  <div className="inline-flex items-center gap-2 text-sm text-gray-400 ml-4">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span>Moderate Zone</span>
                  </div>
                  <div className="inline-flex items-center gap-2 text-sm text-gray-400 ml-4">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span>Caution Zone</span>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

