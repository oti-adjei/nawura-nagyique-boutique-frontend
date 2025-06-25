import { getStrapiMedia } from "@/lib/utils";
import Image from "next/image";

interface HeroProps {
  hero: {
    title: string;
    subtitle: string;
    imageUrl: { // Define the structure of the imageUrl object
      url?: string;
    };
    callToActionText: string;
    callToActionUrl: string;
  };
}

const HeroSection = ({ hero }: HeroProps) => {

  if (!hero) {
    console.log("inside my hero is " + hero);

    return (
      <div className="w-full h-[500px] md:h-[600px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-300" />
      </div>
    );
  }

  // const image = process.env.NEXT_PUBLIC_STRAPI_URL + hero.imageUrl.url;
  return (
    <section
      className="relative flex items-center text-white bg-blue-500 h-[70vh]" // Added bg-blue-500 for visibility
    >
      {/* <div className="w-full h-[600px] xl:h-full object-cover"> */}
      <div style={{ position: "relative", width: `${100}%`, height: `${100}%` }}>
        <Image
        // className="w-full h-[600px] xl:h-full object-cover"
        src={getStrapiMedia(hero.imageUrl.url)} // Use the utility function to get the image URL
        alt={hero.title}
        fill
        // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        // height={600}
        objectFit="cover" // Adjusted opacity for background effect
        // objectPosition="top"
        priority // Load the image with priority
      />
      </div>
      {/* </div> */}
      {/* Removed Image component */}
      <div className="bg-black/50 w-full h-full absolute top-0 left-0 z-0"></div>
      <div className="absolute z-10 max-w-3xl ml-4 md:ml-40 mr-4 md:mr-8">
        <h1 className="text-2xl md:text-4xl font-bold">{hero.title}</h1>
        <p className="text-lg md:text-xl mt-2">{hero.subtitle}</p>
        <a href={hero.callToActionUrl} className="mt-4 inline-block px-6 py-2 bg-pink-600 text-white rounded">
          {hero.callToActionText}
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
