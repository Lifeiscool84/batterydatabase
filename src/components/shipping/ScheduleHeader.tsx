import { Bell, Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/layout/BackButton";

interface ScheduleHeaderProps {
  unreadNotifications: number;
  onRefresh: () => void;
  onAddSchedule: () => void;
  isRefreshing?: boolean;
}

export const ScheduleHeader = ({
  unreadNotifications,
  onRefresh,
  onAddSchedule,
  isRefreshing = false,
}: ScheduleHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center">
        <BackButton />
        <h1 className="text-2xl font-semibold">Shipping Schedules</h1>
      </div>
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          className="relative"
          onClick={() => {/* Implement notifications panel */}}
        >
          <Bell className="h-4 w-4" />
          {unreadNotifications > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadNotifications}
            </span>
          )}
        </Button>
        <Button 
          onClick={onRefresh} 
          variant="outline"
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
        <Button onClick={onAddSchedule}>
          <Plus className="h-4 w-4 mr-2" />
          Add Schedule
        </Button>
      </div>
    </div>
  );
};