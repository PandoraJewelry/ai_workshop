export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-luxury text-white mt-16 py-8">
      <div className="container mx-auto px-4 text-center">
        <p className="text-gold font-bold text-xl mb-2">STEEP HOUSE</p>
        <p className="text-gray-400">Premium Tea Collection &copy; {currentYear}</p>
      </div>
    </footer>
  );
}
