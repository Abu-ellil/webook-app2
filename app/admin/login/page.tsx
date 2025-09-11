"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("adminToken", data.token);
        toast.success("تم تسجيل الدخول بنجاح");
        router.push("/admin");
      } else {
        toast.error("اسم المستخدم أو كلمة المرور غير صحيحة");
      }
    } catch (error) {
      toast.error("حدث خطأ في تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="text-3xl font-bold text-primary mb-2">WBK</div>
          <div className="text-sm text-gray-400">webook.com</div>
          <h1 className="text-2xl font-bold mt-6 mb-2">تسجيل دخول الإدارة</h1>
          <p className="text-gray-400">
            ادخل بيانات الإدارة للوصول للوحة التحكم
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              اسم المستخدم
            </label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) =>
                setCredentials((prev) => ({
                  ...prev,
                  username: e.target.value,
                }))
              }
              className="w-full bg-dark-card border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
              placeholder="admin"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              كلمة المرور
            </label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) =>
                setCredentials((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
              className="w-full bg-dark-card border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </button>
        </form>

        {/* <div className="mt-8 p-4 bg-dark-card rounded-lg">
          <h3 className="font-bold mb-2">بيانات الدخول الافتراضية:</h3>
          <p className="text-sm text-gray-400">
            اسم المستخدم: <span className="text-white">admin</span>
          </p>
          <p className="text-sm text-gray-400">
            كلمة المرور: <span className="text-white">admin123</span>
          </p>
        </div> */}
      </div>
    </div>
  );
}
