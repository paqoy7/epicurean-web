'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Coffee, ShoppingCart, Lock, KeyRound, 
  Trash2, User, Check, X,
  MessageSquare, RefreshCw, Edit3, LogOut, ArrowRight, ShieldCheck, Tag
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
  allowedResellers?: string[]; // Array username reseller yang diizinkan
}

interface OrderItem {
  id: string;
  name: string;
  quantityGram: number;
  pricePerGram: number;
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
  createdAt: string;
}

interface UserAccount {
  username: string;
  password?: string;
  role: 'pembeli' | 'reseller' | 'seller';
  companyName?: string;
  allowedBlends?: string[]; // Nama-nama produk blend yang diizinkan
}

// DAFTAR AKUN RESELLER & SELLER RESMI DARI TABEL SPREADSHEET
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
  // GREEN BEANS
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

  // ROASTED BEANS
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

  // BLEND BEANS (EKSLUSIF RESELLER)
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

export default function EpicureanApp() {
  const [currentStep, setCurrentStep] = useState<'welcome' | 'auth' | 'main'>('welcome');
  const [selectedRole, setSelectedRole] = useState<'pembeli' | 'reseller' | 'seller'>('pembeli');
  
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  
  // Auth Form State
  const [authForm, setAuthForm] = useState({ username: '', password: '', companyName: '' });
  const [authError, setAuthError] = useState('');

  // Shortlist Tab State
  const [activeCatalogTab, setActiveCatalogTab] = useState<'all' | 'Green Beans' | 'Roasted Beans' | 'Blend Beans'>('all');

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
      if (updatedData) {
        setProducts(formatSupabaseProducts(updatedData));
      } else {
        setProducts(defaultProductsFromSpreadsheet);
      }
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

  // LOGIKA FILTER PRODUK BERDASARKAN USER LOGGED IN & TAB
  const filteredProducts = products.filter(p => {
    // Filter Kategori Tab Shortlist
    if (activeCatalogTab !== 'all' && p.category !== activeCatalogTab) {
      return false;
    }

    // Filter Hak Akses Role
    if (currentUser?.role === 'seller') {
      return true; // Seller melihat semua produk
    }

    if (currentUser?.role === 'reseller') {
      if (!p.isExclusive) return true; // Produk umum bisa dilihat
      // Cek apakah produk blend ini diizinkan untuk reseller ini
      if (currentUser.allowedBlends && currentUser.allowedBlends.includes(p.name)) {
        return true;
      }
      if (p.allowedResellers && p.allowedResellers.includes(currentUser.username)) {
        return true;
      }
      return false;
    }

    // Pembeli Umum
    return !p.isExclusive; // Hanya melihat produk non-eksklusif
  });

  const [cart, setCart] = useState<OrderItem[]>([]);
  const [customerType, setCustomerType] = useState<'perorangan' | 'cafe'>('cafe');
  const [destination, setDestination] = useState<'bandung' | 'luar_bandung'>('bandung');
  const [paymentMethod, setPaymentMethod] = useState<'transfer' | 'kontra_bon_15' | 'kontra_bon_30'>('kontra_bon_30');
  const [customerInfo, setCustomerInfo] = useState({ name: '', company: '', address: '', phone: '' });

  const totalCartWeightKg = cart.reduce((acc, item) => acc + item.quantityGram, 0) / 1000;
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
      // Pembeli Umum (Bisa Login/Daftar Bebas)
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

  const addProductToCart = (prod: Product, packType: '1kg' | '500g' | '200g') => {
    let weightGram = 1000;
    let price = prod.pricePerKg || 200000;
    let packLabel = 'Kemasan 1 Kg';

    if (packType === '500g') {
      weightGram = 500;
      price = prod.pricePer500g || 100000;
      packLabel = 'Kemasan 500 Gram';
    } else if (packType === '200g') {
      weightGram = 200;
      price = prod.pricePer200g || 50000;
      packLabel = 'Kemasan 200 Gram';
    }
    
    const newItem: OrderItem = {
      id: `${prod.id}-${packType}-${Date.now()}`,
      name: `${prod.name} (${packLabel})`,
      quantityGram: weightGram,
      pricePerGram: price / weightGram,
      totalPrice: price,
      packType: packType
    };
    setCart([...cart, newItem]);
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
    text += `*Rincian Pesanan:*\n`;
    order.items.forEach(item => {
      text += `- ${item.name} (${item.quantityGram}g) : Rp ${item.totalPrice.toLocaleString('id-ID')}\n`;
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
      alert('Produk baru berhasil disimpan ke database!');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      alert('Gagal menghapus produk: ' + error.message);
    } else {
      fetchProducts();
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
    if (error) {
      alert('Gagal mengubah status order: ' + error.message);
    } else {
      fetchOrders();
    }
  };

  const totalOmzet = orders.filter(o => o.status !== 'Rejected').reduce((acc, o) => acc + o.totalAmount, 0);

  // STEP 1: LANDING WELCOME PAGE (LAYOUT EXPLICIT MATCH GAMBAR)
  if (currentStep === 'welcome') {
    return (
      <div className="min-h-screen bg-black text-[#E8E2D5] font-serif flex flex-col items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center space-y-8 py-12 px-6 border border-[#2B261F] rounded-3xl bg-[#080808] shadow-2xl">
          {/* LOGO SIMBOL */}
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

          {/* 3 TOMBOL PILIHAN ROLE (SAYA PEMBELI / RESELLER / SELLER) */}
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

  // STEP 2: FORM SIGN IN / LOG IN SESUAI ROLE
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

  // STEP 3: BERANDA UTAMA PLATFORM
  return (
    <div className="min-h-screen bg-[#111111] text-[#E8E2D5] font-serif antialiased selection:bg-[#D4AF37] selection:text-black">
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

          {/* INFORMASI AKUN LOGGED IN */}
          <div className="flex items-center space-x-4 bg-[#14120F] border border-[#2B261F] px-4 py-2 rounded-full">
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
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {currentUser?.role !== 'seller' ? (
          /* STOREFRONT (PEMBELI / RESELLER) */
          <div className="space-y-10">
            {/* HERO */}
            <div className="text-center py-6 px-4 space-y-2">
              <h1 className="text-3xl sm:text-5xl font-normal tracking-wide text-[#E5D7B8] uppercase drop-shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                EPICUREAN
              </h1>
              <p className="text-base italic text-[#D4AF37] font-serif tracking-widest">
                Coffee Company Catalog
              </p>
            </div>

            {/* TAB SHORTLIST KATEGORI COFFEE BEANS */}
            <section className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-center border-b border-[#2B261F] pb-4 gap-4">
                <h2 className="text-lg font-serif italic text-[#E5D7B8]">Katalog Produk Coffee Beans</h2>
                
                {/* SHORTLIST TABS */}
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

                        <div className="grid grid-cols-2 gap-2 mt-5">
                          {has200g ? (
                            <button onClick={() => addProductToCart(p, '200g')} className="bg-[#14120F] hover:bg-[#2B261F] text-[#E5D7B8] text-[10px] italic py-2 rounded-lg border border-[#2B261F]">
                              + 200g
                            </button>
                          ) : (
                            <button disabled className="bg-[#0A0A0A] text-[#443E33] text-[10px] italic py-2 rounded-lg border border-[#2B261F] cursor-not-allowed">N/A 200g</button>
                          )}

                          {has1kg ? (
                            <button onClick={() => addProductToCart(p, '1kg')} className="bg-[#E5D7B8] hover:bg-[#D4AF37] text-[#111111] text-[10px] font-serif italic font-bold py-2 rounded-lg">
                              + 1 Kg
                            </button>
                          ) : (
                            <button disabled className="bg-[#0A0A0A] text-[#443E33] text-[10px] italic py-2 rounded-lg border border-[#2B261F] cursor-not-allowed">N/A 1 Kg</button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* CHECKOUT FORM */}
            <section className="bg-[#0A0A0A] border border-[#2B261F] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex items-center space-x-2 border-b border-[#2B261F] pb-4">
                <ShoppingCart className="h-5 w-5 text-[#D4AF37]" />
                <h2 className="text-xl font-serif italic text-[#E5D7B8]">Checkout Pre-Order</h2>
              </div>

              {cart.length === 0 ? (
                <p className="text-xs text-[#A69C83] italic text-center py-8">Keranjang belanja masih kosong.</p>
              ) : (
                <form onSubmit={handleCheckout} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-5">
                    <div className="space-y-2">
                      {cart.map((item) => (
                        <div key={item.id} className="bg-[#14120F] border border-[#2B261F] p-3.5 rounded-xl flex justify-between items-center text-xs italic">
                          <div>
                            <p className="text-[#E5D7B8] font-serif">{item.name}</p>
                            <p className="text-[#A69C83] text-[11px]">{item.quantityGram} Gram</p>
                          </div>
                          <p className="text-[#D4AF37] font-bold">Rp {item.totalPrice.toLocaleString('id-ID')}</p>
                        </div>
                      ))}
                    </div>

                    <div className="bg-[#14120F] border border-[#2B261F] p-4 rounded-xl space-y-3">
                      <p className="text-xs font-serif italic text-[#D4AF37]">Buyer Profile & Verification</p>
                      <input
                        type="text"
                        placeholder="Nama Lengkap Pemesan *"
                        required
                        value={customerInfo.name}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                        className="w-full bg-[#0A0A0A] border border-[#2B261F] rounded-lg px-3 py-2 text-xs italic text-[#E5D7B8]"
                      />
                      <input
                        type="text"
                        placeholder="Nama Cafe / Perusahaan *"
                        required
                        value={customerInfo.company}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, company: e.target.value })}
                        className="w-full bg-[#0A0A0A] border border-[#2B261F] rounded-lg px-3 py-2 text-xs italic text-[#E5D7B8]"
                      />
                      <input
                        type="text"
                        placeholder="Nomor WhatsApp *"
                        required
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                        className="w-full bg-[#0A0A0A] border border-[#2B261F] rounded-lg px-3 py-2 text-xs italic text-[#E5D7B8]"
                      />
                      <textarea
                        placeholder="Alamat Lengkap Pengiriman *"
                        required
                        rows={2}
                        value={customerInfo.address}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                        className="w-full bg-[#0A0A0A] border border-[#2B261F] rounded-lg px-3 py-2 text-xs italic text-[#E5D7B8]"
                      />
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div className="bg-[#14120F] border border-[#2B261F] p-4 rounded-xl space-y-2 text-xs italic">
                      <p className="font-serif text-[#D4AF37]">Payment Terms</p>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="radio" name="payment" checked={paymentMethod === 'transfer'} onChange={() => setPaymentMethod('transfer')} className="accent-[#D4AF37]" />
                        <span className="text-[#E5D7B8]">Direct Bank Transfer (BCA: 7772400244)</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="radio" name="payment" checked={paymentMethod === 'kontra_bon_15'} onChange={() => setPaymentMethod('kontra_bon_15')} className="accent-[#D4AF37]" />
                        <span className="text-[#E5D7B8]">Kontra Bon (Net 15 Days)</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="radio" name="payment" checked={paymentMethod === 'kontra_bon_30'} onChange={() => setPaymentMethod('kontra_bon_30')} className="accent-[#D4AF37]" />
                        <span className="text-[#E5D7B8]">Kontra Bon (Net 30 Days)</span>
                      </label>
                    </div>

                    <div className="bg-[#14120F] border border-[#2B261F] p-4 rounded-xl space-y-2 text-xs italic">
                      <div className="flex justify-between text-[#A69C83]">
                        <span>Subtotal:</span>
                        <span>Rp {cartSubtotal.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between text-[#A69C83]">
                        <span>Ongkir:</span>
                        <span>Rp {shippingCost.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="border-t border-[#2B261F] pt-2 flex justify-between text-base font-serif font-bold text-[#E5D7B8]">
                        <span>Total:</span>
                        <span className="text-[#D4AF37]">Rp {grandTotal.toLocaleString('id-ID')}</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#E5D7B8] hover:bg-[#D4AF37] text-[#111111] font-serif italic font-bold py-3.5 rounded-xl transition-all shadow-md"
                    >
                      Submit Pre-Order
                    </button>
                  </div>
                </form>
              )}

              {currentActiveOrder && (
                <div className="mt-6 p-5 bg-[#14120F] border border-[#2B261F] rounded-2xl space-y-3">
                  <p className="text-xs italic text-[#D4AF37] font-serif">Order Registered! (ID: {currentActiveOrder.id})</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <a
                      href={generateWhatsAppLink(currentActiveOrder, '6281931364302')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-serif italic rounded-xl flex items-center justify-center space-x-2"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>Send to Admin 1</span>
                    </a>
                    <a
                      href={generateWhatsAppLink(currentActiveOrder, '6289654225095')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-serif italic rounded-xl flex items-center justify-center space-x-2"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>Send to Admin 2</span>
                    </a>
                  </div>
                </div>
              )}
            </section>
          </div>
        ) : (
          /* DASHBOARD SELLER ADMIN */
          <div className="space-y-8">
            <div className="bg-[#0A0A0A] border border-[#2B261F] p-6 rounded-3xl flex justify-between items-center">
              <h1 className="text-xl font-serif italic text-[#E5D7B8]">Epicurean Roastery Manager</h1>
            </div>

            <div className="space-y-8">
              {/* DAFTAR AKUN RESELLER INFO CARD */}
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

              {/* DAFTAR PRODUK & EDIT COGS */}
              <div className="bg-[#0A0A0A] border border-[#2B261F] p-6 rounded-3xl space-y-6">
                <h3 className="text-sm font-serif text-[#E5D7B8]">Katalog Produk & COGS Master</h3>
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
          </div>
        )}
      </main>

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