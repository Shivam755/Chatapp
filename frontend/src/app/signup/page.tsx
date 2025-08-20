"use client";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import EyeIcon from "@/svg/eyeIcon";
import { registerUser } from "@/services/apiCalls";
import { useToast } from "@/components/Toast";
import NeumorphicButton from "@/components/NeumorphicButton";
import { withGuest } from "@/utils/withGuest";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isConfirmFocused, setIsConfirmFocused] = useState(false);

  const { showToast } = useToast();
  const router = useRouter();

  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);

  const inputClass = "neumorphic-input focus:outline-none w-full";

  const clearForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setName("");
    setErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
  };
  // Individual field validation
  const validateName = (value: string) => {
    if (!value.trim()) return "Name is required";
    return "";
  };

  const validateEmail = (value: string) => {
    if (!value.trim()) return "Email is required";
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) return "Invalid email";
    return "";
  };

  const validatePassword = (value: string) => {
    if (!value) return "Password is required";
    if (value.length < 6) return "Password must be at least 6 characters";
    if (!/[A-Z]/.test(value))
      return "Password must include at least one uppercase letter";
    if (!/[a-z]/.test(value))
      return "Password must include at least one lowercase letter";
    if (!/[0-9]/.test(value))
      return "Password must include at least one number";
    if (!/[@#$%&_]/.test(value))
      return "Password must include at least one special character (@, #, $, %, &, _)";
    return "";
  };

  const validateConfirmPassword = (value: string) => {
    if (!value) return "Please confirm your password";
    if (value !== password) return "Passwords do not match";
    return "";
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    setErrors((prev) => ({ ...prev, name: validateName(value) }));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setErrors((prev) => ({
      ...prev,
      password: validatePassword(value),
    }));
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setErrors((prev) => ({
      ...prev,
      confirmPassword: validateConfirmPassword(value),
    }));
  };

  const validate = () => {
    const newErrors: typeof errors = {
      name: validateName(name),
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(confirmPassword),
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((err) => !err);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // Handle signup logic here
      const response = await registerUser(
        name,
        email,
        password,
        confirmPassword
      );
      try {
        console.log(response);
        if (response.success) {
          console.log("User registered successfully:", response);
          // Redirect or show success message
          showToast("Registration successful!", "success");
          clearForm();
          setTimeout(() => {
            router.push("/login"); // Redirect to login page after successful registration
          });
        } else {
          showToast(response.error, "error");
          if (response.error.includes("email already exists")) {
            setErrors((prev) => ({ ...prev, email: "Email already exists" }));
          }
        }
      } catch (error: any) {
        console.error("Error registering user:", error.message);
      }
    }
  };

  // Reset show password when input loses focus
  const handlePasswordBlur = () => {
    setIsPasswordFocused(false);
    setShowPassword(false);
  };

  const handleConfirmBlur = () => {
    setIsConfirmFocused(false);
    setShowConfirmPassword(false);
  };

  // Prevent input blur when clicking the eye icon
  const handleEyeMouseDown = (
    e: React.MouseEvent,
    type: "password" | "confirm"
  ) => {
    e.preventDefault();
    if (type === "password") {
      setShowPassword((v) => !v);
      setTimeout(() => passwordRef.current?.focus(), 0);
    } else {
      setShowConfirmPassword((v) => !v);
      setTimeout(() => confirmRef.current?.focus(), 0);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[#e0e5ec]">
      <div className="neumorphic p-8 w-80 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Sign Up</h1>
        <form
          className="flex flex-col gap-4 w-full"
          noValidate
        >
          <input
            type="text"
            placeholder="Name"
            className={inputClass}
            value={name}
            onChange={handleNameChange}
            required
          />
          {errors.name && (
            <span className="text-red-500 text-xs">{errors.name}</span>
          )}
          <input
            type="email"
            placeholder="Email"
            className={inputClass}
            value={email}
            onChange={handleEmailChange}
            required
          />
          {errors.email && (
            <span className="text-red-500 text-xs">{errors.email}</span>
          )}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className={inputClass}
              value={password}
              onChange={handlePasswordChange}
              required
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={handlePasswordBlur}
              disabled={isConfirmFocused}
            />
            {isPasswordFocused && !isConfirmFocused && (
              <button
                type="button"
                className="absolute right-2 top-2"
                onMouseDown={(e) => handleEyeMouseDown(e, "password")}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <EyeIcon open={showPassword} />
              </button>
            )}
          </div>
          {errors.password && (
            <span className="text-red-500 text-xs">{errors.password}</span>
          )}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className={inputClass}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
              onFocus={() => setIsConfirmFocused(true)}
              onBlur={handleConfirmBlur}
            />
            {isConfirmFocused && (
              <button
                type="button"
                className="absolute right-2 top-2"
                onMouseDown={(e) => handleEyeMouseDown(e, "confirm")}
                tabIndex={-1}
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
              >
                <EyeIcon open={showConfirmPassword} />
              </button>
            )}
          </div>
          {errors.confirmPassword && (
            <span className="text-red-500 text-xs">
              {errors.confirmPassword}
            </span>
          )}
          <NeumorphicButton
            onClick={handleSubmit}
            className="mt-4 px-4 py-2 rounded-full neumorphic text-purple-600 font-semibold shadow hover:scale-105 transition-transform"
          >
            Sign Up
          </NeumorphicButton>
          <div className="mt-6 text-sm text-gray-600 text-center">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-purple-500 underline hover:text-purple-700 transition"
            >
              Login
            </a>
          </div>
        </form>
      </div>
    </main>
  );
}

export default withGuest(Signup);