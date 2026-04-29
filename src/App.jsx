import React, { useState, useEffect, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc, query } from 'firebase/firestore';
import { 
  Search, Star, ShieldCheck, MapPin, Briefcase, 
  Clock, ChevronRight, CheckCircle2, 
  MessageSquare, User, Menu, X, Phone, Send, Loader2, Plus, Trash2, Globe, ExternalLink
} from 'lucide-react';

// --- FIREBASE CONFIG ---
const firebaseConfig = JSON.parse(__firebase_config);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'trustmatch-africa';

// --- SETTINGS ---
const COORDINATOR_PHONE = "+263789856113";

export default function App() {
  const [user, setUser] = useState(null);
  const [activeRole, setActiveRole] = useState('client'); 
  const [currentView, setCurrentView] = useState('browse'); 
  const [workers, setWorkers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // UI States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('All');
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isAddWorkerModalOpen, setIsAddWorkerModalOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Forms
  const [clientForm, setClientForm] = useState({ name: '', phone: '', details: '' });
  const [workerForm, setWorkerForm] = useState({ 
    name: '', skill: 'Plumber', suburb: '', bio: '', 
    trustScore: 5.0, jobsCompleted: 0, 
    photo: 'https://images.unsplash.com/photo-1540560085022-d8cde3c18b27?w=400&h=400&fit=crop' 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Auth Setup
  useEffect(() => {
    const initAuth = async () => {
      if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
        await signInWithCustomToken(auth, __initial_auth_token);
      } else {
        await signInAnonymously(auth);
      }
    };
    initAuth();
    return onAuthStateChanged(auth, setUser);
  }, []);

  // 2. Data Listeners
  useEffect(() => {
    if (!user) return;

    const unsubWorkers = onSnapshot(
      collection(db, 'artifacts', appId, 'public', 'data', 'workers'),
      (snapshot) => {
        const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setWorkers(list.length > 0 ? list : SEED_DATA);
        setLoading(false);
      },
      (err) => console.error(err)
    );

    const unsubRequests = onSnapshot(
      collection(db, 'artifacts', appId, 'public', 'data', 'requests'),
      (snapshot) => {
        const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setRequests(list.sort((a, b) => b.timestamp - a.timestamp));
      },
      (err) => console.error(err)
    );

    return () => { unsubWorkers(); unsubRequests(); };
  }, [user]);

  // Filters
  const skillsList = ['All', 'Plumber', 'Gardener', 'Housekeeper', 'Nanny', 'Electrician', 'Carpenter'];
  const filteredWorkers = useMemo(() => {
    return workers.filter(w => {
      const matchSearch = (w.name + w.suburb).toLowerCase().includes(searchQuery.toLowerCase());
      const matchSkill = selectedSkill === 'All' || w.skill === selectedSkill;
      return matchSearch && matchSkill;
    });
  }, [workers, searchQuery, selectedSkill]);

  // Actions
  const notify = (msg) => {
    setNotificationMessage(msg);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 4000);
  };

  const handleClientRequest = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'requests'), {
        ...clientForm,
        workerId: selectedWorker.id,
        workerName: selectedWorker.name,
        status: 'Unpaid',
        timestamp: Date.now()
      });
      const waLink = `https://wa.me/${COORDINATOR_PHONE.replace(/\+/g,'')}?text=Hi! I am ${clientForm.name}. I just requested ${selectedWorker.name} for ${selectedWorker.skill} on TrustMatch Africa. How do I pay the $5 connection fee?`;
      notify("Request saved! Opening WhatsApp to finalize...");
      setTimeout(() => window.open(waLink, '_blank'), 1500);
      setIsRequestModalOpen(false);
      setClientForm({ name: '', phone: '', details: '' });
    } catch (err) { notify("Error sending request."); }
    finally { setIsSubmitting(false); }
  };

  const handleAddWorker = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'workers'), workerForm);
      notify("Worker added to live directory!");
      setIsAddWorkerModalOpen(false);
    } catch (err) { notify("Error adding worker."); }
    finally { setIsSubmitting(false); }
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-bold text-blue-900">Connecting to TrustMatch Africa...</div>;

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900 pb-12">
      {/* Header */}
      <header className="bg-blue-950 text-white sticky top-0 z-50 px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => {setActiveRole('client'); setCurrentView('browse');}}>
          <ShieldCheck className="w-7 h-7 text-blue-400" />
          <span className="font-black text-lg">TrustMatch <span className="text-blue-400">Africa</span></span>
        </div>
        <div className="flex space-x-4">
          <button onClick={() => {setActiveRole('client'); setCurrentView('browse');}} className={`text-xs font-bold px-3 py-2 rounded-lg ${activeRole === 'client' ? 'bg-blue-800' : ''}`}>BROWSE</button>
          <button onClick={() => {setActiveRole('admin');}} className={`text-xs font-bold px-3 py-2 rounded-lg ${activeRole === 'admin' ? 'bg-blue-800' : ''}`}>ADMIN</button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {activeRole === 'client' ? (
          currentView === 'browse' ? (
            <section>
              <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900">Vetted Local Workers</h1>
                <p className="text-slate-500">Physical ID verification & background checks completed for every worker.</p>
              </div>

              <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input className="w-full pl-12 pr-4 py-3 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-blue-500" placeholder="Search by name or location..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                </div>
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                  {skillsList.map(s => (
                    <button key={s} onClick={() => setSelectedSkill(s)} className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-colors ${selectedSkill === s ? 'bg-blue-600 text-white' : 'bg-white text-slate-500'}`}>
                      {s.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredWorkers.map(w => (
                  <div key={w.id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-md transition-all border border-slate-100">
                    <img src={w.photo} className="h-48 w-full object-cover" />
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-black text-lg">{w.name}</h3>
                        <div className="flex items-center text-xs font-bold bg-blue-50 text-blue-700 px-2 py-1 rounded-lg">
                          <Star className="w-3 h-3 mr-1 fill-current" /> {w.trustScore}
                        </div>
                      </div>
                      <p className="text-blue-600 font-bold text-xs uppercase mb-3">{w.skill}</p>
                      <p className="text-slate-500 text-sm mb-4 flex items-center"><MapPin className="w-4 h-4 mr-1 text-red-400" /> {w.suburb}</p>
                      <button onClick={() => {setSelectedWorker(w); setCurrentView('profile');}} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm">VIEW TRUST PROFILE</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : (
            /* Profile View */
            <section className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4">
              <button onClick={() => setCurrentView('browse')} className="mb-6 font-bold text-slate-400 flex items-center"><ChevronRight className="rotate-180 w-5 h-5 mr-1"/> BACK</button>
              <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl">
                <div className="h-32 bg-blue-900" />
                <div className="px-8 pb-8 -mt-12">
                  <div className="flex flex-col md:flex-row items-center md:items-end gap-6 mb-8">
                    <img src={selectedWorker.photo} className="w-32 h-32 rounded-3xl border-4 border-white shadow-lg bg-white" />
                    <div className="flex-1 text-center md:text-left">
                      <h2 className="text-3xl font-black">{selectedWorker.name}</h2>
                      <p className="text-blue-600 font-bold uppercase text-sm tracking-widest">{selectedWorker.skill}</p>
                    </div>
                    <button onClick={() => setIsRequestModalOpen(true)} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-blue-200">REQUEST WORKER</button>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Vetting Report</h4>
                      <p className="text-slate-600 leading-relaxed">{selectedWorker.bio}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 bg-green-50 p-4 rounded-2xl border border-green-100">
                      {['ID Verified', 'Face Interview', 'Ref Checked', 'Trust Score 5/5'].map(x => (
                        <div key={x} className="flex items-center text-xs font-bold text-green-700"><CheckCircle2 className="w-4 h-4 mr-2" /> {x}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )
        ) : (
          /* Admin Dashboard */
          <section className="animate-in fade-in">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-black">Coordinator Portal</h1>
              <button onClick={() => setIsAddWorkerModalOpen(true)} className="bg-blue-900 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center"><Plus className="w-4 h-4 mr-1"/> ADD WORKER</button>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Incoming Requests</h3>
                {requests.map(r => (
                  <div key={r.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex justify-between items-center">
                    <div>
                      <div className="font-black text-lg">{r.clientName} <span className="text-xs font-normal text-slate-400">wants</span> {r.workerName}</div>
                      <div className="text-xs font-bold text-blue-600 mb-2 flex items-center"><Phone className="w-3 h-3 mr-1" /> {r.phone}</div>
                      <p className="text-xs italic text-slate-400">"{r.details}"</p>
                    </div>
                    <div className="flex space-x-2">
                      <a href={`https://wa.me/${r.phone.replace(/\D/g,'')}`} target="_blank" className="p-3 bg-green-50 text-green-600 rounded-xl"><MessageSquare className="w-5 h-5"/></a>
                      <div className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase ${r.status === 'Unpaid' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}`}>{r.status}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Directory Stats</h3>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                  <div className="text-4xl font-black text-blue-900">{workers.length}</div>
                  <p className="text-xs font-bold text-slate-400">Vetted Workers Active</p>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Modals */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden p-8">
            <h3 className="text-2xl font-black mb-2 text-center">Request Vetting Report</h3>
            <p className="text-center text-slate-400 text-sm mb-6">Our coordinator will connect with you to share vetting documentation.</p>
            <form onSubmit={handleClientRequest} className="space-y-4">
              <input required className="w-full p-4 bg-slate-50 rounded-xl outline-none font-bold text-sm" placeholder="Your Full Name" value={clientForm.name} onChange={e => setClientForm({...clientForm, name: e.target.value})} />
              <input required type="tel" className="w-full p-4 bg-slate-50 rounded-xl outline-none font-bold text-sm" placeholder="WhatsApp Number" value={clientForm.phone} onChange={e => setClientForm({...clientForm, phone: e.target.value})} />
              <textarea required className="w-full p-4 bg-slate-50 rounded-xl outline-none font-bold text-sm h-24" placeholder="Brief job details..." value={clientForm.details} onChange={e => setClientForm({...clientForm, details: e.target.value})}></textarea>
              <button disabled={isSubmitting} className="w-full py-4 bg-blue-600 text-white rounded-xl font-black shadow-lg">
                {isSubmitting ? <Loader2 className="animate-spin mx-auto"/> : "SEND REQUEST"}
              </button>
              <button type="button" onClick={() => setIsRequestModalOpen(false)} className="w-full py-2 text-slate-400 font-bold text-xs">CANCEL</button>
            </form>
          </div>
        </div>
      )}

      {isAddWorkerModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-md p-8">
            <h3 className="text-2xl font-black mb-6">Add Vetted Worker</h3>
            <form onSubmit={handleAddWorker} className="space-y-4">
              <input required className="w-full p-4 bg-slate-50 rounded-xl outline-none font-bold text-sm" placeholder="Worker Name" value={workerForm.name} onChange={e => setWorkerForm({...workerForm, name: e.target.value})} />
              <select className="w-full p-4 bg-slate-50 rounded-xl outline-none font-bold text-sm" value={workerForm.skill} onChange={e => setWorkerForm({...workerForm, skill: e.target.value})}>
                {skillsList.slice(1).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <input required className="w-full p-4 bg-slate-50 rounded-xl outline-none font-bold text-sm" placeholder="Suburb (e.g. Nketa 7)" value={workerForm.suburb} onChange={e => setWorkerForm({...workerForm, suburb: e.target.value})} />
              <textarea required className="w-full p-4 bg-slate-50 rounded-xl outline-none font-bold text-sm h-24" placeholder="Professional bio & vetting summary..." value={workerForm.bio} onChange={e => setWorkerForm({...workerForm, bio: e.target.value})}></textarea>
              <button disabled={isSubmitting} className="w-full py-4 bg-blue-900 text-white rounded-xl font-black shadow-lg">
                {isSubmitting ? <Loader2 className="animate-spin mx-auto"/> : "ADD TO DIRECTORY"}
              </button>
              <button type="button" onClick={() => setIsAddWorkerModalOpen(false)} className="w-full py-2 text-slate-400 font-bold text-xs">CANCEL</button>
            </form>
          </div>
        </div>
      )}

      {/* Notification */}
      {showNotification && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 z-[200] animate-bounce-in">
          <CheckCircle2 className="w-5 h-5 text-green-400" />
          <span className="font-bold text-sm">{notificationMessage}</span>
        </div>
      )}
    </div>
  );
}

const SEED_DATA = [
  { id: '1', name: 'Sipho Ndlovu', skill: 'Plumber', suburb: 'Nketa 7', trustScore: 4.8, jobsCompleted: 24, photo: 'https://images.unsplash.com/photo-1540560085022-d8cde3c18b27?w=400&h=400&fit=crop', bio: 'Expert in residential plumbing and geyser repairs. Fully physically vetted.' },
  { id: '2', name: 'Tendai Moyo', skill: 'Housekeeper', suburb: 'Suburbs', trustScore: 4.9, jobsCompleted: 42, photo: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop', bio: 'Specializes in deep cleaning and laundry. Top-rated for honesty.' },
  { id: '3', name: 'Thabo Ncube', skill: 'Gardener', suburb: 'Burnside', trustScore: 4.5, jobsCompleted: 15, photo: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400&h=400&fit=crop', bio: 'Landscaping and lawn maintenance expert. Reliable and hardworking.' }
];
