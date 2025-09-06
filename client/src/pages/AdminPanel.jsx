import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import { API_BASE_URL } from "../config/api";
import "../styles/AdminPanel.scss";

const AdminPanel = () => {
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  // Проверяем права админа
  useEffect(() => {
    console.log("AdminPanel - User:", user);
    console.log("AdminPanel - isAdmin:", user?.isAdmin);
    
    if (!user) {
      console.log("No user found, redirecting to login");
      navigate("/login");
    } else if (!user.isAdmin) {
      console.log("User is not admin, redirecting to home");
      navigate("/");
    }
  }, [user, navigate]);

  const getLots = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/lots`, {
        method: "GET",
      });
      const data = await response.json();
      setLots(data);
      setLoading(false);
    } catch (err) {
      console.log("Fetch Lots Failed", err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getLots();
  }, []);


  const handleDelete = async (lotId) => {
    if (!window.confirm("Вы уверены, что хотите удалить этот лот?")) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/lots/${lotId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Лот удален!");
        getLots(); // Обновить список лотов
      } else {
        alert("Ошибка при удалении лота");
      }
    } catch (err) {
      console.log("Delete Lot Failed", err.message);
      alert("Ошибка при удалении лота");
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <Navbar />
      
      <div className="admin-panel">
        <div className="admin-header">
        </div>

        <div className="lots-list">
          <div className="lots-header">
            <h2>Все лоты ({lots.length})</h2>
            <Link to="/admin/create-lot" className="create-lot-btn">
              Создать новый лот
            </Link>
          </div>
          <div className="lots-grid">
            {lots.map((lot) => (
              <div key={lot._id} className="lot-item">
                <img
                  src={lot.imageUrl.replace('public', '')}
                  alt={lot.title}
                />
                <div className="lot-info">
                  <h3>{lot.title}</h3>
                  <p>Текущая цена: {lot.currentPrice} ₽</p>
                  <p>Окончание: {(() => {
                    const endDate = new Date(lot.endDate);
                    console.log(`Lot ${lot.title} - Raw endDate:`, lot.endDate);
                    console.log(`Lot ${lot.title} - Parsed endDate:`, endDate);
                    console.log(`Lot ${lot.title} - Local string:`, endDate.toLocaleString());
                    return endDate.toLocaleString('ru-RU', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      timeZone: 'Europe/Moscow'
                    });
                  })()}</p>
                  <p>Статус: <span className={`status ${(() => {
                    const now = new Date();
                    const endDate = new Date(lot.endDate);
                    const isAuctionEnded = now > endDate;
                    return isAuctionEnded ? 'status-sold' : 'status-active';
                  })()}`}>
                    {(() => {
                      const now = new Date();
                      const endDate = new Date(lot.endDate);
                      const isAuctionEnded = now > endDate;
                      return isAuctionEnded ? 'Завершено' : 'Активный';
                    })()}
                  </span></p>
                </div>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(lot._id)}
                >
                  Удалить
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminPanel;
