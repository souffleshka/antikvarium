import { useEffect, useState } from "react";
import "../styles/ListingDetails.scss";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import Footer from "../components/Footer";

const LotDetails = () => {
  const [loading, setLoading] = useState(true);
  const [lot, setLot] = useState(null);
  const [bids, setBids] = useState([]);
  const [bidAmount, setBidAmount] = useState("");
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isAuctionEnded, setIsAuctionEnded] = useState(false);
  const [winnerInfo, setWinnerInfo] = useState(null);
  const [showWinnerNotification, setShowWinnerNotification] = useState(false);
  const [userBid, setUserBid] = useState(null);

  const { lotId } = useParams();
  const user = useSelector((state) => state.user);
  const isUserLoggedIn = Boolean(user);
  const navigate = useNavigate();

  const getLotDetails = async () => {
    try {
      const response = await fetch(
        `http://localhost:3002/lots/${lotId}`,
        {
          method: "GET",
        }
      );

      const data = await response.json();
      setLot(data);
      setLoading(false);
    } catch (err) {
      console.log("Fetch Lot Details Failed", err.message);
    }
  };

  const getBids = async () => {
    try {
      const response = await fetch(
        `http://localhost:3002/bids/lot/${lotId}`,
        {
          method: "GET",
        }
      );

      const data = await response.json();
      setBids(data);
    } catch (err) {
      console.log("Fetch Bids Failed", err.message);
    }
  };

  const getUserBid = async () => {
    if (!isUserLoggedIn) return;
    
    try {
      const response = await fetch(
        `http://localhost:3002/bids/user/${user._id}/lot/${lotId}`,
        {
          method: "GET",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUserBid(data);
      }
    } catch (err) {
      console.log("Fetch User Bid Failed", err.message);
    }
  };

  const endAuction = async () => {
    try {
      const response = await fetch(
        `http://localhost:3002/lots/${lotId}/end`,
        {
          method: "POST",
        }
      );

      const data = await response.json();
      
      if (data.winner) {
        const isUserWinner = user && data.winner.userId === user._id;
        setWinnerInfo({
          lotTitle: data.lot.title,
          winnerUsername: data.winner.username,
          finalPrice: data.winner.amount,
          isUserWinner: isUserWinner
        });
        setShowWinnerNotification(true);
        
        // Hide notification after 10 seconds
        setTimeout(() => {
          setShowWinnerNotification(false);
        }, 10000);
      }
      
      // Refresh lot details to get updated status
      getLotDetails();
    } catch (err) {
      console.log("End Auction Failed", err.message);
    }
  };

  const calculateTimeLeft = () => {
    if (!lot) return;
    
    const now = new Date().getTime();
    const endTime = new Date(lot.endDate).getTime();
    const difference = endTime - now;

    // Отладочная информация
    console.log("Current time:", new Date(now).toLocaleString());
    console.log("End time:", new Date(endTime).toLocaleString());
    console.log("Difference (ms):", difference);
    console.log("Lot status:", lot.status);

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
      setIsAuctionEnded(false);
    } else {
      // Time is up, end the auction if it's still active
      console.log("Time is up! Ending auction...");
      if (lot.status === "active" && !isAuctionEnded) {
        setIsAuctionEnded(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        endAuction();
      } else {
        setIsAuctionEnded(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }
  };

  useEffect(() => {
    getLotDetails();
    getBids();
    getUserBid();
  }, []);

  useEffect(() => {
    if (lot) {
      calculateTimeLeft();
      const timer = setInterval(calculateTimeLeft, 1000);
      return () => clearInterval(timer);
    }
  }, [lot]);

  const handleBidSubmit = async () => {
    if (!isUserLoggedIn) {
      navigate("/login");
      return;
    }

    if (!bidAmount || bidAmount <= lot.currentPrice) {
      alert("Ставка должна быть больше текущей цены!");
      return;
    }

    try {
      const response = await fetch("http://localhost:3002/bids/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lotId: lot._id,
          userId: user._id,
          amount: parseInt(bidAmount),
        }),
      });

      if (response.ok) {
        setBidAmount("");
        getLotDetails(); // Обновить текущую цену
        getBids(); // Обновить список ставок
        getUserBid(); // Обновить ставку пользователя
        alert("Ставка принята!");
      } else {
        const error = await response.json();
        alert(error.message);
      }
    } catch (err) {
      console.log("Submit Bid Failed.", err.message);
      alert("Ошибка при отправке ставки");
    }
  };

  const handleDeleteBid = async () => {
    if (!isUserLoggedIn || !userBid) return;

    if (!window.confirm("Вы уверены, что хотите удалить свою ставку?")) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3002/bids/user/${user._id}/lot/${lotId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setUserBid(null);
        getLotDetails(); // Обновить текущую цену
        getBids(); // Обновить список ставок
        alert("Ставка удалена!");
      } else {
        const error = await response.json();
        alert(error.message);
      }
    } catch (err) {
      console.log("Delete Bid Failed.", err.message);
      alert("Ошибка при удалении ставки");
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />

      {/* Winner Notification */}
      {showWinnerNotification && winnerInfo && (
        <div className={`winner-notification ${winnerInfo.isUserWinner ? 'winner-success' : 'winner-lost'}`}>
          <div className="notification-content">
            {winnerInfo.isUserWinner ? (
              <>
                <h3>🎉 Поздравляем! Вы выиграли!</h3>
                <p>
                  Товар <strong>"{winnerInfo.lotTitle}"</strong> продан вам за{" "}
                  <strong>{winnerInfo.finalPrice} ₽</strong>
                </p>
              </>
            ) : (
              <>
                <h3>😔 Торги завершены</h3>
                <p>
                  Товар <strong>"{winnerInfo.lotTitle}"</strong> продан пользователю{" "}
                  <strong>{winnerInfo.winnerUsername}</strong> за{" "}
                  <strong>{winnerInfo.finalPrice} ₽</strong>
                </p>
              </>
            )}
            <button 
              className="close-notification"
              onClick={() => setShowWinnerNotification(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="listing-details">
        <div className="title">
          <div className="title-left">
            <h1>{lot.title}</h1>
          </div>
          <div className="title-center">
            {/* Таймер по центру */}
            <div className="timer-section">
              {!isAuctionEnded ? (
                <div className="timer">
                  <h3>До окончания торгов:</h3>
                  <div className="time-display">
                    <span>{timeLeft.days}д </span>
                    <span>{timeLeft.hours}ч </span>
                    <span>{timeLeft.minutes}м </span>
                    <span>{timeLeft.seconds}с</span>
                  </div>
                </div>
              ) : (
                <div className={`auction-ended ${(() => {
                  const winner = bids.length > 0 ? bids[0] : null;
                  const isUserWinner = user && winner && winner.userId?._id.toString() === user._id.toString();
                  return isUserWinner ? 'winner' : 'loser';
                })()}`}>
                  {(() => {
                    // Определяем победителя по самой высокой ставке
                    const winner = bids.length > 0 ? bids[0] : null;
                    const isUserWinner = user && winner && winner.userId?._id.toString() === user._id.toString();
                    
                    return (
                      <>
                        <h3>Торги завершены!</h3>
                        {winner ? (
                          <p>Продано пользователю {winner.userId?.username || 'Неизвестный пользователь'} за {winner.amount} ₽</p>
                        ) : (
                          <p>Торги завершены без победителя</p>
                        )}
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
          <div className="title-right">
            {/* Пустое пространство справа */}
          </div>
        </div>

        <div className="lot-layout">
          {/* Левая часть - картинка по центру */}
          <div className="lot-image-section">
            <div className="photos">
              <img
                src={`http://localhost:3002/${lot.imageUrl.replace("public", "")}`}
                alt="lot photo"
              />
            </div>
          </div>

          {/* Правая часть - информация и топ ставок */}
          <div className="lot-info-section">
            {/* Информация о торгах */}
            <div className="auction-info">
              <h2>Текущая цена: <span className="price-amount">{lot.currentPrice} ₽</span></h2>
            </div>

            {/* Описание лота */}
            <div className="lot-description">
              <h3>Описание</h3>
              <p>{lot.description}</p>
            </div>

            {/* Ставка пользователя */}
            {userBid && (
              <div className="user-bid-section">
                <h3>Ваша ставка</h3>
                <div className="user-bid-info">
                  <span className="bid-amount">{userBid.amount} ₽</span>
                  {!isAuctionEnded && (
                    <button 
                      className="delete-bid-btn"
                      onClick={handleDeleteBid}
                    >
                      Удалить ставку
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Форма для ставки - показываем только если торги активны */}
            {!isAuctionEnded && (
              <div className="make-bid">
                <h2>Сделать ставку</h2>
                {isUserLoggedIn ? (
                  <div className="bid-form">
                    <input
                      type="number"
                      placeholder={`Минимум: ${lot.currentPrice + 1} ₽`}
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      min={lot.currentPrice + 1}
                    />
                    <button className="button" onClick={handleBidSubmit}>
                      СДЕЛАТЬ СТАВКУ
                    </button>
                  </div>
                ) : (
                  <p className="text-for-unauthorized-users">
                    Пожалуйста, <Link to="/login">войдите</Link> чтобы делать ставки.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Третья колонка - топ ставок */}
          <div className="top-bids-section">
            <div className="top-bids">
              <h2>Топ-10 ставок</h2>
              {bids.length > 0 ? (
                <div className="bids-list">
                  {bids.map((bid, index) => (
                    <div key={bid._id} className="bid-item">
                      <span className="bid-rank">#{index + 1}</span>
                      <span className="bid-user">{bid.userId?.username || 'Неизвестный пользователь'}</span>
                      <span className="bid-amount">{bid.amount} ₽</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Пока нет ставок</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default LotDetails;
