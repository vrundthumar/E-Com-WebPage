import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Package, Truck, CheckCircle, Clock, MapPin, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { Order, OrderItem, Address, OrderStatus } from '@/types';

interface OrderWithDetails extends Order {
  items: OrderItem[];
  address: Address;
}

const statusSteps: { status: OrderStatus; label: string; icon: typeof Package }[] = [
  { status: 'placed', label: 'Order Placed', icon: Clock },
  { status: 'processing', label: 'Processing', icon: Package },
  { status: 'shipped', label: 'Shipped', icon: Truck },
  { status: 'out_for_delivery', label: 'Out for Delivery', icon: MapPin },
  { status: 'delivered', label: 'Delivered', icon: CheckCircle },
];

export default function OrderTracking() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState<OrderWithDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    async function fetchOrder() {
      if (!id) return;

      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .eq('user_id', user?.id)
        .maybeSingle();

      if (orderError || !orderData) {
        navigate('/account');
        return;
      }

      const { data: itemsData } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', id);

      const { data: addressData } = await supabase
        .from('addresses')
        .select('*')
        .eq('id', orderData.address_id)
        .maybeSingle();

      setOrder({
        ...orderData,
        items: itemsData || [],
        address: addressData,
      } as OrderWithDetails);
      setLoading(false);
    }

    fetchOrder();
  }, [id, user, navigate]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const getCurrentStepIndex = (status: OrderStatus | undefined) => {
    if (status === 'cancelled') return -1;
    return statusSteps.findIndex(s => s.status === status);
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 pt-24">
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-48 rounded-xl" />
            </div>
            <Skeleton className="h-64 rounded-xl" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!order) return null;

  const currentStep = getCurrentStepIndex(order.status as OrderStatus);
  const isCancelled = order.status === 'cancelled';

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/account">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-semibold">
              Order #{order.id.slice(0, 8).toUpperCase()}
            </h1>
            <p className="text-sm text-muted-foreground">
              Placed on {new Date(order.created_at).toLocaleDateString('en-IN', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Status Timeline */}
            <div className="bg-card rounded-xl p-6 border">
              <h2 className="font-semibold mb-6">Order Status</h2>
              
              {isCancelled ? (
                <div className="flex items-center gap-4 text-destructive">
                  <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                    <Package className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold">Order Cancelled</p>
                    <p className="text-sm text-muted-foreground">This order has been cancelled</p>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-muted" />
                  <div 
                    className="absolute left-6 top-6 w-0.5 bg-primary transition-all duration-500"
                    style={{ height: `${(currentStep / (statusSteps.length - 1)) * 100}%` }}
                  />

                  <div className="space-y-8">
                    {statusSteps.map((step, idx) => {
                      const isCompleted = idx <= currentStep;
                      const isCurrent = idx === currentStep;
                      
                      return (
                        <div key={step.status} className="flex items-center gap-4 relative">
                          <div
                            className={cn(
                              'w-12 h-12 rounded-full flex items-center justify-center z-10 transition-colors',
                              isCompleted
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground'
                            )}
                          >
                            <step.icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <p className={cn(
                              'font-medium',
                              isCurrent && 'text-primary'
                            )}>
                              {step.label}
                            </p>
                            {isCurrent && step.status === 'shipped' && (
                              <p className="text-sm text-muted-foreground">
                                Expected by {order.estimated_delivery 
                                  ? new Date(order.estimated_delivery).toLocaleDateString('en-IN', {
                                      weekday: 'short',
                                      month: 'short',
                                      day: 'numeric',
                                    })
                                  : '5-7 days'}
                              </p>
                            )}
                          </div>
                          {isCompleted && (
                            <CheckCircle className="h-5 w-5 text-primary" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="bg-card rounded-xl p-6 border">
              <h2 className="font-semibold mb-4">Items ({order.items.length})</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-20 bg-muted rounded-md overflow-hidden flex-shrink-0">
                      {item.product_image && (
                        <img
                          src={item.product_image}
                          alt={item.product_name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link 
                        to={`/products/${item.product_id}`}
                        className="font-medium hover:underline line-clamp-1"
                      >
                        {item.product_name}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        Size: {item.size} | Qty: {item.quantity}
                      </p>
                      <p className="font-semibold mt-1">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Delivery Address */}
            <div className="bg-card rounded-xl p-6 border">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Delivery Address
              </h3>
              {order.address && (
                <div className="text-sm space-y-1">
                  <p className="font-medium">{order.address.full_name}</p>
                  <p className="text-muted-foreground">{order.address.phone}</p>
                  <p className="text-muted-foreground">{order.address.address_line}</p>
                  <p className="text-muted-foreground">
                    {order.address.city}, {order.address.state} - {order.address.pincode}
                  </p>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="bg-card rounded-xl p-6 border">
              <h3 className="font-semibold mb-4">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>{formatPrice(order.tax)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button variant="outline" className="w-full" asChild>
                <Link to="/account">View All Orders</Link>
              </Button>
              <Button variant="ghost" className="w-full">
                Need Help?
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
