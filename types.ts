
export interface TicketData {
  title: string;
  cinemaName: string;
  address: string;
  date: string;
  time: string;
  hall: string;
  hallType: string;
  language: string; 
  seat: string;
  price: string;
  posterUrl: string | null;
  themeColor: string;
  username: string; 
  templateId: string; // New field for template selection
}

export interface GeneratedTicketInfo {
  title: string;
  cinemaName?: string;
  address?: string;
  date?: string;
  time?: string;
  hall?: string;
  hallType?: string;
  language?: string;
  seat?: string;
  price?: string;
  themeColor?: string;
}

export interface TicketTemplate {
  id: string;
  name: string;
  previewColor: string;
  imageUrl: string; // Added field for thumbnail and background
}

export const TEMPLATES: TicketTemplate[] = [
  { 
    id: 'blue-mood', 
    name: '深海蓝调', 
    previewColor: 'bg-blue-900',
    imageUrl: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop"
  },
  { 
    id: 'vintage', 
    name: '复古纸张', 
    previewColor: 'bg-[#eecfa1]',
    imageUrl: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?q=80&w=800&auto=format&fit=crop"
  },
  { 
    id: 'cyber', 
    name: '暗夜霓虹', 
    previewColor: 'bg-purple-900',
    imageUrl: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=800&auto=format&fit=crop"
  },
  { 
    id: 'gold', 
    name: '黑金尊享', 
    previewColor: 'bg-gray-800 border border-yellow-600',
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop"
  },
  { 
    id: 'simple', 
    name: '极简白', 
    previewColor: 'bg-gray-100 text-gray-800',
    imageUrl: "https://images.unsplash.com/photo-1517816743773-6e0fd518b4a6?q=80&w=800&auto=format&fit=crop"
  },
];

// Helper to get default empty state
export const DEFAULT_TICKET: TicketData = {
  title: "我不是药神",
  cinemaName: "浙江时代影城·奥斯卡店",
  address: "杭州市下城区西湖文化广场",
  date: "2018-07-10",
  time: "15:00",
  hall: "1号厅",
  hallType: "2D",
  language: "国语",
  seat: "4排04座",
  price: "¥ 35.0",
  // Using an Unsplash image which supports CORS
  posterUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80",
  themeColor: "#1e3a8a", 
  username: "醉の晓",
  templateId: "blue-mood",
};