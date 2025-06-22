
import { useState } from "react";
import { Search, Filter, MapPin, Users, Bed, Bath, Star, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PropertyCard from "@/components/PropertyCard";
import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";
import { useListings } from "@/hooks/useListings";

const Properties = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState("all");
  const [propertyType, setPropertyType] = useState("all");
  const [guestCount, setGuestCount] = useState("all");

  const { listings, isLoading } = useListings();

  // Filter listings based on search criteria
  const filteredListings = listings?.filter(listing => {
    const matchesSearch = !searchQuery || 
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.state.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPrice = priceRange === "all" || 
      (priceRange === "low" && listing.price_per_night < 10000) ||
      (priceRange === "medium" && listing.price_per_night >= 10000 && listing.price_per_night < 20000) ||
      (priceRange === "high" && listing.price_per_night >= 20000);
    
    const matchesType = propertyType === "all" || 
      listing.type.toLowerCase() === propertyType.toLowerCase();
    
    const matchesGuests = guestCount === "all" || 
      listing.guests >= parseInt(guestCount);

    return matchesSearch && matchesPrice && matchesType && matchesGuests;
  }) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors duration-300 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            All Properties
          </h1>
          <p className="text-xl text-gray-300">
            Discover amazing places to stay across India
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 bg-gray-800/95 backdrop-blur-sm border-gray-700">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by location or property name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 border-gray-600 bg-gray-700 text-white focus:border-blue-500"
                  />
                </div>
              </div>
              
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="h-12 border-gray-600 bg-gray-700 text-white">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="low">Under ₹10,000</SelectItem>
                  <SelectItem value="medium">₹10,000 - ₹20,000</SelectItem>
                  <SelectItem value="high">Above ₹20,000</SelectItem>
                </SelectContent>
              </Select>

              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger className="h-12 border-gray-600 bg-gray-700 text-white">
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="cabin">Cabin</SelectItem>
                  <SelectItem value="loft">Loft</SelectItem>
                </SelectContent>
              </Select>

              <Select value={guestCount} onValueChange={setGuestCount}>
                <SelectTrigger className="h-12 border-gray-600 bg-gray-700 text-white">
                  <SelectValue placeholder="Guests" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="all">Any Number</SelectItem>
                  <SelectItem value="1">1+ Guests</SelectItem>
                  <SelectItem value="2">2+ Guests</SelectItem>
                  <SelectItem value="4">4+ Guests</SelectItem>
                  <SelectItem value="6">6+ Guests</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-lg h-80 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-300">
                {filteredListings.length} propert{filteredListings.length === 1 ? 'y' : 'ies'} found
              </p>
            </div>

            {filteredListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredListings.map((listing, index) => (
                  <div 
                    key={listing.id} 
                    className="animate-fade-in hover:scale-[1.02] transition-transform duration-300"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <PropertyCard 
                      property={{
                        id: listing.id,
                        title: listing.title,
                        location: `${listing.city}, ${listing.state}`,
                        price: listing.price_per_night,
                        rating: 4.5, // Default rating since we don't have reviews yet
                        reviews: 0,
                        images: listing.images,
                        type: listing.type,
                        guests: listing.guests,
                        bedrooms: listing.bedrooms,
                        bathrooms: listing.bathrooms
                      }} 
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-12 w-12 text-gray-600" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No properties found</h3>
                <p className="text-gray-400 mb-6">Try adjusting your search criteria</p>
                <Button 
                  onClick={() => {
                    setSearchQuery("");
                    setPriceRange("all");
                    setPropertyType("all");
                    setGuestCount("all");
                  }}
                  variant="outline" 
                  className="border-gray-600 text-white hover:bg-gray-800"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Properties;
