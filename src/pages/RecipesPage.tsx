// pages/RecipesPage.tsx
// Updated with free Overpass API integration

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChefHat,
  Clock,
  Users,
  Play,
  Heart,
  MapPin,
  Star,
  MessageCircle,
  Share2,
  Utensils,
  Apple,
  Salad,
  Loader2,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import SpotifyEmbedPlayer from "@/components/SpotifyEmbedPlayer";
import { useEffect, useState } from "react";
import { fetchHealthyRestaurants,getUserLocation,type Restaurant } from "../services/placesService";
interface RecipeItem {
  id: number;
  name: string;
  image: string;
  time: string;
  difficulty: string;
  calories: string;
  description: string;
  type: "cheat" | "healthy";
  ingredients: string[];
  steps: string[];
  rating: number;
}

interface DietItem {
  name: string;
  description: string;
  color: string;
  carbs: number;
  protein: number;
  fat: number;
  fibre: number;
  missing: string;
  addFoods: string;
}

const RecipesPage = () => {
  const [nearbyRestaurants, setNearbyRestaurants] = useState<Restaurant[]>([]);
  const [loadingRestaurants, setLoadingRestaurants] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeItem | null>(null);
  const [selectedDiet, setSelectedDiet] = useState<DietItem | null>(null);

  const cheatMeals: RecipeItem[] = [
    {
      id: 1,
      name: "Ultimate Burger Stack",
      image: "🍔",
      time: "30 min",
      difficulty: "Easy",
      calories: "850 cal",
      description: "Juicy beef patty with crispy bacon and melted cheese",
      type: "cheat",
      ingredients: [
        "2 burger buns",
        "2 beef patties or vegetarian patties",
        "2 slices cheese",
        "2 strips crispy bacon",
        "Lettuce, tomato and onion",
        "Sauce of your choice",
      ],
      steps: [
        "Toast the burger buns lightly on a pan or grill.",
        "Cook the patties until browned on both sides and cooked through.",
        "Crisp the bacon in a pan until golden.",
        "Layer bun, sauce, lettuce and patty with cheese and bacon.",
        "Top with tomato, onion and the second bun, then serve warm.",
      ],
      rating: 4.5,
    },
    {
      id: 2,
      name: "Loaded Pizza",
      image: "🍕",
      time: "45 min",
      difficulty: "Medium",
      calories: "720 cal",
      description: "Homemade pizza with all your favorite toppings",
      type: "cheat",
      ingredients: [
        "Pizza base or naan",
        "Pizza sauce",
        "Grated mozzarella",
        "Sliced capsicum and onions",
        "Olives and jalapeños",
        "Your choice of protein or paneer",
      ],
      steps: [
        "Preheat the oven to 220°C.",
        "Spread pizza sauce evenly on the base.",
        "Add vegetables and protein or paneer over the sauce.",
        "Top with cheese and bake until the base is crisp and cheese melts.",
        "Slice and serve hot with chilli flakes and oregano.",
      ],
      rating: 4.3,
    },
    {
      id: 3,
      name: "Chocolate Brownies",
      image: "🍫",
      time: "25 min",
      difficulty: "Easy",
      calories: "420 cal",
      description: "Fudgy chocolate brownies with nuts",
      type: "cheat",
      ingredients: [
        "Dark chocolate",
        "Butter or ghee",
        "Sugar",
        "Flour",
        "Eggs or flax eggs",
        "Chopped nuts",
      ],
      steps: [
        "Melt chocolate and butter together until smooth.",
        "Whisk in sugar, then add eggs or flax eggs.",
        "Fold in flour and nuts until just combined.",
        "Pour into a lined tin and bake at 180°C for 18–20 minutes.",
        "Cool slightly, slice into squares and serve.",
      ],
      rating: 4.7,
    },
  ];

  const healthyMeals: RecipeItem[] = [
    {
      id: 1,
      name: "Quinoa Power Bowl",
      image: "🥗",
      time: "20 min",
      difficulty: "Easy",
      calories: "380 cal",
      description: "Nutrient-packed bowl with quinoa, vegetables, and protein",
      type: "healthy",
      ingredients: [
        "Cooked quinoa",
        "Mixed salad greens",
        "Cherry tomatoes and cucumber",
        "Roasted chickpeas or grilled paneer",
        "Lemon juice and olive oil",
      ],
      steps: [
        "Cook quinoa according to packet instructions and let it cool slightly.",
        "Arrange salad greens in a bowl.",
        "Top with quinoa, chopped vegetables and protein.",
        "Drizzle with lemon juice, olive oil, salt and pepper.",
        "Toss gently and serve fresh.",
      ],
      rating: 4.6,
    },
    {
      id: 2,
      name: "Grilled Salmon",
      image: "🐟",
      time: "25 min",
      difficulty: "Medium",
      calories: "320 cal",
      description: "Omega-3 rich salmon with roasted vegetables",
      type: "healthy",
      ingredients: [
        "Salmon fillet",
        "Olive oil",
        "Salt, pepper and garlic",
        "Lemon slices",
        "Mixed vegetables for roasting",
      ],
      steps: [
        "Marinate salmon with olive oil, garlic, salt and pepper.",
        "Spread vegetables on a tray with a little oil and seasoning.",
        "Roast vegetables at 200°C for 15–20 minutes.",
        "Grill or pan-sear salmon for 3–4 minutes each side.",
        "Serve salmon over vegetables with lemon on top.",
      ],
      rating: 4.4,
    },
    {
      id: 3,
      name: "Green Smoothie",
      image: "🥤",
      time: "5 min",
      difficulty: "Easy",
      calories: "180 cal",
      description: "Refreshing blend of spinach, fruits, and protein",
      type: "healthy",
      ingredients: [
        "A handful of spinach",
        "1 small banana",
        "Half an apple or mango",
        "Milk or plant milk",
        "Spoon of protein powder or seeds",
      ],
      steps: [
        "Add spinach, fruit, liquid and protein powder to a blender.",
        "Blend until smooth and creamy.",
        "Adjust thickness with more liquid if needed.",
        "Pour into a glass and serve chilled.",
      ],
      rating: 4.2,
    },
  ];

  const diets: DietItem[] = [
    {
      name: "Traditional Indian Vegetarian",
      description: "Dal, sabzi, roti, rice and curd based home-style plates",
      color: "bg-amber-100 text-amber-800",
      carbs: 55,
      protein: 15,
      fat: 25,
      fibre: 5,
      missing: "Often low in protein if dal portions are small.",
      addFoods: "Extra dal, paneer, curd, sprouts or lentil-based snacks.",
    },
    {
      name: "High-Protein Indian",
      description: "More paneer, curd, lentils, eggs and lean meats with roti/rice",
      color: "bg-green-100 text-green-800",
      carbs: 40,
      protein: 30,
      fat: 25,
      fibre: 5,
      missing: "Can miss out on colour and fibre if vegetables are low.",
      addFoods: "2–3 handfuls of seasonal vegetables and fruits daily.",
    },
    {
      name: "South Indian Plate",
      description: "Idli, dosa, sambar, curd rice with plenty of rice-based meals",
      color: "bg-blue-100 text-blue-800",
      carbs: 60,
      protein: 15,
      fat: 20,
      fibre: 5,
      missing: "Sometimes low in protein and raw vegetables.",
      addFoods: "Extra sambar, chutney with dals, salads and buttermilk.",
    },
    {
      name: "Balanced Mediterranean",
      description: "Olive oil, whole grains, vegetables, lentils, fish and nuts",
      color: "bg-purple-100 text-purple-800",
      carbs: 45,
      protein: 20,
      fat: 30,
      fibre: 5,
      missing: "May under-shoot total calories for heavy training days.",
      addFoods: "Nuts, seeds and an extra carb source around workouts.",
    },
  ];

  const indianDietColors = ["#f97316", "#22c55e", "#3b82f6", "#eab308"];

  const dishOfTheDay = {
    name: "Avocado Toast Supreme",
    image: "🥑",
    description: "Perfectly ripe avocado on sourdough with poached egg and everything seasoning",
    chef: "Chef Maria",
    rating: 4.8,
    time: "15 min",
  };

  // Fetch restaurants on mount
// inside RecipesPage component (replace existing useEffect)
useEffect(() => {
  const loadRestaurants = async () => {
    setLoadingRestaurants(true);

    // small helper to add timeout to the API call
    const withTimeout = <T,>(p: Promise<T>, ms = 10000) =>
      Promise.race([
        p,
        new Promise<T>((_, reject) =>
          setTimeout(() => reject(new Error("timeout")), ms)
        ),
      ]);

    try {
      const location = await getUserLocation();
      setUserLocation(location);

      // fetch with 10s timeout
      const restaurants = await withTimeout(
        fetchHealthyRestaurants(location.lat, location.lng, 2),
        10000
      );
      setNearbyRestaurants(restaurants);
    } catch (error) {
      console.error("Error loading restaurants (or timed out):", error);

      // try a quick fallback call without location (fast)
      try {
        const fallback = await Promise.race([
          fetchHealthyRestaurants(),
          new Promise<Restaurant[]>((_, reject) =>
            setTimeout(() => reject(new Error("fallback-timeout")), 5000)
          ),
        ]);
        setNearbyRestaurants(fallback);
      } catch (err2) {
        console.warn("Fallback failed:", err2);
        setNearbyRestaurants([]); // give up, show empty state
      }
    } finally {
      setLoadingRestaurants(false);
    }
  };

  loadRestaurants();
}, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-28 py-8 space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">
            Fuel Your <span className="text-primary">Fitness Journey</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover delicious recipes, nutrition tips, and food inspiration to complement your workouts
          </p>
        </div>

        {/* Dish of the Day */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-100 border-blue-400 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 hover:scale-[1.02]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Star className="h-5 w-5" />
              Dish of the Day
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="text-6xl">{dishOfTheDay.image}</div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-blue-900">{dishOfTheDay.name}</h3>
                <p className="text-blue-700 mb-2">{dishOfTheDay.description}</p>
                <div className="flex items-center gap-4 text-sm text-blue-600">
                  <span>By {dishOfTheDay.chef}</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-current" />
                    <span>{dishOfTheDay.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{dishOfTheDay.time}</span>
                  </div>
                </div>
              </div>
              <Button
                className="bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all"
                onClick={() => {
                  const recipeFromList =
                    healthyMeals.find((m) => m.name === dishOfTheDay.name) ||
                    cheatMeals.find((m) => m.name === dishOfTheDay.name);
                  if (recipeFromList) {
                    setSelectedRecipe(recipeFromList);
                  }
                }}
              >
                Get Recipe
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Cheat Meals */}
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border hover:border-primary/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Utensils className="h-5 w-5" />
                Cheat Meals
              </CardTitle>
              <CardDescription>Indulge responsibly with these delicious treats</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {cheatMeals.map((meal) => (
                <div
                  key={meal.id}
                  className="flex items-center gap-4 p-4 border border-border rounded-lg hover:border-primary/50 transition-all hover:shadow-md hover:scale-[1.02] cursor-pointer"
                  onClick={() => setSelectedRecipe(meal)}
                >
                  <div className="text-3xl">{meal.image}</div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{meal.name}</h4>
                    <p className="text-sm text-muted-foreground">{meal.description}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {meal.time}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {meal.calories}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="hover:bg-red-50 hover:text-red-600 transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Healthy Meals */}
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border hover:border-secondary/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Salad className="h-5 w-5" />
                Healthy Meals
              </CardTitle>
              <CardDescription>Nutritious recipes to fuel your workouts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {healthyMeals.map((meal) => (
                <div
                  key={meal.id}
                  className="flex items-center gap-4 p-4 border border-border rounded-lg hover:border-secondary/50 transition-all hover:shadow-md hover:scale-[1.02] cursor-pointer"
                  onClick={() => setSelectedRecipe(meal)}
                >
                  <div className="text-3xl">{meal.image}</div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{meal.name}</h4>
                    <p className="text-sm text-muted-foreground">{meal.description}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {meal.time}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {meal.calories}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="hover:bg-green-50 hover:text-green-600 transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Spotify Playlists */}
        <SpotifyEmbedPlayer />

        {/* Diet Information */}
        <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Apple className="h-5 w-5" />
              Popular Diets
            </CardTitle>
            <CardDescription>Learn about different dietary approaches</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {diets.map((diet, index) => (
                <div
                  key={index}
                  className="p-4 border border-border rounded-lg hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer"
                  onClick={() => setSelectedDiet(diet)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{diet.name}</h4>
                    <Badge className={diet.color}>{diet.name}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{diet.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        
{/* Restaurants Nearby */}
<Card className="shadow-lg hover:shadow-xl transition-all duration-300">
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <MapPin className="h-5 w-5" />
      Restaurants Nearby
    </CardTitle>

    <CardDescription>
      Healthy dining options
      {userLocation &&
        ` near (${userLocation.lat.toFixed(2)}, ${userLocation.lng.toFixed(2)})`}
    </CardDescription>
  </CardHeader>

  <CardContent>
    {loadingRestaurants ? (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
        <span className="text-muted-foreground">
          Finding healthy places near you...
        </span>
      </div>
    ) : nearbyRestaurants.length === 0 ? (
      <p className="text-sm text-muted-foreground py-6">
        No restaurants found nearby.
      </p>
    ) : (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nearbyRestaurants.map((restaurant, index) => {
          const mapsUrl =
            restaurant.mapsUrl ||
            `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              `${restaurant.name} ${restaurant.address || ""}`
            )}`;

          const FALLBACK_IMAGE =
            "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop";

          const imageUrl = restaurant.image || FALLBACK_IMAGE;

          return (
            <a
              key={index}
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl overflow-hidden border border-border bg-card hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Image */}
              <div className="h-44 overflow-hidden bg-muted relative">
                <img
                  src={imageUrl}
                  alt={restaurant.name}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = FALLBACK_IMAGE;
                  }}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Distance badge */}
                {restaurant.distance && (
                  <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                    {restaurant.distance} km
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4 space-y-2">
                <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition">
                  {restaurant.name}
                </h3>

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {restaurant.address || "Address not available"}
                </p>

                <div className="flex items-center justify-between mt-2">
                  {/* Rating */}
                  {restaurant.rating ? (
                    <div className="flex items-center gap-1 text-sm font-medium">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      {restaurant.rating}
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      No rating
                    </span>
                  )}

                  {/* Cuisine */}
                  <span className="text-xs bg-muted px-2 py-1 rounded-full">
                    {restaurant.cuisine || "Restaurant"}
                  </span>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    )}
  </CardContent>
</Card>

        {/* Food Memories Community Section */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-100 border-blue-400 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 hover:scale-[1.02]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <MessageCircle className="h-5 w-5" />
              Share Your Food Memories
            </CardTitle>
            <CardDescription className="text-blue-700">
              Connect with the community and share your favorite food experiences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-4xl">🍽️</div>
                <div>
                  <div className="font-semibold text-blue-800">Join the Food Community</div>
                  <div className="text-sm text-blue-600">
                    Share recipes, memories, and connect with fellow food lovers
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="border-blue-400 text-blue-700 hover:bg-blue-100 shadow-md hover:shadow-lg transition-all"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Memory
                </Button>
                <Link to="/community">
                  <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all">
                    <Users className="h-4 w-4 mr-2" />
                    Join Community
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {selectedRecipe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="max-w-lg w-full mx-4 rounded-3xl bg-card border border-border shadow-2xl">
            <div className="flex items-center justify-between px-6 pt-5 pb-2">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{selectedRecipe.image}</div>
                <div>
                  <h2 className="text-xl font-semibold">{selectedRecipe.name}</h2>
                  <p className="text-xs text-muted-foreground">
                    {selectedRecipe.type === "cheat" ? "Cheat meal" : "Healthy meal"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRecipe(null)}
                className="h-8 w-8 flex items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-muted"
              >
                ×
              </button>
            </div>
            <div className="px-6 pb-5 space-y-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {selectedRecipe.time}
                </span>
                <span className="flex items-center gap-1">
                  <ChefHat className="h-4 w-4" />
                  {selectedRecipe.difficulty}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="h-4 w-4 text-red-500" />
                  {selectedRecipe.calories}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Ingredients</p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  {selectedRecipe.ingredients.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Steps</p>
                <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
                  {selectedRecipe.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>
              <div className="border-t border-border pt-3 mt-2 text-xs text-muted-foreground">
                <p className="mb-1">Community rating</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="font-semibold text-foreground">
                      {selectedRecipe.rating.toFixed(1)}
                    </span>
                    <span>/ 5</span>
                  </div>
                  <Button variant="outline" size="sm">
                    Rate this recipe
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {selectedDiet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="max-w-xl w-full mx-4 rounded-3xl bg-card border border-border shadow-2xl">
            <div className="flex items-center justify-between px-6 pt-5 pb-2">
              <div>
                <h2 className="text-xl font-semibold">{selectedDiet.name}</h2>
                <p className="text-xs text-muted-foreground">
                  Typical macro distribution for a day on this pattern.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDiet(null)}
                className="h-8 w-8 flex items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-muted"
              >
                ×
              </button>
            </div>
            <div className="px-6 pb-6 space-y-4">
              <p className="text-sm text-muted-foreground">{selectedDiet.description}</p>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Carbs", value: selectedDiet.carbs },
                        { name: "Protein", value: selectedDiet.protein },
                        { name: "Fat", value: selectedDiet.fat },
                        { name: "Fibre", value: selectedDiet.fibre },
                      ]}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={2}
                    >
                      {indianDietColors.map((color, index) => (
                        <Cell key={color} fill={color} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid hsl(var(--border))",
                        boxShadow: "0 10px 30px rgba(15,23,42,0.18)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid md:grid-cols-2 gap-4 text-xs text-muted-foreground">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-foreground">What it may miss</p>
                  <p>{selectedDiet.missing}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-foreground">What you can add</p>
                  <p>{selectedDiet.addFoods}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipesPage;
