interface FacilityPricingProps {
  buyingPrice?: number;
  sellingPrice?: number;
}

export const FacilityPricing = ({ 
  buyingPrice, 
  sellingPrice
}: FacilityPricingProps) => {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold">Pricing</h3>
      <div className="space-y-1 text-sm">
        {buyingPrice && (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Buying Price:</span>
            <span>${buyingPrice}/lb</span>
          </div>
        )}
        {sellingPrice && (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Selling Price:</span>
            <span>${sellingPrice}</span>
          </div>
        )}
        {!buyingPrice && !sellingPrice && (
          <span className="text-muted-foreground">No pricing information available</span>
        )}
      </div>
    </div>
  );
};