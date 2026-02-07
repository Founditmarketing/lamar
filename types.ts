import { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
}

export interface ServiceItem {
  label: string;
  icon: LucideIcon;
  href: string;
  internalLink?: string;
}

export enum AccountType {
  PERSONAL = 'Personal',
  BUSINESS = 'Business',
  COMMERCIAL = 'Commercial'
}