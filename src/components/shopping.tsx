import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import ShoppingList from "./shopping/ShoppingList";

export const shoppingPlaces = [
  {
    id: "azur-city",
    title: "Azur City",
    description:
      "Modern shopping mall with international brands and entertainment facilities.",
    image: "src/images/azur.jpg",
    images: [
      "src/images/azur1.jpg",
      "src/images/azur2.jpg",
      "src/images/azur3.jpg",
      "src/images/azur4.jpg",
    ],
    rating: 4.7,
    location: "Route de la Marsa, La Marsa",
    openHours: "10:00 AM - 10:00 PM",
    coordinates: { lat: 36.8892, lng: 10.3229 },
  },
  {
    id: "tunisia-mall",
    title: "Tunisia Mall",
    description:
      "Upscale shopping center featuring luxury brands and fine dining.",
    image: "src/images/mall.jpg",
    images: [
      "hsrc/images/mall1.jpg",
      "src/images/mall2.jpg",
      "src/images/mall3.jpg",
      "src/images/mall4.jpg",
    ],
    rating: 4.6,
    location: "Les Berges du Lac 2, Tunis",
    openHours: "10:00 AM - 10:00 PM",
    coordinates: { lat: 36.8432, lng: 10.2731 },
  },
  {
    id: "souk-el-attarine",
    title: "Souk El Attarine",
    description:
      "Traditional perfume and spice market in the heart of the Medina.",
    image: "src/images/attarine.jpg",
    images: [
      "src/images/attarine1.jpg",
      "src/images/attarine2.jpg",
      "src/images/attarine3.jpg",
      "src/images/attarine4.jpg",
    ],
    rating: 4.8,
    location: "Medina of Tunis",
    openHours: "9:00 AM - 6:00 PM",
    coordinates: { lat: 36.7992, lng: 10.1706 },
  },
  {
    id: "souk-des-chechias",
    title: "Souk des Chéchias",
    description: "Historic market specializing in traditional Tunisian hats.",
    image:
      "src/images/chach.jpg",
    images: [
      "src/images/chach1.jpg",
      "src/images/cach2.jpg",
      "src/images/chach3.jpg",
      "src/images/chach4.jpg",
    ],
    rating: 4.5,
    location: "Medina of Tunis",
    openHours: "8:30 AM - 5:30 PM",
    coordinates: { lat: 36.7992, lng: 10.1706 },
  },
  {
    id: "souk-de-la-laine",
    title: "Souk de la Laine",
    description:
      "Traditional wool market with handcrafted textiles and carpets.",
    image: "src/images/laine.jpg",
    images: [
      "src/images/laine1.jpg",
      "src/images/laine2.jpg",
      "src/images/laine3.jpg",
      "src/images/laine4.jpg",
    ],
    rating: 4.6,
    location: "Medina of Tunis",
    openHours: "9:00 AM - 6:00 PM",
    coordinates: { lat: 36.7992, lng: 10.1706 },
  },
  {
    id: "souk-el-berka",
    title: "Souk El Berka",
    description:
      "Historic gold and jewelry market with traditional craftsmanship.",
    image: "src/images/berka.jpg",
    images: [
      "src/images/berka1.jpg",
      "src/images/berka2.jpg",
      "src/images/berka3.jpg",
      "src/images/berka4.jpg",
    ],
    rating: 4.7,
    location: "Medina of Tunis",
    openHours: "9:30 AM - 5:30 PM",
    coordinates: { lat: 36.7992, lng: 10.1706 },
  },
];

const Shopping = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPlaces, setFilteredPlaces] = useState(shoppingPlaces);

  useEffect(() => {
    if (searchQuery) {
      const filtered = shoppingPlaces.filter(
        (place) =>
          place.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          place.description.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredPlaces(filtered);
    } else {
      setFilteredPlaces(shoppingPlaces);
    }
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm">
        <div className="px-6 pt-14 pb-4 space-y-6">
          <h1 className="text-4xl font-bold">Shopping</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search shopping places"
              className="w-full h-12 pl-10 bg-[#F5F5F5] border-none rounded-xl text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="px-6">
        <h2 className="text-2xl font-bold mb-4">
          {searchQuery ? "Search Results" : "Shopping Places"}
        </h2>
        <ShoppingList places={filteredPlaces} />
      </div>
    </div>
  );
};

export default Shopping;
