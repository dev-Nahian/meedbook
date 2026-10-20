import { Link } from "react-router-dom";

const logo = "/Images/logo.svg";

const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

const SocialIcons = () => (
  <div className="flex items-center gap-3">
    <Link 
      to="https://facebook.com" 
      target="_blank" 
      rel="noopener noreferrer"
      className="group"
    >
      <div className="w-9 h-9 rounded-full flex items-center justify-center border border-[#334155] hover:border-[#22d3ee] bg-[#1e2937] hover:bg-[#22d3ee]/10 transition-all duration-300 hover:scale-110">
        <FacebookIcon />
      </div>
    </Link>

    <Link 
      to="https://linkedin.com" 
      target="_blank" 
      rel="noopener noreferrer"
      className="group"
    >
      <div className="w-9 h-9 rounded-full flex items-center justify-center border border-[#334155] hover:border-[#22d3ee] bg-[#1e2937] hover:bg-[#22d3ee]/10 transition-all duration-300 hover:scale-110">
        <LinkedInIcon />
      </div>
    </Link>

    <Link 
      to="https://instagram.com" 
      target="_blank" 
      rel="noopener noreferrer"
      className="group"
    >
      <div className="w-9 h-9 rounded-full flex items-center justify-center border border-[#334155] hover:border-[#22d3ee] bg-[#1e2937] hover:bg-[#22d3ee]/10 transition-all duration-300 hover:scale-110">
        <InstagramIcon />
      </div>
    </Link>

    <Link 
      to="https://twitter.com" 
      target="_blank" 
      rel="noopener noreferrer"
      className="group"
    >
      <div className="w-9 h-9 rounded-full flex items-center justify-center border border-[#334155] hover:border-[#22d3ee] bg-[#1e2937] hover:bg-[#22d3ee]/10 transition-all duration-300 hover:scale-110">
        <XIcon />
      </div>
    </Link>
  </div>
);

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] text-white mt-30 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          
          {/* Logo & Description */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-4">
              <Link to="/" className="flex items-center gap-2 group">
              <div className="flex items-center justify-center">
                <img
                  src={logo}
                  alt="MedBook Logo"
                  className="h-12 w-auto transition-transform group-hover:scale-110 duration-300"
                />
              </div>
              <h1 className="text-2xl font-semibold tracking-tighter text-primary">
                MedBook
              </h1>
            </Link>
            </div>
            
            <p className="text-gray-400 text-[15px] leading-relaxed max-w-md">
              Your trusted platform for booking medical appointments with ease and confidence.
            </p>

            {/* Social Icons with Animation */}
            <div className="mt-8">
              <SocialIcons />
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-semibold mb-5 text-lg">Quick Links</h3>
            <ul className="space-y-3 text-gray-400 text-[15px]">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/see-all-clinic" className="hover:text-white transition-colors">Find Clinics</Link></li>
              <li><Link to="/list-your-clinic" className="hover:text-white transition-colors">List Your Clinic</Link></li>
              <li><Link to="/about-us" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Legal & Resources */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-semibold mb-5 text-lg">Resources</h3>
            <ul className="space-y-3 text-gray-400 text-[15px]">
              <li><Link to="/blog" className="hover:text-white transition-colors">Health Blog</Link></li>
              <li><Link to="/book-dialysis-abroad" className="hover:text-white transition-colors">Dialysis Abroad</Link></li>
              <li><Link to="/travel-insurance" className="hover:text-white transition-colors">Travel Insurance</Link></li>
              <li><Link to="/faqs" className="hover:text-white transition-colors">Help & FAQ</Link></li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="lg:col-span-3">
            <h3 className="text-white font-semibold mb-5 text-lg">Contact Information</h3>
            <div className="space-y-4 text-gray-400 text-[15px]">
              <p>+65 6789 0123</p>
              <p>support@medbook.health</p>
              <p>
                Novena Medical Hub, 123 Medical Blvd<br />
                Singapore 308610
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Divider */}
        <div className="border-t border-gray-800 mt-16 pt-8">
          <div className="text-center gap-4 text-sm text-gray-500">
            <p>© 2026 MedBook Health Network. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}