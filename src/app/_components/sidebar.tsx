"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  Home,
  Settings,
  LogOut,
  User,
  FileText,
  BarChart3,
  Zap,
  Trophy,
  CreditCard,
  Calendar,
  DollarSign,
  UserPlus,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { logOut } from "@/actions/auth";
import Image from "next/image";

interface SidebarProps {
  className?: string;
  username?: string;
  role?: "ADMIN" | "HEAD_MASTER";
}

export function Sidebar({ className = "", username, role }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDataExpanded, setIsDataExpanded] = useState(false);
  const pathName = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        window.innerWidth < 1024 &&
        isOpen
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, isMounted]);

  useEffect(() => {
    if (isOpen && window.innerWidth < 1024) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  useEffect(() => {
    const dataSubPages = ["/students", "/education-fees", "/clusters"];
    if (dataSubPages.some((page) => pathName.startsWith(page))) {
      setIsDataExpanded(true);
    }
  }, [pathName]);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  const closeSidebarOnMobile = () => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  const toggleDataMenu = () => {
    setIsDataExpanded((prev) => !prev);
  };

  const menuItems = [
    {
      name: "Pembayaran",
      icon: <CreditCard className="w-5 h-5" />,
      href: "/payments",
      role: ["ADMIN"],
    },
    {
      name: "Data Set",
      icon: <FileText className="w-5 h-5" />,
      href: "/reports",
      role: ["ADMIN", "HEAD_MASTER"],
    },
    {
      name: "Clustering",
      icon: <Zap className="w-5 h-5" />,
      href: "/clustering",
      role: ["ADMIN"],
    },
    {
      name: "Hasil Clustering",
      icon: <Trophy className="w-5 h-5" />,
      href: "/results",
      role: ["ADMIN", "HEAD_MASTER"],
    },
    {
      name: "Pengaturan",
      icon: <Settings className="w-5 h-5" />,
      href: "/settings",
      role: ["ADMIN", "HEAD_MASTER"],
    },
    // {
    //   name: "Upgrade",
    //   icon: <TrendingUp className="w-5 h-5" />,
    //   href: "/upgrades",
    //   role: ["ADMIN", "HEAD_MASTER"],
    // },
  ];

  const dataSubItems = [
    {
      name: "Tahun Akademik",
      icon: <Calendar className="w-5 h-5" />,
      href: "/academic-years",
      role: ["ADMIN", "HEAD_MASTER"],
    },
    {
      name: "SPP",
      icon: <DollarSign className="w-4 h-4" />,
      href: "/education-fees",
      role: ["ADMIN"],
    },
    {
      name: "Siswa",
      icon: <UserPlus className="w-4 h-4" />,
      href: "/students",
      role: ["ADMIN"],
    },
  ];

  const handleLogout = () => {
    const confirmLogout = confirm("Apakah Anda yakin ingin keluar?");
    if (confirmLogout) {
      logOut();
    }
  };

  if (pathName === "/login") {
    return null;
  }

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 p-2.5 rounded-lg bg-blue-600 text-white shadow-sm hover:bg-slate-700 transition-colors duration-200 z-30 lg:hidden"
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      <aside
        ref={sidebarRef}
        className={`
          fixed left-0 top-0 h-full z-50
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          transition-transform duration-300 ease-in-out
          w-72 bg-slate-50 border-r border-slate-200
          ${className}
        `}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-6 border-b border-slate-100">
            <div className="flex items-center gap-3 mt-10 justify-center">
              <Image
                width={60}
                height={60}
                src={"/logo_YWKA.png"}
                alt="logo"
                className="object-fill"
              />
              <h1 className="text-sm font-semibold text-slate-800">
                SD SWASTA YWKA MEDAN
              </h1>
            </div>
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-md hover:bg-slate-100 transition-colors lg:hidden"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          <nav className="flex-1 pt-6 pb-4 overflow-y-auto">
            <div className="px-6 mb-8">
              <div className="py-3 px-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-xs font-medium text-blue-600">
                  Selamat datang kembali
                </p>
                <p className="text-sm text-slate-800 mt-1 font-medium">
                  {username || "Admin"}
                </p>
              </div>
            </div>
            <ul className="space-y-1 px-4">
              <li>
                <Link
                  href="/"
                  className={`flex items-center px-3 py-2.5 text-sm rounded-lg transition-colors duration-200 ${
                    pathName === "/"
                      ? "bg-blue-600 text-white"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                  onClick={closeSidebarOnMobile}
                >
                  <span className="flex-shrink-0">
                    <Home className="w-5 h-5" />
                  </span>
                  <span className="ml-3 font-medium">Dashboard</span>
                  {pathName === "/" && (
                    <span className="ml-auto w-1 h-6 bg-white rounded-full" />
                  )}
                </Link>
              </li>

              {role === "ADMIN" ? (
                <li>
                  <button
                    onClick={toggleDataMenu}
                    className={`w-full flex items-center px-3 py-2.5 text-sm rounded-lg transition-colors duration-200 ${
                      dataSubItems.some(
                        (subItem) =>
                          pathName === subItem.href ||
                          (pathName.startsWith(subItem.href) &&
                            subItem.href !== "/")
                      )
                        ? "bg-blue-600 text-white"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span className="flex-shrink-0">
                      <BarChart3 className="w-5 h-5" />
                    </span>
                    <span className="ml-3 font-medium">Data</span>
                    <span className="ml-auto">
                      {isDataExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </span>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      isDataExpanded
                        ? "max-h-40 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <ul className="mt-2 space-y-1">
                      {dataSubItems.map((subItem, subIndex) => {
                        const isSubActive =
                          pathName === subItem.href ||
                          (pathName.startsWith(subItem.href) &&
                            subItem.href !== "/");

                        return (
                          <li key={subIndex}>
                            <Link
                              href={subItem.href}
                              className={`flex items-center px-3 py-2 ml-6 text-sm rounded-lg transition-colors duration-200 ${
                                isSubActive
                                  ? "bg-blue-100 text-blue-700 border-l-2 border-blue-600"
                                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                              }`}
                              onClick={closeSidebarOnMobile}
                            >
                              <span className="flex-shrink-0">
                                {subItem.icon}
                              </span>
                              <span className="ml-3 font-medium">
                                {subItem.name}
                              </span>
                              {isSubActive && (
                                <span className="ml-auto w-1 h-4 bg-blue-600 rounded-full" />
                              )}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </li>
              ) : null}

              {menuItems.map((item, index) => {
                const isActive =
                  pathName === item.href ||
                  (pathName.startsWith(item.href) && item.href !== "/");

                return (
                  item.role.includes(role as string) && (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className={`flex items-center px-3 py-2.5 text-sm rounded-lg transition-colors duration-200 ${
                          isActive
                            ? "bg-blue-600 text-white"
                            : "text-slate-700 hover:bg-slate-100"
                        }`}
                        onClick={closeSidebarOnMobile}
                      >
                        <span className="flex-shrink-0">{item.icon}</span>
                        <span className="ml-3 font-medium">{item.name}</span>
                        {isActive && (
                          <span className="ml-auto w-1 h-6 bg-white rounded-full" />
                        )}
                      </Link>
                    </li>
                  )
                );
              })}
            </ul>
          </nav>

          <div className="p-6 mt-auto border-t border-slate-100">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex-shrink-0 flex items-center justify-center text-slate-700 font-medium">
                {username ? (
                  username.charAt(0).toUpperCase()
                ) : (
                  <User className="w-5 h-5" />
                )}
              </div>
              <div className="ml-3 flex-1 overflow-hidden">
                <p className="text-sm font-medium text-slate-800 truncate">
                  {username || "User"}
                </p>
              </div>
              <form action={handleLogout}>
                <button
                  className="p-2 cursor-pointer bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 hover:text-slate-800 border border-slate-200 transition-colors duration-200"
                  title="Logout"
                  type="submit"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
