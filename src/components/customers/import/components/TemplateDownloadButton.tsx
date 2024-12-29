import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { downloadTemplate } from "../utils/templateUtils";

export const TemplateDownloadButton = () => {
  const { toast } = useToast();

  const handleDownload = () => {
    try {
      downloadTemplate();
      toast({
        title: "Template downloaded",
        description: "Fill in the CSV template and upload it back to import facilities",
      });
    } catch (error) {
      console.error('Error creating template:', error);
      toast({
        title: "Error creating template",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-center">
      <Button variant="outline" onClick={handleDownload}>
        <Download className="w-4 h-4 mr-2" />
        Download CSV Template
      </Button>
    </div>
  );
};