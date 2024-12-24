import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";

interface CrawlResult {
  success: boolean;
  message?: string;
  data?: any[];
}

export const VesselLineCrawler = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [crawlResult, setCrawlResult] = useState<CrawlResult | null>(null);

  const handleScrape = async () => {
    try {
      setIsLoading(true);
      setProgress(25);
      
      const { data, error } = await supabase.functions.invoke('zim-schedule-scraper');
      
      if (error) throw error;
      
      setProgress(100);
      setCrawlResult(data as CrawlResult);
      
      toast({
        title: "Success",
        description: "Successfully fetched shipping schedules",
        duration: 3000,
      });
      
    } catch (error) {
      console.error('Error scraping schedules:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch schedules",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 mb-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">ZIM Schedule Scraper</h3>
          <Button
            onClick={handleScrape}
            disabled={isLoading}
          >
            {isLoading ? "Fetching Schedules..." : "Fetch ZIM Schedules"}
          </Button>
        </div>

        {isLoading && (
          <Progress value={progress} className="w-full" />
        )}

        {crawlResult && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">Results:</h4>
            <div className="bg-gray-50 p-4 rounded-md">
              <p>{crawlResult.message}</p>
              {crawlResult.data && (
                <p className="mt-2">Found {crawlResult.data.length} schedules</p>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};