import { IconButton } from "@mui/material";
import { Search } from "@mui/icons-material";
import variables from "../styles/variables.scss";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../styles/Navbar.scss";
import { Link, useNavigate } from "react-router-dom";
import { setLogout } from "../redux/state";

const Navbar = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(setLogout());
    navigate("/");
  };

  return (
    <div className="navbar">
      <Link to="/">Антиквариум</Link>

      <div className="navbar_search">
        <input
          type="text"
          placeholder="Search ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <IconButton disabled={search === ""}>
          <Search
            sx={{ color: variables.pinkred }}
            onClick={() => {
              navigate(`/properties/search/${search}`);
            }}
          />
        </IconButton>
      </div>

      <div className="navbar_right">
        {user ? (
          // Для авторизованных пользователей
          <div className="user_info">
            {user.isAdmin && (
              <Link to="/admin" className="admin_button">
                Управление лотами
              </Link>
            )}
            <span className="user_name">{user.username}</span>
            <button className="logout_button" onClick={handleLogout}>
              Выйти
            </button>
          </div>
        ) : (
          // Для неавторизованных пользователей
          <Link to="/login" className="login_button">
            Войти в аккаунт
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
