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

  // 3. Seed Master Cities
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
    }
  ];

  const cityMap = {};
  for (const c of citiesData) {
    const created = await prisma.city.create({ data: c });
    cityMap[c.name] = created;
  }
  console.log(`🏙️ Created ${Object.keys(cityMap).length} Cities`);

  // 4. Seed Activities
  const activitiesData = [
    // Paris Activities
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
    {
      cityId: cityMap["Paris"].id,
      title: "Paris Metro & RER Unlimited Day Pass",
      category: "Transport",
      estimatedCost: 18,
      durationHours: 24,
      imageUrl: "https://images.unsplash.com/photo-1508873696983-2df515122519?auto=format&fit=crop&w=600&q=80",
      description: "Unlimited travel on Metro, RER, and bus routes across central Paris."
    },

    // Tokyo Activities
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
    {
      cityId: cityMap["Tokyo"].id,
      title: "Shinjuku Ryokan Onsen & Spa Experience",
      category: "Stay",
      estimatedCost: 240,
      durationHours: 24,
      imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80",
      description: "Traditional tatami suite featuring natural thermal spring baths right in Shinjuku."
    },
    {
      cityId: cityMap["Tokyo"].id,
      title: "Shinkansen Bullet Train Express Pass",
      category: "Transport",
      estimatedCost: 85,
      durationHours: 4,
      imageUrl: "https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?auto=format&fit=crop&w=600&q=80",
      description: "High-speed rail travel connecting Tokyo, Kyoto, and Osaka."
    },

    // Rome Activities
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
    {
      cityId: cityMap["Rome"].id,
      title: "Hotel Artemide Boutique Stay",
      category: "Stay",
      estimatedCost: 210,
      durationHours: 24,
      imageUrl: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=600&q=80",
      description: "Elegant boutique hotel with rooftop cocktail lounge near Trevi Fountain."
    },

    // NYC Activities
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

    // Bali Activities
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

    // Barcelona Activities
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
                  customTitle: "Hôtel Plaza Athénée Luxury Stay",
                  category: "Stay",
                  cost: 380,
                  dayNumber: 1
                },
                {
                  customTitle: "Louvre Museum Masterpieces Guided Walk",
                  category: "Sightseeing",
                  cost: 50,
                  dayNumber: 2
                },
                {
                  customTitle: "Paris Metro & RER Unlimited Day Pass",
                  category: "Transport",
                  cost: 18,
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
                },
                {
                  customTitle: "Hotel Artemide Boutique Stay",
                  category: "Stay",
                  cost: 210,
                  dayNumber: 5
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
      title: "Tokyo Neon & Heritage Odyssey",
      description: "A 5-day immersive expedition across Tokyo modern & historic sights.",
      startDate: new Date("2026-09-01"),
      endDate: new Date("2026-09-05"),
      totalBudget: 1900,
      isPublic: true,
      status: "UPCOMING",
      stops: {
        create: [
          {
            cityId: cityMap["Tokyo"].id,
            stopOrder: 1,
            startDate: new Date("2026-09-01"),
            endDate: new Date("2026-09-05"),
            sectionBudget: 1900,
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
                },
                {
                  customTitle: "Mount Fuji & Lake Kawaguchiko Day Trip",
                  category: "Sightseeing",
                  cost: 110,
                  dayNumber: 3
                },
                {
                  customTitle: "Shinjuku Ryokan Onsen & Spa Experience",
                  category: "Stay",
                  cost: 240,
                  dayNumber: 1
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
