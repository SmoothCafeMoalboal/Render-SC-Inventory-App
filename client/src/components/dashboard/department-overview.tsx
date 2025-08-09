import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface DepartmentStats {
  totalItems: number;
  totalValue: number;
  lowStockCount: number;
}

interface Stats {
  departmentStats: {
    kitchen: DepartmentStats;
    bar: DepartmentStats;
    coffee: DepartmentStats;
    commissary: DepartmentStats;
  };
}

interface DepartmentOverviewProps {
  stats?: Stats;
  loading: boolean;
}

export default function DepartmentOverview({ stats, loading }: DepartmentOverviewProps) {
  const departments = [
    {
      key: "kitchen",
      name: "Kitchen",
      icon: "fas fa-utensils",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
    },
    {
      key: "bar",
      name: "Bar", 
      icon: "fas fa-wine-glass-alt",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      key: "coffee",
      name: "Coffee",
      icon: "fas fa-coffee",
      iconBg: "bg-amber-100", 
      iconColor: "text-amber-600",
    },
    {
      key: "commissary",
      name: "Commissary",
      icon: "fas fa-boxes",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
  ];

  const getStatusInfo = (lowStockCount: number) => {
    if (lowStockCount === 0) return { status: "Excellent", color: "text-green-600" };
    if (lowStockCount <= 2) return { status: "Good", color: "text-green-600" };
    if (lowStockCount <= 5) return { status: "Needs Attention", color: "text-orange-600" };
    return { status: "Critical", color: "text-red-600" };
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="ml-4">
                  <Skeleton className="h-5 w-16 mb-2" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-8 w-full mt-4" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {departments.map((dept) => {
        const deptStats = stats?.departmentStats[dept.key as keyof typeof stats.departmentStats] || {
          totalItems: 0,
          totalValue: 0,
          lowStockCount: 0,
        };
        const statusInfo = getStatusInfo(deptStats.lowStockCount);

        return (
          <Card key={dept.key} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className={`${dept.iconBg} p-3 rounded-lg`}>
                  <i className={`${dept.icon} ${dept.iconColor} text-xl`}></i>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">{dept.name}</h3>
                  <p className="text-sm text-gray-600">{deptStats.totalItems} items tracked</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Stock Status</span>
                <span className={`text-sm font-medium ${statusInfo.color}`}>
                  {statusInfo.status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Low Stock Items</span>
                {deptStats.lowStockCount > 0 ? (
                  <Badge variant="destructive" className="text-sm">
                    {deptStats.lowStockCount}
                  </Badge>
                ) : (
                  <span className="text-sm font-medium text-gray-400">0</span>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Value</span>
                <span className="text-sm font-medium">
                  ${deptStats.totalValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>
            <Button 
              variant="secondary" 
              className="w-full mt-4 bg-gray-50 hover:bg-gray-100 text-gray-700"
            >
              Manage {dept.name}
            </Button>
          </Card>
        );
      })}
    </div>
  );
}
