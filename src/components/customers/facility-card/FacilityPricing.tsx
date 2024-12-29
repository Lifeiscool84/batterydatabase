interface FacilityPricingProps {
  buyingPrice?: number;
  sellingPrice?: number;
  updatedAt?: string;
}

export const FacilityPricing = ({ 
  buyingPrice, 
  sellingPrice,
  updatedAt
}: FacilityPricingProps) => {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold">Pricing</h3>
      <div className="space-y-1 text-sm">
        {buyingPrice && (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Buying Price:</span>
            <span>${buyingPrice}</span>
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
        {updatedAt && (
          <div className="text-xs text-muted-foreground pt-2">
            Last updated: {new Date(updatedAt).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
};