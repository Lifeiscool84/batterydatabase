import { Mail, Globe, PhoneCall } from "lucide-react";

interface FacilityContactProps {
  phone: string;
  email?: string;
  website?: string;
}

export const FacilityContact = ({ phone, email, website }: FacilityContactProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center text-sm gap-2">
        <PhoneCall className="h-4 w-4 flex-shrink-0" />
        <span className="truncate">{phone}</span>
      </div>
      {email && (
        <div className="flex items-center text-sm gap-2">
          <Mail className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">{email}</span>
        </div>
      )}
      {website && (
        <div className="flex items-center text-sm gap-2">
          <Globe className="h-4 w-4 flex-shrink-0" />
          <span className="break-all">{website}</span>
        </div>
      )}
    </div>
  );
};