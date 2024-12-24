import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CrawlResult {
  success: boolean;
  status?: string;
  completed?: number;
  total?: number;
  creditsUsed?: number;
  expiresAt?: string;
  data?: any[];
}

export const VesselLineCrawler = () => {
  const { toast } = useToast();
  const [url, setUrl] = useState('');
  const [carrier, setCarrier] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [crawlResult, setCrawlResult] = useState<CrawlResult | null>(null);

  const carrierUrls = {
    ZIM: 'https://www.zim.com/schedules',
    HMM: 'https://www.hmm21.com/cms/business/ebiz/schedule/default.jsp'
  };

  const handleCarrierChange = (value: string) => {
    setCarrier(value);
    setUrl(carrierUrls[value as keyof typeof carrierUrls] || '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setProgress(0);
    setCrawlResult(null);

    try {
      // Call Supabase Edge Function to handle the crawling
      const response = await fetch('/api/crawl-vessel-schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, carrier }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Success",
          description: "Schedule data fetched successfully",
          duration: 3000,
        });
        setCrawlResult(result);
        setProgress(100);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to fetch schedule data",
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Error fetching schedule data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch schedule data",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 mb-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="carrier">Carrier</Label>
          <Select value={carrier} onValueChange={handleCarrierChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select carrier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ZIM">ZIM</SelectItem>
              <SelectItem value="HMM">HMM</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="url">Website URL</Label>
          <Input
            id="url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            required
            className="w-full"
          />
        </div>

        {isLoading && (
          <Progress value={progress} className="w-full" />
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Fetching Schedules..." : "Fetch Schedules"}
        </Button>
      </form>

      {crawlResult && crawlResult.data && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Crawl Results</h3>
          <div className="space-y-2 text-sm">
            <p>Status: {crawlResult.status}</p>
            <p>Completed Pages: {crawlResult.completed}</p>
            <p>Total Pages: {crawlResult.total}</p>
            <p>Credits Used: {crawlResult.creditsUsed}</p>
            {crawlResult.expiresAt && (
              <p>Expires At: {new Date(crawlResult.expiresAt).toLocaleString()}</p>
            )}
            <div className="mt-4">
              <p className="font-semibold mb-2">Schedule Data:</p>
              <pre className="bg-gray-100 p-2 rounded overflow-auto max-h-60">
                {JSON.stringify(crawlResult.data, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};