import { Link } from "react-router-dom";
import { AppContent } from "../context/AppContex";
import { useContext } from "react";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "./ui/resizable-navbar";
import { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";


export function OnlyNav() {
  const navigate = useNavigate()
  const handlelogout = async(e)=>{
    try{
      e.preventDefault();

      const {data} = await axios.post(backendurl+'/api/auth/logout')

        if(data.success){
          setisLoggedin(false);
          setuserData(false);
          navigate('/')
        }
        else{
          toast.error(data.message)
        }

    }catch(error){
      toast.error(error.message)
    }
  }
  
  const {userData, setuserData, isLoggedin, backendurl, setisLoggedin} = useContext(AppContent)
  // const {userData, setuserData, isLoggedin} = useContext(AppContent)
  const navItems = [
    {
      name: "About",
      link: "/about",
    },
    {
      name: "AI Assistant",
      link: "/chat",
    },
    {
      name: "Contact",
      link: "/contact",
    },
    ...(!userData.isAccountVerified && isLoggedin
      ? [
          {
            name: "VerifyEmail",
            link: "/email-verify",
          },
        ]
      : [])
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="invert w-fit rounded-full">
      <Navbar className={""}>
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            {/* <NavbarButton variant="secondary"> */}
              {/* <Link className="hover:translate-y-[-3px] rounded-lg transition px-5 py-1 mt-1 z-10  text-white" to={"/signin"}> */}
              {!isLoggedin && <Link className="px-4 py-2 rounded-md button text-white text-sm font-bold relative cursor-pointer hover:-translate-y-0.5 transition duration-200 inline-block text-center " to={"/signin"}>
              Login
              </Link>}
              {isLoggedin && <button onClick={handlelogout} className="px-4 py-2 rounded-md button text-white text-sm font-bold relative cursor-pointer hover:-translate-y-0.5 transition duration-200 inline-block text-center ">
              Logout
              </button>}
              {/* </NavbarButton> */}
              <Link className="px-4 py-2 rounded-md button bg-white text-black text-sm font-bold relative cursor-pointer hover:-translate-y-0.5 transition duration-200 inline-block text-center" to={"/guest"}>
              Explore
              </Link>

          </div>
        </NavBody>

        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
          </MobileNavHeader>

          <MobileNavMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
            {navItems.map((item, idx) => (
              <Link
                key={`mobile-link-${idx}`}
                to={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300">
                <span className="block">{item.name}</span>
              </Link>
            ))}
            <div className="flex w-full flex-col gap-4">
              {!isLoggedin && <Link
              to={"/signin"}
                className="px-4 py-2 rounded-md button bg-white text-black text-sm font-bold relative cursor-pointer hover:-translate-y-0.5 transition duration-200 inline-block text-center"
                >
                Login
              </Link>}
              <Link
                to={"/guest"}
                className="px-4 py-2 rounded-md button bg-white text-black text-sm font-bold relative cursor-pointer hover:-translate-y-0.5 transition duration-200 inline-block text-center"
                >
                Explore
              </Link>
              {isLoggedin && <button onClick={handlelogout} className="px-4 py-2 rounded-md button text-white text-sm font-bold relative cursor-pointer hover:-translate-y-0.5 transition duration-200 inline-block text-center ">
                Logout
              </button>}
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
      <div>

      </div>
    </div>
  );
}

