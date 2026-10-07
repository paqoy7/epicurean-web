'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Coffee, ShoppingCart, Calculator, Truck, CreditCard, 
  Plus, FileText, BarChart2, CheckCircle, Lock, KeyRound, 
  Trash2, Printer, AlertTriangle, Building2, User, Upload, Check, X,
  MessageSquare, ExternalLink, RefreshCw, ShieldAlert
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
        description: item.description || ''
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

  // Filter khusus Roasted Beans untuk Custom Blend
  const roastedProducts = products.filter(p => p.category === 'Roasted Beans');
  
  // State Blend 2 Tipe Biji & Rasio Pilihan (50:50, 60:40, 70:30)
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

  // Ekstraksi Rasio Blend
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
    category: 'Green Beans' as Product['category'],
    pricePerKg: 150000,
    pricePer500g: 80000,
    pricePer200g: 35000,
    greenBeanCostPerKg: 90000,
    roastingCostPerKg: 15000,
    packagingCostPerKg: 10000,
    packagingCostPer500g: 5000,
    packagingCostPer200g: 3000,
    description: ''
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
      description: productForm.description
    });

    if (error) {
      alert('Gagal menyimpan produk: ' + error.message);
    } else {
      setProductForm({
        name: '',
        category: 'Green Beans',
        pricePerKg: 150000,
        pricePer500g: 80000,
        pricePer200g: 35000,
        greenBeanCostPerKg: 90000,
        roastingCostPerKg: 15000,
        packagingCostPerKg: 10000,
        packagingCostPer500g: 5000,
        packagingCostPer200g: 3000,
        description: ''
      });
      fetchProducts();
    }
  };

  const handleDeleteProduct = async (id: string) => {
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
    <div className="min-h-screen bg-[#121110] text-[#E2E2E2] font-sans antialiased">
      {/* Header Bar */}
      <header className="border-b border-[#262422] bg-[#1A1816]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-tr from-[#D97706] to-[#F59E0B] p-2.5 rounded-xl text-black shadow-lg shadow-[#F59E0B]/20">
              <Coffee className="h-6 w-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xl font-black tracking-wider text-white">EPICUREAN<span className="text-[#F59E0B]">.id</span></span>
              <p className="text-[10px] text-[#F59E0B] font-bold tracking-widest uppercase -mt-0.5">B2B & ENTERPRISE COFFEE SUPPLY</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 bg-[#0F0E0D] p-1.5 rounded-xl border border-[#262422]">
            <button
              onClick={() => setActiveTab('storefront')}
              className={`px-5 py-2 rounded-lg text-xs font-extrabold transition-all ${
                activeTab === 'storefront' ? 'bg-[#262422] text-white shadow' : 'text-[#A19D95] hover:text-white'
              }`}
            >
              Storefront
            </button>
            <button
              onClick={() => setActiveTab('seller')}
              className={`px-5 py-2 rounded-lg text-xs font-extrabold transition-all flex items-center space-x-1.5 ${
                activeTab === 'seller' ? 'bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-black shadow-lg shadow-[#F59E0B]/20' : 'text-[#A19D95] hover:text-white'
              }`}
            >
              <BarChart2 className="h-4 w-4" />
              <span>Seller Admin</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'storefront' ? (
          <div className="space-y-10">
            {/* Banner Header */}
            <div className="text-center py-10 bg-[#1A1816] border border-[#262422] rounded-3xl shadow-2xl relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-60 h-60 bg-[#F59E0B]/5 rounded-full blur-3xl pointer-events-none"></div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                EPICUREAN<span className="text-[#F59E0B]">.id</span>
              </h1>
              <p className="text-[#A19D95] max-w-2xl mx-auto text-sm sm:text-base mt-2 font-medium">
                Platform Pre-Order Kopi B2B & Custom Blend Roastery.
              </p>
            </div>

            {/* Custom Blend Configurator */}
            <section className="bg-[#1A1816] border border-[#262422] rounded-3xl p-6 sm:p-8 shadow-2xl">
              <div className="flex items-center space-x-3 mb-6 border-b border-[#262422] pb-4">
                <Calculator className="h-6 w-6 text-[#F59E0B]" />
                <div>
                  <h2 className="text-xl font-extrabold text-white">Custom Blend Configurator (2 Tipe Biji)</h2>
                  <p className="text-xs text-[#A19D95]">Kombinasi 2 jenis Roasted Beans dengan pilihan rasio racikan roastery</p>
                </div>
              </div>

              {roastedProducts.length < 2 ? (
                <div className="p-6 bg-[#121110] border border-[#262422] rounded-2xl text-center text-xs text-[#A19D95]">
                  Dibutuhkan minimal 2 produk ber-kategori <strong>Roasted Beans</strong> pada katalog untuk mengaktifkan fitur Custom Blend. Tambahkan produk di Seller Admin.
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    {/* Bean 1 Selection */}
                    <div className="bg-[#121110] p-4 rounded-2xl border border-[#262422] space-y-2">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-[#A19D95]">Biji Kopi Komponen A:</span>
                        <span className="text-[#F59E0B] font-black text-sm">{bean1Ratio}%</span>
                      </div>
                      <select
                        value={blend.bean1Id}
                        onChange={(e) => setBlend({ ...blend, bean1Id: e.target.value })}
                        className="w-full bg-[#1A1816] border border-[#33302D] rounded-xl px-3 py-2 text-white font-bold text-xs focus:ring-1 focus:ring-[#F59E0B]"
                      >
                        {roastedProducts.map(b => (
                          <option key={b.id} value={b.id}>{b.name} (Rp {(b.pricePerKg || 0).toLocaleString('id-ID')}/Kg)</option>
                        ))}
                      </select>
                    </div>

                    {/* Bean 2 Selection */}
                    <div className="bg-[#121110] p-4 rounded-2xl border border-[#262422] space-y-2">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-[#A19D95]">Biji Kopi Komponen B:</span>
                        <span className="text-[#F59E0B] font-black text-sm">{bean2Ratio}%</span>
                      </div>
                      <select
                        value={blend.bean2Id}
                        onChange={(e) => setBlend({ ...blend, bean2Id: e.target.value })}
                        className="w-full bg-[#1A1816] border border-[#33302D] rounded-xl px-3 py-2 text-white font-bold text-xs focus:ring-1 focus:ring-[#F59E0B]"
                      >
                        {roastedProducts.map(b => (
                          <option key={b.id} value={b.id}>{b.name} (Rp {(b.pricePerKg || 0).toLocaleString('id-ID')}/Kg)</option>
                        ))}
                      </select>
                    </div>

                    {/* Pilihan Rasio Presets (50:50, 60:40, 70:30) */}
                    <div className="bg-[#121110] p-4 rounded-2xl border border-[#262422] space-y-3">
                      <label className="block text-xs font-bold text-white">Pilih Proporsi Rasio Racikan (A : B)</label>
                      <div className="grid grid-cols-3 gap-3">
                        {(['50:50', '60:40', '70:30'] as const).map(preset => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => setBlend({ ...blend, ratioPreset: preset })}
                            className={`py-2.5 rounded-xl border text-xs font-black transition-all ${
                              blend.ratioPreset === preset 
                                ? 'bg-[#F59E0B] text-black border-[#F59E0B] shadow-lg shadow-[#F59E0B]/20' 
                                : 'bg-[#1A1816] text-[#A19D95] border-[#262422] hover:text-white'
                            }`}
                          >
                            Rasio {preset}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Weight & Grind */}
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="block text-xs font-bold text-[#A19D95] mb-1">Ukuran Gilingan</label>
                        <select
                          value={blend.grindSize}
                          onChange={(e) => setBlend({ ...blend, grindSize: e.target.value })}
                          className="w-full bg-[#121110] border border-[#262422] rounded-xl px-3 py-2.5 text-xs text-[#E2E2E2]"
                        >
                          <option>Biji Utuh (Whole Bean)</option>
                          <option>Kasar (French Press)</option>
                          <option>Sedang (Drip/Filter)</option>
                          <option>Halus (Espresso)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#A19D95] mb-1">Jumlah Order (Gram)</label>
                        <input
                          type="number"
                          min="200"
                          step="50"
                          value={blend.weightGram}
                          onChange={(e) => setBlend({ ...blend, weightGram: Math.max(200, parseInt(e.target.value) || 200) })}
                          className="w-full bg-[#121110] border border-[#262422] rounded-xl px-3 py-2.5 text-xs text-[#E2E2E2]"
                        />
                        <span className="text-[10px] text-[#F59E0B] mt-1 block font-bold">*Min. Order 200 Gram</span>
                      </div>
                    </div>
                  </div>

                  {/* Price Output Card */}
                  <div className="bg-[#121110] border border-[#262422] rounded-2xl p-6 flex flex-col justify-between shadow-inner">
                    <div>
                      <h3 className="text-xs font-bold text-[#A19D95] uppercase tracking-wider mb-4">Ringkasan Kalkulasi Blend</h3>
                      <div className="space-y-3 text-xs">
                        <div className="flex justify-between">
                          <span className="text-[#A19D95]">Rasio Blend:</span>
                          <span className="font-extrabold text-white">{blend.ratioPreset}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#A19D95]">Harga Blend / Kg:</span>
                          <span className="font-extrabold text-[#F59E0B]">Rp {calculatedBlendPricePerKg.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#A19D95]">Total Berat:</span>
                          <span className="font-bold text-white">{blend.weightGram} Gram</span>
                        </div>
                        <div className="border-t border-[#262422] pt-3 flex justify-between text-base font-black text-white">
                          <span>Total Tagihan:</span>
                          <span className="text-[#F59E0B]">Rp {Math.round(calculatedBlendPricePerGram * blend.weightGram).toLocaleString('id-ID')}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={addCustomBlendToCart}
                      className="w-full mt-6 bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:brightness-110 text-black font-black py-3.5 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-lg shadow-[#F59E0B]/20"
                    >
                      <Plus className="h-4 w-4 stroke-[3]" />
                      <span>Tambah Blend ke Order</span>
                    </button>
                  </div>
                </div>
              )}
            </section>

            {/* Katalog Standar dengan Seleksi Opsi Kemasan Otomatis */}
            <section className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-extrabold text-white">Katalog Ready-to-Roast</h2>
                <button 
                  onClick={() => fetchProducts()} 
                  className="p-2 bg-[#1A1816] border border-[#262422] rounded-xl text-xs text-[#A19D95] hover:text-white flex items-center space-x-1"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Sync Cloud</span>
                </button>
              </div>

              {products.length === 0 ? (
                <p className="text-xs text-[#A19D95]">Belum ada produk di database server. Silakan tambah produk di Seller Admin.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {products.map((p) => {
                    const has1kg = (p.pricePerKg || 0) > 0;
                    const has500g = (p.pricePer500g || 0) > 0;
                    const has200g = (p.pricePer200g || 0) > 0;

                    return (
                      <div key={p.id} className="bg-[#1A1816] border border-[#262422] rounded-2xl p-5 flex flex-col justify-between hover:border-[#33302D] transition-all shadow-lg">
                        <div>
                          <span className={`text-[10px] uppercase font-black tracking-wider px-3 py-1 rounded-full border ${
                            p.category === 'Green Beans' 
                              ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/50' 
                              : p.category === 'Roasted Beans'
                              ? 'bg-amber-950/60 text-amber-400 border-amber-800/50'
                              : 'bg-orange-950/60 text-orange-400 border-orange-800/50'
                          }`}>
                            {p.category}
                          </span>
                          <h3 className="text-sm font-extrabold text-white mt-3">{p.name}</h3>
                          <p className="text-xs text-[#A19D95] mt-1 line-clamp-2">{p.description}</p>
                          
                          <div className="mt-4 space-y-1.5 bg-[#121110] p-3 rounded-xl border border-[#262422]">
                            {has1kg && (
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-[#A19D95]">Kemasan 1 Kg:</span>
                                <span className="text-[#F59E0B] font-black">Rp {p.pricePerKg.toLocaleString('id-ID')}</span>
                              </div>
                            )}
                            {has500g ? (
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-[#A19D95]">Kemasan 500 Gram:</span>
                                <span className="text-[#F59E0B] font-black">Rp {p.pricePer500g.toLocaleString('id-ID')}</span>
                              </div>
                            ) : (
                              <div className="flex justify-between items-center text-[11px] text-rose-400/80 italic">
                                <span>Kemasan 500 Gram:</span>
                                <span>Tidak Tersedia</span>
                              </div>
                            )}
                            {has200g ? (
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-[#A19D95]">Kemasan 200 Gram:</span>
                                <span className="text-[#F59E0B] font-black">Rp {p.pricePer200g.toLocaleString('id-ID')}</span>
                              </div>
                            ) : (
                              <div className="flex justify-between items-center text-[11px] text-rose-400/80 italic">
                                <span>Kemasan 200 Gram:</span>
                                <span>Tidak Tersedia</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Tombol Tambah ke Cart Sesuai Ketersediaan Varian */}
                        <div className="grid grid-cols-3 gap-1.5 mt-5">
                          {has200g ? (
                            <button
                              onClick={() => addProductToCart(p, '200g')}
                              className="bg-[#262422] hover:bg-[#33302d] text-white text-[10px] font-bold py-2 rounded-lg transition-all"
                            >
                              + 200g
                            </button>
                          ) : (
                            <button disabled className="bg-[#121110] text-[#A19D95]/40 text-[10px] font-bold py-2 rounded-lg border border-[#262422] cursor-not-allowed">
                              N/A 200g
                            </button>
                          )}

                          {has500g ? (
                            <button
                              onClick={() => addProductToCart(p, '500g')}
                              className="bg-[#262422] hover:bg-[#33302d] text-white text-[10px] font-bold py-2 rounded-lg transition-all"
                            >
                              + 500g
                            </button>
                          ) : (
                            <button disabled className="bg-[#121110] text-[#A19D95]/40 text-[10px] font-bold py-2 rounded-lg border border-[#262422] cursor-not-allowed">
                              N/A 500g
                            </button>
                          )}

                          {has1kg ? (
                            <button
                              onClick={() => addProductToCart(p, '1kg')}
                              className="bg-[#F59E0B]/10 hover:bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30 text-[10px] font-bold py-2 rounded-lg transition-all"
                            >
                              + 1 Kg
                            </button>
                          ) : (
                            <button disabled className="bg-[#121110] text-[#A19D95]/40 text-[10px] font-bold py-2 rounded-lg border border-[#262422] cursor-not-allowed">
                              N/A 1 Kg
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Checkout Form */}
            <section className="bg-[#1A1816] border border-[#262422] rounded-3xl p-6 sm:p-8">
              <div className="flex items-center space-x-3 mb-6 border-b border-[#262422] pb-4">
                <ShoppingCart className="h-6 w-6 text-[#F59E0B]" />
                <h2 className="text-xl font-extrabold text-white">Keranjang & Checkout Pre-Order</h2>
              </div>

              {cart.length === 0 ? (
                <p className="text-xs text-[#A19D95] text-center py-8">Keranjang belanja Anda masih kosong.</p>
              ) : (
                <form onSubmit={handleCheckout} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-3">
                      {cart.map((item) => (
                        <div key={item.id} className="bg-[#121110] border border-[#262422] p-4 rounded-xl flex justify-between items-center text-xs">
                          <div>
                            <p className="font-bold text-white">{item.name}</p>
                            <p className="text-[#A19D95] mt-0.5">{item.quantityGram} Gram</p>
                          </div>
                          <p className="font-extrabold text-[#F59E0B]">Rp {item.totalPrice.toLocaleString('id-ID')}</p>
                        </div>
                      ))}
                    </div>

                    {/* Kategori Pembeli & Peringatan Verifikasi B2B */}
                    <div className="bg-[#121110] border border-[#262422] p-4 rounded-xl space-y-4">
                      <div className="p-3 bg-amber-950/40 border border-amber-700/50 rounded-xl flex items-start space-x-3">
                        <ShieldAlert className="h-5 w-5 text-[#F59E0B] shrink-0 mt-0.5" />
                        <div className="text-[11px] space-y-1">
                          <p className="font-bold text-[#F59E0B]">Ketentuan Kategori Pemesan B2B & Perorangan:</p>
                          <p className="text-[#D4D0C7]">
                            • <strong className="text-white">Cafe / Bisnis B2B:</strong> Berhak menggunakan fasilitas <strong>Kontra Bon (Net 15/30)</strong>. Wajib menyertakan Nama Cafe/Perusahaan resmi. Setiap pesanan akan diverifikasi oleh Admin. <span className="text-rose-400 font-bold">Pesanan yang tidak sesuai dengan kualifikasi akun bisnis akan ditolak langsung oleh Admin.</span>
                          </p>
                          <p className="text-[#D4D0C7]">
                            • <strong className="text-white">Perorangan:</strong> Wajib menggunakan pembayaran <strong>Direct Transfer (BCA)</strong> sebelum pesanan diproses sangrai (*roasting*).
                          </p>
                        </div>
                      </div>

                      <p className="text-xs font-bold text-white flex items-center space-x-2">
                        <Building2 className="h-4 w-4 text-[#F59E0B]" />
                        <span>Pilih Kategori Pembeli</span>
                      </p>

                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setCustomerType('cafe')}
                          className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center space-x-2 ${
                            customerType === 'cafe' ? 'border-[#F59E0B] bg-[#F59E0B]/10 text-white' : 'border-[#262422] text-[#A19D95]'
                          }`}
                        >
                          <Building2 className="h-4 w-4" />
                          <div>
                            <p className="font-bold">Cafe / Bisnis B2B</p>
                            <p className="text-[10px] text-[#F59E0B] mt-0.5 font-bold">Opsi Kontra Bon (Diverifikasi Admin)</p>
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setCustomerType('perorangan')}
                          className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center space-x-2 ${
                            customerType === 'perorangan' ? 'border-[#F59E0B] bg-[#F59E0B]/10 text-white' : 'border-[#262422] text-[#A19D95]'
                          }`}
                        >
                          <User className="h-4 w-4" />
                          <div>
                            <p className="font-bold">Perorangan</p>
                            <p className="text-[10px] text-emerald-400 mt-0.5 font-bold">Wajib Direct Transfer</p>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Opsi Pengiriman */}
                    <div className="bg-[#121110] border border-[#262422] p-4 rounded-xl space-y-3">
                      <p className="text-xs font-bold text-white flex items-center space-x-2">
                        <Truck className="h-4 w-4 text-[#F59E0B]" />
                        <span>Opsi Pengiriman Wilayah</span>
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setDestination('bandung')}
                          className={`p-3 rounded-xl border text-left text-xs transition-all ${
                            destination === 'bandung' ? 'border-[#F59E0B] bg-[#F59E0B]/10 text-white' : 'border-[#262422] text-[#A19D95]'
                          }`}
                        >
                          <p className="font-bold">Kota Bandung</p>
                          <p className="text-[10px] text-emerald-400 mt-0.5 font-bold">DIRECT BANDUNG (Bebas Ongkir)</p>
                        </button>
                        <button
                          type="button"
                          onClick={() => setDestination('luar_bandung')}
                          className={`p-3 rounded-xl border text-left text-xs transition-all ${
                            destination === 'luar_bandung' ? 'border-[#F59E0B] bg-[#F59E0B]/10 text-white' : 'border-[#262422] text-[#A19D95]'
                          }`}
                        >
                          <p className="font-bold">Luar Bandung</p>
                          <p className="text-[10px] text-[#F59E0B] mt-0.5 font-bold">Ekspedisi JNE (Ditanggung Customer)</p>
                        </button>
                      </div>
                    </div>

                    {/* Metode Pembayaran */}
                    <div className="bg-[#121110] border border-[#262422] p-4 rounded-xl space-y-3">
                      <p className="text-xs font-bold text-white flex items-center space-x-2">
                        <CreditCard className="h-4 w-4 text-[#F59E0B]" />
                        <span>Metode Pembayaran</span>
                      </p>
                      <div className="space-y-2 text-xs">
                        <label className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer ${
                          paymentMethod === 'transfer' ? 'border-[#F59E0B] bg-[#F59E0B]/10' : 'border-[#262422]'
                        }`}>
                          <input type="radio" name="payment" checked={paymentMethod === 'transfer'} onChange={() => setPaymentMethod('transfer')} className="accent-[#F59E0B]" />
                          <div>
                            <p className="font-bold text-white">Transfer Direct Rekening Perusahaan</p>
                            <p className="text-[10px] text-[#F59E0B] font-bold">7772400244 a/n MULTI AGRI SENTOSA CV</p>
                          </div>
                        </label>

                        {customerType === 'cafe' && (
                          <>
                            <label className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer ${
                              paymentMethod === 'kontra_bon_15' ? 'border-[#F59E0B] bg-[#F59E0B]/10' : 'border-[#262422]'
                            }`}>
                              <input type="radio" name="payment" checked={paymentMethod === 'kontra_bon_15'} onChange={() => setPaymentMethod('kontra_bon_15')} className="accent-[#F59E0B]" />
                              <div>
                                <p className="font-bold text-white">Kontra Bon (Net 15 Hari)</p>
                                <p className="text-[10px] text-[#F59E0B]">Khusus Cafe - Jatuh Tempo +15 Hari</p>
                              </div>
                            </label>

                            <label className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer ${
                              paymentMethod === 'kontra_bon_30' ? 'border-[#F59E0B] bg-[#F59E0B]/10' : 'border-[#262422]'
                            }`}>
                              <input type="radio" name="payment" checked={paymentMethod === 'kontra_bon_30'} onChange={() => setPaymentMethod('kontra_bon_30')} className="accent-[#F59E0B]" />
                              <div>
                                <p className="font-bold text-white">Kontra Bon (Net 30 Hari)</p>
                                <p className="text-[10px] text-[#F59E0B]">Khusus Cafe - Jatuh Tempo +30 Hari</p>
                              </div>
                            </label>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-[#121110] border border-[#262422] p-4 rounded-xl space-y-3">
                      <h3 className="text-xs font-bold text-white">Detail Identitas Pemesan</h3>
                      <input
                        type="text"
                        placeholder="Nama Lengkap Penanggung Jawab *"
                        required
                        value={customerInfo.name}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                        className="w-full bg-[#1A1816] border border-[#262422] rounded-lg px-3 py-2 text-xs text-white focus:border-[#F59E0B] focus:outline-none"
                      />
                      {customerType === 'cafe' && (
                        <input
                          type="text"
                          placeholder="Nama Perusahaan / Legalitas Cafe *"
                          required
                          value={customerInfo.company}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, company: e.target.value })}
                          className="w-full bg-[#1A1816] border border-[#262422] rounded-lg px-3 py-2 text-xs text-white focus:border-[#F59E0B] focus:outline-none"
                        />
                      )}
                      <input
                        type="text"
                        placeholder="Nomor WhatsApp *"
                        required
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                        className="w-full bg-[#1A1816] border border-[#262422] rounded-lg px-3 py-2 text-xs text-white focus:border-[#F59E0B] focus:outline-none"
                      />
                      <textarea
                        placeholder="Alamat Pengiriman Lengkap *"
                        required
                        rows={2}
                        value={customerInfo.address}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                        className="w-full bg-[#1A1816] border border-[#262422] rounded-lg px-3 py-2 text-xs text-white focus:border-[#F59E0B] focus:outline-none"
                      />
                    </div>

                    <div className="bg-[#121110] border border-[#262422] p-4 rounded-xl space-y-2 text-xs">
                      <div className="flex justify-between text-[#A19D95]">
                        <span>Subtotal Produk:</span>
                        <span>Rp {cartSubtotal.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between text-[#A19D95]">
                        <span>Ongkos Kirim ({destination === 'bandung' ? 'Bebas Ongkir' : `JNE (${totalCartWeightKg.toFixed(1)} Kg)`}):</span>
                        <span className={shippingCost === 0 ? 'text-emerald-400 font-bold' : ''}>
                          {shippingCost === 0 ? 'Rp 0' : `Rp ${shippingCost.toLocaleString('id-ID')}`}
                        </span>
                      </div>
                      <div className="border-t border-[#262422] pt-2 flex justify-between text-base font-black text-white">
                        <span>Grand Total:</span>
                        <span className="text-[#F59E0B]">Rp {grandTotal.toLocaleString('id-ID')}</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-950/40"
                    >
                      Kirim Pre-Order Digital
                    </button>
                  </div>
                </form>
              )}

              {/* Halaman Upload Bukti & Dual WhatsApp Direct */}
              {currentActiveOrder && (
                <div className="mt-8 p-6 bg-[#121110] border border-emerald-800/80 rounded-2xl space-y-4 shadow-xl">
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center space-x-2 text-emerald-400 font-extrabold text-sm">
                      <CheckCircle className="h-5 w-5" />
                      <span>Pre-Order Terdaftar! (ID: {currentActiveOrder.id})</span>
                    </div>

                    <p className="text-xs text-[#A19D95]">Kirim rincian tagihan ini ke Admin Roastery via WhatsApp:</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <a
                        href={generateWhatsAppLink(currentActiveOrder, '6281931364302')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-2 transition-all shadow-lg"
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span>Kirim WA Admin 1 (081931364302)</span>
                      </a>
                      <a
                        href={generateWhatsAppLink(currentActiveOrder, '6289654225095')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-2 transition-all shadow-lg"
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span>Kirim WA Admin 2 (089654225095)</span>
                      </a>
                    </div>
                  </div>
                  
                  <div className="text-xs space-y-1 text-[#E2E2E2] pt-2 border-t border-[#262422]">
                    <p><span className="text-[#A19D95]">Atas Nama:</span> {currentActiveOrder.customerName} ({currentActiveOrder.companyName})</p>
                    <p><span className="text-[#A19D95]">Total Tagihan:</span> <strong className="text-[#F59E0B]">Rp {currentActiveOrder.totalAmount.toLocaleString('id-ID')}</strong></p>
                    <p><span className="text-[#A19D95]">Status Approval:</span> <span className="text-yellow-400 font-bold">{currentActiveOrder.status}</span></p>
                  </div>

                  {currentActiveOrder.paymentMethod === 'transfer' && (
                    <div className="pt-4 border-t border-[#262422] space-y-3">
                      <div className="p-3 bg-[#1A1816] rounded-xl border border-[#262422]">
                        <p className="text-xs font-bold text-[#F59E0B]">Instruksi Pembayaran Transfer Direct:</p>
                        <p className="text-xs text-white mt-1">Bank BCA: <strong>7772400244</strong></p>
                        <p className="text-xs text-[#A19D95]">a/n MULTI AGRI SENTOSA CV</p>
                      </div>

                      <form onSubmit={handleUploadPaymentProof} className="space-y-3">
                        <label className="block text-xs font-bold text-[#A19D95]">Input Ref / Catatan Pembayaran</label>
                        <input
                          type="text"
                          required
                          placeholder="Contoh: Ref BCA 8839201"
                          value={paymentProofInput}
                          onChange={(e) => setPaymentProofInput(e.target.value)}
                          className="w-full bg-[#1A1816] border border-[#262422] rounded-xl px-3 py-2 text-xs text-white"
                        />
                        <button
                          type="submit"
                          className="bg-[#F59E0B] text-black font-extrabold px-4 py-2 rounded-xl text-xs flex items-center space-x-2"
                        >
                          <Upload className="h-4 w-4" />
                          <span>Simpan Catatan Pembayaran</span>
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>
        ) : (
          /* SELLER ADMIN VIEW */
          !isAuthenticated ? (
            <div className="max-w-md mx-auto my-16 p-8 bg-[#1A1816] border border-[#262422] rounded-3xl text-center space-y-6 shadow-2xl">
              <div className="mx-auto w-12 h-12 bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-2xl flex items-center justify-center">
                <KeyRound className="h-6 w-6 text-[#F59E0B]" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-white">Seller Admin Protection</h2>
                <p className="text-xs text-[#A19D95] mt-1">Masukkan kata sandi otorisasi untuk mengakses Roastery Manager.</p>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <input
                  type="password"
                  placeholder="Password..."
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-[#121110] border border-[#262422] rounded-xl px-4 py-3 text-sm text-center text-white focus:outline-none focus:border-[#F59E0B]"
                />
                {passwordError && (
                  <p className="text-xs text-rose-500 flex items-center justify-center space-x-1">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span>Password salah! Silakan coba lagi.</span>
                  </p>
                )}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-black font-extrabold py-3 rounded-xl text-xs transition-all shadow-lg"
                >
                  Unlock Access
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="bg-[#1A1816] border border-[#262422] p-6 rounded-3xl space-y-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <h1 className="text-2xl font-black text-white tracking-tight flex items-center space-x-3">
                      <BarChart2 className="h-7 w-7 text-[#F59E0B]" />
                      <span>Dashboard Penjual & Roastery Manager</span>
                    </h1>
                    <p className="text-xs text-[#A19D95] mt-1">Kelola produk, approval pembayaran transfer, pantau antrean, dan atur COGS (HPP).</p>
                  </div>
                  <div className="flex items-center space-x-2 bg-[#0F0E0D] p-1.5 rounded-2xl border border-[#262422]">
                    <button
                      onClick={() => setSellerSubTab('orders')}
                      className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                        sellerSubTab === 'orders' ? 'bg-[#F59E0B] text-black shadow' : 'text-[#A19D95] hover:text-white'
                      }`}
                    >
                      Daftar Pesanan ({orders.length})
                    </button>
                    <button
                      onClick={() => setSellerSubTab('products')}
                      className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                        sellerSubTab === 'products' ? 'bg-[#F59E0B] text-black shadow' : 'text-[#A19D95] hover:text-white'
                      }`}
                    >
                      Produk & COGS (HPP)
                    </button>
                    <button
                      onClick={() => setSellerSubTab('recap')}
                      className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                        sellerSubTab === 'recap' ? 'bg-[#F59E0B] text-black shadow' : 'text-[#A19D95] hover:text-white'
                      }`}
                    >
                      Rekap Sales & Margin
                    </button>
                  </div>
                </div>
              </div>

              {sellerSubTab === 'orders' && (
                <section className="bg-[#1A1816] border border-[#262422] p-6 sm:p-8 rounded-3xl space-y-6">
                  <div className="flex justify-between items-center border-b border-[#262422] pb-4">
                    <h2 className="text-lg font-extrabold text-white">Daftar Antrean Order & Approval Pembayaran</h2>
                    <span className="text-xs text-[#A19D95]">Total {orders.length} Order Masuk</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-[#E2E2E2]">
                      <thead className="bg-[#121110] text-[#A19D95] uppercase font-bold text-[10px] tracking-wider">
                        <tr>
                          <th className="p-4 rounded-l-xl">ID Order</th>
                          <th className="p-4">Pelanggan / Tipe</th>
                          <th className="p-4">Metode & Bukti Bayar</th>
                          <th className="p-4">Status & Approval</th>
                          <th className="p-4">Total Tagihan</th>
                          <th className="p-4 text-center rounded-r-xl">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#262422]">
                        {orders.map((o) => (
                          <tr key={o.id} className="hover:bg-[#121110]/50 transition-all">
                            <td className="p-4 font-mono font-bold text-[#F59E0B]">
                              <p className="text-sm">{o.id}</p>
                              <p className="text-[10px] text-[#A19D95] font-normal">{o.createdAt}</p>
                            </td>
                            <td className="p-4">
                              <p className="font-extrabold text-white text-sm">{o.customerName}</p>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-[#262422] text-[#F59E0B] uppercase font-bold">
                                {o.customerType}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className={`px-2.5 py-1 rounded-md text-[10px] font-black ${
                                o.paymentMethod.startsWith('kontra_bon') ? 'bg-purple-950 text-purple-300 border border-purple-800' : 'bg-blue-950 text-blue-300 border border-blue-800'
                              }`}>
                                {o.paymentMethod.replace('_', ' ').toUpperCase()}
                              </span>
                              {o.paymentProof && (
                                <p className="text-[10px] text-emerald-400 font-mono mt-1">Bukti: {o.paymentProof}</p>
                              )}
                            </td>
                            <td className="p-4">
                              <div className="flex items-center space-x-2">
                                <select
                                  value={o.status}
                                  onChange={(e) => updateOrderStatus(o.id, e.target.value as Order['status'])}
                                  className="bg-[#121110] border border-[#262422] px-3 py-1.5 rounded-xl text-xs font-bold text-white focus:outline-none"
                                >
                                  <option value="Pending Approval">Pending Approval</option>
                                  <option value="Roasting Process">Roasting Process</option>
                                  <option value="Ready for Shipping">Ready for Shipping</option>
                                  <option value="Delivered">Delivered</option>
                                  <option value="Rejected">Rejected</option>
                                </select>
                                {o.status === 'Pending Approval' && (
                                  <button
                                    onClick={() => updateOrderStatus(o.id, 'Roasting Process')}
                                    className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg"
                                    title="Approve Order"
                                  >
                                    <Check className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                            </td>
                            <td className="p-4 font-black text-white text-sm">
                              Rp {o.totalAmount.toLocaleString('id-ID')}
                            </td>
                            <td className="p-4 text-center">
                              <button
                                onClick={() => window.print()}
                                className="p-2 bg-[#121110] hover:bg-[#262422] border border-[#262422] rounded-xl text-[#A19D95] hover:text-white transition-all"
                                title="Cetak Invoice PDF Digital"
                              >
                                <Printer className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {sellerSubTab === 'products' && (
                <div className="space-y-8">
                  {/* List Produk Seller */}
                  <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {products.map((p) => {
                      const adjustedGreenBeanCost = Math.round((p.greenBeanCostPerKg || 0) / 0.85);

                      // COGS 1 Kg
                      const totalCogsKg = adjustedGreenBeanCost + (p.roastingCostPerKg || 0) + (p.packagingCostPerKg || 0);
                      const profitKg = (p.pricePerKg || 0) - totalCogsKg;
                      const marginPctKg = p.pricePerKg ? ((profitKg / p.pricePerKg) * 100).toFixed(1) : '0';

                      // COGS 500g
                      const totalCogs500g = Math.round((adjustedGreenBeanCost + (p.roastingCostPerKg || 0)) * 0.5) + (p.packagingCostPer500g || 0);
                      const profit500g = (p.pricePer500g || 0) - totalCogs500g;
                      const marginPct500g = p.pricePer500g ? ((profit500g / p.pricePer500g) * 100).toFixed(1) : '0';

                      // COGS 200g
                      const totalCogs200g = Math.round((adjustedGreenBeanCost + (p.roastingCostPerKg || 0)) * 0.2) + (p.packagingCostPer200g || 0);
                      const profit200g = (p.pricePer200g || 0) - totalCogs200g;
                      const marginPct200g = p.pricePer200g ? ((profit200g / p.pricePer200g) * 100).toFixed(1) : '0';

                      return (
                        <div key={p.id} className="bg-[#1A1816] border border-[#262422] p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-lg">
                          <div>
                            <div className="flex justify-between items-start">
                              <span className={`text-[10px] uppercase font-black tracking-wider px-3 py-1 rounded-full border ${
                                p.category === 'Green Beans' 
                                  ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/50' 
                                  : p.category === 'Roasted Beans'
                                  ? 'bg-amber-950/60 text-amber-400 border-amber-800/50'
                                  : 'bg-orange-950/60 text-orange-400 border-orange-800/50'
                              }`}>
                                {p.category}
                              </span>
                              <button 
                                onClick={() => handleDeleteProduct(p.id)} 
                                className="p-1.5 text-[#A19D95] hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-all"
                                title="Hapus Produk"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                            <h3 className="text-base font-extrabold text-white mt-3">{p.name}</h3>

                            {/* Rincian Kemasan 1 Kg */}
                            <div className="bg-[#121110] p-2.5 rounded-2xl border border-[#262422] mt-3 space-y-1">
                              <p className="text-[10px] font-black text-[#F59E0B] uppercase">KEMASAN 1 KG</p>
                              <div className="flex justify-between text-xs text-[#A19D95]">
                                <span>Harga: <strong className="text-white">Rp {(p.pricePerKg || 0).toLocaleString('id-ID')}</strong></span>
                                <span>COGS: <strong className="text-rose-400">Rp {totalCogsKg.toLocaleString('id-ID')}</strong></span>
                              </div>
                              <p className="text-[10px] text-emerald-400 font-bold text-right pt-0.5">Margin: Rp {profitKg.toLocaleString('id-ID')} ({marginPctKg}%)</p>
                            </div>

                            {/* Rincian Kemasan 500g */}
                            <div className="bg-[#121110] p-2.5 rounded-2xl border border-[#262422] mt-2 space-y-1">
                              <p className="text-[10px] font-black text-[#F59E0B] uppercase">KEMASAN 500 GRAM</p>
                              <div className="flex justify-between text-xs text-[#A19D95]">
                                <span>Harga: <strong className={p.pricePer500g ? "text-white" : "text-rose-400 font-bold"}>{p.pricePer500g ? `Rp ${p.pricePer500g.toLocaleString('id-ID')}` : 'Tidak Dijual'}</strong></span>
                                {p.pricePer500g > 0 && <span>COGS: <strong className="text-rose-400">Rp {totalCogs500g.toLocaleString('id-ID')}</strong></span>}
                              </div>
                              {p.pricePer500g > 0 && <p className="text-[10px] text-emerald-400 font-bold text-right pt-0.5">Margin: Rp {profit500g.toLocaleString('id-ID')} ({marginPct500g}%)</p>}
                            </div>

                            {/* Rincian Kemasan 200g */}
                            <div className="bg-[#121110] p-2.5 rounded-2xl border border-[#262422] mt-2 space-y-1">
                              <p className="text-[10px] font-black text-[#F59E0B] uppercase">KEMASAN 200 GRAM</p>
                              <div className="flex justify-between text-xs text-[#A19D95]">
                                <span>Harga: <strong className={p.pricePer200g ? "text-white" : "text-rose-400 font-bold"}>{p.pricePer200g ? `Rp ${p.pricePer200g.toLocaleString('id-ID')}` : 'Tidak Dijual'}</strong></span>
                                {p.pricePer200g > 0 && <span>COGS: <strong className="text-rose-400">Rp {totalCogs200g.toLocaleString('id-ID')}</strong></span>}
                              </div>
                              {p.pricePer200g > 0 && <p className="text-[10px] text-emerald-400 font-bold text-right pt-0.5">Margin: Rp {profit200g.toLocaleString('id-ID')} ({marginPct200g}%)</p>}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </section>

                  {/* Form Tambah Produk */}
                  <section className="bg-[#1A1816] border border-[#262422] p-6 sm:p-8 rounded-3xl space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-lg font-extrabold text-white">Tambah Produk & Ketersediaan Varian Kemasan</h2>
                      <p className="text-xs text-[#F59E0B] font-bold">*Isi angka 0 pada harga jika varian 500g / 200g tidak dijual</p>
                    </div>

                    <form onSubmit={handleSaveProduct} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-[#A19D95] mb-1">Nama Produk Kopi</label>
                          <input
                            type="text"
                            required
                            placeholder="Contoh: Arabica Flores Bajawa"
                            value={productForm.name}
                            onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                            className="w-full bg-[#121110] border border-[#262422] rounded-xl px-4 py-2.5 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-[#A19D95] mb-1">Kategori Produk</label>
                          <select
                            value={productForm.category}
                            onChange={(e) => setProductForm({ ...productForm, category: e.target.value as Product['category'] })}
                            className="w-full bg-[#121110] border border-[#262422] rounded-xl px-4 py-2.5 text-xs text-white font-bold"
                          >
                            <option value="Green Beans">Green Beans</option>
                            <option value="Roasted Beans">Roasted Beans</option>
                            <option value="Blend Beans">Blend Beans</option>
                          </select>
                        </div>
                      </div>

                      {/* Penetapan Harga 3 Kemasan (Bisa Diisi 0 jika tidak dijual) */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-[#F59E0B] mb-1">Harga Kemasan 1 Kg (IDR)</label>
                          <input
                            type="number"
                            required
                            value={productForm.pricePerKg}
                            onChange={(e) => setProductForm({ ...productForm, pricePerKg: parseInt(e.target.value) || 0 })}
                            className="w-full bg-[#121110] border border-[#262422] rounded-xl px-4 py-2.5 text-xs text-white font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-[#F59E0B] mb-1">Harga 500g (Isi 0 jika N/A)</label>
                          <input
                            type="number"
                            required
                            value={productForm.pricePer500g}
                            onChange={(e) => setProductForm({ ...productForm, pricePer500g: parseInt(e.target.value) || 0 })}
                            className="w-full bg-[#121110] border border-[#262422] rounded-xl px-4 py-2.5 text-xs text-white font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-[#F59E0B] mb-1">Harga 200g (Isi 0 jika N/A)</label>
                          <input
                            type="number"
                            required
                            value={productForm.pricePer200g}
                            onChange={(e) => setProductForm({ ...productForm, pricePer200g: parseInt(e.target.value) || 0 })}
                            className="w-full bg-[#121110] border border-[#262422] rounded-xl px-4 py-2.5 text-xs text-white font-bold"
                          />
                        </div>
                      </div>

                      {/* COGS Section */}
                      <div className="bg-[#121110] border border-[#262422] p-5 rounded-2xl space-y-4">
                        <p className="text-xs font-black text-[#F59E0B] uppercase tracking-wider">KOMPONEN MODAL HPP / COGS</p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-[#A19D95] mb-1">Modal Green Bean / Kg</label>
                            <input
                              type="number"
                              required
                              value={productForm.greenBeanCostPerKg}
                              onChange={(e) => setProductForm({ ...productForm, greenBeanCostPerKg: parseInt(e.target.value) || 0 })}
                              className="w-full bg-[#1A1816] border border-[#262422] rounded-xl px-3 py-2 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-[#A19D95] mb-1">Biaya Roasting Operasional / Kg</label>
                            <input
                              type="number"
                              required
                              value={productForm.roastingCostPerKg}
                              onChange={(e) => setProductForm({ ...productForm, roastingCostPerKg: parseInt(e.target.value) || 0 })}
                              className="w-full bg-[#1A1816] border border-[#262422] rounded-xl px-3 py-2 text-xs text-white"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-[#262422]">
                          <div>
                            <label className="block text-xs text-[#A19D95] mb-1">Biaya Pouch 1 Kg</label>
                            <input
                              type="number"
                              required
                              value={productForm.packagingCostPerKg}
                              onChange={(e) => setProductForm({ ...productForm, packagingCostPerKg: parseInt(e.target.value) || 0 })}
                              className="w-full bg-[#1A1816] border border-[#262422] rounded-xl px-3 py-2 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-[#A19D95] mb-1">Biaya Pouch 500 Gram</label>
                            <input
                              type="number"
                              required
                              value={productForm.packagingCostPer500g}
                              onChange={(e) => setProductForm({ ...productForm, packagingCostPer500g: parseInt(e.target.value) || 0 })}
                              className="w-full bg-[#1A1816] border border-[#262422] rounded-xl px-3 py-2 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-[#A19D95] mb-1">Biaya Pouch 200 Gram</label>
                            <input
                              type="number"
                              required
                              value={productForm.packagingCostPer200g}
                              onChange={(e) => setProductForm({ ...productForm, packagingCostPer200g: parseInt(e.target.value) || 0 })}
                              className="w-full bg-[#1A1816] border border-[#262422] rounded-xl px-3 py-2 text-xs text-white"
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-black font-extrabold px-6 py-3 rounded-xl text-xs transition-all flex items-center space-x-2 shadow-lg"
                      >
                        <Plus className="h-4 w-4 stroke-[3]" />
                        <span>Simpan & Publikasikan Produk ke Cloud</span>
                      </button>
                    </form>
                  </section>
                </div>
              )}

              {sellerSubTab === 'recap' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-[#1A1816] border border-[#262422] p-6 rounded-3xl shadow-lg">
                      <p className="text-xs text-[#A19D95] font-bold">Total Omzet Penjualan</p>
                      <p className="text-2xl font-black text-[#F59E0B] mt-2">Rp {totalOmzet.toLocaleString('id-ID')}</p>
                    </div>

                    <div className="bg-[#1A1816] border border-[#262422] p-6 rounded-3xl shadow-lg">
                      <p className="text-xs text-[#A19D95] font-bold">Estimasi HPP / COGS</p>
                      <p className="text-2xl font-black text-white mt-2">Rp {totalEstimatedCOGS.toLocaleString('id-ID')}</p>
                    </div>

                    <div className="bg-[#1A1816] border border-[#262422] p-6 rounded-3xl shadow-lg">
                      <p className="text-xs text-[#A19D95] font-bold">Laba Kotor (Gross Profit)</p>
                      <p className="text-2xl font-black text-emerald-400 mt-2">Rp {totalGrossProfit.toLocaleString('id-ID')}</p>
                    </div>

                    <div className="bg-[#1A1816] border border-[#262422] p-6 rounded-3xl shadow-lg">
                      <p className="text-xs text-[#A19D95] font-bold">Piutang Kontra Bon (Unpaid)</p>
                      <p className="text-2xl font-black text-purple-400 mt-2">Rp {totalUnpaidKontraBon.toLocaleString('id-ID')}</p>
                    </div>
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