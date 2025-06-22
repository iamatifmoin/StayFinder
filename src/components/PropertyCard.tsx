
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Star, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  images: string[];
  type: string;
  guests: number;
  bedrooms: number;
  bathrooms: number;
}

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <Link to={`/property/${property.id}`} className="block group">
      <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] bg-gray-800 h-full flex flex-col">
        <div className="relative overflow-hidden">
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Price badge */}
          <div className="absolute top-4 right-4 bg-gray-900/95 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg border border-gray-700">
            <span className="text-sm font-bold text-white">₹{property.price.toLocaleString()}</span>
            <span className="text-xs text-gray-300 ml-1">/night</span>
          </div>
          
          {/* Heart icon */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsLiked(!isLiked);
            }}
            className="absolute top-4 left-4 p-2 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/30 transition-all duration-300 hover:scale-110"
          >
            <Heart 
              className={`h-4 w-4 transition-all duration-300 ${
                isLiked 
                  ? "fill-red-500 text-red-500 scale-110" 
                  : "text-white hover:text-red-500"
              }`} 
            />
          </button>
        </div>
        
        <CardContent className="p-5 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-blue-400 bg-blue-900/30 px-2 py-1 rounded-full border border-blue-800">
              {property.type}
            </span>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold text-white">{property.rating}</span>
              <span className="text-sm text-gray-400">({property.reviews})</span>
            </div>
          </div>
          
          <h3 className="font-bold text-white mb-3 text-lg line-clamp-2 group-hover:text-blue-400 transition-colors duration-300 flex-1">
            {property.title}
          </h3>
          
          <div className="flex items-center text-gray-400 mb-3">
            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-sm">{property.location}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t border-gray-700 mt-auto">
            <span>{property.guests} guests</span>
            <span>•</span>
            <span>{property.bedrooms} beds</span>
            <span>•</span>
            <span>{property.bathrooms} baths</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default PropertyCard;
