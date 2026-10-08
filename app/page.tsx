'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Coffee, ShoppingCart, Calculator, Truck, CreditCard, 
  Plus, FileText, BarChart2, CheckCircle, Lock, KeyRound, 
  Trash2, Printer, AlertTriangle, Building2, User, Upload, Check, X,
  MessageSquare, ExternalLink, RefreshCw, ShieldAlert, Key, Unlock
} from 'lucide-react';

// Inisialisasi Supabase Client
const supabaseUrl = 'https://myqdhkwicdqgtrtqlead.supabase.co';
const supabaseAnonKey = 'sb_publishable_5lONdfpICE-bb0wuuRjnMg_M_R4ddih';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Interfaces
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

export default function EpicureanApp() {
  const [activeTab, setActiveTab] = useState<'storefront' | 'seller'>('storefront');
  const [sellerSubTab, setSellerSubTab] = useState<'orders' | 'products' | 'recap'>('orders');
  
  // Auth Password State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  // States
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // State Kode Rahasia Cafe (Storefront)
  const [userEnteredCode, setUserEnteredCode] = useState('');
  const [unlockedCodes, setUnlockedCodes] = useState<string[]>([]);
  const [codeSuccessMsg, setCodeSuccessMsg] = useState(false);

  // Load Data dari Supabase
  const fetchProducts = async () => {
    const { data, error } = await supabase.from('products').select('*');
    if (error) {
      console.error('Error fetching products:', error);
    } else if (data) {
      const formatted: Product[] = data.map(item => ({
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
      setProducts(formatted);
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

  // Handler Buka Kunci Produk Eksklusif Cafe
  const handleUnlockCode = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = userEnteredCode.trim().toUpperCase();
    if (!cleanCode) return;

    const matchedProducts = products.filter(
      p => p.isExclusive && p.exclusiveCode === cleanCode
    );

    if (matchedProducts.length > 0) {
      if (!unlockedCodes.includes(cleanCode)) {
        setUnlockedCodes([...unlockedCodes, cleanCode]);
      }
      setCodeSuccessMsg(true);
      setUserEnteredCode('');
      setTimeout(() => setCodeSuccessMsg(false), 3500);
    } else {
      alert('Referal/Access code not found. Please try again.');
    }
  };

  // Filter Produk Sesuai Akses
  const visibleProducts = products.filter(p => {
    if (!p.isExclusive) return true;
    return unlockedCodes.includes(p.exclusiveCode);
  });

  // Filter khusus Roasted Beans untuk Custom Blend
  const roastedProducts = products.filter(p => p.category === 'Roasted Beans');
  
  // State Blend 2 Tipe Biji
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
  const roastingAndPackagingCost = 25000;
  const bean1Obj = products.find(p => p.id === blend.bean1Id);
  const bean2Obj = products.find(p => p.id === blend.bean2Id);

  const priceBean1 = bean1Obj ? bean1Obj.pricePerKg : 150000;
  const priceBean2 = bean2Obj ? bean2Obj.pricePerKg : 150000;

  const calculatedBlendPricePerKg = Math.round(
    (bean1Ratio / 100) * priceBean1 +
    (bean2Ratio / 100) * priceBean2 +
    roastingAndPackagingCost
  );
  const calculatedBlendPricePerGram = calculatedBlendPricePerKg / 1000;

  // Cart & Customer State
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [customerType, setCustomerType] = useState<'perorangan' | 'cafe'>('cafe');
  const [destination, setDestination] = useState<'bandung' | 'luar_bandung'>('bandung');
  const [paymentMethod, setPaymentMethod] = useState<'transfer' | 'kontra_bon_15' | 'kontra_bon_30'>('kontra_bon_30');
  const [customerInfo, setCustomerInfo] = useState({ name: '', company: '', address: '', phone: '' });

  useEffect(() => {
    if (customerType === 'perorangan') {
      setPaymentMethod('transfer');
    }
  }, [customerType]);

  const totalCartWeightKg = cart.reduce((acc, item) => acc + item.quantityGram, 0) / 1000;
  const jneRatePerKg = 18000;
  const shippingCost = destination === 'bandung' ? 0 : Math.ceil(totalCartWeightKg) * jneRatePerKg;
  const cartSubtotal = cart.reduce((acc, item) => acc + item.totalPrice, 0);
  const grandTotal = cartSubtotal + shippingCost;

  // Active Submitted Order
  const [currentActiveOrder, setCurrentActiveOrder] = useState<Order | null>(null);
  const [paymentProofInput, setPaymentProofInput] = useState('');

  // Form Product State
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Roasted Beans' as Product['category'],
    pricePerKg: 150000,
    pricePer500g: 80000,
    pricePer200g: 35000,
    greenBeanCostPerKg: 90000,
    roastingCostPerKg: 15000,
    packagingCostPerKg: 10000,
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
      pricePerGram: calculatedBlendPricePerGram,
      totalPrice: Math.round(calculatedBlendPricePerGram * blend.weightGram),
      blendDetails: `Gilingan: ${blend.grindSize}`
    };
    setCart([...cart, newItem]);
  };

  const addProductToCart = (prod: Product, packType: '1kg' | '500g' | '200g') => {
    let weightGram = 1000;
    let price = prod.pricePerKg || 150000;
    let packLabel = 'Kemasan 1 Kg';

    if (packType === '500g') {
      weightGram = 500;
      price = prod.pricePer500g || 80000;
      packLabel = 'Kemasan 500 Gram';
    } else if (packType === '200g') {
      weightGram = 200;
      price = prod.pricePer200g || 35000;
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

  const handleUploadPaymentProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentActiveOrder || !paymentProofInput) return;

    const { error } = await supabase.from('orders').update({
      payment_proof: paymentProofInput
    }).eq('id', currentActiveOrder.id);

    if (error) {
      alert('Gagal menyimpan bukti pembayaran: ' + error.message);
    } else {
      setCurrentActiveOrder(prev => prev ? { ...prev, paymentProof: paymentProofInput } : null);
      fetchOrders();
      alert('Bukti pembayaran berhasil dicatat ke server!');
    }
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
      setProductForm({
        name: '',
        category: 'Roasted Beans',
        pricePerKg: 150000,
        pricePer500g: 80000,
        pricePer200g: 35000,
        greenBeanCostPerKg: 90000,
        roastingCostPerKg: 15000,
        packagingCostPerKg: 10000,
        packagingCostPer500g: 5000,
        packagingCostPer200g: 3000,
        description: '',
        isExclusive: false,
        exclusiveCode: ''
      });
      fetchProducts();
      alert('Produk baru berhasil disimpan ke katalog!');
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
  const totalEstimatedCOGS = orders.filter(o => o.status !== 'Rejected').reduce((acc, o) => acc + Math.round(o.subtotal * 0.65), 0);
  const totalGrossProfit = totalOmzet - totalEstimatedCOGS;
  const totalUnpaidKontraBon = orders
    .filter(o => o.paymentMethod.startsWith('kontra_bon') && o.status !== 'Rejected')
    .reduce((acc, o) => acc + o.totalAmount, 0);

  return (
    <div className="min-h-screen bg-[#111111] text-[#E8E2D5] font-serif antialiased selection:bg-[#D4AF37] selection:text-black">
      {/* CLASSIC VINTAGE HEADER BAR */}
      <header className="p-4 sm:p-6 max-w-7xl mx-auto">
        <div className="bg-[#0A0A0A] border border-[#2B261F] rounded-2xl px-6 py-4 flex flex-col sm:flex-row items-center justify-between shadow-2xl gap-4">
          
          {/* Logo Kiri dengan Ikon Daun Klasik */}
          <div className="flex items-center space-x-4 border-b sm:border-b-0 sm:border-r border-[#2B261F] pb-3 sm:pb-0 sm:pr-6">
            <div className="text-[#D4AF37]">
              {/* SVG Simbol Logo Klasik */}
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

          {/* Sub-teks Tengah */}
          <div className="hidden lg:block text-center text-xs italic text-[#A69C83] font-serif tracking-wide">
            Website Orders Coffee Beans Official From Epicurean
          </div>

          {/* Switcher Mode (Buyer / Seller) Klasik */}
          <div className="flex items-center bg-[#1A1815] border border-[#2B261F] p-1 rounded-full">
            <button
              onClick={() => setActiveTab('storefront')}
              className={`px-6 py-1.5 rounded-full text-xs italic font-serif transition-all ${
                activeTab === 'storefront' 
                  ? 'bg-[#E5D7B8] text-[#111111] font-bold shadow-md' 
                  : 'text-[#A69C83] hover:text-[#D4AF37]'
              }`}
            >
              Buyer
            </button>
            <button
              onClick={() => setActiveTab('seller')}
              className={`px-6 py-1.5 rounded-full text-xs italic font-serif transition-all ${
                activeTab === 'seller' 
                  ? 'bg-[#E5D7B8] text-[#111111] font-bold shadow-md' 
                  : 'text-[#A69C83] hover:text-[#D4AF37]'
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
            
            {/* HERO SECTION KLASIK */}
            <div className="text-center py-12 px-4 space-y-4">
              <h1 className="text-4xl sm:text-6xl font-normal tracking-wide text-[#E5D7B8] uppercase drop-shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                EPICUREAN
              </h1>
              <p className="text-lg sm:text-xl italic text-[#D4AF37] font-serif tracking-widest -mt-2">
                Coffee Company
              </p>
              <p className="text-xs sm:text-sm italic text-[#A69C83] max-w-xl mx-auto font-serif">
                Website Orders Coffee Beans Official From Epicurean
              </p>

              {/* BAR REFERAL CODE ELEGANT */}
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
                    ✓ Exclusive menu successfully unlocked!
                  </p>
                )}
                {unlockedCodes.length > 0 && (
                  <p className="text-[11px] text-[#D4AF37] mt-2 italic font-serif">
                    Unlocked Passcode: <strong>{unlockedCodes.join(', ')}</strong>
                  </p>
                )}
              </div>
            </div>

            {/* CUSTOM BLEND CONFIGURATOR */}
            <section className="bg-[#0A0A0A] border border-[#2B261F] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="border-b border-[#2B261F] pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-serif italic text-[#E5D7B8]">Custom Blend Configurator</h2>
                  <p className="text-xs text-[#A69C83] italic">Racik 2 jenis roasted beans pilihan dengan rasio persentase yang presisi</p>
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
                        <span>Price per Kg:</span>
                        <span className="text-[#D4AF37]">Rp {calculatedBlendPricePerKg.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between text-[#A69C83]">
                        <span>Weight:</span>
                        <span className="text-[#E5D7B8]">{blend.weightGram} Gram</span>
                      </div>
                      <div className="border-t border-[#2B261F] pt-3 flex justify-between text-sm font-serif font-bold text-[#E5D7B8]">
                        <span>Total Tagihan:</span>
                        <span className="text-[#D4AF37]">Rp {Math.round(calculatedBlendPricePerGram * blend.weightGram).toLocaleString('id-ID')}</span>
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
                  <span>Sync</span>
                </button>
              </div>

              {visibleProducts.length === 0 ? (
                <p className="text-xs text-[#A69C83] italic text-center py-8">Katalog produk belum tersedia.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {visibleProducts.map((p) => {
                    const has1kg = (p.pricePerKg || 0) > 0;
                    const has500g = (p.pricePer500g || 0) > 0;
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
                                <span>VIP Code: {p.exclusiveCode}</span>
                              </span>
                            )}
                          </div>

                          <h3 className="text-base font-serif text-[#E5D7B8] mt-3">{p.name}</h3>
                          <p className="text-xs text-[#A69C83] italic mt-1 line-clamp-2">{p.description}</p>
                          
                          <div className="mt-4 space-y-1.5 bg-[#14120F] p-3 rounded-xl border border-[#2B261F] text-xs italic">
                            {has1kg && (
                              <div className="flex justify-between text-[#A69C83]">
                                <span>1 Kg:</span>
                                <span className="text-[#D4AF37] font-bold">Rp {p.pricePerKg.toLocaleString('id-ID')}</span>
                              </div>
                            )}
                            {has500g ? (
                              <div className="flex justify-between text-[#A69C83]">
                                <span>500 Gram:</span>
                                <span className="text-[#D4AF37] font-bold">Rp {p.pricePer500g.toLocaleString('id-ID')}</span>
                              </div>
                            ) : (
                              <div className="flex justify-between text-[11px] text-rose-400/80">
                                <span>500 Gram:</span>
                                <span>N/A</span>
                              </div>
                            )}
                            {has200g ? (
                              <div className="flex justify-between text-[#A69C83]">
                                <span>200 Gram:</span>
                                <span className="text-[#D4AF37] font-bold">Rp {p.pricePer200g.toLocaleString('id-ID')}</span>
                              </div>
                            ) : (
                              <div className="flex justify-between text-[11px] text-rose-400/80">
                                <span>200 Gram:</span>
                                <span>N/A</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-1.5 mt-5">
                          {has200g ? (
                            <button onClick={() => addProductToCart(p, '200g')} className="bg-[#14120F] hover:bg-[#2B261F] text-[#E5D7B8] text-[10px] italic py-2 rounded-lg border border-[#2B261F]">
                              + 200g
                            </button>
                          ) : (
                            <button disabled className="bg-[#0A0A0A] text-[#443E33] text-[10px] italic py-2 rounded-lg border border-[#2B261F] cursor-not-allowed">N/A</button>
                          )}

                          {has500g ? (
                            <button onClick={() => addProductToCart(p, '500g')} className="bg-[#14120F] hover:bg-[#2B261F] text-[#E5D7B8] text-[10px] italic py-2 rounded-lg border border-[#2B261F]">
                              + 500g
                            </button>
                          ) : (
                            <button disabled className="bg-[#0A0A0A] text-[#443E33] text-[10px] italic py-2 rounded-lg border border-[#2B261F] cursor-not-allowed">N/A</button>
                          )}

                          {has1kg ? (
                            <button onClick={() => addProductToCart(p, '1kg')} className="bg-[#E5D7B8] hover:bg-[#D4AF37] text-[#111111] text-[10px] font-serif italic font-bold py-2 rounded-lg">
                              + 1 Kg
                            </button>
                          ) : (
                            <button disabled className="bg-[#0A0A0A] text-[#443E33] text-[10px] italic py-2 rounded-lg border border-[#2B261F] cursor-not-allowed">N/A</button>
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

                    {/* Form Pemesan */}
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
                    {/* Payment Method */}
                    <div className="bg-[#14120F] border border-[#2B261F] p-4 rounded-xl space-y-2 text-xs italic">
                      <p className="font-serif text-[#D4AF37]">Payment Terms</p>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="radio" name="payment" checked={paymentMethod === 'transfer'} onChange={() => setPaymentMethod('transfer')} className="accent-[#D4AF37]" />
                        <span className="text-[#E5D7B8]">Direct Bank Transfer (BCA: 7772400244 CV MULTI AGRI SENTOSA)</span>
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
                        <span>Ongkir ({destination === 'bandung' ? 'Kota Bandung' : 'Luar Bandung'}):</span>
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

              {/* WA DIRECT */}
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
                      <span>Send to Admin 1 (081931364302)</span>
                    </a>
                    <a
                      href={generateWhatsAppLink(currentActiveOrder, '6289654225095')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-serif italic rounded-xl flex items-center justify-center space-x-2"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>Send to Admin 2 (089654225095)</span>
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
                  <button onClick={() => setSellerSubTab('recap')} className={`px-4 py-2 rounded-xl text-xs italic font-serif ${sellerSubTab === 'recap' ? 'bg-[#E5D7B8] text-[#111111] font-bold' : 'text-[#A69C83]'}`}>Recap Sales</button>
                </div>
              </div>

              {sellerSubTab === 'products' && (
                <div className="space-y-8">
                  {/* List Produk Seller */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {products.map((p) => (
                      <div key={p.id} className="bg-[#0A0A0A] border border-[#2B261F] p-5 rounded-2xl space-y-3 relative">
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] italic text-[#D4AF37]">{p.category}</span>
                          <button onClick={() => handleDeleteProduct(p.id)} className="text-[#A69C83] hover:text-rose-400">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <h3 className="text-sm font-serif text-[#E5D7B8]">{p.name}</h3>
                        {p.isExclusive && <p className="text-[10px] text-purple-400 italic font-mono">VIP Code: {p.exclusiveCode}</p>}
                        <div className="text-xs italic text-[#A69C83]">
                          <p>1 Kg: Rp {(p.pricePerKg || 0).toLocaleString('id-ID')}</p>
                          <p>500g: Rp {(p.pricePer500g || 0).toLocaleString('id-ID')}</p>
                          <p>200g: Rp {(p.pricePer200g || 0).toLocaleString('id-ID')}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Form Input Produk Baru */}
                  <form onSubmit={handleSaveProduct} className="bg-[#0A0A0A] border border-[#2B261F] p-6 rounded-3xl space-y-4 text-xs italic">
                    <h3 className="text-sm font-serif text-[#E5D7B8]">Add New Product & VIP Code</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Nama Kopi / Blend *"
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

                    {/* Akses Mode */}
                    <div className="flex space-x-4 border-t border-[#2B261F] pt-3">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="radio" checked={!productForm.isExclusive} onChange={() => setProductForm({ ...productForm, isExclusive: false, exclusiveCode: '' })} className="accent-[#D4AF37]" />
                        <span>Public (Semua Pembeli)</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="radio" checked={productForm.isExclusive} onChange={() => setProductForm({ ...productForm, isExclusive: true })} className="accent-[#D4AF37]" />
                        <span>Exclusive Cafe (Gunakan VIP Code)</span>
                      </label>
                    </div>

                    {productForm.isExclusive && (
                      <input
                        type="text"
                        placeholder="Masukkan Passcode VIP (Contoh: CAFE-AMORA)"
                        required
                        value={productForm.exclusiveCode}
                        onChange={(e) => setProductForm({ ...productForm, exclusiveCode: e.target.value.toUpperCase() })}
                        className="w-full bg-[#14120F] border border-purple-900 rounded-xl px-3 py-2 text-[#E5D7B8] uppercase font-mono"
                      />
                    )}

                    <div className="grid grid-cols-3 gap-4 border-t border-[#2B261F] pt-3">
                      <div>
                        <label className="block mb-1 text-[#D4AF37]">Harga 1 Kg (IDR)</label>
                        <input type="number" value={productForm.pricePerKg} onChange={(e) => setProductForm({ ...productForm, pricePerKg: parseInt(e.target.value) || 0 })} className="w-full bg-[#14120F] border border-[#2B261F] rounded-xl px-3 py-2 text-[#E5D7B8]" />
                      </div>
                      <div>
                        <label className="block mb-1 text-[#D4AF37]">Harga 500g (Isi 0 jika N/A)</label>
                        <input type="number" value={productForm.pricePer500g} onChange={(e) => setProductForm({ ...productForm, pricePer500g: parseInt(e.target.value) || 0 })} className="w-full bg-[#14120F] border border-[#2B261F] rounded-xl px-3 py-2 text-[#E5D7B8]" />
                      </div>
                      <div>
                        <label className="block mb-1 text-[#D4AF37]">Harga 200g (Isi 0 jika N/A)</label>
                        <input type="number" value={productForm.pricePer200g} onChange={(e) => setProductForm({ ...productForm, pricePer200g: parseInt(e.target.value) || 0 })} className="w-full bg-[#14120F] border border-[#2B261F] rounded-xl px-3 py-2 text-[#E5D7B8]" />
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
                  <div className="bg-[#0A0A0A] border border-[#2B261F] p-6 rounded-3xl">
                    <p className="text-xs text-[#A69C83] italic">Unpaid Kontra Bon</p>
                    <p className="text-2xl font-serif text-purple-300 mt-1">Rp {totalUnpaidKontraBon.toLocaleString('id-ID')}</p>
                  </div>
                </div>
              )}
            </div>
          )
        )}
      </main>
    </div>
  );
}