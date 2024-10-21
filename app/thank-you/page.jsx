"use client";
import { Check } from 'lucide-react';
import React from 'react';

const ThankYouPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-transparent p-6 sm:p-8 md:p-10 rounded text-center w-full max-w-md">
        <div className="flex flex-col items-center mb-4">
          <Check width={100} height={100} className="bg-green-500 text-white p-3 rounded-full mb-4" /> {/* İkon buraya eklendi */}
          <h1 className="text-xl sm:text-2xl font-bold mb-2">Teşekkürler!</h1>
          <p className="text-base sm:text-lg">Formu başarıyla cevapladığınız için teşekkür ederiz!</p>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
