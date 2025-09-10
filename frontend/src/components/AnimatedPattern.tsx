import React from 'react';

const AnimatedPattern: React.FC = () => {
  return (
   <div className="relative h-full w-full bg-gradient-to-br from-orange-400 via-amber-400 to-yellow-500 dark:from-orange-700 dark:via-amber-800 dark:to-yellow-700 overflow-hidden flex flex-col items-center justify-center">

    <div>
      <img src={'/prod-manage.png'} alt="Product Management" className="w-96 h-96 object-cover" />
    </div>
  {/* Main content */}
  <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">

    {/* Main heading with enhanced typography */}
    <div className="mb-8">
      <h1 className="text-5xl font-black mb-4 leading-none tracking-tighter">
        <span className="bg-gradient-to-r from-white via-white/95 to-white/90 bg-clip-text text-transparent drop-shadow-2xl">
          Product Management
        </span>
      </h1>
    </div>

    {/* Subtitle with enhanced spacing and typography */}
    <p className="text-2xl text-white/85 mb-12 font-light  tracking-tight md:max-w-2xl mx-auto">
      Add, edit, and track your products with ease — smart tools to keep your inventory organized and business on track
    </p>

    {/* Call to action area */}
    <div className="text-center">
      <p className="text-white/60 text-sm font-medium tracking-widest uppercase mb-4">
        Start Managing Today
      </p>
      <div className="w-16 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent mx-auto"></div>
    </div>

  </div>

</div>
    // <div className="flex justify-center items-center min-h-screen">
    //   <img src='./login.jpg' alt='Login' className='h-full'/>
    // </div>
  );
};

export default AnimatedPattern;