import { Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import AnimatedBackground from "./components/AnimatedBackground";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import ProfileForm from "./pages/ProfileForm";
import ResultsPage from "./pages/ResultsPage";
import RoadmapPage from "./pages/RoadmapPage";
import ComparePage from "./pages/ComparePage";
import ActionPlanPage from "./pages/ActionPlanPage";
import CareerSimulationPage from "./pages/CareerSimulationPage";

export default function App() {
  return (
    <AppProvider>
      <AnimatedBackground />
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/profile" element={<ProfileForm />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/roadmap/:careerId" element={<RoadmapPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/action-plan/:careerId" element={<ActionPlanPage />} />
            <Route path="/simulate/:careerId" element={<CareerSimulationPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AppProvider>
  );
}
