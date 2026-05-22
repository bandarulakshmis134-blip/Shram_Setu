import {
  memo,
  useCallback,
  useMemo,
} from "react";

import {
  useNavigate,
  NavLink,
} from "react-router-dom";

import { useTranslation } from "react-i18next";

import { Logo } from "./Logo";

import LanguageSwitcher from "./LanguageSwitcher";

import {

  HomeIcon,
  SearchIcon,
  JobsIcon,
  DashboardIcon,
  MessageIcon,
  ProfileIcon,

} from "./icons/NavIcons";

const Navbar = () => {

  const navigate =
    useNavigate();

  const { t } =
    useTranslation();

  /*
  =========================
  SAFE USER PARSE
  =========================
  */

  const user = useMemo(() => {

    try {

      const storedUser =
        sessionStorage.getItem(
          "user"
        );

      if (

        !storedUser ||

        storedUser === "undefined"

      ) {

        return null;

      }

      return JSON.parse(
        storedUser
      );

    }

    catch {

      return null;

    }

  }, []);

  /*
  =========================
  LOGOUT
  =========================
  */

  const handleLogout =
    useCallback(() => {

      sessionStorage.removeItem(
        "user"
      );

      localStorage.removeItem(
        "token"
      );

      navigate("/");

    }, [navigate]);

  /*
  =========================
  NAV ITEMS
  =========================
  */

  const navItems = [

    {
      to: "/home",
      label: t("home"),
      Icon: HomeIcon,
    },

    {
      to: "/find-workers",
      label: t("findWorkers"),
      Icon: SearchIcon,
    },

    {
      to: "/post-jobs",
      label: t("postJob"),
      Icon: JobsIcon,
    },

    {
      to: "/dashboard",
      label: t("dashboard"),
      Icon: DashboardIcon,
    },

    {
      to: "/messages",
      label: t("messages"),
      Icon: MessageIcon,
    },

    {
      to: "/profile",
      label: t("profile"),
      Icon: ProfileIcon,
    },

  ];

  /*
  =========================
  ACTIVE CLASS
  =========================
  */

  const getNavClass =
    ({ isActive }) =>

      `
        flex items-center
        justify-center
        gap-2
        min-w-[100px]
        sm:min-w-[110px]
        px-2
        py-1
        text-sm
        font-medium
        whitespace-nowrap
        transition-colors duration-200

        ${

          isActive

            ? "text-blue-600"

            : "text-gray-700 hover:text-blue-600"

        }
      `;

  return (

    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">

      <div className="max-w-400 mx-auto px-3 sm:px-4 lg:px-8">

        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">

          {/* LOGO */}
          <div
            onClick={() =>
              navigate("/home")
            }
            className="flex items-center gap-2 cursor-pointer shrink-0"
          >

            <Logo className="w-7 h-7 sm:w-8 sm:h-8" />

            <h1
              className="
                text-xl
                sm:text-2xl
                lg:text-3xl
                font-bold
                text-gray-800
                whitespace-nowrap
              "
            >

              Shram{" "}

              <span className="text-blue-600">

                Setu

              </span>

            </h1>

          </div>

          {/* NAVIGATION */}
          <ul
            className="
              flex items-center
              flex-1
              gap-1 xl:gap-3
              overflow-x-auto
              scrollbar-hide
              px-1
            "
          >

            {navItems.map(
              (item) => (

                <li
                  key={item.to}
                  className="shrink-0"
                >

                  <NavLink
                    to={item.to}
                    className={
                      getNavClass
                    }
                  >

                    <item.Icon
                      size={16}
                    />

                    <span
                      className="
                        text-center
                        text-[11px]
                        sm:text-[13px]
                        xl:text-sm
                        leading-none
                      "
                    >

                      {item.label}

                    </span>

                  </NavLink>

                </li>

              )
            )}

          </ul>

          {/* RIGHT SIDE */}
          <div
            className="
              flex items-center
              gap-2 sm:gap-3
              shrink-0
            "
          >

            {/* LANGUAGE */}
            <LanguageSwitcher />

            {/* AUTH */}
            {user ? (

              <button

                onClick={
                  handleLogout
                }

                className="
                  border border-red-500
                  text-red-500
                  px-2 sm:px-4
                  py-1.5 sm:py-2
                  rounded-lg
                  text-xs sm:text-sm
                  font-medium
                  transition-all duration-200
                  hover:bg-red-500
                  hover:text-white
                  whitespace-nowrap
                "

              >

                Logout

              </button>

            ) : (

              <button

                onClick={() =>
                  navigate(
                    "/login"
                  )
                }

                className="
                  border border-blue-600
                  text-blue-600
                  px-2 sm:px-4
                  py-1.5 sm:py-2
                  rounded-lg
                  text-xs sm:text-sm
                  font-medium
                  transition-all duration-200
                  hover:bg-blue-600
                  hover:text-white
                  whitespace-nowrap
                "

              >

                Login

              </button>

            )}

          </div>

        </div>

      </div>

    </nav>

  );

};

export default memo(Navbar);