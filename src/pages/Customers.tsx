import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { LocationNav } from "@/components/customers/LocationNav";
import { StatusView } from "@/components/customers/StatusView";
import { ListView } from "@/components/customers/ListView";
import { MapView } from "@/components/customers/MapView";
import { FacilityImporter } from "@/components/customers/FacilityImporter";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { BackButton } from "@/components/layout/BackButton";
import { supabase } from "@/integrations/supabase/client";

export type Location = "Houston" | "New York/New Jersey" | "Seattle" | "Mobile" | "Los Angeles";
export type Status = "active" | "engaged" | "past" | "general" | "invalid";

const Customers = () => {
  const [selectedLocation, setSelectedLocation] = useState<Location>("Houston");
  const [view, setView] = useState<"status" | "list" | "map">("status");
  const [locationCounts, setLocationCounts] = useState<Record<Location, number>>({
    "Houston": 0,
    "New York/New Jersey": 0,
    "Seattle": 0,
    "Mobile": 0,
    "Los Angeles": 0
  });

  const fetchLocationCounts = async () => {
    try {
      const { data: allFacilities, error: countError } = await supabase
        .from('facilities')
        .select('location');

      if (countError) throw countError;

      const counts: Record<Location, number> = {
        "Houston": 0,
        "New York/New Jersey": 0,
        "Seattle": 0,
        "Mobile": 0,
        "Los Angeles": 0
      };

      allFacilities?.forEach(facility => {
        const loc = facility.location as Location;
        if (counts[loc] !== undefined) {
          counts[loc]++;
        }
      });

      setLocationCounts(counts);
    } catch (error) {
      console.error('Error fetching location counts:', error);
    }
  };

  useEffect(() => {
    fetchLocationCounts();
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <BackButton />
          <h1 className="text-3xl font-bold">Customer Management</h1>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Import Facilities
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <FacilityImporter onSuccess={fetchLocationCounts} />
          </DialogContent>
        </Dialog>
      </div>
      
      <LocationNav 
        selectedLocation={selectedLocation} 
        onLocationChange={setSelectedLocation}
        locationCounts={locationCounts}
      />

      <Tabs value={view} onValueChange={(value: "status" | "list" | "map") => setView(value)}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="status">Status View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="map">Map View</TabsTrigger>
        </TabsList>

        {view === "status" && <StatusView location={selectedLocation} onUpdate={fetchLocationCounts} />}
        {view === "list" && 
          <ListView 
            location={selectedLocation} 
            onLocationCountsChange={setLocationCounts}
          />
        }
        {view === "map" && <MapView location={selectedLocation} />}
      </Tabs>
    </div>
  );
};

export default Customers;