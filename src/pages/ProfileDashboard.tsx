import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Calendar,
  Trophy,
  Share2,
  ChefHat,
  Dumbbell,
  Target,
  Flame,
  Award,
  Star,
  LogOut
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { authService } from "@/services/authService";

const ONBOARDING_STORAGE_KEY_BASE = "fitflow_onboarding";

interface OnboardingSnapshot {
  heightCm?: string;
  weightKg?: string;
  age?: string;
  diet?: string;
  exerciseRoutine?: string;
  medicalHistory?: string;
  goals?: string;
  gender?: string;
}

interface ExerciseRecommendation {
  title: string;
  reason: string;
  target: "modules" | "exercises";
  id: string;
}

interface DietRecommendation {
  title: string;
  reason: string;
  target: "recipes";
  dietTag?: string;
}

const ProfileDashboard = () => {
  const [user, setUser] = useState(authService.getUser());
  const [userStats, setUserStats] = useState({ totalWorkouts: 0, totalMinutes: 0, currentStreak: 0 });
  const [heatmapData, setHeatmapData] = useState<Array<{ activity_date: string; workout_count: number }>>([]);
  const [onboarding, setOnboarding] = useState<OnboardingSnapshot | null>(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/auth');
  };

  useEffect(() => {
    try {
      if (!user) {
        setOnboarding(null);
        return;
      }
      const key = `${ONBOARDING_STORAGE_KEY_BASE}_${user.id}`;
      const raw = localStorage.getItem(key);
      if (raw) {
        setOnboarding(JSON.parse(raw) as OnboardingSnapshot);
      } else {
        setOnboarding(null);
      }
    } catch {
      setOnboarding(null);
    }
  }, [user]);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      try {
        const [stats, heatmap] = await Promise.all([
          authService.getUserStats(user.id),
          authService.getHeatmapData(user.id)
        ]);
        setUserStats(stats);
        setHeatmapData(heatmap);
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    };

    loadData();
  }, [user]);

  const exerciseRecommendations: ExerciseRecommendation[] = useMemo(() => {
    if (!onboarding) return [];

    const recs: ExerciseRecommendation[] = [];
    const goals = (onboarding.goals || "").toLowerCase();
    const routine = (onboarding.exerciseRoutine || "").toLowerCase();
    const medical = (onboarding.medicalHistory || "").toLowerCase();

    if (goals.includes("weight") || goals.includes("fat")) {
      recs.push({
        title: "Core Crusher",
        reason: "You mentioned fat loss – this mix of planks and crunches supports core strength and calorie burn.",
        target: "modules",
        id: "core-crusher"
      });
    }

    if (goals.includes("strength") || goals.includes("muscle")) {
      recs.push({
        title: "Upper Body Blast",
        reason: "Strength and muscle gain pair well with focused upper body work.",
        target: "modules",
        id: "upper-body-blast"
      });
    }

    if (goals.includes("legs") || goals.includes("lower body")) {
      recs.push({
        title: "Leg Day Power",
        reason: "You highlighted lower body – this plan focuses on legs and glutes.",
        target: "modules",
        id: "leg-day-power"
      });
    }

    if (recs.length === 0) {
      recs.push({
        title: "Upper Body Blast",
        reason: "A balanced starting point if you are still exploring your goals.",
        target: "modules",
        id: "upper-body-blast"
      });
    }

    if (medical.includes("knee") || medical.includes("back") || medical.includes("injury")) {
      recs.push({
        title: "Low-impact sessions",
        reason: "You mentioned injuries – start with controlled reps and focus on form.",
        target: "exercises",
        id: "planks"
      });
    } else if (routine.includes("beginner") || routine.includes("new") || routine.includes("starting")) {
      recs.push({
        title: "Form-focused AI tracking",
        reason: "You&apos;re new to training – AI-guided exercises help you build confidence safely.",
        target: "exercises",
        id: "bicep-curl"
      });
    }

    return recs;
  }, [onboarding]);

  const dietRecommendations: DietRecommendation[] = useMemo(() => {
    if (!onboarding) return [];

    const recs: DietRecommendation[] = [];
    const diet = (onboarding.diet || "").toLowerCase();
    const goals = (onboarding.goals || "").toLowerCase();

    if (diet.includes("vegan") || diet.includes("plant")) {
      recs.push({
        title: "Vegan and plant-based ideas",
        reason: "You prefer plant-based meals – explore vegan-friendly recipes and snacks.",
        target: "recipes",
        dietTag: "Vegan"
      });
    } else if (diet.includes("keto") || goals.includes("low carb")) {
      recs.push({
        title: "Lower-carb options",
        reason: "You indicated keto/low carb – look for higher-fat, lower-carb meals.",
        target: "recipes",
        dietTag: "Keto"
      });
    } else {
      recs.push({
        title: "Mediterranean-style meals",
        reason: "Balanced meals with healthy fats and fibre support most training goals.",
        target: "recipes",
        dietTag: "Mediterranean"
      });
    }

    if (goals.includes("performance") || goals.includes("muscle")) {
      recs.push({
        title: "Higher-protein choices",
        reason: "For strength and performance, prioritise protein in each meal.",
        target: "recipes"
      });
    } else if (goals.includes("sleep") || goals.includes("stress")) {
      recs.push({
        title: "Evening-friendly meals",
        reason: "Lighter dinners and balanced blood sugar can support sleep and mood.",
        target: "recipes"
      });
    }

    return recs;
  }, [onboarding]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="p-6">
            <p>Please log in to view your profile.</p>
            <Link to="/auth">
              <Button className="mt-4">Go to Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Generate heatmap from real data
  const generateHeatmapData = () => {
    const data = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 364);

    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - dayOfWeek);

    for (let week = 0; week < 53; week++) {
      const weekData = [];
      for (let day = 0; day < 7; day++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + (week * 7) + day);
        const dateStr = date.toISOString().split('T')[0];

        const activityData = heatmapData.find(d => {
          const dStr = typeof d.activity_date === 'string'
            ? d.activity_date.split('T')[0]
            : new Date(d.activity_date).toISOString().split('T')[0];
          return dStr === dateStr;
        });
        weekData.push({
          date: dateStr,
          count: activityData ? activityData.workout_count : 0
        });
      }
      data.push(weekData);
    }
    return data;
  };

  const processedHeatmapData = generateHeatmapData();

  const getHeatmapColor = (count: number) => {
    if (count === 0) return "bg-muted";
    if (count === 1) return "bg-green-200";
    if (count === 2) return "bg-green-400";
    if (count === 3) return "bg-green-600";
    return "bg-green-800";
  };

  const badges = [
    { id: 1, name: "First Workout", icon: "🏃", earned: true },
    { id: 2, name: "7 Day Streak", icon: "🔥", earned: true },
    { id: 3, name: "30 Workouts", icon: "💪", earned: true },
    { id: 4, name: "Perfect Week", icon: "⭐", earned: false },
    { id: 5, name: "100 Workouts", icon: "🏆", earned: false },
  ];

  const workoutCombinations = [
    { name: "Upper Body Blast", exercises: ["Bicep Curl", "Squats", "Shoulder Press"], duration: "25 min", id: "upper-body-blast"},
    { name: "Core Crusher", exercises: ["Planks", "Crunches", "Russian Twists"], duration: "20 min", id: "core-crusher",},
    { name: "Leg Day Power", exercises: ["Squats", "Lunges", "Calf Raises"], duration: "30 min", id: "leg-day-power", },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-28 py-8 space-y-8">
        {/* Profile Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback className="text-2xl">{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-3xl">{user.name}</CardTitle>
                <CardDescription className="text-lg">{user.email}</CardDescription>
                <div className="flex items-center gap-4 mt-2">
                  <Badge variant="secondary">Intermediate</Badge>
                  <span className="text-sm text-muted-foreground">Member since {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{userStats.totalWorkouts}</div>
                  <div className="text-sm text-muted-foreground">Total Workouts</div>
                  <div className="flex items-center gap-1 mt-1">
                    <Flame className="h-4 w-4 text-orange-500" />
                    <span className="text-sm font-medium">{userStats.currentStreak} day streak</span>
                  </div>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Activity Heatmap */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Workout Activity
            </CardTitle>
            <CardDescription>Your workout consistency over the past year</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="flex gap-1 justify-center">
                {processedHeatmapData.map((week, weekIndex) => {
                  const firstDay = new Date(week[0].date);
                  const isFirstWeekOfMonth = firstDay.getDate() <= 7;
                  const monthName = isFirstWeekOfMonth ? firstDay.toLocaleDateString('en-US', { month: 'short' }) : '';
                  const year = firstDay.getFullYear();
                  const isFirstWeek = weekIndex === 0;
                  const isLastWeek = weekIndex === heatmapData.length - 1;

                  return (
                    <div key={weekIndex} className="flex flex-col">
                      <div className="h-4 text-xs text-muted-foreground mb-1 text-center">
                        {monthName}
                      </div>
                      <div className="flex flex-col gap-1">
                        {week.map((day, dayIndex) => (
                          <div
                            key={dayIndex}
                            className={`w-3 h-3 rounded-sm ${getHeatmapColor(day.count)}`}
                            title={`${day.date}: ${day.count} workouts`}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center justify-center mt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>Less</span>
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded-sm bg-muted" />
                  <div className="w-3 h-3 rounded-sm bg-green-200" />
                  <div className="w-3 h-3 rounded-sm bg-green-400" />
                  <div className="w-3 h-3 rounded-sm bg-green-600" />
                  <div className="w-3 h-3 rounded-sm bg-green-800" />
                </div>
                <span>More</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {onboarding && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="h-5 w-5" />
                Recommended Exercises
              </CardTitle>
              <CardDescription>
                Suggestions based on what you shared in your questionnaire.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {exerciseRecommendations.map((rec, index) => (
                <div
                  key={`${rec.id}-${index}`}
                  className="flex items-start justify-between gap-4 p-4 border border-border rounded-lg hover:border-primary/50 transition-colors"
                >
                  <div className="space-y-1">
                    <h4 className="font-semibold">{rec.title}</h4>
                    <p className="text-sm text-muted-foreground">{rec.reason}</p>
                  </div>
                  {rec.target === "modules" && (
                    <Button
                      size="sm"
                      onClick={() => navigate(`/modules/${rec.id}`)}
                    >
                      Open module
                    </Button>
                  )}
                  {rec.target === "exercises" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate("/exercises")}
                    >
                      Choose exercises
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {onboarding && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChefHat className="h-5 w-5" />
                Recommended Nutrition
              </CardTitle>
              <CardDescription>
                Diet ideas matched to your preferences and goals.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {dietRecommendations.map((rec, index) => (
                <div
                  key={`${rec.title}-${index}`}
                  className="flex items-start justify-between gap-4 p-4 border border-border rounded-lg hover:border-secondary/50 transition-colors"
                >
                  <div className="space-y-1">
                    <h4 className="font-semibold">{rec.title}</h4>
                    <p className="text-sm text-muted-foreground">{rec.reason}</p>
                    {rec.dietTag && (
                      <Badge variant="outline" className="mt-1 text-xs">
                        {rec.dietTag}
                      </Badge>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate("/recipes")}
                  >
                    Open recipes
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Workout Combinations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Try This One Next!
              </CardTitle>
              <CardDescription>Checkout these workout combinations tailored for you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {workoutCombinations.map((combo, index) => (
                <div key={index} className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{combo.name}</h4>
                    <Badge variant="outline">{combo.duration}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {combo.exercises.map((exercise, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {exercise}
                      </Badge>
                    ))}
                  </div>

                  

                  <Link to={`/modules/${combo.id}`}>
                    <Button size="sm" className="w-full mt-3">
                      Start Workout
                    </Button>
                  </Link>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Badges & Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Achievements
              </CardTitle>
              <CardDescription>Share these achievements with the community!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {badges.map((badge) => (
                  <div
                    key={badge.id}
                    className={`p-4 border rounded-lg text-center transition-all ${badge.earned
                        ? "border-primary bg-primary/5 hover:bg-primary/10"
                        : "border-muted bg-muted/20 opacity-50"
                      }`}
                  >
                    <div className="text-2xl mb-2">{badge.icon}</div>
                    <div className="text-sm font-medium">{badge.name}</div>
                    {badge.earned && (
                      <Button size="sm" variant="ghost" className="mt-2 h-6 text-xs">
                        <Share2 className="h-3 w-3 mr-1" />
                        Share
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Food/Diet Section */}
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <ChefHat className="h-5 w-5" />
              Good Job Today!
            </CardTitle>
            <CardDescription className="text-green-700">
              You've earned a well-deserved meal! Check out our nutrition page for healthy recipes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-4xl">🍎</div>
                <div>
                  <div className="font-semibold text-green-800">Fuel Your Progress</div>
                  <div className="text-sm text-green-600">Discover meals that complement your workout</div>
                </div>
              </div>
              <Button className="bg-green-600 hover:bg-green-700">
                <Link to="/recipes">
                  View Nutrition Guide
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileDashboard;
