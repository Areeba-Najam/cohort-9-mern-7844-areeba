import PropTypes from 'prop-types';

function AuthLayout({ heading, subheading, children }) {
  return (
    <div className="min-h-screen flex bg-white dark:bg-gray-950">
      <div className="hidden lg:flex lg:w-[46%] relative overflow-hidden bg-gradient-to-br from-[#5b3df5] via-[#8b5cf6] to-[#f97362]">
        <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <path d="M-50,300 C100,150 200,450 350,320 C500,190 550,400 650,350 L650,900 L-50,900 Z" fill="white" opacity="0.08" />
          <path d="M-50,500 C150,400 250,650 420,540 C560,450 600,600 650,560 L650,900 L-50,900 Z" fill="white" opacity="0.10" />
          <circle cx="90" cy="120" r="3" fill="white" opacity="0.6" />
          <circle cx="500" cy="200" r="3" fill="white" opacity="0.6" />
          <circle cx="130" cy="650" r="3" fill="white" opacity="0.6" />
        </svg>
        <div className="relative z-10 flex flex-col justify-center px-14 text-white">
          <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center text-xl mb-8">📝</div>
          <h2 className="text-4xl font-bold leading-tight mb-4 max-w-sm">{heading}</h2>
          <p className="text-white/80 text-base max-w-xs leading-relaxed">{subheading}</p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
  AuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
  heading: PropTypes.string.isRequired,
  subheading: PropTypes.string.isRequired,
}
}
export default AuthLayout;