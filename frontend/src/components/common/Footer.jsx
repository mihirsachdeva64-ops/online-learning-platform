import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Heart, Shield, Code, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 text-white">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold">EduPulse</span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering learners worldwide with interactive video lessons, synchronized transcripts, timestamped notes, and verifiable course certificates.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Popular Tracks
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/courses?category=Web+Development" className="hover:text-white transition-colors">
                  Web Development
                </Link>
              </li>
              <li>
                <Link to="/courses?category=Data+Science+%26+AI" className="hover:text-white transition-colors">
                  Data Science & AI
                </Link>
              </li>
              <li>
                <Link to="/courses?category=UI%2FUX+Design" className="hover:text-white transition-colors">
                  UI/UX Design Systems
                </Link>
              </li>
              <li>
                <Link to="/courses?category=Cloud+Computing" className="hover:text-white transition-colors">
                  Cloud Architecture & Docker
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Highlights */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Key Features
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                Custom HTML5 Video Player
              </li>
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                Timestamped Notes & Sync
              </li>
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                Active Transcript Highlighting
              </li>
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                Printable Certificates
              </li>
            </ul>
          </div>

          {/* Project Details */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Internship Assignment
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Built with React, Vite, Tailwind CSS, Express, and MongoDB Mongoose. Fully responsive and tested.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-mono">
              <Code className="w-3.5 h-3.5 text-brand-400" />
              Full-Stack Capstone
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} EduPulse Online Learning Platform. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> by Mihir Sachdeva
          </p>
        </div>
      </div>
    </footer>
  );
}
