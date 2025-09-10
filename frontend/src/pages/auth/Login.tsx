import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z, ZodError } from 'zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import AnimatedPattern from '@/components/AnimatedPattern';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { login } from '@/store/authSlice';
import { type LoginDataType } from '@/types';

const loginSchema = z.object({
  email: z.string()
    .min(1, { message: 'Email is required.' })
    .email({
      message: 'Please enter a valid email address.',
    }),
  password: z.string()
    .min(1, { message: 'Password is required.' })
    .min(6, {
      message: 'Password must be at least 6 characters.',
    }),
});

export const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoggingIn, authUser } = useAppSelector((state) => state.auth);
  const [showPassword, setShowPassword] = React.useState(false);

  const form = useForm<LoginDataType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  React.useEffect(() => {
    if (authUser) {
      navigate('/dashboard');
    }
  }, [authUser, navigate]);

  const onSubmit = async (values: LoginDataType) => {
    try {
      // Validate form before submission
      const validationResult = loginSchema.safeParse(values);

      if (!validationResult.success) {
        const errors = validationResult.error.issues;
        errors.forEach((error:unknown) => {
          if(error instanceof ZodError){
            toast.error(error.message);
          }else{
            toast.error("Error Occoured during validation")
          }

        });
        return;
      }

      // Trim whitespace from inputs
      const cleanValues = {
        email: values.email.trim().toLowerCase(),
        password: values.password,
      };

      await dispatch(login(cleanValues)).unwrap();
      // toast.success('Welcome back! Login successful!');
      // Navigation will be handled by the useEffect when authUser changes
    } catch (error: unknown) {
      // Error handling is done in the slice, but we can add additional client-side validation here
      if(error instanceof Error){
        toast.error(error.message);
      }else{
        console.error("Error during Login")
      }

    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Login form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gradient-primary">
              Welcome Back
            </h1>
            <p className="text-muted-foreground">
              Sign in to continue managing your products
            </p>
          </div>

          {/* Login Form */}
          <Card className="border-2 border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Sign In</CardTitle>
              <CardDescription className="text-center">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter your email"
                            className="transition-all duration-200 focus:border-primary focus:ring-primary"
                            disabled={isLoggingIn}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your password"
                              className="pr-10 transition-all duration-200 focus:border-primary focus:ring-primary"
                              disabled={isLoggingIn}
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                              disabled={isLoggingIn}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />



                  <Button
                    type="submit"
                    className="w-full bg-gradient-primary hover:opacity-90 transition-opacity duration-200"
                    disabled={isLoggingIn}
                  >
                    {isLoggingIn ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Signup Link */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="font-medium text-primary hover:underline transition-colors duration-200"
              >
                Create account
              </Link>
            </p>
          </div>

        </div>
      </div>

      {/* Right side - Animated pattern */}
      <div className="hidden lg:block flex-1">
        <AnimatedPattern />
      </div>
    </div>
  );
};