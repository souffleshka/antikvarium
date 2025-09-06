import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { API_BASE_URL } from "../config/api";
import "../styles/HomePage.scss";

const HomePage = () => {
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userBids, setUserBids] = useState({});
  
  const user = useSelector((state) => state.user);

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

  const getUserBids = async () => {
    if (!user || lots.length === 0) return;
    
    try {
      const bids = {};
      for (const lot of lots) {
        try {
          const response = await fetch(`${API_BASE_URL}/bids/user/${user._id}/lot/${lot._id}`);
          if (response.ok) {
            const bid = await response.json();
            if (bid) {
              bids[lot._id] = bid;
            }
          }
        } catch (err) {
          console.log(`Failed to fetch bid for lot ${lot._id}:`, err);
        }
      }
      setUserBids(bids);
    } catch (err) {
      console.log("Fetch User Bids Failed", err.message);
    }
  };

  useEffect(() => {
    getLots();
  }, []);

  useEffect(() => {
    if (lots.length > 0 && user) {
      getUserBids();
    }
  }, [lots, user]);

  const calculateTimeLeft = (endDate, status) => {
    // Для проданных лотов не показываем время
    if (status === "sold") return "";
    
    const now = new Date().getTime();
    const endTime = new Date(endDate).getTime();
    const difference = endTime - now;

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      
      if (days > 0) return `${days}д ${hours}ч`;
      if (hours > 0) return `${hours}ч ${minutes}м`;
      if (minutes > 0) return `${minutes}м`;
      return "меньше минуты";
    }
    return "Завершено";
  };

  const isAuctionEnded = (endDate, status) => {
    const now = new Date().getTime();
    const endTime = new Date(endDate).getTime();
    return status !== "active" || now > endTime;
  };

  const getStatusText = (endDate, status) => {
    if (status === "sold") return "Продано";
    if (status === "cancelled") return "Отменен";
    return "Активен";
  };

  const getStatusClass = (endDate, status) => {
    if (status === "sold") return "status-sold";
    if (status === "cancelled") return "status-cancelled";
    if (isAuctionEnded(endDate, status)) return "status-ended";
    return "status-active";
  };


  return loading ? (
    <Loader />
  ) : (
    <div>
      <Navbar />
      
      <div className="homepage">
        <div className="hero-section">
          <h1>Аукцион антиквариата</h1>
          <p>Уникальные предметы старины и памятные вещи</p>
        </div>

        <div className="lots-section">
          <h2>Ближайшие торги</h2>
          <div className="lots-grid">
            {lots.map((lot) => {
              const ended = isAuctionEnded(lot.endDate, lot.status);
              return (
                <Link 
                  key={lot._id} 
                  to={`/lot/${lot._id}`} 
                  className={`lot-card ${ended ? 'ended' : ''}`}
                >
                  <div className="lot-image">
                    <img
                      src={lot.imageUrl.replace('public', '')}
                      alt={lot.title}
                    />
                  </div>
                  <div className="lot-info">
                    <div className={`status-badge ${getStatusClass(lot.endDate, lot.status)}`}>
                      {getStatusText(lot.endDate, lot.status)}
                    </div>
                    <h3>{lot.title}</h3>
                    <p className="current-price">{lot.currentPrice} ₽</p>
                    {userBids[lot._id] && (
                      <p className={`user-bid ${userBids[lot._id].amount >= lot.currentPrice ? 'bid-winning' : 'bid-losing'}`}>
                        Ваша ставка: {userBids[lot._id].amount} ₽
                      </p>
                    )}
                    {lot.status !== "sold" && (
                      <p className="time-left">
                        {calculateTimeLeft(lot.endDate, lot.status)}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;
