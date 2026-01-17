import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import type { Order } from '@/types';

export default function OrderSuccess() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    async function fetchOrder() {
      if (!id) return;

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error || !data) {
        navigate('/');
        return;
      }

      setOrder(data as Order);
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

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="max-w-2xl mx-auto text-center">
            <Skeleton className="h-20 w-20 rounded-full mx-auto mb-6" />
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-80 mx-auto" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-2xl mx-auto">
          {/* Success Message */}
          <div className="text-center mb-8 animate-fade-up">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-semibold mb-3">
              Order Placed Successfully!
            </h1>
            <p className="text-muted-foreground text-lg">
              Thank you for shopping with Velin
            </p>
          </div>

          {/* Order Details Card */}
          <div className="bg-card rounded-xl p-6 border mb-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Order ID</p>
                <p className="font-mono font-medium">{order?.id.slice(0, 8).toUpperCase()}</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Order Total</p>
                <p className="font-semibold text-lg">{formatPrice(order?.total || 0)}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Estimated Delivery</p>
                <p className="font-semibold text-lg">
                  {order?.estimated_delivery 
                    ? new Date(order.estimated_delivery).toLocaleDateString('en-IN', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                      })
                    : '5-7 business days'}
                </p>
              </div>
            </div>

            <div className="border-t mt-6 pt-6">
              <p className="text-sm text-muted-foreground">
                We've sent a confirmation email with your order details. You can track your order status anytime.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <Button asChild className="flex-1">
              <Link to={`/orders/${order?.id}`}>
                Track Order
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <Link to="/products">
                Continue Shopping
              </Link>
            </Button>
          </div>

          {/* Additional Info */}
          <div className="grid sm:grid-cols-3 gap-6 mt-12 text-center animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <div>
              <h4 className="font-semibold mb-1">Need Help?</h4>
              <p className="text-sm text-muted-foreground">Contact our support team</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Easy Returns</h4>
              <p className="text-sm text-muted-foreground">30-day return policy</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Secure Payment</h4>
              <p className="text-sm text-muted-foreground">100% encrypted</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
