"use client";

import { X, Calendar, Clock, Users, IndianRupee, BookOpen, ArrowRight, Landmark, MapPin } from "lucide-react";
import { BookingListItem } from "@/types/dashboard.types";
import { parseBookedOn, statusConfig } from "./bookingUtils";

interface BookingDetailsModalProps {
  booking: BookingListItem;
  onClose: () => void;
}

export default function BookingDetailsModal({ booking, onClose }: BookingDetailsModalProps) {
  const dt = parseBookedOn(booking.bookingTime);
  const sc = statusConfig(booking.status);
  const StatusIcon = sc.icon;

  // Render status description
  const getStatusMessage = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "Your booking request is approved by the driver! Your seat is reserved, and you are ready to travel.";
      case "PENDING":
        return "The booking request is waiting for the driver's approval. You will receive an update as soon as they respond.";
      case "COMPLETED":
        return "This trip has been completed successfully. We hope you had a safe and comfortable journey!";
      case "REJECTED":
        return "Your booking request was declined by the driver. You can browse and request other available rides.";
      case "CANCELLED":
        return "This booking request was cancelled. No seats are reserved for this ride.";
      default:
        return "Status details are unavailable.";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl transition-all animate-in fade-in zoom-in-95 duration-200">
        
        {/* Ticket Header Gradient */}
        <div className="bg-gradient-to-br from-[#E4A538] to-[#C7881D] px-6 py-6 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/10 rounded-full p-1.5 transition-all"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
          
          <div className="flex items-center gap-2 text-white/90">
            <BookOpen size={16} />
            <span className="text-xs font-semibold uppercase tracking-wider">Ride Share Ticket</span>
          </div>

          <h3 className="mt-3 flex items-center gap-2 text-xl font-bold flex-wrap">
            <span>{booking.sourceCity}</span>
            <ArrowRight size={16} className="text-white/80" />
            <span>{booking.destinationCity}</span>
          </h3>

          <p className="mt-1 flex items-center gap-1.5 text-xs text-white/80">
            <MapPin size={12} className="shrink-0" />
            <span className="truncate">{booking.sourceAddress || booking.sourceCity}</span>
            <ArrowRight size={12} className="shrink-0 opacity-70" />
            <span className="truncate">{booking.destinationAddress || booking.destinationCity}</span>
          </p>
        </div>

        {/* Ticket Tear Dotted Separator (Premium visual style) */}
        <div className="relative flex items-center bg-gray-50 py-1">
          <div className="absolute left-0 -ml-3 h-6 w-6 rounded-full bg-black/60 backdrop-blur-sm" />
          <div className="w-full border-t-2 border-dashed border-gray-200 mx-4" />
          <div className="absolute right-0 -mr-3 h-6 w-6 rounded-full bg-black/60 backdrop-blur-sm" />
        </div>

        {/* Main Content Area */}
        <div className="bg-gray-50 px-6 pb-6 pt-4 space-y-4">
          
          {/* Status Alert Badge */}
          <div className={`flex items-start gap-3 rounded-2xl border p-4 ${sc.bg} ${sc.text} border-current/10`}>
            <div className={`mt-0.5 rounded-lg p-1 bg-white shadow-sm flex items-center justify-center shrink-0`}>
              <StatusIcon size={16} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider">{sc.label} Booking</p>
              <p className="mt-1 text-xs leading-relaxed opacity-90">
                {getStatusMessage(booking.status)}
              </p>
            </div>
          </div>

          {/* Details Sections Grid */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3.5 shadow-sm">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Booking Summary</h4>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Date */}
              <div className="flex items-start gap-2.5">
                <Calendar size={15} className="text-[#E4A538] shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-[10px] text-gray-400 font-medium">Booked Date</p>
                  <p className="text-xs font-semibold text-gray-800 mt-0.5 truncate">{dt.date}</p>
                  <p className="text-[10px] text-gray-400">{dt.day}</p>
                </div>
              </div>

              {/* Time */}
              <div className="flex items-start gap-2.5">
                <Clock size={15} className="text-[#E4A538] shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-[10px] text-gray-400 font-medium">Booked Time</p>
                  <p className="text-xs font-semibold text-gray-800 mt-0.5 truncate">{dt.time}</p>
                </div>
              </div>

              {/* Seats */}
              <div className="flex items-start gap-2.5">
                <Users size={15} className="text-[#E4A538] shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-[10px] text-gray-400 font-medium">Seats Reserved</p>
                  <p className="text-xs font-semibold text-gray-800 mt-0.5 truncate">
                    {booking.seatsBooked} {booking.seatsBooked === 1 ? "Seat" : "Seats"}
                  </p>
                </div>
              </div>

              {/* Amount */}
              <div className="flex items-start gap-2.5">
                <IndianRupee size={15} className="text-[#E4A538] shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-[10px] text-gray-400 font-medium">Total Paid</p>
                  <p className="text-xs font-bold text-[#E4A538] mt-0.5 truncate">
                    Rs.{booking.totalAmount.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Driver details */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#E4A538] to-[#C7881D] font-bold text-white text-sm">
                {booking.driverName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800">{booking.driverName}</p>
                <p className="text-[10px] text-gray-400">Verified Driver Partner</p>
              </div>
            </div>
            
            <div className="rounded-lg bg-gray-50 px-2.5 py-1 text-[10px] font-semibold text-gray-500 border border-gray-100 flex items-center gap-1">
              <Landmark size={12} className="text-gray-400" />
              Direct Pay
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-gradient-to-r from-[#E4A538] to-[#D89B2B] py-3 text-sm font-semibold text-white transition-all hover:scale-[1.01] active:scale-[0.99] shadow-md shadow-amber-500/10"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
