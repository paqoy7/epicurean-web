'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Coffee, ShoppingCart, Lock,
  Trash2, User, X,
  MessageSquare, Edit3, LogOut, ArrowRight, ShieldCheck, Tag, Plus, Minus, BarChart2, Package, Calendar, Clock, Truck, CreditCard, Download, Search, MapPin, Printer, FileText, CheckCircle2, AlertCircle, Send, History, Filter
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

const getStatusBadgeClass = (status: Order['status']) => {
  switch (status) {
    case 'Pending Approval':
      return 'bg-amber-900/40 text-amber-300 border-amber-700/50';
    case 'Roasting Process':
      return 'bg-purple-900/40 text-purple-300 border-purple-700/50';
    case 'Ready for Shipping':
      return 'bg-sky-900/40 text-sky-300 border-sky-700/50';
    case 'Delivered':
      return 'bg-emerald-900/40 text-emerald-300 border-emerald-700/50';
    case 'Rejected':
      return 'bg-rose-900/40 text-rose-300 border-rose-700/50';
    default:
      return 'bg-gray-800 text-gray-300 border-gray-700';
  }
};

function CustomDeliveryDatePicker({ value, onChange }: { value: string; onChange: (dateStr: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getEarliestAllowedShippingDate = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dayOfWeek = today.getDay();

    const minDate = new Date(today);
    if (dayOfWeek === 1 || dayOfWeek === 2) {
      const daysUntilNextMonday = 8 - dayOfWeek;
      minDate.setDate(today.getDate() + daysUntilNextMonday);
    } else {
      const daysUntilNextMonday = (1 - dayOfWeek + 7) % 7 + 7;
      minDate.setDate(today.getDate() + daysUntilNextMonday);
    }
    return minDate;
  };

  const minAllowedDate = getEarliestAllowedShippingDate();

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const daysOfWeek = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  const handleSelectDate = (day: number) => {
    const selected = new Date(year, month, day);
    const dayOfWeek = selected.getDay();

    if ((dayOfWeek === 1 || dayOfWeek === 2) && selected >= minAllowedDate) {
      const yyyy = selected.getFullYear();
      const mm = String(selected.getMonth() + 1).padStart(2, '0');
      const dd = String(selected.getDate()).padStart(2, '0');
      onChange(`${yyyy}-${mm}-${dd}`);
      setIsOpen(false);
    }
  };

  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));
  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return 'Klik untuk Pilih Tanggal...';
    const d = new Date(dateStr);
    const opt: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return d.toLocaleDateString('id-ID', opt);
  };

  const todayFormatted = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#181614] border border-[#38332E] px-3 py-2 text-xs font-mono text-left text-[#EFECE6] flex justify-between items-center hover:border-[#C8A97E] transition-all"
      >
        <span>{formatDisplayDate(value)}</span>
        <Calendar className="h-4 w-4 text-[#C8A97E]" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#141210] border border-[#2E2B27] p-4 z-50 shadow-2xl space-y-4 font-serif text-[#EFECE6]">
          <div className="text-center space-y-1 pb-2 border-b border-[#2E2B27]">
            <h3 className="text-lg tracking-widest uppercase font-serif text-[#EFECE6]">EPICUREAN</h3>
            <p className="text-xs italic text-[#C8A97E]">Coffee Company Catalog</p>
          </div>

          <div className="bg-[#1F1C19] border border-[#38332E] p-3 text-xs font-mono flex items-center justify-between text-[#EFECE6]">
            <span className="text-[#8C8479]">Tanggal Order:</span>
            <span className="font-bold text-[#C8A97E]">{todayFormatted}</span>
          </div>

          <div className="border border-[#2E2B27] bg-[#181614] rounded-xl p-4 space-y-3 font-sans">
            <div className="flex items-center space-x-2 text-sm font-serif text-[#EFECE6] pb-2 border-b border-[#2E2B27]">
              <Calendar className="h-4 w-4 text-[#C8A97E]" />
              <span className="font-bold">Jadwal Rutin Produksi & Pengiriman Roastery</span>
            </div>

            <div className="border border-rose-900/40 bg-rose-950/20 p-3 rounded-lg space-y-1">
              <div className="flex items-center space-x-2 text-xs font-mono text-rose-400">
                <Clock className="h-3.5 w-3.5" />
                <span className="font-bold">Last Order (Cut-Off): SELASA</span>
              </div>
              <p className="text-[11px] text-[#A39B8E] italic font-serif">
                Batas pemesanan minggu ini ditutup setiap hari Selasa.
              </p>
            </div>

            <div className="border border-emerald-900/40 bg-emerald-950/20 p-3 rounded-lg space-y-1">
              <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400">
                <Coffee className="h-3.5 w-3.5" />
                <span className="font-bold">Jadwal Roasting: RABU - KAMIS</span>
              </div>
              <p className="text-[11px] text-[#A39B8E] italic font-serif">
                Proses Sangrai Biji Kopi Fresh Roasting setiap hari Rabu & Kamis.
              </p>
            </div>

            <div className="border border-sky-900/40 bg-sky-950/20 p-3 rounded-lg space-y-1">
              <div className="flex items-center space-x-2 text-xs font-mono text-sky-400">
                <Truck className="h-3.5 w-3.5" />
                <span className="font-bold">Pengiriman: SENIN - SELASA</span>
              </div>
              <p className="text-[11px] text-[#A39B8E] italic font-serif">
                Pengiriman pesanan dilakukan pada hari Senin & Selasa minggu depannya.
              </p>
            </div>

            <div className="border border-amber-900/40 bg-amber-950/20 p-3 rounded-lg space-y-1">
              <div className="flex items-start space-x-2 text-[11px] text-[#EFECE6] font-serif leading-relaxed">
                <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-amber-400">Catatan:</strong> Pesanan yang masuk antara hari <strong className="text-amber-400">Rabu - Minggu</strong> akan diproses & di-roasting pada siklus batch minggu berikutnya.
                </span>
              </div>
            </div>
          </div>

          <div className="font-mono pt-2 border-t border-[#2E2B27]">
            <div className="flex justify-between items-center text-xs font-bold text-[#EFECE6] border-b border-[#2E2B27] pb-2 mb-2">
              <button type="button" onClick={prevMonth} className="px-2 py-1 text-[#8C8479] hover:text-[#C8A97E]">
                &lt;
              </button>
              <span>
                {currentMonth.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
              </span>
              <button type="button" onClick={nextMonth} className="px-2 py-1 text-[#8C8479] hover:text-[#C8A97E]">
                &gt;
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-[#8C8479] mb-1">
              {daysOfWeek.map((d, idx) => (
                <span key={d} className={idx === 1 || idx === 2 ? 'text-[#C8A97E] font-bold' : ''}>
                  {d}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const dateObj = new Date(year, month, dayNum);
                const dayOfWeek = dateObj.getDay();
                
                const isSeninSelasa = dayOfWeek === 1 || dayOfWeek === 2;
                const isValidBatchDate = dateObj >= minAllowedDate;
                const isAllowed = isSeninSelasa && isValidBatchDate;

                const yyyy = dateObj.getFullYear();
                const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
                const dd = String(dateObj.getDate()).padStart(2, '0');
                const dateString = `${yyyy}-${mm}-${dd}`;
                const isSelected = value === dateString;

                return (
                  <button
                    key={dayNum}
                    type="button"
                    disabled={!isAllowed}
                    onClick={() => handleSelectDate(dayNum)}
                    className={`py-1.5 rounded transition-all text-[11px] ${
                      isSelected
                        ? 'bg-[#C8A97E] text-[#181614] font-bold'
                        : isAllowed
                        ? 'bg-[#1F1C19] text-[#EFECE6] hover:bg-[#C8A97E] hover:text-[#181614] cursor-pointer font-bold border border-[#38332E]'
                        : 'text-[#3A3631] bg-[#141210] cursor-not-allowed opacity-20'
                    }`}
                  >
                    {dayNum}
                  </button>
                );
              })}
            </div>

            <p className="text-[10px] text-[#8C8479] italic border-t border-[#2E2B27] pt-2 text-center mt-3">
              * Tanggal yang aktif di atas sudah disesuaikan secara otomatis berdasarkan jadwal roasting batch roastery.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function InvoiceModal({ order, onClose }: { order: Order; onClose: () => void }) {
  const handlePrint = () => window.print();

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex justify-center items-center p-4 overflow-y-auto">
      <div className="bg-white text-black w-full max-w-2xl p-8 shadow-2xl font-sans relative my-auto">
        <div className="flex justify-between items-center mb-6 border-b pb-4 print:hidden">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-gray-700" />
            <h3 className="font-bold text-sm text-gray-800">Preview Invoice Resmi B2B</h3>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handlePrint}
              className="bg-[#C8A97E] hover:bg-[#b5956a] text-black px-4 py-2 text-xs font-mono font-bold flex items-center space-x-2 transition-all shadow"
            >
              <Printer className="h-4 w-4" />
              <span>Print / Download PDF</span>
            </button>
            <button onClick={onClose} className="bg-gray-200 text-gray-800 px-3 py-2 text-xs font-mono hover:bg-gray-300 transition-all">
              Tutup
            </button>
          </div>
        </div>

        <div id="invoice-content" className="space-y-6 text-xs text-gray-800">
          <div className="flex justify-between items-start border-b pb-4 border-gray-300">
            <div>
              <h1 className="text-lg font-bold tracking-wider text-black font-serif uppercase">
                EPICUREAN COFFEE COMPANY
              </h1>
              <p className="text-[11px] text-gray-600 font-mono">Phone: +628112039695</p>
              <p className="text-[11px] text-gray-600 font-mono">Email: epccoffee@gmail.com</p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold text-gray-900 uppercase tracking-widest font-serif">INVOICE</h2>
              <p className="font-mono text-xs text-gray-700 font-bold mt-1">
                INVOICE #: <span className="text-black">{order.id.replace('ORD-', '')}</span>
              </p>
              <p className="font-mono text-xs text-gray-600">DATE: {order.createdAt}</p>
              {order.dueDate && (
                <p className="font-mono text-xs text-rose-600 font-bold mt-0.5">
                  DUE DATE: {order.dueDate}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 border border-gray-200">
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-500 block font-mono">CUSTOMER</span>
              <p className="font-bold text-sm text-gray-900">{order.customerName}</p>
              <p className="text-xs text-gray-700">{order.companyName}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-gray-500 block font-mono">ADDRESS / PHONE</span>
              <p className="text-xs text-gray-700">{order.shippingAddress || 'Bandung, Jawa Barat'}</p>
              <p className="text-xs font-mono text-gray-700">{order.customerPhone}</p>
            </div>
          </div>

          <table className="w-full text-left border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-[10px] uppercase font-bold text-gray-700 border-b border-gray-200 font-mono">
                <th className="p-2 border-r border-gray-200 w-10 text-center">NO.</th>
                <th className="p-2 border-r border-gray-200">DESCRIPTION</th>
                <th className="p-2 text-center border-r border-gray-200 w-20">QTY</th>
                <th className="p-2 text-right border-r border-gray-200 w-28">UNIT PRICE (Rp.)</th>
                <th className="p-2 text-right w-28">AMOUNT (Rp.)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-xs font-mono">
              {order.items.map((item, index) => (
                <tr key={item.id}>
                  <td className="p-2 text-center border-r border-gray-200">{index + 1}</td>
                  <td className="p-2 border-r border-gray-200 font-sans font-medium">{item.name}</td>
                  <td className="p-2 text-center border-r border-gray-200">{item.quantity} Pack</td>
                  <td className="p-2 text-right border-r border-gray-200">{item.unitPrice.toLocaleString('id-ID')}</td>
                  <td className="p-2 text-right font-bold">{item.totalPrice.toLocaleString('id-ID')}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="grid grid-cols-2 gap-6 pt-2">
            <div className="space-y-3">
              <div className="border p-3 bg-gray-50 border-gray-200 space-y-1 font-mono">
                <p className="font-bold text-[11px] text-gray-900 border-b pb-1 mb-1 font-sans">PAYMENT DETAIL</p>
                <p className="text-[11px]">BANK NAME: <span className="font-bold">BCA</span></p>
                <p className="text-[11px]">BANK ACCOUNT NUMBER: <span className="font-bold font-mono">7772400244</span></p>
                <p className="text-[11px]">BANK ACCOUNT NAME: <span className="font-bold">CV. MULTI AGRI SENTOSA</span></p>
              </div>
            </div>

            <div className="space-y-1 text-right font-mono">
              <div className="flex justify-between border-b pb-1 text-xs">
                <span className="text-gray-600">Subtotal:</span>
                <span>Rp {order.subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between border-b pb-1 text-xs">
                <span className="text-gray-600">Ongkos Kirim:</span>
                <span>Rp {order.shippingCost.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-black pt-1">
                <span>TOTAL:</span>
                <span className="text-black">Rp {order.totalAmount.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-300 pt-4 text-[10px] text-gray-500 flex justify-between font-mono">
            <span>Sales Invoice #{order.id.replace('ORD-', '')}</span>
            <span>Thank you for choosing Epicurean Coffee!</span>
          </div>
        </div>
      </div>
    </div>
  );
}

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
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedCustomShippingDate, setSelectedCustomShippingDate] = useState('');

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '',
    category: 'Roasted Beans',
    pricePerKg: 200000,
    pricePer500g: 0,
    pricePer200g: 60000,
    greenBeanCostPerKg: 150000,
    roastingCostPerKg: 20000,
    packagingCostPerKg: 7500,
    description: '',
    isExclusive: false,
    allowedResellers: []
  });

  const [paymentProofFile, setPaymentProofFile] = useState<string>('');

  const [cart, setCart] = useState<OrderItem[]>([]);
  const [customerType, setCustomerType] = useState<'perorangan' | 'cafe'>('cafe');
  const [destination, setDestination] = useState<'bandung' | 'luar_bandung'>('bandung');
  const [paymentMethod, setPaymentMethod] = useState<'transfer' | 'kontra_bon_15' | 'kontra_bon_30'>('transfer');
  const [customerInfo, setCustomerInfo] = useState({ name: '', company: '', address: '', phone: '' });

  const scheduleInfo = calculateOrderSchedule();

  useEffect(() => {
    const savedUser = localStorage.getItem('epicurean_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setCurrentUser(parsed);
        setCurrentStep('main');
        setCustomerInfo(prev => ({ 
          ...prev, 
          name: parsed.username || '', 
          company: parsed.companyName || '' 
        }));
      } catch (e) {
        localStorage.removeItem('epicurean_user');
      }
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const googleUser: UserAccount = {
          username: session.user.user_metadata?.full_name || session.user.email || 'User Google',
          role: 'pembeli',
          companyName: 'Pembeli Google Auth'
        };
        setCurrentUser(googleUser);
        localStorage.setItem('epicurean_user', JSON.stringify(googleUser));
        setCurrentStep('main');
        setCustomerInfo(prev => ({ ...prev, name: googleUser.username }));
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const googleUser: UserAccount = {
          username: session.user.user_metadata?.full_name || session.user.email || 'User Google',
          role: 'pembeli',
          companyName: 'Pembeli Google Auth'
        };
        setCurrentUser(googleUser);
        localStorage.setItem('epicurean_user', JSON.stringify(googleUser));
        setCurrentStep('main');
        setCustomerInfo(prev => ({ ...prev, name: googleUser.username }));
      }
    });

    return () => subscription.unsubscribe();
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
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
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

  const totalCartWeightKg = cart.reduce((acc, item) => acc + ((item.quantityGram * item.quantity) / 1000), 0);
  const totalCartUnits = cart.reduce((acc, item) => acc + item.quantity, 0);
  const jneRatePerKg = 18000;
  const shippingCost = destination === 'bandung' ? 0 : Math.ceil(totalCartWeightKg) * jneRatePerKg;
  const cartSubtotal = cart.reduce((acc, item) => acc + item.totalPrice, 0);
  const grandTotal = cartSubtotal + shippingCost;

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

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    });
    if (error) alert('Gagal login via Google: ' + error.message);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('epicurean_user');
    setCurrentUser(null);
    setCurrentStep('welcome');
    setCart([]);
  };

  const addProductToCart = (prod: Product, packType: '1kg' | '500g' | '200g', deltaQty: number = 1) => {
    let weightGram = 1000;
    let unitPrice = prod.pricePerKg || 200000;
    let packLabel = '1 Kg';

    if (packType === '200g') {
      weightGram = 200;
      unitPrice = prod.pricePer200g || Math.round((prod.pricePerKg * 0.25));
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

  const updateCartItemQuantity = (itemId: string, delta: number) => {
    const existingIndex = cart.findIndex(i => i.id === itemId);
    if (existingIndex > -1) {
      const updatedCart = [...cart];
      const newQty = updatedCart[existingIndex].quantity + delta;
      if (newQty <= 0) {
        setCart(cart.filter(i => i.id !== itemId));
      } else {
        updatedCart[existingIndex].quantity = newQty;
        updatedCart[existingIndex].totalPrice = newQty * updatedCart[existingIndex].unitPrice;
        setCart(updatedCart);
      }
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

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
      paymentMethod: currentUser?.role === 'pembeli' ? 'transfer' : paymentMethod,
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
      alert('Pre-order Anda berhasil terkirim!');
      setCart([]);
      setIsCartDrawerOpen(false);
      fetchOrders();
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    await supabase.from('orders').update({ status }).eq('id', orderId);
    fetchOrders();
  };

  const updateFeedbackStatus = async (feedbackId: string, status: 'Open' | 'Resolved') => {
    await supabase.from('customer_feedbacks').update({ status }).eq('id', feedbackId);
    fetchFeedbacks();
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name) return;

    const payload = {
      id: editingProduct ? editingProduct.id : `PROD-${Date.now().toString().slice(-4)}`,
      name: productForm.name,
      category: productForm.category,
      price_per_kg: Number(productForm.pricePerKg || 0),
      price_per_500g: Number(productForm.pricePer500g || 0),
      price_per_200g: Number(productForm.pricePer200g || 0),
      green_bean_cost_per_kg: Number(productForm.greenBeanCostPerKg || 0),
      roasting_cost_per_kg: Number(productForm.roastingCostPerKg || 0),
      packaging_cost_per_kg: Number(productForm.packagingCostPerKg || 0),
      description: productForm.description || '',
      is_exclusive: Boolean(productForm.isExclusive)
    };

    const { error } = await supabase.from('products').upsert(payload);
    if (!error) {
      alert('Produk berhasil disimpan!');
      setIsProductModalOpen(false);
      setEditingProduct(null);
      fetchProducts();
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Yakin ingin menghapus produk ini?')) {
      await supabase.from('products').delete().eq('id', id);
      fetchProducts();
    }
  };

  // FITUR KIRIM INVOICE VIA WHATSAPP (DIRECT FIX STUCK)
  const handleSendWhatsAppInvoice = (order: Order) => {
    let rawPhone = order.customerPhone.replace(/[^0-9]/g, '');
    
    if (rawPhone.startsWith('0')) {
      rawPhone = '62' + rawPhone.slice(1);
    }

    const itemListText = order.items
      .map(item => `• ${item.name} (${item.quantity} Pack) - Rp ${item.totalPrice.toLocaleString('id-ID')}`)
      .join('\n');

    const message = `Halo Kak ${order.customerName} (${order.companyName}),\nBerikut rincian invoice pemesanan kopi Anda di *Epicurean Coffee Co.*:\n\n*ID Order:* ${order.id}\n*Tanggal:* ${order.createdAt}\n*Estimasi Kirim:* ${order.shippingDate || '-'}\n\n*Detail Item:*\n${itemListText}\n\n*Subtotal:* Rp ${order.subtotal.toLocaleString('id-ID')}\n*Ongkir:* Rp ${order.shippingCost.toLocaleString('id-ID')}\n*Total Tagihan:* Rp ${order.totalAmount.toLocaleString('id-ID')}\n\n*Metode Bayar:* ${order.paymentMethod.toUpperCase()}\n*BCA 7772400244 a/n CV MULTI AGRI SENTOSA*\n\nTerima kasih banyak!`;

    const waUrl = `https://api.whatsapp.com/send?phone=${rawPhone}&text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  // FILTERING ORDER UNTUK DASHBOARD SELLER
  const searchedOrders = orders.filter(o => {
    const matchesSearch = !searchOrderQuery.trim() || 
      o.id.toLowerCase().includes(searchOrderQuery.toLowerCase()) || 
      o.customerName.toLowerCase().includes(searchOrderQuery.toLowerCase()) || 
      o.companyName.toLowerCase().includes(searchOrderQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // FILTERING DAFTAR RIWAYAT BELANJA USER LOGIN
  const userOrderHistory = orders.filter(o => {
    if (!currentUser) return false;
    return o.customerName.toLowerCase() === currentUser.username.toLowerCase() ||
           (currentUser.companyName && o.companyName.toLowerCase() === currentUser.companyName.toLowerCase());
  });

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

          {selectedRole === 'pembeli' && (
            <div className="pt-4 border-t border-[#2E2B27] space-y-3 text-center">
              <p className="text-xs text-[#8C8479] font-mono">Atau masuk cepat dengan Google:</p>
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full bg-[#181614] hover:bg-[#282420] border border-[#38332E] text-[#EFECE6] py-3 text-xs font-mono flex items-center justify-center space-x-2 transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Lanjutkan dengan Google</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#181614] text-[#EFECE6] font-sans antialiased pb-24">
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
                  onClick={() => setIsProfileModalOpen(true)}
                  className="border border-[#38332E] bg-[#1F1C19] px-3 py-1.5 flex items-center space-x-2 hover:border-[#C8A97E] transition-all text-xs font-mono text-[#EFECE6]"
                >
                  <User className="h-3.5 w-3.5 text-[#C8A97E]" />
                  <span>Profil & Riwayat</span>
                </button>

                <button
                  onClick={() => setIsCartDrawerOpen(true)}
                  className="border border-[#38332E] bg-[#1F1C19] px-3 py-1.5 flex items-center space-x-2 hover:border-[#C8A97E] transition-all text-xs font-mono text-[#EFECE6]"
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
          <div className="space-y-8">
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
                <p className="text-xs text-[#8C8479]">Biji kopi disangrai fresh sesuai pesanan.</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-xs text-sky-400 font-mono uppercase">
                  <Truck className="h-3.5 w-3.5" />
                  <span>Pengiriman Khusus</span>
                </div>
                <p className="text-sm font-serif text-[#EFECE6]">Senin & Selasa</p>
                <p className="text-xs text-[#8C8479]">Pengiriman melayani hari Senin & Selasa.</p>
              </div>
            </div>

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
                {filteredProducts.map((p) => {
                  const price200g = p.pricePer200g || Math.round(p.pricePerKg * 0.25);
                  return (
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
                        <div className="flex justify-between items-center text-xs font-mono">
                          <div>
                            <span className="text-[#EFECE6] font-medium block">Kemasan 1 Kg</span>
                            <span className="text-[#C8A97E]">Rp {p.pricePerKg.toLocaleString('id-ID')}</span>
                          </div>
                          <button
                            onClick={() => addProductToCart(p, '1kg', 1)}
                            className="border border-[#38332E] hover:border-[#C8A97E] bg-[#181614] text-xs font-mono text-[#EFECE6] px-3 py-1.5 transition-all"
                          >
                            + 1 Kg
                          </button>
                        </div>

                        {p.category !== 'Green Beans' && (
                          <div className="flex justify-between items-center text-xs font-mono border-t border-[#2A2723] pt-2">
                            <div>
                              <span className="text-[#EFECE6] font-medium block">Kemasan 200g</span>
                              <span className="text-[#C8A97E]">Rp {price200g.toLocaleString('id-ID')}</span>
                            </div>
                            <button
                              onClick={() => addProductToCart(p, '200g', 1)}
                              className="border border-[#38332E] hover:border-[#C8A97E] bg-[#181614] text-xs font-mono text-[#EFECE6] px-3 py-1.5 transition-all"
                            >
                              + 200g
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex justify-between items-center border-b border-[#2E2B27] pb-4">
              <h1 className="text-xl font-serif text-[#EFECE6]">Fulfillment & Order Control</h1>

              <div className="flex space-x-2 text-xs font-mono">
                <button
                  onClick={() => setSellerSubTab('orders')}
                  className={`px-4 py-2 transition-all ${sellerSubTab === 'orders' ? 'bg-[#C8A97E] text-[#181614] font-bold' : 'text-[#8C8479] hover:text-[#EFECE6]'}`}
                >
                  Orders ({orders.length})
                </button>

                <button
                  onClick={() => setSellerSubTab('products')}
                  className={`px-4 py-2 transition-all ${sellerSubTab === 'products' ? 'bg-[#C8A97E] text-[#181614] font-bold' : 'text-[#8C8479] hover:text-[#EFECE6]'}`}
                >
                  Products ({products.length})
                </button>

                <button
                  onClick={() => setSellerSubTab('feedbacks')}
                  className={`px-4 py-2 transition-all ${sellerSubTab === 'feedbacks' ? 'bg-[#C8A97E] text-[#181614] font-bold' : 'text-[#8C8479] hover:text-[#EFECE6]'}`}
                >
                  Feedbacks ({feedbacks.length})
                </button>

                <button
                  onClick={() => setSellerSubTab('recap')}
                  className={`px-4 py-2 transition-all ${sellerSubTab === 'recap' ? 'bg-[#C8A97E] text-[#181614] font-bold' : 'text-[#8C8479] hover:text-[#EFECE6]'}`}
                >
                  Rekap Produksi
                </button>
              </div>
            </div>

            {sellerSubTab === 'orders' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#1F1C19] p-4 border border-[#2E2B27]">
                  <div className="relative w-full sm:w-80">
                    <Search className="h-3.5 w-3.5 text-[#8C8479] absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Cari ID Order / Customer / Cafe..."
                      value={searchOrderQuery}
                      onChange={(e) => setSearchOrderQuery(e.target.value)}
                      className="w-full bg-[#181614] border border-[#38332E] pl-9 pr-3 py-2 text-xs font-mono text-[#EFECE6] focus:outline-none focus:border-[#C8A97E]"
                    />
                  </div>

                  <div className="flex items-center space-x-2 text-xs font-mono w-full sm:w-auto">
                    <Filter className="h-3.5 w-3.5 text-[#C8A97E]" />
                    <span className="text-[#8C8479]">Status:</span>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="bg-[#181614] border border-[#38332E] px-3 py-2 text-xs font-mono text-[#EFECE6] focus:outline-none"
                    >
                      <option value="ALL">Semua Status ({orders.length})</option>
                      <option value="Pending Approval">Pending Approval</option>
                      <option value="Roasting Process">Roasting Process</option>
                      <option value="Ready for Shipping">Ready for Shipping</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                <div className="border border-[#2E2B27] bg-[#1F1C19] divide-y divide-[#2E2B27]">
                  {searchedOrders.length === 0 ? (
                    <p className="p-8 text-center text-xs text-[#8C8479] font-mono">Pesanan tidak ditemukan.</p>
                  ) : (
                    searchedOrders.map((o) => (
                      <div key={o.id} className="p-6 space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                          <div>
                            <div className="flex items-center space-x-3">
                              <span className="text-xs font-mono text-[#C8A97E] font-bold">{o.id}</span>
                              <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${getStatusBadgeClass(o.status)}`}>
                                {o.status}
                              </span>
                            </div>
                            <h3 className="text-base font-serif text-[#EFECE6] mt-1">{o.customerName} ({o.companyName})</h3>
                            <p className="text-xs text-[#8C8479] font-mono mt-0.5">Tgl Order: {o.createdAt} | WA: {o.customerPhone}</p>
                          </div>

                          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                            <button
                              onClick={() => handleSendWhatsAppInvoice(o)}
                              className="border border-emerald-700/50 hover:bg-emerald-950/40 text-xs font-mono px-3 py-1.5 text-emerald-400 bg-[#181614] flex items-center space-x-1.5 transition-all"
                            >
                              <Send className="h-3.5 w-3.5 text-emerald-400" />
                              <span>Kirim WA</span>
                            </button>

                            <button
                              onClick={() => setSelectedInvoiceOrder(o)}
                              className="border border-[#38332E] hover:border-[#C8A97E] text-xs font-mono px-3 py-1.5 text-[#EFECE6] bg-[#181614] flex items-center space-x-1.5 transition-all"
                            >
                              <FileText className="h-3.5 w-3.5 text-[#C8A97E]" />
                              <span>Cetak</span>
                            </button>

                            <select
                              value={o.status}
                              onChange={(e) => updateOrderStatus(o.id, e.target.value as Order['status'])}
                              className="bg-[#181614] border border-[#38332E] px-2.5 py-1.5 text-xs font-mono text-[#EFECE6] focus:outline-none"
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
                    ))
                  )}
                </div>
              </div>
            )}

            {sellerSubTab === 'products' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-serif text-[#EFECE6]">Kelola Katalog Biji Kopi</h2>
                  <button
                    onClick={() => {
                      setEditingProduct(null);
                      setProductForm({
                        name: '',
                        category: 'Roasted Beans',
                        pricePerKg: 200000,
                        pricePer200g: 60000,
                        greenBeanCostPerKg: 120000,
                        roastingCostPerKg: 20000,
                        packagingCostPerKg: 7500,
                        description: '',
                        isExclusive: false
                      });
                      setIsProductModalOpen(true);
                    }}
                    className="bg-[#C8A97E] text-[#181614] font-mono text-xs px-4 py-2 font-bold hover:bg-[#b5956a] transition-all flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Tambah Produk Baru</span>
                  </button>
                </div>

                <div className="border border-[#2E2B27] bg-[#1F1C19] divide-y divide-[#2E2B27]">
                  {products.map((p) => (
                    <div key={p.id} className="p-4 flex justify-between items-center">
                      <div>
                        <span className="text-[10px] text-[#8C8479] font-mono uppercase">{p.category}</span>
                        <h4 className="text-sm font-serif text-[#EFECE6]">{p.name}</h4>
                        <p className="text-xs font-mono text-[#C8A97E] mt-0.5">
                          1 Kg: Rp {p.pricePerKg.toLocaleString('id-ID')} | 200g: Rp {(p.pricePer200g || Math.round(p.pricePerKg * 0.25)).toLocaleString('id-ID')}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setEditingProduct(p);
                            setProductForm(p);
                            setIsProductModalOpen(true);
                          }}
                          className="border border-[#38332E] hover:border-[#C8A97E] text-xs font-mono px-3 py-1.5 text-[#EFECE6]"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="border border-[#38332E] hover:border-rose-400 text-xs font-mono px-3 py-1.5 text-rose-400"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {sellerSubTab === 'feedbacks' && (
              <div className="space-y-6">
                <h2 className="text-lg font-serif text-[#EFECE6]">Komplain & Masukan Pelanggan</h2>
                <div className="border border-[#2E2B27] bg-[#1F1C19] divide-y divide-[#2E2B27]">
                  {feedbacks.length === 0 ? (
                    <p className="p-6 text-xs text-[#8C8479] font-mono">Belum ada keluhan dari pelanggan.</p>
                  ) : (
                    feedbacks.map((f) => (
                      <div key={f.id} className="p-6 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-xs font-mono text-[#C8A97E]">{f.category}</span>
                            <h4 className="text-sm font-serif text-[#EFECE6]">{f.customerName} ({f.companyName})</h4>
                          </div>
                          <button
                            onClick={() => updateFeedbackStatus(f.id, f.status === 'Open' ? 'Resolved' : 'Open')}
                            className={`px-3 py-1 text-xs font-mono ${f.status === 'Resolved' ? 'bg-emerald-900/50 text-emerald-400' : 'bg-amber-900/50 text-amber-400'}`}
                          >
                            {f.status}
                          </button>
                        </div>
                        <p className="text-xs text-[#A39B8E] leading-relaxed">{f.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {sellerSubTab === 'recap' && (
              <div className="space-y-6">
                <h2 className="text-lg font-serif text-[#EFECE6]">Rekapitulasi Kebutuhan Sangrai (Batch Mingguan)</h2>
                <div className="border border-[#2E2B27] bg-[#1F1C19] p-6 space-y-4 font-mono text-xs">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-4 border-b border-[#2E2B27]">
                    <div>
                      <span className="text-[#8C8479] block">Total Pesanan Active:</span>
                      <span className="text-base font-bold text-[#EFECE6]">{orders.filter(o => o.status !== 'Rejected').length} Order</span>
                    </div>
                    <div>
                      <span className="text-[#8C8479] block">Total Omset Batch:</span>
                      <span className="text-base font-bold text-[#C8A97E]">
                        Rp {orders.filter(o => o.status !== 'Rejected').reduce((acc, o) => acc + o.totalAmount, 0).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex justify-center items-center p-4">
          <div className="bg-[#1F1C19] border border-[#2E2B27] w-full max-w-2xl p-6 space-y-6 font-mono text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[#2E2B27] pb-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-[#C8A97E]" />
                <h3 className="text-base font-serif text-[#EFECE6]">Profil Saya & Riwayat Pembelian</h3>
              </div>
              <button onClick={() => setIsProfileModalOpen(false)} className="text-[#8C8479] hover:text-[#EFECE6]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="bg-[#181614] border border-[#38332E] p-4 space-y-2">
              <p className="text-[#8C8479]">Username / Akun: <strong className="text-[#EFECE6]">{currentUser?.username}</strong></p>
              <p className="text-[#8C8479]">Perusahaan / Cafe: <strong className="text-[#EFECE6]">{currentUser?.companyName || '-'}</strong></p>
              <p className="text-[#8C8479]">Peran Akun: <strong className="text-[#C8A97E] uppercase">{currentUser?.role}</strong></p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2 border-b border-[#2E2B27] pb-2">
                <History className="h-4 w-4 text-[#C8A97E]" />
                <h4 className="text-sm font-serif text-[#EFECE6]">Daftar Pesanan Saya ({userOrderHistory.length})</h4>
              </div>

              {userOrderHistory.length === 0 ? (
                <p className="text-center text-[#8C8479] py-6">Anda belum memiliki riwayat pesanan.</p>
              ) : (
                <div className="space-y-4 divide-y divide-[#2E2B27]">
                  {userOrderHistory.map((item) => (
                    <div key={item.id} className="pt-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-[#C8A97E] font-bold">{item.id}</span>
                          <span className="text-[#8C8479] block text-[10px] mt-0.5">Tgl Order: {item.createdAt}</span>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase border ${getStatusBadgeClass(item.status)}`}>
                          {item.status}
                        </span>
                      </div>

                      <div className="bg-[#181614] p-3 border border-[#2E2B27] space-y-1">
                        {item.items.map((prod, idx) => (
                          <div key={idx} className="flex justify-between text-[11px]">
                            <span>{prod.name} x {prod.quantity} Pack</span>
                            <span className="text-[#C8A97E]">Rp {prod.totalPrice.toLocaleString('id-ID')}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between text-xs pt-1">
                        <span className="text-[#8C8479]">Estimasi Kirim: <strong className="text-[#EFECE6]">{item.shippingDate || '-'}</strong></span>
                        <span className="font-bold text-[#EFECE6]">Total: Rp {item.totalAmount.toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isProductModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex justify-center items-center p-4">
          <div className="bg-[#1F1C19] border border-[#2E2B27] w-full max-w-lg p-6 space-y-4 font-mono text-xs">
            <div className="flex justify-between items-center border-b border-[#2E2B27] pb-3">
              <h3 className="text-sm font-serif text-[#EFECE6]">{editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}</h3>
              <button onClick={() => setIsProductModalOpen(false)} className="text-[#8C8479] hover:text-[#EFECE6]">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3">
              <div>
                <label className="text-[#8C8479] block mb-1">Nama Varian Kopi</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full bg-[#181614] border border-[#38332E] p-2 text-[#EFECE6]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[#8C8479] block mb-1">Kategori</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value as any })}
                    className="w-full bg-[#181614] border border-[#38332E] p-2 text-[#EFECE6]"
                  >
                    <option value="Green Beans">Green Beans</option>
                    <option value="Roasted Beans">Roasted Beans</option>
                    <option value="Blend Beans">Blend Beans</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#8C8479] block mb-1">Harga 1 Kg (Rp)</label>
                  <input
                    type="number"
                    required
                    value={productForm.pricePerKg}
                    onChange={(e) => setProductForm({ ...productForm, pricePerKg: Number(e.target.value) })}
                    className="w-full bg-[#181614] border border-[#38332E] p-2 text-[#EFECE6]"
                  />
                </div>
                <div>
                  <label className="text-[#8C8479] block mb-1">Harga 200g (Rp)</label>
                  <input
                    type="number"
                    value={productForm.pricePer200g}
                    onChange={(e) => setProductForm({ ...productForm, pricePer200g: Number(e.target.value) })}
                    className="w-full bg-[#181614] border border-[#38332E] p-2 text-[#EFECE6]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#8C8479] block mb-1">Deskripsi Singkat</label>
                <textarea
                  rows={2}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full bg-[#181614] border border-[#38332E] p-2 text-[#EFECE6]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#C8A97E] text-[#181614] font-bold py-2.5 hover:bg-[#b5956a] transition-all uppercase"
              >
                Simpan Produk
              </button>
            </form>
          </div>
        </div>
      )}

      {selectedInvoiceOrder && (
        <InvoiceModal
          order={selectedInvoiceOrder}
          onClose={() => setSelectedInvoiceOrder(null)}
        />
      )}

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

              {cart.length === 0 ? (
                <p className="text-xs text-[#8C8479] font-mono py-8 text-center">Keranjang Anda masih kosong.</p>
              ) : (
                <div className="space-y-3 divide-y divide-[#2E2B27]">
                  {cart.map((item) => (
                    <div key={item.id} className="pt-3 flex justify-between items-center text-xs font-mono">
                      <div className="space-y-1">
                        <p className="text-[#EFECE6] font-serif text-sm">{item.name}</p>
                        <p className="text-[#8C8479]">@ Rp {item.unitPrice.toLocaleString('id-ID')}</p>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="flex items-center border border-[#38332E] bg-[#181614]">
                          <button
                            type="button"
                            onClick={() => updateCartItemQuantity(item.id, -1)}
                            className="px-2 py-1 text-[#8C8479] hover:text-[#C8A97E] hover:bg-[#2A2723] transition-all"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-2.5 text-[#EFECE6] font-bold">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateCartItemQuantity(item.id, 1)}
                            className="px-2 py-1 text-[#8C8479] hover:text-[#C8A97E] hover:bg-[#2A2723] transition-all"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        <p className="text-[#C8A97E] font-bold w-20 text-right">
                          Rp {item.totalPrice.toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {cart.length > 0 && (
                <form onSubmit={handleCheckout} id="checkout-form" className="space-y-4 pt-4 border-t border-[#2E2B27]">
                  <div className="space-y-2">
                    <label className="block text-xs font-mono text-[#C8A97E] uppercase">
                      Pilih Tanggal Pengiriman (Hanya Senin / Selasa)
                    </label>
                    <CustomDeliveryDatePicker
                      value={selectedCustomShippingDate}
                      onChange={(dateStr) => setSelectedCustomShippingDate(dateStr)}
                    />
                  </div>

                  <div className="space-y-2 pt-2 border-t border-[#2E2B27]">
                    <label className="block text-xs font-mono text-[#C8A97E] uppercase">
                      Metode Pembayaran
                    </label>
                    
                    {currentUser?.role === 'pembeli' ? (
                      <div className="bg-[#181614] border border-[#38332E] p-3 text-xs font-mono space-y-1">
                        <span className="text-[#EFECE6] font-bold block">Transfer Bank BCA</span>
                        <p className="text-[#8C8479]">No. Rek: <strong className="text-[#C8A97E]">7772400244</strong></p>
                        <p className="text-[#8C8479]">a/n CV. MULTI AGRI SENTOSA</p>
                      </div>
                    ) : (
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value as any)}
                        className="w-full bg-[#181614] border border-[#38332E] px-3 py-2 text-xs font-mono text-[#EFECE6] focus:outline-none"
                      >
                        <option value="transfer">Transfer Bank BCA (7772400244 a/n CV Multi Agri Sentosa)</option>
                        <option value="kontra_bon_15">Kontra Bon (15 Hari)</option>
                        <option value="kontra_bon_30">Kontra Bon (30 Hari)</option>
                      </select>
                    )}
                  </div>

                  <div className="space-y-3 pt-2 border-t border-[#2E2B27]">
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
              )}
            </div>

            {cart.length > 0 && (
              <div className="pt-6 border-t border-[#2E2B27] space-y-4">
                <div className="flex justify-between font-serif text-base">
                  <span>Total Tagihan</span>
                  <span className="text-[#C8A97E]">Rp {grandTotal.toLocaleString('id-ID')}</span>
                </div>

                <button
                  type="submit"
                  form="checkout-form"
                  className="w-full py-3 text-xs font-mono uppercase tracking-wider bg-[#C8A97E] hover:bg-[#b5956a] text-[#181614] font-medium transition-all"
                >
                  Submit Pre-Order
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}