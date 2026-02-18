import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ExerciseSelection from "./pages/ExerciseSelection";
import ExercisePanel from "./pages/ExercisePanel";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import ProfileDashboard from "./pages/ProfileDashboard";
import RecipesPage from "./pages/RecipesPage";
import ModuleDetailPage from "./pages/ModuleDetailPage";
import "./App.css";
import ModulesPage from "./pages/ModulesPage";
import CommunityPage from "./pages/Community/CommunityPage";
import ReelsPage from "./pages/Community/ReelsPage";
import SearchPage from "./pages/Community/SearchPage";
import ProfilePage from "./pages/Community/ProfilePage";
import OnboardingQuestionnaire from "./pages/OnboardingQuestionnaire";
import MyCyclePage from "./pages/MyCyclePage";
// import SearchPage from "./pages/Community/SearchPage";
// import ProfilePage from "./pages/Community/ProfilePage";



const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/profile" element={<ProfileDashboard />} />
          <Route path="/onboarding" element={<OnboardingQuestionnaire />} />
          <Route path="/exercises" element={<ExerciseSelection />} />
          <Route path="/exercise/:exerciseId" element={<ExercisePanel />} />
          <Route path="/recipes" element={<RecipesPage />} />
          <Route path="/modules" element={<ModulesPage />} />
          <Route path="/modules/:moduleId" element={<ModuleDetailPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/community/reels" element={<ReelsPage />} />
          <Route path="/community/search" element={<SearchPage />} />
          <Route path="/community/profile" element={<ProfilePage />} />
          <Route path="/my-cycle" element={<MyCyclePage />} />


          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
