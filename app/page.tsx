"use client";
import Image from "next/image";
import { Calendar, Clock, MapPin, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CountdownTimer } from "@/components/countdown-timer";
import { GallerySection } from "@/components/gallery-section";
import { MusicPlayer } from "@/components/music-player";

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
      console.log(error)
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* Hero Section */}
      <section className="flex flex-col gap-4">
        {/* <div className="absolute inset-0 bg-black/30 z-10" /> */}
        <div className="h-screen w-full">
          <Image
            src="/images/bg.jpg"
            alt="Wedding couple"
            fill
            priority
            className="object-cover"
          />
          <div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center cursor-pointer z-10 md:hidden"
            onClick={handleScrollDown}
            aria-label="Scroll down"
          >
            <ChevronDown className="h-10 w-10 text-white drop-shadow-lg animate-bounce" />
            <p className="text-white text-sm mt-1 drop-shadow-lg">
              Scroll Down
            </p>
          </div>
        </div>

        <div className="inset-0 flex flex-col items-center justify-center text-center z-20 text-black p-4 gap-12">
          <div>
            {/* <h1 className="font-serif text-5xl md:text-7xl mb-4">
              Արման & Անահիտ
            </h1> */}
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-xl md:text-2xl mb-4 font-light">Հարգելի՝ հյուրեր</p>
            <p className="">Սիրով հրավիրում ենք Ձեզ</p>
            <p className="">կիսելու մեզ հետ, մեր կյանքի</p>
            <p className="">կարևոր և հիշարժան օրը</p>
            <p className="">28․06․2025</p>
          </div>
          <div>
            <p className="text-xl md:text-2xl mb-8 font-light">
              Հարսանիքին մնացել է
            </p>
            <CountdownTimer targetDate="2025-06-26T17:00:00" />
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <GallerySection />

      {/* Event Details Section */}
      <section className="py-24 px-4 w-full bg-stone-100">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-serif text-4xl md:text-5xl mb-6">Ծրագիր</h2>
          <Separator className="mx-auto w-24 mb-12" />

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="h-8 w-8 text-stone-700" />
              </div>
              <h3 className="font-serif text-2xl mb-4">The Date</h3>
              <p className="text-lg">Jun 28, 2025</p>
              <p className="text-stone-500">Sunday</p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="h-8 w-8 text-stone-700" />
              </div>
              <h3 className="font-serif text-2xl mb-4">The Time</h3>
              <p className="text-lg">14:30</p>
              <p className="text-stone-500">Պսակադրություն</p>
              <p className="text-lg mt-2">17:00</p>
              <p className="text-stone-500">Հարսանյաց Հանդիսություն</p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="h-8 w-8 text-stone-700" />
              </div>
              <h3 className="font-serif text-2xl mb-4">The Venue</h3>
              <p className="text-lg">Elegant Gardens</p>
              <p className="text-stone-500">123 Wedding Lane</p>
              <p className="text-stone-500">Yerevan, Armenia</p>
              <Button variant="link" className="mt-4">
                View Map
              </Button>
            </div>
          </div>
        </div>
      </section>
      <MusicPlayer />
    </main>
  );
}
