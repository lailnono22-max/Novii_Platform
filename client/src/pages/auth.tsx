import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Mail, Lock, Loader2, Chrome, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import logo from "@assets/generated_images/novii_app_logo.png";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { signIn, signUp } = useAuth();

  const getPasswordStrength = (pwd: string): { score: number; label: string; color: string } => {
    if (!pwd) return { score: 0, label: "", color: "" };
    
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^a-zA-Z0-9]/.test(pwd)) score++;

    if (score <= 2) return { score, label: "ضعيفة", color: "bg-red-500" };
    if (score <= 3) return { score, label: "متوسطة", color: "bg-yellow-500" };
    if (score <= 4) return { score, label: "جيدة", color: "bg-blue-500" };
    return { score, label: "قوية جداً", color: "bg-green-500" };
  };

  const passwordStrength = !isLogin ? getPasswordStrength(password) : null;

  const validateForm = (): boolean => {
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول المطلوبة.",
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        variant: "destructive",
        title: "خطأ في البريد الإلكتروني",
        description: "يرجى إدخال بريد إلكتروني صحيح.",
      });
      return false;
    }

    if (!isLogin) {
      if (password.length < 8) {
        toast({
          variant: "destructive",
          title: "كلمة المرور ضعيفة",
          description: "يجب أن تكون كلمة المرور 8 أحرف على الأقل.",
        });
        return false;
      }

      if (password !== confirmPassword) {
        toast({
          variant: "destructive",
          title: "خطأ في التأكيد",
          description: "كلمة المرور غير متطابقة.",
        });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
        toast({
          title: "مرحباً بعودتك! 👋",
          description: "تم تسجيل الدخول بنجاح.",
        });
      } else {
        await signUp(email, password);
        toast({
          title: "تم إنشاء الحساب! 🎉",
          description: "يرجى التحقق من بريدك الإلكتروني للتفعيل.",
        });
      }
      setLocation("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: error.message || "حدث خطأ ما. يرجى المحاولة مرة أخرى.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      
      if (error) throw error;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: error.message || "فشل تسجيل الدخول عبر Google.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-blue-500/10 via-cyan-500/10 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-6xl flex gap-8 items-center relative z-10">
        {/* Left side - Marketing content */}
        <div className="hidden lg:flex flex-1 flex-col items-center justify-center text-white space-y-8">
          <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left duration-700">
            <img src={logo} alt="Novii" className="w-20 h-20 rounded-2xl shadow-2xl shadow-purple-500/50" />
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Novii
              </h1>
              <p className="text-sm text-gray-400">منصة التواصل الاجتماعي</p>
            </div>
          </div>
          
          <div className="text-center space-y-4 animate-in fade-in slide-in-from-left duration-700 delay-200">
            <h2 className="text-4xl font-light leading-relaxed">
              شارك اللحظات المميزة مع{" "}
              <span className="text-transparent bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text font-semibold">
                أصدقائك المقربين
              </span>
            </h2>
            <div className="flex items-center justify-center gap-8 mt-8">
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <p className="text-sm text-gray-400">منشورات مميزة</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <p className="text-sm text-gray-400">رسائل فورية</p>
              </div>
            </div>
          </div>

          <div className="relative animate-in fade-in zoom-in duration-700 delay-500">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=400&fit=crop"
              alt="Friends"
              className="w-80 h-80 rounded-3xl object-cover shadow-2xl border-2 border-purple-500/20"
            />
            <div className="absolute -top-4 -left-4 w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center shadow-lg animate-bounce">
              <span className="text-2xl">❤️</span>
            </div>
            <div className="absolute -bottom-4 -right-4 w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-cyan-400 flex items-center justify-center shadow-lg animate-bounce delay-500">
              <span className="text-2xl">💬</span>
            </div>
          </div>
        </div>

        {/* Right side - Auth form */}
        <div className="flex-1 max-w-md w-full animate-in fade-in slide-in-from-right duration-700">
          <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 space-y-6 shadow-2xl">
            <div className="text-center space-y-3">
              <div className="flex justify-center lg:hidden mb-4">
                <img src={logo} alt="Novii" className="w-16 h-16 rounded-xl shadow-xl shadow-purple-500/30" />
              </div>
              <h2 className="text-white text-2xl font-bold">
                {isLogin ? "أهلاً بعودتك 👋" : "انضم إلينا الآن 🚀"}
              </h2>
              <p className="text-gray-400 text-sm">
                {isLogin ? "سجل الدخول للمتابعة" : "أنشئ حسابك واستكشف العالم"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-300 font-medium">البريد الإلكتروني</label>
                <div className="relative">
                  <Mail className="absolute right-3 top-3 w-5 h-5 text-gray-500" />
                  <Input
                    type="email"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 pr-10 h-11 focus:border-purple-500 focus:ring-purple-500/20"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-300 font-medium">كلمة المرور</label>
                <div className="relative">
                  <Lock className="absolute right-3 top-3 w-5 h-5 text-gray-500" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 pr-10 pl-10 h-11 focus:border-purple-500 focus:ring-purple-500/20"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-3 text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                
                {!isLogin && password && passwordStrength && (
                  <div className="space-y-1">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-all ${
                            i < passwordStrength.score ? passwordStrength.color : "bg-gray-700"
                          }`}
                        />
                      ))}
                    </div>
                    <p className={`text-xs ${passwordStrength.color.replace('bg-', 'text-')}`}>
                      قوة كلمة المرور: {passwordStrength.label}
                    </p>
                  </div>
                )}
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-sm text-gray-300 font-medium">تأكيد كلمة المرور</label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-3 w-5 h-5 text-gray-500" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 pr-10 h-11 focus:border-purple-500 focus:ring-purple-500/20"
                      dir="ltr"
                    />
                  </div>
                </div>
              )}

              {isLogin && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-purple-500 focus:ring-purple-500/20"
                    />
                    <span className="text-sm text-gray-300">تذكرني</span>
                  </label>
                  <button type="button" className="text-sm text-purple-400 hover:text-purple-300">
                    نسيت كلمة المرور؟
                  </button>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-11 font-semibold shadow-lg shadow-purple-500/30"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    جاري التحميل...
                  </>
                ) : isLogin ? (
                  "تسجيل الدخول"
                ) : (
                  "إنشاء حساب"
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-gray-900 px-2 text-gray-400">أو</span>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleGoogleSignIn}
              variant="outline"
              className="w-full bg-white hover:bg-gray-100 text-gray-900 border-gray-300 h-11 font-semibold"
            >
              <Chrome className="w-5 h-5 ml-2" />
              متابعة مع Google
            </Button>
          </div>

          <div className="mt-6 bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-xl p-4 text-center">
            <p className="text-gray-400 text-sm">
              {isLogin ? "ليس لديك حساب؟ " : "لديك حساب بالفعل؟ "}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setPassword("");
                  setConfirmPassword("");
                }}
                className="text-purple-400 hover:text-purple-300 font-semibold"
              >
                {isLogin ? "إنشاء حساب جديد" : "تسجيل الدخول"}
              </button>
            </p>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-500 text-xs">
              © 2025 Novii. جميع الحقوق محفوظة
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
