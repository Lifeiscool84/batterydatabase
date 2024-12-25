import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LocationNav } from "@/components/customers/LocationNav";
import { StatusView } from "@/components/customers/StatusView";
import { ListView } from "@/components/customers/ListView";
import { MapView } from "@/components/customers/MapView";

export type Location = "Houston" | "New York/New Jersey" | "Seattle" | "Mobile" | "Los Angeles";
export type Status = "active" | "engaged" | "past" | "general";

const Customers = () => {
  const [selectedLocation, setSelectedLocation] = useState<Location>("Houston");
  const [view, setView] = useState<"status" | "list" | "map">("status");

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Customer Management</h1>
      
      <LocationNav 
        selectedLocation={selectedLocation} 
        onLocationChange={setSelectedLocation} 
      />

      <Tabs value={view} onValueChange={(value: "status" | "list" | "map") => setView(value)}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="status">Status View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="map">Map View</TabsTrigger>
        </TabsList>

        {view === "status" && <StatusView location={selectedLocation} />}
        {view === "list" && <ListView location={selectedLocation} />}
        {view === "map" && <MapView location={selectedLocation} />}
      </Tabs>
    </div>
  );
};

export default Customers;