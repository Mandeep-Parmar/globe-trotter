export const TRAVEL_MATRIX = {
  "Paris-Rome": 2.5,
  "Rome-Paris": 2.5,
  "Paris-Barcelona": 3.0,
  "Barcelona-Paris": 3.0,
  "Paris-Tokyo": 12.0,
  "Tokyo-Paris": 12.0,
  "Tokyo-Rome": 13.0,
  "Rome-Tokyo": 13.0,
  "New York-Paris": 7.5,
  "Paris-New York": 8.5,
  "New York-Rome": 8.5,
  "Rome-New York": 9.5,
  "Bali-Tokyo": 7.0,
  "Tokyo-Bali": 7.0,
  "Bali-Paris": 16.0,
  "Paris-Bali": 16.0,
  "Barcelona-Rome": 2.0,
  "Rome-Barcelona": 2.0
};

export const getInterCityTravelHours = (cityNameA, cityNameB) => {
  if (!cityNameA || !cityNameB || cityNameA === cityNameB) return 0;
  const key = `${cityNameA}-${cityNameB}`;
  const reverseKey = `${cityNameB}-${cityNameA}`;
  return TRAVEL_MATRIX[key] || TRAVEL_MATRIX[reverseKey] || 2.5; // Default 2.5h fallback
};
