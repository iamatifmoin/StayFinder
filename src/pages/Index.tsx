import { useState } from "react";
import {
  Search,
  MapPin,
  Calendar,
  Users,
  ArrowRight,
  Star,
  Sparkles,
  Instagram,
  Twitter,
  Facebook,
  Mail,
  Phone,
  CalendarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import PropertyCard from "@/components/PropertyCard";
import Navbar from "@/components/Navbar";

// Mock data for testing with Indian locations
const mockProperties = [
  {
    id: "1",
    title: "Modern Downtown Apartment in Mumbai",
    location: "Mumbai, Maharashtra",
    price: 8500,
    rating: 4.8,
    reviews: 124,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
    ],
    type: "Apartment",
    guests: 4,
    bedrooms: 2,
    bathrooms: 1,
  },
  {
    id: "2",
    title: "Cozy Beach House in Goa",
    location: "Panaji, Goa",
    price: 12000,
    rating: 4.9,
    reviews: 89,
    images: [
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&h=600&fit=crop",
    ],
    type: "House",
    guests: 6,
    bedrooms: 3,
    bathrooms: 2,
  },
  {
    id: "3",
    title: "Luxury Mountain Cabin in Shimla",
    location: "Shimla, Himachal Pradesh",
    price: 15000,
    rating: 5.0,
    reviews: 67,
    images: [
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop",
    ],
    type: "Cabin",
    guests: 8,
    bedrooms: 4,
    bathrooms: 3,
  },
  {
    id: "4",
    title: "Urban Loft Studio in Bangalore",
    location: "Bangalore, Karnataka",
    price: 7500,
    rating: 4.7,
    reviews: 156,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
    ],
    type: "Loft",
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
  },
];

const Index = () => {
  const [searchLocation, setSearchLocation] = useState("");
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState("1");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background with gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 opacity-90"></div>
        <div className="absolute inset-0 bg-black/30"></div>

        {/* Floating elements for visual appeal */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-purple-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-indigo-500/10 rounded-full blur-lg animate-pulse delay-500"></div>

        <div className="relative text-white py-24 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
                <Sparkles className="h-4 w-4 text-yellow-300" />
                <span className="text-sm font-medium">
                  Discover Amazing Places
                </span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Your Trip.
                <span className="block text-gradient bg-gradient-to-r from-pink-300 to-yellow-300 bg-clip-text text-transparent">
                  Our Stay.
                </span>
              </h1>
              <p className="text-xl lg:text-2xl opacity-90 max-w-3xl mx-auto leading-relaxed">
                Discover unique homes and unforgettable experiences across
                India.
              </p>
            </div>

            {/* Enhanced Search Bar */}
            <Card className="max-w-5xl mx-auto shadow-2xl border-0 bg-gray-800/95 backdrop-blur-sm hover:shadow-3xl transition-all duration-500 hover:scale-[1.02]">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="space-y-2 group">
                    <label className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-blue-400" />
                      Where to?
                    </label>
                    <div className="relative">
                      <Input
                        placeholder="Search destinations"
                        value={searchLocation}
                        onChange={(e) => setSearchLocation(e.target.value)}
                        className="h-12 border-2 border-gray-600 bg-gray-700 text-white focus:border-blue-500 transition-all duration-300 hover:border-gray-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 group">
                    <label className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-green-400" />
                      Check in
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "h-12 w-full justify-start text-left font-normal border-2 border-gray-600 bg-gray-700 text-white hover:border-green-500 hover:bg-gray-600 transition-all duration-300",
                            !checkIn && "text-gray-400"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {checkIn
                            ? format(checkIn, "dd MMM yyyy")
                            : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-600">
                        <CalendarComponent
                          mode="single"
                          selected={checkIn}
                          onSelect={setCheckIn}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className={cn(
                            "p-3 pointer-events-auto bg-gray-800 text-white"
                          )}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2 group">
                    <label className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-orange-400" />
                      Check out
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "h-12 w-full justify-start text-left font-normal border-2 border-gray-600 bg-gray-700 text-white hover:border-orange-500 hover:bg-gray-600 transition-all duration-300",
                            !checkOut && "text-gray-400"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {checkOut
                            ? format(checkOut, "dd MMM yyyy")
                            : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-600">
                        <CalendarComponent
                          mode="single"
                          selected={checkOut}
                          onSelect={setCheckOut}
                          disabled={(date) =>
                            date < new Date() || (checkIn && date <= checkIn)
                          }
                          initialFocus
                          className={cn(
                            "p-3 pointer-events-auto bg-gray-800 text-white"
                          )}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2 group">
                    <label className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                      <Users className="h-4 w-4 text-purple-400" />
                      Guests
                    </label>
                    <Input
                      type="number"
                      min="1"
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className="h-12 border-2 border-gray-600 bg-gray-700 text-white focus:border-purple-500 transition-all duration-300 hover:border-gray-500"
                    />
                  </div>
                </div>

                <Button className="w-full mt-8 h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
                  <Search className="mr-3 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                  Search Amazing Places
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Featured Properties Section */}
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-900/50 rounded-full px-4 py-2 mb-4 border border-blue-700/30">
            <Star className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-300">
              Featured Properties
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Handpicked properties
            <span className="block">just for you</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover our most popular and highly-rated properties across India
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {mockProperties.map((property, index) => (
            <div
              key={property.id}
              className="animate-fade-in hover:scale-[1.02] transition-transform duration-300"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <PropertyCard property={property} />
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button
            variant="outline"
            size="lg"
            className="h-12 px-8 border-2 border-gray-600 bg-gray-800 text-white hover:border-blue-500 hover:bg-blue-900/30 transition-all duration-300 hover:scale-105 group"
          >
            View All Properties
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-20 lg:py-28 border-t border-gray-700">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
              <Sparkles className="h-4 w-4 text-yellow-300" />
              <span className="text-sm font-medium">Join Our Community</span>
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold mb-6">
              Ready to become
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                a host?
              </span>
            </h2>
            <p className="text-xl lg:text-2xl opacity-90 mb-10 max-w-3xl mx-auto">
              Share your space and earn extra income while meeting travelers
              from around the world
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="h-14 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
              >
                Start Hosting Today
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-14 px-8 border-2 border-white/30 text-white hover:bg-white hover:text-gray-900 transition-all duration-300 hover:scale-105"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-white py-16 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Brand Section */}
            <div className="md:col-span-2">
              <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                StayFinder
              </h3>
              <p className="text-gray-400 text-lg mb-6 max-w-md">
                Find your perfect stay anywhere in India. Discover unique homes
                and unforgettable experiences.
              </p>
              <div className="flex space-x-4">
                <div className="p-2 bg-gray-800 rounded-full hover:bg-blue-600 transition-colors duration-300 cursor-pointer">
                  <Facebook className="h-5 w-5" />
                </div>
                <div className="p-2 bg-gray-800 rounded-full hover:bg-pink-600 transition-colors duration-300 cursor-pointer">
                  <Instagram className="h-5 w-5" />
                </div>
                <div className="p-2 bg-gray-800 rounded-full hover:bg-blue-400 transition-colors duration-300 cursor-pointer">
                  <Twitter className="h-5 w-5" />
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">
                Quick Links
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Contact</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-400">hello@stayfinder.in</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-400">+91 98765 43210</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 StayFinder India. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
