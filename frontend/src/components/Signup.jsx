import React, { useState } from "react";
import { Mail, Lock, User, Chrome, Loader2, ArrowRight } from "lucide-react";
import axios from "../api/axios";

// --- UTILITY COMPONENT: CLASS NAME MERGER ---
// A simple utility to conditionally join Tailwind classes.
const cn = (...classes) => classes.filter(Boolean).join(" ");

// --- UI COMPONENTS: Defined for a Monochromatic Theme ---

// Card Component (White background, strong black border/shadow)
const Card = ({ className, ...props }) => (
  <div
    className={cn(
      "rounded-md border border-gray-900 bg-white text-gray-900 shadow-xl shadow-gray-900/10 w-full max-w-md",
      className
    )}
    {...props}
  />
);

const CardHeader = ({ className, ...props }) => (
  <div
    className={cn(
      "flex flex-col space-y-2 p-6 border-b border-gray-200",
      className
    )}
    {...props}
  />
);

const CardTitle = ({ className, ...props }) => (
  <h3
    className={cn(
      "font-extrabold tracking-tight text-4xl text-gray-900",
      className
    )}
    {...props}
  />
);

const CardContent = ({ className, ...props }) => (
  <div className={cn("p-6 space-y-5", className)} {...props} />
);

const Label = ({ className, ...props }) => (
  <label
    className={cn(
      "text-sm font-semibold leading-none text-gray-900",
      className
    )}
    {...props}
  />
);

// Input Component with Icon Placeholder
const Input = ({ className, icon: Icon, ...props }) => (
  <div className="relative flex items-center">
    <input
      className={cn(
        "flex h-12 w-full rounded-md border border-gray-400 bg-white px-3 py-2 text-base pl-11",
        "placeholder:text-gray-500",
        "focus:outline-none focus:ring-2 focus:ring-black focus:border-black",
        "transition-all duration-200",
        className
      )}
      {...props}
    />
    {Icon && <Icon className="w-5 h-5 absolute left-3 text-gray-600" />}
  </div>
);

// Button Component with Loading State
const Button = ({
  children,
  className,
  variant = "primary",
  isLoading = false,
  icon: Icon,
  ...props
}) => {
  const baseClasses = cn(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-base font-bold h-12 px-5 py-2",
    "transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
  );

  const variantClasses = {
    primary: "bg-black text-white hover:bg-gray-800",
    google: "bg-white text-gray-900 border-2 border-gray-900 hover:bg-gray-100",
  }[variant];

  return (
    <button
      className={cn(baseClasses, variantClasses, className)}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
      ) : (
        Icon && <Icon className="mr-2 h-5 w-5" />
      )}
      {children}
    </button>
  );
};

// --- SIGN UP FORM COMPONENT ---

const SignUpForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage("");
  setIsLoading(true);

  try {
    console.log("User data being sent:", { name, email, password });
    const res = await axios.post("/users/register", {
      name,
      email,
      password,
    });
    setIsLoading(false);
    setMessage(res.data.message); // Show success message
    setName("");
    setEmail("");
    setPassword("");
  } catch (err) {
    setIsLoading(false);
    setMessage(
      err.response?.data?.message || "Something went wrong. Please try again."
    );
  }
};

  // Simulated Google button click
  const handleGoogleClick = () => {
    setMessage("Redirecting to Google Sign-In...");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Sign Up</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Google Sign Up Button */}
        <Button
          variant="google"
          icon={Chrome}
          className="w-full"
          onClick={handleGoogleClick}
          disabled={isLoading}
        >
          Continue with Google
        </Button>

        {/* Separator */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500 font-medium">
              Or register with email
            </span>
          </div>
        </div>

        {/* Message Display (Success/Error) */}
        {message && (
          <div
            className={cn(
              "p-3 mb-4 rounded-md border font-medium text-sm",
              message.startsWith("Success")
                ? "border-green-600 bg-green-50 text-green-800"
                : "border-gray-500 bg-gray-100 text-gray-700"
            )}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Full Name"
              icon={User}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Min 6 characters"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full mt-6"
            isLoading={isLoading}
            icon={ArrowRight}
          >
            {isLoading ? "Signing Up..." : "Create Account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-700">
          Already have an account?{" "}
          <a href="/login" className="font-bold text-black hover:underline">
            Log In
          </a>
        </p>
      </CardContent>
    </Card>
  );
};

// --- MAIN APP COMPONENT ---

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* Tailwind CSS Script for the component to load styles */}
      <script src="https://cdn.tailwindcss.com"></script>
      {/* Font Import for better typography (Inter) */}
      <style>
        {`
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
                    body { font-family: 'Inter', sans-serif; }
                `}
      </style>

      <SignUpForm />
    </div>
  );
}
