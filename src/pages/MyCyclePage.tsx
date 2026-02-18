import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Calendar, Moon, Sparkles, HeartPulse, CloudMoon, MapPin } from "lucide-react";
import { authService } from "../services/authService";

const STORAGE_KEY_BASE = "fitflow_onboarding";
const LOGS_STORAGE_KEY = "fitflow_cycle_logs";

interface OnboardingData {
  gender?: string;
  lastPeriodStart?: string;
  cycleLengthDays?: string;
  periodFlowLevel?: string;
  periodCramps?: string;
  onBirthControl?: string;
  goals?: string;
  diet?: string;
}

interface CycleLog {
  flow: string;
  cramps: string;
  bloating: string;
}

const MyCyclePage = () => {
  const navigate = useNavigate();
  const [onboarding, setOnboarding] = useState<OnboardingData | null>(null);
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  });
  const [logs, setLogs] = useState<Record<string, CycleLog>>({});
  const [currentLog, setCurrentLog] = useState<CycleLog>({
    flow: "",
    cramps: "",
    bloating: "",
  });
  const [savingLog, setSavingLog] = useState(false);
  const [providers, setProviders] = useState([]);
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    const user = authService.getUser();
    if (!user) {
      setAllowed(false);
      navigate("/profile");
      return;
    }
    const key = `${STORAGE_KEY_BASE}_${user.id}`;
    const stored = localStorage.getItem(key);
    if (!stored) {
      setAllowed(false);
      navigate("/profile");
      return;
    }
    try {
      const parsed = JSON.parse(stored) as OnboardingData;
      setOnboarding(parsed);
      if (parsed.gender === "female") {
        setAllowed(true);
      } else {
        setAllowed(false);
        navigate("/profile");
      }
    } catch {
      setAllowed(false);
      navigate("/profile");
    }
  }, [navigate]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOGS_STORAGE_KEY);
      if (!raw) {
        return;
      }
      const parsed = JSON.parse(raw) as Record<string, CycleLog>;
      setLogs(parsed);
      if (parsed[selectedDate]) {
        setCurrentLog(parsed[selectedDate]);
      }
    } catch {
      setLogs({});
    }
  }, [selectedDate]);


  const cycleInfo = useMemo(() => {
    if (!onboarding?.lastPeriodStart) {
      return null;
    }
    const cycleLength = Number(onboarding.cycleLengthDays || 28);
    if (!Number.isFinite(cycleLength) || cycleLength <= 0) {
      return null;
    }

    const lastStart = new Date(onboarding.lastPeriodStart);
    if (Number.isNaN(lastStart.getTime())) {
      return null;
    }

    const today = new Date();
    const msPerDay = 1000 * 60 * 60 * 24;
    const daysSinceStart = Math.floor(
      (today.getTime() - lastStart.getTime()) / msPerDay
    );
    const dayInCycle = ((daysSinceStart % cycleLength) + cycleLength) % cycleLength;

    const nextStart = new Date(lastStart);
    while (nextStart < today) {
      nextStart.setDate(nextStart.getDate() + cycleLength);
    }
    const daysUntilNext = Math.max(
      0,
      Math.ceil((nextStart.getTime() - today.getTime()) / msPerDay)
    );

    let phase = "Menstrual";
    if (dayInCycle >= 5 && dayInCycle < 13) {
      phase = "Follicular";
    } else if (dayInCycle >= 13 && dayInCycle < 17) {
      phase = "Ovulatory";
    } else if (dayInCycle >= 17) {
      phase = "Luteal";
    }

    return {
      cycleLength,
      dayInCycle: dayInCycle + 1,
      daysUntilNext,
      nextStart,
      phase,
    };
  }, [onboarding]);

  const calendarDays = useMemo(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    const startWeekday = firstOfMonth.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells: {
      key: string;
      day: number | null;
      isToday: boolean;
      isPeriodWindow: boolean;
    }[] = [];

    for (let i = 0; i < startWeekday; i += 1) {
      cells.push({
        key: `empty-${i}`,
        day: null,
        isToday: false,
        isPeriodWindow: false,
      });
    }

    const nextStart = cycleInfo?.nextStart ?? null;

    for (let d = 1; d <= daysInMonth; d += 1) {
      const date = new Date(year, month, d);
      const isToday =
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate();

      let isPeriodWindow = false;
      if (nextStart) {
        const start = new Date(nextStart.getFullYear(), nextStart.getMonth(), nextStart.getDate());
        const end = new Date(start);
        end.setDate(end.getDate() + 4);
        isPeriodWindow = date >= start && date <= end;
      }

      cells.push({
        key: `day-${d}`,
        day: d,
        isToday,
        isPeriodWindow,
      });
    }

    return {
      monthLabel: today.toLocaleString(undefined, { month: "long", year: "numeric" }),
      cells,
    };
  }, [cycleInfo]);

  const selectedLog = logs[selectedDate] ?? currentLog;

  const handleSaveLog = () => {
    if (!selectedDate) {
      return;
    }
    const nextLogs = {
      ...logs,
      [selectedDate]: currentLog,
    };
    setSavingLog(true);
    setLogs(nextLogs);
    try {
      localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(nextLogs));
    } catch {
    } finally {
      setSavingLog(false);
    }
  };

  const phaseSpecificExerciseCopy = useMemo(() => {
    if (!cycleInfo) {
      return "We&apos;ll suggest general gentle vs stronger days once you add more cycle details.";
    }

    if (cycleInfo.phase === "Menstrual") {
      return "On bleed days, keep movement soft: walks, mobility flows and breath-led stretches work well.";
    }
    if (cycleInfo.phase === "Follicular") {
      return "This is often a high-energy window – it can be a good time for strength and slightly heavier sessions.";
    }
    if (cycleInfo.phase === "Ovulatory") {
      return "You may feel powerful here – if it feels good, lean into slightly more intense or performance-focused work.";
    }
    return "Late luteal days can feel more sensitive – low impact, grounding movement and more rest usually feel best.";
  }, [cycleInfo]);

  const phaseSpecificDietCopy = useMemo(() => {
    if (!cycleInfo) {
      return "Aim for steady blood sugar, hydration and iron-rich meals across your month.";
    }

    if (cycleInfo.phase === "Menstrual") {
      return "During your bleed, focus on iron-rich meals, warm foods and steady hydration to support energy.";
    }
    if (cycleInfo.phase === "Follicular") {
      return "In this building phase, protein and colourful plants support recovery and lean muscle.";
    }
    if (cycleInfo.phase === "Ovulatory") {
      return "Around ovulation, lighter, fresh meals can feel good if your appetite changes.";
    }
    return "In the luteal phase, fibre, protein and healthy fats help reduce big blood sugar swings and cravings.";
  }, [cycleInfo]);

  if (allowed === null) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-6 lg:px-28 py-10">
          <p className="text-muted-foreground">Loading your cycle data...</p>
        </div>
      </div>
    );
  }

  if (!allowed) {
    return null;
  }

  const infoBlobs = [
    {
      title: "Menstrual health",
      description:
        "Your cycle is a vital sign. Tracking patterns over time can highlight stress, sleep and nutrition needs.",
      tone: "Soft bleeding or irregular cycles are worth discussing with a professional.",
    },
    {
      title: "PMS",
      description:
        "Mood changes, cravings and fatigue are common in the late luteal phase.",
      tone: "Gentle movement, lighter workouts and good sleep can ease symptoms.",
    },
    {
      title: "PCOS",
      description:
        "Polycystic ovary syndrome can impact cycles, energy and weight.",
      tone: "Strength training, balanced nutrition and consistent movement often support PCOS management.",
    },
    {
      title: "Endometriosis",
      description:
        "Endometriosis can cause heavy, painful periods and deep pelvic pain.",
      tone: "Persistent pain, spotting or bowel discomfort around your cycle deserves medical attention.",
    },
    {
      title: "Hormonal balance",
      description:
        "Oestrogen and progesterone rise and fall across the month, affecting energy, mood and performance.",
      tone: "Cycling your workouts and recovery with these shifts can help you feel more in sync.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-sky-50">
      <Header />

      <div className="container mx-auto px-4 md:px-10 lg:px-28 py-10 space-y-10">
        <section className="grid md:grid-cols-[1.4fr,1fr] gap-8 items-center">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              My{" "}
              <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-sky-500 bg-clip-text text-transparent">
                Cycle
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl">
              A soft space to track your cycle, match workouts and recipes to your
              phase, and care for sleep and recovery with your hormones in mind.
            </p>
            <div className="flex flex-wrap gap-3">
              <Badge className="bg-rose-100 text-rose-700 border-rose-200">
                Cycle-aware training
              </Badge>
              <Badge className="bg-sky-100 text-sky-700 border-sky-200">
                Gentle & strong
              </Badge>
              <Badge className="bg-pink-100 text-pink-700 border-pink-200">
                Women&apos;s health first
              </Badge>
            </div>
          </div>

          <Card className="bg-gradient-to-br from-rose-100 via-pink-50 to-sky-100 border-pink-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-rose-600" />
                Cycle snapshot
              </CardTitle>
              <CardDescription>
                Based on the information you shared in your questionnaire.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {cycleInfo ? (
                <>
                  <div className="flex items-baseline justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Cycle phase</p>
                      <p className="text-xl font-semibold text-rose-700">
                        {cycleInfo.phase}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        Day in cycle
                      </p>
                      <p className="text-xl font-semibold">
                        Day {cycleInfo.dayInCycle} / {cycleInfo.cycleLength}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Next period estimate
                      </p>
                      <p className="font-medium">
                        {cycleInfo.nextStart.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        Days until next period
                      </p>
                      <p className="font-semibold">
                        {cycleInfo.daysUntilNext} days
                      </p>
                    </div>
                  </div>
                  {onboarding?.periodFlowLevel && (
                    <p className="text-sm">
                      Your flow is typically{" "}
                      <span className="font-medium">
                        {onboarding.periodFlowLevel.toLowerCase()}
                      </span>
                      , with{" "}
                      {onboarding.periodCramps
                        ? onboarding.periodCramps.toLowerCase()
                        : "symptoms you&apos;ve noted."}
                    </p>
                  )}
                  <div className="flex items-center justify-between pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate("/onboarding")}
                      className="border-rose-300 text-rose-700 hover:bg-rose-50"
                    >
                      Edit period details
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const today = new Date();
                        setSelectedDate(today.toISOString().slice(0, 10));
                      }}
                      className="border-sky-300 text-sky-700 hover:bg-sky-50"
                    >
                      Add today&apos;s log
                    </Button>
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Add your last period date and average cycle length in the
                    questionnaire to see a simple tracker here.
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate("/onboarding")}
                    className="border-rose-300 text-rose-700 hover:bg-rose-50"
                  >
                    Update cycle details
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        <section className="grid md:grid-cols-[1.4fr,1fr] gap-6">
          <Card className="border-rose-100/80 bg-white/80">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">This month at a glance</CardTitle>
              <CardDescription>
                A simple calendar view of your current cycle.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium">{calendarDays.monthLabel}</p>
                {cycleInfo && (
                  <p className="text-xs text-muted-foreground">
                    Today • Day {cycleInfo.dayInCycle} in your cycle
                  </p>
                )}
              </div>
              <div className="grid grid-cols-7 gap-1 text-xs mb-2 text-muted-foreground">
                <span>Sun</span>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
              </div>
              <div className="grid grid-cols-7 gap-2 text-sm">
                {calendarDays.cells.map((cell) =>
                  cell.day === null ? (
                    <div key={cell.key} />
                  ) : (
                    <div
                      key={cell.key}
                      className={`flex h-10 w-10 items-center justify-center rounded-full border text-xs ${
                        cell.isToday
                          ? "bg-rose-600 text-white border-rose-600"
                          : cell.isPeriodWindow
                          ? "bg-rose-100 text-rose-800 border-rose-200"
                          : "border-transparent bg-white/70 text-foreground"
                      }`}
                    >
                      {cell.day}
                    </div>
                  ),
                )}
              </div>
              {cycleInfo ? (
                <p className="mt-3 text-xs text-muted-foreground">
                  Highlighted days show the estimated window for your next period
                  based on your average cycle length.
                </p>
              ) : (
                <p className="mt-3 text-xs text-muted-foreground">
                  Add your cycle details to see your period window highlighted
                  on this calendar.
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="border-sky-100/80 bg-white/80">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Daily logs</CardTitle>
              <CardDescription>
                Capture flow, cramps and bloating for any day.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-0 text-sm">
              <div className="space-y-1">
                <Label htmlFor="log-date">Select day</Label>
                <Input
                  id="log-date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    const existing = logs[e.target.value];
                    if (existing) {
                      setCurrentLog(existing);
                    } else {
                      setCurrentLog({
                        flow: "",
                        cramps: "",
                        bloating: "",
                      });
                    }
                  }}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="flow">Flow level</Label>
                <select
                  id="flow"
                  value={currentLog.flow}
                  onChange={(e) =>
                    setCurrentLog((prev) => ({ ...prev, flow: e.target.value }))
                  }
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Choose</option>
                  <option value="light">Light</option>
                  <option value="medium">Medium</option>
                  <option value="heavy">Heavy</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cramps">Cramps</Label>
                <select
                  id="cramps"
                  value={currentLog.cramps}
                  onChange={(e) =>
                    setCurrentLog((prev) => ({ ...prev, cramps: e.target.value }))
                  }
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Choose</option>
                  <option value="none">None</option>
                  <option value="mild">Mild</option>
                  <option value="moderate">Moderate</option>
                  <option value="severe">Severe</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bloating">Bloating</Label>
                <select
                  id="bloating"
                  value={currentLog.bloating}
                  onChange={(e) =>
                    setCurrentLog((prev) => ({
                      ...prev,
                      bloating: e.target.value,
                    }))
                  }
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Choose</option>
                  <option value="none">None</option>
                  <option value="mild">Mild</option>
                  <option value="moderate">Moderate</option>
                  <option value="severe">Severe</option>
                </select>
              </div>

              <Button
                size="sm"
                className="w-full mt-1"
                disabled={savingLog}
                onClick={handleSaveLog}
              >
                {savingLog ? "Saving..." : "Save log"}
              </Button>

              {selectedLog.flow || selectedLog.cramps || selectedLog.bloating ? (
                <div className="text-xs text-muted-foreground pt-1">
                  <p className="font-medium text-foreground">
                    Summary for {selectedDate}
                  </p>
                  <p>
                    Flow: {selectedLog.flow || "not noted"} • Cramps:{" "}
                    {selectedLog.cramps || "not noted"} • Bloating:{" "}
                    {selectedLog.bloating || "not noted"}
                  </p>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </section>

        <section className="grid md:grid-cols-3 gap-6">
          <Card className="bg-rose-50/70 border-rose-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-rose-700">
                <HeartPulse className="h-5 w-5" />
                Track your cycle
              </CardTitle>
              <CardDescription>
                Notice patterns in energy, mood and cravings across your month.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-rose-900">
              <p>Use this space together with your favourite app or calendar to mark start dates, symptoms and how you feel.</p>
              <p>
                Over time you&apos;ll see when you usually feel strongest, when
                to go softer, and which days benefit most from rest.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-sky-50/70 border-sky-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sky-700">
                <Sparkles className="h-5 w-5" />
                Cycle-sync workouts
              </CardTitle>
              <CardDescription>
                Align your exercises with your cycle, not against it.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-sky-900">
              <p>{phaseSpecificExerciseCopy}</p>
              <p>On any day, listen to your body first – our suggestions are starting points, not rules.</p>
            </CardContent>
          </Card>

          <Card className="bg-pink-50/70 border-pink-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-pink-700">
                <Moon className="h-5 w-5" />
                Food & sleep
              </CardTitle>
              <CardDescription>
                Nourish recovery with gentle nutrition and sleep rituals.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-pink-900">
              <p>{phaseSpecificDietCopy}</p>
              <p>Wind-down routines, low light and calming movement can help ease hormonal sleep disruptions.</p>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold">
              Learn about your hormones
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl text-right">
              Soft, scrollable “blobs” of information you can dip into whenever
              you like.
            </p>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2">
            {infoBlobs.map((blob) => (
              <Card
                key={blob.title}
                className="min-w-[260px] max-w-xs rounded-3xl bg-gradient-to-br from-rose-50 via-white to-sky-50 border-rose-100/60 shadow-sm"
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{blob.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p className="text-muted-foreground">{blob.description}</p>
                  <p className="text-xs text-rose-900/80 flex items-center gap-1">
                    <CloudMoon className="h-3 w-3 text-rose-500" />
                    {blob.tone}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-6">
          <Card className="border-rose-100/80 bg-white/70">
            <CardHeader>
              <CardTitle>Recipes for your cycle</CardTitle>
              <CardDescription>
                Explore meals that match where you are in your month.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>
                Head over to our nutrition page for balanced recipes. On lower
                energy days, pick gentle, comforting options. On high energy
                days, go for protein-rich meals that support training.
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate("/recipes")}
                className="border-rose-300 text-rose-700 hover:bg-rose-50"
              >
                Browse recipes
              </Button>
            </CardContent>
          </Card>

          <Card className="border-sky-100/80 bg-white/70">
            <CardHeader>
              <CardTitle>Gentle movement & sleep</CardTitle>
              <CardDescription>
                Choose workouts that respect how your body feels today.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>
                On heavier or more symptomatic days, keep things soft: walks,
                mobility and breathing. When you feel stronger, explore our
                guided modules and AI-tracked exercises.
              </p>
              <div className="flex gap-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate("/modules")}
                  className="border-sky-300 text-sky-700 hover:bg-sky-50"
                >
                  View modules
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate("/exercises")}
                  className="border-sky-300 text-sky-700 hover:bg-sky-50"
                >
                  Start exercises
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mt-4">
          <Card className="border-rose-100/80 bg-white/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-rose-600" />
                Nearby gynaecologists and women&apos;s health support
              </CardTitle>
              <CardDescription>
                Quick access to clinics and hospitals near you for urgent concerns.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {userLocation && (
                <p className="text-xs text-muted-foreground">
                  Using your approximate location ({userLocation.lat.toFixed(2)},{" "}
                  {userLocation.lng.toFixed(2)}).
                </p>
              )}
              {loadingProviders ? (
                <p className="text-sm text-muted-foreground">
                  Finding nearby clinics and hospitals...
                </p>
              ) : providers.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  We couldn&apos;t find women&apos;s health providers nearby right
                  now. In an emergency, contact your local hospital or trusted
                  doctor directly.
                </p>
              ) : 
              <p className="text-[11px] text-muted-foreground pt-1">
                This list is informational only and not a substitute for medical
                advice. Always follow local emergency guidance.
              </p>
              }
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default MyCyclePage;
