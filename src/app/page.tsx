import {
  getHomepageContent,
  getCategories,
  getNewArrivals,
  getDeals,
  getFeatures,
  getCollections,
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
    collections
  ] = await Promise.all([
    getHomepageContent(),
    getCategories(),
    getNewArrivals(),
    getDeals(),
    getFeatures(),
    getCollections()
  ]);

  const data = homepageData?.data;

  console.log('Homepage data fetched in Home:', data);
  console.log('Hero data fetched in Hero:', data.Hero);
  // console.log('Categories fetched:', categories);
  // console.log('New Arrivals fetched:', newArrivals);
  // console.log('Deals fetched:', deals);
  // console.log('Features fetched:', features);
  // console.log('Features fetched:', features);

  if (!data) {
    return <div>Error loading basic homepage data.</div>;
  }

  const {
    Hero: hero,
    Overview: overview,
    PromotionalBanner: promo,
    // Collections: collections,
  } = data;



  return (
    <main className="w-full overflow-x-hidden bg-white text-black">
      {hero && <HeroSection hero={hero} />}
      <div className="px-5 lg:px-[130px]">
      {categories && <Categories categories={categories} />}
      {newArrivals && <NewArrivals currentArrivals={newArrivals} />}
      {overview && <LegacySection legacyContent={overview} />}
      {deals && <DayOfTheDeal deals={deals} />}
      {promo && <PromoBanner promoBanner={promo} />}
      {collections && <Collections collections={collections} />}
      {features && <Features features={features} />}
      </div>
    </main>
  );
}