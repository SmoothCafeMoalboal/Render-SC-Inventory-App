import TopNavigation from "@/components/layout/top-navigation";
import MobileBottomNav from "@/components/layout/mobile-bottom-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Recipes() {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        <Card>
          <CardHeader>
            <CardTitle>Recipe Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Recipe management features coming soon...</p>
          </CardContent>
        </Card>
      </div>

      <MobileBottomNav />
    </div>
  );
}
