
import { ArrowLeft, Users, Home, Shield, Award, Heart, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors duration-300 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <div className="text-center">
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
              About 
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                StayFinder
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We're on a mission to create a world where anyone can belong anywhere, 
              connecting people to unique travel experiences across India.
            </p>
          </div>
        </div>

        {/* Mission Section */}
        <div className="mb-16">
          <Card className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-blue-700/30 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <Globe className="h-16 w-16 text-blue-400 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-4">Our Mission</h2>
              <p className="text-lg text-gray-300 max-w-4xl mx-auto">
                StayFinder was born from the belief that travel should be accessible, authentic, and meaningful. 
                We connect travelers with unique homes and experiences, while empowering local hosts to share 
                their spaces and stories with the world.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="bg-gray-800/95 backdrop-blur-sm border-gray-700 hover:border-blue-500/50 transition-all duration-300">
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Community First</h3>
              <p className="text-gray-300">
                Building a platform where hosts and guests create lasting connections and memorable experiences together.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/95 backdrop-blur-sm border-gray-700 hover:border-green-500/50 transition-all duration-300">
            <CardContent className="p-8 text-center">
              <Shield className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Trust & Safety</h3>
              <p className="text-gray-300">
                Ensuring every stay is safe and secure with verified hosts, secure payments, and 24/7 support.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/95 backdrop-blur-sm border-gray-700 hover:border-purple-500/50 transition-all duration-300">
            <CardContent className="p-8 text-center">
              <Award className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Quality Experience</h3>
              <p className="text-gray-300">
                Curating exceptional stays and experiences that exceed expectations and create lasting memories.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Story Section */}
        <div className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  Founded in 2024, StayFinder began with a simple idea: what if travelers could experience 
                  destinations like locals, staying in unique homes rather than generic hotels?
                </p>
                <p>
                  Starting in India's diverse landscape - from the bustling streets of Mumbai to the 
                  serene backwaters of Kerala - we've grown into a platform that celebrates the 
                  uniqueness of every place and the warmth of Indian hospitality.
                </p>
                <p>
                  Today, we're proud to connect thousands of travelers with unforgettable stays, 
                  while helping hosts share their passion for their local communities.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-center">
                <Heart className="h-16 w-16 text-white mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-4">Made with Love</h3>
                <p className="text-blue-100">
                  Every feature, every interaction, and every experience on StayFinder 
                  is crafted with care for our community of hosts and travelers.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-gray-800 to-gray-900 border-gray-700">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to be part of our story?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Whether you're looking for your next amazing stay or want to become a host, 
                we'd love to have you join our community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/properties">
                  <Button 
                    size="lg" 
                    className="h-12 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    Explore Properties
                  </Button>
                </Link>
                <Link to="/host">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="h-12 px-8 border-gray-600 text-white hover:bg-gray-800"
                  >
                    Become a Host
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;
