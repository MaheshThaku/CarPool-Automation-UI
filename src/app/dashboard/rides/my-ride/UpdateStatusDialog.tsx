'use client';

import { useState } from 'react';
import { Navigation, XCircle, CheckCircle, Clock, AlertTriangle, ArrowRight } from 'lucide-react';

import { RideResponse, RideStatus } from '@/types/ride.types';
import { rideService } from '@/services/ride.service';
import { getRideStatusConfig } from './ride-status';

interface UpdateStatusDialogProps {
  ride: RideResponse;
  onClose: () => void;
  onRefresh?: () => void;
}

export default function UpdateStatusDialog({
  ride,
  onClose,
  onRefresh,
}: UpdateStatusDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pendingStatus, setPendingStatus] = useState<RideStatus | null>(null);

  const statusConfig = getRideStatusConfig(ride.status);
  const StatusIcon = statusConfig.icon;

  const handleStatusChange = async (newStatus: RideStatus) => {
    try {
      setLoading(true);
      setError('');
      await rideService.updateRideStatus(ride.id, newStatus);
      if (onRefresh) {
        onRefresh();
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update ride status');
      setPendingStatus(null);
    } finally {
      setLoading(false);
    }
  };

  const getConfirmationMessage = (status: RideStatus) => {
    switch (status) {
      case 'STARTED':
        return 'Are you sure you want to start this ride? This will notify all passengers.';
      case 'COMPLETED':
        return 'Are you sure you want to mark this ride as completed? This will complete all approved bookings.';
      case 'CANCELLED':
        return 'Are you sure you want to cancel this ride? This will cancel all bookings.';
      default:
        return 'Are you sure you want to update the ride status?';
    }
  };

  const renderConfirmationState = (status: RideStatus) => {
    const isCancel = status === 'CANCELLED';
    const isComplete = status === 'COMPLETED';
    const btnText = isCancel ? 'Confirm Cancellation' : isComplete ? 'Confirm Completion' : 'Confirm Start';
    const btnClass = isCancel 
      ? 'bg-red-600 hover:bg-red-700 text-white' 
      : isComplete 
        ? 'bg-green-600 hover:bg-green-700 text-white' 
        : 'bg-indigo-600 hover:bg-indigo-700 text-white';

    return (
      <div className="space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-50">
          <AlertTriangle size={24} className="text-amber-500" />
        </div>
        
        <h3 className="text-lg font-semibold text-[var(--heading)]">
          {isCancel ? 'Cancel Ride' : isComplete ? 'Complete Ride' : 'Start Ride'}?
        </h3>
        
        <p className="text-sm text-[var(--text-light)]">
          {getConfirmationMessage(status)}
        </p>

        {error && (
          <div className="rounded-xl bg-red-50 p-3 text-xs text-red-600">
            {error}
          </div>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => setPendingStatus(null)}
            disabled={loading}
            className="flex-1 rounded-xl border border-[var(--border)] py-2.5 text-sm font-medium text-[var(--text)] hover:bg-gray-50 disabled:opacity-50"
          >
            Go Back
          </button>
          <button
            onClick={() => handleStatusChange(status)}
            disabled={loading}
            className={`flex-1 rounded-xl py-2.5 text-sm font-semibold disabled:opacity-60 transition-all ${btnClass}`}
          >
            {loading ? 'Updating...' : btnText}
          </button>
        </div>
      </div>
    );
  };

  const renderInitialState = () => {
    return (
      <div className="space-y-5">
        <h3 className="text-lg font-bold text-[var(--heading)]">
          Update Ride Status
        </h3>
        
        {/* Ride info card */}
        <div className="rounded-xl border border-[var(--border)] p-3.5 bg-gray-50 text-left">
          <div className="flex items-center gap-2 font-semibold text-sm text-[var(--heading)]">
            <span>{ride.sourceCity}</span>
            <ArrowRight size={12} className="text-[var(--text-light)]" />
            <span>{ride.destinationCity}</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-[var(--text-light)]">Ride #{ride.id}</span>
            <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusConfig.bg} ${statusConfig.text}`}>
              <StatusIcon size={10} />
              {statusConfig.label}
            </span>
          </div>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 p-3 text-xs text-red-600 text-left">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <p className="text-xs font-semibold text-[var(--text-light)] text-left uppercase tracking-wider">
            Available Transitions
          </p>

          {ride.status === 'SCHEDULED' && (
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => setPendingStatus('STARTED')}
                className="flex items-center justify-between rounded-xl border border-indigo-100 bg-indigo-50/50 hover:bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-700 transition-all text-left"
              >
                <span className="flex items-center gap-2">
                  <Navigation size={16} />
                  Start Ride
                </span>
                <span className="text-xs font-normal text-indigo-500">Goes live for passengers</span>
              </button>
              
              <button
                onClick={() => setPendingStatus('CANCELLED')}
                className="flex items-center justify-between rounded-xl border border-red-100 bg-red-50/50 hover:bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition-all text-left"
              >
                <span className="flex items-center gap-2">
                  <XCircle size={16} />
                  Cancel Ride
                </span>
                <span className="text-xs font-normal text-red-400">Cancels all bookings</span>
              </button>
            </div>
          )}

          {ride.status === 'STARTED' && (
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => setPendingStatus('COMPLETED')}
                className="flex items-center justify-between rounded-xl border border-green-100 bg-green-50/50 hover:bg-green-50 px-4 py-3 text-sm font-semibold text-green-700 transition-all text-left"
              >
                <span className="flex items-center gap-2">
                  <CheckCircle size={16} />
                  Complete Ride
                </span>
                <span className="text-xs font-normal text-green-500">Completes approved bookings</span>
              </button>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full rounded-xl border border-[var(--border)] py-2.5 text-sm font-medium text-[var(--text)] hover:bg-gray-50 transition-all"
        >
          Close
        </button>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl relative">
        {pendingStatus ? renderConfirmationState(pendingStatus) : renderInitialState()}
      </div>
    </div>
  );
}
