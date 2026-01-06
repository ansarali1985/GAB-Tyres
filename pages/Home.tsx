
import React from 'react';
import { useApp } from '../AppContext';
import { THEMES } from '../constants';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Award, Wrench, CheckCircle, ArrowRight, Star, ShieldCheck } from 'lucide-react';

const Home: React.FC = () => {
  const { brands, services, settings } = useApp();
  const themeStyles = THEMES[settings.theme];
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-20 bg-slate-50/50">
      {/* Hero Section */}
      {settings.showHero && (
        <section className={`${themeStyles.primary} text-white py-20 md:py-32 relative overflow-hidden transition-all duration-500`}>
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-[120px] animate-pulse"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-3/5 text-center lg:text-left">
                <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20">
                  <ShieldCheck size={18} className={themeStyles.accent} />
                  <span className="text-sm font-bold uppercase tracking-widest">Certified Premium Retailer</span>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-black mb-6 leading-[1.1] tracking-tight">
                  {settings.homeHeroTitle}
                </h1>
                
                <p className="text-xl md:text-2xl opacity-80 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  {settings.homeHeroSubtitle}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link 
                    to="/brands" 
                    className="bg-white text-slate-900 px-10 py-5 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-2xl flex items-center justify-center space-x-3 group"
                  >
                    <span>Explore Brands</span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <a 
                    href={`https://wa.me/${settings.whatsappNumber}`}
                    className="bg-white/5 backdrop-blur-md border border-white/30 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-white/10 transition-all flex items-center justify-center space-x-3 shadow-xl"
                  >
                    <span>Book Service</span>
                  </a>
                </div>
              </div>

              <div className="lg:w-2/5 hidden lg:block relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <img 
                  src={settings.homeHeroImage} 
                  alt="Hero Visual" 
                  className="relative rounded-[40px] shadow-2xl border-4 border-white/10 transform -rotate-2 group-hover:rotate-0 transition-transform duration-700 w-full aspect-square object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Brand Selection */}
      {settings.showBrands && (
        <section className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${settings.showHero ? '-mt-16' : 'mt-20'} mb-24 relative z-20`}>
          <div className="bg-white rounded-[48px] shadow-2xl p-10 md:p-16 border border-slate-100">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Star className="text-yellow-400 fill-yellow-400" size={16} />
                  <span className="text-blue-600 font-black uppercase tracking-widest text-sm">Official Partner</span>
                </div>
                <h2 className="text-4xl font-black text-slate-900">{settings.homeBrandsTitle}</h2>
              </div>
              <Link to="/brands" className="group flex items-center space-x-2 text-slate-400 hover:text-blue-600 font-bold transition-all">
                <span>View Full Catalog</span>
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6 md:gap-8">
              {brands.slice(0, 7).map((brand) => (
                <div 
                  key={brand.id}
                  onClick={() => navigate(`/brands/${brand.id}`)}
                  className="group cursor-pointer text-center"
                >
                  <div className="w-full aspect-square bg-slate-50 rounded-3xl overflow-hidden mb-4 border border-slate-100 group-hover:border-blue-500 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-blue-500/10 group-hover:-translate-y-2">
                    <img src={brand.image} alt={brand.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                  </div>
                  <h3 className="font-black text-slate-800 text-sm md:text-base group-hover:text-blue-600 transition-colors uppercase tracking-tight">{brand.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Services Section */}
      {settings.showServices && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-slate-900 mb-6">{settings.homeServicesTitle}</h2>
            <div className="h-2 w-32 bg-gradient-to-r from-blue-600 to-cyan-400 mx-auto rounded-full mb-8"></div>
            <p className="text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed">
              {settings.homeServicesSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service) => (
              <div 
                key={service.id} 
                className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl hover:shadow-2xl hover:border-blue-200 transition-all duration-300 group overflow-hidden"
              >
                <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-5xl mb-8 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 overflow-hidden">
                  {service.image ? (
                    <img src={service.image} className="w-full h-full object-cover" alt={service.name} />
                  ) : (
                    <span>{service.icon}</span>
                  )}
                </div>
                <h3 className="text-2xl font-black mb-4 text-slate-900 leading-tight">{service.name}</h3>
                <p className="text-slate-500 mb-8 leading-relaxed text-lg italic">
                  {service.description}
                </p>
                <div className="flex justify-between items-center pt-8 border-t border-slate-50">
                  <div>
                    <p className="text-xs font-black text-slate-300 uppercase tracking-widest mb-1">Service Fee</p>
                    <span className="text-3xl font-black text-slate-900">Rs. {service.price}</span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                    <ArrowRight size={20} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Trust Badges */}
      {settings.showTrust && (
        <section className="bg-slate-900 py-24 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/5 -skew-x-12 transform translate-x-20"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              {[
                { icon: <Award className="text-blue-400" size={40} />, title: "Authorised Retailer", desc: "We source directly from manufacturers to guarantee 100% genuine products." },
                { icon: <CheckCircle className="text-green-400" size={40} />, title: "Safety First Policy", desc: "Every tyre fits undergoes a rigorous 10-point safety check." },
                { icon: <Wrench className="text-cyan-400" size={40} />, title: "Precision Equipment", desc: "Latest computer-aided alignment and balancing for perfect results." }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center md:items-start text-center md:text-left group">
                  <div className="bg-white/5 p-6 rounded-3xl mb-8 group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm border border-white/10">
                    {item.icon}
                  </div>
                  <h4 className="text-2xl font-black mb-4 tracking-tight">{item.title}</h4>
                  <p className="text-slate-400 text-lg leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
