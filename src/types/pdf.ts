export interface PDFGenerationOptions {
  format: 'a4' | 'letter';
  orientation: 'portrait' | 'landscape';
  margin: number;
  scale: number;
}

export interface PDFPageData {
  coverPage: {
    storeName: string;
    storeDescription?: string;
    logoUrl?: string;
    contactInfo: {
      phone?: string;
      email?: string;
      address?: string;
    };
    socialMedia: {
      facebook?: string;
      instagram?: string;
      twitter?: string;
      tiktok?: string;
    };
    generationDate: string;
  };
  menuPage: {
    storeName: string;
    featuredItems: Array<{
      id: string;
      name: string;
      description?: string;
      price: number;
      imageUrl?: string;
    }>;
    categories: Array<{
      id: string;
      name: string;
      description?: string;
      items: Array<{
        id: string;
        name: string;
        description?: string;
        price: number;
        imageUrl?: string;
        isAvailable: boolean;
      }>;
    }>;
  };
}

export interface PDFDownloadProps {
  store: any;
  categories: any[];
  menuItems: any[];
  className?: string;
  onDownloadStart?: () => void;
  onDownloadComplete?: (success: boolean) => void;
  onDownloadError?: (error: Error) => void;
}
