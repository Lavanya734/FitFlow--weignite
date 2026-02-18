import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/authService";

type Gender = "male" | "female" | "other" | "prefer_not";

interface OnboardingAnswers {
  heightCm: string;
  weightKg: string;
  age: string;
  diet: string;
  exerciseRoutine: string;
  medicalHistory: string;
  goals: string;
  gender: Gender | "";
  periodFlowLevel: string;
  periodCramps: string;
  onBirthControl: string;
  lastPeriodStart: string;
  cycleLengthDays: string;
}

const STORAGE_KEY_BASE = "fitflow_onboarding";
const STORAGE_COMPLETED_KEY_BASE = "fitflow_onboarding_completed";

const defaultAnswers: OnboardingAnswers = {
  heightCm: "",
  weightKg: "",
  age: "",
  diet: "",
  exerciseRoutine: "",
  medicalHistory: "",
  goals: "",
  gender: "",
  periodFlowLevel: "",
  periodCramps: "",
  onBirthControl: "",
  lastPeriodStart: "",
  cycleLengthDays: "",
};

interface QuestionConfig {
  id: keyof OnboardingAnswers;
  label: string;
  description: string;
  type: "text" | "number" | "select" | "textarea" | "date";
  options?: string[];
  required?: boolean;
}

const baseQuestions: QuestionConfig[] = [
  {
    id: "heightCm",
    label: "Height (cm)",
    description: "This helps us suggest workouts that suit your body.",
    type: "number",
    required: true,
  },
  {
    id: "weightKg",
    label: "Weight (kg)",
    description: "Used to better estimate effort and progress.",
    type: "number",
    required: true,
  },
  {
    id: "age",
    label: "Age",
    description: "Different ages often benefit from different training styles.",
    type: "number",
    required: true,
  },
  {
    id: "diet",
    label: "Diet preference",
    description: "E.g. vegetarian, vegan, non-veg, high-protein, etc.",
    type: "text",
  },
  {
    id: "exerciseRoutine",
    label: "Current exercise routine",
    description: "How often and what kind of workouts do you usually do?",
    type: "text",
  },
  {
    id: "medicalHistory",
    label: "Medical history / injuries",
    description: "Anything we should keep in mind while suggesting workouts?",
    type: "text",
  },
  {
    id: "goals",
    label: "What are you looking for after joining this app?",
    description: "Fat loss, strength, flexibility, better sleep, stress relief, etc.",
    type: "text",
  },
  {
    id: "gender",
    label: "Gender",
    description: "We customise some experiences based on this.",
    type: "select",
    options: ["male", "female", "other", "prefer_not"],
    required: true,
  },
];

const femaleQuestions: QuestionConfig[] = [
  {
    id: "lastPeriodStart",
    label: "When did your last period start?",
    description: "Helps us roughly estimate where you are in your cycle.",
    type: "date",
  },
  {
    id: "cycleLengthDays",
    label: "Average cycle length (days)",
    description: "Most people are around 28 days, but it can vary.",
    type: "number",
  },
  {
    id: "periodFlowLevel",
    label: "Typical flow level",
    description: "For example: light, medium, heavy.",
    type: "text",
  },
  {
    id: "periodCramps",
    label: "Cramps or PMS symptoms",
    description: "E.g. mild cramps, migraines, mood changes, etc.",
    type: "text",
  },
  {
    id: "onBirthControl",
    label: "Are you currently on birth control?",
    description: "Optional, but can affect cycle patterns.",
    type: "select",
    options: ["yes", "no", "prefer_not"],
  },
];

