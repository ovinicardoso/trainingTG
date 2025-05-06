
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dumbbell } from "lucide-react";

export const WorkoutPlan = () => {
  // Mock workout data - in a real app this would come from the AI service
  const workoutPlan = {
    days: [
      {
        day: "Segunda-feira",
        focus: "Peito & Tríceps",
        exercises: [
          { name: "Supino Reto", sets: 4, reps: "8-10", rest: "90 seg", weight: "70%" },
          { name: "Supino Inclinado com Halteres", sets: 3, reps: "10-12", rest: "60 seg", weight: "65%" },
          { name: "Crucifixo", sets: 3, reps: "12-15", rest: "60 seg", weight: "60%" },
          { name: "Tríceps Pulley", sets: 4, reps: "10-12", rest: "60 seg", weight: "65%" },
          { name: "Francês", sets: 3, reps: "10-12", rest: "60 seg", weight: "65%" },
        ]
      },
      {
        day: "Terça-feira",
        focus: "Costas & Bíceps",
        exercises: [
          { name: "Barra Fixa", sets: 4, reps: "8-10", rest: "90 seg", weight: "Peso Corporal" },
          { name: "Remada Curvada", sets: 4, reps: "8-10", rest: "90 seg", weight: "70%" },
          { name: "Pulldown", sets: 3, reps: "10-12", rest: "60 seg", weight: "65%" },
          { name: "Rosca Direta", sets: 3, reps: "10-12", rest: "60 seg", weight: "65%" },
          { name: "Rosca Martelo", sets: 3, reps: "10-12", rest: "60 seg", weight: "60%" },
        ]
      },
      {
        day: "Quarta-feira",
        focus: "Dia de Descanso",
        exercises: [
          { name: "Alongamento Leve", sets: 1, reps: "10 min", rest: "Nenhum", weight: "Nenhum" },
          { name: "Rolo de Espuma", sets: 1, reps: "10 min", rest: "Nenhum", weight: "Nenhum" },
        ]
      },
      {
        day: "Quinta-feira",
        focus: "Ombros & Abdômen",
        exercises: [
          { name: "Desenvolvimento Militar", sets: 4, reps: "8-10", rest: "90 seg", weight: "70%" },
          { name: "Elevação Lateral", sets: 3, reps: "12-15", rest: "60 seg", weight: "60%" },
          { name: "Face Pull", sets: 3, reps: "12-15", rest: "60 seg", weight: "60%" },
          { name: "Prancha", sets: 3, reps: "60 seg", rest: "60 seg", weight: "Peso Corporal" },
          { name: "Torção Russa", sets: 3, reps: "20 reps", rest: "60 seg", weight: "Peso Corporal" },
        ]
      },
      {
        day: "Sexta-feira",
        focus: "Pernas",
        exercises: [
          { name: "Agachamento Livre", sets: 4, reps: "8-10", rest: "120 seg", weight: "75%" },
          { name: "Stiff", sets: 4, reps: "8-10", rest: "120 seg", weight: "75%" },
          { name: "Leg Press", sets: 3, reps: "10-12", rest: "90 seg", weight: "70%" },
          { name: "Cadeira Extensora", sets: 3, reps: "12-15", rest: "60 seg", weight: "65%" },
          { name: "Panturrilha em Pé", sets: 4, reps: "15-20", rest: "60 seg", weight: "65%" },
        ]
      },
      {
        day: "Sábado",
        focus: "Corpo Inteiro",
        exercises: [
          { name: "Levantamento Terra", sets: 4, reps: "6-8", rest: "120 seg", weight: "80%" },
          { name: "Barra Fixa", sets: 3, reps: "8-10", rest: "90 seg", weight: "Peso Corporal" },
          { name: "Mergulho", sets: 3, reps: "8-10", rest: "90 seg", weight: "Peso Corporal" },
          { name: "Afundo", sets: 3, reps: "10-12", rest: "60 seg", weight: "65%" },
          { name: "Escalador", sets: 3, reps: "30 seg", rest: "30 seg", weight: "Peso Corporal" },
        ]
      },
      {
        day: "Domingo",
        focus: "Dia de Descanso",
        exercises: [
          { name: "Caminhada Leve", sets: 1, reps: "30 min", rest: "Nenhum", weight: "Nenhum" },
          { name: "Alongamento", sets: 1, reps: "15 min", rest: "Nenhum", weight: "Nenhum" },
        ]
      }
    ]
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="Monday">
        <TabsList className="w-full flex overflow-auto max-w-full">
          {workoutPlan.days.map((day) => (
            <TabsTrigger 
              key={day.day} 
              value={day.day}
              className="flex-shrink-0 data-[state=active]:workout-highlight"
            >
              {day.day}
            </TabsTrigger>
          ))}
        </TabsList>

        {workoutPlan.days.map((day) => (
          <TabsContent key={day.day} value={day.day} className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <Dumbbell className="h-5 w-5 mr-2 text-app-red" />
                  <h3 className="text-lg font-medium">{day.focus}</h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b border-border">
                        <th className="pb-2">Exercício</th>
                        <th className="pb-2 text-center">Séries</th>
                        <th className="pb-2 text-center">Repetições</th>
                        <th className="pb-2 text-center">Descanso</th>
                        <th className="pb-2 text-center">Peso</th>
                      </tr>
                    </thead>
                    <tbody>
                      {day.exercises.map((exercise, idx) => (
                        <tr key={idx} className="border-b border-border/50 hover:bg-muted/50">
                          <td className="py-3">{exercise.name}</td>
                          <td className="py-3 text-center">{exercise.sets}</td>
                          <td className="py-3 text-center">{exercise.reps}</td>
                          <td className="py-3 text-center">{exercise.rest}</td>
                          <td className="py-3 text-center">{exercise.weight}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 p-3 bg-muted/50 rounded-md">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Obsesrvações:</span> Aqueça-se adequadamente antes de começar. 
                    Ajuste os pesos conforme necessário. Foque na execução em vez de pesos pesados.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
