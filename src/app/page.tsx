"use client";

import { Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Navbar from "@/components/custom/navbar";

export default function Home() {
  const FirstMessages = [
    {
      title: "Journey Through the Stars",
      content: "An exploration of the wonders of the universe, from distant galaxies to the mysteries of black holes.",
      createdAt: '2024-09-24',
    },
    {
      title: "Whispers of Ancient Forests",
      content: "A deep dive into the ecosystems of ancient woodlands and the secrets they hold about our planet's history.",
      createdAt: '2024-09-25',
    },
    {
      title: "The Art of Mindfulness",
      content: "Discover the transformative power of mindfulness practices in everyday life and how they can enhance your well-being.",
      createdAt: '2024-09-26',
    }
  ];
  return (
    <>
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-gray-800 text-white">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold">
            Step into the Realm of Anonymous Messaging!
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg">
            Mystery Inbox - Where your identity stays under wraps—ready to
            share your thoughts without a trace.
          </p>
        </section>

        <Carousel
          plugins={[Autoplay({ delay: 2000 })]}
          className="w-full max-w-lg md:max-w-xl"
        >
          <CarouselContent>
          {
          FirstMessages.map((messageData, index) => (
              <CarouselItem key={index} className="p-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{messageData.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                    <Mail className="flex-shrink-0" />
                    <div>
                      <p>{messageData.content}</p>
                      <p className="text-xs text-muted-foreground">
                        {messageData.createdAt}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </main>
    </>
  );
}