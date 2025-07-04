import { fetchAboutPage } from '@/lib/api';
import { getStrapiMedia } from '@/lib/utils';
import Image from 'next/image';

// --- Placeholder Data for Missing Fields ---
// Your API is still missing this data. You should add these fields to your CMS.
const mockServices = [
  { icon: '🚚', title: 'Fast Shipping', description: 'Get your authentic Ghanaian products delivered to your doorstep quickly.' },
  { icon: '💖', title: 'Handcrafted Quality', description: 'Every item is made with love and traditional craftsmanship.' },
  { icon: '🌍', title: 'Support Local', description: 'Your purchase empowers local artisans and their communities.' },
  { icon: '📦', title: 'Secure Packaging', description: 'We ensure your items arrive in perfect condition.' },
];

const mockTestimonial = {
  name: 'Akwasi Asante',
  role: 'Happy Customer',
  quote: "The quality and authenticity are unmatched. I feel a real connection to Ghana with every purchase. Highly recommended!",
  image: {
    url: '/placeholder-person.jpg' 
  }
};

const mockStatistics = [
  { value: '100+', label: 'Artisans Supported', note: 'Across various regions' },
  { value: '5k+', label: 'Products Sold', note: 'Delivered worldwide' },
  { value: '98%', label: 'Positive Reviews', note: 'From our valued customers' },
  { value: '2020', label: 'Year Founded', note: 'Sharing culture ever since' },
];
// --- End of Placeholder Data ---


export default async function AboutPage() {
  const pageData = await fetchAboutPage();

  // Access the nested History object
  const { History } = pageData;

  // Destructure and RENAME 'images' to 'gridImages' to avoid conflicts.
  const {
    // This title is not used in the new design, which has a static "Who We Are?".
    // You can keep it if you plan to make the heading dynamic.
    // title: intro_heading, 
    description: intro_body,
    images: gridImages,
  } = History;

  // Use placeholder data for the sections missing from your API response
  const services = mockServices;
  const statistics = mockStatistics;
  const {
    name: testimonial_name,
    role: testimonial_role,
    quote: testimonial_quote,
    image: testimonial_image,
  } = mockTestimonial;

  return (
    <main className="bg-white">
      {/* === NEW 'Who We Are' Section === */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          
          {/* --- Image Collage Column --- */}
          {gridImages && gridImages.length >= 3 ? (
            <div className="grid grid-cols-2 grid-rows-2 gap-4 h-[300px] md:h-[500px]">
              {/* Large Image (Left) */}
              <div className="relative col-span-1 row-span-2 rounded-lg overflow-hidden shadow-md">
                <Image
                  src={getStrapiMedia(gridImages[0].url)}
                  alt={gridImages[0].alternativeText || 'Supermarket aisle'}
                  fill
                  className="object-cover"
                />
              </div>
              {/* Top-Right Image */}
              <div className="relative col-span-1 row-span-1 rounded-lg overflow-hidden shadow-md">
                <Image
                  src={getStrapiMedia(gridImages[1].url)}
                  alt={gridImages[1].alternativeText || 'Farmer with tomatoes'}
                  fill
                  className="object-cover"
                />
              </div>
              {/* Bottom-Right Image */}
              <div className="relative col-span-1 row-span-1 rounded-lg overflow-hidden shadow-md">
                 <Image
                  src={getStrapiMedia(gridImages[2].url)}
                  alt={gridImages[2].alternativeText || 'Interior of a modern greenhouse'}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          ) : (
            // Fallback if there are not enough images
            <div className="bg-gray-200 aspect-square rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Images are loading...</p>
            </div>
          )}
ƒ&
          {/* --- Text Content Column --- */}
          <div className="space-y-5">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-800">
              Who We <span className="text-primary">Are?</span>
            </h1>
            <p className="font-semibold text-gray-500 uppercase tracking-wider text-sm">
              WE&apos;RE HERE TO SERVE ONLY THE BEST PRODUCTS FOR YOU. ENRICHING YOUR HOMES WITH THE BEST ESSENTIALS.
            </p>
            {/* The first paragraph uses the description from your CMS */}
            <p className="text-gray-600 leading-relaxed">
              {intro_body}
            </p>
            {/* NOTE: These paragraphs are static. For dynamic content, consider using a Rich Text field in your CMS. */}
            <p className="text-gray-600 leading-relaxed">
              Lorem Ipsum has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
            </p>
          </div>
        </div>
      </section>

      {/* --- Other Sections (Unchanged) --- */}
      <div className="space-y-16 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Services Section */}
        <section className="text-center space-y-8">
          <div>
            <h3 className="text-3xl font-semibold">What We Offer</h3>
            <p className="text-gray-600 mt-2">Enriching your life with the best from Ghana.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, i) => (
              <div key={i} className="p-6 border rounded-lg shadow-sm bg-white hover:shadow-md transition">
                <div className="mb-4 text-primary text-4xl">{service.icon}</div>
                <h4 className="text-lg font-semibold mb-2">{service.title}</h4>
                <p className="text-sm text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonial */}
        <section className="bg-gray-50 py-10 px-4 rounded-lg shadow text-center space-y-4 max-w-4xl mx-auto">
          <div className="w-20 h-20 mx-auto relative rounded-full overflow-hidden border-2 border-primary">
            <Image
              src={testimonial_image.url.startsWith('/') ? testimonial_image.url : `${process.env.NEXT_PUBLIC_STRAPI_URL}${testimonial_image.url}`}
              alt={testimonial_name}
              fill
              className="object-cover"
            />
          </div>
          <blockquote className="italic text-lg sm:text-xl text-gray-700 max-w-xl mx-auto">
            “{testimonial_quote}”
          </blockquote>
          <div className="font-bold text-lg">{testimonial_name}</div>
          <div className="text-sm text-gray-500">{testimonial_role}</div>
        </section>

        {/* Statistics */}
        <section className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {statistics.map((stat, i) => (
            <div key={i} className="space-y-2">
              <div className="text-3xl font-bold text-primary">{stat.value}</div>
              <div className="text-gray-800 uppercase text-sm font-medium">{stat.label}</div>
              <p className="text-xs text-gray-500">{stat.note}</p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}