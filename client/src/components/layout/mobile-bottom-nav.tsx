import { Link, useLocation } from "wouter";

export default function MobileBottomNav() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: "fas fa-home", label: "Dashboard" },
    { href: "/inventory", icon: "fas fa-boxes", label: "Inventory" },
    { href: "#scan", icon: "fas fa-barcode", label: "Scan" },
    { href: "/reports", icon: "fas fa-chart-bar", label: "Reports" },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div className="grid grid-cols-4 gap-1">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <span
              className={`flex flex-col items-center py-2 px-1 cursor-pointer ${
                location === item.href ? "text-blue-600" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <i className={`${item.icon} text-lg mb-1`}></i>
              <span className="text-xs font-medium">{item.label}</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
