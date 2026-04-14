import React, { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import { 
  Github, 
  LogOut, 
  Layout, 
  User, 
  Settings, 
  ShieldCheck, 
  Database, 
  Menu, 
  X, 
  Newspaper, 
  BookOpen, 
  Users, 
  Info, 
  Mail,
  Search,
  ChevronRight,
  GraduationCap,
  FileText,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Linkedin
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const LOGO_URL = "https://uuvezwvssnoeyybryemw.supabase.co/storage/v1/object/public/images/site%20logo/logo1_png.png";

type Page = 'home' | 'news' | 'blog' | 'tutors' | 'about' | 'contact';

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfileComplete, setShowProfileComplete] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) console.error('Error fetching profile:', error.message);
    else {
      setProfile(data);
      if (!data.status) setShowProfileComplete(true);
    }
    setLoading(false);
  };

  const completeProfile = async (status: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({ status })
      .eq('id', session.user.id);

    if (error) console.error('Error updating profile:', error.message);
    else {
      setProfile({ ...profile, status });
      setShowProfileComplete(false);
    }
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) alert(error.message);
    else setAuthModalOpen(false);
  };

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        }
      }
    });
    if (error) alert(error.message);
    else {
      alert('რეგისტრაცია წარმატებულია! გთხოვთ დაადასტუროთ იმეილი.');
      setAuthModalOpen(false);
    }
  };

  const [uploading, setUploading] = useState(false);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('აირჩიეთ ფაილი ასატვირთად.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${session.user.id}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', session.user.id);

      if (updateError) throw updateError;

      setProfile({ ...profile, avatar_url: publicUrl });
      alert('ფოტო წარმატებით აიტვირთა!');
    } catch (error: any) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error logging out:', error.message);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center flex-col gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 border-2 border-gray-100 border-t-blue-600 rounded-full"
        />
        {import.meta.env.VITE_SUPABASE_URL === 'https://placeholder.supabase.co' && (
          <div className="bg-red-50 text-red-600 p-6 rounded-3xl max-w-md text-center border border-red-100 animate-pulse">
            <p className="font-bold mb-2">⚠️ Supabase-თან კავშირი ვერ დამყარდა</p>
            <p className="text-xs">გთხოვთ დაამატოთ SUPABASE_URL და SUPABASE_ANON_KEY თქვენს Secrets-ში (Settings - Secrets).</p>
          </div>
        )}
      </div>
    );
  }

  const navLinks = [
    { id: 'home', label: 'მთავარი', icon: <Layout className="w-4 h-4" /> },
    { id: 'news', label: 'სიახლეები', icon: <Newspaper className="w-4 h-4" /> },
    { id: 'blog', label: 'ბლოგი', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'tutors', label: 'Tutors Hub', icon: <Users className="w-4 h-4" /> },
    { id: 'about', label: 'ჩვენ შესახებ', icon: <Info className="w-4 h-4" /> },
    { id: 'contact', label: 'კონტაქტი', icon: <Mail className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a] font-sans selection:bg-blue-600 selection:text-white">
      {/* Auth Modal */}
      <AnimatePresence>
        {authModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-[40px] p-10 max-w-md w-full shadow-2xl relative"
            >
              <button 
                onClick={() => setAuthModalOpen(false)}
                className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-2xl font-bold mb-2 text-center">
                {isRegistering ? 'რეგისტრაცია' : 'შესვლა'}
              </h2>
              <p className="text-gray-500 mb-8 text-center text-sm">
                {isRegistering ? 'შექმენი ანგარიში liveschool.ge-ზე' : 'მოგესალმებით, გთხოვთ გაიაროთ ავტორიზაცია'}
              </p>

              <form onSubmit={isRegistering ? handleEmailRegister : handleEmailLogin} className="space-y-4">
                {isRegistering && (
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="სახელი"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full p-4 bg-gray-50 rounded-2xl border border-transparent focus:border-blue-600 focus:bg-white outline-none transition-all"
                    />
                    <input
                      type="text"
                      placeholder="გვარი"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full p-4 bg-gray-50 rounded-2xl border border-transparent focus:border-blue-600 focus:bg-white outline-none transition-all"
                    />
                  </div>
                )}
                <input
                  type="email"
                  placeholder="ელ-ფოსტა"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-4 bg-gray-50 rounded-2xl border border-transparent focus:border-blue-600 focus:bg-white outline-none transition-all"
                />
                <input
                  type="password"
                  placeholder="პაროლი"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-4 bg-gray-50 rounded-2xl border border-transparent focus:border-blue-600 focus:bg-white outline-none transition-all"
                />
                <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-xl shadow-blue-600/20">
                  {isRegistering ? 'რეგისტრაცია' : 'შესვლა'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button 
                  onClick={() => setIsRegistering(!isRegistering)}
                  className="text-sm text-gray-500 hover:text-blue-600 font-medium"
                >
                  {isRegistering ? 'უკვე გაქვთ ანგარიში? შესვლა' : 'არ გაქვთ ანგარიში? რეგისტრაცია'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Completion Modal */}
      <AnimatePresence>
        {showProfileComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-[40px] p-10 max-w-md w-full shadow-2xl text-center"
            >
              <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <User className="w-10 h-10 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold mb-4">დაასრულე რეგისტრაცია</h2>
              <p className="text-gray-500 mb-8">გთხოვთ აირჩიოთ თქვენი სტატუსი პლატფორმაზე გამოსაყენებლად</p>
              
              <div className="grid grid-cols-1 gap-4">
                {['მოსწავლე', 'მასწავლებელი', 'მშობელი'].map((status) => (
                  <button
                    key={status}
                    onClick={() => completeProfile(status)}
                    className="w-full p-4 rounded-2xl border border-gray-100 font-bold hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all active:scale-95"
                  >
                    {status}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div 
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => setCurrentPage('home')}
            >
              <img 
                src={LOGO_URL} 
                alt="liveschool.ge logo" 
                className="h-10 w-auto transition-transform group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <span className="text-xl font-bold tracking-tight text-blue-600">liveschool.ge</span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => setCurrentPage(link.id as Page)}
                  className={`text-sm font-medium transition-colors ${
                    currentPage === link.id ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Auth / Profile */}
            <div className="hidden md:flex items-center gap-4">
              {session ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100">
                    <div className="relative group">
                      {profile?.avatar_url ? (
                        <img 
                          src={profile.avatar_url} 
                          alt="Avatar" 
                          className="w-8 h-8 rounded-full object-cover border border-gray-200"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                      )}
                      <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*" 
                          onChange={handleAvatarUpload}
                          disabled={uploading}
                        />
                        <Settings className={`w-4 h-4 text-white ${uploading ? 'animate-spin' : ''}`} />
                      </label>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-blue-600 leading-none mb-0.5">
                        {profile?.role === 'admin' ? 'ადმინისტრატორი' : profile?.status || 'პროფილი'}
                      </span>
                      <span className="text-xs font-semibold leading-none">
                        {profile?.first_name} {profile?.last_name}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    title="გამოსვლა"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-600/20"
                >
                  შესვლა
                </button>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2 text-gray-500"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
            >
              <div className="px-4 py-6 space-y-4">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => {
                      setCurrentPage(link.id as Page);
                      setIsMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 w-full p-3 rounded-xl text-sm font-medium ${
                      currentPage === link.id ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {link.icon}
                    {link.label}
                  </button>
                ))}
                {!session && (
                  <button
                    onClick={() => {
                      setAuthModalOpen(true);
                      setIsMenuOpen(false);
                    }}
                    className="w-full bg-blue-600 text-white p-3 rounded-xl text-sm font-semibold"
                  >
                    შესვლა
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="pt-20">
        <AnimatePresence mode="wait">
          {currentPage === 'home' && <Home onNavigate={(p) => setCurrentPage(p)} />}
          {currentPage === 'news' && <News />}
          {currentPage === 'blog' && <Blog />}
          {currentPage === 'tutors' && <TutorsHub />}
          {currentPage === 'about' && <About />}
          {currentPage === 'contact' && <Contact />}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-100 py-20 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <img src={LOGO_URL} alt="logo" className="h-8 w-auto" referrerPolicy="no-referrer" />
                <span className="text-xl font-bold tracking-tight text-blue-600">liveschool.ge</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
                საგანმანათლებლო პლატფორმა რომელიც აკავშირებს მოსწავლეებსა და მასწავლებლებს. 
                აქ იპოვნი ტესტებს, სასწვლო რესურსებსა და რეპეტიტორებს.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-gray-400">ნავიგაცია</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li><button onClick={() => setCurrentPage('news')} className="hover:text-blue-600">სიახლეები</button></li>
                <li><button onClick={() => setCurrentPage('blog')} className="hover:text-blue-600">ბლოგი</button></li>
                <li><button onClick={() => setCurrentPage('tutors')} className="hover:text-blue-600">Tutors Hub</button></li>
                <li><button onClick={() => setCurrentPage('about')} className="hover:text-blue-600">ჩვენ შესახებ</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-gray-400">კონტაქტი</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li className="flex items-center gap-3"><Mail className="w-4 h-4" /> info@liveschool.ge</li>
                <li className="flex items-center gap-3"><Phone className="w-4 h-4" /> +995 555 00 00 00</li>
                <li className="flex items-center gap-3"><MapPin className="w-4 h-4" /> თბილისი, საქართველო</li>
              </ul>
            </div>
          </div>
          <div className="mt-20 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs text-gray-400">© 2026 liveschool.ge. ყველა უფლება დაცულია.</p>
            <div className="flex gap-6">
              <Facebook className="w-5 h-5 text-gray-400 hover:text-blue-600 cursor-pointer transition-colors" />
              <Instagram className="w-5 h-5 text-gray-400 hover:text-pink-600 cursor-pointer transition-colors" />
              <Linkedin className="w-5 h-5 text-gray-400 hover:text-blue-700 cursor-pointer transition-colors" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// --- Components ---

function Home({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      {/* Hero */}
      <section className="py-20 md:py-32 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-widest rounded-full mb-6">
            საგანმანათლებლო პლატფორმა
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
            ისწავლე <span className="text-blue-600">უკეთესად</span> <br />
            liveschool.ge-სთან ერთად
          </h1>
          <p className="text-lg text-gray-500 mb-10 leading-relaxed max-w-lg">
            ჩვენი პლატფორმა აკავშირებს მოსწავლეებსა და მასწავლებლებს. 
            აქ იპოვნი ტესტებს, სასწვლო რესურსებსა და საუკეთესო რეპეტიტორებს.
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => onNavigate('tutors')}
              className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-xl shadow-blue-600/20"
            >
              იპოვე რეპეტიტორი
            </button>
            <button 
              onClick={() => onNavigate('about')}
              className="bg-white text-gray-900 border border-gray-200 px-8 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all active:scale-95"
            >
              გაიგე მეტი
            </button>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-4 bg-blue-600/5 blur-3xl rounded-full" />
          <img 
            src="https://picsum.photos/seed/education/800/600" 
            alt="Education" 
            className="relative rounded-[40px] shadow-2xl border border-gray-100"
            referrerPolicy="no-referrer"
          />
        </div>
      </section>

      {/* Features */}
      <section className="py-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard 
          icon={<GraduationCap className="w-8 h-8 text-blue-600" />}
          title="რეპეტიტორები"
          description="საუკეთესო სპეციალისტები ყველა საგანში, რომლებიც დაგეხმარებიან ცოდნის გაღრმავებაში."
        />
        <FeatureCard 
          icon={<FileText className="w-8 h-8 text-blue-600" />}
          title="ტესტები"
          description="მრავალფეროვანი ტესტები და სავარჯიშოები თვითშემოწმებისთვის."
        />
        <FeatureCard 
          icon={<BookOpen className="w-8 h-8 text-blue-600" />}
          title="რესურსები"
          description="უფასო სასწავლო მასალები, ვიდეო გაკვეთილები და სახელმძღვანელოები."
        />
      </section>
    </motion.div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
      <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-8">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function News() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 py-20"
    >
      <h2 className="text-4xl font-bold mb-12 tracking-tight">სიახლეები</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="group cursor-pointer">
            <div className="overflow-hidden rounded-3xl mb-6">
              <img 
                src={`https://picsum.photos/seed/news${i}/600/400`} 
                alt="News" 
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="text-blue-600 text-xs font-bold uppercase tracking-widest mb-3">განათლება • 13 აპრილი, 2026</p>
            <h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors">სიახლე განათლების სფეროში #{i}</h3>
            <p className="text-gray-500 text-sm line-clamp-2">მოკლე აღწერა იმის შესახებ თუ რა ხდება განათლების სამყაროში დღეს...</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function Blog() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 py-20"
    >
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-4xl font-bold tracking-tight mb-2">ბლოგი</h2>
          <p className="text-gray-500">სასარგებლო რჩევები და სტატიები</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-gray-100 rounded-full text-xs font-bold">ყველა</button>
          <button className="px-4 py-2 hover:bg-gray-100 rounded-full text-xs font-bold transition-colors">რჩევები</button>
          <button className="px-4 py-2 hover:bg-gray-100 rounded-full text-xs font-bold transition-colors">სტატიები</button>
        </div>
      </div>
      <div className="space-y-12">
        {[1, 2, 3].map((i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className={`overflow-hidden rounded-[40px] ${i % 2 === 0 ? 'md:order-2' : ''}`}>
              <img 
                src={`https://picsum.photos/seed/blog${i}/800/500`} 
                alt="Blog" 
                className="w-full h-80 object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className={i % 2 === 0 ? 'md:order-1' : ''}>
              <p className="text-blue-600 text-xs font-bold uppercase tracking-widest mb-4">სტატია • 5 წთ კითხვა</p>
              <h3 className="text-3xl font-bold mb-6">როგორ მოვემზადოთ გამოცდებისთვის ეფექტურად</h3>
              <p className="text-gray-500 mb-8 leading-relaxed">
                გამოცდების პერიოდი ყოველთვის სტრესულია, მაგრამ სწორი დაგეგმვით და მეთოდებით შესაძლებელია პროცესის გამარტივება...
              </p>
              <button className="flex items-center gap-2 text-blue-600 font-bold group">
                კითხვა გაგრძელება <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function TutorsHub() {
  const tutors = [
    { name: 'ნინო ბერიძე', subject: 'მათემატიკა', rating: 4.9, price: '25₾/სთ', image: 'https://picsum.photos/seed/tutor1/200/200' },
    { name: 'გიორგი კაპანაძე', subject: 'ფიზიკა', rating: 4.8, price: '30₾/სთ', image: 'https://picsum.photos/seed/tutor2/200/200' },
    { name: 'ანა მელიქიძე', subject: 'ინგლისური', rating: 5.0, price: '20₾/სთ', image: 'https://picsum.photos/seed/tutor3/200/200' },
    { name: 'დავით აბაშიძე', subject: 'ისტორია', rating: 4.7, price: '15₾/სთ', image: 'https://picsum.photos/seed/tutor4/200/200' },
    { name: 'მარიამ ჯავახიშვილი', subject: 'ბიოლოგია', rating: 4.9, price: '25₾/სთ', image: 'https://picsum.photos/seed/tutor5/200/200' },
    { name: 'ლევან გოგიჩაიშვილი', subject: 'ქიმია', rating: 4.6, price: '20₾/სთ', image: 'https://picsum.photos/seed/tutor6/200/200' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 py-20"
    >
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16">
        <div>
          <h2 className="text-4xl font-bold tracking-tight mb-2">Tutors Hub</h2>
          <p className="text-gray-500">იპოვე შენი იდეალური მასწავლებელი</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="ძებნა საგნის ან სახელის მიხედვით..." 
            className="w-full pl-12 pr-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:border-blue-600 focus:bg-white outline-none transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tutors.map((tutor, i) => (
          <div key={i} className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex items-center gap-6 mb-8">
              <img src={tutor.image} alt={tutor.name} className="w-20 h-20 rounded-2xl object-cover" referrerPolicy="no-referrer" />
              <div>
                <h3 className="font-bold text-lg mb-1">{tutor.name}</h3>
                <p className="text-blue-600 text-sm font-medium">{tutor.subject}</p>
              </div>
            </div>
            <div className="flex justify-between items-center py-6 border-y border-gray-50 mb-8">
              <div className="text-center">
                <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">რეიტინგი</p>
                <p className="font-bold">⭐ {tutor.rating}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">ფასი</p>
                <p className="font-bold">{tutor.price}</p>
              </div>
            </div>
            <button className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold group-hover:bg-blue-600 transition-colors active:scale-95">
              დაჯავშნა
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function About() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 py-20"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
        <div>
          <h2 className="text-5xl font-bold tracking-tight mb-8 leading-tight">
            ჩვენი მისიაა <span className="text-blue-600">განათლების</span> ხელმისაწვდომობა
          </h2>
          <p className="text-lg text-gray-500 mb-8 leading-relaxed">
            liveschool.ge შეიქმნა იმისთვის, რომ დაეხმაროს მოსწავლეებსა და მასწავლებლებს ერთმანეთის პოვნაში. 
            ჩვენ გვჯერა, რომ ხარისხიანი განათლება ყველასთვის ხელმისაწვდომი უნდა იყოს.
          </p>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-4xl font-bold text-blue-600 mb-2">1000+</p>
              <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">მოსწავლე</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-600 mb-2">200+</p>
              <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">მასწავლებელი</p>
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <img 
            src={LOGO_URL} 
            alt="About logo" 
            className="w-full max-w-md animate-pulse" 
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      <div className="bg-blue-600 rounded-[60px] p-12 md:p-20 text-white text-center">
        <h3 className="text-3xl md:text-5xl font-bold mb-8">გახდი ჩვენი გუნდის წევრი</h3>
        <p className="text-blue-100 text-lg mb-12 max-w-2xl mx-auto">
          თუ ხარ მასწავლებელი და გსურს შენი ცოდნა გაუზიარო სხვებს, შემოგვიერთდი დღესვე.
        </p>
        <button className="bg-white text-blue-600 px-12 py-5 rounded-3xl font-bold hover:bg-blue-50 transition-all active:scale-95 shadow-2xl">
          რეგისტრაცია მასწავლებლად
        </button>
      </div>
    </motion.div>
  );
}

function Contact() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 py-20"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div>
          <h2 className="text-5xl font-bold tracking-tight mb-8">დაგვიკავშირდით</h2>
          <p className="text-lg text-gray-500 mb-12">
            გაქვთ კითხვები? მოგვწერეთ და ჩვენი გუნდი მალე გიპასუხებთ.
          </p>
          
          <div className="space-y-8">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">ელ-ფოსტა</p>
                <p className="font-bold">info@liveschool.ge</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">ტელეფონი</p>
                <p className="font-bold">+995 555 00 00 00</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">მისამართი</p>
                <p className="font-bold">თბილისი, საქართველო</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-10 md:p-12 rounded-[40px] border border-gray-100 shadow-xl">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-2">სახელი</label>
                <input type="text" className="w-full p-4 bg-gray-50 rounded-2xl border border-transparent focus:border-blue-600 focus:bg-white outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-2">ელ-ფოსტა</label>
                <input type="email" className="w-full p-4 bg-gray-50 rounded-2xl border border-transparent focus:border-blue-600 focus:bg-white outline-none transition-all" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-2">თემა</label>
              <input type="text" className="w-full p-4 bg-gray-50 rounded-2xl border border-transparent focus:border-blue-600 focus:bg-white outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-2">შეტყობინება</label>
              <textarea className="w-full h-40 p-4 bg-gray-50 rounded-2xl border border-transparent focus:border-blue-600 focus:bg-white outline-none transition-all resize-none" />
            </div>
            <button className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-xl shadow-blue-600/20">
              გაგზავნა
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
function NavItem({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
        active ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 hover:text-black'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function StatCard({ title, value, description }: { title: string, value: string, description: string }) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">{title}</p>
      <p className="text-2xl font-semibold mb-2 tracking-tight">{value}</p>
      <p className="text-xs text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}
