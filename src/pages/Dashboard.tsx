import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BarChart3, Users, Ship, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-navy-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-yellow-400">BatteryToKorea Database</h1>
            </div>
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={logout}
                className="text-yellow-400 hover:text-yellow-300"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
            <Card 
              className="hover:shadow-lg transition-shadow cursor-pointer bg-white/80 backdrop-blur"
              onClick={() => navigate('/metal-prices')}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                  Metal Price Trends
                </CardTitle>
                <CardDescription>Track current metal price trends for lead and aluminum</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">View and analyze real-time metal price data</p>
              </CardContent>
            </Card>

            <Card 
              className="hover:shadow-lg transition-shadow cursor-pointer bg-white/80 backdrop-blur"
              onClick={() => navigate('/customers')}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-6 w-6 text-green-600" />
                  Customer List
                </CardTitle>
                <CardDescription>Manage customer relationships by location</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">View and manage customer data across different locations</p>
              </CardContent>
            </Card>

            <Card 
              className="hover:shadow-lg transition-shadow cursor-pointer bg-white/80 backdrop-blur"
              onClick={() => navigate('/shipping-schedules')}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ship className="h-6 w-6 text-purple-600" />
                  Shipping Schedules
                </CardTitle>
                <CardDescription>View vessel line plans and schedules</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Track shipping schedules and manage notifications</p>
              </CardContent>
            </Card>

            <Card 
              className="hover:shadow-lg transition-shadow cursor-pointer bg-white/80 backdrop-blur"
              onClick={() => navigate('/deals')}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-6 w-6 text-orange-600" />
                  Container Deals
                </CardTitle>
                <CardDescription>Track current and expected container deals</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Manage all container deals and their status</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;