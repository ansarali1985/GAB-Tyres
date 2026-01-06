import React from 'react';
import { useApp } from '../AppContext';
import { THEMES } from '../constants';
import { MapPin, Phone, Mail, Clock, MessageSquare } from 'lucide-react';

const Contact: React.FC = () => {
  const { settings } = useApp();
  const themeStyles = THEMES[settings.theme];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-20">
        <h1 className="text-5xl font-black text-gray-900 mb-6">Get In Touch</h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          Have questions about our stock or need a service appointment? We're here to help you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Contact Info */}
        <div className="space-y-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Phone size={24} />
              </div>
              <h3 className="text-lg font-bold mb-2">Phone</h3>
              <p className="text-gray-500">{settings.whatsappNumber}</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                <Mail size={24} />
              </div>
              <h3 className="text-lg font-bold mb-2">Email</h3>
              <p className="text-gray-500">{settings.businessEmail}</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6">
                <MapPin size={24} />
              </div>
              <h3 className="text-lg font-bold mb-2">Location</h3>
              <p className="text-gray-500">{settings.businessAddress}</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-6">
                <Clock size={24} />
              </div>
              <h3 className="text-lg font-bold mb-2">Hours</h3>
              <p className="text-gray-500">Mon - Sat: 9am - 8pm</p>
            </div>
          </div>

          <div className={`${themeStyles.primary} p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden`}>
            <div className="relative z-10">
              <h2 className="text-3xl font-black mb-4">Direct WhatsApp Support</h2>
              <p className="mb-8 opacity-90 text-lg">
                Click the button below to start a live chat with our customer service team.
              </p>
              <a 
                href={`https://wa.me/${settings.whatsappNumber}`}
                className="inline-flex items-center space-x-3 bg-white text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all shadow-xl"
              >
                <MessageSquare size={24} />
                <span>Chat Now</span>
              </a>
            </div>
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl transform translate-x-10 -translate-y-10"></div>
          </div>
        </div>

        {/* Contact Form (UI Only) */}
        <div className="bg-white p-10 md:p-12 rounded-[40px] shadow-2xl border border-gray-100">
          <h2 className="text-3xl font-black text-gray-900 mb-8">Send a Message</h2>
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Your Name</label>
                <input type="text" className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-500 transition-all" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
                <input type="email" className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-500 transition-all" placeholder="john@example.com" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Subject</label>
              <input type="text" className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-500 transition-all" placeholder="Tyre Availability Query" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Message</label>
              <textarea rows={5} className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-500 transition-all" placeholder="Tell us what you're looking for..."></textarea>
            </div>
            <button className={`${themeStyles.primary} text-white w-full py-5 rounded-2xl font-black text-xl shadow-xl hover:scale-[1.01] transition-all`}>
              Send Inquiry
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;