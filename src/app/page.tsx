import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Hero from '@/components/sections/hero';
import About from '@/components/sections/about';
import Tickets from '@/components/sections/tickets';
import Speakers from '@/components/sections/speakers';
import Schedule from '@/components/sections/schedule';
import Venue from '@/components/sections/venue';
import Sponsors from '@/components/sections/sponsors';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-body">
      <main className="flex-1">
        <Hero />
        <About />
        <Tickets />
        <Speakers />
        <Schedule />
        <Sponsors />
        <Venue />
      </main>
      <Footer />
    </div>
  );
}
