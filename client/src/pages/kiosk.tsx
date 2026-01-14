import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, Shield, ShieldCheck, CheckCircle2, XCircle, Award, Sparkles, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

type Screen = "idle" | "scan" | "welcome" | "quiz" | "result" | "reward" | "end";

interface SessionState {
  token: string | null;
  school: string | null;
  quizAnswer: string | null;
  isCorrect: boolean | null;
}

const schools = [
  "School of ICT",
  "School of Business & Accountancy",
  "School of Design & Environment",
  "School of Engineering",
  "School of Health Sciences",
  "School of Humanities & Social Sciences",
  "School of Life Sciences & Chemical Technology",
];

const quizQuestion = {
  question: "In what year was Ngee Ann Polytechnic established?",
  options: ["1963", "1968", "1982", "1975"],
  correctAnswer: "1963",
  funFactCorrect: "That's right! NP was founded in 1963 as Ngee Ann College, making it one of Singapore's pioneer polytechnics. It was named after philanthropist Ngee Ann Kongsi.",
  funFactIncorrect: "The correct answer is 1963! NP was founded as Ngee Ann College, named after the philanthropist Ngee Ann Kongsi. It later became Ngee Ann Technical College before becoming a polytechnic in 1982.",
};

function generateSessionToken(): string {
  return 'sess_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function PrivacyModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="fixed bottom-4 right-4 text-muted-foreground hover:text-foreground z-50"
          data-testid="button-privacy-info"
        >
          <Info className="w-5 h-5 mr-2" />
          Privacy Info
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-card border-border max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-primary" />
            Your Privacy Matters
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-muted-foreground">
          <p>
            <strong className="text-foreground">We don't collect personal data.</strong> This kiosk uses data minimisation principles:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>No names, student IDs, or identifiable information is stored</li>
            <li>Only your selected school and quiz answers are temporarily held in memory</li>
            <li>A random session token is created for your visit (not linked to your identity)</li>
            <li>All data is automatically cleared when your session ends</li>
            <li>Nothing is saved to any database or sent to any server</li>
          </ul>
          <p className="text-sm border-t border-border pt-4">
            This exhibit follows NP's commitment to responsible data practices.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function IdleScreen({ onTap }: { onTap: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center h-full text-center px-8"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="mb-12"
      >
        <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center animate-pulse-glow">
          <CreditCard className="w-16 h-16 text-primary" />
        </div>
      </motion.div>
      
      <h1 className="font-display text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-cyan-300 to-accent bg-clip-text text-transparent">
        NP Memory Trail
      </h1>
      
      <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-xl">
        Discover the rich history of Ngee Ann Polytechnic
      </p>
      
      <Button
        onClick={onTap}
        className="touch-button bg-gradient-to-r from-primary to-cyan-400 text-primary-foreground font-display text-xl px-12 py-8 rounded-2xl animate-pulse-glow hover:scale-105 transition-transform"
        data-testid="button-tap-card"
      >
        <CreditCard className="w-6 h-6 mr-3" />
        Tap Your NP Card to Begin
      </Button>
      
      <p className="text-sm text-muted-foreground mt-8 flex items-center gap-2">
        <Shield className="w-4 h-4" />
        No personal data will be stored
      </p>
    </motion.div>
  );
}

function ScanScreen() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex flex-col items-center justify-center h-full text-center px-8"
    >
      <div className="relative w-40 h-40 mb-8">
        <div className="absolute inset-0 rounded-2xl border-4 border-primary/50 overflow-hidden">
          <div className="absolute left-0 right-0 h-1 bg-primary animate-scan-line" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <CreditCard className="w-16 h-16 text-primary" />
        </div>
      </div>
      
      <h2 className="font-display text-4xl font-bold mb-4">Reading Card...</h2>
      
      <div className="flex items-center gap-3 text-muted-foreground">
        <ShieldCheck className="w-6 h-6 text-green-400" />
        <span className="text-lg">No personal data stored</span>
      </div>
    </motion.div>
  );
}

