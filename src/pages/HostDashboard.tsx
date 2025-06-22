
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Home, Calendar, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useListings } from "@/hooks/useListings";
import { useBookings } from "@/hooks/useBookings";
import { useProfile } from "@/hooks/useProfile";

const HostDashboard = () => {
  const [showAddListing, setShowAddListing] = useState(false);
  const [newListing, setNewListing] = useState({
    title: "",
    description: "",
    type: "apartment",
    price_per_night: "",
    guests: "",
    bedrooms: "",
    bathrooms: "",
    address: "",
    city: "",
    state: "",
    country: "India",
    postal_code: "",
    amenities: [] as string[],
    images: [] as string[]
  });

  const { listings, isLoading: listingsLoading, createListing, isCreating } = useListings();
  const { bookings, isLoading: bookingsLoading } = useBookings();
  const { profile, createOrUpdateProfile } = useProfile();

  // Filter listings by current user (host)
  const myListings = listings?.filter(listing => listing.host_id === profile?.id) || [];
  
  // Filter bookings for current user's listings
  const myBookings = bookings?.filter(booking => 
    myListings.some(listing => listing.id === booking.listing_id)
  ) || [];

  const totalRevenue = myBookings.reduce((acc, booking) => 
    booking.status === 'confirmed' || booking.status === 'completed' 
      ? acc + booking.total_price 
      : acc, 0
  );

  const handleAddListing = () => {
    if (!profile) {
      createOrUpdateProfile();
      return;
    }

    const listingData = {
      ...newListing,
      price_per_night: parseInt(newListing.price_per_night),
      guests: parseInt(newListing.guests),
      bedrooms: parseInt(newListing.bedrooms),
      bathrooms: parseInt(newListing.bathrooms),
      amenities: ['WiFi', 'Kitchen', 'Parking'], // Default amenities
      images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop'] // Default image
    };

    createListing(listingData);
    setShowAddListing(false);
    setNewListing({
      title: "",
      description: "",
      type: "apartment",
      price_per_night: "",
      guests: "",
      bedrooms: "",
      bathrooms: "",
      address: "",
      city: "",
      state: "",
      country: "India",
      postal_code: "",
      amenities: [],
      images: []
    });
  };

  if (listingsLoading || bookingsLoading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-white">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Host Dashboard</h1>
          <Button 
            onClick={() => setShowAddListing(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Listing
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300">Total Listings</p>
                  <p className="text-3xl font-bold text-white">{myListings.length}</p>
                </div>
                <Home className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300">Total Bookings</p>
                  <p className="text-3xl font-bold text-white">{myBookings.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300">Total Revenue</p>
                  <p className="text-3xl font-bold text-white">₹{totalRevenue.toLocaleString()}</p>
                </div>
                <Users className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300">Avg. Rating</p>
                  <p className="text-3xl font-bold text-white">4.8</p>
                </div>
                <div className="text-yellow-400 text-2xl">⭐</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Listing Form */}
        {showAddListing && (
          <Card className="mb-8 bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Add New Listing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-200">Title</label>
                    <Input
                      value={newListing.title}
                      onChange={(e) => setNewListing({...newListing, title: e.target.value})}
                      placeholder="Property title"
                      className="bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-200">Type</label>
                    <Select value={newListing.type} onValueChange={(value) => setNewListing({...newListing, type: value})}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="house">House</SelectItem>
                        <SelectItem value="villa">Villa</SelectItem>
                        <SelectItem value="room">Room</SelectItem>
                        <SelectItem value="studio">Studio</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-200">Price per night (₹)</label>
                    <Input
                      type="number"
                      value={newListing.price_per_night}
                      onChange={(e) => setNewListing({...newListing, price_per_night: e.target.value})}
                      placeholder="5000"
                      className="bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-200">Address</label>
                    <Input
                      value={newListing.address}
                      onChange={(e) => setNewListing({...newListing, address: e.target.value})}
                      placeholder="Street address"
                      className="bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-sm font-medium text-gray-200">City</label>
                      <Input
                        value={newListing.city}
                        onChange={(e) => setNewListing({...newListing, city: e.target.value})}
                        placeholder="Mumbai"
                        className="bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-200">State</label>
                      <Input
                        value={newListing.state}
                        onChange={(e) => setNewListing({...newListing, state: e.target.value})}
                        placeholder="Maharashtra"
                        className="bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-sm font-medium text-gray-200">Guests</label>
                      <Input
                        type="number"
                        value={newListing.guests}
                        onChange={(e) => setNewListing({...newListing, guests: e.target.value})}
                        placeholder="4"
                        className="bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-200">Bedrooms</label>
                      <Input
                        type="number"
                        value={newListing.bedrooms}
                        onChange={(e) => setNewListing({...newListing, bedrooms: e.target.value})}
                        placeholder="2"
                        className="bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-200">Bathrooms</label>
                      <Input
                        type="number"
                        value={newListing.bathrooms}
                        onChange={(e) => setNewListing({...newListing, bathrooms: e.target.value})}
                        placeholder="1"
                        className="bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-200">Description</label>
                    <Textarea
                      value={newListing.description}
                      onChange={(e) => setNewListing({...newListing, description: e.target.value})}
                      placeholder="Describe your property"
                      rows={4}
                      className="bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-4 mt-6">
                <Button 
                  onClick={handleAddListing} 
                  disabled={isCreating}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isCreating ? "Adding..." : "Add Listing"}
                </Button>
                <Button variant="outline" onClick={() => setShowAddListing(false)} className="border-gray-600 text-gray-200 hover:bg-gray-700">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Listings Table */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Your Listings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-200">Property</th>
                    <th className="text-left py-3 px-4 text-gray-200">Location</th>
                    <th className="text-left py-3 px-4 text-gray-200">Price/Night</th>
                    <th className="text-left py-3 px-4 text-gray-200">Bookings</th>
                    <th className="text-left py-3 px-4 text-gray-200">Status</th>
                    <th className="text-left py-3 px-4 text-gray-200">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {myListings.map((listing) => {
                    const listingBookings = myBookings.filter(booking => booking.listing_id === listing.id);
                    return (
                      <tr key={listing.id} className="border-b border-gray-700">
                        <td className="py-3 px-4 font-medium text-white">{listing.title}</td>
                        <td className="py-3 px-4 text-gray-300">{listing.city}, {listing.state}</td>
                        <td className="py-3 px-4 text-white">₹{listing.price_per_night.toLocaleString()}</td>
                        <td className="py-3 px-4 text-white">{listingBookings.length}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-green-900 text-green-300 rounded-full text-xs border border-green-700">
                            {listing.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" className="border-gray-600 text-gray-200 hover:bg-gray-700">Edit</Button>
                            <Button variant="outline" size="sm" className="border-gray-600 text-gray-200 hover:bg-gray-700">View</Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {myListings.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-400">
                        No listings yet. Create your first property listing!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HostDashboard;
