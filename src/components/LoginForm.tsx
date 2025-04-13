
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    <Tabs defaultValue="login" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="signup">Sign up</TabsTrigger>
      </TabsList>
      
      <TabsContent value="login" className="animate-fade-in">
        <div className="space-y-6 bg-card border border-border p-6 rounded-lg shadow-sm">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold">Welcome back</h1>
            <p className="text-sm text-muted-foreground">Enter your credentials to access your account</p>
          </div>
          
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(handleLoginSubmit)} className="space-y-4">
              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="name@company.com" {...field} />
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </Form>
          
          <div className="text-center text-sm">
            <a className="text-primary hover:underline cursor-pointer">Forgot password?</a>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="signup" className="animate-fade-in">
        <div className="space-y-6 bg-card border border-border p-6 rounded-lg shadow-sm">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold">Create an account</h1>
            <p className="text-sm text-muted-foreground">Enter your details to create a new account</p>
          </div>
          
          <Form {...signupForm}>
            <form onSubmit={signupForm.handleSubmit(handleSignupSubmit)} className="space-y-4">
              <FormField
                control={signupForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="name@company.com" {...field} />
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full">
                Create account
              </Button>
            </form>
          </Form>
          
          <div className="text-center text-xs text-muted-foreground">
            By creating an account, you agree to our <a className="text-primary hover:underline cursor-pointer">Terms of Service</a> and <a className="text-primary hover:underline cursor-pointer">Privacy Policy</a>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default LoginForm;
