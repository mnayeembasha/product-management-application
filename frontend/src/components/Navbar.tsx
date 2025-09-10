import React from "react";
import { Link } from "react-router-dom";
import { LogIn, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/authSlice";
import { ToggleMode } from "./ToggleMode";

export const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { authUser, isLoggingOut } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="border-b border-border fixed w-full top-0 z-50 backdrop-blur-lg bg-background/80 shadow-sm">
      <div className="container mx-auto px-4 md:px-8 h-16 ">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center justify-center gap-2.5 hover:opacity-80 transition-all"
            >
              {/* <div className="size-8  rounded-lg bg-gradient-primary flex items-center justify-center shadow-md">
                <PenTool className="w-4 h-4 text-primary-foreground" />
              </div> */}
              <h1 className="text-gradient-primary text-2xl   tracking-tighter">
                ProdManager
              </h1>
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-x-2">
            {/* Theme Toggle */}
            <ToggleMode
              showLabel={false}
              className=""
            />
            

            {authUser ? (
              <>
                {/* Profile Button */}
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className=" border-primary/20 hover:bg-primary/10 hover:border-primary/40 transition-colors"
                >
                  <Link to="/admin">
                    <User className="w-4 h-4" />
                    {/* <span className="hidden md:inline">Profile</span> */}
                  </Link>
                </Button>


                {/* Logout Button */}
                <Button
                  onClick={handleLogout}
                  variant="default"
                  size="sm"
                  className="bg-gradient-primary hover:opacity-90 transition-opacity"
                  disabled={isLoggingOut}
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden md:inline">
                    {isLoggingOut ? 'Logging out...' : 'Logout'}
                  </span>
                </Button>
              </>
            ) : (
              /* Login Button */
              <Button
                asChild
                variant="default"
                size="lg"
                className="gap-2 bg-gradient-primary hover:opacity-90 transition-opacity md:gap-2"
              >
                <Link to="/login">
                  <LogIn className="w-4 h-4" />
                  <span className="hidden md:inline">Login</span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};