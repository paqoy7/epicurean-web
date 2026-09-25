'use client';

import React, { useState } from 'react';
import { 
  Coffee, ShoppingCart, Calculator, Truck, CreditCard, 
  Plus, FileText, BarChart2, CheckCircle, Lock, KeyRound, 
  Search, Trash2, Printer, AlertTriangle
} from 'lucide-react';

// Interfaces
interface CustomBlend {
  bean1Type: string;
  bean1Ratio: number;
  bean2Type: string;
  bean2Ratio: number;
  bean3Type: string;
  bean3Ratio: number;
  grindSize: string;
  weightGram: number;
}

interface Product {
  id: string;
  name: string;
  category: 'Green Beans' | 'Roasted Beans' | 'Blend Beans';
  pricePerKg: number;
  greenBeanCostPerKg: number;
  roastingCostPerKg: number;
  packagingCostPerKg: number;
  description: string;
}

interface OrderItem {
  id: string;
  name: string;
  quantityGram: number;
  pricePerGram: number;
  totalPrice: number;
  blendDetails?: string;
}

interface Order {
  id: string;
  customerName: string;
  companyName: string;
  destinationArea: 'bandung' | 'luar_bandung';
  shippingAddress: string;
  shippingMethod: string;
  shippingCost: number;
  paymentMethod: 'transfer' | 'kontra_bon_15' | 'kontra_bon_30';
  items: OrderItem[];
  subtotal: number;
  totalAmount: number;
  status: 'Roasting Process' | 'Ready for Shipping' | 'Delivered' | 'Pending';
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

  // Daftar Pilihan Biji Kopi & Harga
  const beanOptions: { [key: string]: number } = {
    'Arabica Gayo Wine Roasted': 120000,
    'Robusta Temanggung Natural': 85000,
    'Arabica Mandheling Grade 1': 110000,
    'Arabica Toraja Sapan': 130000,
    'Arabica Bali Kintamani': 125000,
    'Robusta Dampit Malang': 80000,
  };

  // Custom Blend State (Minimum Order: 200gr)
  const [blend, setBlend] = useState<CustomBlend>({
    bean1Type: 'Arabica Gayo Wine Roasted',
    bean1Ratio: 50,
    bean2Type: 'Robusta Temanggung Natural',
    bean2Ratio: 30,
    bean3Type: 'Arabica Mandheling Grade 1',
    bean3Ratio: 20,
    grindSize: 'Biji Utuh (Whole Bean)',
    weightGram: 200
  });

  const roastingAndPackagingCost = 25000;

  // Dynamic Price Calculation
  const priceBean1 = beanOptions[blend.bean1Type] || 100000;
  const priceBean2 = beanOptions[blend.bean2Type] || 100000;
  const priceBean3 = beanOptions[blend.bean3Type] || 100000;

  const calculatedBlendPricePerKg = Math.round(
    (blend.bean1Ratio / 100) * priceBean1 +
    (blend.bean2Ratio / 100) * priceBean2 +
    (blend.bean3Ratio / 100) * priceBean3 +
    roastingAndPackagingCost
  );
  const calculatedBlendPricePerGram = calculatedBlendPricePerKg / 1000;

  // Cart & Checkout State
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [destination, setDestination] = useState<'bandung' | 'luar_bandung'>('bandung');
  const [paymentMethod, setPaymentMethod] = useState<'transfer' | 'kontra_bon_15' | 'kontra_bon_30'>('kontra_bon_30');
  const [customerInfo, setCustomerInfo] = useState({ name: '', company: '', address: '', phone: '' });

  const totalCartWeightKg = cart.reduce((acc, item) => acc + item.quantityGram, 0) / 1000;
  const jneRatePerKg = 18000;
  const shippingCost = destination === 'bandung' ? 0 : Math.ceil(totalCartWeightKg) * jneRatePerKg;
  const cartSubtotal = cart.reduce((acc, item) => acc + item.totalPrice, 0);
  const grandTotal = cartSubtotal + shippingCost;

