export const CITIES = [
  {
    id: "city-paris",
    name: "Paris",
    country: "France",
    region: "Europe",
    costIndex: "$$$",
    rating: 4.9,
    bannerUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
    description: "The City of Light offers world-class art, culinary marvels, iconic architecture, and romantic avenues."
  },
  {
    id: "city-tokyo",
    name: "Tokyo",
    country: "Japan",
    region: "Asia",
    costIndex: "$$$",
    rating: 4.9,
    bannerUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80",
    description: "A breathtaking contrast of neon-lit skyscrapers, historic shrines, Michelin-star dining, and cutting-edge tech."
  },
  {
    id: "city-rome",
    name: "Rome",
    country: "Italy",
    region: "Europe",
    costIndex: "$$",
    rating: 4.8,
    bannerUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80",
    description: "Step into living history with ancient ruins, bustling piazzas, authentic trattorias, and vibrant espresso bars."
  },
  {
    id: "city-nyc",
    name: "New York",
    country: "United States",
    region: "Americas",
    costIndex: "$$$$",
    rating: 4.8,
    bannerUrl: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80",
    description: "The city that never sleeps: Broadway shows, Central Park strolls, iconic skyline views, and endless energy."
  },
  {
    id: "city-bali",
    name: "Bali",
    country: "Indonesia",
    region: "Asia",
    costIndex: "$",
    rating: 4.7,
    bannerUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
    description: "Tropical paradise boasting lush rice terraces, ancient sea temples, pristine surf beaches, and holistic wellness."
  },
  {
    id: "city-barcelona",
    name: "Barcelona",
    country: "Spain",
    region: "Europe",
    costIndex: "$$",
    rating: 4.8,
    bannerUrl: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1200&q=80",
    description: "Gaudí’s surreal architectural masterpieces, sun-drenched Mediterranean beaches, tapas bars, and gothic alleys."
  }
];

export const ACTIVITIES = [
  // Paris Activities
  {
    id: "act-paris-1",
    cityId: "city-paris",
    cityName: "Paris",
    title: "Eiffel Tower Summit Priority Access Tour",
    category: "Sightseeing",
    cost: 65,
    durationHours: 3,
    imageUrl: "https://images.unsplash.com/photo-1543349689-9a4d426bee8e?auto=format&fit=crop&w=600&q=80",
    description: "Skip the long lines and take the elevator directly to the summit for panoramic views of Paris."
  },
  {
    id: "act-paris-2",
    cityId: "city-paris",
    cityName: "Paris",
    title: "Louvre Museum Masterpieces Guided Walk",
    category: "Sightseeing",
    cost: 50,
    durationHours: 3.5,
    imageUrl: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=600&q=80",
    description: "Explore Mona Lisa, Venus de Milo, and Winged Victory with an expert art historian."
  },
  {
    id: "act-paris-3",
    cityId: "city-paris",
    cityName: "Paris",
    title: "Seine Sunset Dinner Cruise & Champagne",
    category: "Food",
    cost: 95,
    durationHours: 2.5,
    imageUrl: "https://images.unsplash.com/photo-1509299349698-ab22323ae696?auto=format&fit=crop&w=600&q=80",
    description: "3-course gourmet French dining while floating past illuminated Paris landmarks."
  },
  {
    id: "act-paris-4",
    cityId: "city-paris",
    cityName: "Paris",
    title: "Hôtel Plaza Athénée Luxury Stay",
    category: "Stay",
    cost: 380,
    durationHours: 24,
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
    description: "Iconic 5-star hotel with Eiffel Tower balcony views and haute cuisine."
  },
  {
    id: "act-paris-5",
    cityId: "city-paris",
    cityName: "Paris",
    title: "Paris Metro & RER Unlimited Day Pass",
    category: "Transport",
    cost: 18,
    durationHours: 24,
    imageUrl: "https://images.unsplash.com/photo-1508873696983-2df515122519?auto=format&fit=crop&w=600&q=80",
    description: "Unlimited travel on Metro, RER, and bus routes across central Paris."
  },

  // Tokyo Activities
  {
    id: "act-tokyo-1",
    cityId: "city-tokyo",
    cityName: "Tokyo",
    title: "Shibuya Crossing & Izakaya Alley Tasting Tour",
    category: "Food",
    cost: 55,
    durationHours: 3,
    imageUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    description: "Sample yakitori, craft sake, and ramen in hidden alleyways around Shibuya."
  },
  {
    id: "act-tokyo-2",
    cityId: "city-tokyo",
    cityName: "Tokyo",
    title: "Senso-ji Temple & Asakusa Traditional Walk",
    category: "Sightseeing",
    cost: 25,
    durationHours: 2,
    imageUrl: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=600&q=80",
    description: "Immerse yourself in Old Tokyo history, kimono rentals, and traditional crafts."
  },
  {
    id: "act-tokyo-3",
    cityId: "city-tokyo",
    cityName: "Tokyo",
    title: "Mount Fuji & Lake Kawaguchiko Day Trip",
    category: "Sightseeing",
    cost: 110,
    durationHours: 8,
    imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80",
    description: "Guided bus tour to Mount Fuji 5th Station, ropeway ride, and serene lake views."
  },
  {
    id: "act-tokyo-4",
    cityId: "city-tokyo",
    cityName: "Tokyo",
    title: "Shinjuku Ryokan Onsen & Spa Experience",
    category: "Stay",
    cost: 240,
    durationHours: 24,
    imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80",
    description: "Traditional tatami suite featuring natural thermal spring baths right in Shinjuku."
  },
  {
    id: "act-tokyo-5",
    cityId: "city-tokyo",
    cityName: "Tokyo",
    title: "Shinkansen Bullet Train Express Pass",
    category: "Transport",
    cost: 85,
    durationHours: 4,
    imageUrl: "https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?auto=format&fit=crop&w=600&q=80",
    description: "High-speed rail travel connecting Tokyo, Kyoto, and Osaka."
  },

  // Rome Activities
  {
    id: "act-rome-1",
    cityId: "city-rome",
    cityName: "Rome",
    title: "Colosseum Arena Floor & Forum VIP Access",
    category: "Sightseeing",
    cost: 60,
    durationHours: 3.5,
    imageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80",
    description: "Walk onto the gladiator arena floor and discover the Roman Forum ruins."
  },
  {
    id: "act-rome-2",
    cityId: "city-rome",
    cityName: "Rome",
    title: "Trastevere Street Food & Wine Tasting",
    category: "Food",
    cost: 70,
    durationHours: 3,
    imageUrl: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80",
    description: "Enjoy fresh pasta, gelato, supplì, and Chianti wine in charming Trastevere."
  },
  {
    id: "act-rome-3",
    cityId: "city-rome",
    cityName: "Rome",
    title: "Hotel Artemide Boutique Stay",
    category: "Stay",
    cost: 210,
    durationHours: 24,
    imageUrl: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=600&q=80",
    description: "Elegant boutique hotel with rooftop cocktail lounge near Trevi Fountain."
  },

  // NYC Activities
  {
    id: "act-nyc-1",
    cityId: "city-nyc",
    cityName: "New York",
    title: "Manhattan Sunset Helicopter Flight",
    category: "Sightseeing",
    cost: 220,
    durationHours: 1,
    imageUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80",
    description: "Fly over the Statue of Liberty, Empire State Building, and Central Park."
  },
  {
    id: "act-nyc-2",
    cityId: "city-nyc",
    cityName: "New York",
    title: "Broadway Show & Pre-Theater Dinner",
    category: "Sightseeing",
    cost: 160,
    durationHours: 4,
    imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    description: "Premium orchestra seats for top Broadway musical + 3-course dinner."
  },

  // Bali Activities
  {
    id: "act-bali-1",
    cityId: "city-bali",
    cityName: "Bali",
    title: "Ubud Rice Terraces & Sacred Monkey Forest",
    category: "Sightseeing",
    cost: 30,
    durationHours: 5,
    imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80",
    description: "Explore Tegallalang rice paddies, jungle swings, and playful macaques."
  },
  {
    id: "act-bali-2",
    cityId: "city-bali",
    cityName: "Bali",
    title: "Seminyak Sunset Beach Club & Seafood Barbecue",
    category: "Food",
    cost: 45,
    durationHours: 4,
    imageUrl: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=600&q=80",
    description: "Lounge under palm umbrellas with fresh grilled lobster and tropical cocktails."
  }
];

