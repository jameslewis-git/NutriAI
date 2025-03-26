
import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AIAssistant from '@/components/AIAssistant';

const Dashboard = () => {
  // Sample data for demonstration
  const spendingData = [
    { name: 'Week 1', amount: 1200 },
    { name: 'Week 2', amount: 980 },
    { name: 'Week 3', amount: 1100 },
    { name: 'Week 4', amount: 850 },
  ];
  
  const nutritionData = [
    { name: 'Mon', protein: 80, carbs: 120, fat: 35 },
    { name: 'Tue', protein: 75, carbs: 115, fat: 40 },
    { name: 'Wed', protein: 90, carbs: 105, fat: 30 },
    { name: 'Thu', protein: 85, carbs: 110, fat: 35 },
    { name: 'Fri', protein: 70, carbs: 125, fat: 45 },
    { name: 'Sat', protein: 65, carbs: 130, fat: 50 },
    { name: 'Sun', protein: 75, carbs: 120, fat: 40 },
  ];
  
  const categoryData = [
    { name: 'Proteins', value: 35, color: '#8b5cf6' },
    { name: 'Vegetables', value: 25, color: '#10b981' },
    { name: 'Fruits', value: 15, color: '#f97316' },
    { name: 'Grains', value: 15, color: '#f59e0b' },
    { name: 'Dairy', value: 10, color: '#3b82f6' },
  ];
  
  const savingsData = [
    { name: 'Regular', value: 2500, color: '#ef4444' },
    { name: 'With AI', value: 1850, color: '#10b981' },
  ];
  
  const savingsAmount = savingsData[0].value - savingsData[1].value;
  const savingsPercentage = ((savingsAmount / savingsData[0].value) * 100).toFixed(1);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">
              Your Nutrition Dashboard
            </h1>
            <p className="mt-2 text-gray-600">
              Track your nutrition, spending, and progress all in one place
            </p>
          </div>
          
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid grid-cols-3 w-full max-w-md">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
              <TabsTrigger value="spending">Spending</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <motion.div variants={itemVariants}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Monthly Savings</CardTitle>
                      <CardDescription>
                        Compare your spending with and without AI optimization
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-center">
                        <div className="text-center mr-8">
                          <p className="text-5xl font-bold text-green-500">₹{savingsAmount}</p>
                          <p className="text-sm text-muted-foreground mt-1">Total Savings</p>
                        </div>
                        <div className="h-44">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={savingsData} layout="vertical">
                              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                              <XAxis type="number" />
                              <YAxis dataKey="name" type="category" />
                              <Tooltip />
                              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                {savingsData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      <p className="text-center mt-2 text-sm text-muted-foreground">
                        You're saving <span className="font-medium text-green-500">{savingsPercentage}%</span> on your monthly grocery bill
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Spending by Category</CardTitle>
                      <CardDescription>
                        See where your food budget is going
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={categoryData}
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {categoryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`₹${value}`, 'Amount']} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div variants={itemVariants} className="md:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Weekly Nutrition Tracker</CardTitle>
                      <CardDescription>
                        Monitor your macronutrients throughout the week
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={nutritionData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="protein" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
                            <Line type="monotone" dataKey="carbs" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                            <Line type="monotone" dataKey="fat" stroke="#ec4899" strokeWidth={2} dot={{ r: 4 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="nutrition">
              <div className="grid grid-cols-1 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Detailed Nutritional Analysis</CardTitle>
                    <CardDescription>
                      Your personalized nutrition metrics and recommendations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-6">
                      This section will contain detailed nutritional insights and AI-powered recommendations based on your eating habits.
                    </p>
                    <div className="h-[400px] flex items-center justify-center border-2 border-dashed rounded-lg">
                      <p className="text-muted-foreground text-center">
                        Nutritional analysis features coming soon
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="spending">
              <div className="grid grid-cols-1 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Spending Breakdown</CardTitle>
                    <CardDescription>
                      Track your food expenses over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={spendingData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`₹${value}`, 'Amount']} />
                          <Bar dataKey="amount" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <AIAssistant />
      <Footer />
    </div>
  );
};

export default Dashboard;
