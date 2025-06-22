import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@clerk/clerk-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import { useBookings } from "@/hooks/useBookings";
import { useProfile } from "@/hooks/useProfile";
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  ChevronLeft, 
  ChevronRight, 
  Shield, 
  Wifi, 
  Car, 
  Tv, 
  Wind, 
  Utensils, 
  Coffee,
  Calendar as CalendarIcon
} from "lucide-react";
import Map from "@/components/Map";

// Mock property data with Indian details
const mockProperty = {
  id: "1",
  title: "Modern Downtown Apartment in Mumbai",
  location: "Mumbai, Maharashtra",
  price: 8500,
  rating: 4.8,
  reviews: 124,
  images: [
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop"
  ],
  type: "Apartment",
  guests: 4,
  bedrooms: 2,
  bathrooms: 1,
  description: "Beautiful modern apartment in the heart of Mumbai. Perfect for business travelers and tourists alike. Walking distance to major attractions, restaurants, and public transportation. Experience the vibrant culture of India's financial capital.",
  amenities: ["Free WiFi", "Parking", "TV", "Kitchen", "Washer & Dryer", "Air Conditioning"],
  host: {
    name: "Priya Sharma",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b830?w=150&h=150&fit=crop&crop=face",
    joinedDate: "2019",
    reviews: 456
  }
};

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isSignedIn } = useAuth();
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState("1");
  const [selectedImage, setSelectedImage] = useState(0);

  const { createBooking, isCreating } = useBookings();
  const { profile, createOrUpdateProfile } = useProfile();

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % mockProperty.images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + mockProperty.images.length) % mockProperty.images.length);
  };

  const calculateTotalPrice = () => {
    if (!checkIn || !checkOut) return 0;
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    const basePrice = mockProperty.price * nights;
    const cleaningFee = 2000;
    const serviceFee = 3000;
    const taxes = 1500;
    return basePrice + cleaningFee + serviceFee + taxes;
  };

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  };

  const handleReserve = async () => {
    if (!isSignedIn) {
      toast({
        title: "Sign in required",
        description: "Please sign in to make a reservation.",
        variant: "destructive",
      });
      return;
    }

    if (!checkIn || !checkOut) {
      toast({
        title: "Missing dates",
        description: "Please select check-in and check-out dates.",
        variant: "destructive",
      });
      return;
    }

    if (checkOut <= checkIn) {
      toast({
        title: "Invalid dates",
        description: "Check-out date must be after check-in date.",
        variant: "destructive",
      });
      return;
    }

    // Ensure profile exists
    if (!profile) {
      createOrUpdateProfile();
    }

    const bookingData = {
      listing_id: id!,
      check_in: checkIn.toISOString().split('T')[0],
      check_out: checkOut.toISOString().split('T')[0],
      guests: parseInt(guests),
      total_price: calculateTotalPrice(),
    };

    createBooking(bookingData);

    // Navigate to success page after a short delay
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  const nights = calculateNights();

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 text-gray-300 hover:text-white hover:bg-gray-800 transition-all duration-300"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to listings
        </Button>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">{mockProperty.title}</h1>
          <div className="flex items-center space-x-4 text-gray-400">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-white">{mockProperty.rating}</span>
              <span>({mockProperty.reviews} reviews)</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
              <span>{mockProperty.location}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Images and Details */}
          <div className="lg:col-span-2">
            {/* Enhanced Image Gallery with Carousel */}
            <div className="mb-8">
              <div className="relative mb-4 group">
                <img
                  src={mockProperty.images[selectedImage]}
                  alt={mockProperty.title}
                  className="w-full h-96 object-cover rounded-lg"
                />
                
                {/* Carousel Navigation */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/70"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/70"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>

                {/* Image Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {mockProperty.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        selectedImage === index ? "bg-white" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                {mockProperty.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${mockProperty.title} ${index + 1}`}
                    className={`h-24 object-cover rounded cursor-pointer transition-all duration-300 ${
                      selectedImage === index ? "ring-2 ring-blue-500 opacity-100" : "opacity-70 hover:opacity-100"
                    }`}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            </div>

            {/* Enhanced Property Info */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-white">Entire {mockProperty.type}</h2>
                <div className="text-sm text-gray-400">
                  {mockProperty.guests} guests • {mockProperty.bedrooms} bedrooms • {mockProperty.bathrooms} bathrooms
                </div>
              </div>
              
              <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-gray-700">
                <img
                  src={mockProperty.host.avatar}
                  alt={mockProperty.host.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="font-medium text-white">Hosted by {mockProperty.host.name}</div>
                  <div className="text-sm text-gray-400">
                    Joined in {mockProperty.host.joinedDate} • {mockProperty.host.reviews} reviews
                  </div>
                </div>
              </div>

              {/* Property Highlights */}
              <div className="mb-6 pb-6 border-b border-gray-700">
                <h3 className="text-lg font-semibold mb-4 text-white">Property highlights</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-green-400" />
                    <div>
                      <div className="font-medium text-white">Enhanced Clean</div>
                      <div className="text-sm text-gray-400">Deep cleaning between stays</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-blue-400" />
                    <div>
                      <div className="font-medium text-white">Prime Location</div>
                      <div className="text-sm text-gray-400">Walking distance to major attractions</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Wifi className="h-5 w-5 text-purple-400" />
                    <div>
                      <div className="font-medium text-white">High-speed WiFi</div>
                      <div className="text-sm text-gray-400">Perfect for remote work</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6 pb-6 border-b border-gray-700">
                <h3 className="text-lg font-semibold mb-3 text-white">About this place</h3>
                <p className="text-gray-300 leading-relaxed">{mockProperty.description}</p>
              </div>

              <div className="mb-6 pb-6 border-b border-gray-700">
                <h3 className="text-lg font-semibold mb-4 text-white">What this place offers</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Wifi className="h-5 w-5 text-blue-400" />
                    <span className="text-gray-300">Free WiFi</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Car className="h-5 w-5 text-green-400" />
                    <span className="text-gray-300">Free Parking</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Tv className="h-5 w-5 text-purple-400" />
                    <span className="text-gray-300">Smart TV</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Wind className="h-5 w-5 text-cyan-400" />
                    <span className="text-gray-300">Air Conditioning</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Utensils className="h-5 w-5 text-orange-400" />
                    <span className="text-gray-300">Full Kitchen</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Coffee className="h-5 w-5 text-yellow-400" />
                    <span className="text-gray-300">Coffee Machine</span>
                  </div>
                </div>
              </div>

              {/* Location Section with Map */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 text-white">Where you'll be</h3>
                <Map location={mockProperty.location} title={mockProperty.title} />
                <p className="text-gray-300 mt-4">
                  Located in the heart of {mockProperty.location}, this property offers easy access to local attractions, restaurants, and public transportation.
                </p>
              </div>
            </div>
          </div>

          {/* Enhanced Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8 bg-gray-800 border-gray-700 shadow-xl">
              <CardContent className="p-6">
                <div className="mb-6">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold text-white">₹{mockProperty.price.toLocaleString()}</span>
                    <span className="text-gray-400">night</span>
                  </div>
                  <div className="flex items-center space-x-1 mt-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium text-white">{mockProperty.rating}</span>
                    <span className="text-sm text-gray-400">({mockProperty.reviews} reviews)</span>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">Check in</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal bg-gray-700 border-gray-600 text-white hover:bg-gray-600",
                              !checkIn && "text-gray-400"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {checkIn ? format(checkIn, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700" align="start">
                          <Calendar
                            mode="single"
                            selected={checkIn}
                            onSelect={setCheckIn}
                            initialFocus
                            className="bg-gray-800 text-white border-0"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">Check out</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal bg-gray-700 border-gray-600 text-white hover:bg-gray-600",
                              !checkOut && "text-gray-400"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {checkOut ? format(checkOut, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700" align="start">
                          <Calendar
                            mode="single"
                            selected={checkOut}
                            onSelect={setCheckOut}
                            initialFocus
                            className="bg-gray-800 text-white border-0"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Guests</label>
                    <Input
                      type="number"
                      min="1"
                      max={mockProperty.guests}
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleReserve}
                  disabled={isCreating || !checkIn || !checkOut}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 mb-4 font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                >
                  {isCreating ? "Creating Reservation..." : "Reserve Now"}
                </Button>

                <div className="text-center text-sm text-gray-400 mb-6">
                  You won't be charged yet
                </div>

                {nights > 0 && (
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-gray-300">
                      <span>₹{mockProperty.price.toLocaleString()} x {nights} nights</span>
                      <span>₹{(mockProperty.price * nights).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Cleaning fee</span>
                      <span>₹2,000</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Service fee</span>
                      <span>₹3,000</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Taxes</span>
                      <span>₹1,500</span>
                    </div>
                    <hr className="border-gray-700" />
                    <div className="flex justify-between font-semibold text-lg text-white">
                      <span>Total</span>
                      <span>₹{calculateTotalPrice().toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
