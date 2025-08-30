/* eslint-disable @typescript-eslint/no-explicit-any */
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

interface MapLocationPickerProps {
  value: string;
  onChange: (address: string, latitude?: number, longitude?: number) => void;
  label: string;
  placeholder?: string;
  initialLatitude?: number;
  initialLongitude?: number;
}

interface Location {
  lat: number;
  lng: number;
  address: string;
}

// Dynamically import Mapbox to avoid SSR issues
const MapLocationPickerComponent = ({
  value,
  onChange,
  label,
  placeholder,
  initialLatitude,
  initialLongitude,
}: MapLocationPickerProps) => {
  const [location, setLocation] = useState<Location | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mapboxgl, setMapboxgl] = useState<any>(null);
  const [hasRequestedLocation, setHasRequestedLocation] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const hasInitializedRef = useRef(false);
  const isDraggingRef = useRef(false);
  const initialLatitudeRef = useRef(initialLatitude);
  const initialLongitudeRef = useRef(initialLongitude);

  // Initialize Mapbox
  useEffect(() => {
    const loadMapbox = async () => {
      try {
        const mapboxModule = await import("mapbox-gl");
        setMapboxgl(mapboxModule.default);
        const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

        if (!mapboxToken) {
          console.error("Mapbox token not found");
          return;
        }

        mapboxModule.default.accessToken = mapboxToken;
        setIsMapLoaded(true);
      } catch (error) {
        console.error("Failed to load Mapbox:", error);
      }
    };

    loadMapbox();
  }, []);

  // Get current location on component mount (only if no initial coordinates)
  useEffect(() => {
    if (
      !hasRequestedLocation &&
      navigator.geolocation &&
      !value &&
      !initialLatitude &&
      !initialLongitude
    ) {
      setHasRequestedLocation(true);
      getCurrentLocation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasRequestedLocation, value, initialLatitude, initialLongitude]);

  // Initialize map when Mapbox is loaded
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current || !mapboxgl) {
      return;
    }

    // Determine initial center
    let initialCenter: [number, number] = [106.8456, -6.2088]; // Default to Jakarta [lng, lat]
    let initialZoom = 13;

    if (initialLatitudeRef.current && initialLongitudeRef.current) {
      initialCenter = [initialLongitudeRef.current, initialLatitudeRef.current];
      initialZoom = 15;
    }

    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: initialCenter,
      zoom: initialZoom,
      attributionControl: false,
    });

    mapInstanceRef.current = map;

    // Wait for map to load before adding interactions
    map.on("load", () => {
      // Add navigation controls
      map.addControl(new mapboxgl.NavigationControl(), "top-right");
      map.addControl(new mapboxgl.FullscreenControl());

      // Add click listener to map
      map.on("click", (event: any) => {
        // Don't handle clicks if we're currently dragging
        if (isDraggingRef.current) {
          return;
        }

        const { lng, lat } = event.lngLat;

        // Immediately place a marker for visual feedback
        placeMarker(lng, lat);

        // Then get the address - pass lat, lng in correct order
        reverseGeocode(lat, lng);
      });

      // Handle initial coordinates or existing address (only if not already initialized)
      if (!hasInitializedRef.current) {
        if (initialLatitudeRef.current && initialLongitudeRef.current) {
          // Place marker at initial coordinates
          placeMarker(initialLongitudeRef.current, initialLatitudeRef.current);

          // If we have an address, use it; otherwise geocode the coordinates
          if (value) {
            setLocation({
              lat: initialLatitudeRef.current,
              lng: initialLongitudeRef.current,
              address: value,
            });
          } else {
            reverseGeocode(
              initialLatitudeRef.current,
              initialLongitudeRef.current
            );
          }
        } else if (value && !location) {
          // Try to geocode the current value if it exists
          geocodeAddress(value);
        }

        // Mark map as initialized
        hasInitializedRef.current = true;
      }
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMapLoaded, mapboxgl]); // Removed initialLatitude and initialLongitude from dependencies

  // Handle value changes without re-initializing the map
  useEffect(() => {
    if (
      value &&
      !location &&
      hasInitializedRef.current &&
      mapInstanceRef.current
    ) {
      // If we have a value but no location, try to geocode it
      geocodeAddress(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, location]);

  const placeMarker = (lng: number, lat: number) => {
    try {
      // Check if mapboxgl is loaded
      if (!mapboxgl || !mapInstanceRef.current) {
        console.warn("Mapbox not loaded yet, cannot place marker");
        return;
      }

      // Remove existing marker
      if (markerRef.current) {
        markerRef.current.remove();
      }

      // Create new marker
      const marker = new mapboxgl.Marker({
        draggable: true,
        color: "#8b5cf6", // Purple color to match theme
      })
        .setLngLat([lng, lat])
        .addTo(mapInstanceRef.current!);

      markerRef.current = marker;

      // Add drag listeners to marker
      marker.on("dragstart", () => {
        isDraggingRef.current = true;
      });

      marker.on("dragend", () => {
        isDraggingRef.current = false;
        const markerLngLat = marker.getLngLat();

        // Update location state without recreating the marker
        const newLocation = {
          lat: markerLngLat.lat,
          lng: markerLngLat.lng,
          address: "",
        };
        setLocation(newLocation);

        // Get the address for the new position
        reverseGeocode(markerLngLat.lat, markerLngLat.lng);
      });
    } catch (error) {
      console.error("Failed to place marker:", error);
    }
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    // Check if mapboxgl is loaded before proceeding
    if (!mapboxgl) {
      console.warn("Mapbox not loaded yet, cannot geocode");
      return;
    }

    // Validate coordinates
    if (
      isNaN(lat) ||
      isNaN(lng) ||
      lat < -90 ||
      lat > 90 ||
      lng < -180 ||
      lng > 180
    ) {
      console.error("Invalid coordinates:", { lat, lng });
      const fallbackAddress = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      const newLocation = { lat, lng, address: fallbackAddress };
      setLocation(newLocation);
      onChange(fallbackAddress, lat, lng);
      return;
    }

    setIsLoading(true);

    try {
      const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

      if (!mapboxToken) {
        console.error("Mapbox token not found");
        const fallbackAddress = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        const newLocation = { lat, lng, address: fallbackAddress };
        setLocation(newLocation);
        onChange(fallbackAddress, lat, lng);
        return;
      }

      // Format coordinates properly for the API
      const formattedLat = lat.toFixed(6);
      const formattedLng = lng.toFixed(6);

      // Try multiple geocoding approaches to get a better address
      const geocodingUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${formattedLng},${formattedLat}.json?access_token=${mapboxToken}&types=poi,address,place&limit=5`;
      const response = await fetch(geocodingUrl);

      if (!response.ok) {
        console.error(
          "Geocoding API error:",
          response.status,
          response.statusText
        );

        // Log response details for debugging
        try {
          const errorText = await response.text();
          console.error("Error response:", errorText);
        } catch (e) {
          console.error("Could not read error response", e);
        }

        // Try a simpler geocoding request as fallback
        const fallbackUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${formattedLng},${formattedLat}.json?access_token=${mapboxToken}&limit=1`;
        const fallbackResponse = await fetch(fallbackUrl);

        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          if (fallbackData.features && fallbackData.features.length > 0) {
            const address = fallbackData.features[0].place_name;
            const newLocation = { lat, lng, address };
            setLocation(newLocation);
            onChange(address, lat, lng);
            return;
          }
        } else {
          console.error(
            "Fallback geocoding also failed:",
            fallbackResponse.status
          );
        }

        // If all geocoding fails, use coordinates
        const fallbackAddress = `${formattedLat}, ${formattedLng}`;
        const newLocation = { lat, lng, address: fallbackAddress };
        setLocation(newLocation);
        onChange(fallbackAddress, lat, lng);
        console.warn("Geocoding failed, using coordinates");
        return;
      }

      const data = await response.json();

      if (data.features && data.features.length > 0) {
        // Try to get the best address from the results
        let bestAddress = "";

        // Look for a good address result
        for (const feature of data.features) {
          if (feature.place_type && feature.place_type.includes("address")) {
            bestAddress = feature.place_name;
            break;
          }
        }

        // If no address found, use the first result
        if (!bestAddress && data.features[0]) {
          bestAddress = data.features[0].place_name;
        }

        if (bestAddress) {
          const newLocation = { lat, lng, address: bestAddress };
          setLocation(newLocation);
          onChange(bestAddress, lat, lng);
        } else {
          // Fallback to coordinates if no address found
          const fallbackAddress = `${formattedLat}, ${formattedLng}`;
          const newLocation = { lat, lng, address: fallbackAddress };
          setLocation(newLocation);
          onChange(fallbackAddress, lat, lng);
          console.warn("No address found, using coordinates");
        }
      } else {
        console.warn("No geocoding results found for:", { lat, lng });
        // Fallback to coordinates
        const fallbackAddress = `${formattedLat}, ${formattedLng}`;
        const newLocation = { lat, lng, address: fallbackAddress };
        setLocation(newLocation);
        onChange(fallbackAddress, lat, lng);
      }
    } catch (error) {
      console.error("Reverse geocoding failed:", error);
      // Fallback to coordinates
      const fallbackAddress = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      const newLocation = { lat, lng, address: fallbackAddress };
      setLocation(newLocation);
      onChange(fallbackAddress, lat, lng);
    } finally {
      setIsLoading(false);
    }
  };

  const geocodeAddress = async (address: string) => {
    // Check if mapboxgl is loaded before proceeding
    if (!mapboxgl) {
      console.warn("Mapbox not loaded yet, cannot geocode address");
      return;
    }

    setIsLoading(true);

    try {
      const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          address
        )}.json?access_token=${mapboxToken}&types=poi,address`
      );

      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        const newLocation = { lat, lng, address };

        setLocation(newLocation);

        // Update map center
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo({
            center: [lng, lat],
            zoom: 15,
          });
        }

        // Place marker at the geocoded location
        placeMarker(lng, lat);
      }
    } catch (error) {
      console.error("Geocoding failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const address = e.target.value;
    onChange(address);

    // Geocode the address after a delay
    if (address.trim()) {
      setTimeout(() => {
        geocodeAddress(address);
      }, 1000);
    }
  };

  const openInGoogleMaps = () => {
    if (location) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
        location.address
      )}`;
      window.open(url, "_blank");
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true);

      // Set a timeout to clear loading state if geolocation takes too long
      const timeoutId = setTimeout(() => {
        console.warn("Geolocation timeout - clearing loading state");
        setIsLoading(false);
      }, 12000); // 12 seconds timeout (slightly longer than geolocation timeout)

      navigator.geolocation.getCurrentPosition(
        (position) => {
          clearTimeout(timeoutId); // Clear the timeout
          const { latitude, longitude } = position.coords;

          // Update map center to current location
          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo({
              center: [longitude, latitude],
              zoom: 15,
            });
          }

          // Place marker and get address
          placeMarker(longitude, latitude);
          reverseGeocode(latitude, longitude);

          // Clear loading state after successful geolocation
          setIsLoading(false);
        },
        (error) => {
          clearTimeout(timeoutId); // Clear the timeout
          console.error("Geolocation failed:", error);
          setIsLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    } else {
      console.error("Geolocation not supported");
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-white">{label}</label>

      {/* Address Input */}
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleAddressChange}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
          placeholder={placeholder}
        />
        {location && (
          <button
            type="button"
            onClick={openInGoogleMaps}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
          >
            🗺️ Directions
          </button>
        )}
      </div>

      {/* Map Container */}
      <div className="relative">
        <div
          ref={mapRef}
          className="w-full h-48 rounded-lg border border-white/20"
          style={{ minHeight: "192px" }}
        />

        {!isMapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800 rounded-lg">
            <div className="text-center">
              <div className="w-6 h-6 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-white text-sm">Loading map...</p>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
            Loading...
          </div>
        )}

        {/* Map Controls */}
        <div className="absolute top-2 left-2 space-y-2">
          <button
            type="button"
            onClick={getCurrentLocation}
            className="bg-white/90 hover:bg-white text-gray-800 p-2 rounded shadow-lg transition-colors"
            title="Use current location"
          >
            📍
          </button>
        </div>

        {/* Instructions */}
        <div className="absolute bottom-2 left-2 right-2 bg-black/50 text-white text-xs p-2 rounded">
          💡 Click on map or drag marker to set location
        </div>
      </div>

      {/* Location Info */}
      {location && (
        <div className="bg-white/10 rounded-lg p-3">
          <div className="text-sm text-gray-300">
            <div className="flex items-center gap-2 mb-1">
              <span>📍</span>
              <span className="font-medium">Selected Location:</span>
            </div>
            <p className="text-white">{location.address}</p>
            <p className="text-xs text-gray-400 mt-1">
              Lat: {location.lat.toFixed(6)}, Lng: {location.lng.toFixed(6)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// Export with dynamic loading to avoid SSR issues
export default dynamic(() => Promise.resolve(MapLocationPickerComponent), {
  ssr: false,
  loading: () => (
    <div className="space-y-3">
      <div className="block text-sm font-medium text-white">Loading map...</div>
      <div className="w-full h-48 rounded-lg border border-white/20 bg-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-6 h-6 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-white text-sm">Loading map component...</p>
        </div>
      </div>
    </div>
  ),
});
