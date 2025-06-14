import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const timelineEvents = [
  { year: 2020, event: "Elected Mayor" },
  { year: 2021, event: "Launched City-wide Education Initiative" },
  { year: 2022, event: 'Published "Future of Education" Book' },
  { year: 2023, event: "Launched Scholarship Program" },
];

const testimonials = [
  {
    id: 1,
    text: "A true visionary in education and politics.",
    author: "Jane Doe, Student",
  },
  {
    id: 2,
    text: "His leadership has transformed our college.",
    author: "John Smith, Faculty",
  },
  {
    id: 3,
    text: "An inspiration to the community.",
    author: "Alice Johnson, Resident",
  },
];

export default function About() {
  return (
    <section className="w-full bg-white py-20">
      <div className="container mx-auto px-4">
        <h2 className="section-title">About Me</h2>
        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="flex flex-col justify-center">
            <Image
              src="/placeholder.svg?height=400&width=400"
              alt="Leader's portrait"
              width={400}
              height={400}
              className="mb-4 rounded-lg"
            />
            <p className="text-lg">
              As a dedicated public servant, educator, and visionary leader, I
              have committed my life to improving our community through
              education and innovative governance. With over two decades of
              experience in both academia and politics, I bring a unique
              perspective to addressing the challenges of our time.
            </p>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 h-full border-l-2 border-navy"></div>
            {timelineEvents.map((event, index) => (
              <div key={index} className="mb-8 flex items-center">
                <div className="absolute left-1/2 -ml-2 h-4 w-4 rounded-full bg-navy"></div>
                <div
                  className={`w-1/2 ${index % 2 === 0 ? "pr-8 text-right" : "ml-auto pl-8"}`}
                >
                  <h3 className="font-bold">{event.year}</h3>
                  <p>{event.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Carousel className="mx-auto w-full max-w-xl">
          <CarouselContent>
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.id}>
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <p className="mb-4 text-center text-lg">
                      {testimonial.text}
                    </p>
                    <p className="font-semibold">- {testimonial.author}</p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}
