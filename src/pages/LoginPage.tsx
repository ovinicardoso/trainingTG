
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dumbbell } from "lucide-react";
import { useTranslation } from "react-i18next";

const LoginPage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<string>("login");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();
  const { login, register } = useAuth();

  // Registration form fields
  const [name, setName] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<string>("male");
  const [fitnessGoal, setFitnessGoal] = useState<string>("lose");
  const [workoutFrequency, setWorkoutFrequency] = useState<string>("3");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate("/dashboard");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !weight || !height || !age || !gender || !fitnessGoal || !workoutFrequency) {
      return;
    }

    const userData = {
      email,
      password,
      name,
      weight: parseFloat(weight),
      height: parseFloat(height),
      age: parseInt(age),
      gender: gender as 'male' | 'female' | 'other',
      fitnessGoal: fitnessGoal as 'lose' | 'maintain' | 'gain',
      workoutFrequency: parseInt(workoutFrequency),
    };

    const success = await register(userData);
    if (success) {
      navigate("/dashboard");
    }
  };

  // Helper function to restrict input to numbers only
  const onlyNumbers = (value: string, allowDecimal: boolean = false) => {
    if (allowDecimal) {
      return value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
    }
    return value.replace(/[^0-9]/g, '');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-3">
            <Dumbbell className="h-12 w-12 text-app-red" />
          </div>
          <h1 className="text-3xl font-heading font-bold">{t('app.name')}</h1>
          <p className="mt-2 text-muted-foreground">{t('app.tagline')}</p>
        </div>

        <Card className="border border-border bg-card shadow-lg animate-slide-in">
          <CardHeader>
            <Tabs defaultValue="login" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">{t('auth.login')}</TabsTrigger>
                <TabsTrigger value="register">{t('auth.register')}</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>

          <CardContent>
            {activeTab === "login" ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t('auth.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    className="input-field"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">{t('auth.password')}</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="********"
                    className="input-field"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full workout-highlight">{t('auth.login')}</Button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('auth.name')}</Label>
                    <Input
                      id="name"
                      placeholder="Seu Nome"
                      className="input-field"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('auth.email')}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      className="input-field"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">{t('auth.password')}</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="********"
                      className="input-field"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="weight">{t('auth.weight')}</Label>
                      <Input
                        id="weight"
                        placeholder="70"
                        className="input-field"
                        value={weight}
                        onChange={(e) => setWeight(onlyNumbers(e.target.value, true))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="height">{t('auth.height')}</Label>
                      <Input
                        id="height"
                        placeholder="175"
                        className="input-field"
                        value={height}
                        onChange={(e) => setHeight(onlyNumbers(e.target.value))}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="age">{t('auth.age')}</Label>
                      <Input
                        id="age"
                        placeholder="30"
                        className="input-field"
                        value={age}
                        onChange={(e) => setAge(onlyNumbers(e.target.value))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">{t('auth.gender.label')}</Label>
                      <Select value={gender} onValueChange={setGender}>
                        <SelectTrigger id="gender" className="input-field">
                          <SelectValue placeholder={t('auth.gender.label')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">{t('auth.gender.male')}</SelectItem>
                          <SelectItem value="female">{t('auth.gender.female')}</SelectItem>
                          <SelectItem value="other">{t('auth.gender.other')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fitnessGoal">{t('auth.fitnessGoal.label')}</Label>
                    <Select value={fitnessGoal} onValueChange={setFitnessGoal}>
                      <SelectTrigger id="fitnessGoal" className="input-field">
                        <SelectValue placeholder={t('auth.fitnessGoal.label')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lose">{t('auth.fitnessGoal.lose')}</SelectItem>
                        <SelectItem value="maintain">{t('auth.fitnessGoal.maintain')}</SelectItem>
                        <SelectItem value="gain">{t('auth.fitnessGoal.gain')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="workoutFrequency">{t('auth.workoutFrequency.label')}</Label>
                    <Select value={workoutFrequency} onValueChange={setWorkoutFrequency}>
                      <SelectTrigger id="workoutFrequency" className="input-field">
                        <SelectValue placeholder={t('auth.workoutFrequency.label')} />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7].map(num => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num === 1 ? t('auth.workoutFrequency.day') : t('auth.workoutFrequency.days')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Button type="submit" className="w-full workout-highlight">{t('auth.register')}</Button>
              </form>
            )}
          </CardContent>
        </Card>
        
        <p className="text-center text-sm text-muted-foreground">
          {t('auth.disclaimer')}
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
