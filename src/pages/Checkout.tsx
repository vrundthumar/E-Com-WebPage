import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, MapPin, CreditCard, Wallet, Building, Banknote, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Layout } from '@/components/layout/Layout';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { Address, PaymentMethod } from '@/types';

type Step = 'address' | 'payment' | 'review';

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, getCartTotal, clearCart } = useCart();
  
  const [step, setStep] = useState<Step>('address');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [newAddress, setNewAddress] = useState({
    full_name: '',
    phone: '',
    address_line: '',
    city: '',
    state: '',
    pincode: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth?redirect=/checkout');
      return;
    }

    if (items.length === 0) {
      navigate('/products');
      return;
    }

    fetchAddresses();
  }, [user, items.length, navigate]);

  const fetchAddresses = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false });

    if (data && data.length > 0) {
      setAddresses(data as Address[]);
      const defaultAddr = data.find(a => a.is_default) || data[0];
      setSelectedAddressId(defaultAddr.id);
    }
  };

  const handleAddAddress = async () => {
    if (!user) return;
    
    if (!newAddress.full_name || !newAddress.phone || !newAddress.address_line || 
        !newAddress.city || !newAddress.state || !newAddress.pincode) {
      toast.error('Please fill all fields');
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('addresses')
      .insert({
        ...newAddress,
        user_id: user.id,
        is_default: addresses.length === 0,
      })
      .select()
      .single();

    if (error) {
      toast.error('Failed to add address');
    } else {
      setAddresses([...addresses, data as Address]);
      setSelectedAddressId(data.id);
      setIsAddingAddress(false);
      setNewAddress({
        full_name: '',
        phone: '',
        address_line: '',
        city: '',
        state: '',
        pincode: '',
      });
      toast.success('Address added');
    }
    setLoading(false);
  };

  const handlePlaceOrder = async () => {
    if (!user || !selectedAddressId) return;

    setLoading(true);
    const subtotal = getCartTotal();
    const shipping = subtotal >= 2000 ? 0 : 99;
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + shipping + tax;

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        address_id: selectedAddressId,
        payment_method: paymentMethod,
        subtotal,
        shipping,
        tax,
        total,
        status: 'placed',
        estimated_delivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      })
      .select()
      .single();

    if (orderError || !order) {
      toast.error('Failed to place order');
      setLoading(false);
      return;
    }

    // Create order items
    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product?.name || 'Product',
      product_image: item.product?.images?.[0] || null,
      size: item.size,
      quantity: item.quantity,
      price: item.product?.price || 0,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      toast.error('Failed to save order items');
      setLoading(false);
      return;
    }

    // Clear cart
    await clearCart();
    
    setLoading(false);
    navigate(`/order-success/${order.id}`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const subtotal = getCartTotal();
  const shipping = subtotal >= 2000 ? 0 : 99;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  const paymentMethods = [
    { id: 'upi', label: 'UPI', icon: Wallet, desc: 'Pay with any UPI app' },
    { id: 'card', label: 'Credit/Debit Card', icon: CreditCard, desc: 'Visa, Mastercard, Rupay' },
    { id: 'net_banking', label: 'Net Banking', icon: Building, desc: 'All major banks' },
    { id: 'cod', label: 'Cash on Delivery', icon: Banknote, desc: 'Pay when delivered' },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 pt-24">
        <h1 className="font-display text-3xl md:text-4xl font-semibold mb-8">Checkout</h1>

        {/* Steps */}
        <div className="flex items-center gap-2 mb-8 text-sm">
          {(['address', 'payment', 'review'] as Step[]).map((s, idx) => (
            <div key={s} className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (s === 'address' || (s === 'payment' && selectedAddressId) || 
                      (s === 'review' && selectedAddressId && paymentMethod)) {
                    setStep(s);
                  }
                }}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-full transition-colors',
                  step === s 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                )}
              >
                <span className="w-6 h-6 rounded-full border flex items-center justify-center text-xs">
                  {idx + 1}
                </span>
                <span className="capitalize hidden sm:inline">{s}</span>
              </button>
              {idx < 2 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Address Step */}
            {step === 'address' && (
              <div className="bg-card rounded-xl p-6 border">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-xl font-semibold flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Delivery Address
                  </h2>
                  <Button variant="outline" size="sm" onClick={() => setIsAddingAddress(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New
                  </Button>
                </div>

                {isAddingAddress ? (
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="full_name">Full Name</Label>
                        <Input
                          id="full_name"
                          value={newAddress.full_name}
                          onChange={(e) => setNewAddress({...newAddress, full_name: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={newAddress.phone}
                          onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="address_line">Address</Label>
                      <Input
                        id="address_line"
                        value={newAddress.address_line}
                        onChange={(e) => setNewAddress({...newAddress, address_line: e.target.value})}
                      />
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={newAddress.state}
                          onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="pincode">Pincode</Label>
                        <Input
                          id="pincode"
                          value={newAddress.pincode}
                          onChange={(e) => setNewAddress({...newAddress, pincode: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button onClick={handleAddAddress} disabled={loading}>
                        Save Address
                      </Button>
                      <Button variant="outline" onClick={() => setIsAddingAddress(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <RadioGroup
                    value={selectedAddressId || ''}
                    onValueChange={setSelectedAddressId}
                    className="space-y-3"
                  >
                    {addresses.map((addr) => (
                      <label
                        key={addr.id}
                        className={cn(
                          'flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-colors',
                          selectedAddressId === addr.id ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                        )}
                      >
                        <RadioGroupItem value={addr.id} className="mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{addr.full_name}</p>
                            {addr.is_default && (
                              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Default</span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{addr.phone}</p>
                          <p className="text-sm text-muted-foreground">
                            {addr.address_line}, {addr.city}, {addr.state} - {addr.pincode}
                          </p>
                        </div>
                      </label>
                    ))}
                  </RadioGroup>
                )}

                {addresses.length === 0 && !isAddingAddress && (
                  <p className="text-center text-muted-foreground py-8">
                    No addresses saved. Add a new address to continue.
                  </p>
                )}

                <div className="mt-6 flex justify-end">
                  <Button 
                    onClick={() => setStep('payment')} 
                    disabled={!selectedAddressId}
                  >
                    Continue to Payment
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Payment Step */}
            {step === 'payment' && (
              <div className="bg-card rounded-xl p-6 border">
                <h2 className="font-display text-xl font-semibold flex items-center gap-2 mb-6">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </h2>

                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
                  className="space-y-3"
                >
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className={cn(
                        'flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors',
                        paymentMethod === method.id ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                      )}
                    >
                      <RadioGroupItem value={method.id} />
                      <method.icon className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="font-medium">{method.label}</p>
                        <p className="text-sm text-muted-foreground">{method.desc}</p>
                      </div>
                    </label>
                  ))}
                </RadioGroup>

                <div className="mt-6 flex justify-between">
                  <Button variant="outline" onClick={() => setStep('address')}>
                    Back
                  </Button>
                  <Button onClick={() => setStep('review')}>
                    Review Order
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Review Step */}
            {step === 'review' && (
              <div className="space-y-6">
                {/* Selected Address */}
                <div className="bg-card rounded-xl p-6 border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Delivery Address
                    </h3>
                    <Button variant="ghost" size="sm" onClick={() => setStep('address')}>
                      Change
                    </Button>
                  </div>
                  {addresses.find(a => a.id === selectedAddressId) && (
                    <div className="text-sm">
                      <p className="font-medium">{addresses.find(a => a.id === selectedAddressId)?.full_name}</p>
                      <p className="text-muted-foreground">
                        {addresses.find(a => a.id === selectedAddressId)?.address_line}
                      </p>
                      <p className="text-muted-foreground">
                        {addresses.find(a => a.id === selectedAddressId)?.city}, {addresses.find(a => a.id === selectedAddressId)?.state} - {addresses.find(a => a.id === selectedAddressId)?.pincode}
                      </p>
                    </div>
                  )}
                </div>

                {/* Payment Method */}
                <div className="bg-card rounded-xl p-6 border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Payment Method
                    </h3>
                    <Button variant="ghost" size="sm" onClick={() => setStep('payment')}>
                      Change
                    </Button>
                  </div>
                  <p className="text-sm">
                    {paymentMethods.find(p => p.id === paymentMethod)?.label}
                  </p>
                </div>

                {/* Order Items */}
                <div className="bg-card rounded-xl p-6 border">
                  <h3 className="font-semibold mb-4">Order Items ({items.length})</h3>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="w-16 h-20 bg-muted rounded-md overflow-hidden">
                          {item.product?.images?.[0] && (
                            <img
                              src={item.product.images[0]}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium line-clamp-1">{item.product?.name}</p>
                          <p className="text-sm text-muted-foreground">Size: {item.size} | Qty: {item.quantity}</p>
                          <p className="font-semibold mt-1">{formatPrice((item.product?.price || 0) * item.quantity)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep('payment')}>
                    Back
                  </Button>
                  <Button onClick={handlePlaceOrder} disabled={loading} size="lg">
                    {loading ? 'Placing Order...' : `Place Order • ${formatPrice(total)}`}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl p-6 border sticky top-24">
              <h3 className="font-display text-lg font-semibold mb-4">Order Summary</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (18% GST)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              {shipping === 0 && (
                <p className="text-sm text-green-600 mt-4 flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  You qualify for free shipping!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
