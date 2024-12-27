interface FacilityPricingProps {
  buyingPrice?: number;
  sellingPrice?: number;
  lastContact: string;
}

export const FacilityPricing = ({ buyingPrice, sellingPrice, lastContact }: FacilityPricingProps) => {
  return (
    <div className="space-y-2">
      {buyingPrice && (
        <div className="text-sm">
          Buying: ${buyingPrice}/ton
        </div>
      )}
      {sellingPrice && (
        <div className="text-sm">
          Selling: ${sellingPrice}/ton
        </div>
      )}
      <div className="text-sm text-muted-foreground">
        Last Contact: {lastContact}
      </div>
    </div>
  );
};