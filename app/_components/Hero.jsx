"use client";
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

function Hero() {
  const router = useRouter();

  const handleClick = () => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard');
    } else {
      router.push('/sign-in');
    }
  };

  return (
    <section className="h-screen bg-gray-50 flex items-center justify-center">
      <div className="mx-auto max-w-screen-xl px-4 py-16 lg:flex lg:h-screen lg:items-center">
        <div className="mx-auto max-w-xl text-center">
          <div className="flex justify-center mb-6">
            <Image src='/logo.png' width={200} height={200} alt="Logo" />
          </div>
          <h1 className="text-3xl font-extrabold sm:text-5xl">
            Form Oluşturmak Artık
            <strong className="font-extrabold text-red-700 sm:block"> Daha Kolay. </strong>
          </h1>

          <p className="mt-4 text-sm sm:text-xl">
            Hedef kitlenizle daha iyi bağlantı kurmak için anketler oluşturun. Kolay ve etkili bir şekilde geri bildirim alın!
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <button
              className="block w-full rounded bg-red-600 px-6 py-2 text-sm font-medium text-white shadow hover:bg-red-700 focus:outline-none focus:ring active:bg-red-500 sm:w-auto sm:px-12 sm:py-3"
              onClick={handleClick}
            >
              Haydi Başla
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