export const SAMPLE_TRIPS = [
  {
    id: "trip-sample-1",
    title: "Grand European Escape",
    startDate: "2026-06-10",
    endDate: "2026-06-16",
    budgetLimit: 2800,
    stops: [
      {
        id: "stop-sample-1",
        cityId: "city-paris",
        cityName: "Paris",
        startDate: "2026-06-10",
        endDate: "2026-06-12",
        sectionBudget: 1500,
        activities: [
          { ...ACTIVITIES[0], dayNumber: 1 },
          { ...ACTIVITIES[2], dayNumber: 1 },
          { ...ACTIVITIES[3], dayNumber: 1 },
          { ...ACTIVITIES[1], dayNumber: 2 },
          { ...ACTIVITIES[4], dayNumber: 2 }
        ]
      },
      {
        id: "stop-sample-2",
        cityId: "city-rome",
        cityName: "Rome",
        startDate: "2026-06-13",
        endDate: "2026-06-16",
        sectionBudget: 1300,
        activities: [
          { ...ACTIVITIES[10], dayNumber: 4 },
          { ...ACTIVITIES[11], dayNumber: 4 },
          { ...ACTIVITIES[12], dayNumber: 5 }
        ]
      }
    ]
  },
  {
    id: "trip-sample-2",
    title: "Tokyo Neon & Heritage Odyssey",
    startDate: "2026-09-01",
    endDate: "2026-09-05",
    budgetLimit: 1900,
    stops: [
      {
        id: "stop-sample-3",
        cityId: "city-tokyo",
        cityName: "Tokyo",
        startDate: "2026-09-01",
        endDate: "2026-09-05",
        sectionBudget: 1900,
        activities: [
          { ...ACTIVITIES[5], dayNumber: 1 },
          { ...ACTIVITIES[6], dayNumber: 2 },
          { ...ACTIVITIES[7], dayNumber: 3 },
          { ...ACTIVITIES[8], dayNumber: 1 }
        ]
      }
    ]
  }
];
