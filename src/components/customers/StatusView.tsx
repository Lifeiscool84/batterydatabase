import { FacilityCard } from "./FacilityCard";
import type { Location } from "@/pages/Customers";

const mockFacilities = [
  {
    id: "1",
    name: "Houston Metal Recycling",
    status: "active",
    address: "123 Industrial Blvd, Houston, TX",
    phone: "(713) 555-0123",
    email: "contact@houstonmetal.com",
    website: "houstonmetal.com",
    buyingPrice: 250,
    sellingPrice: 300,
    lastContact: "2024-03-15",
    size: "Large",
    remarks: "Premium partner, weekly collections"
  },
  // Add more mock data as needed
];

interface StatusViewProps {
  location: Location;
}

export const StatusView = ({ location }: StatusViewProps) => {
  const activePartners = mockFacilities.filter(f => f.status === "active");
  const engagedProspects = mockFacilities.filter(f => f.status === "engaged");
  const pastContacts = mockFacilities.filter(f => f.status === "past");
  const generalContacts = mockFacilities.filter(f => f.status === "general");

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-semibold mb-4 text-success">
          Active Partners ({activePartners.length})
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {activePartners.map(facility => (
            <FacilityCard key={facility.id} facility={facility} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4 text-warning">
          Engaged Prospects ({engagedProspects.length})
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {engagedProspects.map(facility => (
            <FacilityCard key={facility.id} facility={facility} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4 text-danger">
          Past Contacts ({pastContacts.length})
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pastContacts.map(facility => (
            <FacilityCard key={facility.id} facility={facility} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4 text-muted-foreground">
          General Contacts ({generalContacts.length})
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {generalContacts.map(facility => (
            <FacilityCard key={facility.id} facility={facility} />
          ))}
        </div>
      </section>
    </div>
  );
};