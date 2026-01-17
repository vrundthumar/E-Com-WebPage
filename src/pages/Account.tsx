import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Package, MapPin, LogOut, Edit2, Plus, Trash2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { Profile, Order, Address, OrderStatus } from '@/types';

export default function Account() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  
  const [editedProfile, setEditedProfile] = useState({
    full_name: '',
    phone: '',
  });

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
      navigate('/auth?redirect=/account');
      return;
    }

    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    if (!user) return;

    const [profileRes, ordersRes, addressesRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
      supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('addresses').select('*').eq('user_id', user.id).order('is_default', { ascending: false }),
    ]);

    if (profileRes.data) {
      setProfile(profileRes.data as Profile);
      setEditedProfile({
        full_name: profileRes.data.full_name || '',
        phone: profileRes.data.phone || '',
      });
    }
    if (ordersRes.data) setOrders(ordersRes.data as Order[]);
    if (addressesRes.data) setAddresses(addressesRes.data as Address[]);
    
    setLoading(false);
  };

  const handleUpdateProfile = async () => {
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: editedProfile.full_name,
        phone: editedProfile.phone,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (error) {
      toast.error('Failed to update profile');
    } else {
      toast.success('Profile updated');
      setProfile({ ...profile!, ...editedProfile });
      setIsEditing(false);
    }
  };

  const handleAddAddress = async () => {
    if (!user) return;

    if (!newAddress.full_name || !newAddress.phone || !newAddress.address_line ||
        !newAddress.city || !newAddress.state || !newAddress.pincode) {
      toast.error('Please fill all fields');
      return;
    }

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
      setAddresses([data as Address, ...addresses]);
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
  };

  const handleDeleteAddress = async (id: string) => {
    const { error } = await supabase.from('addresses').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete address');
    } else {
      setAddresses(addresses.filter(a => a.id !== id));
      toast.success('Address deleted');
    }
  };

  const handleSetDefault = async (id: string) => {
    if (!user) return;

    await supabase.from('addresses').update({ is_default: false }).eq('user_id', user.id);
    await supabase.from('addresses').update({ is_default: true }).eq('id', id);
    
    setAddresses(addresses.map(a => ({ ...a, is_default: a.id === id })));
    toast.success('Default address updated');
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-destructive bg-destructive/10';
      case 'shipped':
      case 'out_for_delivery': return 'text-blue-600 bg-blue-100';
      default: return 'text-amber-600 bg-amber-100';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 pt-24">
          <Skeleton className="h-10 w-48 mb-8" />
          <div className="grid lg:grid-cols-4 gap-8">
            <Skeleton className="h-64 rounded-xl" />
            <div className="lg:col-span-3">
              <Skeleton className="h-96 rounded-xl" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 pt-24">
        <h1 className="font-display text-3xl md:text-4xl font-semibold mb-8">My Account</h1>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl p-6 border sticky top-24">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-10 w-10 text-primary" />
                </div>
                <h2 className="font-semibold">{profile?.full_name || 'User'}</h2>
                <p className="text-sm text-muted-foreground">{profile?.email}</p>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full text-destructive hover:text-destructive"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="orders">
              <TabsList className="w-full justify-start mb-6">
                <TabsTrigger value="orders" className="gap-2">
                  <Package className="h-4 w-4" />
                  Orders
                </TabsTrigger>
                <TabsTrigger value="profile" className="gap-2">
                  <User className="h-4 w-4" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="addresses" className="gap-2">
                  <MapPin className="h-4 w-4" />
                  Addresses
                </TabsTrigger>
              </TabsList>

              {/* Orders Tab */}
              <TabsContent value="orders" className="space-y-4">
                {orders.length === 0 ? (
                  <div className="bg-card rounded-xl p-12 border text-center">
                    <Package className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-2">No orders yet</h3>
                    <p className="text-muted-foreground mb-6">Start shopping to see your orders here</p>
                    <Button asChild>
                      <Link to="/products">Shop Now</Link>
                    </Button>
                  </div>
                ) : (
                  orders.map((order) => (
                    <Link
                      key={order.id}
                      to={`/orders/${order.id}`}
                      className="block bg-card rounded-xl p-6 border hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Order ID</p>
                          <p className="font-mono font-medium">#{order.id.slice(0, 8).toUpperCase()}</p>
                        </div>
                        <span className={cn(
                          'px-3 py-1 rounded-full text-xs font-medium capitalize',
                          getStatusColor(order.status as OrderStatus)
                        )}>
                          {order.status?.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          <p className="text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString('en-IN', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </p>
                          <p className="font-semibold">{formatPrice(order.total)}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </Link>
                  ))
                )}
              </TabsContent>

              {/* Profile Tab */}
              <TabsContent value="profile">
                <div className="bg-card rounded-xl p-6 border">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-semibold text-lg">Personal Information</h2>
                    {!isEditing && (
                      <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="full_name">Full Name</Label>
                        <Input
                          id="full_name"
                          value={editedProfile.full_name}
                          onChange={(e) => setEditedProfile({...editedProfile, full_name: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" value={profile?.email || ''} disabled />
                        <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={editedProfile.phone}
                          onChange={(e) => setEditedProfile({...editedProfile, phone: e.target.value})}
                        />
                      </div>
                      <div className="flex gap-3">
                        <Button onClick={handleUpdateProfile}>Save Changes</Button>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Full Name</p>
                        <p className="font-medium">{profile?.full_name || 'Not set'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{profile?.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">{profile?.phone || 'Not set'}</p>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Addresses Tab */}
              <TabsContent value="addresses" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-lg">Saved Addresses</h2>
                  <Button onClick={() => setIsAddingAddress(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Address
                  </Button>
                </div>

                {isAddingAddress && (
                  <div className="bg-card rounded-xl p-6 border">
                    <h3 className="font-semibold mb-4">Add New Address</h3>
                    <div className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="addr_name">Full Name</Label>
                          <Input
                            id="addr_name"
                            value={newAddress.full_name}
                            onChange={(e) => setNewAddress({...newAddress, full_name: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="addr_phone">Phone</Label>
                          <Input
                            id="addr_phone"
                            value={newAddress.phone}
                            onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="addr_line">Address</Label>
                        <Input
                          id="addr_line"
                          value={newAddress.address_line}
                          onChange={(e) => setNewAddress({...newAddress, address_line: e.target.value})}
                        />
                      </div>
                      <div className="grid sm:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="addr_city">City</Label>
                          <Input
                            id="addr_city"
                            value={newAddress.city}
                            onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="addr_state">State</Label>
                          <Input
                            id="addr_state"
                            value={newAddress.state}
                            onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="addr_pincode">Pincode</Label>
                          <Input
                            id="addr_pincode"
                            value={newAddress.pincode}
                            onChange={(e) => setNewAddress({...newAddress, pincode: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button onClick={handleAddAddress}>Save Address</Button>
                        <Button variant="outline" onClick={() => setIsAddingAddress(false)}>Cancel</Button>
                      </div>
                    </div>
                  </div>
                )}

                {addresses.length === 0 && !isAddingAddress ? (
                  <div className="bg-card rounded-xl p-12 border text-center">
                    <MapPin className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-2">No addresses saved</h3>
                    <p className="text-muted-foreground">Add an address for faster checkout</p>
                  </div>
                ) : (
                  addresses.map((addr) => (
                    <div key={addr.id} className="bg-card rounded-xl p-6 border">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="font-medium">{addr.full_name}</p>
                            {addr.is_default && (
                              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Default</span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{addr.phone}</p>
                          <p className="text-sm text-muted-foreground">
                            {addr.address_line}, {addr.city}, {addr.state} - {addr.pincode}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {!addr.is_default && (
                            <Button variant="ghost" size="sm" onClick={() => handleSetDefault(addr.id)}>
                              Set Default
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="text-destructive"
                            onClick={() => handleDeleteAddress(addr.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
}
