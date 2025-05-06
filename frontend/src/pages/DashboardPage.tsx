import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { Dumbbell, Utensils, Loader2, LogOut } from "lucide-react";
import { WorkoutPlan } from "@/components/WorkoutPlan";
import { DietPlan } from "@/components/DietPlan";

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("workouts");
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGeneratedPlan, setHasGeneratedPlan] = useState(false);

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    
    // Simulate API call to AI service
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      setHasGeneratedPlan(true);
      toast({
        title: "Plano gerado!",
        description: `Seu plano de ${activeTab === "workouts" ? "workout" : "diet"} personalizado está pronto.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Falha na geração",
        description: "Não foi possível gerar o plano. Tente novamente..",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Calculate BMI
  const bmi = user ? (user.weight / Math.pow(user.height / 100, 2)).toFixed(1) : "0";
  const weightCategory = () => {
    const bmiValue = parseFloat(bmi);
    if (bmiValue < 18.5) return "Abaixo do peso";
    if (bmiValue < 25) return "Normal";
    if (bmiValue < 30) return "Acima do peso";
    return "Obeso(a)";
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-app-bg text-app-text">
      <header className="bg-app-black p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Dumbbell className="h-6 w-6 text-app-red" />
            <h1 className="text-xl font-heading font-bold">Training</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
                <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="font-medium hidden sm:inline">{user.name}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={logout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card className="border border-border">
              <CardHeader>
                <CardTitle>Bem-vindo de volta, {user.name}!</CardTitle>
                <CardDescription>
                  Aqui está seu painel fitness personalizado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-2 w-full">
                    <TabsTrigger value="workouts" className="data-[state=active]:workout-highlight">
                      <Dumbbell className="h-4 w-4 mr-2" />
                      Meus treinos
                    </TabsTrigger>
                    <TabsTrigger value="diet" className="data-[state=active]:diet-highlight">
                      <Utensils className="h-4 w-4 mr-2" />
                      Minha dieta
                    </TabsTrigger>
                  </TabsList>
                  <div className="mt-6">
                    <Button 
                      onClick={handleGeneratePlan} 
                      disabled={isGenerating}
                      className={`w-full ${activeTab === "workouts" ? "workout-highlight" : "diet-highlight"}`}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Gerando seu plano...
                        </>
                      ) : (
                        <>Gerar Plano de {activeTab === "workouts" ? "Treino" : "Dieta"}</>
                      )}
                    </Button>
                  </div>
                  <TabsContent value="workouts" className="pt-6">
                    {hasGeneratedPlan ? (
                      <WorkoutPlan />
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <Dumbbell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Seu plano de treino personalizado aparecerá aqui.</p>
                        <p>Clique em "Gerar plano de treino" para começar.</p>
                      </div>
                    )}
                  </TabsContent>
                  <TabsContent value="diet" className="pt-6">
                    {hasGeneratedPlan ? (
                      <DietPlan />
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <Utensils className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Seu plano de dieta personalizado aparecerá aqui.</p>
                        <p>Clique em "Gerar plano de dieta" para começar.</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border border-border card-hover">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Resumo do perfil</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Altura</p>
                    <p className="font-medium">{user.height} cm</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Peso</p>
                    <p className="font-medium">{user.weight} kg</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">IMC</p>
                    <p className="font-medium">{bmi} ({weightCategory()})</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Meta</p>
                    <p className="font-medium capitalize">{user.fitnessGoal} Peso</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Frequência de treino</p>
                    <p className="font-medium">{user.workoutFrequency} dias por semana</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border card-hover">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Progresso Atual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <p className="text-sm text-muted-foreground">Treinos semanais</p>
                      <p className="text-sm font-medium">2/{user.workoutFrequency}</p>
                    </div>
                    <Progress value={33} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <p className="text-sm text-muted-foreground">Meta de calorias</p>
                      <p className="text-sm font-medium">1200/2000</p>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <p className="text-sm text-muted-foreground">Gordura Corporal %</p>
                      <p className="text-sm font-medium">18%</p>
                    </div>
                    <Progress value={18} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="p-4 bg-muted rounded-lg">
              <p className="text-xs text-center text-muted-foreground">
              Recomendações geradas por IA não substituem profissionais qualificados.
              Sempre consulte um profissional de saúde antes de iniciar qualquer novo programa de condicionamento físico ou dieta.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
