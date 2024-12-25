import { FacilityCard } from "./FacilityCard";
import type { Location, Status } from "@/pages/Customers";

const mockFacilities = [
  {
    id: "1",
    name: "Houston Metal Recycling",
    status: "active" as Status,
    address: "123 Industrial Blvd, Houston, TX",
    phone: "(713) 555-0123",
    email: "contact@houstonmetal.com",
    website: "houstonmetal.com",
    buyingPrice: 250,
    sellingPrice: 300,
    lastContact: "2024-03-15",
    size: "Large" as const,
    remarks: "Premium partner, weekly collections"
  },
  {
    id: "2",
    name: "Gulf Coast Recyclers",
    status: "engaged" as Status,
    address: "456 Port Avenue, Houston, TX",
    phone: "(713) 555-0456",
    email: "info@gulfcoastrecyclers.com",
    website: "gulfcoastrecyclers.com",
    buyingPrice: 245,
    sellingPrice: 295,
    lastContact: "2024-03-10",
    size: "Medium" as const,
    remarks: "Negotiating contract terms"
  },
  {
    id: "3",
    name: "Texas Scrap Solutions",
    status: "past" as Status,
    address: "789 Industrial Park, Houston, TX",
    phone: "(713) 555-0789",
    email: "contact@texasscrap.com",
    website: "texasscrap.com",
    buyingPrice: 240,
    sellingPrice: 290,
    lastContact: "2024-02-15",
    size: "Small" as const,
    remarks: "Previous partner, maintain contact"
  },
  {
    id: "4",
    name: "Metro Metals",
    status: "general" as Status,
    address: "321 Commerce St, Houston, TX",
    phone: "(713) 555-0321",
    email: "info@metrometals.com",
    website: "metrometals.com",
    buyingPrice: 235,
    sellingPrice: 285,
    lastContact: "2024-01-20",
    size: "Medium" as const,
    remarks: "Initial contact made"
  }
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