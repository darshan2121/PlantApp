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
  fullName: string;
  fullNameGujarati?: string;
  email?: string;
  phone: string;
  address: {
    area: string;
    areaGujarati?: string;
    pincode: string;
    wardName: string;
    wardNameGujarati?: string;
  };
  language: 'english' | 'gujarati';
}