
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Utensils } from "lucide-react";

export const DietPlan = () => {
  // Mock diet data - in a real app this would come from the AI service
  const dietPlan = {
    dailyCalories: 2200,
    macros: {
      protein: { amount: 165, percentage: 30 },
      carbs: { amount: 220, percentage: 40 },
      fat: { amount: 73, percentage: 30 },
    },
    meals: [
      {
        name: "Café da manhã",
        foods: [
          { name: "Aveia com frutas vermelhas", calories: 320, protein: 12, carbs: 54, fat: 6 },
          { name: "Iogurte grego", calories: 150, protein: 15, carbs: 8, fat: 5 },
          { name: "Amêndoas (30g)", calories: 160, protein: 6, carbs: 6, fat: 14 },
        ]
      },
      {
        name: "Almoço",
        foods: [
          { name: "Peito de frango grelhado", calories: 280, protein: 52, carbs: 0, fat: 6 },
          { name: "Arroz integral (1 xícara)", calories: 220, protein: 5, carbs: 46, fat: 2 },
          { name: "Legumes assados", calories: 120, protein: 4, carbs: 20, fat: 3 },
          { name: "Molho de azeite", calories: 120, protein: 0, carbs: 0, fat: 14 },
        ]
      },
      {
        name: "Lanche",
        foods: [
          { name: "Shake de proteína", calories: 180, protein: 25, carbs: 10, fat: 3 },
          { name: "Maçã", calories: 80, protein: 0, carbs: 21, fat: 0 },
        ]
      },
      {
        name: "Jantar",
        foods: [
          { name: "Filé de salmão", calories: 280, protein: 32, carbs: 0, fat: 16 },
          { name: "Quinoa (3/4 xícara)", calories: 170, protein: 6, carbs: 30, fat: 2 },
          { name: "Brócolis no vapor", calories: 60, protein: 4, carbs: 12, fat: 0 },
          { name: "Abacate (1/2)", calories: 120, protein: 1, carbs: 6, fat: 10 },
        ]
      },
      {
        name: "Lanche da noite",
        foods: [
          { name: "Queijo cottage", calories: 120, protein: 14, carbs: 5, fat: 5 },
          { name: "Biscoitos integrais", calories: 80, protein: 2, carbs: 15, fat: 1 },
        ]
      }
    ]
  };

  // Calculate totals
  const calculateMealTotals = (foods) => {
    return foods.reduce((acc, food) => {
      return {
        calories: acc.calories + food.calories,
        protein: acc.protein + food.protein,
        carbs: acc.carbs + food.carbs,
        fat: acc.fat + food.fat
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  const calculateDayTotals = () => {
    return dietPlan.meals.reduce((acc, meal) => {
      const mealTotals = calculateMealTotals(meal.foods);
      return {
        calories: acc.calories + mealTotals.calories,
        protein: acc.protein + mealTotals.protein,
        carbs: acc.carbs + mealTotals.carbs,
        fat: acc.fat + mealTotals.fat
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };
  
  const dayTotals = calculateDayTotals();

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center mb-4">
            <Utensils className="h-5 w-5 mr-2 text-app-green" />
            <h3 className="text-lg font-medium">Plano Nutricional Diário</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="font-medium mb-2">Metas Diárias</h4>
              <p className="text-sm text-muted-foreground mb-1">Calorias: <span className="text-app-text">{dietPlan.dailyCalories} kcal</span></p>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <p className="text-xs text-muted-foreground">Proteinas</p>
                  <p className="text-sm">{dietPlan.macros.protein.amount}g ({dietPlan.macros.protein.percentage}%)</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Carboidratos</p>
                  <p className="text-sm">{dietPlan.macros.carbs.amount}g ({dietPlan.macros.carbs.percentage}%)</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Gorduras</p>
                  <p className="text-sm">{dietPlan.macros.fat.amount}g ({dietPlan.macros.fat.percentage}%)</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="font-medium mb-2">Progresso Diário</h4>
              <p className="text-sm text-muted-foreground mb-1">
                Calories: <span className="text-app-text">{dayTotals.calories} / {dietPlan.dailyCalories} kcal</span>
              </p>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <p className="text-xs text-muted-foreground">Proteinas</p>
                  <p className="text-sm">{dayTotals.protein}g</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Carboidratos</p>
                  <p className="text-sm">{dayTotals.carbs}g</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Gorduras</p>
                  <p className="text-sm">{dayTotals.fat}g</p>
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue={dietPlan.meals[0].name}>
            <TabsList className="w-full flex overflow-x-auto max-w-full">
              {dietPlan.meals.map((meal) => (
                <TabsTrigger
                  key={meal.name}
                  value={meal.name}
                  className="flex-shrink-0 data-[state=active]:diet-highlight"
                >
                  {meal.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {dietPlan.meals.map((meal) => {
              const mealTotals = calculateMealTotals(meal.foods);
              
              return (
                <TabsContent key={meal.name} value={meal.name} className="mt-4">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left border-b border-border">
                          <th className="pb-2 pr-4">Comida</th>
                          <th className="pb-2 text-right">Calorias</th>
                          <th className="pb-2 text-right">Proteinas</th>
                          <th className="pb-2 text-right">Carboidratos</th>
                          <th className="pb-2 text-right">Gorduras</th>
                        </tr>
                      </thead>
                      <tbody>
                        {meal.foods.map((food, idx) => (
                          <tr key={idx} className="border-b border-border/50 hover:bg-muted/50">
                            <td className="py-3 pr-4">{food.name}</td>
                            <td className="py-3 text-right">{food.calories} kcal</td>
                            <td className="py-3 text-right">{food.protein}g</td>
                            <td className="py-3 text-right">{food.carbs}g</td>
                            <td className="py-3 text-right">{food.fat}g</td>
                          </tr>
                        ))}
                        <tr className="bg-muted/30 font-medium">
                          <td className="py-2 pr-4">Total</td>
                          <td className="py-2 text-right">{mealTotals.calories} kcal</td>
                          <td className="py-2 text-right">{mealTotals.protein}g</td>
                          <td className="py-2 text-right">{mealTotals.carbs}g</td>
                          <td className="py-2 text-right">{mealTotals.fat}g</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4 p-3 bg-muted/50 rounded-md">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Observações:</span> Ajuste o tamanho das porções com base nos níveis de fome. 
                      Mantenha-se hidratado bebendo água ao longo do dia.
                    </p>
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
