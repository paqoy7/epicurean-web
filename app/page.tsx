'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Coffee, ShoppingCart, Calculator, Truck, CreditCard, 
  Plus, FileText, BarChart2, CheckCircle, Lock, KeyRound, 
  Trash2, Printer, AlertTriangle, Building2, User, Upload, Check, X,
  MessageSquare, ExternalLink, RefreshCw, ShieldAlert, Key, Unlock, Settings, Save, Edit3
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
}

interface OrderItem {
  id: string;
  name: string;
  quantityGram: number;
  pricePerGram: number;
  totalPrice: number;
  blendDetails?: string;
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

  // BLEND BEANS
  { id: 'BL-1', name: 'Railway Blend (50 KDH : 50 KWH)', category: 'Blend Beans', pricePerKg: 320000, pricePer500g: 0, pricePer200g: 75000, greenBeanCostPerKg: 224653, roastingCostPerKg: 20000, packagingCostPerKg: 7500, packagingCostPer500g: 0, packagingCostPer200g: 3000, description: 'Railway Blend: 50% Roasted KDH + 50% Roasted KWH', isExclusive: true, exclusiveCode: 'EPICUREANVIP' },
  { id: 'BL-2', name: 'Astria Blend (60 KDH : 40 Robusta)', category: 'Blend Beans', pricePerKg: 250000, pricePer500g: 0, pricePer200g: 60000, greenBeanCostPerKg: 190278, roastingCostPerKg: 20000, packagingCostPerKg: 7500, packagingCostPer500g: 0, packagingCostPer200g: 3000, description: 'Astria Blend: 60% Roasted KDH + 40% Roasted Robusta', isExclusive: true, exclusiveCode: 'EPICUREANVIP' },
  { id: 'BL-3', name: 'Brunswick Blend (50 KDH : 50 BNE)', category: 'Blend Beans', pricePerKg: 285000, pricePer500g: 0, pricePer200g: 68000, greenBeanCostPerKg: 243264, roastingCostPerKg: 20000, packagingCostPerKg: 7500, packagingCostPer500g: 0, packagingCostPer200g: 3000, description: 'Brunswick Blend: 50% Roasted KDH + 50% Roasted Flores', isExclusive: true, exclusiveCode: 'EPICUREANVIP' },
  { id: 'BL-4', name: 'FarmHouse Blend (70 KWH : 30 KNE)', category: 'Blend Beans', pricePerKg: 290000, pricePer500g: 0, pricePer200g: 70000, greenBeanCostPerKg: 229028, roastingCostPerKg: 20000, packagingCostPerKg: 7500, packagingCostPer500g: 0, packagingCostPer200g: 3000, description: 'FarmHouse Blend: 70% Kerinci WH + 30% Kerinci Natural', isExclusive: true, exclusiveCode: 'EPICUREANVIP' },
  { id: 'BL-5', name: 'Dago Terrace Blend (70 KDH : 30 Robusta)', category: 'Blend Beans', pricePerKg: 250000, pricePer500g: 0, pricePer200g: 60000, greenBeanCostPerKg: 199653, roastingCostPerKg: 20000, packagingCostPerKg: 7500, packagingCostPer500g: 0, packagingCostPer200g: 3000, description: 'Dago Terrace Blend: 70% Kerinci DH PTP + 30% Kerinci Robusta', isExclusive: true, exclusiveCode: 'EPICUREANVIP' },
  { id: 'BL-6', name: 'Foresta Blend (70 KDH : 30 Robusta)', category: 'Blend Beans', pricePerKg: 250000, pricePer500g: 0, pricePer200g: 60000, greenBeanCostPerKg: 201783, roastingCostPerKg: 20000, packagingCostPerKg: 7500, packagingCostPer500g: 0, packagingCostPer200g: 3000, description: 'Foresta Blend: 70% Kerinci DH PTP + 30% Kerinci Robusta', isExclusive: true, exclusiveCode: 'EPICUREANVIP' },
  { id: 'BL-7', name: 'Blend Tigris (70 Robusta : 30 KDH)', category: 'Blend Beans', pricePerKg: 210000, pricePer500g: 0, pricePer200g: 50000, greenBeanCostPerKg: 162153, roastingCostPerKg: 20000, packagingCostPerKg: 7500, packagingCostPer500g: 0, packagingCostPer200g: 3000, description: 'Blend Tigris: 70% Kerinci Robusta + 30% Roasted KDH PTP', isExclusive: true, exclusiveCode: 'EPICUREANVIP' },
  { id: 'BL-8', name: 'Blend K50 (50 KDH : 50 Robusta)', category: 'Blend Beans', pricePerKg: 225000, pricePer500g: 0, pricePer200g: 55000, greenBeanCostPerKg: 158264, roastingCostPerKg: 20000, packagingCostPerKg: 7500, packagingCostPer500g: 0, packagingCostPer200g: 3000, description: 'Blend K50: 50% Kerinci Robusta + 50% Roasted KDH PTP', isExclusive: true, exclusiveCode: 'EPICUREANVIP' },
  { id: 'BL-9', name: 'Blend 60:40 (60 KDH : 40 Robusta)', category: 'Blend Beans', pricePerKg: 240000, pricePer500g: 0, pricePer200g: 58000, greenBeanCostPerKg: 190278, roastingCostPerKg: 20000, packagingCostPerKg: 7500, packagingCostPer500g: 0, packagingCostPer200g: 3000, description: 'Blend 60:40: 60% Roasted KDH PTP + 40% Kerinci Robusta', isExclusive: true, exclusiveCode: 'EPICUREANVIP' },
  { id: 'BL-10', name: 'Luna Tirsa Blend (50 KDH : 50 KNE)', category: 'Blend Beans', pricePerKg: 325000, pricePer500g: 0, pricePer200g: 78000, greenBeanCostPerKg: 237153, roastingCostPerKg: 20000, packagingCostPerKg: 7500, packagingCostPer500g: 0, packagingCostPer200g: 3000, description: 'Luna Tirsa Blend: 50% Roasted KDH + 50% Kerinci Natural', isExclusive: true, exclusiveCode: 'EPICUREANVIP' }
];

