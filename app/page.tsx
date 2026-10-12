'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Coffee, ShoppingCart, Lock,
  Trash2, User, X,
  MessageSquare, Edit3, LogOut, ArrowRight, ShieldCheck, Tag, Plus, Minus, BarChart2, Package, Calendar, Clock, Truck, CreditCard, Download, Search, MapPin
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
  shippingDate?: string;
  createdAt: string;
}

interface CustomerFeedback {
  id: string;
  customerName: string;
  companyName: string;
  customerPhone: string;
  category: 'Barang Kurang / Salah' | 'Roasting Profile Tidak Sesuai' | 'Kemasan Rusak' | 'Kendala Pengiriman' | 'Lainnya';
  orderId?: string;
  message: string;
  status: 'Open' | 'Resolved';
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
  { id: 'GB-1', name: 'Wanoja Avisani S (Green)', category: 'Green Beans', pricePerKg: 284000, pricePer500g: 0, pricePer200g: 0, greenBeanCostPerKg: 282500, roastingCostPerKg: 0, packagingCostPerKg: 2500, packagingCostPer500g: 0, packagingCostPer200g: 0, description: 'Greenbeans Wanoja Avisani S (Crop 2026)', isExclusive: false, exclusiveCode: '' },
  { id: 'GB-2', name: 'Wanoja Fullwash (Green)', category: 'Green Beans', pricePerKg: 198000, pricePer500g: 0, pricePer200g: 0, greenBeanCostPerKg: 190500, roastingCostPerKg: 0, packagingCostPerKg: 2500, packagingCostPer500g: 0, packagingCostPer200g: 0, description: 'Greenbeans Wanoja Fullwash', isExclusive: false, exclusiveCode: '' },
  { id: 'GB-3', name: 'Wanoja Natural (Green)', category: 'Green Beans', pricePerKg: 248000, pricePer500g: 0, pricePer200g: 0, greenBeanCostPerKg: 245500, roastingCostPerKg: 0, packagingCostPerKg: 2500, packagingCostPer500g: 0, packagingCostPer200g: 0, description: 'Greenbeans Wanoja Natural', isExclusive: false, exclusiveCode: '' },
  { id: 'RB-1', name: 'Wanoja Avisani Single Origin', category: 'Roasted Beans', pricePerKg: 225000, pricePer500g: 0, pricePer200g: 120000, greenBeanCostPerKg: 284000, roastingCostPerKg: 20000, packagingCostPerKg: 7500, packagingCostPer500g: 0, packagingCostPer200g: 9000, description: 'Wanoja Avisani Single Origin Roasted', isExclusive: false, exclusiveCode: '' },
  { id: 'RB-2', name: 'Wanoja Fullwash Single Origin', category: 'Roasted Beans', pricePerKg: 350000, pricePer500g: 0, pricePer200g: 120000, greenBeanCostPerKg: 193000, roastingCostPerKg: 20000, packagingCostPerKg: 7500, packagingCostPer500g: 0, packagingCostPer200g: 9000, description: 'Wanoja Fullwash Single Origin Roasted', isExclusive: false, exclusiveCode: '' },
  { id: 'RB-5', name: 'Kerinci Fullwash Single Origin', category: 'Roasted Beans', pricePerKg: 325000, pricePer500g: 0, pricePer200g: 120000, greenBeanCostPerKg: 160222, roastingCostPerKg: 20000, packagingCostPerKg: 7500, packagingCostPer500g: 0, packagingCostPer200g: 9000, description: 'Kerinci Fullwash Single Origin Roasted', isExclusive: false, exclusiveCode: '' },
  { id: 'BL-1', name: 'Railway Blend (50 KDH : 50 KWH)', category: 'Blend Beans', pricePerKg: 320000, pricePer500g: 0, pricePer200g: 75000, greenBeanCostPerKg: 224653, roastingCostPerKg: 20000, packagingCostPerKg: 7500, packagingCostPer500g: 0, packagingCostPer200g: 3000, description: 'Railway Blend: 50% Roasted KDH + 50% Roasted KWH', isExclusive: true, exclusiveCode: '', allowedResellers: ['RailwayCafe'] },
  { id: 'BL-2', name: 'Astria Blend (60 KDH : 40 Robusta)', category: 'Blend Beans', pricePerKg: 250000, pricePer500g: 0, pricePer200g: 60000, greenBeanCostPerKg: 190278, roastingCostPerKg: 20000, packagingCostPerKg: 7500, packagingCostPer500g: 0, packagingCostPer200g: 3000, description: 'Astria Blend: 60% Roasted KDH + 40% Roasted Robusta', isExclusive: true, exclusiveCode: '', allowedResellers: ['AstriaSolo'] },
  { id: 'BL-3', name: 'Brunswick Blend (50 KDH : 50 BNE)', category: 'Blend Beans', pricePerKg: 285000, pricePer500g: 0, pricePer200g: 68000, greenBeanCostPerKg: 243264, roastingCostPerKg: 20000, packagingCostPerKg: 7500, packagingCostPer500g: 0, packagingCostPer200g: 3000, description: 'Brunswick Blend: 50% Roasted KDH + 50% Roasted Flores', isExclusive: true, exclusiveCode: '', allowedResellers: ['BrunswickCafe'] },
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
  const [sellerSubTab, setSellerSubTab] = useState<'orders' | 'products' | 'feedbacks' | 'recap'>('orders');

