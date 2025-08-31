import { GoogleIcon, TwitterIcon } from "@/components/icons";
import KataloginLogo from "@/components/KataloginLogo";
import LoadingSpinner from "@/components/LoadingSpinner";
import ParticleBackground from "@/components/ParticleBackground";
import { useAuth } from "@/contexts/AuthContext";
import { Geist } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const geist = Geist({
  subsets: ["latin"],
});

export default function Register() {
  const router = useRouter();
  const { user, loading, signUp, signInWithGoogle } = useAuth();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [authError, setAuthError] = useState("");

  // Redirect authenticated users to onboarding
  useEffect(() => {
    if (!loading && user) {
      router.push("/onboarding");
    }
  }, [user, loading, router]);

  // Show loading while checking authentication
  if (loading) {
    return <LoadingSpinner />;
  }

  // Don't render register form if user is authenticated
  if (user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError("");

    // Basic validation
    const newErrors: Record<string, string> = {};

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    // Sign up with Supabase
    const { error } = await signUp(formData.email, formData.password, {
      firstName: formData.firstName,
      lastName: formData.lastName,
    });

    if (error) {
      setAuthError(error.message);
      setIsLoading(false);
    } else {
      // Show success message or redirect
      router.push("/onboarding");
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setAuthError("");

    const { error } = await signInWithGoogle();

    if (error) {
      setAuthError(error.message);
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: "",
      });
    }
  };

  return (
    <div className={`${geist.className} min-h-screen relative overflow-hidden`}>
      <ParticleBackground />

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mb-6 flex justify-center">
              <KataloginLogo size="md" clickable={true} />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">
              {t("auth.createAccount")}
            </h1>
            <p className="text-gray-300">{t("auth.joinUsAndGetStarted")}</p>
          </div>

          {/* Register Form */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
            {authError && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-4">
                <p className="text-red-200 text-sm">{authError}</p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-white mb-2"
                  >
                    {t("auth.firstName")}
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder={t("auth.firstNamePlaceholder")}
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-white mb-2"
                  >
                    {t("auth.lastName")}
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder={t("auth.lastNamePlaceholder")}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-white mb-2"
                >
                  {t("auth.email")}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder={t("auth.emailPlaceholder")}
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-white mb-2"
                >
                  {t("auth.password")}
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                    errors.password ? "border-red-400" : "border-white/20"
                  }`}
                  placeholder={t("auth.createPassword")}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-400">{errors.password}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-white mb-2"
                >
                  {t("auth.confirmPassword")}
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                    errors.confirmPassword
                      ? "border-red-400"
                      : "border-white/20"
                  }`}
                  placeholder={t("auth.confirmPasswordPlaceholder")}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="w-4 h-4 text-purple-600 bg-white/10 border-white/20 rounded focus:ring-purple-500 focus:ring-2"
                />
                <label htmlFor="terms" className="ml-2 text-sm text-gray-300">
                  {t("auth.iAgreeTo")}{" "}
                  <Link
                    href="/terms"
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    {t("auth.termsOfService")}
                  </Link>{" "}
                  {t("auth.and")}{" "}
                  <Link
                    href="/privacy"
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    {t("auth.privacyPolicy")}
                  </Link>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {t("auth.creatingAccount")}
                  </div>
                ) : (
                  t("auth.createAccount")
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="mt-6">
              <div className="relative">
                {/* <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div> */}
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-transparent text-gray-300">
                    {t("auth.orContinueWith")}
                  </span>
                </div>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full inline-flex justify-center py-2 px-4 border border-white/20 rounded-lg shadow-sm bg-white/10 text-sm font-medium text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <GoogleIcon className="w-5 h-5" />
                <span className="ml-2">Google</span>
              </button>
              <button
                type="button"
                disabled
                className="w-full inline-flex justify-center py-2 px-4 border border-white/20 rounded-lg shadow-sm bg-white/10 text-sm font-medium text-white opacity-50 cursor-not-allowed"
              >
                <TwitterIcon className="w-5 h-5" />
                <span className="ml-2">Twitter</span>
              </button>
            </div>

            {/* Sign In Link */}
            <p className="mt-8 text-center text-sm text-gray-300">
              {t("auth.alreadyHaveAccount")}{" "}
              <Link
                href="/login"
                className="font-medium text-purple-400 hover:text-purple-300 transition-colors"
              >
                {t("auth.signInHere")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
