'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Coffee, ShoppingCart, Lock, KeyRound, 
  Trash2, User, Check, X,
  MessageSquare, RefreshCw, Edit3, LogOut, ArrowRight, ShieldCheck, Tag, Plus, Minus, BarChart2, Package, Calendar, Clock, Truck, CreditCard
} from 'lucide-react';

const supabaseUrl = 'https://myqdhkwicdqgtrtqlead.supabase.co';
const supabaseAnonKey = 'sb_publishable_5lONdfpICE-bb0wuuRjnMg_M_R4ddih';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Product {
  id: string;
  name: string;
  category: 'Green Beans' | 'Roasted Beans' | 'Blend Beans';
  pricePerKg: number;
  pricePer500g: number;
  pricePer200g: number;
  greenBeanCostPerKg: number;
  roastingCostPerKg: number;
  packagingCostPerKg: number;
  packagingCostPer500g: number;
  packagingCostPer200g: number;
  description: string;
  isExclusive: boolean;
  exclusiveCode: string;
  allowedResellers?: string[];
}

interface OrderItem {
  id: string;
  productId: string;
  name: string;
  quantityGram: number;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  packType?: '1kg' | '500g' | '200g';
}

interface Order {
  id: string;
  customerType: 'perorangan' | 'cafe';
  customerName: string;
  companyName: string;
  customerPhone: string;
  destinationArea: 'bandung' | 'luar_bandung';
  shippingAddress: string;
  shippingMethod: string;
  shippingCost: number;
  paymentMethod: 'transfer' | 'kontra_bon_15' | 'kontra_bon_30';
  paymentProof?: string;
  items: OrderItem[];
  subtotal: number;
  totalAmount: number;
  status: 'Pending Approval' | 'Roasting Process' | 'Ready for Shipping' | 'Delivered' | 'Rejected';
  dueDate?: string;
  estimatedRoastingDate?: string;
  estimatedShippingDate?: string;
  createdAt: string;
}

interface UserAccount {
  username: string;
  password?: string;
  role: 'pembeli' | 'reseller' | 'seller';
  companyName?: string;
  allowedBlends?: string[];
}

const presetResellerAccounts: UserAccount[] = [
  { username: 'BrunswickCafe', password: 'Fitzroy!', role: 'reseller', companyName: 'Brunswick', allowedBlends: ['Brunswick Blend (50 KDH : 50 BNE)'] },
  { username: 'DagoTerrace', password: 'TerraceB', role: 'reseller', companyName: 'Dago Terrace', allowedBlends: ['Dago Terrace Blend (70 KDH : 30 Robusta)'] },
  { username: 'RailwayCafe', password: 'RWCoffee', role: 'reseller', companyName: 'Railway', allowedBlends: ['Railway Blend (50 KDH : 50 KWH)'] },
  { username: 'NaraPark', password: 'NRBlend', role: 'reseller', companyName: 'Nara Park', allowedBlends: ['Blend K50 (50 KDH : 50 Robusta)'] },
  { username: 'GreensCafe', password: 'GFAR', role: 'reseller', companyName: 'Greens Food', allowedBlends: ['Foresta Blend (70 KDH : 30 Robusta)', 'Blend Tigris (70 Robusta : 30 KDH)'] },
  { username: 'AstriaSolo', password: 'Blend64', role: 'reseller', companyName: 'Astria Bakery', allowedBlends: ['Astria Blend (60 KDH : 40 Robusta)'] },
  { username: 'Sasson', password: 'Blend55', role: 'reseller', companyName: 'Sasson', allowedBlends: ['Luna Tirsa Blend (50 KDH : 50 KNE)'] },
  { username: 'LunaTirsa', password: 'LTBlend', role: 'reseller', companyName: 'Luna Tirsa', allowedBlends: ['Luna Tirsa Blend (50 KDH : 50 KNE)'] },
];

const sellerAccount: UserAccount = {
  username: 'Epicurean Coffee',
  password: 'EPCCOFFEE!',
  role: 'seller',
  companyName: 'Epicurean Coffee Company'
};

