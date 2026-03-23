const STORE = {
  name: "Soni Jewellers",
  address: "Dilshad Garden, Delhi",
  phone: "+91 9213530316",
  hours: "Mon–Sun: 10:00 AM – 8:00 PM",
  mapSrc: "https://maps.google.com/maps?q=Dilshad+Garden%2C+Delhi&output=embed",
  directionsHref: "https://www.google.com/maps/dir/?api=1&destination=Dilshad+Garden,+Delhi",
};

export default function StoresPage() {
  return (
    <div className="py-5 pb-10">
      <h1 className="text-2xl font-bold text-navy mb-1">Our Store</h1>
      <p className="text-gray-500 text-sm mb-6">Visit us to experience our collection in person</p>

      {/* Google Maps embed */}
      <div className="rounded-xl overflow-hidden mb-6 border border-gray-200 h-64">
        <iframe
          src={STORE.mapSrc}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Store location map"
        />
      </div>

      {/* Single store card */}
      <div className="bg-white rounded-xl p-5 border border-gray-200 max-w-sm">
        <h3 className="font-semibold text-navy mb-3">{STORE.name}</h3>
        <div className="text-sm text-gray-500 mb-2 flex gap-2">📍 {STORE.address}</div>
        <div className="text-sm text-gray-500 mb-2 flex gap-2">📞 {STORE.phone}</div>
        <div className="text-sm text-gray-500 mb-4 flex gap-2">🕐 {STORE.hours}</div>
        <div className="flex gap-2">
          <a
            href={STORE.directionsHref}
            target="_blank"
            className="flex-1 text-center bg-gradient-to-r from-gold to-gold-dark text-navy text-sm font-semibold py-2 rounded-lg"
          >
            Get Directions
          </a>
          <a href={`tel:${STORE.phone}`} className="px-4 py-2 border border-gold text-gold-dark rounded-lg text-sm font-semibold">
            Call
          </a>
        </div>
      </div>
    </div>
  );
}
