import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

const NoFound = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col-reverse items-center justify-center gap-16 py-24 md:gap-28 md:py-20 md:px-44 lg:flex-row lg:px-24 lg:py-24">
      <div className="relative w-full pb-12 lg:pb-0 xl:w-1/2 xl:pt-24">
        <div className="relative">
          <div className="absolute">
            <div className="">
              <h1 className="my-2 text-2xl font-bold text-gray-800">
                Görünüşe göre topluluk ile alakalı bir paylaşım bulamadık.
              </h1>
              <p className="my-2 text-gray-800">
                İlk paylaşımı sen yapmak ister misin?
              </p>
              <button
                onClick={() => {
                  void router.push("/create/post");
                }}
                className="md my-2 rounded border bg-indigo-600 py-4 px-8 text-center text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-opacity-50 sm:w-full lg:w-auto"
              >
                Yeni Paylaşım Oluştur
              </button>
            </div>
          </div>
          <div>
            <img src="https://i.ibb.co/G9DC8S0/404-2.png" />
          </div>
        </div>
      </div>
      <div>
        <Image src="/images/alone.png" width={500} height={500} alt="alone" />
      </div>
    </div>
  );
};

export default NoFound;