  // Products State
  const [products, setProducts] = useState<Product[]>([
    {
      id: 'P1',
      name: 'Arabica Gayo Green Beans Grade 1',
      category: 'Green Beans',
      pricePerKg: 110000,
      greenBeanCostPerKg: 90000,
      roastingCostPerKg: 0,
      packagingCostPerKg: 5000,
      description: 'Moisture: 12%, Defect < 5%, Single Origin Takengon'
    },
    {
      id: 'P2',
      name: 'Arabica Gayo Wine Roasted',
      category: 'Roasted Beans',
      pricePerKg: 180000,
      greenBeanCostPerKg: 98000,
      roastingCostPerKg: 20000,
      packagingCostPerKg: 15000,
      description: 'Notes: Winey, Tropical Fruit, Medium Body'
    },
    {
      id: 'P3',
      name: 'Bandung Heritage House Blend (70/30)',
      category: 'Blend Beans',
      pricePerKg: 145000,
      greenBeanCostPerKg: 75000,
      roastingCostPerKg: 18000,
      packagingCostPerKg: 14000,
      description: 'Notes: Caramel, Brown Sugar, Balanced'
    }
  ]);

  // Form Tambah Produk Baru
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Green Beans' as Product['category'],
    pricePerKg: 150000,
    greenBeanCostPerKg: 90000,
    roastingCostPerKg: 15000,
    packagingCostPerKg: 8000,
    description: ''
  });

  // Orders Data
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD-2026-001',
      customerName: 'Kopi Kenangan Senja Cafe',
      companyName: 'PT Senja Abadi Kuliner',
      destinationArea: 'bandung',
      shippingAddress: 'Jl. Riau No. 45, Kota Bandung',
      shippingMethod: 'DIRECT BANDUNG',
      shippingCost: 0,
      paymentMethod: 'kontra_bon_30',
      items: [
        { id: '1', name: 'Custom Artisan Blend (50% Gayo Wine / 30% Temanggung / 20% Mandheling)', quantityGram: 20000, pricePerGram: 156, totalPrice: 3120000 }
      ],
      subtotal: 3120000,
      totalAmount: 3120000,
      status: 'Roasting Process',
      dueDate: '2026-10-24',
      createdAt: '2026-09-24'
    }
  ]);

  const [lastSubmittedOrder, setLastSubmittedOrder] = useState<Order | null>(null);

  // Ratio Adjuster
  const handleRatioChange = (beanNum: 1 | 2, val: number) => {
    if (beanNum === 1) {
      const remaining = 100 - val;
      setBlend(prev => ({
        ...prev,
        bean1Ratio: val,
        bean2Ratio: Math.round(remaining * 0.6),
        bean3Ratio: Math.round(remaining * 0.4)
      }));
    } else {
      const remaining = 100 - blend.bean1Ratio;
      const validBean2 = Math.min(val, remaining);
      setBlend(prev => ({
        ...prev,
        bean2Ratio: validBean2,
        bean3Ratio: remaining - validBean2
      }));
    }
  };

  const addCustomBlendToCart = () => {
    const newItem: OrderItem = {
      id: `CB-${Date.now()}`,
      name: `Custom Blend (${blend.bean1Ratio}% ${blend.bean1Type.split(' ')[1] || 'Bean1'}, ${blend.bean2Ratio}% ${blend.bean2Type.split(' ')[1] || 'Bean2'}, ${blend.bean3Ratio}% ${blend.bean3Type.split(' ')[1] || 'Bean3'})`,
      quantityGram: blend.weightGram,
      pricePerGram: calculatedBlendPricePerGram,
      totalPrice: Math.round(calculatedBlendPricePerGram * blend.weightGram),
      blendDetails: `Gilingan: ${blend.grindSize}`
    };
    setCart([...cart, newItem]);
  };

  const addProductToCart = (prod: Product) => {
    const defaultPackGram = 200;
    const pricePerGram = prod.pricePerKg / 1000;
    const newItem: OrderItem = {
      id: `${prod.id}-${Date.now()}`,
      name: prod.name,
      quantityGram: defaultPackGram,
      pricePerGram: pricePerGram,
      totalPrice: Math.round(pricePerGram * defaultPackGram)
    };
    setCart([...cart, newItem]);
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const today = new Date();
    let dueDateStr = '';
    if (paymentMethod === 'kontra_bon_15') {
      const due = new Date(today);
      due.setDate(due.getDate() + 15);
      dueDateStr = due.toISOString().split('T')[0];
    } else if (paymentMethod === 'kontra_bon_30') {
      const due = new Date(today);
      due.setDate(due.getDate() + 30);
      dueDateStr = due.toISOString().split('T')[0];
    }

    const newOrder: Order = {
      id: `ORD-2026-00${orders.length + 1}`,
      customerName: customerInfo.name,
      companyName: customerInfo.company || 'Perorangan',
      destinationArea: destination,
      shippingAddress: customerInfo.address,
      shippingMethod: destination === 'bandung' ? 'DIRECT BANDUNG' : 'JNE REG',
      shippingCost: shippingCost,
      paymentMethod: paymentMethod,
      items: cart,
      subtotal: cartSubtotal,
      totalAmount: grandTotal,
      status: 'Roasting Process',
      dueDate: dueDateStr || undefined,
      createdAt: today.toISOString().split('T')[0]
    };

    setOrders([newOrder, ...orders]);
    setLastSubmittedOrder(newOrder);
    setCart([]);
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

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newProd: Product = {
      ...productForm,
      id: `P-${Date.now()}`
    };
    setProducts([...products, newProd]);
    setProductForm({
      name: '',
      category: 'Green Beans',
      pricePerKg: 150000,
      greenBeanCostPerKg: 90000,
      roastingCostPerKg: 15000,
      packagingCostPerKg: 8000,
      description: ''
    });
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const totalOmzet = orders.reduce((acc, o) => acc + o.totalAmount, 0);
  const totalEstimatedCOGS = orders.reduce((acc, o) => acc + Math.round(o.subtotal * 0.65), 0);
  const totalGrossProfit = totalOmzet - totalEstimatedCOGS;
  const totalUnpaidKontraBon = orders
    .filter(o => o.paymentMethod.startsWith('kontra_bon'))
    .reduce((acc, o) => acc + o.totalAmount, 0);

  return (
    <div className="min-h-screen bg-[#121110] text-[#E2E2E2] font-sans">
      <header className="border-b border-[#262422] bg-[#1A1816] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-[#F59E0B] p-2.5 rounded-xl text-black">
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
              className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'storefront' ? 'bg-[#262422] text-white shadow' : 'text-[#8E8B85] hover:text-white'
              }`}
            >
              Storefront
            </button>
            <button
              onClick={() => setActiveTab('seller')}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'seller' ? 'bg-[#F59E0B] text-black shadow' : 'text-[#8E8B85] hover:text-white'
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
            <div className="text-center py-10 bg-[#1A1816] border border-[#262422] rounded-3xl shadow-2xl relative overflow-hidden">
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                EPICUREAN<span className="text-[#F59E0B]">.id</span>
              </h1>
              <p className="text-[#A19D95] max-w-2xl mx-auto text-sm sm:text-base mt-2">
                Platform Pre-Order Kopi B2B & Custom Blend Roastery.
              </p>
            </div>

            {/* Custom Blend Configurator dengan Pemilih Jenis Kopi */}
            <section className="bg-[#1A1816] border border-[#262422] rounded-3xl p-6 sm:p-8 shadow-2xl">
              <div className="flex items-center space-x-3 mb-6 border-b border-[#262422] pb-4">
                <Calculator className="h-6 w-6 text-[#F59E0B]" />
                <h2 className="text-xl font-extrabold text-white">Custom Blend Configurator</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  {/* Bean 1 Selection & Ratio */}
                  <div className="bg-[#121110] p-4 rounded-2xl border border-[#262422] space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <select
                        value={blend.bean1Type}
                        onChange={(e) => setBlend({ ...blend, bean1Type: e.target.value })}
                        className="bg-[#1A1816] border border-[#262422] rounded-lg px-2.5 py-1 text-white font-bold text-xs"
                      >
                        {Object.keys(beanOptions).map(b => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                      <span className="text-[#F59E0B] font-black text-sm">{blend.bean1Ratio}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={blend.bean1Ratio}
                      onChange={(e) => handleRatioChange(1, parseInt(e.target.value))}
                      className="w-full accent-[#F59E0B] bg-[#262422] rounded-lg h-2.5 cursor-pointer"
                    />
                  </div>

                  {/* Bean 2 Selection & Ratio */}
                  <div className="bg-[#121110] p-4 rounded-2xl border border-[#262422] space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <select
                        value={blend.bean2Type}
                        onChange={(e) => setBlend({ ...blend, bean2Type: e.target.value })}
                        className="bg-[#1A1816] border border-[#262422] rounded-lg px-2.5 py-1 text-white font-bold text-xs"
                      >
                        {Object.keys(beanOptions).map(b => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                      <span className="text-[#F59E0B] font-black text-sm">{blend.bean2Ratio}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={100 - blend.bean1Ratio}
                      value={blend.bean2Ratio}
                      onChange={(e) => handleRatioChange(2, parseInt(e.target.value))}
                      className="w-full accent-[#F59E0B] bg-[#262422] rounded-lg h-2.5 cursor-pointer"
                    />
                  </div>

                  {/* Bean 3 Selection & Ratio */}
                  <div className="bg-[#121110] p-4 rounded-2xl border border-[#262422] space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <select
                        value={blend.bean3Type}
                        onChange={(e) => setBlend({ ...blend, bean3Type: e.target.value })}
                        className="bg-[#1A1816] border border-[#262422] rounded-lg px-2.5 py-1 text-white font-bold text-xs"
                      >
                        {Object.keys(beanOptions).map(b => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                      <span className="text-[#F59E0B] font-black text-sm">{blend.bean3Ratio}%</span>
                    </div>
                    <div className="w-full bg-[#262422] h-2.5 rounded-lg overflow-hidden">
                      <div className="bg-[#F59E0B] h-full" style={{ width: `${blend.bean3Ratio}%` }}></div>
                    </div>
                  </div>

                  {/* Weight & Grind Size */}
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-[#8E8B85] mb-1">Ukuran Gilingan</label>
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
                      <label className="block text-xs font-bold text-[#8E8B85] mb-1">Jumlah Order (Gram)</label>
                      <input
                        type="number"
                        min="200"
                        step="50"
                        value={blend.weightGram}
                        onChange={(e) => setBlend({ ...blend, weightGram: Math.max(200, parseInt(e.target.value) || 200) })}
                        className="w-full bg-[#121110] border border-[#262422] rounded-xl px-3 py-2.5 text-xs text-[#E2E2E2]"
                      />
                      <span className="text-[10px] text-[#F59E0B] mt-1 block">*Min. Order 200 Gram</span>
                    </div>
                  </div>
                </div>

                {/* Price Output Box */}
                <div className="bg-[#121110] border border-[#262422] rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-[#8E8B85] uppercase tracking-wider mb-4">Ringkasan Kalkulasi Blend</h3>
                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between">
                        <span className="text-[#A19D95]">Harga Blend / Kg:</span>
                        <span className="font-bold text-[#F59E0B]">Rp {calculatedBlendPricePerKg.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#A19D95]">Total Berat:</span>
                        <span className="font-bold text-white">{blend.weightGram} Gram</span>
                      </div>
                      <div className="border-t border-[#262422] pt-3 flex justify-between text-base font-extrabold text-white">
                        <span>Total Tagihan:</span>
                        <span className="text-[#F59E0B]">Rp {Math.round(calculatedBlendPricePerGram * blend.weightGram).toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={addCustomBlendToCart}
                    className="w-full mt-6 bg-[#F59E0B] hover:bg-[#d98a08] text-black font-extrabold py-3.5 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-lg"
                  >
                    <Plus className="h-4 w-4 stroke-[3]" />
                    <span>Tambah Blend ke Order</span>
                  </button>
                </div>
              </div>
            </section>

            {/* Katalog Standar */}
            <section className="space-y-6">
              <h2 className="text-xl font-extrabold text-white">Katalog Ready-to-Roast</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {products.map((p) => (
                  <div key={p.id} className="bg-[#1A1816] border border-[#262422] rounded-2xl p-5 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-black tracking-wider px-2.5 py-1 bg-[#262422] text-[#F59E0B] rounded-md">
                        {p.category}
                      </span>
                      <h3 className="text-sm font-extrabold text-white mt-3">{p.name}</h3>
                      <p className="text-xs text-[#8E8B85] mt-1 line-clamp-2">{p.description}</p>
                      <p className="text-[#F59E0B] font-black text-base mt-4">Rp {p.pricePerKg.toLocaleString('id-ID')} <span className="text-xs font-normal text-[#8E8B85]">/ Kg</span></p>
                    </div>
                    <button
                      onClick={() => addProductToCart(p)}
                      className="w-full mt-4 bg-[#262422] hover:bg-[#33302d] text-white text-xs font-bold py-2.5 rounded-xl transition-all"
                    >
                      + Tambah Paket 200 Gram
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Checkout Form */}
            <section className="bg-[#1A1816] border border-[#262422] rounded-3xl p-6 sm:p-8">
              <div className="flex items-center space-x-3 mb-6 border-b border-[#262422] pb-4">
                <ShoppingCart className="h-6 w-6 text-[#F59E0B]" />
                <h2 className="text-xl font-extrabold text-white">Keranjang & Checkout Pre-Order</h2>
              </div>

              {cart.length === 0 ? (
                <p className="text-xs text-[#8E8B85] text-center py-8">Keranjang belanja Anda masih kosong.</p>
              ) : (
                <form onSubmit={handleCheckout} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-3">
                      {cart.map((item) => (
                        <div key={item.id} className="bg-[#121110] border border-[#262422] p-4 rounded-xl flex justify-between items-center text-xs">
                          <div>
                            <p className="font-bold text-white">{item.name}</p>
                            <p className="text-[#8E8B85] mt-0.5">{item.quantityGram} Gram</p>
                          </div>
                          <p className="font-extrabold text-[#F59E0B]">Rp {item.totalPrice.toLocaleString('id-ID')}</p>
                        </div>
                      ))}
                    </div>

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
                            destination === 'bandung' ? 'border-[#F59E0B] bg-[#F59E0B]/10 text-white' : 'border-[#262422] text-[#8E8B85]'
                          }`}
                        >
                          <p className="font-bold">Kota Bandung</p>
                          <p className="text-[10px] text-emerald-400 mt-0.5">DIRECT BANDUNG (Bebas Ongkir)</p>
                        </button>
                        <button
                          type="button"
                          onClick={() => setDestination('luar_bandung')}
                          className={`p-3 rounded-xl border text-left text-xs transition-all ${
                            destination === 'luar_bandung' ? 'border-[#F59E0B] bg-[#F59E0B]/10 text-white' : 'border-[#262422] text-[#8E8B85]'
                          }`}
                        >
                          <p className="font-bold">Luar Bandung</p>
                          <p className="text-[10px] text-[#F59E0B] mt-0.5">Ekspedisi JNE (Ditanggung Customer)</p>
                        </button>
                      </div>
                    </div>

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

                        <label className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer ${
                          paymentMethod === 'kontra_bon_15' ? 'border-[#F59E0B] bg-[#F59E0B]/10' : 'border-[#262422]'
                        }`}>
                          <input type="radio" name="payment" checked={paymentMethod === 'kontra_bon_15'} onChange={() => setPaymentMethod('kontra_bon_15')} className="accent-[#F59E0B]" />
                          <div>
                            <p className="font-bold text-white">Kontra Bon (Net 15 Hari)</p>
                            <p className="text-[10px] text-[#F59E0B]">Jatuh Tempo +15 Hari Setelah Tagihan</p>
                          </div>
                        </label>

                        <label className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer ${
                          paymentMethod === 'kontra_bon_30' ? 'border-[#F59E0B] bg-[#F59E0B]/10' : 'border-[#262422]'
                        }`}>
                          <input type="radio" name="payment" checked={paymentMethod === 'kontra_bon_30'} onChange={() => setPaymentMethod('kontra_bon_30')} className="accent-[#F59E0B]" />
                          <div>
                            <p className="font-bold text-white">Kontra Bon (Net 30 Hari)</p>
                            <p className="text-[10px] text-[#F59E0B]">Jatuh Tempo +30 Hari Setelah Tagihan</p>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-[#121110] border border-[#262422] p-4 rounded-xl space-y-3">
                      <h3 className="text-xs font-bold text-white">Detail Perusahaan Pemesan</h3>
                      <input
                        type="text"
                        placeholder="Nama Penanggung Jawab *"
                        required
                        value={customerInfo.name}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                        className="w-full bg-[#1A1816] border border-[#262422] rounded-lg px-3 py-2 text-xs text-white"
                      />
                      <input
                        type="text"
                        placeholder="Nama Perusahaan / Cafe *"
                        required
                        value={customerInfo.company}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, company: e.target.value })}
                        className="w-full bg-[#1A1816] border border-[#262422] rounded-lg px-3 py-2 text-xs text-white"
                      />
                      <textarea
                        placeholder="Alamat Pengiriman Lengkap *"
                        required
                        rows={2}
                        value={customerInfo.address}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                        className="w-full bg-[#1A1816] border border-[#262422] rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div className="bg-[#121110] border border-[#262422] p-4 rounded-xl space-y-2 text-xs">
                      <div className="flex justify-between text-[#8E8B85]">
                        <span>Subtotal Produk:</span>
                        <span>Rp {cartSubtotal.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between text-[#8E8B85]">
                        <span>Ongkos Kirim ({destination === 'bandung' ? 'Bebas Ongkir' : `JNE (${totalCartWeightKg.toFixed(1)} Kg)`}):</span>
                        <span className={shippingCost === 0 ? 'text-emerald-400 font-bold' : ''}>
                          {shippingCost === 0 ? 'Rp 0' : `Rp ${shippingCost.toLocaleString('id-ID')}`}
                        </span>
                      </div>
                      <div className="border-t border-[#262422] pt-2 flex justify-between text-base font-extrabold text-white">
                        <span>Grand Total:</span>
                        <span className="text-[#F59E0B]">Rp {grandTotal.toLocaleString('id-ID')}</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3.5 rounded-xl transition-all shadow-lg"
                    >
                      Kirim Pre-Order Digital
                    </button>
                  </div>
                </form>
              )}

              {lastSubmittedOrder && (
                <div className="mt-8 p-6 bg-[#121110] border border-emerald-800 rounded-2xl space-y-3">
                  <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                    <CheckCircle className="h-5 w-5" />
                    <span>Pre-Order Berhasil Terkirim!</span>
                  </div>
                  <div className="text-xs space-y-1 text-[#D4D0C7]">
                    <p><span className="text-[#8E8B85]">ID Order:</span> {lastSubmittedOrder.id}</p>
                    <p><span className="text-[#8E8B85]">Total Tagihan:</span> Rp {lastSubmittedOrder.totalAmount.toLocaleString('id-ID')}</p>
                    {lastSubmittedOrder.paymentMethod === 'transfer' && (
                      <p className="text-[#F59E0B] font-bold mt-1">Transfer Ke: 7772400244 / MULTI AGRI SENTOSA CV</p>
                    )}
                  </div>
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
                <p className="text-xs text-[#8E8B85] mt-1">Masukkan kata sandi otorisasi untuk mengakses Roastery Manager.</p>
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
                  className="w-full bg-[#F59E0B] hover:bg-[#d98a08] text-black font-extrabold py-3 rounded-xl text-xs transition-all"
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
                    <p className="text-xs text-[#8E8B85] mt-1">Kelola stok, kustomisasi COGS (HPP), pantau antrean sangrai, dan cetak laporan penjualan.</p>
                  </div>
                  <div className="flex items-center space-x-2 bg-[#0F0E0D] p-1.5 rounded-2xl border border-[#262422]">
                    <button
                      onClick={() => setSellerSubTab('orders')}
                      className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                        sellerSubTab === 'orders' ? 'bg-[#F59E0B] text-black shadow' : 'text-[#8E8B85] hover:text-white'
                      }`}
                    >
                      Daftar Pesanan ({orders.length})
                    </button>
                    <button
                      onClick={() => setSellerSubTab('products')}
                      className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                        sellerSubTab === 'products' ? 'bg-[#F59E0B] text-black shadow' : 'text-[#8E8B85] hover:text-white'
                      }`}
                    >
                      Produk & COGS (HPP)
                    </button>
                    <button
                      onClick={() => setSellerSubTab('recap')}
                      className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                        sellerSubTab === 'recap' ? 'bg-[#F59E0B] text-black shadow' : 'text-[#8E8B85] hover:text-white'
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
                    <h2 className="text-lg font-extrabold text-white">Daftar Antrean Order Pre-Order</h2>
                    <span className="text-xs text-[#8E8B85]">Total {orders.length} Order Masuk</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-[#D4D0C7]">
                      <thead className="bg-[#121110] text-[#8E8B85] uppercase font-bold text-[10px] tracking-wider">
                        <tr>
                          <th className="p-4 rounded-l-xl">ID Order / Tanggal</th>
                          <th className="p-4">Pelanggan / Perusahaan</th>
                          <th className="p-4">Pengiriman</th>
                          <th className="p-4">Pembayaran</th>
                          <th className="p-4">Status Pesanan</th>
                          <th className="p-4">Total Tagihan</th>
                          <th className="p-4 text-center rounded-r-xl">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#262422]">
                        {orders.map((o) => (
                          <tr key={o.id} className="hover:bg-[#121110]/50 transition-all">
                            <td className="p-4 font-mono font-bold text-[#F59E0B]">
                              <p className="text-sm">{o.id}</p>
                              <p className="text-[10px] text-[#8E8B85] font-normal">{o.createdAt}</p>
                            </td>
                            <td className="p-4">
                              <p className="font-extrabold text-white text-sm">{o.customerName}</p>
                              <p className="text-[10px] text-[#8E8B85]">{o.companyName}</p>
                            </td>
                            <td className="p-4">
                              <p className="font-bold text-white">{o.destinationArea === 'bandung' ? 'Bandung' : 'Luar Bandung'}</p>
                              <p className="text-[10px] text-[#8E8B85]">{o.shippingMethod}</p>
                            </td>
                            <td className="p-4">
                              <span className={`px-2.5 py-1 rounded-md text-[10px] font-black ${
                                o.paymentMethod.startsWith('kontra_bon') ? 'bg-purple-950 text-purple-300 border border-purple-800' : 'bg-blue-950 text-blue-300 border border-blue-800'
                              }`}>
                                {o.paymentMethod.replace('_', ' ').toUpperCase()}
                              </span>
                              <p className="text-[10px] text-[#8E8B85] mt-1">{o.dueDate ? `Unpaid (Due: ${o.dueDate})` : 'Paid Transfer'}</p>
                            </td>
                            <td className="p-4">
                              <select
                                value={o.status}
                                onChange={(e) => {
                                  const newStatus = e.target.value as Order['status'];
                                  setOrders(orders.map(item => item.id === o.id ? { ...item, status: newStatus } : item));
                                }}
                                className="bg-[#121110] border border-[#262422] px-3 py-1.5 rounded-xl text-xs font-bold text-white focus:outline-none"
                              >
                                <option value="Roasting Process">Roasting Process</option>
                                <option value="Ready for Shipping">Ready for Shipping</option>
                                <option value="Delivered">Delivered</option>
                              </select>
                            </td>
                            <td className="p-4 font-black text-white text-sm">
                              Rp {o.totalAmount.toLocaleString('id-ID')}
                            </td>
                            <td className="p-4 text-center">
                              <button
                                onClick={() => window.print()}
                                className="p-2 bg-[#121110] hover:bg-[#262422] border border-[#262422] rounded-xl text-[#8E8B85] hover:text-white transition-all"
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
                  <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {products.map((p) => {
                      const totalCogs = p.greenBeanCostPerKg + p.roastingCostPerKg + p.packagingCostPerKg;
                      const profit = p.pricePerKg - totalCogs;
                      const marginPct = ((profit / p.pricePerKg) * 100).toFixed(1);
                      return (
                        <div key={p.id} className="bg-[#1A1816] border border-[#262422] p-6 rounded-3xl space-y-4 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start">
                              <span className="text-[10px] font-black tracking-wider text-[#F59E0B] uppercase px-2.5 py-1 bg-[#121110] border border-[#262422] rounded-md">{p.category}</span>
                              <button onClick={() => handleDeleteProduct(p.id)} className="text-[#8E8B85] hover:text-rose-400">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                            <h3 className="text-base font-extrabold text-white mt-3">{p.name}</h3>
                            <div className="grid grid-cols-2 gap-4 mt-4 text-xs border-t border-[#262422] pt-3">
                              <div>
                                <p className="text-[#8E8B85]">Harga Jual / Kg</p>
                                <p className="font-extrabold text-white text-sm mt-0.5">Rp {p.pricePerKg.toLocaleString('id-ID')}</p>
                              </div>
                              <div>
                                <p className="text-[#8E8B85]">Total COGS / Kg</p>
                                <p className="font-extrabold text-rose-400 text-sm mt-0.5">Rp {totalCogs.toLocaleString('id-ID')}</p>
                              </div>
                            </div>
                          </div>
                          <div className="bg-[#121110] border border-[#262422] p-3 rounded-2xl flex justify-between items-center text-xs">
                            <span className="text-[#8E8B85]">Margin Keuntungan:</span>
                            <span className="font-black text-emerald-400 text-sm">Rp {profit.toLocaleString('id-ID')} ({marginPct}%)</span>
                          </div>
                        </div>
                      );
                    })}
                  </section>

                  <section className="bg-[#1A1816] border border-[#262422] p-6 sm:p-8 rounded-3xl space-y-6">
                    <h2 className="text-lg font-extrabold text-white">Tambah Katalog Produk Baru / Adjust COGS</h2>

                    <form onSubmit={handleSaveProduct} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-[#8E8B85] mb-1">Nama Produk Kopi</label>
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
                          <label className="block text-xs font-bold text-[#8E8B85] mb-1">Kategori Produk</label>
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
                        <div>
                          <label className="block text-xs font-bold text-[#8E8B85] mb-1">Harga Jual per Kg (IDR)</label>
                          <input
                            type="number"
                            required
                            value={productForm.pricePerKg}
                            onChange={(e) => setProductForm({ ...productForm, pricePerKg: parseInt(e.target.value) || 0 })}
                            className="w-full bg-[#121110] border border-[#262422] rounded-xl px-4 py-2.5 text-xs text-white font-bold"
                          />
                        </div>
                      </div>

                      <div className="bg-[#121110] border border-[#262422] p-5 rounded-2xl space-y-4">
                        <p className="text-xs font-black text-[#F59E0B] uppercase tracking-wider">RINCIAN KOMPONEN HPP / COGS (COST OF GOODS SOLD) PER KG</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs text-[#8E8B85] mb-1">Modal Green Bean / Kg</label>
                            <input
                              type="number"
                              required
                              value={productForm.greenBeanCostPerKg}
                              onChange={(e) => setProductForm({ ...productForm, greenBeanCostPerKg: parseInt(e.target.value) || 0 })}
                              className="w-full bg-[#1A1816] border border-[#262422] rounded-xl px-3 py-2 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-[#8E8B85] mb-1">Biaya Operasional Roasting / Kg</label>
                            <input
                              type="number"
                              required
                              value={productForm.roastingCostPerKg}
                              onChange={(e) => setProductForm({ ...productForm, roastingCostPerKg: parseInt(e.target.value) || 0 })}
                              className="w-full bg-[#1A1816] border border-[#262422] rounded-xl px-3 py-2 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-[#8E8B85] mb-1">Biaya Packaging Kemasan / Kg</label>
                            <input
                              type="number"
                              required
                              value={productForm.packagingCostPerKg}
                              onChange={(e) => setProductForm({ ...productForm, packagingCostPerKg: parseInt(e.target.value) || 0 })}
                              className="w-full bg-[#1A1816] border border-[#262422] rounded-xl px-3 py-2 text-xs text-white"
                            />
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-2 text-xs">
                          <span className="text-[#8E8B85]">Total COGS: <strong className="text-white">Rp {(productForm.greenBeanCostPerKg + productForm.roastingCostPerKg + productForm.packagingCostPerKg).toLocaleString('id-ID')}/kg</strong></span>
                          <span className="px-3 py-1.5 bg-emerald-950 border border-emerald-800 text-emerald-400 rounded-xl font-bold">
                            Estimasi Gross Margin: {(((productForm.pricePerKg - (productForm.greenBeanCostPerKg + productForm.roastingCostPerKg + productForm.packagingCostPerKg)) / productForm.pricePerKg) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="bg-[#F59E0B] hover:bg-[#d98a08] text-black font-extrabold px-6 py-3 rounded-xl text-xs transition-all flex items-center space-x-2"
                      >
                        <Plus className="h-4 w-4 stroke-[3]" />
                        <span>Simpan Produk Baru</span>
                      </button>
                    </form>
                  </section>
                </div>
              )}

              {sellerSubTab === 'recap' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-[#1A1816] border border-[#262422] p-6 rounded-3xl">
                      <p className="text-xs text-[#8E8B85] font-bold">Total Omzet Penjualan</p>
                      <p className="text-2xl font-black text-[#F59E0B] mt-2">Rp {totalOmzet.toLocaleString('id-ID')}</p>
                    </div>

                    <div className="bg-[#1A1816] border border-[#262422] p-6 rounded-3xl">
                      <p className="text-xs text-[#8E8B85] font-bold">Estimasi HPP / COGS</p>
                      <p className="text-2xl font-black text-white mt-2">Rp {totalEstimatedCOGS.toLocaleString('id-ID')}</p>
                    </div>

                    <div className="bg-[#1A1816] border border-[#262422] p-6 rounded-3xl">
                      <p className="text-xs text-[#8E8B85] font-bold">Laba Kotor (Gross Profit)</p>
                      <p className="text-2xl font-black text-emerald-400 mt-2">Rp {totalGrossProfit.toLocaleString('id-ID')}</p>
                    </div>

                    <div className="bg-[#1A1816] border border-[#262422] p-6 rounded-3xl">
                      <p className="text-xs text-[#8E8B85] font-bold">Piutang Kontra Bon (Unpaid)</p>
                      <p className="text-2xl font-black text-purple-400 mt-2">Rp {totalUnpaidKontraBon.toLocaleString('id-ID')}</p>
                    </div>
                  </div>

                  <section className="bg-[#1A1816] border border-[#262422] p-6 sm:p-8 rounded-3xl space-y-6">
                    <h2 className="text-lg font-extrabold text-white">Laporan Rekapan Penjualan Per Order</h2>
                    <div className="space-y-3">
                      {orders.map((o) => (
                        <div key={o.id} className="bg-[#121110] border border-[#262422] p-5 rounded-2xl flex justify-between items-center text-xs">
                          <div>
                            <p className="font-mono font-bold text-[#F59E0B] text-sm">{o.id} <span className="text-[#8E8B85] font-normal text-xs">({o.createdAt})</span></p>
                            <p className="font-extrabold text-white text-base mt-1">{o.companyName}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-black text-white text-base">Rp {o.totalAmount.toLocaleString('id-ID')}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              )}
            </div>
          )
        )}
      </main>
    </div>
  );
}