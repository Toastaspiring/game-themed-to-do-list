
import React, { useEffect, useState } from 'react';

const LocationTracker: React.FC = () => {
  const [userLocation, setUserLocation] = useState<string | null>(null);

  useEffect(() => {
    const requestUserLocation = async () => {
      try {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              try {
                const response = await fetch(
                  `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
                );
                const data = await response.json();
                const city = data.address?.city || data.address?.town || 'Unknown';
                setUserLocation(city);
              } catch (error) {
                console.error('Error fetching location details:', error);
                setUserLocation('Unknown');
              }
            },
            (error) => {
              console.error('Error getting location:', error);
              setUserLocation(null);
            }
          );
        } else {
          console.log('Geolocation not supported by this browser');
          setUserLocation(null);
        }
      } catch (error) {
        console.error('Error requesting location:', error);
        setUserLocation(null);
      }
    };

    requestUserLocation();
  }, []);

  if (!userLocation) return null;

  return (
    <div className="text-sm text-game-text-muted mt-2">
      Current location: {userLocation}
    </div>
  );
};

export default LocationTracker;
export const getCurrentLocation = async (): Promise<string> => {
  return new Promise((resolve) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
            );
            const data = await response.json();
            const city = data.address?.city || data.address?.town || 'Unknown';
            resolve(city);
          } catch (error) {
            console.error('Error fetching location details:', error);
            resolve('Unknown');
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          resolve('Unknown');
        }
      );
    } else {
      console.log('Geolocation not supported by this browser');
      resolve('Unknown');
    }
  });
};
