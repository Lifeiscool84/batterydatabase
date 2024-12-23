import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
      toast({
        title: "Welcome to BatteryToKorea Database",
        description: "Successfully logged in.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
        className: "bg-white/90 border border-red-200 text-red-900",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1a4b]">
      <div className="w-full max-w-md p-8 space-y-8 bg-white/10 backdrop-blur-lg rounded-lg shadow-xl animate-fadeIn">
        <div className="text-center space-y-4">
          <img
            src="/lovable-uploads/cac3605d-c4d3-4f01-b2f0-38314a60946b.png"
            alt="BatteryToKorea Logo"
            className="w-32 h-32 mx-auto"
          />
          <h1 className="text-3xl font-bold text-[#FFD700]">BatteryToKorea Database</h1>
          <p className="text-gray-300">Please sign in to continue</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium text-[#FFD700]">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent text-white"
              placeholder="Enter your username"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-[#FFD700]">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent text-white"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-[#FFD700] text-[#1a1a4b] rounded-md hover:bg-[#FFD700]/90 transition-colors duration-200 font-semibold"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;