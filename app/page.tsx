"use client";

import Image from "next/image";
import { Calendar, Church, Wine, ChevronDown, House } from "lucide-react";
import { CountdownTimer } from "@/components/countdown-timer";
import { GallerySection } from "@/components/gallery-section";
import { MusicPlayer } from "@/components/music-player";
import { DecorativeDivider } from "@/components/decorative-divider";
import { motion } from "framer-motion";

export default function Home() {
  // Smooth scroll function for the down arrow
  const handleScrollDown = () => {
    const windowHeight = window.innerHeight;
    const scrollOptions = {
      top: windowHeight,
      behavior: "smooth" as ScrollBehavior,
    };

    // Use different scroll methods for better compatibility
    try {
      // Modern browsers
      window.scrollTo(scrollOptions);
    } catch (error) {
      // Fallback for older browsers
      console.log(error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center overflow-hidden">
      {/* Hero Section */}
      <section className="flex flex-col gap-4 w-full">
        <div className="h-screen w-full relative">
          <Image
            src="/images/1.jpg"
            alt="Wedding couple"
            fill
            priority
            className="object-cover"
          />

          {/* Semi-transparent overlay for names - mobile only */}

          <div className="absolute top-4 left-4 transform flex flex-col items-center cursor-pointer z-10 md:hidden">
            <h1 className="font-serif text-white font-bold text-2xl">Աղաս</h1>
          </div>
          <div className="absolute top-16 left-12 transform flex flex-col items-center cursor-pointer z-10 md:hidden">
            <h1 className="font-serif text-white font-bold text-2xl">&</h1>
          </div>
          <div className="absolute top-28 left-14 transform flex flex-col items-center cursor-pointer z-10 md:hidden">
            <h1 className="font-serif text-white font-bold text-2xl">Լիլիթ</h1>
          </div>

          {/* Semi-transparent overlay for countdown - mobile only */}
          <div className="absolute bottom-0 left-0 w-full h-screen bg-gradient-to-b from-black/50 via-transparent to-black/50 md:hidden"></div>

          <div className="absolute bottom-22 left-1/2 transform -translate-x-1/2 flex flex-col items-center cursor-pointer z-10 md:hidden">
            <p className="text-xl md:text-2xl my-8 font-bold md:font-light text-white font-serif drop-shadow-md">
              Հարսանիքին մնացել է
            </p>
            <CountdownTimer targetDate="2025-08-23T16:30:00" />
          </div>
          <div
            className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex flex-col items-center cursor-pointer z-10 md:hidden"
            onClick={handleScrollDown}
            aria-label="Scroll down"
          >
            <ChevronDown className="h-10 w-10 text-white drop-shadow-lg animate-bounce" />
          </div>
        </div>

        <div className="inset-0 flex flex-col items-center justify-center text-center z-20 text-black p-4 gap-6">
          <div></div>
          <div className="flex flex-col gap-2">
            <p className="text-xl md:text-2xl mb-4 font-light text-stone-600 font-serif">
              Հարգելի՛ հյուրեր
            </p>
            <p className="text-stone-600 font-serif">Սիրով հրավիրում ենք Ձեզ</p>

            <p className="text-stone-600 font-serif">
              կիսելու մեզ հետ մեր կյանքի
            </p>
            <p className="text-stone-600 font-serif">կարևոր և հիշարժան օրը</p>
            <p className="mt-8 text-stone-600 font-serif text-4xl">
              23․08․2025
            </p>
          </div>
          <div className="md:block hidden pb-24">
            <p className="text-xl md:text-2xl mt-8 mb-14 font-light text-stone-600 font-serif">
              Հարսանիքին մնացել է
            </p>
            <CountdownTimer targetDate="2025-08-23T16:30:00" />
          </div>
        </div>
      </section>

      {/* Decorative divider between sections */}
      <DecorativeDivider />

      {/* Gallery Section */}
      <GallerySection />

      {/* Decorative divider between sections */}
      <DecorativeDivider />

      {/* Event Details Section - Enhanced for wedding context */}
      <section className="px-4 pb-12 w-full bg-gradient-to-b ">
        <motion.div
          className="max-w-5xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="font-serif text-4xl md:text-5xl my-12 text-stone-600">
            Ծրագիր
          </h2>
          <div className="grid md:grid-cols-3 gap-8 md:gap-6">
            <motion.div className="bg-white p-8 rounded-lg shadow-md border border-stone-100 hover:shadow-lg relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-stone-300 to-stone-500"></div>
              <div className="w-20 h-20 bg-gradient-to-br from-stone-50 to-stone-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Calendar className="h-8 w-8 text-stone-500" />
              </div>
              <h3 className="font-serif text-2xl mb-6 text-stone-600">
                Ամսաթիվ
              </h3>
              <p className="text-xl font-light text-stone-500">
                Օգոստոսի 23, 2025
              </p>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-stone-50 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
            </motion.div>

            <motion.div className="bg-white p-8 rounded-lg shadow-md border border-stone-100 hover:shadow-lg relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-stone-300 to-stone-500"></div>
              <div className="w-20 h-20 bg-gradient-to-br from-stone-50 to-stone-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <House className="h-8 w-8 text-stone-500" />
              </div>
              <p className="text-xl font-light text-stone-500">Հարսիկի տուն՝ 12:00</p>
              <p className="text-xl font-light text-stone-500 mt-4">Փեսայի տուն՝ 15:00</p>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-stone-50 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
            </motion.div>

            <motion.div className="bg-white p-8 rounded-lg shadow-md border border-stone-100 hover:shadow-lg transition-all relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-stone-300 to-stone-500"></div>
              <div className="w-20 h-20 bg-gradient-to-br from-stone-50 to-stone-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Church className="h-8 w-8 text-stone-500" />
              </div>
              <h3 className="font-serif text-2xl mb-6 text-stone-600">
                Պսակադրություն
              </h3>
              <p className="text-xl font-light text-stone-500 mb-2">
                Սուրբ Հովհաննես եկեղեցի
              </p>
              <p className="text-stone-500 font-light mt-2">
                Տավուշի մարզ, գ. Կողբ
              </p>
              <p className="text-xl font-light text-stone-500 mt-4">14:00</p>
              {/* <Button
                onClick={() => {
                  window.open(
                    "https://yandex.ru/navi/org/208720787790?si=u3dpby2bgp1qvpc6mu8cwwpf28",
                    "_blank"
                  );
                }}
                variant="outline"
                className="mt-8 border-stone-300 text-white bg-stone-600 hover:bg-stone-800 transition-colors cursor-pointer"
              >
                Ինչպես հասնել
              </Button> */}
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-stone-50 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
            </motion.div>

            <motion.div className="bg-white p-8 rounded-lg shadow-md border border-stone-100 hover:shadow-lg relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-stone-300 to-stone-500"></div>
              <div className="w-20 h-20 bg-gradient-to-br from-stone-50 to-stone-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <div className="flex justify-center">
                  <Wine className="w-8 h-8 text-stone-500 rotate-[15deg]" />
                  <Wine className="w-8 h-8 text-stone-500 rotate-[-15deg]" />
                </div>
              </div>
              <h3 className="font-serif text-2xl mb-3 text-stone-600">
                Հարսանյաց Հանդիսություն
              </h3>
              <p className="text-xl font-light text-stone-500 mt-4">
                ք. Նոյեմբերյան
              </p>
              <p className="text-stone-500 font-light mt-2">
                Նոյեմբերի 29-ի փ., 19
              </p>
              {/* <p className="text-stone-500 font-light mt-2"></p> */}
              <p className="text-xl font-light text-stone-500 mt-4">16:30</p>
              {/* <Button
                onClick={() => {
                  window.open(
                    "https://yandex.ru/navi/org/darling_hall/181968913069?si=u3dpby2bgp1qvpc6mu8cwwpf28",
                    "_blank"
                  );
                }}
                variant="outline"
                className="mt-4 border-stone-300 text-white bg-stone-600 hover:bg-stone-800 transition-colors cursor-pointer"
              >
                Ինչպես հասնել
              </Button> */}
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-stone-50 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
            </motion.div>
          </div>
        </motion.div>
      </section>
      <MusicPlayer />
    </main>
  );
}
