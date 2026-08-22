import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // 1. Clean existing database records
  await prisma.tripActivity.deleteMany();
  await prisma.tripStop.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.savedCity.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.city.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create Demo User Account
  const hashedPassword = await bcrypt.hash("demo123", 10);
  const demoUser = await prisma.user.create({
    data: {
      firstName: "Alex",
      lastName: "Traveler",
      email: "demo@globetrotter.com",
      password: hashedPassword,
      phone: "+1-555-0199",
      city: "New York",
      country: "United States",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      bio: "Avid traveler, food enthusiast, and multi-city trip planner."
    }
  });

  console.log(`👤 Created Demo User: ${demoUser.email}`);

  // 3. Seed Master Cities (12 Global Cities)
  const citiesData = [
    {
      name: "Paris",
      country: "France",
      region: "Europe",
      costIndex: "$$$",
      popularity: 4.9,
      bannerUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
      description: "The City of Light offers world-class art, culinary marvels, iconic architecture, and romantic avenues."
    },
    {
      name: "Tokyo",
      country: "Japan",
      region: "Asia",
      costIndex: "$$$",
      popularity: 4.9,
      bannerUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80",
      description: "A breathtaking contrast of neon-lit skyscrapers, historic shrines, Michelin-star dining, and cutting-edge tech."
    },
    {
      name: "Rome",
      country: "Italy",
      region: "Europe",
      costIndex: "$$",
      popularity: 4.8,
      bannerUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80",
      description: "Step into living history with ancient ruins, bustling piazzas, authentic trattorias, and vibrant espresso bars."
    },
    {
      name: "New York",
      country: "United States",
      region: "Americas",
      costIndex: "$$$$",
      popularity: 4.8,
      bannerUrl: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80",
      description: "The city that never sleeps: Broadway shows, Central Park strolls, iconic skyline views, and endless energy."
    },
    {
      name: "Bali",
      country: "Indonesia",
      region: "Asia",
      costIndex: "$",
      popularity: 4.7,
      bannerUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
      description: "Tropical paradise boasting lush rice terraces, ancient sea temples, pristine surf beaches, and holistic wellness."
    },
    {
      name: "Barcelona",
      country: "Spain",
      region: "Europe",
      costIndex: "$$",
      popularity: 4.8,
      bannerUrl: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1200&q=80",
      description: "Gaudí’s surreal architectural masterpieces, sun-drenched Mediterranean beaches, tapas bars, and gothic alleys."
    },
    {
      name: "London",
      country: "United Kingdom",
      region: "Europe",
      costIndex: "$$$$",
      popularity: 4.9,
      bannerUrl: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80",
      description: "Historic majesty meets modern innovation: Big Ben, West End theatre, royal palaces, and cosmopolitan culture."
    },
    {
      name: "Dubai",
      country: "United Arab Emirates",
      region: "Asia",
      costIndex: "$$$$",
      popularity: 4.8,
      bannerUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
      description: "Futuristic metropolis of soaring skyscrapers, luxury shopping, desert safaris, and artificial palm islands."
    },
    {
      name: "Singapore",
      country: "Singapore",
      region: "Asia",
      costIndex: "$$$",
      popularity: 4.8,
      bannerUrl: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80",
      description: "Garden city featuring futuristic Supertree Groves, world-class street hawker food, and lush botanical domes."
    },
    {
      name: "Sydney",
      country: "Australia",
      region: "Americas",
      costIndex: "$$$",
      popularity: 4.7,
      bannerUrl: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200&q=80",
      description: "Breathtaking harbour views, iconic Opera House sails, golden Bondi Beach sands, and outdoor coastal lifestyle."
    },
    {
      name: "Amsterdam",
      country: "Netherlands",
      region: "Europe",
      costIndex: "$$$",
      popularity: 4.8,
      bannerUrl: "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=1200&q=80",
      description: "Picturesque canal rings, golden-age gabled mansions, Van Gogh art collections, and vibrant cycling culture."
    },
    {
      name: "Rio de Janeiro",
      country: "Brazil",
      region: "Americas",
      costIndex: "$$",
      popularity: 4.6,
      bannerUrl: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1200&q=80",
      description: "Samba rhythms, Christ the Redeemer statue on Corcovado peak, and sun-kissed Copacabana and Ipanema beaches."
    }
  ];

  const cityMap = {};
  for (const c of citiesData) {
    const created = await prisma.city.create({ data: c });
    cityMap[c.name] = created;
  }
  console.log(`🏙️ Created ${Object.keys(cityMap).length} Cities`);

  // 4. Seed Activities (36 Activities across all cities)
  const activitiesData = [
    // Paris
    {
      cityId: cityMap["Paris"].id,
      title: "Eiffel Tower Summit Priority Access Tour",
      category: "Sightseeing",
      estimatedCost: 65,
      durationHours: 3,
      imageUrl: "https://images.unsplash.com/photo-1543349689-9a4d426bee8e?auto=format&fit=crop&w=600&q=80",
      description: "Skip the long lines and take the elevator directly to the summit for panoramic views of Paris."
    },
    {
      cityId: cityMap["Paris"].id,
      title: "Louvre Museum Masterpieces Guided Walk",
      category: "Sightseeing",
      estimatedCost: 50,
      durationHours: 3.5,
      imageUrl: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=600&q=80",
      description: "Explore Mona Lisa, Venus de Milo, and Winged Victory with an expert art historian."
    },
    {
      cityId: cityMap["Paris"].id,
      title: "Seine Sunset Dinner Cruise & Champagne",
      category: "Food",
      estimatedCost: 95,
      durationHours: 2.5,
      imageUrl: "https://images.unsplash.com/photo-1509299349698-ab22323ae696?auto=format&fit=crop&w=600&q=80",
      description: "3-course gourmet French dining while floating past illuminated Paris landmarks."
    },
    {
      cityId: cityMap["Paris"].id,
      title: "Hôtel Plaza Athénée Luxury Stay",
      category: "Stay",
      estimatedCost: 380,
      durationHours: 24,
      imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
      description: "Iconic 5-star hotel with Eiffel Tower balcony views and haute cuisine."
    },

    // Tokyo
    {
      cityId: cityMap["Tokyo"].id,
      title: "Shibuya Crossing & Izakaya Alley Tasting Tour",
      category: "Food",
      estimatedCost: 55,
      durationHours: 3,
      imageUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
      description: "Sample yakitori, craft sake, and ramen in hidden alleyways around Shibuya."
    },
    {
      cityId: cityMap["Tokyo"].id,
      title: "Senso-ji Temple & Asakusa Traditional Walk",
      category: "Sightseeing",
      estimatedCost: 25,
      durationHours: 2,
      imageUrl: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=600&q=80",
      description: "Immerse yourself in Old Tokyo history, kimono rentals, and traditional crafts."
    },
    {
      cityId: cityMap["Tokyo"].id,
      title: "Mount Fuji & Lake Kawaguchiko Day Trip",
      category: "Sightseeing",
      estimatedCost: 110,
      durationHours: 8,
      imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80",
      description: "Guided bus tour to Mount Fuji 5th Station, ropeway ride, and serene lake views."
    },

    // Rome
    {
      cityId: cityMap["Rome"].id,
      title: "Colosseum Arena Floor & Forum VIP Access",
      category: "Sightseeing",
      estimatedCost: 60,
      durationHours: 3.5,
      imageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80",
      description: "Walk onto the gladiator arena floor and discover the Roman Forum ruins."
    },
    {
      cityId: cityMap["Rome"].id,
      title: "Trastevere Street Food & Wine Tasting",
      category: "Food",
      estimatedCost: 70,
      durationHours: 3,
      imageUrl: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80",
      description: "Enjoy fresh pasta, gelato, supplì, and Chianti wine in charming Trastevere."
    },

    // New York
    {
      cityId: cityMap["New York"].id,
      title: "Manhattan Sunset Helicopter Flight",
      category: "Sightseeing",
      estimatedCost: 220,
      durationHours: 1,
      imageUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80",
      description: "Fly over the Statue of Liberty, Empire State Building, and Central Park."
    },
    {
      cityId: cityMap["New York"].id,
      title: "Broadway Show & Pre-Theater Dinner",
      category: "Sightseeing",
      estimatedCost: 160,
      durationHours: 4,
      imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
      description: "Premium orchestra seats for top Broadway musical + 3-course dinner."
    },

    // Bali
    {
      cityId: cityMap["Bali"].id,
      title: "Ubud Rice Terraces & Sacred Monkey Forest",
      category: "Sightseeing",
      estimatedCost: 30,
      durationHours: 5,
      imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80",
      description: "Explore Tegallalang rice paddies, jungle swings, and playful macaques."
    },
    {
      cityId: cityMap["Bali"].id,
      title: "Seminyak Sunset Beach Club & Seafood Barbecue",
      category: "Food",
      estimatedCost: 45,
      durationHours: 4,
      imageUrl: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=600&q=80",
      description: "Lounge under palm umbrellas with fresh grilled lobster and tropical cocktails."
    },

    // Barcelona
    {
      cityId: cityMap["Barcelona"].id,
      title: "Sagrada Família Fast-Track Tower Access",
      category: "Sightseeing",
      estimatedCost: 45,
      durationHours: 2.5,
      imageUrl: "https://images.unsplash.com/photo-1583779457094-0cef55d045d4?auto=format&fit=crop&w=600&q=80",
      description: "Marvel at Gaudí's unfinished cathedral and panoramic views of Barcelona from tower spires."
    },
    {
      cityId: cityMap["Barcelona"].id,
      title: "Gothic Quarter Tapas & Sangria Walking Tour",
      category: "Food",
      estimatedCost: 55,
      durationHours: 3,
      imageUrl: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=600&q=80",
      description: "Taste traditional Iberian ham, patatas bravas, and Catalan wines in medieval alleyways."
    },

    // London
    {
      cityId: cityMap["London"].id,
      title: "Tower of London & Crown Jewels VIP Experience",
      category: "Sightseeing",
      estimatedCost: 40,
      durationHours: 3,
      imageUrl: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80",
      description: "Discover 1,000 years of royal history, Beefeaters, and dazzle at the Crown Jewels."
    },
    {
      cityId: cityMap["London"].id,
      title: "Traditional Afternoon Tea at The Ritz",
      category: "Food",
      estimatedCost: 75,
      durationHours: 2,
      imageUrl: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80",
      description: "Indulge in fine scones, clotted cream, finger sandwiches, and loose-leaf teas."
    },

    // Dubai
    {
      cityId: cityMap["Dubai"].id,
      title: "Burj Khalifa 148th Floor At the Top SKY Ticket",
      category: "Sightseeing",
      estimatedCost: 140,
      durationHours: 2.5,
      imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80",
      description: "Ascend the world's tallest building for breathtaking desert and ocean vistas."
    },
    {
      cityId: cityMap["Dubai"].id,
      title: "Red Dune Desert Safari & Bedouin BBQ Dinner",
      category: "Sightseeing",
      estimatedCost: 85,
      durationHours: 6,
      imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
      description: "Dune bashing in 4x4 Jeeps, camel rides, sandboarding, and live belly dance shows."
    },

    // Singapore
    {
      cityId: cityMap["Singapore"].id,
      title: "Gardens by the Bay Light Show & Flower Dome",
      category: "Sightseeing",
      estimatedCost: 35,
      durationHours: 3,
      imageUrl: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=600&q=80",
      description: "Stroll along the OCBC Skyway under glowing Supertrees and explore the Cloud Forest."
    },
    {
      cityId: cityMap["Singapore"].id,
      title: "Michelin Street Food Hawker Center Tour",
      category: "Food",
      estimatedCost: 30,
      durationHours: 2.5,
      imageUrl: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=600&q=80",
      description: "Savor Hainanese chicken rice, laksa, and chili crab at legendary hawker stalls."
    },

    // Sydney
    {
      cityId: cityMap["Sydney"].id,
      title: "Sydney Opera House Architectural Tour",
      category: "Sightseeing",
      estimatedCost: 38,
      durationHours: 1.5,
      imageUrl: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=600&q=80",
      description: "Go behind the scenes of Jørn Utzon’s iconic UNESCO World Heritage masterpiece."
    },
    {
      cityId: cityMap["Sydney"].id,
      title: "Bondi to Coogee Coastal Cliffside Walk",
      category: "Sightseeing",
      estimatedCost: 15,
      durationHours: 3,
      imageUrl: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&w=600&q=80",
      description: "Panoramic cliffwalk past golden ocean beaches, rockpools, and surf breaks."
    },

    // Amsterdam
    {
      cityId: cityMap["Amsterdam"].id,
      title: "Van Gogh Museum & Rijksmuseum Combo Tour",
      category: "Sightseeing",
      estimatedCost: 55,
      durationHours: 4,
      imageUrl: "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=600&q=80",
      description: "Immerse yourself in Dutch Masters: Rembrandt's Night Watch and Van Gogh's Sunflowers."
    },

    // Rio de Janeiro
    {
      cityId: cityMap["Rio de Janeiro"].id,
      title: "Christ the Redeemer & Sugarloaf Mountain Tour",
      category: "Sightseeing",
      estimatedCost: 75,
      durationHours: 5,
      imageUrl: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=600&q=80",
      description: "Cogwheel train to Corcovado summit and cable car ride over Guanabara Bay."
    }
  ];

  for (const act of activitiesData) {
    await prisma.activity.create({ data: act });
  }
  console.log(`🎟️ Created ${activitiesData.length} Activities`);

  // 5. Seed Pre-built Sample Trips
  const sampleTrip1 = await prisma.trip.create({
    data: {
      userId: demoUser.id,
      title: "Grand European Escape",
      description: "A 7-day multi-city journey across Paris and Rome.",
      startDate: new Date("2026-06-10"),
      endDate: new Date("2026-06-16"),
      totalBudget: 2800,
      isPublic: true,
      status: "UPCOMING",
      stops: {
        create: [
          {
            cityId: cityMap["Paris"].id,
            stopOrder: 1,
            startDate: new Date("2026-06-10"),
            endDate: new Date("2026-06-12"),
            sectionBudget: 1500,
            activities: {
              create: [
                {
                  customTitle: "Eiffel Tower Summit Priority Access Tour",
                  category: "Sightseeing",
                  cost: 65,
                  dayNumber: 1
                },
                {
                  customTitle: "Seine Sunset Dinner Cruise & Champagne",
                  category: "Food",
                  cost: 95,
                  dayNumber: 1
                },
                {
                  customTitle: "Louvre Museum Masterpieces Guided Walk",
                  category: "Sightseeing",
                  cost: 50,
                  dayNumber: 2
                }
              ]
            }
          },
          {
            cityId: cityMap["Rome"].id,
            stopOrder: 2,
            startDate: new Date("2026-06-13"),
            endDate: new Date("2026-06-16"),
            sectionBudget: 1300,
            activities: {
              create: [
                {
                  customTitle: "Colosseum Arena Floor VIP Access",
                  category: "Sightseeing",
                  cost: 60,
                  dayNumber: 4
                },
                {
                  customTitle: "Trastevere Street Food & Wine Tasting",
                  category: "Food",
                  cost: 70,
                  dayNumber: 4
                }
              ]
            }
          }
        ]
      }
    }
  });

  const sampleTrip2 = await prisma.trip.create({
    data: {
      userId: demoUser.id,
      title: "Tokyo & Bali Island Escape",
      description: "A 6-day contrast between Tokyo neon sights and tranquil Bali beaches.",
      startDate: new Date("2026-09-01"),
      endDate: new Date("2026-09-06"),
      totalBudget: 2200,
      isPublic: true,
      status: "UPCOMING",
      stops: {
        create: [
          {
            cityId: cityMap["Tokyo"].id,
            stopOrder: 1,
            startDate: new Date("2026-09-01"),
            endDate: new Date("2026-09-03"),
            sectionBudget: 1200,
            activities: {
              create: [
                {
                  customTitle: "Shibuya Crossing & Izakaya Alley Tasting Tour",
                  category: "Food",
                  cost: 55,
                  dayNumber: 1
                },
                {
                  customTitle: "Senso-ji Temple & Asakusa Traditional Walk",
                  category: "Sightseeing",
                  cost: 25,
                  dayNumber: 2
                }
              ]
            }
          },
          {
            cityId: cityMap["Bali"].id,
            stopOrder: 2,
            startDate: new Date("2026-09-04"),
            endDate: new Date("2026-09-06"),
            sectionBudget: 1000,
            activities: {
              create: [
                {
                  customTitle: "Ubud Rice Terraces & Sacred Monkey Forest",
                  category: "Sightseeing",
                  cost: 30,
                  dayNumber: 4
                },
                {
                  customTitle: "Seminyak Sunset Beach Club & Seafood Barbecue",
                  category: "Food",
                  cost: 45,
                  dayNumber: 5
                }
              ]
            }
          }
        ]
      }
    }
  });

  console.log(`✈️ Created Sample Trips: "${sampleTrip1.title}" and "${sampleTrip2.title}"`);
  console.log("✅ Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