const defaultProductsFromSpreadsheet: Product[] = [
  { id: 'GB-1', name: 'Greenbeans Wanoja Avisani S', category: 'Green Beans', pricePerKg: 284000, pricePer500g: 0, pricePer200g: 0, greenBeanCostPerKg: 282500, roastingCostPerKg: 0, packagingCostPerKg: 2500, packagingCostPer500g: 0, packagingCostPer200g: 0, description: 'Greenbeans Wanoja Avisani S (Crop 2026)', isExclusive: false, exclusiveCode: '' },
  { id: 'GB-2', name: 'Greenbeans Wanoja Fullwash', category: 'Green Beans', pricePerKg: 198000, pricePer500g: 0, pricePer200g: 0, greenBeanCostPerKg: 190500, roastingCostPerKg: 0, packagingCostPerKg: 2500, packagingCostPer500g: 0, packagingCostPer200g: 0, description: 'Greenbeans Wanoja Fullwash', isExclusive: false, exclusiveCode: '' },
  { id: 'GB-3', name: 'Greenbeans Wanoja Natural', category: 'Green Beans', pricePerKg: 248000, pricePer500g: 0, pricePer200g: 0, greenBeanCostPerKg: 245500, roastingCostPerKg: 0, packagingCostPerKg: 2500, packagingCostPer500g: 0, packagingCostPer200g: 0, description: 'Greenbeans Wanoja Natural', isExclusive: false, exclusiveCode: '' },
  { id: 'GB-4', name: 'Greenbeans Wanoja MTW', category: 'Green Beans', pricePerKg: 280000, pricePer500g: 0, pricePer200g: 0, greenBeanCostPerKg: 2500, roastingCostPerKg: 0, packagingCostPerKg: 2500, packagingCostPer500g: 0, packagingCostPer200g: 0, description: 'Greenbeans Wanoja MTW', isExclusive: false, exclusiveCode: '' },
  { id: 'GB-5', name: 'Greenbeans Kerinci Fullwash', category: 'Green Beans', pricePerKg: 172000, pricePer500g: 0, pricePer200g: 0, greenBeanCostPerKg: 162722, roastingCostPerKg: 0, packagingCostPerKg: 2500, packagingCostPer500g: 0, packagingCostPer200g: 0, description: 'Greenbeans Kerinci Fullwash', isExclusive: false, exclusiveCode: '' },
  { id: 'GB-6', name: 'Greenbeans Kerinci Natural', category: 'Green Beans', pricePerKg: 190000, pricePer500g: 0, pricePer200g: 0, greenBeanCostPerKg: 177722, roastingCostPerKg: 0, packagingCostPerKg: 2500, packagingCostPer500g: 0, packagingCostPer200g: 0, description: 'Greenbeans Kerinci Natural', isExclusive: false, exclusiveCode: '' },
  { id: 'GB-7', name: 'Greenbeans Kerinci Wethull (Semiwash)', category: 'Green Beans', pricePerKg: 168000, pricePer500g: 0, pricePer200g: 0, greenBeanCostPerKg: 157722, roastingCostPerKg: 0, packagingCostPerKg: 2500, packagingCostPer500g: 0, packagingCostPer200g: 0, description: 'Greenbeans Kerinci Semiwash', isExclusive: false, exclusiveCode: '' },
  { id: 'GB-8', name: 'Greenbeans Kerinci Robusta', category: 'Green Beans', pricePerKg: 92000, pricePer500g: 0, pricePer200g: 0, greenBeanCostPerKg: 87722, roastingCostPerKg: 0, packagingCostPerKg: 2500, packagingCostPer500g: 0, packagingCostPer200g: 0, description: 'Greenbeans Kerinci Robusta', isExclusive: false, exclusiveCode: '' },
  { id: 'GB-9', name: 'Greenbeans Flores Fullwash', category: 'Green Beans', pricePerKg: 195000, pricePer500g: 0, pricePer200g: 0, greenBeanCostPerKg: 182220, roastingCostPerKg: 0, packagingCostPerKg: 2500, packagingCostPer500g: 0, packagingCostPer200g: 0, description: 'Greenbeans Flores Fullwash', isExclusive: false, exclusiveCode: '' },
  { id: 'GB-10', name: 'Greenbeans Bajawa Natural 72 Hours', category: 'Green Beans', pricePerKg: 200000, pricePer500g: 0, pricePer200g: 0, greenBeanCostPerKg: 187500, roastingCostPerKg: 0, packagingCostPerKg: 2500, packagingCostPer500g: 0, packagingCostPer200g: 0, description: 'Greenbeans Bajawa Natural 72 Hours', isExclusive: false, exclusiveCode: '' },
  { id: 'RB-1', name: 'Wanoja Avisani', category: 'Roasted Beans', pricePerKg: 225000, pricePer500g: 0, pricePer200g: 120000, greenBeanCostPerKg: 284000, roastingCostPerKg: 20000, packagingCostPerKg: 7500, packagingCostPer500g: 0, packagingCostPer200g: 9000, description: 'Wanoja Avisani Single Origin Roasted', isExclusive: false, exclusiveCode: '' },
  { id: 'RB-2', name: 'Wanoja Fullwash', category: 'Roasted Beans', pricePerKg: 350000, pricePer500g: 0, pricePer200g: 120000, greenBeanCostPerKg: 193000, roastingCostPerKg: 20000, packagingCostPerKg: 7500, packagingCostPer500g: 0, packagingCostPer200g: 9000, description: 'Wanoja Fullwash Single Origin Roasted', isExclusive: false, exclusiveCode: '' },
  { id: 'RB-3', name: 'Wanoja Natural', category: 'Roasted Beans', pricePerKg: 450000, pricePer500g: 0, pricePer200g: 150000, greenBeanCostPerKg: 243000, roastingCostPerKg: 20000, packagingCostPerKg: 7500, packagingCostPer500g: 0, packagingCostPer200g: 9000, description: 'Wanoja Natural Single Origin Roasted', isExclusive: false, exclusiveCode: '' },
  { id: 'RB-4', name: 'Wanoja MTW', category: 'Roasted Beans', pricePerKg: 496250, pricePer500g: 0, pricePer200g: 0, greenBeanCostPerKg: 280000, roastingCostPerKg: 20000, packagingCostPerKg: 7500, packagingCostPer500g: 0, packagingCostPer200g: 0, description: 'Wanoja MTW Single Origin Roasted', isExclusive: false, exclusiveCode: '' },
  { id: 'RB-5', name: 'Kerinci Fullwash', category: 'Roasted Beans', pricePerKg: 325000, pricePer500g: 0, pricePer200g: 120000, greenBeanCostPerKg: 160222, roastingCostPerKg: 20000, packagingCostPerKg: 7500, packagingCostPer500g: 0, packagingCostPer200g: 9000, description: 'Kerinci Fullwash Single Origin Roasted', isExclusive: false, exclusiveCode: '' },
  { id: 'RB-6', name: 'Kerinci Natural', category: 'Roasted Beans', pricePerKg: 390000, pricePer500g: 0, pricePer200g: 140000, greenBeanCostPerKg: 175222, roastingCostPerKg: 20000, packagingCostPerKg: 7500, packagingCostPer500g: 0, packagingCostPer200g: 9000, description: 'Kerinci Natural Single Origin Roasted', isExclusive: false, exclusiveCode: '' },
  { id: 'RB-7', name: 'Kerinci WH (Semiwash)', category: 'Roasted Beans', pricePerKg: 320000, pricePer500g: 0, pricePer200g: 110000, greenBeanCostPerKg: 155222, roastingCostPerKg: 20000, packagingCostPerKg: 7500, packagingCostPer500g: 0, packagingCostPer200g: 9000, description: 'Kerinci WH Single Origin Roasted', isExclusive: false, exclusiveCode: '' },
  { id: 'RB-8', name: 'Kerinci Robusta', category: 'Roasted Beans', pricePerKg: 170000, pricePer500g: 0, pricePer200g: 100000, greenBeanCostPerKg: 85222, roastingCostPerKg: 20000, packagingCostPerKg: 7500, packagingCostPer500g: 0, packagingCostPer200g: 9000, description: 'Kerinci Robusta Single Origin Roasted', isExclusive: false, exclusiveCode: '' },
  { id: 'RB-9', name: 'Melaka', category: 'Roasted Beans', pricePerKg: 170000, pricePer500g: 0, pricePer200g: 170000, greenBeanCostPerKg: 85222, roastingCostPerKg: 20000, packagingCostPerKg: 7500, packagingCostPer500g: 0, packagingCostPer200g: 9000, description: 'Melaka Single Origin Roasted', isExclusive: false, exclusiveCode: '' },
  { id: 'RB-10', name: 'Bajawa Natural 72 Hours', category: 'Roasted Beans', pricePerKg: 375000, pricePer500g: 0, pricePer200g: 375000, greenBeanCostPerKg: 185000, roastingCostPerKg: 20000, packagingCostPerKg: 7500, packagingCostPer500g: 0, packagingCostPer200g: 9000, description: 'Bajawa Natural 72 Hours Single Origin Roasted', isExclusive: false, exclusiveCode: '' },
  { id: 'BL-1', name: 'Railway Blend (50 KDH : 50 KWH)', category: 'Blend Beans', pricePerKg: 320000, pricePer500g: 0, pricePer200g: 75000, greenBeanCostPerKg: 224653, roastingCostPerKg: 20000, packagingCostPerKg: 7500, packagingCostPer500g: 0, packagingCostPer200g: 3000, description: 'Railway Blend: 50% Roasted KDH + 50% Roasted KWH', isExclusive: true, exclusiveCode: '', allowedResellers: ['RailwayCafe'] },
  { id: 'BL-2', name: 'Astria Blend (60 KDH : 40 Robusta)', category: 'Blend Beans', pricePerKg: 250000, pricePer500g: 0, pricePer200g: 60000, greenBeanCostPerKg: 190278, roastingCostPerKg: 20000, packagingCostPerKg: 7500, packagingCostPer500g: 0, packagingCostPer200g: 3000, description: 'Astria Blend: 60% Roasted KDH + 40% Roasted Robusta', isExclusive: true, exclusiveCode: '', allowedResellers: ['AstriaSolo'] },
  { id: 'BL-3', name: 'Brunswick Blend (50 KDH : 50 BNE)', category: 'Blend Beans', pricePerKg: 285000, pricePer500g: 0, pricePer200g: 68000, greenBeanCostPerKg: 243264, roastingCostPerKg: 20000, packagingCostPerKg: 7500, packagingCostPer500g: 0, packagingCostPer200g: 3000, description: 'Brunswick Blend: 50% Roasted KDH + 50% Roasted Flores', isExclusive: true, exclusiveCode: '', allowedResellers: ['BrunswickCafe'] },
  { id: 'BL-4', name: 'FarmHouse Blend (70 KWH : 30 KNE)', category: 'Blend Beans', pricePerKg: 290000, pricePer500g: 0, pricePer200g: 70000, greenBeanCostPerKg: 229028, roastingCostPerKg: 20000, packagingCostPerKg: 7500, packagingCostPer500g: 0, packagingCostPer200g: 3000, description: 'FarmHouse Blend: 70% Kerinci WH + 30% Kerinci Natural', isExclusive: true, exclusiveCode: '', allowedResellers: [] },
  { id: 'BL-5', name: 'Dago Terrace Blend (70 KDH : 30 Robusta)', category: 'Blend Beans', pricePerKg: 250000, pricePer500g: 0, pricePer200g: 60000, greenBeanCostPerKg: 199653, roastingCostPerKg: 20000, packagingCostPerKg: 7500, packagingCostPer500g: 0, packagingCostPer200g: 3000, description: 'Dago Terrace Blend: 70% Kerinci DH PTP + 30% Kerinci Robusta', isExclusive: true, exclusiveCode: '', allowedResellers: ['DagoTerrace'] },
  { id: 'BL-6', name: 'Foresta Blend (70 KDH : 30 Robusta)', category: 'Blend Beans', pricePerKg: 250000, pricePer500g: 0, pricePer200g: 60000, greenBeanCostPerKg: 201783, roastingCostPerKg: 20000, packagingCostPerKg: 7500, packagingCostPer500g: 0, packagingCostPer200g: 3000, description: 'Foresta Blend: 70% Kerinci DH PTP + 30% Kerinci Robusta', isExclusive: true, exclusiveCode: '', allowedResellers: ['GreensCafe'] },
  { id: 'BL-7', name: 'Blend Tigris (70 Robusta : 30 KDH)', category: 'Blend Beans', pricePerKg: 210000, pricePer500g: 0, pricePer200g: 50000, greenBeanCostPerKg: 162153, roastingCostPerKg: 20000, packagingCostPerKg: 7500, packagingCostPer500g: 0, packagingCostPer200g: 3000, description: 'Blend Tigris: 70% Kerinci Robusta + 30% Roasted KDH PTP', isExclusive: true, exclusiveCode: '', allowedResellers: ['GreensCafe'] },
  { id: 'BL-8', name: 'Blend K50 (50 KDH : 50 Robusta)', category: 'Blend Beans', pricePerKg: 225000, pricePer500g: 0, pricePer200g: 55000, greenBeanCostPerKg: 158264, roastingCostPerKg: 20000, packagingCostPerKg: 7500, packagingCostPer500g: 0, packagingCostPer200g: 3000, description: 'Blend K50: 50% Kerinci Robusta + 50% Roasted KDH PTP', isExclusive: true, exclusiveCode: '', allowedResellers: ['NaraPark'] },
  { id: 'BL-9', name: 'Blend 60:40 (60 KDH : 40 Robusta)', category: 'Blend Beans', pricePerKg: 240000, pricePer500g: 0, pricePer200g: 58000, greenBeanCostPerKg: 190278, roastingCostPerKg: 20000, packagingCostPerKg: 7500, packagingCostPer500g: 0, packagingCostPer200g: 3000, description: 'Blend 60:40: 60% Roasted KDH PTP + 40% Kerinci Robusta', isExclusive: true, exclusiveCode: '', allowedResellers: [] },
  { id: 'BL-10', name: 'Luna Tirsa Blend (50 KDH : 50 KNE)', category: 'Blend Beans', pricePerKg: 325000, pricePer500g: 0, pricePer200g: 78000, greenBeanCostPerKg: 237153, roastingCostPerKg: 20000, packagingCostPerKg: 7500, packagingCostPer500g: 0, packagingCostPer200g: 3000, description: 'Luna Tirsa Blend: 50% Roasted KDH + 50% Kerinci Natural', isExclusive: true, exclusiveCode: '', allowedResellers: ['Sasson', 'LunaTirsa'] }
];

