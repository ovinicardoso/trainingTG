
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dumbbell } from "lucide-react";

export const WorkoutPlan = () => {
  // Mock workout data - in a real app this would come from the AI service
  const workoutPlan = {
    days: [
      {
        day: "Monday",
        focus: "Chest & Triceps",
        exercises: [
          { name: "Bench Press", sets: 4, reps: "8-10", rest: "90 sec", weight: "70%" },
          { name: "Incline Dumbbell Press", sets: 3, reps: "10-12", rest: "60 sec", weight: "65%" },
          { name: "Chest Flyes", sets: 3, reps: "12-15", rest: "60 sec", weight: "60%" },
          { name: "Tricep Pushdowns", sets: 4, reps: "10-12", rest: "60 sec", weight: "65%" },
          { name: "Skull Crushers", sets: 3, reps: "10-12", rest: "60 sec", weight: "65%" },
        ]
      },
      {
        day: "Tuesday",
        focus: "Back & Biceps",
        exercises: [
          { name: "Pull-ups", sets: 4, reps: "8-10", rest: "90 sec", weight: "Body" },
          { name: "Bent-over Rows", sets: 4, reps: "8-10", rest: "90 sec", weight: "70%" },
          { name: "Lat Pulldowns", sets: 3, reps: "10-12", rest: "60 sec", weight: "65%" },
          { name: "Barbell Curls", sets: 3, reps: "10-12", rest: "60 sec", weight: "65%" },
          { name: "Hammer Curls", sets: 3, reps: "10-12", rest: "60 sec", weight: "60%" },
        ]
      },
      {
        day: "Wednesday",
        focus: "Rest Day",
        exercises: [
          { name: "Light Stretching", sets: 1, reps: "10 min", rest: "None", weight: "None" },
          { name: "Foam Rolling", sets: 1, reps: "10 min", rest: "None", weight: "None" },
        ]
      },
      {
        day: "Thursday",
        focus: "Shoulders & Abs",
        exercises: [
          { name: "Overhead Press", sets: 4, reps: "8-10", rest: "90 sec", weight: "70%" },
          { name: "Lateral Raises", sets: 3, reps: "12-15", rest: "60 sec", weight: "60%" },
          { name: "Face Pulls", sets: 3, reps: "12-15", rest: "60 sec", weight: "60%" },
          { name: "Planks", sets: 3, reps: "60 sec", rest: "60 sec", weight: "Body" },
          { name: "Russian Twists", sets: 3, reps: "20 reps", rest: "60 sec", weight: "Body" },
        ]
      },
      {
        day: "Friday",
        focus: "Legs",
        exercises: [
          { name: "Squats", sets: 4, reps: "8-10", rest: "120 sec", weight: "75%" },
          { name: "Romanian Deadlifts", sets: 4, reps: "8-10", rest: "120 sec", weight: "75%" },
          { name: "Leg Press", sets: 3, reps: "10-12", rest: "90 sec", weight: "70%" },
          { name: "Leg Extensions", sets: 3, reps: "12-15", rest: "60 sec", weight: "65%" },
          { name: "Standing Calf Raises", sets: 4, reps: "15-20", rest: "60 sec", weight: "65%" },
        ]
      },
      {
        day: "Saturday",
        focus: "Full Body",
        exercises: [
          { name: "Deadlifts", sets: 4, reps: "6-8", rest: "120 sec", weight: "80%" },
          { name: "Pull-ups", sets: 3, reps: "8-10", rest: "90 sec", weight: "Body" },
          { name: "Dips", sets: 3, reps: "8-10", rest: "90 sec", weight: "Body" },
          { name: "Lunges", sets: 3, reps: "10-12", rest: "60 sec", weight: "65%" },
          { name: "Mountain Climbers", sets: 3, reps: "30 sec", rest: "30 sec", weight: "Body" },
        ]
      },
      {
        day: "Sunday",
        focus: "Rest Day",
        exercises: [
          { name: "Light Walking", sets: 1, reps: "30 min", rest: "None", weight: "None" },
          { name: "Stretching", sets: 1, reps: "15 min", rest: "None", weight: "None" },
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
                        <th className="pb-2">Exercise</th>
                        <th className="pb-2 text-center">Sets</th>
                        <th className="pb-2 text-center">Reps</th>
                        <th className="pb-2 text-center">Rest</th>
                        <th className="pb-2 text-center">Weight</th>
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
                    <span className="font-medium">Workout Notes:</span> Warm up properly before starting. 
                    Adjust weights as needed. Focus on proper form over heavy weights.
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
