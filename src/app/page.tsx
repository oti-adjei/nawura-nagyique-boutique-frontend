import {
  getHomepageContent,
  getCategories,
  getNewArrivals,
  getDeals,
  getFeatures,
} from "@/lib/api";
import HeroSection from '../components/home/HeroSection';
import Categories from '../components/home/Categories';
import NewArrivals from '../components/home/NewArrivals';
import LegacySection from '../components/home/LegacySection';
import DayOfTheDeal from '../components/home/DayOfTheDeal';
import PromoBanner from '../components/home/PromoBanner';
import Collections from '../components/home/Collections';
import Features from '../components/home/Features';
export default async function Home() {
  const [
    homepageData,
    categories,
    newArrivals,
    deals,
    features,
  ] = await Promise.all([
    getHomepageContent(),
    getCategories(),
    getNewArrivals(),
    getDeals(),
    getFeatures(),
  ]);

  const data = homepageData?.data;

  console.log('Homepage data fetched in Home:', data);
  console.log('Hero data fetched in Hero:', data.Hero);
  // console.log('Categories fetched:', categories);
  // console.log('New Arrivals fetched:', newArrivals);
  // console.log('Deals fetched:', deals);
  // console.log('Features fetched:', features);

  if (!data) {
    return <div>Error loading basic homepage data.</div>;
  }

  const {
    Hero: hero,
    Overview: overview,
    PromotionalBanner: promo,
    Collections: collections,
  } = data;



  return (
    <main className="w-full overflow-x-hidden bg-white dark:bg-gray-200 ">
      {hero && <HeroSection hero={hero} />}
      {categories && <Categories categories={categories} />}
      {newArrivals && <NewArrivals newArrivals={newArrivals} />}
      {overview && <LegacySection legacyContent={overview} />}
      {deals && <DayOfTheDeal deals={deals} />}
      {promo && <PromoBanner promoBanner={promo} />}
      {collections && <Collections collections={collections} />}
      {features && <Features features={features} />}

    </main>
  );
}

// Optional: If you need to control caching and revalidation, you can use the `revalidate` export
// export const revalidate = 3600; // Revalidate every hour (in seconds)

// Optional: If you need to configure dynamic routes or other data fetching strategies,
// you might explore `generateStaticParams` or `getServerSideProps` (though the latter is less common in the App Router for initial page load data).



/**return (
  <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
    <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
      <Image
        className="dark:invert"
        src="/next.svg"
        alt="Next.js logo"
        width={180}
        height={38}
        priority
      />
      <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
        <li className="mb-2 tracking-[-.01em]">
          Get started by editing{" "}
          <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
            src/app/page.tsx
          </code>
          .
        </li>
        <li className="tracking-[-.01em]">
          Save and see your changes instantly.
        </li>
      </ol>

      <div className="flex gap-4 items-center flex-col sm:flex-row">
        <a
          className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            className="dark:invert"
            src="/vercel.svg"
            alt="Vercel logomark"
            width={20}
            height={20}
          />
          Deploy now
        </a>
        <a
          className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Read our docs
        </a>
      </div>
    </main>
    <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
      <a
        className="flex items-center gap-2 hover:underline hover:underline-offset-4"
        href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          aria-hidden
          src="/file.svg"
          alt="File icon"
          width={16}
          height={16}
        />
        Learn
      </a>
      <a
        className="flex items-center gap-2 hover:underline hover:underline-offset-4"
        href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          aria-hidden
          src="/window.svg"
          alt="Window icon"
          width={16}
          height={16}
        />
        Examples
      </a>
      <a
        className="flex items-center gap-2 hover:underline hover:underline-offset-4"
        href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          aria-hidden
          src="/globe.svg"
          alt="Globe icon"
          width={16}
          height={16}
        />
        Go to nextjs.org →
      </a>
    </footer>
  </div>
);**/
