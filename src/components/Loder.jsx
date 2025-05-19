import React, { use } from 'react';


const Loder = () => {
  return (
    <div className="h-[94vh] w-[100vw] bg-black flex items-center justify-center flex-col">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-white text-lg tracking-widest">Loading...</p>
    </div>
  );
};

export default Loder;
