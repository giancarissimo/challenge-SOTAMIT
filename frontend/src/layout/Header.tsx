import { useUserStore } from "@/store/userStore";
import { Link } from "react-router-dom";

const Header = () => {
  const { user } = useUserStore();

  return (
    <header className="mt-6 w-full sticky top-0 flex justify-between items-center">
      <Link to='/'>
        <button className="cursor-pointer hover:text-gray-300 transition-colors duration-150">Challenge SOTAMIT</button>
      </Link>
      <nav>
        <ul className="flex justify-evenly items-center gap-3">
          {
            !user ? (
              <>
                <li><Link to='login' className="cursor-pointer hover:text-gray-300 transition-colors duration-150">Sign in</Link></li>
                <li><Link to='register' className="cursor-pointer hover:text-gray-300 transition-colors duration-150">Sign up</Link></li>
              </>
            ) : (
              <>
                {
                  user.role === 'admin' && <li><Link to='/users' className="cursor-pointer hover:text-gray-300 transition-colors duration-150">Users</Link></li>
                }
                <li><Link to='/profile' className="cursor-pointer hover:text-gray-300 transition-colors duration-150">Account</Link></li>
              </>
            )
          }
        </ul>
      </nav>
    </header>
  );
};

export default Header;
