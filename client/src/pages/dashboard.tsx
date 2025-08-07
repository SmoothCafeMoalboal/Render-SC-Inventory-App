import TopNavigation from "@/components/layout/top-navigation";
import MobileBottomNav from "@/components/layout/mobile-bottom-nav";
import DepartmentOverview from "@/components/dashboard/department-overview";
import RecentActivity from "@/components/dashboard/recent-activity";
import QuickActions from "@/components/dashboard/quick-actions";
import CriticalItemsTable from "@/components/dashboard/critical-items-table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

export default function Dashboard() {
  const { data: lowStockItems, isLoading: lowStockLoading } = useQuery({
    queryKey: ["/api/inventory/low-stock"],
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const lowStockCount = Array.isArray(lowStockItems) ? lowStockItems.length : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Inventory Dashboard</h2>
              <p className="mt-1 text-sm text-gray-600">Monitor stock levels across all departments</p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <Button variant="outline" className="flex items-center">
                <i className="fas fa-download mr-2"></i>
                Export Data
              </Button>
              <Button className="bg-green-600 hover:bg-green-700 flex items-center">
                <i className="fas fa-plus mr-2"></i>
                Quick Entry
              </Button>
            </div>
          </div>
        </div>

        {/* Alerts Section */}
        {lowStockCount > 0 && (
          <div className="mb-8">
            <Alert className="bg-orange-50 border-orange-200">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <span className="font-medium">Low Stock Alerts:</span> {lowStockCount} items are running low and need restocking
                <Button variant="link" className="text-orange-700 hover:text-orange-800 ml-2 p-0">
                  View All
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Department Overview */}
        <DepartmentOverview stats={stats as any} loading={statsLoading} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <RecentActivity />
          <QuickActions />
        </div>

        {/* Critical Items Table */}
        <CriticalItemsTable />
      </div>

      <MobileBottomNav />
    </div>
  );
}
