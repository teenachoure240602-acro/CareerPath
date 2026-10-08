import { Compass, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-navy-400 to-accent-500 flex items-center justify-center">
                <Compass className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-white">
                CareerPath <span className="gradient-text">AI</span>
              </span>
            </div>
            <p className="text-sm text-navy-300 max-w-xs">
              Built for students. AI-powered career guidance that helps you discover your ideal path and build a plan to get there.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">Platform</h4>
            <ul className="space-y-2 text-sm text-navy-300">
              <li>AI Career Analysis</li>
              <li>Personalized Roadmaps</li>
              <li>Career Comparison</li>
              <li>30-Day Action Plans</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">For Students</h4>
            <ul className="space-y-2 text-sm text-navy-300">
              <li>1st to 4th Year Roadmaps</li>
              <li>Internship Preparation</li>
              <li>Placement Preparation</li>
              <li>Project Recommendations</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-navy-400">
            © {new Date().getFullYear()} CareerPath AI. All rights reserved.
          </p>
          <p className="text-sm text-navy-400 flex items-center gap-1.5">
            Built with <Heart className="w-3.5 h-3.5 text-accent-400 fill-accent-400" /> for students
          </p>
        </div>
      </div>
    </footer>
  );
}
