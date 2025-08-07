import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function QuickActions() {
  const actions = [
    {
      icon: "fas fa-barcode",
      title: "Scan Item",
      subtitle: "Quick lookup",
      color: "text-blue-600",
    },
    {
      icon: "fas fa-plus-circle",
      title: "Add Item",
      subtitle: "New product",
      color: "text-green-600",
    },
    {
      icon: "fas fa-truck",
      title: "Log Delivery", 
      subtitle: "Receive stock",
      color: "text-blue-500",
    },
    {
      icon: "fas fa-exchange-alt",
      title: "Transfer",
      subtitle: "Between depts",
      color: "text-purple-500",
    },
    {
      icon: "fas fa-adjust",
      title: "Adjustment",
      subtitle: "Fix quantities",
      color: "text-orange-500",
    },
    {
      icon: "fas fa-chart-line",
      title: "Reports",
      subtitle: "Analytics",
      color: "text-indigo-500",
    },
  ];

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
      <CardHeader className="p-6 border-b border-gray-200">
        <CardTitle className="text-lg font-semibold text-gray-900">Quick Actions</CardTitle>
        <p className="text-sm text-gray-600 mt-1">Common tasks and shortcuts</p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="ghost"
              className="flex flex-col items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg text-center transition-colors h-auto"
            >
              <i className={`${action.icon} ${action.color} text-2xl mb-2`}></i>
              <span className="text-sm font-medium text-gray-900">{action.title}</span>
              <span className="text-xs text-gray-600">{action.subtitle}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