const calculateOrderSchedule = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();

  let roastingDate = new Date(today);
  let shippingDate = new Date(today);

  if (dayOfWeek === 1 || dayOfWeek === 2) {
    const daysUntilRab = 3 - dayOfWeek;
    roastingDate.setDate(today.getDate() + daysUntilRab);
    
    const daysUntilNextSen = 8 - dayOfWeek;
    shippingDate.setDate(today.getDate() + daysUntilNextSen);
  } else {
    const daysUntilNextRab = (3 - dayOfWeek + 7) % 7 || 7;
    roastingDate.setDate(today.getDate() + daysUntilNextRab);

    const daysUntilNextSen = (1 - dayOfWeek + 14) % 7 + 7;
    shippingDate.setDate(today.getDate() + daysUntilNextSen);
  }

  const opt: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
  return {
    roasting: roastingDate.toLocaleDateString('id-ID', opt),
    shipping: shippingDate.toLocaleDateString('id-ID', opt)
  };
};

export default function EpicureanApp() {
  const [currentStep, setCurrentStep] = useState<'welcome' | 'auth' | 'main'>('welcome');
  const [selectedRole, setSelectedRole] = useState<'pembeli' | 'reseller' | 'seller'>('pembeli');
  
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [sellerSubTab, setSellerSubTab] = useState<'orders' | 'products' | 'recap'>('orders');

  const [authForm, setAuthForm] = useState({ username: '', password: '', companyName: '' });
  const [authError, setAuthError] = useState('');

  const [activeCatalogTab, setActiveCatalogTab] = useState<'all' | 'Green Beans' | 'Roasted Beans' | 'Blend Beans'>('all');

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  const scheduleInfo = calculateOrderSchedule();

  const formatSupabaseProducts = (rawData: any[]): Product[] => {
    return rawData.map(item => ({
      id: item.id,
      name: item.name,
      category: item.category,
      pricePerKg: Number(item.price_per_kg || 0),
      pricePer500g: Number(item.price_per_500g || 0),
      pricePer200g: Number(item.price_per_200g || 0),
      greenBeanCostPerKg: Number(item.green_bean_cost_per_kg || 0),
      roastingCostPerKg: Number(item.roasting_cost_per_kg || 0),
      packagingCostPerKg: Number(item.packaging_cost_per_kg || 0),
      packagingCostPer500g: Number(item.packaging_cost_per_500g || 0),
      packagingCostPer200g: Number(item.packaging_cost_per_200g || 0),
      description: item.description || '',
      isExclusive: Boolean(item.is_exclusive || false),
      exclusiveCode: (item.exclusive_code || '').toUpperCase().trim(),
      allowedResellers: item.allowed_resellers || []
    }));
  };

  const fetchProducts = async () => {
    const { data, error } = await supabase.from('products').select('*');
    if (error || !data || data.length < defaultProductsFromSpreadsheet.length) {
      for (const prod of defaultProductsFromSpreadsheet) {
        await supabase.from('products').upsert({
          id: prod.id,
          name: prod.name,
          category: prod.category,
          price_per_kg: prod.pricePerKg,
          price_per_500g: prod.pricePer500g,
          price_per_200g: prod.pricePer200g,
          green_bean_cost_per_kg: prod.greenBeanCostPerKg,
          roasting_cost_per_kg: prod.roastingCostPerKg,
          packaging_cost_per_kg: prod.packagingCostPerKg,
          packaging_cost_per_500g: prod.packagingCostPer500g,
          packaging_cost_per_200g: prod.packagingCostPer200g,
          description: prod.description,
          is_exclusive: prod.isExclusive,
          exclusive_code: prod.exclusiveCode,
          allowed_resellers: prod.allowedResellers || []
        });
      }
      const { data: updatedData } = await supabase.from('products').select('*');
      if (updatedData) setProducts(formatSupabaseProducts(updatedData));
      else setProducts(defaultProductsFromSpreadsheet);
    } else {
      setProducts(formatSupabaseProducts(data));
    }
  };

  const fetchOrders = async () => {
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching orders:', error);
    } else if (data) {
      const formatted: Order[] = data.map(item => ({
        id: item.id,
        customerType: item.customer_type,
        customerName: item.customer_name,
        companyName: item.company_name,
        customerPhone: item.customer_phone,
        destinationArea: item.destination_area,
        shippingAddress: item.shipping_address,
        shippingMethod: item.shipping_method,
        shippingCost: Number(item.shipping_cost || 0),
        paymentMethod: item.payment_method,
        paymentProof: item.payment_proof,
        items: item.items || [],
        subtotal: Number(item.subtotal || 0),
        totalAmount: Number(item.total_amount || 0),
        status: item.status,
        dueDate: item.due_date,
        estimatedRoastingDate: item.estimated_roasting_date,
        estimatedShippingDate: item.estimated_shipping_date,
        createdAt: item.created_at
      }));
      setOrders(formatted);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchProducts(), fetchOrders()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const filteredProducts = products.filter(p => {
    if (activeCatalogTab !== 'all' && p.category !== activeCatalogTab) return false;
    if (currentUser?.role === 'seller') return true;
    if (currentUser?.role === 'reseller') {
      if (!p.isExclusive) return true;
      if (currentUser.allowedBlends && currentUser.allowedBlends.includes(p.name)) return true;
      if (p.allowedResellers && p.allowedResellers.includes(currentUser.username)) return true;
      return false;
    }
    return !p.isExclusive;
  });

  const [cart, setCart] = useState<OrderItem[]>([]);
  const [customerType, setCustomerType] = useState<'perorangan' | 'cafe'>('cafe');
  const [destination, setDestination] = useState<'bandung' | 'luar_bandung'>('bandung');
  const [paymentMethod, setPaymentMethod] = useState<'transfer' | 'kontra_bon_15' | 'kontra_bon_30'>('transfer');
  const [customerInfo, setCustomerInfo] = useState({ name: '', company: '', address: '', phone: '' });

  const totalCartWeightKg = cart.reduce((acc, item) => acc + ((item.quantityGram * item.quantity) / 1000), 0);
  const totalCartUnits = cart.reduce((acc, item) => acc + item.quantity, 0);
  const jneRatePerKg = 18000;
  const shippingCost = destination === 'bandung' ? 0 : Math.ceil(totalCartWeightKg) * jneRatePerKg;
  const cartSubtotal = cart.reduce((acc, item) => acc + item.totalPrice, 0);
  const grandTotal = cartSubtotal + shippingCost;

  const [currentActiveOrder, setCurrentActiveOrder] = useState<Order | null>(null);

  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Roasted Beans' as Product['category'],
    pricePerKg: 200000,
    pricePer500g: 0,
    pricePer200g: 100000,
    greenBeanCostPerKg: 100000,
    roastingCostPerKg: 20000,
    packagingCostPerKg: 7500,
    packagingCostPer500g: 5000,
    packagingCostPer200g: 3000,
    description: '',
    isExclusive: false,
    exclusiveCode: ''
  });

  const handleRoleSelection = (role: 'pembeli' | 'reseller' | 'seller') => {
    setSelectedRole(role);
    setAuthError('');
    setAuthForm({ username: '', password: '', companyName: '' });
    setCurrentStep('auth');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (selectedRole === 'seller') {
      if (authForm.username === sellerAccount.username && authForm.password === sellerAccount.password) {
        setCurrentUser(sellerAccount);
        setCurrentStep('main');
      } else {
        setAuthError('Username atau Password Seller salah!');
      }
    } else if (selectedRole === 'reseller') {
      const foundReseller = presetResellerAccounts.find(
        r => r.username.toLowerCase() === authForm.username.trim().toLowerCase() && r.password === authForm.password
      );
      if (foundReseller) {
        setCurrentUser(foundReseller);
        setCustomerInfo(prev => ({ ...prev, company: foundReseller.companyName || '', name: foundReseller.username }));
        setCurrentStep('main');
      } else {
        setAuthError('Username atau Password Reseller tidak ditemukan!');
      }
    } else {
      if (!authForm.username.trim()) {
        setAuthError('Ketik nama atau username Anda.');
        return;
      }
      const buyerUser: UserAccount = {
        username: authForm.username.trim(),
        role: 'pembeli',
        companyName: authForm.companyName || 'Pembeli Perorangan'
      };
      setCurrentUser(buyerUser);
      setCustomerInfo(prev => ({ ...prev, name: buyerUser.username, company: buyerUser.companyName || '' }));
      setCurrentStep('main');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentStep('welcome');
    setCart([]);
  };

  const addProductToCart = (prod: Product, packType: '1kg' | '500g' | '200g', deltaQty: number = 1) => {
    let weightGram = 1000;
    let unitPrice = prod.pricePerKg || 200000;
    let packLabel = '1 Kg';

    if (packType === '500g') {
      weightGram = 500;
      unitPrice = prod.pricePer500g || 100000;
      packLabel = '500 Gram';
    } else if (packType === '200g') {
      weightGram = 200;
      unitPrice = prod.pricePer200g || 50000;
      packLabel = '200 Gram';
    }

    const itemUniqueKey = `${prod.id}-${packType}`;
    const existingIndex = cart.findIndex(i => i.id === itemUniqueKey);

    if (existingIndex > -1) {
      const updatedCart = [...cart];
      const newQty = updatedCart[existingIndex].quantity + deltaQty;
      if (newQty <= 0) {
        setCart(cart.filter(i => i.id !== itemUniqueKey));
      } else {
        updatedCart[existingIndex].quantity = newQty;
        updatedCart[existingIndex].totalPrice = newQty * unitPrice;
        setCart(updatedCart);
      }
    } else if (deltaQty > 0) {
      const newItem: OrderItem = {
        id: itemUniqueKey,
        productId: prod.id,
        name: `${prod.name} (${packLabel})`,
        quantityGram: weightGram,
        unitPrice: unitPrice,
        quantity: deltaQty,
        totalPrice: unitPrice * deltaQty,
        packType: packType
      };
      setCart([...cart, newItem]);
    }
  };

  const updateCartQuantity = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      setCart(cart.filter(i => i.id !== itemId));
      return;
    }
    setCart(cart.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          quantity: newQty,
          totalPrice: item.unitPrice * newQty
        };
      }
      return item;
    }));
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const today = new Date();
    let dueDateStr = '';
    if (customerType === 'cafe') {
      if (paymentMethod === 'kontra_bon_15') {
        const due = new Date(today); due.setDate(due.getDate() + 15);
        dueDateStr = due.toISOString().split('T')[0];
      } else if (paymentMethod === 'kontra_bon_30') {
        const due = new Date(today); due.setDate(due.getDate() + 30);
        dueDateStr = due.toISOString().split('T')[0];
      }
    }

    const newOrder: Order = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      customerType: customerType,
      customerName: customerInfo.name || currentUser?.username || 'Buyer',
      companyName: customerType === 'cafe' ? (customerInfo.company || currentUser?.companyName || 'Cafe') : 'Pembeli Perorangan',
      customerPhone: customerInfo.phone,
      destinationArea: destination,
      shippingAddress: customerInfo.address,
      shippingMethod: destination === 'bandung' ? 'DIRECT BANDUNG' : 'JNE REG',
      shippingCost: shippingCost,
      paymentMethod: customerType === 'perorangan' ? 'transfer' : paymentMethod,
      items: cart,
      subtotal: cartSubtotal,
      totalAmount: grandTotal,
      status: 'Pending Approval',
      dueDate: dueDateStr || undefined,
      estimatedRoastingDate: scheduleInfo.roasting,
      estimatedShippingDate: scheduleInfo.shipping,
      createdAt: today.toISOString().split('T')[0]
    };

    const { error } = await supabase.from('orders').insert({
      id: newOrder.id,
      customer_type: newOrder.customerType,
      customer_name: newOrder.customerName,
      company_name: newOrder.companyName,
      customer_phone: newOrder.customerPhone,
      destination_area: newOrder.destinationArea,
      shipping_address: newOrder.shippingAddress,
      shipping_method: newOrder.shippingMethod,
      shipping_cost: newOrder.shippingCost,
      payment_method: newOrder.paymentMethod,
      items: newOrder.items,
      subtotal: newOrder.subtotal,
      total_amount: newOrder.totalAmount,
      status: newOrder.status,
      due_date: newOrder.dueDate,
      estimated_roasting_date: newOrder.estimatedRoastingDate,
      estimated_shipping_date: newOrder.estimatedShippingDate,
      created_at: newOrder.createdAt
    });

    if (error) {
      alert('Gagal mengirim order ke server: ' + error.message);
    } else {
      setCurrentActiveOrder(newOrder);
      setCart([]);
      fetchOrders();
    }
  };

  const generateWhatsAppLink = (order: Order, targetPhone: string) => {
    let text = `*PRE-ORDER B2B EPICUREAN.id*\n`;
    text += `------------------------------------\n`;
    text += `*ID Order:* ${order.id}\n`;
    text += `*Pemesan:* ${order.customerName} (${order.companyName})\n`;
    text += `*Role Account:* ${currentUser?.role.toUpperCase()}\n`;
    text += `*Metode Bayar:* ${order.paymentMethod.replace('_', ' ').toUpperCase()}\n`;
    text += `------------------------------------\n`;
    text += `*JADWAL PRODUKSI & PENGIRIMAN:*\n`;
    text += `🔥 *Estimasi Roasting:* ${order.estimatedRoastingDate || scheduleInfo.roasting}\n`;
    text += `🚚 *Estimasi Shipping:* ${order.estimatedShippingDate || scheduleInfo.shipping}\n`;
    text += `------------------------------------\n`;
    text += `*Rincian Pesanan:*\n`;
    order.items.forEach(item => {
      text += `- ${item.name} x ${item.quantity} : Rp ${item.totalPrice.toLocaleString('id-ID')}\n`;
    });
    text += `------------------------------------\n`;
    text += `*Ongkir (${order.shippingMethod}):* Rp ${order.shippingCost.toLocaleString('id-ID')}\n`;
    text += `*TOTAL TAGIHAN:* Rp ${order.totalAmount.toLocaleString('id-ID')}\n\n`;
    text += `Mohon diproses untuk pengiriman ke alamat:\n${order.shippingAddress}`;

    return `https://wa.me/${targetPhone}?text=${encodeURIComponent(text)}`;
  };

  const handleOpenEditModal = (prod: Product) => {
    setEditingProduct({ ...prod });
    setIsEditModalOpen(true);
  };

  const handleSaveEditedProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const { error } = await supabase.from('products').update({
      name: editingProduct.name,
      category: editingProduct.category,
      price_per_kg: editingProduct.pricePerKg,
      price_per_200g: editingProduct.pricePer200g,
      green_bean_cost_per_kg: editingProduct.greenBeanCostPerKg,
      description: editingProduct.description,
      is_exclusive: editingProduct.isExclusive
    }).eq('id', editingProduct.id);

    if (error) {
      alert('Gagal mengedit produk: ' + error.message);
    } else {
      setIsEditModalOpen(false);
      setEditingProduct(null);
      fetchProducts();
      alert('Produk berhasil diperbarui!');
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `P-${Date.now()}`;

    const { error } = await supabase.from('products').insert({
      id: newId,
      name: productForm.name,
      category: productForm.category,
      price_per_kg: productForm.pricePerKg,
      price_per_500g: productForm.pricePer500g,
      price_per_200g: productForm.pricePer200g,
      green_bean_cost_per_kg: productForm.greenBeanCostPerKg,
      roasting_cost_per_kg: productForm.roastingCostPerKg,
      packaging_cost_per_kg: productForm.packagingCostPerKg,
      packaging_cost_per_500g: productForm.packagingCostPer500g,
      packaging_cost_per_200g: productForm.packagingCostPer200g,
      description: productForm.description,
      is_exclusive: productForm.isExclusive
    });

    if (error) {
      alert('Gagal menyimpan produk: ' + error.message);
    } else {
      fetchProducts();
      setProductForm({
        name: '',
        category: 'Roasted Beans',
        pricePerKg: 200000,
        pricePer500g: 0,
        pricePer200g: 100000,
        greenBeanCostPerKg: 100000,
        roastingCostPerKg: 20000,
        packagingCostPerKg: 7500,
        packagingCostPer500g: 5000,
        packagingCostPer200g: 3000,
        description: '',
        isExclusive: false,
        exclusiveCode: ''
      });
      alert('Produk baru berhasil disimpan ke database!');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) alert('Gagal menghapus produk: ' + error.message);
    else fetchProducts();
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
    if (error) alert('Gagal mengubah status order: ' + error.message);
    else fetchOrders();
  };

  const totalOmzet = orders.filter(o => o.status !== 'Rejected').reduce((acc, o) => acc + o.totalAmount, 0);

  // STEP 1: WELCOME SCREEN
  if (currentStep === 'welcome') {
    return (
      <div className="min-h-screen bg-black text-[#E8E2D5] font-serif flex flex-col items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center space-y-8 py-12 px-6 border border-[#2B261F] rounded-3xl bg-[#080808] shadow-2xl">
          <div className="text-[#D4AF37] flex justify-center">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M12 22C12 22 20 18 20 12C20 6 12 2 12 2C12 2 4 6 4 12C4 18 12 22 12 22Z" />
              <path d="M12 22V10" />
              <path d="M12 10C12 10 16 8 18 10" />
              <path d="M12 14C12 14 8 12 6 14" />
            </svg>
          </div>

          <div>
            <h1 className="text-3xl sm:text-5xl tracking-widest text-[#D4AF37] uppercase font-normal">
              EPICUREAN
            </h1>
            <p className="text-sm italic text-[#A69C83] tracking-widest mt-1">Coffee Company</p>
            <p className="text-xs italic text-[#776E5E] mt-4 tracking-wider">
              Website Orders Coffee Beans Official From Epicurean
            </p>
          </div>

          <h2 className="text-xl tracking-widest text-[#E5D7B8] font-bold uppercase pt-4 border-t border-[#1F1C18]">
            SELAMAT DATANG!
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <button
              onClick={() => handleRoleSelection('pembeli')}
              className="bg-[#14120F] hover:bg-[#D4AF37] hover:text-black border border-[#A69C83] rounded-2xl p-6 text-center transition-all duration-300 shadow-lg group"
            >
              <User className="h-6 w-6 text-[#D4AF37] group-hover:text-black mx-auto mb-3" />
              <span className="text-sm font-bold font-serif tracking-wide block">Saya Pembeli</span>
            </button>

            <button
              onClick={() => handleRoleSelection('reseller')}
              className="bg-[#14120F] hover:bg-[#D4AF37] hover:text-black border border-[#A69C83] rounded-2xl p-6 text-center transition-all duration-300 shadow-lg group"
            >
              <Tag className="h-6 w-6 text-[#D4AF37] group-hover:text-black mx-auto mb-3" />
              <span className="text-sm font-bold font-serif tracking-wide block">Saya Reseller</span>
            </button>

            <button
              onClick={() => handleRoleSelection('seller')}
              className="bg-[#14120F] hover:bg-[#D4AF37] hover:text-black border border-[#A69C83] rounded-2xl p-6 text-center transition-all duration-300 shadow-lg group"
            >
              <ShieldCheck className="h-6 w-6 text-[#D4AF37] group-hover:text-black mx-auto mb-3" />
              <span className="text-sm font-bold font-serif tracking-wide block">Saya Seller</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // STEP 2: AUTH SCREEN
  if (currentStep === 'auth') {
    return (
      <div className="min-h-screen bg-black text-[#E8E2D5] font-serif flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#080808] border border-[#2B261F] rounded-3xl p-8 space-y-6 shadow-2xl">
          <button
            onClick={() => setCurrentStep('welcome')}
            className="text-xs italic text-[#A69C83] hover:text-[#D4AF37] flex items-center space-x-1"
          >
            ← Kembali ke Pilihan
          </button>

          <div className="text-center space-y-2">
            <h2 className="text-xl font-serif text-[#D4AF37] uppercase tracking-wider">
              Log In - {selectedRole.toUpperCase()}
            </h2>
            <p className="text-xs italic text-[#A69C83]">
              {selectedRole === 'seller' && 'Masukkan kredensial akun seller roastery resmi.'}
              {selectedRole === 'reseller' && 'Masukkan Username Cafe & Password Reseller khusus.'}
              {selectedRole === 'pembeli' && 'Masukkan Nama / Username untuk melanjutkan belanja.'}
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs italic">
            <div>
              <label className="block text-[#A69C83] mb-1">
                {selectedRole === 'pembeli' ? 'Nama Pemesan / Username *' : 'Username *'}
              </label>
              <input
                type="text"
                required
                placeholder={selectedRole === 'reseller' ? 'Contoh: BrunswickCafe' : 'Ketik username...'}
                value={authForm.username}
                onChange={(e) => setAuthForm({ ...authForm, username: e.target.value })}
                className="w-full bg-[#14120F] border border-[#2B261F] rounded-xl px-4 py-3 text-[#E5D7B8] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            {selectedRole !== 'pembeli' && (
              <div>
                <label className="block text-[#A69C83] mb-1">Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Ketik password..."
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  className="w-full bg-[#14120F] border border-[#2B261F] rounded-xl px-4 py-3 text-[#E5D7B8] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            )}

            {selectedRole === 'pembeli' && (
              <div>
                <label className="block text-[#A69C83] mb-1">Nama Cafe / Perusahaan (Opsional)</label>
                <input
                  type="text"
                  placeholder="Contoh: Kopi Kita Cafe"
                  value={authForm.companyName}
                  onChange={(e) => setAuthForm({ ...authForm, companyName: e.target.value })}
                  className="w-full bg-[#14120F] border border-[#2B261F] rounded-xl px-4 py-3 text-[#E5D7B8] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            )}

            {authError && (
              <p className="text-xs text-rose-500 italic text-center font-bold">{authError}</p>
            )}

            <button
              type="submit"
              className="w-full bg-[#E5D7B8] hover:bg-[#D4AF37] text-[#111111] font-serif font-bold py-3 rounded-xl transition-all shadow-md mt-2 flex items-center justify-center space-x-2"
            >
              <span>Masuk Beranda</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // STEP 3: MAIN APP
  return (
    <div className="min-h-screen bg-[#111111] text-[#E8E2D5] font-serif antialiased selection:bg-[#D4AF37] selection:text-black pb-24">
      {/* HEADER VINTAGE */}
      <header className="p-4 sm:p-6 max-w-7xl mx-auto">
        <div className="bg-[#0A0A0A] border border-[#2B261F] rounded-2xl px-6 py-4 flex flex-col sm:flex-row items-center justify-between shadow-2xl gap-4">
          <div className="flex items-center space-x-4 border-b sm:border-b-0 sm:border-r border-[#2B261F] pb-3 sm:pb-0 sm:pr-6">
            <div className="text-[#D4AF37]">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2L15 8L21 9L16.5 14L18 20L12 17L6 20L7.5 14L3 9L9 8L12 2Z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-normal tracking-wider text-[#D4AF37] uppercase font-serif">
                EPICUREAN
              </h1>
              <p className="text-[10px] text-[#A69C83] italic tracking-widest font-sans">Coffee Company</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {currentUser?.role !== 'seller' && (
              <button
                onClick={() => setIsCartDrawerOpen(true)}
                className="relative bg-[#14120F] border border-[#2B261F] px-4 py-2 rounded-full flex items-center space-x-2 hover:border-[#D4AF37] transition-all"
              >
                <ShoppingCart className="h-4 w-4 text-[#D4AF37]" />
                <span className="text-xs italic text-[#E5D7B8]">Keranjang</span>
                {totalCartUnits > 0 && (
                  <span className="bg-[#D4AF37] text-black font-bold text-[10px] rounded-full px-1.5 py-0.2">
                    {totalCartUnits}
                  </span>
                )}
              </button>
            )}

            <div className="flex items-center space-x-3 bg-[#14120F] border border-[#2B261F] px-4 py-2 rounded-full">
              <div className="text-right text-xs italic">
                <p className="text-[#E5D7B8] font-bold">{currentUser?.username}</p>
                <p className="text-[10px] text-[#D4AF37] uppercase tracking-wider">{currentUser?.role}</p>
              </div>
              <button
                onClick={handleLogout}
                title="Logout"
                className="p-1.5 bg-[#0A0A0A] border border-[#2B261F] rounded-full text-[#A69C83] hover:text-rose-400 transition-all"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {currentUser?.role !== 'seller' ? (
          /* STOREFRONT (PEMBELI / RESELLER) */
          <div className="space-y-10">
            <div className="text-center py-4 px-4 space-y-2">
              <h1 className="text-3xl sm:text-5xl font-normal tracking-wide text-[#E5D7B8] uppercase drop-shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                EPICUREAN
              </h1>
              <p className="text-base italic text-[#D4AF37] font-serif tracking-widest">
                Coffee Company Catalog
              </p>
            </div>

            {/* BANNER INFORMASI JADWAL ROASTING & SHIPPING UNTUK PEMBELI */}
            <div className="bg-[#0A0A0A] border border-[#2B261F] rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center space-x-2 border-b border-[#2B261F] pb-3">
                <Calendar className="h-5 w-5 text-[#D4AF37]" />
                <h3 className="text-base font-serif italic text-[#E5D7B8]">Jadwal Rutin Produksi & Pengiriman Roastery</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs italic">
                <div className="bg-[#14120F] border border-rose-900/60 p-4 rounded-2xl space-y-1">
                  <div className="flex items-center space-x-2 text-rose-400 font-bold">
                    <Clock className="h-4 w-4" />
                    <span>Last Order (Cut-Off): SELASA</span>
                  </div>
                  <p className="text-[#A69C83] text-[11px]">Batas pemesanan minggu ini ditutup setiap hari Selasa.</p>
                </div>

                <div className="bg-[#14120F] border border-emerald-900/60 p-4 rounded-2xl space-y-1">
                  <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                    <Coffee className="h-4 w-4" />
                    <span>Jadwal Roasting: RABU - KAMIS</span>
                  </div>
                  <p className="text-[#A69C83] text-[11px]">Proses Sangrai Biji Kopi Fresh Roasting setiap hari Rabu & Kamis.</p>
                </div>

                <div className="bg-[#14120F] border border-sky-900/60 p-4 rounded-2xl space-y-1">
                  <div className="flex items-center space-x-2 text-sky-400 font-bold">
                    <Truck className="h-4 w-4" />
                    <span>Pengiriman: SENIN - SELASA</span>
                  </div>
                  <p className="text-[#A69C83] text-[11px]">Pengiriman pesanan dilakukan pada hari Senin & Selasa minggu depannya.</p>
                </div>
              </div>

              <div className="bg-[#14120F] border border-[#2B261F] p-3.5 rounded-2xl text-xs italic text-center text-[#E5D7B8]">
                ⚠️ <em>Catatan: Pesanan yang masuk antara hari <strong>Rabu - Minggu</strong> akan diproses & di-roasting pada siklus batch minggu berikutnya.</em>
              </div>
            </div>

            {/* TAB SHORTLIST KATEGORI COFFEE BEANS */}
            <section className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-center border-b border-[#2B261F] pb-4 gap-4">
                <h2 className="text-lg font-serif italic text-[#E5D7B8]">Katalog Produk Coffee Beans</h2>
                
                <div className="flex items-center space-x-2 bg-[#0A0A0A] border border-[#2B261F] p-1 rounded-full">
                  <button
                    onClick={() => setActiveCatalogTab('all')}
                    className={`px-4 py-1.5 rounded-full text-xs italic transition-all ${
                      activeCatalogTab === 'all' ? 'bg-[#E5D7B8] text-black font-bold' : 'text-[#A69C83] hover:text-white'
                    }`}
                  >
                    Semua
                  </button>
                  <button
                    onClick={() => setActiveCatalogTab('Green Beans')}
                    className={`px-4 py-1.5 rounded-full text-xs italic transition-all ${
                      activeCatalogTab === 'Green Beans' ? 'bg-[#E5D7B8] text-black font-bold' : 'text-[#A69C83] hover:text-white'
                    }`}
                  >
                    Green Beans
                  </button>
                  <button
                    onClick={() => setActiveCatalogTab('Roasted Beans')}
                    className={`px-4 py-1.5 rounded-full text-xs italic transition-all ${
                      activeCatalogTab === 'Roasted Beans' ? 'bg-[#E5D7B8] text-black font-bold' : 'text-[#A69C83] hover:text-white'
                    }`}
                  >
                    Roasted Beans
                  </button>
                  <button
                    onClick={() => setActiveCatalogTab('Blend Beans')}
                    className={`px-4 py-1.5 rounded-full text-xs italic transition-all ${
                      activeCatalogTab === 'Blend Beans' ? 'bg-[#E5D7B8] text-black font-bold' : 'text-[#A69C83] hover:text-white'
                    }`}
                  >
                    House Blend
                  </button>
                </div>
              </div>

              {filteredProducts.length === 0 ? (
                <p className="text-xs text-[#A69C83] italic text-center py-12">
                  Tidak ada produk dalam kategori ini yang tersedia untuk akun Anda.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {filteredProducts.map((p) => {
                    const has1kg = (p.pricePerKg || 0) > 0;
                    const has200g = (p.pricePer200g || 0) > 0;

                    const cartItem1kg = cart.find(i => i.id === `${p.id}-1kg`);
                    const cartItem200g = cart.find(i => i.id === `${p.id}-200g`);

                    return (
                      <div key={p.id} className={`bg-[#0A0A0A] border rounded-2xl p-5 flex flex-col justify-between shadow-xl relative ${
                        p.isExclusive ? 'border-purple-900/80 bg-purple-950/10' : 'border-[#2B261F]'
                      }`}>
                        <div>
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] italic font-serif px-3 py-0.5 rounded-full border border-[#2B261F] text-[#D4AF37]">
                              {p.category}
                            </span>
                            {p.isExclusive && (
                              <span className="text-[10px] text-purple-300 font-serif italic flex items-center space-x-1">
                                <Lock className="h-3 w-3" />
                                <span>VIP Blend</span>
                              </span>
                            )}
                          </div>

                          <h3 className="text-base font-serif text-[#E5D7B8] mt-3">{p.name}</h3>
                          <p className="text-xs text-[#A69C83] italic mt-1 line-clamp-2">{p.description}</p>
                          
                          <div className="mt-4 space-y-1.5 bg-[#14120F] p-3 rounded-xl border border-[#2B261F] text-xs italic">
                            {has1kg && (
                              <div className="flex justify-between text-[#A69C83]">
                                <span>Harga 1 Kg:</span>
                                <span className="text-[#D4AF37] font-bold">Rp {p.pricePerKg.toLocaleString('id-ID')}</span>
                              </div>
                            )}
                            {has200g ? (
                              <div className="flex justify-between text-[#A69C83]">
                                <span>Harga 200 Gram:</span>
                                <span className="text-[#D4AF37] font-bold">Rp {p.pricePer200g.toLocaleString('id-ID')}</span>
                              </div>
                            ) : (
                              <div className="flex justify-between text-[11px] text-rose-400/80">
                                <span>Harga 200 Gram:</span>
                                <span>N/A</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* TOMBOL PENGATUR KUANTITAS DI KARTU PRODUK */}
                        <div className="space-y-2 mt-5">
                          {has200g && (
                            <div className="flex items-center justify-between bg-[#14120F] border border-[#2B261F] p-2 rounded-xl text-xs italic">
                              <span className="text-[#A69C83]">Kemasan 200g:</span>
                              {cartItem200g ? (
                                <div className="flex items-center space-x-1 bg-[#0A0A0A] border border-[#2B261F] px-2 py-1 rounded-lg">
                                  <button onClick={() => addProductToCart(p, '200g', -1)} className="p-1 text-[#A69C83] hover:text-rose-400">
                                    <Minus className="h-3 w-3" />
                                  </button>
                                  <input
                                    type="number"
                                    min={1}
                                    value={cartItem200g.quantity}
                                    onChange={(e) => updateCartQuantity(cartItem200g.id, parseInt(e.target.value) || 0)}
                                    className="w-10 text-center bg-transparent text-[#E5D7B8] font-bold text-xs focus:outline-none"
                                  />
                                  <button onClick={() => addProductToCart(p, '200g', 1)} className="p-1 text-[#A69C83] hover:text-emerald-400">
                                    <Plus className="h-3 w-3" />
                                  </button>
                                </div>
                              ) : (
                                <button onClick={() => addProductToCart(p, '200g', 1)} className="bg-[#14120F] hover:bg-[#2B261F] text-[#E5D7B8] text-[11px] px-3 py-1.5 rounded-lg border border-[#2B261F]">
                                  + 200g
                                </button>
                              )}
                            </div>
                          )}

                          {has1kg && (
                            <div className="flex items-center justify-between bg-[#14120F] border border-[#2B261F] p-2 rounded-xl text-xs italic">
                              <span className="text-[#A69C83]">Kemasan 1 Kg:</span>
                              {cartItem1kg ? (
                                <div className="flex items-center space-x-1 bg-[#0A0A0A] border border-[#2B261F] px-2 py-1 rounded-lg">
                                  <button onClick={() => addProductToCart(p, '1kg', -1)} className="p-1 text-[#A69C83] hover:text-rose-400">
                                    <Minus className="h-3 w-3" />
                                  </button>
                                  <input
                                    type="number"
                                    min={1}
                                    value={cartItem1kg.quantity}
                                    onChange={(e) => updateCartQuantity(cartItem1kg.id, parseInt(e.target.value) || 0)}
                                    className="w-10 text-center bg-transparent text-[#E5D7B8] font-bold text-xs focus:outline-none"
                                  />
                                  <button onClick={() => addProductToCart(p, '1kg', 1)} className="p-1 text-[#A69C83] hover:text-emerald-400">
                                    <Plus className="h-3 w-3" />
                                  </button>
                                </div>
                              ) : (
                                <button onClick={() => addProductToCart(p, '1kg', 1)} className="bg-[#E5D7B8] hover:bg-[#D4AF37] text-[#111111] font-bold text-[11px] px-3 py-1.5 rounded-lg">
                                  + 1 Kg
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        ) : (
          /* DASHBOARD SELLER ADMIN LENGKAP */
          <div className="space-y-8">
            <div className="bg-[#0A0A0A] border border-[#2B261F] p-6 rounded-3xl flex flex-col sm:flex-row justify-between items-center gap-4">
              <h1 className="text-xl font-serif italic text-[#E5D7B8]">Epicurean Roastery Manager</h1>
              
              <div className="flex space-x-2 bg-[#14120F] border border-[#2B261F] p-1 rounded-2xl">
                <button
                  onClick={() => setSellerSubTab('orders')}
                  className={`px-4 py-2 rounded-xl text-xs italic font-serif flex items-center space-x-1.5 ${
                    sellerSubTab === 'orders' ? 'bg-[#E5D7B8] text-[#111111] font-bold shadow-md' : 'text-[#A69C83] hover:text-[#E5D7B8]'
                  }`}
                >
                  <Package className="h-3.5 w-3.5" />
                  <span>Orders ({orders.length})</span>
                </button>
                <button
                  onClick={() => setSellerSubTab('products')}
                  className={`px-4 py-2 rounded-xl text-xs italic font-serif flex items-center space-x-1.5 ${
                    sellerSubTab === 'products' ? 'bg-[#E5D7B8] text-[#111111] font-bold shadow-md' : 'text-[#A69C83] hover:text-[#E5D7B8]'
                  }`}
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Products & COGS</span>
                </button>
                <button
                  onClick={() => setSellerSubTab('recap')}
                  className={`px-4 py-2 rounded-xl text-xs italic font-serif flex items-center space-x-1.5 ${
                    sellerSubTab === 'recap' ? 'bg-[#E5D7B8] text-[#111111] font-bold shadow-md' : 'text-[#A69C83] hover:text-[#E5D7B8]'
                  }`}
                >
                  <BarChart2 className="h-3.5 w-3.5" />
                  <span>Recap Sales</span>
                </button>
              </div>
            </div>

            {/* TAB 1: LIST ORDERS */}
            {sellerSubTab === 'orders' && (
              <div className="bg-[#0A0A0A] border border-[#2B261F] p-6 rounded-3xl space-y-4 text-xs italic">
                <h3 className="font-serif text-[#E5D7B8] text-base border-b border-[#2B261F] pb-3">Daftar Pre-Order Masuk</h3>
                {orders.length === 0 ? (
                  <p className="text-[#A69C83] py-8 text-center">Belum ada orderan yang masuk.</p>
                ) : (
                  <div className="space-y-3">
                    {orders.map((o) => (
                      <div key={o.id} className="bg-[#14120F] p-4 rounded-xl border border-[#2B261F] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <p className="font-serif text-[#D4AF37] text-sm">{o.id} - {o.customerName} ({o.companyName})</p>
                          <p className="text-[11px] text-[#A69C83] mt-0.5">{o.paymentMethod.replace('_', ' ').toUpperCase()} | Total: <strong className="text-[#E5D7B8]">Rp {o.totalAmount.toLocaleString('id-ID')}</strong></p>
                          <p className="text-[10px] text-emerald-400 mt-0.5">🔥 Roasting: {o.estimatedRoastingDate || '-'} | 🚚 Shipping: {o.estimatedShippingDate || '-'}</p>
                          <p className="text-[10px] text-[#776E5E] mt-1">Item: {o.items.map(i => `${i.name} x ${i.quantity}`).join(', ')}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] text-[#A69C83]">Status:</span>
                          <select
                            value={o.status}
                            onChange={(e) => updateOrderStatus(o.id, e.target.value as Order['status'])}
                            className="bg-[#0A0A0A] border border-[#2B261F] px-3 py-1.5 rounded-lg text-xs italic text-[#E5D7B8] focus:outline-none"
                          >
                            <option value="Pending Approval">Pending Approval</option>
                            <option value="Roasting Process">Roasting Process</option>
                            <option value="Ready for Shipping">Ready for Shipping</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: PRODUCTS & COGS */}
            {sellerSubTab === 'products' && (
              <div className="space-y-8">
                <div className="bg-[#0A0A0A] border border-[#2B261F] p-6 rounded-3xl space-y-4">
                  <h3 className="text-sm font-serif text-[#D4AF37]">Daftar Akun Reseller & Akses Menu Blend</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs italic">
                    {presetResellerAccounts.map(r => (
                      <div key={r.username} className="bg-[#14120F] p-3 rounded-xl border border-[#2B261F] flex justify-between">
                        <div>
                          <p className="text-[#E5D7B8] font-bold">{r.companyName} ({r.username})</p>
                          <p className="text-[11px] text-[#A69C83]">Akses: {r.allowedBlends?.join(', ')}</p>
                        </div>
                        <span className="text-[10px] text-emerald-400 font-mono">PWD: {r.password}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleSaveProduct} className="bg-[#0A0A0A] border border-[#2B261F] p-6 rounded-3xl space-y-4 text-xs italic">
                  <h3 className="text-sm font-serif text-[#E5D7B8] border-b border-[#2B261F] pb-2">Tambah Produk Baru & COGS</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Nama Produk *"
                      required
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      className="bg-[#14120F] border border-[#2B261F] rounded-xl px-3 py-2 text-[#E5D7B8]"
                    />
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value as Product['category'] })}
                      className="bg-[#14120F] border border-[#2B261F] rounded-xl px-3 py-2 text-[#E5D7B8]"
                    >
                      <option value="Green Beans">Green Beans</option>
                      <option value="Roasted Beans">Roasted Beans</option>
                      <option value="Blend Beans">Blend Beans</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-[#2B261F] pt-3">
                    <div>
                      <label className="block mb-1 text-[#D4AF37]">Harga 1 Kg (IDR)</label>
                      <input type="number" value={productForm.pricePerKg} onChange={(e) => setProductForm({ ...productForm, pricePerKg: parseInt(e.target.value) || 0 })} className="w-full bg-[#14120F] border border-[#2B261F] rounded-xl px-3 py-2 text-[#E5D7B8]" />
                    </div>
                    <div>
                      <label className="block mb-1 text-[#D4AF37]">Harga 200g (IDR)</label>
                      <input type="number" value={productForm.pricePer200g} onChange={(e) => setProductForm({ ...productForm, pricePer200g: parseInt(e.target.value) || 0 })} className="w-full bg-[#14120F] border border-[#2B261F] rounded-xl px-3 py-2 text-[#E5D7B8]" />
                    </div>
                    <div>
                      <label className="block mb-1 text-[#D4AF37]">HPP Greenbeans / Kg</label>
                      <input type="number" value={productForm.greenBeanCostPerKg} onChange={(e) => setProductForm({ ...productForm, greenBeanCostPerKg: parseInt(e.target.value) || 0 })} className="w-full bg-[#14120F] border border-[#2B261F] rounded-xl px-3 py-2 text-[#E5D7B8]" />
                    </div>
                  </div>

                  <button type="submit" className="bg-[#E5D7B8] hover:bg-[#D4AF37] text-[#111111] font-serif font-bold px-6 py-2.5 rounded-xl text-xs flex items-center space-x-1.5">
                    <Plus className="h-4 w-4" />
                    <span>Simpan & Publikasikan Produk</span>
                  </button>
                </form>

                <div className="bg-[#0A0A0A] border border-[#2B261F] p-6 rounded-3xl space-y-6">
                  <h3 className="text-sm font-serif text-[#E5D7B8]">Katalog Produk & Master COGS</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {products.map((p) => (
                      <div key={p.id} className="bg-[#14120F] border border-[#2B261F] p-5 rounded-2xl space-y-3 relative">
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] italic text-[#D4AF37]">{p.category}</span>
                          <div className="flex space-x-2">
                            <button onClick={() => handleOpenEditModal(p)} className="text-[#D4AF37] hover:text-amber-300 p-1 bg-[#0A0A0A] rounded-md border border-[#2B261F]">
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                            <button onClick={() => handleDeleteProduct(p.id)} className="text-[#A69C83] hover:text-rose-400 p-1 bg-[#0A0A0A] rounded-md border border-[#2B261F]">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                        <h3 className="text-sm font-serif text-[#E5D7B8]">{p.name}</h3>
                        <div className="text-xs italic text-[#A69C83]">
                          <p>1 Kg: Rp {(p.pricePerKg || 0).toLocaleString('id-ID')}</p>
                          <p>200g: Rp {(p.pricePer200g || 0).toLocaleString('id-ID')}</p>
                          <p className="text-rose-400">HPP Greenbeans: Rp {(p.greenBeanCostPerKg || 0).toLocaleString('id-ID')}/Kg</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: RECAP SALES */}
            {sellerSubTab === 'recap' && (
              <div className="bg-[#0A0A0A] border border-[#2B261F] p-6 rounded-3xl space-y-6">
                <h3 className="font-serif text-[#E5D7B8] text-base border-b border-[#2B261F] pb-3">Ringkasan Penjualan & Keuntungan</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-[#14120F] border border-[#2B261F] p-6 rounded-2xl">
                    <p className="text-xs text-[#A69C83] italic">Total Omzet Penjualan</p>
                    <p className="text-3xl font-serif text-[#D4AF37] mt-2 font-bold">Rp {totalOmzet.toLocaleString('id-ID')}</p>
                  </div>
                  <div className="bg-[#14120F] border border-[#2B261F] p-6 rounded-2xl">
                    <p className="text-xs text-[#A69C83] italic">Total Transaksi Pesanan</p>
                    <p className="text-3xl font-serif text-[#E5D7B8] mt-2 font-bold">{orders.filter(o => o.status !== 'Rejected').length} Pesanan</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* FLOATING CART BAR */}
      {currentUser?.role !== 'seller' && cart.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 max-w-4xl mx-auto z-40">
          <div className="bg-[#14120F] border border-[#D4AF37] rounded-2xl p-4 shadow-2xl flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] text-[#A69C83] italic font-serif">Total Keranjang ({totalCartUnits} Unit / {totalCartWeightKg} Kg)</p>
              <p className="text-lg font-bold font-serif text-[#D4AF37]">Rp {grandTotal.toLocaleString('id-ID')}</p>
            </div>

            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="bg-[#E5D7B8] hover:bg-[#D4AF37] text-[#111111] font-serif font-bold italic px-5 py-2.5 rounded-xl text-xs flex items-center space-x-2 shadow-lg"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Checkout / Detail Pesanan</span>
            </button>
          </div>
        </div>
      )}

      {/* SLIDE-OVER DRAWER MODAL KERANJANG */}
      {isCartDrawerOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-end">
          <div className="bg-[#0A0A0A] border-l border-[#2B261F] w-full max-w-lg h-full overflow-y-auto p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-[#2B261F] pb-4">
                <div className="flex items-center space-x-2">
                  <ShoppingCart className="h-5 w-5 text-[#D4AF37]" />
                  <h2 className="text-lg font-serif italic text-[#E5D7B8]">Keranjang Pre-Order</h2>
                </div>
                <button onClick={() => setIsCartDrawerOpen(false)} className="text-[#A69C83] hover:text-white p-1">
                  <X className="h-6 w-6" />
                </button>
              </div>

              {cart.length === 0 ? (
                <p className="text-xs text-[#A69C83] italic text-center py-12">Keranjang belanja masih kosong.</p>
              ) : (
                <form onSubmit={handleCheckout} id="drawer-checkout-form" className="space-y-5">
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {cart.map((item) => (
                      <div key={item.id} className="bg-[#14120F] border border-[#2B261F] p-3 rounded-xl flex justify-between items-center text-xs italic gap-2">
                        <div className="flex-1">
                          <p className="text-[#E5D7B8] font-serif font-bold">{item.name}</p>
                          <p className="text-[#A69C83] text-[11px]">@ Rp {item.unitPrice.toLocaleString('id-ID')}</p>
                        </div>

                        <div className="flex items-center space-x-1 bg-[#0A0A0A] border border-[#2B261F] px-2 py-0.5 rounded-lg">
                          <button type="button" onClick={() => updateCartQuantity(item.id, item.quantity - 1)} className="text-[#A69C83]">
                            <Minus className="h-3 w-3" />
                          </button>
                          <input
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={(e) => updateCartQuantity(item.id, parseInt(e.target.value) || 1)}
                            className="w-8 text-center bg-transparent text-[#E5D7B8] font-bold text-xs focus:outline-none"
                          />
                          <button type="button" onClick={() => updateCartQuantity(item.id, item.quantity + 1)} className="text-[#A69C83]">
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        <p className="text-[#D4AF37] font-bold min-w-[70px] text-right">Rp {item.totalPrice.toLocaleString('id-ID')}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-[#14120F] border border-[#2B261F] p-3.5 rounded-xl space-y-1.5 text-xs italic">
                    <p className="font-serif text-[#D4AF37]">Estimasi Jadwal Pesanan Anda</p>
                    <div className="flex justify-between text-[#E5D7B8]">
                      <span>Roasting:</span>
                      <span className="font-bold text-emerald-400">{scheduleInfo.roasting}</span>
                    </div>
                    <div className="flex justify-between text-[#E5D7B8]">
                      <span>Shipping:</span>
                      <span className="font-bold text-sky-400">{scheduleInfo.shipping}</span>
                    </div>
                  </div>

                  <div className="bg-[#14120F] border border-[#2B261F] p-4 rounded-xl space-y-3 text-xs italic">
                    <p className="font-serif text-[#D4AF37]">Profil & Alamat Pemesan</p>
                    <input
                      type="text"
                      placeholder="Nama Lengkap Pemesan *"
                      required
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                      className="w-full bg-[#0A0A0A] border border-[#2B261F] rounded-lg px-3 py-2 text-[#E5D7B8]"
                    />
                    <input
                      type="text"
                      placeholder="Nama Cafe / Perusahaan *"
                      required
                      value={customerInfo.company}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, company: e.target.value })}
                      className="w-full bg-[#0A0A0A] border border-[#2B261F] rounded-lg px-3 py-2 text-[#E5D7B8]"
                    />
                    <input
                      type="text"
                      placeholder="Nomor WhatsApp *"
                      required
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                      className="w-full bg-[#0A0A0A] border border-[#2B261F] rounded-lg px-3 py-2 text-[#E5D7B8]"
                    />
                    <textarea
                      placeholder="Alamat Lengkap Pengiriman *"
                      required
                      rows={2}
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                      className="w-full bg-[#0A0A0A] border border-[#2B261F] rounded-lg px-3 py-2 text-[#E5D7B8]"
                    />
                  </div>

                  {/* METODE PEMBAYARAN (TRANSFER BCA / KONTRA BON) */}
                  <div className="bg-[#14120F] border border-[#2B261F] p-4 rounded-xl space-y-3 text-xs italic">
                    <p className="font-serif text-[#D4AF37]">Metode Pembayaran</p>
                    
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="radio" name="paymentDrawer" checked={paymentMethod === 'transfer'} onChange={() => setPaymentMethod('transfer')} className="accent-[#D4AF37]" />
                      <span className="text-[#E5D7B8] flex items-center space-x-1.5">
                        <CreditCard className="h-3.5 w-3.5 text-sky-400" />
                        <span>Transfer Bank BCA</span>
                      </span>
                    </label>

                    {paymentMethod === 'transfer' && (
                      <div className="bg-[#0A0A0A] p-3.5 rounded-xl border border-sky-900/60 space-y-1 text-xs italic my-1">
                        <p className="text-[#A69C83] text-[11px]">Rekening Resmi Pembayaran:</p>
                        <p className="text-[#E5D7B8] font-bold text-sm">BCA: 7772400244</p>
                        <p className="text-[#D4AF37] font-semibold text-[11px]">a.n. CV Multi Agri Sentosa</p>
                      </div>
                    )}

                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="radio" name="paymentDrawer" checked={paymentMethod === 'kontra_bon_15'} onChange={() => setPaymentMethod('kontra_bon_15')} className="accent-[#D4AF37]" />
                      <span className="text-[#E5D7B8]">Kontra Bon (Net 15 Days)</span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="radio" name="paymentDrawer" checked={paymentMethod === 'kontra_bon_30'} onChange={() => setPaymentMethod('kontra_bon_30')} className="accent-[#D4AF37]" />
                      <span className="text-[#E5D7B8]">Kontra Bon (Net 30 Days)</span>
                    </label>
                  </div>
                </form>
              )}
            </div>

            {cart.length > 0 && (
              <div className="pt-4 border-t border-[#2B261F] space-y-3">
                <div className="flex justify-between text-base font-serif font-bold text-[#E5D7B8]">
                  <span>Total Tagihan:</span>
                  <span className="text-[#D4AF37]">Rp {grandTotal.toLocaleString('id-ID')}</span>
                </div>

                <button
                  type="submit"
                  form="drawer-checkout-form"
                  className="w-full bg-[#E5D7B8] hover:bg-[#D4AF37] text-[#111111] font-serif italic font-bold py-3.5 rounded-xl transition-all shadow-md"
                >
                  Submit Pre-Order Now
                </button>
              </div>
            )}

            {currentActiveOrder && (
              <div className="p-4 bg-[#14120F] border border-[#2B261F] rounded-2xl space-y-2 text-xs italic">
                <p className="text-[#D4AF37] font-serif">Order Registered! (ID: {currentActiveOrder.id})</p>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={generateWhatsAppLink(currentActiveOrder, '6281931364302')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-emerald-700 text-white rounded-lg text-center"
                  >
                    Send Admin 1
                  </a>
                  <a
                    href={generateWhatsAppLink(currentActiveOrder, '6289654225095')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-emerald-700 text-white rounded-lg text-center"
                  >
                    Send Admin 2
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL EDIT PRODUK */}
      {isEditModalOpen && editingProduct && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0A0A0A] border border-[#2B261F] rounded-3xl p-6 max-w-lg w-full space-y-4">
            <div className="flex justify-between items-center border-b border-[#2B261F] pb-3">
              <h3 className="text-base font-serif italic text-[#E5D7B8]">Edit Produk: {editingProduct.name}</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-[#A69C83] hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedProduct} className="space-y-4 text-xs italic">
              <div>
                <label className="block text-[#A69C83] mb-1">Nama Produk</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full bg-[#14120F] border border-[#2B261F] rounded-xl px-3 py-2 text-[#E5D7B8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#A69C83] mb-1">Harga 1 Kg (Rp)</label>
                  <input
                    type="number"
                    value={editingProduct.pricePerKg}
                    onChange={(e) => setEditingProduct({ ...editingProduct, pricePerKg: parseInt(e.target.value) || 0 })}
                    className="w-full bg-[#14120F] border border-[#2B261F] rounded-xl px-3 py-2 text-[#E5D7B8]"
                  />
                </div>
                <div>
                  <label className="block text-[#A69C83] mb-1">Harga 200g (Rp)</label>
                  <input
                    type="number"
                    value={editingProduct.pricePer200g}
                    onChange={(e) => setEditingProduct({ ...editingProduct, pricePer200g: parseInt(e.target.value) || 0 })}
                    className="w-full bg-[#14120F] border border-[#2B261F] rounded-xl px-3 py-2 text-[#E5D7B8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#A69C83] mb-1">Modal HPP Greenbeans / Kg (Rp)</label>
                <input
                  type="number"
                  value={editingProduct.greenBeanCostPerKg}
                  onChange={(e) => setEditingProduct({ ...editingProduct, greenBeanCostPerKg: parseInt(e.target.value) || 0 })}
                  className="w-full bg-[#14120F] border border-[#2B261F] rounded-xl px-3 py-2 text-[#E5D7B8]"
                />
              </div>

              <div>
                <label className="block text-[#A69C83] mb-1">Deskripsi Produk</label>
                <textarea
                  rows={2}
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full bg-[#14120F] border border-[#2B261F] rounded-xl px-3 py-2 text-[#E5D7B8]"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-[#2B261F]">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-[#14120F] border border-[#2B261F] rounded-xl text-[#A69C83]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#E5D7B8] hover:bg-[#D4AF37] text-[#111111] font-bold font-serif rounded-xl"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}