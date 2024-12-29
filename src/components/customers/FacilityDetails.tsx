import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { Building2, DollarSign, History, MessageSquare, User } from "lucide-react";
import type { PriceHistory, Interaction, StatusHistory } from "./types";

interface FacilityDetailsProps {
  facilityId: string;
  priceHistory: PriceHistory[];
  interactions: Interaction[];
  statusHistory: StatusHistory[];
  capabilities: string[];
  notes: string;
}

export const FacilityDetails = ({
  facilityId,
  priceHistory,
  interactions,
  statusHistory,
  capabilities,
  notes
}: FacilityDetailsProps) => {
  return (
    <div className="p-4 space-y-4 bg-muted/30 rounded-md">
      <Tabs defaultValue="interactions" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="interactions" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Status History
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Activity
          </TabsTrigger>
          <TabsTrigger value="prices" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Prices
          </TabsTrigger>
          <TabsTrigger value="capabilities" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Capabilities
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Notes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="interactions" className="mt-4">
          <ScrollArea className="h-[300px] rounded-md border p-4">
            {statusHistory.length === 0 ? (
              <div className="text-center text-muted-foreground">No status changes recorded</div>
            ) : (
              <div className="space-y-4">
                {statusHistory.map((status, index) => (
                  <div key={index} className="flex flex-col gap-2 pb-4 border-b last:border-0">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="text-sm font-medium">
                          {status.from} → {status.to}
                        </div>
                        <div className="text-sm">{status.reason}</div>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(status.date), "PPp")}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <User className="h-3 w-3 mr-1" />
                      {status.user}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="activity" className="mt-4">
          <ScrollArea className="h-[300px] rounded-md border p-4">
            {interactions.length === 0 ? (
              <div className="text-center text-muted-foreground">No interactions recorded</div>
            ) : (
              <div className="space-y-4">
                {interactions.map((interaction, index) => (
                  <div key={index} className="flex flex-col gap-2 pb-4 border-b last:border-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium capitalize">{interaction.type}</span>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(interaction.date), "PPp")}
                      </span>
                    </div>
                    <p className="text-sm">{interaction.notes}</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <User className="h-3 w-3 mr-1" />
                      {interaction.user}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="prices" className="mt-4">
          <ScrollArea className="h-[300px] rounded-md border p-4">
            {priceHistory.length === 0 ? (
              <div className="text-center text-muted-foreground">No price history available</div>
            ) : (
              <div className="space-y-4">
                {priceHistory.map((price, index) => (
                  <div key={index} className="flex flex-col gap-2 pb-4 border-b last:border-0">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="text-sm">
                          Buying: <span className="font-medium">${price.buyingPrice}/ton</span>
                        </div>
                        <div className="text-sm">
                          Selling: <span className="font-medium">${price.sellingPrice}/ton</span>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(price.date), "PPp")}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <User className="h-3 w-3 mr-1" />
                      {price.updatedBy}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="capabilities" className="mt-4">
          <ScrollArea className="h-[300px] rounded-md border p-4">
            {capabilities.length === 0 ? (
              <div className="text-center text-muted-foreground">No capabilities listed</div>
            ) : (
              <div className="space-y-2">
                {capabilities.map((capability, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span>{capability}</span>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="notes" className="mt-4">
          <ScrollArea className="h-[300px] rounded-md border p-4">
            <div className="prose prose-sm max-w-none">
              {notes || "No additional notes."}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};