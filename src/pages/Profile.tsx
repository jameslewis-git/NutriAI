import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { toast } from '../components/ui/use-toast';
import {
  User,
  Settings,
  Bell,
  CreditCard,
  Heart,
  Apple,
  Scale,
  Activity,
  Clock,
  Coffee,
  Utensils,
  Edit2,
  Save,
  ChevronRight
} from 'lucide-react';

interface DietaryPreference {
  id: string;
  name: string;
  selected: boolean;
}

interface HealthMetric {
  date: string;
  weight: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    age: user?.age || '',
    height: user?.height || '',
    weight: user?.weight || '',
    weeklyBudget: user?.weeklyBudget || '',
    activityLevel: user?.activityLevel || 'moderate',
    mealsPerDay: user?.mealsPerDay || 3,
    dietaryPreferences: [
      { id: 'vegetarian', name: 'Vegetarian', selected: false },
      { id: 'vegan', name: 'Vegan', selected: false },
      { id: 'glutenFree', name: 'Gluten Free', selected: false },
      { id: 'dairyFree', name: 'Dairy Free', selected: false },
      { id: 'nutFree', name: 'Nut Free', selected: false },
    ],
    healthMetrics: [] as HealthMetric[],
    allergies: user?.allergies || [],
    favoriteIngredients: user?.favoriteIngredients || [],
    dislikedIngredients: user?.dislikedIngredients || [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUser(formData);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-background to-background/50 py-12 px-4 dark:from-gray-900 dark:to-gray-800"
    >
      <div className="max-w-5xl mx-auto">
        {/* Profile Header */}
        <motion.div 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="bg-card rounded-2xl shadow-md p-8 mb-8 relative overflow-hidden dark:bg-gray-800/30 dark:border dark:border-gray-700/50"
        >
          {/* Background Pattern */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/5 to-violet-500/5 rounded-full blur-3xl dark:from-primary/5 dark:to-violet-500/5" />
          
          <div className="relative flex items-center gap-8">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="w-24 h-24 rounded-full bg-gradient-to-r from-primary to-violet-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg"
            >
              {user?.name?.charAt(0)}
            </motion.div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground dark:text-gray-100">{user?.name}</h1>
                  <p className="text-muted-foreground dark:text-gray-400">{user?.email}</p>
                </div>
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant={isEditing ? "destructive" : "outline"}
                  className="flex items-center gap-2 dark:border-gray-600/50 dark:text-gray-300"
                >
                  {isEditing ? (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Edit2 className="w-4 h-4" />
                      Edit Profile
                    </>
                  )}
                </Button>
              </div>
              
              {/* Quick Stats */}
              <div className="flex gap-6 mt-6">
                <div className="flex items-center gap-2 text-muted-foreground dark:text-gray-400">
                  <Coffee className="w-4 h-4" />
                  <span>{formData.mealsPerDay} meals/day</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground dark:text-gray-400">
                  <Activity className="w-4 h-4" />
                  <span>{formData.activityLevel} activity</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground dark:text-gray-400">
                  <CreditCard className="w-4 h-4" />
                  <span>₹{formData.weeklyBudget}/week</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs Navigation */}
        <Tabs 
          defaultValue="personal" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-8"
        >
          <TabsList className="grid grid-cols-4 gap-4 bg-card p-2 rounded-xl shadow-md dark:bg-gray-800/30 dark:border dark:border-gray-700/50">
            {[
              { id: 'personal', label: 'Personal', icon: User },
              { id: 'nutrition', label: 'Nutrition', icon: Apple },
              { id: 'metrics', label: 'Metrics', icon: Activity },
              { id: 'preferences', label: 'Preferences', icon: Heart }
            ].map((tab) => (
              <motion.div
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <TabsTrigger
                  value={tab.id}
                  className={`w-full py-3 flex items-center justify-center gap-2 dark:text-gray-300 dark:hover:bg-gray-700/30 ${
                    activeTab === tab.id ? 'bg-primary/90 text-white dark:bg-primary/80 dark:text-white' : 'hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </TabsTrigger>
              </motion.div>
            ))}
          </TabsList>

          {/* Tab Contents */}
          <motion.div
            layout
            className="bg-card rounded-2xl shadow-xl p-8 dark:bg-gray-800/50 dark:border dark:border-gray-700"
          >
            <TabsContent value="personal" className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid md:grid-cols-2 gap-8"
              >
                <div className="space-y-4">
                  <Label className="text-foreground dark:text-gray-300">Personal Information</Label>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-foreground dark:text-gray-300">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="border-gray-200 focus:ring-primary dark:bg-gray-800/50 dark:border-gray-600/50 dark:text-gray-200"
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-foreground dark:text-gray-300">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        className="border-gray-200 focus:ring-primary dark:bg-gray-800/50 dark:border-gray-600/50 dark:text-gray-200"
                        disabled
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-foreground dark:text-gray-300">Account Settings</Label>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="age" className="text-foreground dark:text-gray-300">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        value={formData.age}
                        onChange={(e) => setFormData({...formData, age: e.target.value})}
                        className="border-gray-200 focus:ring-primary dark:bg-gray-800/50 dark:border-gray-600/50 dark:text-gray-200"
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weeklyBudget" className="text-foreground dark:text-gray-300">Weekly Budget (₹)</Label>
                      <Input
                        id="weeklyBudget"
                        type="number"
                        value={formData.weeklyBudget}
                        onChange={(e) => setFormData({...formData, weeklyBudget: e.target.value})}
                        className="border-gray-200 focus:ring-primary dark:bg-gray-800/50 dark:border-gray-600/50 dark:text-gray-200"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="nutrition" className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid md:grid-cols-2 gap-8"
              >
                {/* Nutrition Content */}
                <div className="space-y-4">
                  <Label className="text-foreground dark:text-gray-300">Body Metrics</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="height" className="text-foreground dark:text-gray-300">Height (cm)</Label>
                      <Input
                        id="height"
                        type="number"
                        value={formData.height}
                        onChange={(e) => setFormData({...formData, height: e.target.value})}
                        className="border-gray-200 focus:ring-primary dark:bg-gray-800/50 dark:border-gray-600/50 dark:text-gray-200"
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight" className="text-foreground dark:text-gray-300">Weight (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        value={formData.weight}
                        onChange={(e) => setFormData({...formData, weight: e.target.value})}
                        className="border-gray-200 focus:ring-primary dark:bg-gray-800/50 dark:border-gray-600/50 dark:text-gray-200"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-foreground dark:text-gray-300">Activity Level</Label>
                  <select
                    className="w-full p-2 border rounded-lg border-gray-200 focus:ring-primary dark:bg-gray-800/50 dark:border-gray-600/50 dark:text-gray-200"
                    value={formData.activityLevel}
                    onChange={(e) => setFormData({...formData, activityLevel: e.target.value})}
                    disabled={!isEditing}
                  >
                    <option value="sedentary">Sedentary</option>
                    <option value="light">Light Active</option>
                    <option value="moderate">Moderate Active</option>
                    <option value="very">Very Active</option>
                    <option value="extra">Extra Active</option>
                  </select>
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="metrics" className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="bg-gray-50 dark:bg-gray-800/30 p-4 rounded-lg">
                  <h3 className="font-semibold mb-4 text-foreground dark:text-white">Health Metrics History</h3>
                  <div className="space-y-4">
                    {formData.healthMetrics.map((metric, index) => (
                      <div key={index} className="bg-white dark:bg-gray-700/30 p-4 rounded-md shadow-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500 dark:text-gray-400">{metric.date}</span>
                          <span className="font-medium text-foreground dark:text-white">{metric.weight} kg</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mt-2">
                          <div className="text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Calories:</span>
                            <span className="ml-2 text-foreground dark:text-white">{metric.calories}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Protein:</span>
                            <span className="ml-2 text-foreground dark:text-white">{metric.protein}g</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Carbs:</span>
                            <span className="ml-2 text-foreground dark:text-white">{metric.carbs}g</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-4">
                  <Label className="text-foreground dark:text-gray-300">Dietary Preferences</Label>
                  <div className="flex flex-wrap gap-2">
                    {formData.dietaryPreferences.map((pref) => (
                      <Button
                        key={pref.id}
                        type="button"
                        variant={pref.selected ? "default" : "outline"}
                        onClick={() => {
                          if (isEditing) {
                            const updated = formData.dietaryPreferences.map(p =>
                              p.id === pref.id ? {...p, selected: !p.selected} : p
                            );
                            setFormData({...formData, dietaryPreferences: updated});
                          }
                        }}
                        disabled={!isEditing}
                        className="dark:border-gray-600/50 dark:text-gray-300"
                      >
                        {pref.name}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="allergies" className="text-foreground dark:text-gray-300">Allergies</Label>
                  <Input
                    id="allergies"
                    placeholder="Enter allergies separated by commas"
                    value={formData.allergies.join(', ')}
                    onChange={(e) => setFormData({...formData, allergies: e.target.value.split(',')})}
                    disabled={!isEditing}
                    className="border-gray-200 focus:ring-primary dark:bg-gray-800/50 dark:border-gray-600/50 dark:text-gray-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="favoriteIngredients" className="text-foreground dark:text-gray-300">Favorite Ingredients</Label>
                  <Input
                    id="favoriteIngredients"
                    placeholder="Enter favorite ingredients separated by commas"
                    value={formData.favoriteIngredients.join(', ')}
                    onChange={(e) => setFormData({...formData, favoriteIngredients: e.target.value.split(',')})}
                    disabled={!isEditing}
                    className="border-gray-200 focus:ring-primary dark:bg-gray-800/50 dark:border-gray-600/50 dark:text-gray-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dislikedIngredients" className="text-foreground dark:text-gray-300">Disliked Ingredients</Label>
                  <Input
                    id="dislikedIngredients"
                    placeholder="Enter disliked ingredients separated by commas"
                    value={formData.dislikedIngredients.join(', ')}
                    onChange={(e) => setFormData({...formData, dislikedIngredients: e.target.value.split(',')})}
                    disabled={!isEditing}
                    className="border-gray-200 focus:ring-primary dark:bg-gray-800/50 dark:border-gray-600/50 dark:text-gray-200"
                  />
                </div>
              </div>
            </TabsContent>
          </motion.div>
        </Tabs>

        {/* Action Buttons */}
        {isEditing && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-end gap-4 mt-6"
          >
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
              className="px-6 dark:border-gray-600/50 dark:text-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-primary/90 text-white hover:bg-primary/80 px-6"
            >
              Save Changes
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Profile; 