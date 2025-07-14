export interface Plant {
  id: string;
  name: string;
  nameGujarati: string;
  image: string;
  images?: string[];
  description: string;
  descriptionGujarati: string;
  category: string;
  tag: string;
  benefits: string[];
  benefitsGujarati: string[];
  inStock: boolean;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface CartItem {
  plant: Plant;
  quantity: number;
}

export interface Order {
  id: string;
  plants: CartItem[];
  bookingDate: string;
  status: 'Requested' | 'Approved' | 'Ready for Pickup' | 'Delivered';
  pickupLocation?: string;
  deliveryAddress?: string;
  contactNumber: string;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  mobile: string;
  image?: string | null;
  address: {
    area: string;
    ward: string;
    pinCode: string;
    city: string;
    state: string;
    country: string;
  };
  location?: {
    latitude: number;
    longitude: number;
  };
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  fullAddress?: string;
}