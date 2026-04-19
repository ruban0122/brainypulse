import Footer from './Footer';

export default function DesktopOnlyFooter() {
  return (
    <div className="hidden md:block">
      <Footer />
    </div>
  );
}
