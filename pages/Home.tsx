
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
      {/* Hero Section - High Impact Automotive Aesthetic */}
      <section className={`${themeStyles.primary} text-white py-20 md:py-32 relative overflow-hidden transition-all duration-500`}>
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-[120px] animate-pulse"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-3/5 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20 animate-in fade-in slide-in-from-top-4 duration-700">
                <ShieldCheck size={18} className={themeStyles.accent} />
                <span className="text-sm font-bold uppercase tracking-widest">Certified Premium Retailer</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black mb-6 leading-[1.1] tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-1000">
                Performance Starts <br />
                <span className={`bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-blue-300`}>
                  From The Ground Up.
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl opacity-80 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                The most trusted tyre specialists in the region. Explore high-performance brands and precision services at {settings.businessName}.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
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

            {/* Floating Visual Element */}
            <div className="lg:w-2/5 hidden lg:block relative group animate-in zoom-in duration-1000 delay-500">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <img 
                src="https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800" 
                alt="Tyre Performance" 
                className="relative rounded-[40px] shadow-2xl border-4 border-white/10 transform -rotate-2 group-hover:rotate-0 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Brand Selection - Refined Layout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 mb-24 relative z-20">
        <div className="bg-white rounded-[48px] shadow-2xl p-10 md:p-16 border border-slate-100">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Star className="text-yellow-400 fill-yellow-400" size={16} />
                <span className="text-blue-600 font-black uppercase tracking-widest text-sm">Official Partner</span>
              </div>
              <h2 className="text-4xl font-black text-slate-900">Featured Brands</h2>
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

      {/* Services Section - Modern Service Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black text-slate-900 mb-6">Expert Service Center</h2>
          <div className="h-2 w-32 bg-gradient-to-r from-blue-600 to-cyan-400 mx-auto rounded-full mb-8"></div>
          <p className="text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed">
            Our workshop is equipped with the latest diagnostic tools to ensure your vehicle 
            stays safe, balanced, and ready for any road conditions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <div 
              key={service.id} 
              className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl hover:shadow-2xl hover:border-blue-200 transition-all duration-300 group"
            >
              <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-5xl mb-8 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                {service.icon}
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

      {/* Trust Badges / Why Choose Us */}
      <section className="bg-slate-900 py-24 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/5 -skew-x-12 transform translate-x-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { 
                icon: <Award className="text-blue-400" size={40} />, 
                title: "Authorised Retailer", 
                desc: "We source directly from manufacturers to guarantee 100% genuine products and warranties." 
              },
              { 
                icon: <CheckCircle className="text-green-400" size={40} />, 
                title: "Safety First Policy", 
                desc: "Every tyre we fit undergoes a rigorous 10-point safety check before you leave our center." 
              },
              { 
                icon: <Wrench className="text-cyan-400" size={40} />, 
                title: "Precision Equipment", 
                desc: "Our workshop uses the latest computer-aided alignment and balancing machines for perfect results." 
              }
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
    </div>
  );
};

export default Home;
