import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

export default function CriticalItemsTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  const { data: lowStockItems, isLoading } = useQuery({
    queryKey: ["/api/inventory/low-stock"],
  });

  const getDepartmentBadge = (department: string) => {
    const colors = {
      kitchen: "bg-red-100 text-red-800",
      bar: "bg-purple-100 text-purple-800", 
      coffee: "bg-amber-100 text-amber-800",
      commissary: "bg-green-100 text-green-800",
    };
    
    return colors[department as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "critical":
        return "bg-red-100 text-red-800";
      case "low":
        return "bg-orange-100 text-orange-800";
      case "out":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "critical":
      case "low":
        return "fas fa-exclamation-triangle";
      case "out":
        return "fas fa-times-circle";
      default:
        return "fas fa-check-circle";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "critical":
        return "Critical";
      case "low":
        return "Low";
      case "out":
        return "Out";
      default:
        return "Good";
    }
  };

  const filteredItems = Array.isArray(lowStockItems) ? lowStockItems.filter((item: any) => {
    const matchesSearch = !searchTerm || 
      item.product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.product?.sku.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = selectedDepartment === "all" || item.department === selectedDepartment;
    
    return matchesSearch && matchesDepartment;
  }) : [];

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
      <CardHeader className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Critical Items</h3>
            <p className="text-sm text-gray-600 mt-1">Items requiring immediate attention</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-2">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-64"
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="kitchen">Kitchen</SelectItem>
                <SelectItem value="bar">Bar</SelectItem>
                <SelectItem value="coffee">Coffee</SelectItem>
                <SelectItem value="commissary">Commissary</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Min Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <Skeleton className="h-4 w-32 mb-1" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Skeleton className="h-4 w-20" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Skeleton className="h-4 w-16" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Skeleton className="h-4 w-16" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end space-x-2">
                        <Skeleton className="h-6 w-6" />
                        <Skeleton className="h-6 w-6" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : filteredItems.length > 0 ? (
                filteredItems.map((item: any) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-900">
                          {item.product?.name || "Unknown Product"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.product?.brand || "No Brand"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.product?.sku || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getDepartmentBadge(item.department)}>
                        {item.department.charAt(0).toUpperCase() + item.department.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.currentStock} {item.product?.unitType || "units"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.product?.minLevel || "0"} {item.product?.unitType || "units"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getStatusBadge(item.status)}>
                        <i className={`${getStatusIcon(item.status)} mr-1`}></i>
                        {getStatusText(item.status)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 mr-3">
                        <i className="fas fa-edit"></i>
                      </Button>
                      <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                        <i className="fas fa-plus"></i>
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-500">
                    {searchTerm || selectedDepartment !== "all" 
                      ? "No items match your search criteria"
                      : "No critical items found"
                    }
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {filteredItems.length > 0 && (
          <div className="px-6 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to{" "}
                <span className="font-medium">{Math.min(filteredItems.length, 10)}</span> of{" "}
                <span className="font-medium">{filteredItems.length}</span> critical items
              </div>
              <nav className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" disabled className="text-gray-500">
                  Previous
                </Button>
                <Button size="sm" className="bg-blue-600 text-white">
                  1
                </Button>
                <Button variant="ghost" size="sm" disabled className="text-gray-500">
                  Next
                </Button>
              </nav>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
