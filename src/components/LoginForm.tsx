
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AtSign, Lock, PinterestIcon, ArrowRight } from "lucide-react";

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
}

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const signupSchema = loginSchema.extend({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const handleLoginSubmit = (data: LoginFormValues) => {
    onLogin(data.email, data.password);
  };

  const handleSignupSubmit = (data: SignupFormValues) => {
    // For demonstration, we'll just log in after signup
    onLogin(data.email, data.password);
  };

  return (
    <div className="w-full relative">
      <div className="absolute inset-0 bg-gradient-to-r from-pink-200 to-purple-300 opacity-30 rounded-3xl blur-xl -z-10"></div>
      
      <Tabs defaultValue="login" className="w-full">
        <div className="flex justify-between items-center py-4 px-6">
          <p className="text-sm text-muted-foreground">TaskTide_</p>
          <TabsList className="bg-transparent border-none shadow-none p-0">
            {/* We'll style these buttons to look like the text in the image */}
            <TabsTrigger 
              value="login" 
              className="text-xl font-medium data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none px-2"
            >
              Log in
            </TabsTrigger>
            <TabsTrigger 
              value="signup" 
              className="text-xl font-medium data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none px-2"
            >
              Sign up
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="login" className="px-6 pt-2 pb-6 animate-fade-in">
          <div className="space-y-6">
            <div className="flex justify-end mb-4">
              <Button variant="outline" size="sm" className="rounded-full bg-white bg-opacity-80 border-none gap-2">
                <PinterestIcon className="h-4 w-4" />
                <span className="text-sm font-normal">Pinterest</span>
              </Button>
            </div>
            
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(handleLoginSubmit)} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-white rounded-full p-2">
                            <AtSign className="h-4 w-4 text-gray-500" />
                          </div>
                          <Input 
                            placeholder="e-mail address" 
                            className="pl-12 h-14 rounded-full bg-white bg-opacity-80 border-none"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-white rounded-full p-2">
                            <Lock className="h-4 w-4 text-gray-500" />
                          </div>
                          <Input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="password" 
                            className="pl-12 h-14 rounded-full bg-white bg-opacity-80 border-none"
                            {...field} 
                          />
                          <button 
                            type="button"
                            onClick={() => {}}
                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white rounded-full px-3 py-1 text-sm"
                          >
                            I forgot
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="text-xs text-muted-foreground py-4">
                  <p>Tidak semua orang akan dengan kerendahan ada</p>
                  <p>sebagian dari mereka nyaman dengan kesendiran dan</p>
                  <p>hanya akan bercerita kepada orang laca sekurupanya.</p>
                </div>
                
                <div className="flex justify-between items-center pt-2">
                  <button type="button" className="text-sm text-muted-foreground hover:underline">
                    Click here for more info.
                  </button>
                  <Button type="submit" size="icon" className="rounded-full h-12 w-12 bg-black hover:bg-gray-800">
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </TabsContent>
        
        <TabsContent value="signup" className="px-6 pt-2 pb-6 animate-fade-in">
          <div className="space-y-6">
            <div className="flex justify-end mb-4">
              <Button variant="outline" size="sm" className="rounded-full bg-white bg-opacity-80 border-none gap-2">
                <PinterestIcon className="h-4 w-4" />
                <span className="text-sm font-normal">Pinterest</span>
              </Button>
            </div>
            
            <Form {...signupForm}>
              <form onSubmit={signupForm.handleSubmit(handleSignupSubmit)} className="space-y-4">
                <FormField
                  control={signupForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-white rounded-full p-2">
                            <AtSign className="h-4 w-4 text-gray-500" />
                          </div>
                          <Input 
                            placeholder="full name" 
                            className="pl-12 h-14 rounded-full bg-white bg-opacity-80 border-none"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={signupForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-white rounded-full p-2">
                            <AtSign className="h-4 w-4 text-gray-500" />
                          </div>
                          <Input 
                            placeholder="e-mail address" 
                            className="pl-12 h-14 rounded-full bg-white bg-opacity-80 border-none"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={signupForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-white rounded-full p-2">
                            <Lock className="h-4 w-4 text-gray-500" />
                          </div>
                          <Input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="password" 
                            className="pl-12 h-14 rounded-full bg-white bg-opacity-80 border-none"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="text-xs text-muted-foreground py-4">
                  <p>By creating an account, you agree to our Terms of Service and Privacy Policy.</p>
                </div>
                
                <div className="flex justify-between items-center pt-2">
                  <button type="button" className="text-sm text-muted-foreground hover:underline">
                    Already have an account?
                  </button>
                  <Button type="submit" size="icon" className="rounded-full h-12 w-12 bg-black hover:bg-gray-800">
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LoginForm;
