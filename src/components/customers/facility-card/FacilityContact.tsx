import { Mail, Globe, PhoneCall } from "lucide-react";

interface FacilityContactProps {
  phone: string;
  email?: string;
  website?: string;
}

export const FacilityContact = ({ phone, email, website }: FacilityContactProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center text-sm">
        <PhoneCall className="mr-2 h-4 w-4" />
        {phone}
      </div>
      {email && (
        <div className="flex items-center text-sm">
          <Mail className="mr-2 h-4 w-4" />
          {email}
        </div>
      )}
      {website && (
        <div className="flex items-center text-sm">
          <Globe className="mr-2 h-4 w-4" />
          {website}
        </div>
      )}
    </div>
  );
};