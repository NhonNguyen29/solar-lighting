'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role?: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, fullName: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  // Tải hồ sơ người dùng từ bảng public.profiles hoặc metadata
  const fetchProfile = async (currentUser: User) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (!error && data) {
        setProfile({
          id: data.id,
          email: data.email,
          fullName: data.full_name || currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'Khách hàng',
          phone: data.phone || currentUser.user_metadata?.phone,
          role: data.role || 'customer',
          avatarUrl: data.avatar_url,
        });
      } else {
        // Fallback từ metadata
        setProfile({
          id: currentUser.id,
          email: currentUser.email || '',
          fullName: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'Khách hàng',
          phone: currentUser.user_metadata?.phone,
          role: 'customer',
        });
      }
    } catch {
      setProfile({
        id: currentUser.id,
        email: currentUser.email || '',
        fullName: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'Khách hàng',
        role: 'customer',
      });
    }
  };

  useEffect(() => {
    let isMounted = true;

    // 1. Lấy phiên đăng nhập hiện tại từ Supabase Auth
    async function initAuth() {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Lỗi lấy phiên Supabase Auth:', error.message);
        }

        if (isMounted) {
          if (initialSession?.user) {
            setSession(initialSession);
            setUser(initialSession.user);
            await fetchProfile(initialSession.user);
          } else {
            setSession(null);
            setUser(null);
            setProfile(null);
          }
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Ngoại lệ khi khởi tạo Auth:', err);
        if (isMounted) setIsLoading(false);
      }
    }

    initAuth();

    // 2. Lắng nghe thay đổi trạng thái đăng nhập thời gian thực
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        if (!isMounted) return;
        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (newSession?.user) {
          await fetchProfile(newSession.user);
        } else {
          setProfile(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Đăng nhập bằng Email và Mật khẩu qua Supabase Auth
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        let msg = error.message;
        if (error.message.includes('Invalid login credentials')) {
          msg = 'Email hoặc mật khẩu không chính xác.';
        } else if (error.message.includes('Email not confirmed')) {
          msg = 'Tài khoản chưa được xác nhận email.';
        }
        return { success: false, error: msg };
      }

      if (data.user) {
        setUser(data.user);
        setSession(data.session);
        await fetchProfile(data.user);
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Lỗi kết nối máy chủ' };
    }
  };

  // Đăng ký tài khoản mới bằng Email và Mật khẩu qua Supabase Auth
  const signUp = async (email: string, password: string, fullName: string, phone?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            phone: phone?.trim(),
          },
        },
      });

      if (error) {
        let msg = error.message;
        if (error.message.includes('User already registered')) {
          msg = 'Email này đã được đăng ký tài khoản. Vui lòng đăng nhập.';
        } else if (error.message.includes('Password should be at least')) {
          msg = 'Mật khẩu phải có tối thiểu 6 ký tự.';
        }
        return { success: false, error: msg };
      }

      // Tự động đăng nhập nếu có phiên hoặc đăng nhập tiếp
      if (data.session) {
        setSession(data.session);
        setUser(data.user);
        if (data.user) await fetchProfile(data.user);
      } else if (data.user) {
        // Đăng nhập tự động ngay sau khi tạo
        const autoLogin = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (autoLogin.data.session) {
          setSession(autoLogin.data.session);
          setUser(autoLogin.data.user);
          if (autoLogin.data.user) await fetchProfile(autoLogin.data.user);
        }
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Lỗi khi tạo tài khoản' };
    }
  };

  // Đăng xuất khỏi hệ thống
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
    } catch (err) {
      console.error('Lỗi khi đăng xuất:', err);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isLoading,
        signIn,
        signUp,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