function WelcomeScreen({ 
  school, 
  onSchoolChange, 
  onContinue 
}: { 
  school: string | null;
  onSchoolChange: (school: string) => void;
  onContinue: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="flex flex-col items-center justify-center h-full text-center px-8"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
        className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center mb-8"
      >
        <CheckCircle2 className="w-10 h-10 text-white" />
      </motion.div>
      
      <h2 className="font-display text-4xl md:text-5xl font-bold mb-2">
        Welcome!
      </h2>
      
      {school && (
        <p className="text-2xl text-primary mb-8">
          {school}
        </p>
      )}
      
      <div className="glass-card rounded-2xl p-8 max-w-md w-full mb-8">
        <label className="text-left block text-muted-foreground mb-3">
          Select your school to personalize your experience:
        </label>
        <Select value={school || ""} onValueChange={onSchoolChange}>
          <SelectTrigger className="w-full h-14 text-lg" data-testid="select-school">
            <SelectValue placeholder="Choose your school..." />
          </SelectTrigger>
          <SelectContent>
            {schools.map((s) => (
              <SelectItem key={s} value={s} data-testid={`option-school-${s.replace(/\s+/g, '-').toLowerCase()}`}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Button
        onClick={onContinue}
        disabled={!school}
        className="touch-button bg-gradient-to-r from-primary to-cyan-400 text-primary-foreground font-display text-xl px-12 py-6 rounded-xl hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
        data-testid="button-continue-quiz"
      >
        Start the Quiz
      </Button>
    </motion.div>
  );
}

function QuizScreen({ 
  onAnswer 
}: { 
  onAnswer: (answer: string) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="flex flex-col items-center justify-center h-full px-8 py-12"
    >
      <div className="w-full max-w-3xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-muted-foreground">Question 1 of 1</span>
            <span className="text-primary font-medium">NP History</span>
          </div>
          <Progress value={50} className="h-2" />
        </div>
        
        <div className="glass-card rounded-3xl p-10 mb-8">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-8 text-center">
            {quizQuestion.question}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quizQuestion.options.map((option) => (
              <Button
                key={option}
                variant={selected === option ? "default" : "outline"}
                className={`touch-button h-20 text-xl rounded-xl transition-all ${
                  selected === option 
                    ? "bg-primary text-primary-foreground scale-105" 
                    : "hover:border-primary hover:text-primary"
                }`}
                onClick={() => setSelected(option)}
                data-testid={`button-answer-${option}`}
              >
                {option}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="flex justify-center">
          <Button
            onClick={() => selected && onAnswer(selected)}
            disabled={!selected}
            className="touch-button bg-gradient-to-r from-primary to-cyan-400 text-primary-foreground font-display text-xl px-16 py-6 rounded-xl hover:scale-105 transition-transform disabled:opacity-50"
            data-testid="button-submit-answer"
          >
            Submit Answer
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function ResultScreen({ 
  isCorrect, 
  onContinue 
}: { 
  isCorrect: boolean;
  onContinue: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex flex-col items-center justify-center h-full px-8 text-center"
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", duration: 0.8 }}
        className={`w-24 h-24 rounded-full flex items-center justify-center mb-8 ${
          isCorrect 
            ? "bg-gradient-to-br from-green-400 to-emerald-600" 
            : "bg-gradient-to-br from-orange-400 to-amber-600"
        }`}
      >
        {isCorrect ? (
          <CheckCircle2 className="w-12 h-12 text-white" />
        ) : (
          <XCircle className="w-12 h-12 text-white" />
        )}
      </motion.div>
      
      <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
        {isCorrect ? "Correct!" : "Not Quite!"}
      </h2>
      
      <div className="glass-card rounded-2xl p-8 max-w-2xl mb-8">
        <div className="flex items-start gap-4">
          <Sparkles className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
          <p className="text-lg text-left leading-relaxed">
            {isCorrect ? quizQuestion.funFactCorrect : quizQuestion.funFactIncorrect}
          </p>
        </div>
      </div>
      
      <Button
        onClick={onContinue}
        className="touch-button bg-gradient-to-r from-primary to-cyan-400 text-primary-foreground font-display text-xl px-12 py-6 rounded-xl hover:scale-105 transition-transform"
        data-testid="button-continue-reward"
      >
        Continue
      </Button>
    </motion.div>
  );
}

function RewardScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center h-full px-8 text-center"
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative mb-8"
      >
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 flex items-center justify-center animate-pulse-glow">
          <Award className="w-16 h-16 text-white" />
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center"
        >
          <CheckCircle2 className="w-6 h-6 text-white" />
        </motion.div>
      </motion.div>
      
      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="font-display text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent"
      >
        Congratulations!
      </motion.h2>
      
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-xl text-muted-foreground mb-8"
      >
        You've unlocked a special reward
      </motion.p>
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="glass-card rounded-3xl p-10 max-w-lg mb-8"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <div className="text-left">
            <h3 className="font-display text-2xl font-bold">Memory Photobooth</h3>
            <p className="text-muted-foreground">Unlocked!</p>
          </div>
        </div>
        
        <div className="border-t border-border pt-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <p className="text-sm text-muted-foreground">Badge Earned</p>
              <p className="font-display text-lg font-bold text-amber-400">History Explorer</p>
            </div>
          </div>
        </div>
      </motion.div>
      
      <Button
        onClick={onContinue}
        className="touch-button bg-gradient-to-r from-primary to-cyan-400 text-primary-foreground font-display text-xl px-12 py-6 rounded-xl hover:scale-105 transition-transform"
        data-testid="button-end-session"
      >
        End Session
      </Button>
    </motion.div>
  );
}

function EndScreen({ countdown }: { countdown: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center h-full px-8 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring" }}
        className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center mb-8"
      >
        <ShieldCheck className="w-12 h-12 text-white" />
      </motion.div>
      
      <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
        Session Ended
      </h2>
      
      <div className="glass-card rounded-2xl p-8 max-w-md mb-8">
        <div className="flex items-center gap-3 text-green-400 mb-4">
          <CheckCircle2 className="w-6 h-6" />
          <span className="text-xl font-medium">Data Cleared</span>
        </div>
        <p className="text-muted-foreground">
          All session data has been securely removed. No information was stored or transmitted.
        </p>
      </div>
      
      <p className="text-muted-foreground">
        Returning to start in <span className="text-primary font-bold text-2xl">{countdown}</span> seconds...
      </p>
    </motion.div>
  );
}

export default function Kiosk() {
  const [screen, setScreen] = useState<Screen>("idle");
  const [countdown, setCountdown] = useState(10);
  
  const [session, setSession] = useState<SessionState>({
    token: null,
    school: null,
    quizAnswer: null,
    isCorrect: null,
  });
  
  const clearSession = useCallback(() => {
    setSession({
      token: null,
      school: null,
      quizAnswer: null,
      isCorrect: null,
    });
  }, []);
  
  const handleTapCard = () => {
    setScreen("scan");
    const token = generateSessionToken();
    setSession(prev => ({ ...prev, token }));
    
    setTimeout(() => {
      setScreen("welcome");
    }, 2000);
  };
  
  const handleSchoolSelect = (school: string) => {
    setSession(prev => ({ ...prev, school }));
  };
  
  const handleQuizAnswer = (answer: string) => {
    const isCorrect = answer === quizQuestion.correctAnswer;
    setSession(prev => ({ ...prev, quizAnswer: answer, isCorrect }));
    setScreen("result");
  };
  
  const handleEndSession = () => {
    setScreen("end");
    setCountdown(10);
  };
  
  useEffect(() => {
    if (screen === "end") {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            clearSession();
            setScreen("idle");
            return 10;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [screen, clearSession]);
  
  return (
    <div className="kiosk-container bg-gradient-to-br from-background via-slate-900 to-background relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      </div>
      
      <div className="relative z-10 h-full">
        <AnimatePresence mode="wait">
          {screen === "idle" && (
            <IdleScreen key="idle" onTap={handleTapCard} />
          )}
          {screen === "scan" && (
            <ScanScreen key="scan" />
          )}
          {screen === "welcome" && (
            <WelcomeScreen
              key="welcome"
              school={session.school}
              onSchoolChange={handleSchoolSelect}
              onContinue={() => setScreen("quiz")}
            />
          )}
          {screen === "quiz" && (
            <QuizScreen
              key="quiz"
              onAnswer={handleQuizAnswer}
            />
          )}
          {screen === "result" && (
            <ResultScreen
              key="result"
              isCorrect={session.isCorrect ?? false}
              onContinue={() => setScreen("reward")}
            />
          )}
          {screen === "reward" && (
            <RewardScreen
              key="reward"
              onContinue={handleEndSession}
            />
          )}
          {screen === "end" && (
            <EndScreen key="end" countdown={countdown} />
          )}
        </AnimatePresence>
      </div>
      
      <PrivacyModal />
    </div>
  );
}