const OnboardingQuestionnaire = () => {
  const navigate = useNavigate();
  const user = authService.getUser();
  const userSuffix = user ? `_${user.id}` : "";
  const STORAGE_KEY = `${STORAGE_KEY_BASE}${userSuffix}`;
  const STORAGE_COMPLETED_KEY = `${STORAGE_COMPLETED_KEY_BASE}${userSuffix}`;

  const [answers, setAnswers] = useState<OnboardingAnswers>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Partial<OnboardingAnswers>;
        return { ...defaultAnswers, ...parsed };
      } catch {
        return defaultAnswers;
      }
    }
    return defaultAnswers;
  });
  const [currentIndex, setCurrentIndex] = useState(0);
   const [isFinishing, setIsFinishing] = useState(false);

  const questions = useMemo(() => {
    if (answers.gender === "female") {
      return [...baseQuestions, ...femaleQuestions];
    }
    return baseQuestions;
  }, [answers.gender]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
  }, [answers]);

  useEffect(() => {
    if (currentIndex >= questions.length) {
      setCurrentIndex(questions.length - 1 >= 0 ? questions.length - 1 : 0);
    }
  }, [questions.length, currentIndex]);

  const handleChange = (id: keyof OnboardingAnswers, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleNext = () => {
    const q = questions[currentIndex];
    if (q.required) {
      const value = answers[q.id];
      if (!value) {
        alert("Please fill this field before continuing.");
        return;
      }
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      return;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    localStorage.setItem(STORAGE_COMPLETED_KEY, "true");
    setIsFinishing(true);
    setTimeout(() => {
      navigate("/profile");
    }, 1600);
  };

  const handleBack = () => {
    if (currentIndex === 0) {
      navigate("/profile");
      return;
    }
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const currentQuestion = questions[currentIndex];
  const total = questions.length;
  const progress = total > 0 ? Math.round(((currentIndex + 1) / total) * 100) : 0;

  if (isFinishing) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 md:px-10 lg:px-28 py-10">
          <div className="max-w-md mx-auto rounded-3xl border border-border bg-card shadow-card p-8 text-center space-y-4">
            <h1 className="text-2xl md:text-3xl font-bold">
              Customising your experience
            </h1>
            <p className="text-muted-foreground">
              We are tuning workouts, recipes and cycle insights just for you.
            </p>
            <div className="flex items-center justify-center gap-3 mt-4">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />
                <span className="h-[2px] w-6 bg-primary/40" />
                <span className="h-2.5 w-2.5 rounded-full bg-secondary animate-pulse delay-150" />
                <span className="h-[2px] w-6 bg-secondary/40" />
                <span className="h-2.5 w-2.5 rounded-full bg-accent animate-pulse delay-300" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 md:px-10 lg:px-28 py-10">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl md:text-4xl font-bold">
              Tell us about{" "}
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                you
              </span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A short, smooth questionnaire so we can personalise workouts, nutrition and recovery for
              you.
            </p>
          </div>

          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="relative max-w-2xl mx-auto">
            <div className="overflow-hidden rounded-3xl shadow-card bg-gradient-to-br from-background via-background to-primary/5">
              <div
                className="flex transition-transform duration-500"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {questions.map((q) => (
                  <Card key={q.id} className="min-w-full border-0 bg-transparent">
                    <CardHeader>
                      <CardTitle className="text-2xl">{q.label}</CardTitle>
                      <CardDescription>{q.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor={q.id}>{q.label}</Label>
                        {q.type === "text" || q.type === "number" ? (
                          <Input
                            id={q.id}
                            type={q.type === "number" ? "number" : "text"}
                            value={answers[q.id] as string}
                            onChange={(e) => handleChange(q.id, e.target.value)}
                          />
                        ) : null}
                        {q.type === "date" ? (
                          <Input
                            id={q.id}
                            type="date"
                            value={answers[q.id] as string}
                            onChange={(e) => handleChange(q.id, e.target.value)}
                          />
                        ) : null}
                        {q.type === "select" && q.options ? (
                          <div className="flex flex-wrap gap-2">
                            {q.options.map((opt) => {
                              const selected = answers[q.id] === opt;
                              return (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => handleChange(q.id, opt)}
                                  className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                                    selected
                                      ? "bg-primary text-primary-foreground border-primary"
                                      : "bg-background text-foreground border-border hover:bg-muted"
                                  }`}
                                >
                                  {opt === "prefer_not" ? "Prefer not to say" : opt.charAt(0).toUpperCase() + opt.slice(1)}
                                </button>
                              );
                            })}
                          </div>
                        ) : null}
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>
                          Card {currentIndex + 1} of {total}
                        </span>
                        <span>{progress}% complete</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between max-w-2xl mx-auto pt-4">
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
            <Button onClick={handleNext}>{currentIndex === total - 1 ? "Finish" : "Next"}</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingQuestionnaire;
