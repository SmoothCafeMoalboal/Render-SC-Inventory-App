import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function TopNavigation() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Dashboard" },
    { href: "/inventory", label: "Inventory" },
    { href: "/deliveries", label: "Deliveries" },
    { href: "/reports", label: "Reports" },
    { href: "/recipes", label: "Recipes" },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <i className="fas fa-warehouse text-blue-600 text-2xl mr-3"></i>
              <h1 className="text-xl font-semibold text-gray-900">RestaurantIMS</h1>
            </div>
            <div className="hidden md:ml-8 md:flex md:space-x-8">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <span
                    className={`${
                      location === item.href
                        ? "border-blue-600 text-blue-600 border-b-2"
                        : "text-gray-500 hover:text-gray-700 border-transparent hover:border-gray-300 border-b-2"
                    } py-4 px-1 text-sm font-medium transition-colors cursor-pointer`}
                  >
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {/* Quick Scanner Button */}
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center">
              <i className="fas fa-barcode mr-2"></i>
              Quick Scan
            </Button>
            {/* User Menu */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">John Doe</span>
              <Badge className="bg-blue-100 text-blue-800">Manager</Badge>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600">
                <i className="fas fa-cog text-lg"></i>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
