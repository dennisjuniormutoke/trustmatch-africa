import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Globe, 
  Users, 
  Handshake, 
  ChevronRight, 
  CheckCircle2, 
  Star, 
  Menu, 
  X,
  Lock,
  Zap,
  BarChart3,
  ArrowUpRight,
  Search,
  Building2,
  MapPin,
  Award,
  ExternalLink,
  Info
} from 'lucide-react';

/**
 * TrustMatch Africa - Main Application Component
 * A secure, data-driven B2B trust verification platform.
 */

// --- Components ---

const Badge = ({ children, variant = 'default' }) => {
  const variants = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    primary: 'bg-blue-50 text-blue-700 border-blue-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200'
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${variants[variant]}`}>
      {children}
    </span>
  );
};

const VerificationCard = () => (
  <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-100 relative group transition-all hover:translate-y-[-4px]">
    <div className="absolute -top-4 -right-4 bg-blue-600 p-4 rounded-2xl shadow-xl text-white">
      <ShieldCheck className="w-8 h-8" />
    </div>

    <div className="flex items-center gap-5 mb-8">
      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg">
        TM
      </div>
      <div>
        <h3 className="text-2xl font-black text-slate-900 leading-tight">TekniGlobal Ltd.</h3>
        <div className="flex items-center gap-1.5 mt-1">
          <Badge variant="success">Verified Tier 1</Badge>
          <div className="flex text-amber-400 ml-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
          </div>
        </div>
      </div>
    </div>

    <div className="space-y-4 mb-8">
      <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
        <div className="flex items-center gap-3">
          <Building2 className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-bold text-slate-600 uppercase tracking-tight">Identity Vetted</span>
        </div>
        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
      </div>
      <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
        <div className="flex items-center gap-3">
          <Zap className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-bold text-slate-600 uppercase tracking-tight">Compliance Scan</span>
        </div>
        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
      </div>
    </div>

    <div className="bg-slate-900 rounded-[1.5rem] p-6 text-white">
      <div className="flex justify-between items-end mb-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 mb-1">TrustScore™</p>
          <p className="text-4xl font-black italic tracking-tighter">97.4</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-blue-400">EXCELLENT</p>
          <p className="text-[9px] opacity-40 font-medium">Updated 2h ago</p>
        </div>
      </div>
      <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
        <div className="h-full bg-blue-500 w-[97%]" />
      </div>
    </div>
  </div>
);

const FeatureItem = ({ icon: Icon, title, text }) => (
  <div className="flex gap-6 p-6 rounded-3xl hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-slate-100 group">
    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <h4 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">{title}</h4>
      <p className="text-slate-600 leading-relaxed font-medium">{text}</p>
    </div>
  </div>
);

// --- Main Page ---

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100">
      {/* Header */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 px-4 pt-4 ${isScrolled ? 'translate-y-[-4px]' : ''}`}>
        <div className={`max-w-7xl mx-auto rounded-[2rem] transition-all duration-300 border ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-xl border-slate-200' : 'bg-transparent border-transparent'} h-20 flex items-center justify-between px-8`}>
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase italic">TrustMatch</span>
          </div>
          
          <div className="hidden md:flex items-center gap-10 font-black text-[10px] uppercase tracking-[0.2em] text-slate-500">
            <a href="#" className="hover:text-blue-600 transition-colors">Network</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Protocols</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Pricing</a>
            <button className="bg-slate-900 text-white px-8 py-3 rounded-2xl hover:bg-blue-600 transition-all shadow-lg active:scale-95">
              Launch Platform
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-40 pb-24 lg:pt-56 lg:pb-48">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex items-center gap-20">
            <div className="lg:w-3/5 text-center lg:text-left">
              <Badge variant="primary">Pan-African B2B Intelligence</Badge>
              <h1 className="text-6xl lg:text-8xl font-black text-slate-900 leading-[0.85] mt-8 mb-10 tracking-tighter uppercase italic">
                Trust is <br />
                <span className="text-blue-600 not-italic">Infrastructure.</span>
              </h1>
              <p className="text-xl lg:text-2xl text-slate-500 mb-12 leading-relaxed max-w-2xl font-medium">
                We bridge the validation gap for African enterprises. Real-time KYB, 
                reputation scores, and verified trade history in one secure layer.
              </p>
              <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                <button className="bg-blue-600 text-white px-12 py-6 rounded-[2rem] font-black text-lg hover:shadow-2xl hover:shadow-blue-200 transition-all flex items-center justify-center gap-3 group active:scale-95">
                  Get Verified <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:translate-y-[-1px] transition-transform" />
                </button>
                <button className="bg-white text-slate-700 border border-slate-200 px-12 py-6 rounded-[2rem] font-black text-lg hover:bg-slate-50 transition-all">
                  Search Directory
                </button>
              </div>
            </div>

            <div className="lg:w-2/5 mt-20 lg:mt-0 relative">
              <div className="absolute -inset-10 bg-blue-400/10 blur-[100px] rounded-full" />
              <VerificationCard />
            </div>
          </div>
        </div>
      </section>

      {/* Value Prop */}
      <section className="py-32 bg-white rounded-[4rem] mx-4 border border-slate-100 shadow-sm mb-32">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl lg:text-6xl font-black text-slate-900 leading-tight mb-8 tracking-tighter uppercase italic">
                Eliminate the <br />Partner Risk.
              </h2>
              <div className="space-y-6">
                <FeatureItem 
                  icon={Lock}
                  title="Biometric KYB"
                  text="Every corporate entity is verified against national registries and legal databases across 18 African nations."
                />
                <FeatureItem 
                  icon={BarChart3}
                  title="Trade Ledger"
                  text="View performance scores based on historical fulfillment, payment punctuality, and logistical consistency."
                />
                <FeatureItem 
                  icon={Globe}
                  title="Cross-Border Unity"
                  text="A unified standard for trust that works whether you're trading in Lagos, Nairobi, or Johannesburg."
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-slate-50 p-10 rounded-[3rem] text-center border border-slate-100 mt-12">
                <p className="text-5xl font-black text-blue-600 mb-2 tracking-tighter">12k+</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Entities Vetted</p>
              </div>
              <div className="bg-slate-900 p-10 rounded-[3rem] text-center text-white">
                <p className="text-5xl font-black mb-2 tracking-tighter italic">99.8%</p>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Accuracy Rate</p>
              </div>
              <div className="bg-blue-600 p-10 rounded-[3rem] text-center text-white">
                <p className="text-5xl font-black mb-2 tracking-tighter">$2B+</p>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Trade Protected</p>
              </div>
              <div className="bg-slate-50 p-10 rounded-[3rem] text-center border border-slate-100 mt-12">
                <p className="text-5xl font-black text-slate-900 mb-2 tracking-tighter">18</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Member States</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 py-32 relative overflow-hidden text-center mx-4 rounded-[4rem] mb-12">
        <div className="max-w-4xl mx-auto px-8 relative z-10">
          <h2 className="text-5xl lg:text-7xl font-black text-white mb-10 tracking-tighter uppercase italic leading-[0.9]">
            The New Standard <br />for African Trade.
          </h2>
          <p className="text-xl text-slate-400 mb-12 font-medium">
            Join the inner circle of Africa's most reliable enterprises. Stop guessing, start knowing.
          </p>
          <button className="bg-white text-slate-900 px-14 py-6 rounded-[2rem] font-black text-xl hover:bg-blue-50 transition-all shadow-2xl active:scale-95">
            Become a Verified Partner
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-2 mb-8 opacity-40">
            <ShieldCheck className="w-6 h-6" />
            <span className="text-lg font-black tracking-tighter uppercase italic">TrustMatch Africa</span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
            © 2026 Secured Infrastructure. Built for the Continent.
          </p>
        </div>
      </footer>
    </div>
  );
}