  const [authForm, setAuthForm] = useState({ username: '', password: '', companyName: '' });
  const [authError, setAuthError] = useState('');

  const [activeCatalogTab, setActiveCatalogTab] = useState<'all' | 'Green Beans' | 'Roasted Beans' | 'Blend Beans'>('all');

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [feedbacks, setFeedbacks] = useState<CustomerFeedback[]>([]);

  const [searchOrderQuery, setSearchOrderQuery] = useState('');
  const [selectedCustomShippingDate, setSelectedCustomShippingDate] = useState('');
  const [dateValidationError, setDateValidationError] = useState('');

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  const [feedbackForm, setFeedbackForm] = useState({
    category: 'Roasting Profile Tidak Sesuai' as CustomerFeedback['category'],
    orderId: '',
    phone: '',
    message: ''
  });

  const [paymentProofFile, setPaymentProofFile] = useState<string>('');

  const scheduleInfo = calculateOrderSchedule();

  useEffect(() => {
    const savedUser = localStorage.getItem('epicurean_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setCurrentUser(parsed);
        setCurrentStep('main');
      } catch (e) {
        localStorage.removeItem('epicurean_user');
      }
    }
  }, []);

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
      setProducts(defaultProductsFromSpreadsheet);
    } else {
      setProducts(formatSupabaseProducts(data));
    }
  };

  const fetchOrders = async () => {
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (data) {
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
        shippingDate: item.shipping_date || item.estimated_shipping_date,
        createdAt: item.created_at
      }));
      setOrders(formatted);
    }
  };

  const fetchFeedbacks = async () => {
    const { data } = await supabase.from('customer_feedbacks').select('*').order('created_at', { ascending: false });
    if (data) {
      const formatted: CustomerFeedback[] = data.map(item => ({
        id: item.id,
        customerName: item.customer_name,
        companyName: item.company_name,
        customerPhone: item.customer_phone,
        category: item.category,
        orderId: item.order_id,
        message: item.message,
        status: item.status || 'Open',
        createdAt: item.created_at
      }));
      setFeedbacks(formatted);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchFeedbacks();
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

  const handleRoleSelection = (role: 'pembeli' | 'reseller' | 'seller') => {
    setSelectedRole(role);
    setAuthError('');
    setAuthForm({ username: '', password: '', companyName: '' });
    setCurrentStep('auth');
  };

  const saveUserSession = (user: UserAccount) => {
    setCurrentUser(user);
    localStorage.setItem('epicurean_user', JSON.stringify(user));
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (selectedRole === 'seller') {
      if (authForm.username === sellerAccount.username && authForm.password === sellerAccount.password) {
        saveUserSession(sellerAccount);
        setCurrentStep('main');
      } else {
        setAuthError('Username/Password Seller tidak sesuai.');
      }
    } else if (selectedRole === 'reseller') {
      const foundReseller = presetResellerAccounts.find(
        r => r.username.toLowerCase() === authForm.username.trim().toLowerCase() && r.password === authForm.password
      );
      if (foundReseller) {
        saveUserSession(foundReseller);
        setCustomerInfo(prev => ({ ...prev, company: foundReseller.companyName || '', name: foundReseller.username }));
        setCurrentStep('main');
      } else {
        setAuthError('Kredensial reseller tidak terdaftar.');
      }
    } else {
      if (!authForm.username.trim()) {
        setAuthError('Silakan isi nama Anda.');
        return;
      }
      const buyerUser: UserAccount = {
        username: authForm.username.trim(),
        role: 'pembeli',
        companyName: authForm.companyName || 'Pembeli Perorangan'
      };
      saveUserSession(buyerUser);
      setCustomerInfo(prev => ({ ...prev, name: buyerUser.username, company: buyerUser.companyName || '' }));
      setCurrentStep('main');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('epicurean_user');
    setCurrentUser(null);
    setCurrentStep('welcome');
    setCart([]);
  };

  const handleCustomShippingDateChange = (dateVal: string) => {
    setSelectedCustomShippingDate(dateVal);
    setDateValidationError('');

    if (!dateVal) return;

    const chosenDate = new Date(dateVal);
    const dayOfWeek = chosenDate.getDay();

    if (dayOfWeek !== 1 && dayOfWeek !== 2) {
      setDateValidationError('Jadwal pengiriman roastery HANYA melayani hari SENIN & SELASA.');
    }
  };

  const addProductToCart = (prod: Product, packType: '1kg' | '500g' | '200g', deltaQty: number = 1) => {
    let weightGram = 1000;
    let unitPrice = prod.pricePerKg || 200000;
    let packLabel = '1 Kg';

    if (packType === '200g') {
      weightGram = 200;
      unitPrice = prod.pricePer200g || 50000;
      packLabel = '200g';
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
    setCart(cart.map(item => item.id === itemId ? { ...item, quantity: newQty, totalPrice: item.unitPrice * newQty } : item));
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (dateValidationError) {
      alert('Mohon pilih hari Senin atau Selasa untuk tanggal pengiriman.');
      return;
    }

    const today = new Date();
    const finalShippingDate = selectedCustomShippingDate || scheduleInfo.shipping;

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
      paymentProof: paymentProofFile || undefined,
      items: cart,
      subtotal: cartSubtotal,
      totalAmount: grandTotal,
      status: 'Pending Approval',
      estimatedRoastingDate: scheduleInfo.roasting,
      estimatedShippingDate: scheduleInfo.shipping,
      shippingDate: finalShippingDate,
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
      payment_proof: newOrder.paymentProof,
      items: newOrder.items,
      subtotal: newOrder.subtotal,
      total_amount: newOrder.totalAmount,
      status: newOrder.status,
      shipping_date: newOrder.shippingDate,
      created_at: newOrder.createdAt
    });

    if (!error) {
      setCurrentActiveOrder(newOrder);
      setCart([]);
      fetchOrders();
    }
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackForm.message.trim()) return;

    const newFb: CustomerFeedback = {
      id: `FB-${Date.now().toString().slice(-5)}`,
      customerName: currentUser?.username || customerInfo.name || 'Pelanggan',
      companyName: currentUser?.companyName || customerInfo.company || 'Cafe',
      customerPhone: feedbackForm.phone || customerInfo.phone || '-',
      category: feedbackForm.category,
      orderId: feedbackForm.orderId || undefined,
      message: feedbackForm.message,
      status: 'Open',
      createdAt: new Date().toISOString().split('T')[0]
    };

    await supabase.from('customer_feedbacks').insert({
      id: newFb.id,
      customer_name: newFb.customerName,
      company_name: newFb.companyName,
      customer_phone: newFb.customerPhone,
      category: newFb.category,
      order_id: newFb.orderId,
      message: newFb.message,
      status: newFb.status,
      created_at: newFb.createdAt
    });

    alert('Pesan pengaduan terkirim ke roastery.');
    setIsFeedbackModalOpen(false);
    setFeedbackForm({ category: 'Roasting Profile Tidak Sesuai', orderId: '', phone: '', message: '' });
    fetchFeedbacks();
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    await supabase.from('orders').update({ status }).eq('id', orderId);
    fetchOrders();
  };

  const searchedOrders = orders.filter(o => {
    if (!searchOrderQuery.trim()) return true;
    const q = searchOrderQuery.toLowerCase();
    return o.id.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q) || o.companyName.toLowerCase().includes(q);
  });

  // STEP 1: WELCOME SCREEN (EDITORIAL MINIMALIST)
  if (currentStep === 'welcome') {
    return (
      <div className="min-h-screen bg-[#181614] text-[#EFECE6] font-sans flex flex-col justify-between p-6 sm:p-12">
        <header className="border-b border-[#2E2B27] pb-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Coffee className="h-5 w-5 text-[#C8A97E]" />
            <span className="font-serif tracking-widest text-sm text-[#EFECE6] uppercase">Epicurean Coffee Co.</span>
          </div>
          <span className="text-xs text-[#8C8479] tracking-wider uppercase">B2B & Specialty Roastery</span>
        </header>

        <main className="max-w-3xl my-auto py-12 space-y-8">
          <p className="text-xs tracking-widest text-[#C8A97E] uppercase font-mono">Order Management Portal</p>
          <h1 className="text-4xl sm:text-6xl font-serif font-normal tracking-tight leading-tight text-[#EFECE6]">
            Precision Roasting for Coffee Professionals.
          </h1>
          <p className="text-sm text-[#A39B8E] max-w-xl font-light leading-relaxed">
            Sistem pemesanan biji kopi terintegrasi untuk Mitra Cafe, Reseller Eksklusif, dan Pembeli Umum.
          </p>

          <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => handleRoleSelection('pembeli')}
              className="border border-[#38332E] hover:border-[#C8A97E] bg-[#1F1C19] p-5 text-left transition-all group"
            >
              <span className="text-xs text-[#8C8479] block mb-2 font-mono">01</span>
              <span className="text-sm font-serif text-[#EFECE6] group-hover:text-[#C8A97E] block">Portal Pembeli</span>
              <span className="text-[11px] text-[#8C8479] mt-1 block">Pemesanan Retail & Umum</span>
            </button>

            <button
              onClick={() => handleRoleSelection('reseller')}
              className="border border-[#38332E] hover:border-[#C8A97E] bg-[#1F1C19] p-5 text-left transition-all group"
            >
              <span className="text-xs text-[#8C8479] block mb-2 font-mono">02</span>
              <span className="text-sm font-serif text-[#EFECE6] group-hover:text-[#C8A97E] block">Mitra Reseller</span>
              <span className="text-[11px] text-[#8C8479] mt-1 block">Akses Custom House Blend</span>
            </button>

            <button
              onClick={() => handleRoleSelection('seller')}
              className="border border-[#38332E] hover:border-[#C8A97E] bg-[#1F1C19] p-5 text-left transition-all group"
            >
              <span className="text-xs text-[#8C8479] block mb-2 font-mono">03</span>
              <span className="text-sm font-serif text-[#EFECE6] group-hover:text-[#C8A97E] block">Roastery Admin</span>
              <span className="text-[11px] text-[#8C8479] mt-1 block">Manajemen & Order Tracking</span>
            </button>
          </div>
        </main>

        <footer className="border-t border-[#2E2B27] pt-6 flex justify-between text-xs text-[#8C8479] font-mono">
          <span>Epicurean Roastery © 2026</span>
          <span>Bandung, West Java</span>
        </footer>
      </div>
    );
  }

  // STEP 2: AUTH SCREEN (CLEAN FORM)
  if (currentStep === 'auth') {
    return (
      <div className="min-h-screen bg-[#181614] text-[#EFECE6] font-sans flex items-center justify-center p-6">
        <div className="max-w-md w-full border border-[#2E2B27] bg-[#1F1C19] p-8 space-y-6">
          <button
            onClick={() => setCurrentStep('welcome')}
            className="text-xs text-[#8C8479] hover:text-[#C8A97E] font-mono flex items-center space-x-1"
          >
            ← Kembali
          </button>

          <div>
            <span className="text-xs text-[#C8A97E] font-mono uppercase tracking-widest block mb-1">{selectedRole} Access</span>
            <h2 className="text-2xl font-serif text-[#EFECE6]">Masuk ke Akun</h2>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-[#A39B8E] mb-1 font-mono">Username / Identifier</label>
              <input
                type="text"
                required
                placeholder="Username akun..."
                value={authForm.username}
                onChange={(e) => setAuthForm({ ...authForm, username: e.target.value })}
                className="w-full bg-[#181614] border border-[#38332E] px-4 py-3 text-sm text-[#EFECE6] focus:border-[#C8A97E] focus:outline-none"
              />
            </div>

            {selectedRole !== 'pembeli' && (
              <div>
                <label className="block text-xs text-[#A39B8E] mb-1 font-mono">Password</label>
                <input
                  type="password"
                  required
                  placeholder="Ketik password..."
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  className="w-full bg-[#181614] border border-[#38332E] px-4 py-3 text-sm text-[#EFECE6] focus:border-[#C8A97E] focus:outline-none"
                />
              </div>
            )}

            {authError && <p className="text-xs text-rose-400 font-mono">{authError}</p>}

            <button
              type="submit"
              className="w-full bg-[#C8A97E] hover:bg-[#b5956a] text-[#181614] font-medium py-3 text-sm transition-all font-mono uppercase tracking-wider"
            >
              Masuk Sistem
            </button>
          </form>
        </div>
      </div>
    );
  }

  // STEP 3: MAIN APP (MINIMALIST EDITORIAL ROASTERY)
  return (
    <div className="min-h-screen bg-[#181614] text-[#EFECE6] font-sans antialiased pb-24">
      {/* HEADER */}
      <header className="border-b border-[#2E2B27] sticky top-0 bg-[#181614]/90 backdrop-blur-md z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Coffee className="h-5 w-5 text-[#C8A97E]" />
            <span className="font-serif text-base tracking-widest text-[#EFECE6] uppercase">Epicurean</span>
          </div>

          <div className="flex items-center space-x-4">
            {currentUser?.role !== 'seller' && (
              <>
                <button
                  onClick={() => setIsFeedbackModalOpen(true)}
                  className="text-xs text-[#A39B8E] hover:text-[#C8A97E] flex items-center space-x-1 font-mono"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Komplain</span>
                </button>

                <button
                  onClick={() => setIsCartDrawerOpen(true)}
                  className="border border-[#38332E] bg-[#1F1C19] px-3 py-1.5 flex items-center space-x-2 hover:border-[#C8A97E] transition-all text-xs font-mono"
                >
                  <ShoppingCart className="h-3.5 w-3.5 text-[#C8A97E]" />
                  <span>Cart ({totalCartUnits})</span>
                </button>
              </>
            )}

            <div className="flex items-center space-x-3 text-xs border-l border-[#2E2B27] pl-4">
              <span className="text-[#A39B8E] font-mono">{currentUser?.username}</span>
              <button onClick={handleLogout} className="text-[#8C8479] hover:text-rose-400">
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {currentUser?.role !== 'seller' ? (
          /* KATALOG UTAMA (PEMBELI/RESELLER) */
          <div className="space-y-8">
            {/* ROASTING & SHIPPING SCHEDULE BANNER */}
            <div className="border border-[#2E2B27] bg-[#1F1C19] p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1 border-b md:border-b-0 md:border-r border-[#2E2B27] pb-4 md:pb-0 md:pr-4">
                <div className="flex items-center space-x-2 text-xs text-[#C8A97E] font-mono uppercase">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Cut-off Pemesanan</span>
                </div>
                <p className="text-sm font-serif text-[#EFECE6]">Setiap Hari Selasa</p>
                <p className="text-xs text-[#8C8479]">Batas akhir order masuk batch minggu ini.</p>
              </div>

              <div className="space-y-1 border-b md:border-b-0 md:border-r border-[#2E2B27] pb-4 md:pb-0 md:pr-4">
                <div className="flex items-center space-x-2 text-xs text-emerald-400 font-mono uppercase">
                  <Coffee className="h-3.5 w-3.5" />
                  <span>Jadwal Sangrai</span>
                </div>
                <p className="text-sm font-serif text-[#EFECE6]">Rabu & Kamis</p>
                <p className="text-xs text-[#8C8479]">Biji kopi disangrai fresh sesuai kuota pesanan.</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-xs text-sky-400 font-mono uppercase">
                  <Truck className="h-3.5 w-3.5" />
                  <span>Pengiriman Khusus</span>
                </div>
                <p className="text-sm font-serif text-[#EFECE6]">Senin & Selasa</p>
                <p className="text-xs text-[#8C8479]">Pengiriman diselesaikan pada hari Senin / Selasa.</p>
              </div>
            </div>

            {/* TAB KATALOG & GRID PRODUK */}
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-[#2E2B27] pb-4">
                <h2 className="text-xl font-serif text-[#EFECE6]">Pilihan Biji Kopi</h2>

                <div className="flex space-x-2 text-xs font-mono">
                  {['all', 'Green Beans', 'Roasted Beans', 'Blend Beans'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCatalogTab(cat as any)}
                      className={`px-3 py-1.5 transition-all ${
                        activeCatalogTab === cat ? 'bg-[#C8A97E] text-[#181614] font-medium' : 'text-[#8C8479] hover:text-[#EFECE6]'
                      }`}
                    >
                      {cat === 'all' ? 'Semua' : cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredProducts.map((p) => (
                  <div key={p.id} className="border border-[#2E2B27] bg-[#1F1C19] p-6 flex flex-col justify-between space-y-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs font-mono text-[#8C8479]">
                        <span>{p.category}</span>
                        {p.isExclusive && <span className="text-purple-400">Exclusive Blend</span>}
                      </div>

                      <h3 className="text-lg font-serif text-[#EFECE6]">{p.name}</h3>
                      <p className="text-xs text-[#A39B8E] leading-relaxed font-light">{p.description}</p>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-[#2E2B27]">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-[#8C8479]">Kemasan 1 Kg</span>
                        <span className="text-[#C8A97E]">Rp {p.pricePerKg.toLocaleString('id-ID')}</span>
                      </div>

                      <div className="flex justify-between items-center pt-2">
                        <span className="text-xs font-mono text-[#8C8479]">Order 1 Kg</span>
                        <button
                          onClick={() => addProductToCart(p, '1kg', 1)}
                          className="border border-[#38332E] hover:border-[#C8A97E] bg-[#181614] text-xs font-mono text-[#EFECE6] px-4 py-2 transition-all"
                        >
                          + Tambah
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* DASHBOARD SELLER / ROASTERY MANAGER */
          <div className="space-y-8">
            <div className="flex justify-between items-center border-b border-[#2E2B27] pb-4">
              <h1 className="text-xl font-serif text-[#EFECE6]">Fulfillment & Order Control</h1>

              <div className="flex space-x-2 text-xs font-mono">
                <button
                  onClick={() => setSellerSubTab('orders')}
                  className={`px-4 py-2 ${sellerSubTab === 'orders' ? 'bg-[#C8A97E] text-[#181614]' : 'text-[#8C8479]'}`}
                >
                  Orders ({orders.length})
                </button>
                <button
                  onClick={() => setSellerSubTab('feedbacks')}
                  className={`px-4 py-2 ${sellerSubTab === 'feedbacks' ? 'bg-[#C8A97E] text-[#181614]' : 'text-[#8C8479]'}`}
                >
                  Pengaduan ({feedbacks.length})
                </button>
              </div>
            </div>

            {sellerSubTab === 'orders' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="relative w-72">
                    <Search className="h-3.5 w-3.5 text-[#8C8479] absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Cari ID / Nama Pemesan..."
                      value={searchOrderQuery}
                      onChange={(e) => setSearchOrderQuery(e.target.value)}
                      className="w-full bg-[#1F1C19] border border-[#2E2B27] pl-9 pr-3 py-2 text-xs font-mono text-[#EFECE6] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="border border-[#2E2B27] bg-[#1F1C19] divide-y divide-[#2E2B27]">
                  {searchedOrders.map((o) => (
                    <div key={o.id} className="p-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-xs font-mono text-[#C8A97E]">{o.id}</span>
                          <h3 className="text-base font-serif text-[#EFECE6]">{o.customerName} ({o.companyName})</h3>
                          <p className="text-xs text-[#8C8479] font-mono mt-0.5">Tgl Order: {o.createdAt} | Phone: {o.customerPhone}</p>
                        </div>

                        <div className="flex items-center space-x-3">
                          <span className="text-xs font-mono text-[#8C8479]">Status:</span>
                          <select
                            value={o.status}
                            onChange={(e) => updateOrderStatus(o.id, e.target.value as Order['status'])}
                            className="bg-[#181614] border border-[#38332E] px-3 py-1.5 text-xs font-mono text-[#EFECE6] focus:outline-none"
                          >
                            <option value="Pending Approval">Pending Approval</option>
                            <option value="Roasting Process">Roasting Process</option>
                            <option value="Ready for Shipping">Ready for Shipping</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono bg-[#181614] p-4 border border-[#2E2B27]">
                        <div>
                          <span className="text-[#8C8479] block">Tgl Kirim Pilihan Cust:</span>
                          <span className="text-[#EFECE6] font-medium">{o.shippingDate || '-'}</span>
                        </div>
                        <div>
                          <span className="text-[#8C8479] block">Metode Pembayaran:</span>
                          <span className="text-[#EFECE6] uppercase">{o.paymentMethod}</span>
                        </div>
                        <div>
                          <span className="text-[#8C8479] block">Total Tagihan:</span>
                          <span className="text-[#C8A97E] font-medium">Rp {o.totalAmount.toLocaleString('id-ID')}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* DRAWER CHECKOUT & SELEKSI TANGGAL KIRIM (SENIN/SELASA ONLY) */}
      {isCartDrawerOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex justify-end">
          <div className="bg-[#1F1C19] border-l border-[#2E2B27] w-full max-w-md h-full overflow-y-auto p-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-[#2E2B27] pb-4">
                <h2 className="text-lg font-serif text-[#EFECE6]">Order Checkout</h2>
                <button onClick={() => setIsCartDrawerOpen(false)} className="text-[#8C8479] hover:text-[#EFECE6]">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-xs font-mono py-2 border-b border-[#2E2B27]">
                  <div>
                    <p className="text-[#EFECE6] font-serif text-sm">{item.name}</p>
                    <p className="text-[#8C8479]">{item.quantity} x Rp {item.unitPrice.toLocaleString('id-ID')}</p>
                  </div>
                  <p className="text-[#C8A97E]">Rp {item.totalPrice.toLocaleString('id-ID')}</p>
                </div>
              ))}

              <form onSubmit={handleCheckout} id="checkout-form" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label className="block text-xs font-mono text-[#C8A97E] uppercase">
                    Pilih Tanggal Pengiriman (Hanya Senin / Selasa)
                  </label>
                  <input
                    type="date"
                    value={selectedCustomShippingDate}
                    onChange={(e) => handleCustomShippingDateChange(e.target.value)}
                    className="w-full bg-[#181614] border border-[#38332E] px-3 py-2 text-xs font-mono text-[#EFECE6] focus:border-[#C8A97E] focus:outline-none"
                  />
                  {dateValidationError && (
                    <p className="text-xs text-rose-400 font-mono italic">{dateValidationError}</p>
                  )}
                </div>

                <div className="space-y-3 pt-2">
                  <input
                    type="text"
                    required
                    placeholder="Nama Pemesan *"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    className="w-full bg-[#181614] border border-[#38332E] px-3 py-2 text-xs font-mono text-[#EFECE6]"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Nama Cafe / Perusahaan *"
                    value={customerInfo.company}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, company: e.target.value })}
                    className="w-full bg-[#181614] border border-[#38332E] px-3 py-2 text-xs font-mono text-[#EFECE6]"
                  />
                  <input
                    type="text"
                    required
                    placeholder="No WhatsApp *"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    className="w-full bg-[#181614] border border-[#38332E] px-3 py-2 text-xs font-mono text-[#EFECE6]"
                  />
                  <textarea
                    required
                    rows={2}
                    placeholder="Alamat Pengiriman Lengkap *"
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                    className="w-full bg-[#181614] border border-[#38332E] px-3 py-2 text-xs font-mono text-[#EFECE6]"
                  />
                </div>
              </form>
            </div>

            <div className="pt-6 border-t border-[#2E2B27] space-y-4">
              <div className="flex justify-between font-serif text-base">
                <span>Total Tagihan</span>
                <span className="text-[#C8A97E]">Rp {grandTotal.toLocaleString('id-ID')}</span>
              </div>

              <button
                type="submit"
                form="checkout-form"
                disabled={Boolean(dateValidationError)}
                className={`w-full py-3 text-xs font-mono uppercase tracking-wider transition-all ${
                  dateValidationError ? 'bg-[#2E2B27] text-[#8C8479] cursor-not-allowed' : 'bg-[#C8A97E] hover:bg-[#b5956a] text-[#181614] font-medium'
                }`}
              >
                Submit Pre-Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}