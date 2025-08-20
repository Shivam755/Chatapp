"use client";
import React, { useState, useRef, use } from "react";
import { useRouter } from "next/navigation";
import EyeIcon from "@/svg/eyeIcon";
import { useToast } from "@/components/Toast";
import { loginUser } from "@/services/apiCalls";
import { useAuthStore } from "@/store/auth.store";
import NeumorphicButton from "@/components/NeumorphicButton";
import { withGuest } from "@/utils/withGuest";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const { showToast } = useToast();
  const router = useRouter();
  const setLogin = useAuthStore((state) => state.setLogin);

  const passwordRef = useRef<HTMLInputElement>(null);

  const inputClass = "neumorphic-input focus:outline-none w-full";


  const clearForm = () => {
    setEmail("");
    setPassword("");
    setErrors({});
    setShowPassword(false);
  };
  // Individual field validation
  const validateEmail = (value: string) => {
    if (!value.trim()) return "Email/Username is required";
    return "";
  };

  const validatePassword = (value: string) => {
    if (!value) return "Password is required";
    return "";
  };

  const validate = () => {
    const newErrors: typeof errors = {
      email: validateEmail(email),
      password: validatePassword(password),
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((err) => !err);
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

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (validate()) {
      let response = await loginUser(email, password);
      if (!response.success) {
        showToast(response.error??"", "error");
        return;
      }
      // Save loginId and signed in state to global store
      setLogin(response.loginid ?? "");
      showToast("Login successful!", "success");
      clearForm();
      // Redirect to home page after successful login
      setTimeout(() => router.push("/listChat"), 1200);
    }
  };

  // Reset show password when input loses focus
  const handlePasswordBlur = () => {
    setIsPasswordFocused(false);
    setShowPassword(false);
  };

  // Prevent input blur when clicking the eye icon
  const handleEyeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowPassword((v) => !v);
    setTimeout(() => passwordRef.current?.focus(), 0);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[#e0e5ec]">
      <div className="neumorphic p-8 w-80 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Login</h1>
        <form
          className="flex flex-col gap-4 w-full"
          noValidate
        >
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
              ref={passwordRef}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className={inputClass}
              value={password}
              onChange={handlePasswordChange}
              required
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={handlePasswordBlur}
            />
            {isPasswordFocused && (
              <button
                type="button"
                className="absolute right-2 top-2"
                onMouseDown={(e) => handleEyeMouseDown(e)}
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
          <div className="text-right mt-1">
            <a
              href="#"
              className="text-blue-400 underline hover:text-blue-600 text-xs transition"
            >
              Forgot password?
            </a>
          </div>
          <NeumorphicButton
            onClick={handleSubmit}
            className="mt-4 px-4 py-2 rounded-full neumorphic text-blue-600 font-semibold shadow hover:scale-105 transition-transform"
          >
            Login
          </NeumorphicButton>
          <div className="mt-6 text-sm text-gray-600 text-center">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="text-blue-500 underline hover:text-blue-700 transition"
            >
              Register
            </a>
          </div>
        </form>
      </div>
    </main>
  );
}

export default withGuest(Login);