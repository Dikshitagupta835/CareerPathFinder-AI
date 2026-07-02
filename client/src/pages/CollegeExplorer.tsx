import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';
import { EmptyState } from '../components/EmptyState';
import { 
  GraduationCap, Search, Grid, Map as MapIcon, Heart, Compass
} from 'lucide-react';

interface College {
  id: string;
  name: string;
  country: string;
  city: string;
  ranking: string;
  avgPackage: string;
  highestPackage: string;
  placementRate: string;
  acceptanceRate: string;
  fees: string;
  hostelFees: string;
  scholarships: string;
  popularCourses: string[];
  rating: number;
  lat: number;
  lng: number;
  nearbyHostels: string;
  nearbyAirports: string;
  nearbyMetro: string;
  costOfLiving: string;
  description: string;
}

export const CollegeExplorer: React.FC = () => {
  const { savedColleges, toggleSaveCollege } = useApp();
  const [searchVal, setSearchVal] = useState('');
  const [countryFilter, setCountryFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [selectedCollegeId, setSelectedCollegeId] = useState('srcc');
  const [activeTab, setActiveTab] = useState<any>('saved');

  const collegesList: College[] = [
    {
      id: "srcc",
      name: "Shri Ram College of Commerce (SRCC)",
      country: "India",
      city: "New Delhi",
      ranking: "#1 for Commerce (India Today)",
      avgPackage: "₹10.5 LPA",
      highestPackage: "₹35 LPA",
      placementRate: "95%",
      acceptanceRate: "1.5%",
      fees: "₹30,000 / year",
      hostelFees: "₹80,000 / year",
      scholarships: "Yes (NSP, Merit-based, Need-based)",
      popularCourses: ["BCom (Hons)", "BA (Hons) Economics", "MCom"],
      rating: 4.8,
      lat: 28.6923,
      lng: 77.2096,
      nearbyHostels: "Kamla Nagar, Hudson Lane",
      nearbyAirports: "IGI Airport (22 km)",
      nearbyMetro: "Vishwa Vidyalaya Metro (500m)",
      costOfLiving: "Low (₹10,000 - ₹15,000 / month)",
      description: "Established in 1926, SRCC is India's premier institution for commerce and economics education, known for stellar placements and highly competitive cutoffs."
    },
    {
      id: "christ-university",
      name: "Christ University",
      country: "India",
      city: "Bengaluru",
      ranking: "#4 for Commerce (NIRF)",
      avgPackage: "₹7.2 LPA",
      highestPackage: "₹21 LPA",
      placementRate: "88%",
      acceptanceRate: "8%",
      fees: "₹2,50,000 / year",
      hostelFees: "₹1,20,000 / year",
      scholarships: "Yes (Merit scholarships, Financial Aid)",
      popularCourses: ["BCom Professional", "BBA Finance", "MBA"],
      rating: 4.5,
      lat: 12.9362,
      lng: 77.6059,
      nearbyHostels: "SG Palya, Koramangala",
      nearbyAirports: "Kempegowda Airport (41 km)",
      nearbyMetro: "South End Circle Metro (3 km)",
      costOfLiving: "Medium (₹15,000 - ₹25,000 / month)",
      description: "Christ University is a private deemed university in Bengaluru, famous for its holistic education, strict discipline, and industry-oriented commerce curriculum."
    },
    {
      id: "university-of-toronto",
      name: "University of Toronto",
      country: "Canada",
      city: "Toronto",
      ranking: "#21 (QS Global World Rankings)",
      avgPackage: "$82,000 / year",
      highestPackage: "$220,000 / year",
      placementRate: "92%",
      acceptanceRate: "43%",
      fees: "$45,000 / year",
      hostelFees: "$15,000 / year",
      scholarships: "Yes (Pearson Scholarship)",
      popularCourses: ["Rotman Commerce (BCom)", "Economics & Finance"],
      rating: 4.9,
      lat: 43.6629,
      lng: -79.3957,
      nearbyHostels: "On-Campus Dorms, Downtown Condos",
      nearbyAirports: "Toronto Pearson Airport (25 km)",
      nearbyMetro: "Queen's Park Subway (100m)",
      costOfLiving: "High ($1,800 - $2,500 / month)",
      description: "U of T is Canada's leading university. The Rotman Commerce program combines business education with arts and sciences, providing superior placements globally."
    },
    {
      id: "london-school-of-economics",
      name: "London School of Economics (LSE)",
      country: "United Kingdom",
      city: "London",
      ranking: "#45 (QS Global World Rankings)",
      avgPackage: "£65,000 / year",
      highestPackage: "£180,000 / year",
      placementRate: "94%",
      acceptanceRate: "9%",
      fees: "£26,000 / year",
      hostelFees: "£10,000 / year",
      scholarships: "Yes (LSE Support Scheme)",
      popularCourses: ["BSc Finance", "BSc Accounting & Finance"],
      rating: 4.9,
      lat: 51.5144,
      lng: -0.1165,
      nearbyHostels: "Holborn, Covent Garden Housing",
      nearbyAirports: "London Heathrow Airport (28 km)",
      nearbyMetro: "Holborn Tube Station (300m)",
      costOfLiving: "Very High (£1,400 - £2,000 / month)",
      description: "LSE is a world-class social science university specializing in economics, politics, law, and finance. Located in the heart of London."
    }
  ];

  const handleSave = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    toggleSaveCollege(id);
  };

  const filteredColleges = collegesList.filter((col) => {
    const matchesSearch = col.name.toLowerCase().includes(searchVal.toLowerCase()) || col.city.toLowerCase().includes(searchVal.toLowerCase());
    const matchesCountry = countryFilter === 'All' || col.country.toLowerCase() === countryFilter.toLowerCase();
    const matchesSaved = activeTab === 'all' || savedColleges.includes(col.id);
    return matchesSearch && matchesCountry && matchesSaved;
  });

  const activeCollege = collegesList.find(c => c.id === selectedCollegeId) || collegesList[0];

  if (activeTab === 'saved' && savedColleges.length === 0) {
    return (
      <div className="flex-1 p-6 space-y-6 overflow-y-auto h-full select-none pb-24 transition-colors">
        {/* Header bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 font-heading">
              <GraduationCap size={22} className="text-brand-primary" /> College Finder Explorer
            </h2>
            <p className="text-xs text-slate-400">Match and browse global universities offering premium commerce, analytics, and accounting paths.</p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('saved')}
            className={`text-xs font-bold transition-all ${
              activeTab === 'saved'
                ? 'text-indigo-500 border-b-2 border-indigo-500 pb-2 font-extrabold'
                : 'text-slate-450 hover:text-slate-600'
            }`}
          >
            Saved Colleges (0)
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`text-xs font-bold transition-all ${
              activeTab === 'all'
                ? 'text-indigo-500 border-b-2 border-indigo-500 pb-2 font-extrabold'
                : 'text-slate-450 hover:text-slate-600'
            }`}
          >
            Search & Recommended
          </button>
        </div>

        <EmptyState
          illustration={
            <svg className="w-10 h-10 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479L12 21l-6.825-4a12.083 12.083 0 01.665-6.479L12 14z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12v7a2 2 0 01-2 2h-3" />
            </svg>
          }
          heading="No colleges saved yet 🎓"
          subtext="Search colleges or complete your profile to see AI-matched universities."
          buttonText="Search Colleges"
          onButtonClick={() => setActiveTab('all')}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto h-full select-none pb-24 transition-colors">
      
      {/* Header bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 font-heading">
            <GraduationCap size={22} className="text-brand-primary" /> College Finder Explorer
          </h2>
          <p className="text-xs text-slate-400">Match and browse global universities offering premium commerce, analytics, and accounting paths.</p>
        </div>

        {/* View Mode Toggle buttons */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
          <button 
            onClick={() => setViewMode('grid')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all ${
              viewMode === 'grid' ? 'bg-white dark:bg-slate-750 text-indigo-500 shadow-sm' : 'text-slate-500'
            }`}
          >
            <Grid size={14} /> Grid View
          </button>
          <button 
            onClick={() => setViewMode('map')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all ${
              viewMode === 'map' ? 'bg-white dark:bg-slate-750 text-indigo-500 shadow-sm' : 'text-slate-500'
            }`}
          >
            <MapIcon size={14} /> Map View
          </button>
        </div>
      </div>

      {/* Tab Selection */}
      <div className="flex gap-4 border-b border-slate-250 dark:border-slate-805 pb-2">
        <button
          onClick={() => setActiveTab('saved')}
          className={`text-xs font-bold transition-all ${
            activeTab === 'saved'
              ? 'text-indigo-500 border-b-2 border-indigo-500 pb-2 font-extrabold'
              : 'text-slate-450 hover:text-slate-600'
          }`}
        >
          Saved Colleges ({savedColleges.length})
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`text-xs font-bold transition-all ${
            activeTab === 'all'
              ? 'text-indigo-500 border-b-2 border-indigo-500 pb-2 font-extrabold'
              : 'text-slate-450 hover:text-slate-600'
          }`}
        >
          Search & Recommended
        </button>
      </div>
      
      {/* Filters strip */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row gap-4 justify-between items-center transition-colors">
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-850 px-3.5 py-2 rounded-xl w-full md:max-w-xs border border-transparent focus-within:border-indigo-500/30">
          <Search size={15} className="text-slate-400" />
          <input 
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Search college name or city..."
            className="bg-transparent border-none outline-none text-xs text-slate-700 dark:text-slate-250 w-full"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto overflow-x-auto scrollbar-none">
          {['All', 'India', 'Canada', 'United Kingdom'].map(country => (
            <button
              key={country}
              onClick={() => setCountryFilter(country)}
              className={`px-3.5 py-1.5 rounded-full border text-[10px] font-bold transition-all ${
                countryFilter === country
                  ? 'bg-indigo-500/10 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-550 dark:text-slate-400 hover:bg-slate-100'
              }`}
            >
              {country}
            </button>
          ))}
        </div>
      </div>

      {/* AI Floating Advisor Insight */}
      <GlassCard className="p-4 flex gap-4 border-indigo-500/10 dark:border-indigo-400/5 bg-indigo-500/[0.01] items-start">
        <Compass size={20} className="text-indigo-500 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed text-slate-600 dark:text-slate-350">
          <span className="font-bold text-slate-800 dark:text-slate-100">AI College Advisor Match: </span>
          Based on your budget of ₹12 Lakhs and preference to study in Canada, **University of Toronto** represents a superior fit. While tuition is $45,000/yr, it has a 92% placement success rate and qualifies for the full Lester B. Pearson Scholarship. For domestic studies, **SRCC Delhi** provides the highest ROI in the country with annual tuition under ₹30,000 and ₹10.5 LPA average placements.
        </div>
      </GlassCard>

      {/* Main content depending on viewmode */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredColleges.map((col) => {
            const isSaved = savedColleges.includes(col.id);
            return (
              <div 
                key={col.id}
                onClick={() => { setSelectedCollegeId(col.id); setViewMode('map'); }}
                className="glass-panel p-4 rounded-xl cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all border border-slate-200/50 dark:border-slate-800/50 flex flex-col justify-between"
              >
                <div>
                  {/* Photo mock placeholder */}
                  <div className="w-full h-32 rounded-lg bg-gradient-to-tr from-slate-200 to-indigo-50 dark:from-slate-800 dark:to-slate-850 flex items-center justify-center text-slate-400 text-3xl font-heading font-extrabold relative shadow-inner">
                    {col.name.split(' ').map(x => x.charAt(0)).slice(0, 3).join('')}
                    <button 
                      onClick={(e) => handleSave(e, col.id)}
                      className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 hover:scale-105 active:scale-95 transition-transform"
                    >
                      <Heart size={14} className={isSaved ? 'fill-indigo-500 text-indigo-500' : 'text-slate-500'} />
                    </button>
                  </div>
                  
                  <div className="mt-3 space-y-1">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{col.city}, {col.country}</span>
                    <h4 className="font-bold text-slate-800 dark:text-slate-100 text-xs md:text-sm font-heading line-clamp-1">{col.name}</h4>
                    <p className="text-[10px] text-slate-400 italic mt-0.5 truncate">{col.ranking}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[10px] space-y-1.5 font-medium">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Avg Package:</span>
                    <span className="font-bold text-slate-700 dark:text-slate-200">{col.avgPackage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Annual Tuition:</span>
                    <span className="font-bold text-indigo-550">{col.fees}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Split view: List on left, map details on right */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[460px]">
          
          {/* Colleges lists sidebar */}
          <div className="lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3 overflow-y-auto transition-colors">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Universities Selected</h3>
            {filteredColleges.map((col) => (
              <div 
                key={col.id}
                onClick={() => setSelectedCollegeId(col.id)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedCollegeId === col.id 
                    ? 'bg-slate-100 dark:bg-slate-800 border-indigo-500/40 dark:border-indigo-400/40 font-bold' 
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}
              >
                <h4 className="text-xs text-slate-800 dark:text-slate-150 line-clamp-1 font-heading">{col.name}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">{col.city}, {col.country} • Tuition: {col.fees}</p>
              </div>
            ))}
          </div>

          {/* Map & Proximity Details Dashboard */}
          <div className="lg:col-span-2 space-y-4 h-full overflow-y-auto">
            <GlassCard className="p-5 flex flex-col md:flex-row gap-6 border-l-4 border-l-brand-secondary h-full justify-between">
              
              <div className="space-y-4 flex-1">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Mock Map coordinates details</span>
                  <h3 className="text-base font-bold font-heading mt-0.5">{activeCollege.name}</h3>
                  <p className="text-[10px] text-slate-400 italic">Coordinates: Latitude {activeCollege.lat}, Longitude {activeCollege.lng}</p>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{activeCollege.description}</p>

                {/* Proximity metrics */}
                <div className="grid grid-cols-2 gap-4 text-[11px] pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="space-y-1">
                    <span className="text-slate-400 font-bold block">Nearby hostels / Student rent:</span>
                    <p className="text-slate-700 dark:text-slate-350">{activeCollege.nearbyHostels}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400 font-bold block">Closest local Metro / Subway:</span>
                    <p className="text-slate-700 dark:text-slate-350">{activeCollege.nearbyMetro}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400 font-bold block">Local Cost of Living index:</span>
                    <p className="text-emerald-500 font-bold">{activeCollege.costOfLiving}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400 font-bold block">Nearby Airports:</span>
                    <p className="text-slate-700 dark:text-slate-350">{activeCollege.nearbyAirports}</p>
                  </div>
                </div>
              </div>

            </GlassCard>
          </div>

        </div>
      )}
    </div>
  );
};