export default function EpicureanApp() {
  const [activeTab, setActiveTab] = useState<'storefront' | 'seller'>('storefront');
  const [sellerSubTab, setSellerSubTab] = useState<'orders' | 'products' | 'passcode' | 'recap'>('orders');
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // EDIT PRODUCT MODAL STATE
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Dynamic Passcode State
  const [globalBlendPasscode, setGlobalBlendPasscode] = useState('EPICUREANVIP');
  const [newPasscodeForm, setNewPasscodeForm] = useState('');

  const [userEnteredCode, setUserEnteredCode] = useState('');
  const [unlockedCodes, setUnlockedCodes] = useState<string[]>([]);
  const [codeSuccessMsg, setCodeSuccessMsg] = useState(false);

  useEffect(() => {
    const savedCode = localStorage.getItem('epicurean_blend_passcode');
    if (savedCode) {
      setGlobalBlendPasscode(savedCode);
    }
  }, []);

  const handleUpdateGlobalPasscode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPasscodeForm.trim()) return;
    const formatted = newPasscodeForm.trim().toUpperCase();
    setGlobalBlendPasscode(formatted);
    localStorage.setItem('epicurean_blend_passcode', formatted);
    setNewPasscodeForm('');
    alert(`Passcode Blend berhasil diperbarui menjadi: ${formatted}`);
  };

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
      exclusiveCode: (item.exclusive_code || '').toUpperCase().trim()
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
          exclusive_code: prod.exclusiveCode
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

  const handleUnlockCode = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = userEnteredCode.trim().toUpperCase();
    if (!cleanCode) return;

    if (cleanCode === globalBlendPasscode || products.some(p => p.isExclusive && p.exclusiveCode === cleanCode)) {
      if (!unlockedCodes.includes(cleanCode)) {
        setUnlockedCodes([...unlockedCodes, cleanCode]);
      }
      setCodeSuccessMsg(true);
      setUserEnteredCode('');
      setTimeout(() => setCodeSuccessMsg(false), 3500);
    } else {
      alert('Passcode tidak valid. Silakan tanyakan ke Admin Roastery.');
    }
  };

  const visibleProducts = products.filter(p => {
    if (!p.isExclusive) return true;
    return unlockedCodes.includes(globalBlendPasscode) || unlockedCodes.includes(p.exclusiveCode);
  });

  const roastedProducts = products.filter(p => p.category === 'Roasted Beans');
  
  const [blend, setBlend] = useState({
    bean1Id: '',
    bean2Id: '',
    ratioPreset: '60:40' as '50:50' | '60:40' | '70:30',
    grindSize: 'Biji Utuh (Whole Bean)',
    weightGram: 200
  });

  useEffect(() => {
    if (roastedProducts.length > 0) {
      if (!roastedProducts.find(p => p.id === blend.bean1Id)) setBlend(b => ({ ...b, bean1Id: roastedProducts[0].id }));
      if (!roastedProducts.find(p => p.id === blend.bean2Id)) setBlend(b => ({ ...b, bean2Id: roastedProducts[1]?.id || roastedProducts[0].id }));
    }
  }, [products]);

  const getBlendRatios = (preset: '50:50' | '60:40' | '70:30') => {
    switch (preset) {
      case '50:50': return { r1: 50, r2: 50 };
      case '60:40': return { r1: 60, r2: 40 };
      case '70:30': return { r1: 70, r2: 30 };
      default: return { r1: 60, r2: 40 };
    }
  };

  const { r1: bean1Ratio, r2: bean2Ratio } = getBlendRatios(blend.ratioPreset);
  const bean1Obj = products.find(p => p.id === blend.bean1Id);
  const bean2Obj = products.find(p => p.id === blend.bean2Id);

  const priceBean1 = bean1Obj ? bean1Obj.pricePerKg : 170000;
  const priceBean2 = bean2Obj ? bean2Obj.pricePerKg : 170000;

  const calculateBlendTotalPrice = (weightGram: number, p1: number, p2: number, r1: number, r2: number) => {
    const baseRawPricePerKg = (r1 / 100) * p1 + (r2 / 100) * p2;
    if (weightGram >= 1000) {
      const totalKg = weightGram / 1000;
      return Math.round((baseRawPricePerKg + 27500) * totalKg);
    } else if (weightGram >= 500) {
      const portion = (baseRawPricePerKg / 1000) * weightGram;
      return Math.round(portion * 1.12 + 10000);
    } else {
      const portion = (baseRawPricePerKg / 1000) * weightGram;
      return Math.round(portion * 1.20 + 7500);
    }
  };

  const totalCustomBlendPrice = calculateBlendTotalPrice(blend.weightGram, priceBean1, priceBean2, bean1Ratio, bean2Ratio);

  const [cart, setCart] = useState<OrderItem[]>([]);
  const [customerType, setCustomerType] = useState<'perorangan' | 'cafe'>('cafe');
  const [destination, setDestination] = useState<'bandung' | 'luar_bandung'>('bandung');
  const [paymentMethod, setPaymentMethod] = useState<'transfer' | 'kontra_bon_15' | 'kontra_bon_30'>('kontra_bon_30');
  const [customerInfo, setCustomerInfo] = useState({ name: '', company: '', address: '', phone: '' });

  useEffect(() => {
    if (customerType === 'perorangan') setPaymentMethod('transfer');
  }, [customerType]);

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

  const addCustomBlendToCart = () => {
    const b1Name = bean1Obj ? bean1Obj.name.split(' ')[0] : 'Bean1';
    const b2Name = bean2Obj ? bean2Obj.name.split(' ')[0] : 'Bean2';

    const newItem: OrderItem = {
      id: `CB-${Date.now()}`,
      name: `Custom Blend (${bean1Ratio}% ${b1Name} : ${bean2Ratio}% ${b2Name})`,
      quantityGram: blend.weightGram,
      pricePerGram: totalCustomBlendPrice / blend.weightGram,
      totalPrice: totalCustomBlendPrice,
      blendDetails: `Gilingan: ${blend.grindSize}`
    };
    setCart([...cart, newItem]);
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
      customerName: customerInfo.name,
      companyName: customerType === 'cafe' ? customerInfo.company : 'Pembeli Perorangan',
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
    text += `*Kategori:* ${order.customerType.toUpperCase()}\n`;
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

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'EPCCOFFEE!') {
      setIsAuthenticated(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  // EDIT PRODUK FUNCTIONS
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
      is_exclusive: editingProduct.isExclusive,
      exclusive_code: editingProduct.exclusiveCode.toUpperCase().trim()
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
      is_exclusive: productForm.isExclusive,
      exclusive_code: productForm.exclusiveCode.toUpperCase().trim()
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

          <div className="hidden lg:block text-center text-xs italic text-[#A69C83] font-serif tracking-wide">
            Website Orders Coffee Beans Official From Epicurean
          </div>

          <div className="flex items-center bg-[#1A1815] border border-[#2B261F] p-1 rounded-full">
            <button
              onClick={() => setActiveTab('storefront')}
              className={`px-6 py-1.5 rounded-full text-xs italic font-serif transition-all ${
                activeTab === 'storefront' ? 'bg-[#E5D7B8] text-[#111111] font-bold shadow-md' : 'text-[#A69C83] hover:text-[#D4AF37]'
              }`}
            >
              Buyer
            </button>
            <button
              onClick={() => setActiveTab('seller')}
              className={`px-6 py-1.5 rounded-full text-xs italic font-serif transition-all ${
                activeTab === 'seller' ? 'bg-[#E5D7B8] text-[#111111] font-bold shadow-md' : 'text-[#A69C83] hover:text-[#D4AF37]'
              }`}
            >
              Seller
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {activeTab === 'storefront' ? (
          <div className="space-y-12">
            {/* HERO */}
            <div className="text-center py-10 px-4 space-y-4">
              <h1 className="text-4xl sm:text-6xl font-normal tracking-wide text-[#E5D7B8] uppercase drop-shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                EPICUREAN
              </h1>
              <p className="text-lg sm:text-xl italic text-[#D4AF37] font-serif tracking-widest -mt-2">
                Coffee Company
              </p>
              <p className="text-xs sm:text-sm italic text-[#A69C83] max-w-xl mx-auto font-serif">
                Website Orders Coffee Beans Official From Epicurean
              </p>

              {/* UNLOCK PASSCODE */}
              <div className="mt-8 max-w-md mx-auto">
                <form onSubmit={handleUnlockCode} className="bg-[#0A0A0A] border border-[#3A3328] rounded-full p-1.5 flex items-center justify-between shadow-2xl">
                  <input
                    type="text"
                    placeholder="Have referal code?"
                    value={userEnteredCode}
                    onChange={(e) => setUserEnteredCode(e.target.value)}
                    className="bg-transparent text-xs italic text-[#E5D7B8] px-5 py-2 w-full focus:outline-none placeholder:text-[#665D4B]"
                  />
                  <button
                    type="submit"
                    className="bg-[#E5D7B8] hover:bg-[#D4AF37] text-[#111111] font-serif italic text-xs font-bold px-6 py-2 rounded-full flex items-center space-x-1.5 transition-all shadow-md shrink-0"
                  >
                    <Lock className="h-3.5 w-3.5 text-[#111111]" />
                    <span>Unlock</span>
                  </button>
                </form>

                {codeSuccessMsg && (
                  <p className="text-xs text-emerald-400 italic mt-3 font-serif">
                    ✓ Exclusive Menu Unlocked!
                  </p>
                )}
              </div>
            </div>

            {/* CUSTOM BLEND CONFIGURATOR */}
            <section className="bg-[#0A0A0A] border border-[#2B261F] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="border-b border-[#2B261F] pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-serif italic text-[#E5D7B8]">Custom Blend Configurator</h2>
                  <p className="text-xs text-[#A69C83] italic">Kalkulasi rasio racikan komponen dengan kalkulasi harga eceran terproteksi</p>
                </div>
                <Calculator className="h-5 w-5 text-[#D4AF37]" />
              </div>

              {roastedProducts.length < 2 ? (
                <p className="text-xs text-[#A69C83] italic text-center py-6">Dibutuhkan minimal 2 produk ber-kategori <strong>Roasted Beans</strong> untuk mengaktifkan Custom Blend.</p>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-5">
                    {/* Bean 1 Selection */}
                    <div className="bg-[#14120F] p-4 rounded-2xl border border-[#2B261F] space-y-2">
                      <div className="flex justify-between text-xs italic text-[#A69C83]">
                        <span>Component A (Biji Utama):</span>
                        <span className="text-[#D4AF37] font-bold">{bean1Ratio}%</span>
                      </div>
                      <select
                        value={blend.bean1Id}
                        onChange={(e) => setBlend({ ...blend, bean1Id: e.target.value })}
                        className="w-full bg-[#0A0A0A] border border-[#2B261F] rounded-xl px-3 py-2 text-xs italic text-[#E5D7B8] focus:outline-none"
                      >
                        {roastedProducts.map(b => (
                          <option key={b.id} value={b.id}>{b.name} (Rp {(b.pricePerKg || 0).toLocaleString('id-ID')}/Kg)</option>
                        ))}
                      </select>
                    </div>

                    {/* Bean 2 Selection */}
                    <div className="bg-[#14120F] p-4 rounded-2xl border border-[#2B261F] space-y-2">
                      <div className="flex justify-between text-xs italic text-[#A69C83]">
                        <span>Component B (Biji Pendukung):</span>
                        <span className="text-[#D4AF37] font-bold">{bean2Ratio}%</span>
                      </div>
                      <select
                        value={blend.bean2Id}
                        onChange={(e) => setBlend({ ...blend, bean2Id: e.target.value })}
                        className="w-full bg-[#0A0A0A] border border-[#2B261F] rounded-xl px-3 py-2 text-xs italic text-[#E5D7B8] focus:outline-none"
                      >
                        {roastedProducts.map(b => (
                          <option key={b.id} value={b.id}>{b.name} (Rp {(b.pricePerKg || 0).toLocaleString('id-ID')}/Kg)</option>
                        ))}
                      </select>
                    </div>

                    {/* Preset Rasio */}
                    <div className="space-y-2">
                      <label className="text-xs italic text-[#A69C83]">Pilih Rasio Racikan (A : B):</label>
                      <div className="grid grid-cols-3 gap-3">
                        {(['50:50', '60:40', '70:30'] as const).map(preset => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => setBlend({ ...blend, ratioPreset: preset })}
                            className={`py-2 rounded-xl text-xs font-serif italic border transition-all ${
                              blend.ratioPreset === preset 
                                ? 'bg-[#E5D7B8] text-[#111111] border-[#E5D7B8] font-bold shadow-md' 
                                : 'bg-[#14120F] text-[#A69C83] border-[#2B261F] hover:text-[#E5D7B8]'
                            }`}
                          >
                            Ratio {preset}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Grind & Weight */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs italic text-[#A69C83] mb-1">Grind Size</label>
                        <select
                          value={blend.grindSize}
                          onChange={(e) => setBlend({ ...blend, grindSize: e.target.value })}
                          className="w-full bg-[#14120F] border border-[#2B261F] rounded-xl px-3 py-2 text-xs italic text-[#E5D7B8]"
                        >
                          <option>Biji Utuh (Whole Bean)</option>
                          <option>Kasar (French Press)</option>
                          <option>Sedang (Filter/Drip)</option>
                          <option>Halus (Espresso)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs italic text-[#A69C83] mb-1">Quantity (Gram)</label>
                        <input
                          type="number"
                          min="200"
                          step="50"
                          value={blend.weightGram}
                          onChange={(e) => setBlend({ ...blend, weightGram: Math.max(200, parseInt(e.target.value) || 200) })}
                          className="w-full bg-[#14120F] border border-[#2B261F] rounded-xl px-3 py-2 text-xs text-[#E5D7B8]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Summary Card */}
                  <div className="bg-[#14120F] border border-[#2B261F] rounded-2xl p-5 flex flex-col justify-between">
                    <div className="space-y-3 text-xs italic">
                      <h3 className="font-serif text-[#D4AF37] border-b border-[#2B261F] pb-2">Blend Order Summary</h3>
                      <div className="flex justify-between text-[#A69C83]">
                        <span>Blend Ratio:</span>
                        <span className="text-[#E5D7B8] font-bold">{blend.ratioPreset}</span>
                      </div>
                      <div className="flex justify-between text-[#A69C83]">
                        <span>Weight:</span>
                        <span className="text-[#E5D7B8]">{blend.weightGram} Gram</span>
                      </div>
                      <div className="border-t border-[#2B261F] pt-3 flex justify-between text-sm font-serif font-bold text-[#E5D7B8]">
                        <span>Total Tagihan:</span>
                        <span className="text-[#D4AF37]">Rp {totalCustomBlendPrice.toLocaleString('id-ID')}</span>
                      </div>
                    </div>

                    <button
                      onClick={addCustomBlendToCart}
                      className="w-full mt-6 bg-[#E5D7B8] hover:bg-[#D4AF37] text-[#111111] font-serif italic font-bold py-3 rounded-xl transition-all shadow-md flex items-center justify-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Blend to Cart</span>
                    </button>
                  </div>
                </div>
              )}
            </section>

            {/* KATALOG PRODUK */}
            <section className="space-y-6">
              <div className="flex justify-between items-center border-b border-[#2B261F] pb-3">
                <h2 className="text-xl font-serif italic text-[#E5D7B8]">Official Coffee Catalog</h2>
                <button 
                  onClick={() => fetchProducts()} 
                  className="p-2 bg-[#0A0A0A] border border-[#2B261F] rounded-xl text-xs italic text-[#A69C83] hover:text-[#D4AF37] flex items-center space-x-1"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Sync Cloud</span>
                </button>
              </div>

              {visibleProducts.length === 0 ? (
                <p className="text-xs text-[#A69C83] italic text-center py-8">Katalog produk belum tersedia.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {visibleProducts.map((p) => {
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
                                <span>Exclusive</span>
                              </span>
                            )}
                          </div>

                          <h3 className="text-base font-serif text-[#E5D7B8] mt-3">{p.name}</h3>
                          <p className="text-xs text-[#A69C83] italic mt-1 line-clamp-2">{p.description}</p>
                          
                          <div className="mt-4 space-y-1.5 bg-[#14120F] p-3 rounded-xl border border-[#2B261F] text-xs italic">
                            {has1kg && (
                              <div className="flex justify-between text-[#A69C83]">
                                <span>Kemasan 1 Kg:</span>
                                <span className="text-[#D4AF37] font-bold">Rp {p.pricePerKg.toLocaleString('id-ID')}</span>
                              </div>
                            )}
                            {has200g ? (
                              <div className="flex justify-between text-[#A69C83]">
                                <span>Kemasan 200 Gram:</span>
                                <span className="text-[#D4AF37] font-bold">Rp {p.pricePer200g.toLocaleString('id-ID')}</span>
                              </div>
                            ) : (
                              <div className="flex justify-between text-[11px] text-rose-400/80">
                                <span>Kemasan 200 Gram:</span>
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
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => setCustomerType('cafe')}
                          className={`p-2.5 rounded-lg border italic font-serif transition-all ${
                            customerType === 'cafe' ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#E5D7B8]' : 'border-[#2B261F] text-[#A69C83]'
                          }`}
                        >
                          Cafe / Bisnis B2B
                        </button>
                        <button
                          type="button"
                          onClick={() => setCustomerType('perorangan')}
                          className={`p-2.5 rounded-lg border italic font-serif transition-all ${
                            customerType === 'perorangan' ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#E5D7B8]' : 'border-[#2B261F] text-[#A69C83]'
                          }`}
                        >
                          Perorangan
                        </button>
                      </div>

                      <input
                        type="text"
                        placeholder="Nama Lengkap Pemesan *"
                        required
                        value={customerInfo.name}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                        className="w-full bg-[#0A0A0A] border border-[#2B261F] rounded-lg px-3 py-2 text-xs italic text-[#E5D7B8]"
                      />
                      {customerType === 'cafe' && (
                        <input
                          type="text"
                          placeholder="Nama Cafe / Perusahaan Resmi *"
                          required
                          value={customerInfo.company}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, company: e.target.value })}
                          className="w-full bg-[#0A0A0A] border border-[#2B261F] rounded-lg px-3 py-2 text-xs italic text-[#E5D7B8]"
                        />
                      )}
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
                      {customerType === 'cafe' && (
                        <>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input type="radio" name="payment" checked={paymentMethod === 'kontra_bon_15'} onChange={() => setPaymentMethod('kontra_bon_15')} className="accent-[#D4AF37]" />
                            <span className="text-[#E5D7B8]">Kontra Bon (Net 15 Days)</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input type="radio" name="payment" checked={paymentMethod === 'kontra_bon_30'} onChange={() => setPaymentMethod('kontra_bon_30')} className="accent-[#D4AF37]" />
                            <span className="text-[#E5D7B8]">Kontra Bon (Net 30 Days)</span>
                          </label>
                        </>
                      )}
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
          /* SELLER ADMIN VIEW */
          !isAuthenticated ? (
            <div className="max-w-md mx-auto my-16 p-8 bg-[#0A0A0A] border border-[#2B261F] rounded-3xl text-center space-y-6 shadow-2xl">
              <KeyRound className="h-8 w-8 text-[#D4AF37] mx-auto" />
              <h2 className="text-lg font-serif italic text-[#E5D7B8]">Seller Protection Access</h2>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <input
                  type="password"
                  placeholder="Password..."
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-[#14120F] border border-[#2B261F] rounded-xl px-4 py-3 text-xs text-center text-[#E5D7B8] focus:outline-none"
                />
                {passwordError && <p className="text-xs text-rose-500 italic">Password salah!</p>}
                <button type="submit" className="w-full bg-[#E5D7B8] hover:bg-[#D4AF37] text-[#111111] font-serif italic font-bold py-2.5 rounded-xl text-xs">
                  Unlock Admin
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="bg-[#0A0A0A] border border-[#2B261F] p-6 rounded-3xl flex justify-between items-center">
                <h1 className="text-xl font-serif italic text-[#E5D7B8]">Epicurean Roastery Manager</h1>
                <div className="flex space-x-2">
                  <button onClick={() => setSellerSubTab('orders')} className={`px-4 py-2 rounded-xl text-xs italic font-serif ${sellerSubTab === 'orders' ? 'bg-[#E5D7B8] text-[#111111] font-bold' : 'text-[#A69C83]'}`}>Orders ({orders.length})</button>
                  <button onClick={() => setSellerSubTab('products')} className={`px-4 py-2 rounded-xl text-xs italic font-serif ${sellerSubTab === 'products' ? 'bg-[#E5D7B8] text-[#111111] font-bold' : 'text-[#A69C83]'}`}>Products & COGS</button>
                  <button onClick={() => setSellerSubTab('passcode')} className={`px-4 py-2 rounded-xl text-xs italic font-serif flex items-center space-x-1 ${sellerSubTab === 'passcode' ? 'bg-[#E5D7B8] text-[#111111] font-bold' : 'text-[#A69C83]'}`}>
                    <Settings className="h-3.5 w-3.5" />
                    <span>Passcode Blend</span>
                  </button>
                  <button onClick={() => setSellerSubTab('recap')} className={`px-4 py-2 rounded-xl text-xs italic font-serif ${sellerSubTab === 'recap' ? 'bg-[#E5D7B8] text-[#111111] font-bold' : 'text-[#A69C83]'}`}>Recap Sales</button>
                </div>
              </div>

              {sellerSubTab === 'passcode' && (
                <div className="max-w-xl mx-auto bg-[#0A0A0A] border border-[#2B261F] p-6 rounded-3xl space-y-5">
                  <div className="flex items-center space-x-3 border-b border-[#2B261F] pb-3">
                    <Key className="h-5 w-5 text-[#D4AF37]" />
                    <h3 className="text-base font-serif italic text-[#E5D7B8]">Pengaturan Passcode Blend Eksklusif</h3>
                  </div>

                  <p className="text-xs text-[#A69C83] italic">
                    Passcode aktif saat ini: <strong className="text-[#D4AF37] font-mono font-bold">{globalBlendPasscode}</strong>
                  </p>

                  <form onSubmit={handleUpdateGlobalPasscode} className="space-y-4">
                    <div>
                      <label className="block text-xs italic text-[#A69C83] mb-1">Ketik Passcode Baru</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: CAFEVIP2026"
                        value={newPasscodeForm}
                        onChange={(e) => setNewPasscodeForm(e.target.value)}
                        className="w-full bg-[#14120F] border border-[#2B261F] rounded-xl px-4 py-2.5 text-xs text-[#E5D7B8] uppercase font-mono"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-[#E5D7B8] hover:bg-[#D4AF37] text-[#111111] font-serif font-bold px-6 py-2.5 rounded-xl text-xs flex items-center space-x-2"
                    >
                      <Save className="h-4 w-4" />
                      <span>Simpan Passcode Baru</span>
                    </button>
                  </form>
                </div>
              )}

              {sellerSubTab === 'products' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {products.map((p) => (
                      <div key={p.id} className="bg-[#0A0A0A] border border-[#2B261F] p-5 rounded-2xl space-y-3 relative">
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] italic text-[#D4AF37]">{p.category}</span>
                          <div className="flex space-x-2">
                            <button onClick={() => handleOpenEditModal(p)} className="text-[#D4AF37] hover:text-amber-300 p-1 bg-[#14120F] rounded-md border border-[#2B261F]">
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                            <button onClick={() => handleDeleteProduct(p.id)} className="text-[#A69C83] hover:text-rose-400 p-1 bg-[#14120F] rounded-md border border-[#2B261F]">
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

                  <form onSubmit={handleSaveProduct} className="bg-[#0A0A0A] border border-[#2B261F] p-6 rounded-3xl space-y-4 text-xs italic">
                    <h3 className="text-sm font-serif text-[#E5D7B8]">Add New Product & COGS</h3>
                    <div className="grid grid-cols-2 gap-4">
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

                    <div className="grid grid-cols-3 gap-4 border-t border-[#2B261F] pt-3">
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

                    <button type="submit" className="bg-[#E5D7B8] hover:bg-[#D4AF37] text-[#111111] font-serif font-bold px-6 py-2.5 rounded-xl text-xs">
                      Save & Publish Product
                    </button>
                  </form>
                </div>
              )}

              {sellerSubTab === 'orders' && (
                <div className="bg-[#0A0A0A] border border-[#2B261F] p-6 rounded-3xl space-y-4 text-xs italic">
                  <h3 className="font-serif text-[#E5D7B8]">Incoming Orders</h3>
                  <div className="space-y-3">
                    {orders.map((o) => (
                      <div key={o.id} className="bg-[#14120F] p-4 rounded-xl border border-[#2B261F] flex justify-between items-center">
                        <div>
                          <p className="font-serif text-[#D4AF37]">{o.id} - {o.customerName} ({o.companyName})</p>
                          <p className="text-[11px] text-[#A69C83]">{o.paymentMethod.replace('_', ' ').toUpperCase()} | Total: Rp {o.totalAmount.toLocaleString('id-ID')}</p>
                        </div>
                        <select
                          value={o.status}
                          onChange={(e) => updateOrderStatus(o.id, e.target.value as Order['status'])}
                          className="bg-[#0A0A0A] border border-[#2B261F] px-3 py-1 rounded-lg text-xs italic text-[#E5D7B8]"
                        >
                          <option value="Pending Approval">Pending Approval</option>
                          <option value="Roasting Process">Roasting Process</option>
                          <option value="Ready for Shipping">Ready for Shipping</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {sellerSubTab === 'recap' && (
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-[#0A0A0A] border border-[#2B261F] p-6 rounded-3xl">
                    <p className="text-xs text-[#A69C83] italic">Total Omzet</p>
                    <p className="text-2xl font-serif text-[#D4AF37] mt-1">Rp {totalOmzet.toLocaleString('id-ID')}</p>
                  </div>
                </div>
              )}
            </div>
          )
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