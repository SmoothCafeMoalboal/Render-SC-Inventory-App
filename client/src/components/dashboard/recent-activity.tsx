import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

export default function RecentActivity() {
  const { data: movements, isLoading } = useQuery({
    queryKey: ["/api/inventory-movements/recent"],
  });

  const getActivityIcon = (movementType: string) => {
    switch (movementType) {
      case "delivery":
        return { icon: "fas fa-truck", bg: "bg-green-100", color: "text-green-600" };
      case "transfer_in":
      case "transfer_out":
        return { icon: "fas fa-exchange-alt", bg: "bg-blue-100", color: "text-blue-600" };
      case "adjustment":
        return { icon: "fas fa-edit", bg: "bg-purple-100", color: "text-purple-600" };
      default:
        return { icon: "fas fa-exclamation-triangle", bg: "bg-orange-100", color: "text-orange-600" };
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  if (isLoading) {
    return (
      <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
        <CardHeader className="p-6 border-b border-gray-200">
          <CardTitle className="text-lg font-semibold text-gray-900">Recent Activity</CardTitle>
          <p className="text-sm text-gray-600 mt-1">Latest inventory movements and updates</p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start space-x-3">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <div className="flex-1 min-w-0">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2 mb-1" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatActivityDescription = (movement: any) => {
    switch (movement.movementType) {
      case "delivery":
        return `${movement.supplier?.name || "Unknown"} delivery received`;
      case "transfer_in":
        return `Transfer from ${movement.fromDepartment || "Unknown"} to ${movement.department}`;
      case "transfer_out":
        return `Transfer from ${movement.department} to ${movement.toDepartment || "Unknown"}`;
      case "adjustment":
        return `Inventory adjustment by ${movement.user?.name || "Unknown"}`;
      default:
        return "Inventory movement";
    }
  };

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
      <CardHeader className="p-6 border-b border-gray-200">
        <CardTitle className="text-lg font-semibold text-gray-900">Recent Activity</CardTitle>
        <p className="text-sm text-gray-600 mt-1">Latest inventory movements and updates</p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {Array.isArray(movements) && movements.length > 0 ? (
            movements.map((movement: any) => {
              const activityIcon = getActivityIcon(movement.movementType);
              
              return (
                <div key={movement.id} className="flex items-start space-x-3">
                  <div className={`${activityIcon.bg} p-2 rounded-lg`}>
                    <i className={`${activityIcon.icon} ${activityIcon.color} text-sm`}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      {formatActivityDescription(movement)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {movement.product?.name} - {movement.quantity} {movement.product?.unitType}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatTimeAgo(movement.timestamp)}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">No recent activity</p>
          )}
        </div>
        <Button 
          variant="link" 
          className="w-full mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          View All Activity
        </Button>
      </CardContent>
    </Card>
  );
}
