
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { ShoppingCart, Download, Truck, ArrowRight, Plus, Trash2, RefreshCw } from 'lucide-react';
import AIAssistant from '@/components/AIAssistant';

interface GroceryItem {
  id: number;
  name: string;
  amount: string;
  price: number;
  category: string;
  checked: boolean;
}

interface AlternativeItem {
  id: number;
  name: string;
  price: number;
  alternative: string;
  savings: number;
}

const Groceries = () => {
  // Sample grocery data
  const initialGroceries: GroceryItem[] = [
    { id: 1, name: 'Spinach', amount: '250g', price: 30, category: 'vegetables', checked: false },
    { id: 2, name: 'Tofu', amount: '500g', price: 80, category: 'proteins', checked: false },
    { id: 3, name: 'Brown Rice', amount: '1kg', price: 95, category: 'grains', checked: false },
    { id: 4, name: 'Greek Yogurt', amount: '400g', price: 120, category: 'dairy', checked: false },
    { id: 5, name: 'Chickpeas', amount: '500g', price: 75, category: 'proteins', checked: false },
    { id: 6, name: 'Bell Peppers', amount: '3 pcs', price: 60, category: 'vegetables', checked: false },
    { id: 7, name: 'Berries', amount: '200g', price: 150, category: 'fruits', checked: false },
    { id: 8, name: 'Olive Oil', amount: '250ml', price: 350, category: 'other', checked: false },
    { id: 9, name: 'Quinoa', amount: '300g', price: 180, category: 'grains', checked: false },
  ];

  // Alternative suggestions
  const alternatives: AlternativeItem[] = [
    { id: 7, name: 'Berries', price: 150, alternative: 'Seasonal Fruits', savings: 70 },
    { id: 9, name: 'Quinoa', price: 180, alternative: 'Brown Rice', savings: 90 },
  ];

  const [groceries, setGroceries] = useState<GroceryItem[]>(initialGroceries);
  const [newItem, setNewItem] = useState('');

  const handleCheck = (id: number) => {
    setGroceries(groceries.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    
    const newId = Math.max(...groceries.map(item => item.id)) + 1;
    setGroceries([...groceries, { 
      id: newId, 
      name: newItem, 
      amount: '1 item', 
      price: 0, 
      category: 'other',
      checked: false 
    }]);
    setNewItem('');
    
    toast({
      title: "Item Added",
      description: `${newItem} has been added to your list.`,
    });
  };

  const handleDeleteItem = (id: number) => {
    setGroceries(groceries.filter(item => item.id !== id));
    toast({
      title: "Item Removed",
      description: "The item has been removed from your list.",
    });
  };

  const handleClearChecked = () => {
    setGroceries(groceries.filter(item => !item.checked));
    toast({
      title: "Items Cleared",
      description: "All checked items have been removed.",
    });
  };

  const handleOrderGroceries = () => {
    toast({
      title: "Order Placed",
      description: "Your groceries will be delivered within 30 minutes.",
    });
  };

  const handleUseAlternative = (id: number, alternative: string, savings: number) => {
    setGroceries(groceries.map(item => 
      item.id === id ? { ...item, name: alternative, price: item.price - savings } : item
    ));
    
    toast({
      title: "Alternative Applied",
      description: `Replaced with ${alternative} and saved ₹${savings}.`,
    });
  };

  const totalPrice = groceries.reduce((sum, item) => sum + item.price, 0);
  const checkedItemsCount = groceries.filter(item => item.checked).length;

  // Group by category
  const categories: Record<string, GroceryItem[]> = {};
  groceries.forEach(item => {
    if (!categories[item.category]) {
      categories[item.category] = [];
    }
    categories[item.category].push(item);
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">
              Smart Grocery List
            </h1>
            <p className="mt-2 text-gray-600">
              AI-generated list based on your meal plan with cost optimization
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Your Grocery List</span>
                    <span className="text-sm font-normal text-muted-foreground">Total: ₹{totalPrice}</span>
                  </CardTitle>
                  <CardDescription>
                    Items required for your personalized meal plan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="all">
                    <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
                      <TabsTrigger value="all">All Items</TabsTrigger>
                      <TabsTrigger value="by-category">By Category</TabsTrigger>
                      <TabsTrigger value="checked">Checked ({checkedItemsCount})</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="all">
                      <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-2"
                      >
                        {groceries.map(item => (
                          <motion.div key={item.id} variants={itemVariants}>
                            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <Checkbox 
                                  id={`item-${item.id}`} 
                                  checked={item.checked}
                                  onCheckedChange={() => handleCheck(item.id)}
                                />
                                <div className={item.checked ? "line-through text-muted-foreground" : ""}>
                                  <p className="font-medium">{item.name}</p>
                                  <p className="text-xs text-muted-foreground">{item.amount}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-4">
                                <p className="font-medium">₹{item.price}</p>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleDeleteItem(item.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    </TabsContent>
                    
                    <TabsContent value="by-category">
                      <div className="space-y-6">
                        {Object.entries(categories).map(([category, items]) => (
                          <div key={category}>
                            <h3 className="text-lg font-medium capitalize mb-2">
                              {category}
                            </h3>
                            <div className="space-y-2">
                              {items.map(item => (
                                <div key={item.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                  <div className="flex items-center space-x-3">
                                    <Checkbox 
                                      id={`item-${item.id}`} 
                                      checked={item.checked}
                                      onCheckedChange={() => handleCheck(item.id)}
                                    />
                                    <div className={item.checked ? "line-through text-muted-foreground" : ""}>
                                      <p className="font-medium">{item.name}</p>
                                      <p className="text-xs text-muted-foreground">{item.amount}</p>
                                    </div>
                                  </div>
                                  <p className="font-medium">₹{item.price}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="checked">
                      {checkedItemsCount > 0 ? (
                        <div className="space-y-2">
                          {groceries.filter(item => item.checked).map(item => (
                            <div key={item.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <Checkbox 
                                  id={`item-${item.id}`} 
                                  checked={item.checked}
                                  onCheckedChange={() => handleCheck(item.id)}
                                />
                                <div className="line-through text-muted-foreground">
                                  <p className="font-medium">{item.name}</p>
                                  <p className="text-xs text-muted-foreground">{item.amount}</p>
                                </div>
                              </div>
                              <p className="font-medium">₹{item.price}</p>
                            </div>
                          ))}
                          <Button 
                            variant="outline" 
                            className="w-full mt-4"
                            onClick={handleClearChecked}
                          >
                            Remove Checked Items
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <ShoppingCart className="h-12 w-12 text-muted-foreground/50 mb-4" />
                          <p className="text-muted-foreground">No checked items yet</p>
                          <p className="text-sm text-muted-foreground/70">Check items as you pick them up</p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                  
                  <form onSubmit={handleAddItem} className="mt-6 flex space-x-2">
                    <Input 
                      placeholder="Add a new item..." 
                      value={newItem}
                      onChange={(e) => setNewItem(e.target.value)}
                    />
                    <Button type="submit" disabled={!newItem.trim()}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </form>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export List
                  </Button>
                  <Button onClick={handleOrderGroceries}>
                    <Truck className="h-4 w-4 mr-2" />
                    Order Groceries
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Budget Optimization</CardTitle>
                  <CardDescription>
                    AI-suggested alternatives to save money
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {alternatives.map(alt => (
                      <div key={alt.id} className="bg-muted/30 p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium">{alt.name}</p>
                            <p className="text-xs text-muted-foreground">Current price: ₹{alt.price}</p>
                          </div>
                          <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                            Save ₹{alt.savings}
                          </div>
                        </div>
                        <div className="flex items-center text-sm mb-3">
                          <span>Replace with</span>
                          <ArrowRight className="h-3 w-3 mx-2" />
                          <span className="font-medium">{alt.alternative}</span>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="w-full"
                          onClick={() => handleUseAlternative(alt.id, alt.alternative, alt.savings)}
                        >
                          <RefreshCw className="h-3 w-3 mr-2" />
                          Switch to alternative
                        </Button>
                      </div>
                    ))}
                    
                    <div className="mt-6 p-4 border border-primary/20 rounded-lg bg-primary/5">
                      <p className="font-medium mb-1">Total Potential Savings</p>
                      <p className="text-2xl font-bold text-green-600">₹160</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Using all suggested alternatives
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Nearby Stores</CardTitle>
                  <CardDescription>
                    Places where you can purchase items
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <p className="font-medium">Local Farmer's Market</p>
                      <p className="text-xs text-muted-foreground">1.2 km away</p>
                      <p className="text-xs text-green-600 mt-1">Best prices for fresh produce</p>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <p className="font-medium">Nature's Basket</p>
                      <p className="text-xs text-muted-foreground">2.5 km away</p>
                      <p className="text-xs text-green-600 mt-1">Good for organic products</p>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <p className="font-medium">Citymart Supermarket</p>
                      <p className="text-xs text-muted-foreground">0.8 km away</p>
                      <p className="text-xs text-green-600 mt-1">Convenient one-stop shopping</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <AIAssistant />
      <Footer />
    </div>
  );
};

export default Groceries;
