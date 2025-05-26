// app/about/page.tsx
import { fetchAboutPage } from '@/lib/api';
import Image from 'next/image';

export default async function AboutPage() {
  const data = await fetchAboutPage();

  const {
    title,
    intro_heading,
    intro_body,
    services_heading,
    services_subheading,
    services,
    testimonial_name,
    testimonial_role,
    testimonial_quote,
    testimonial_image,
    statistics,
    images,
  } = data;

  return (
    <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Intro Section */}
      <section className="text-center space-y-6">
        <h2 className="text-4xl sm:text-5xl font-bold">{intro_heading}</h2>
        <p className="text-base sm:text-lg max-w-3xl mx-auto text-gray-700">{intro_body}</p>
      </section>

      {/* Image Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {images.map((img: any, idx: number) => (
          <div key={idx} className="relative w-full aspect-[4/3] rounded-lg overflow-hidden shadow-md">
            <Image
              src={img.url.startsWith('/') ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${img.url}` : img.url}
              alt={`About Image ${idx + 1}`}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </section>

      {/* Services Section */}
      <section className="text-center space-y-8">
        <div>
          <h3 className="text-3xl font-semibold">{services_heading}</h3>
          <p className="text-gray-600 mt-2">{services_subheading}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service: any, i: number) => (
            <div key={i} className="p-6 border rounded-lg shadow-sm bg-white hover:shadow-md transition">
              <div className="mb-4 text-green-600 text-4xl">{service.icon}</div>
              <h4 className="text-lg font-semibold mb-2">{service.title}</h4>
              <p className="text-sm text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonial */}
      <section className="bg-gray-50 py-10 px-4 rounded-lg shadow text-center space-y-4 max-w-4xl mx-auto">
        <div className="w-20 h-20 mx-auto relative rounded-full overflow-hidden border-2 border-green-500">
          <Image
            src={
              testimonial_image.url.startsWith('/')
                ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${testimonial_image.url}`
                : testimonial_image.url
            }
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
        {statistics.map((stat: any, i: number) => (
          <div key={i} className="space-y-2">
            <div className="text-3xl font-bold text-green-600">{stat.value}</div>
            <div className="text-gray-800 uppercase text-sm font-medium">{stat.label}</div>
            <p className="text-xs text-gray-500">{stat.note}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
