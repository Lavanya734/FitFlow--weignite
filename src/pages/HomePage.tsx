import { Button } from "../components/ui/button";
import { Dumbbell, Zap, Target, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "../assets/hero-fitness.jpg";
import Header from "../components/Header";

const HomePage = () => {

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">

        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Fitness Hero"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        </div>


        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        </div>


        <div className="container mx-auto px-4 z-10 text-center">
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight drop-shadow-lg">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Transform Your
              </span>
              <br />
              <span className="text-foreground drop-shadow-md">
                Fitness Journey.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              AI-powered exercise tracking with real-time feedback. Train smarter, not harder.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link to="/exercises">
                <Button
                  size="lg"
                  className="text-lg px-10 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                  Start Training
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 rounded-full border-muted-foreground/30 hover:bg-muted"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>

        {/* <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-primary rounded-full animate-pulse-slow" />
          </div>
        </div> */}
      </section>


      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-slide-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Choose <span className="text-primary">FitFlow?</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-xl mx-auto">
              Experience the future of fitness with AI-powered tracking
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto" >
            <div className="bg-card p-8 rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-2 animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <Zap className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Real-time Tracking</h3>
              <p className="text-muted-foreground">
                Get instant feedback on your form and rep count with AI-powered pose detection
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-2 animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <div className="w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center mb-4">
                <Target className="h-7 w-7 text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Guided Exercises</h3>
              <p className="text-muted-foreground">
                Follow along with detailed instructions and visual guides for perfect form
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-2 animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="h-7 w-7 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">Track Progress</h3>
              <p className="text-muted-foreground">
                Monitor your improvements over time with detailed analytics and insights
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
