import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/CreateLot.scss";

const CreateLot = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startPrice: "",
    endDate: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  // Проверяем права админа
  React.useEffect(() => {
    console.log("CreateLot - User:", user);
    console.log("CreateLot - isAdmin:", user?.isAdmin);
    
    if (!user) {
      console.log("No user found, redirecting to login");
      navigate("/login");
    } else if (!user.isAdmin) {
      console.log("User is not admin, redirecting to home");
      navigate("/");
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      
      // Создаем превью изображения
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!selectedImage) {
      alert("Пожалуйста, выберите изображение");
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("startPrice", formData.startPrice);
      formDataToSend.append("endDate", formData.endDate);
      formDataToSend.append("creator", user._id);
      formDataToSend.append("image", selectedImage);

      const response = await fetch("http://localhost:3002/lots/create", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        alert("Лот успешно создан!");
        navigate("/admin");
      } else {
        const error = await response.json();
        alert("Ошибка: " + error.message);
      }
    } catch (err) {
      console.log("Create Lot Failed", err.message);
      alert("Ошибка при создании лота");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      
      <div className="create-listing">
        <div className="create-listing_content">
          <h1>Создать новый лот</h1>
          
          <form className="create-listing_form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Название лота:</label>
              <input
                type="text"
                name="title"
                placeholder="Например: Антикварные часы 19 века"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Описание:</label>
              <textarea
                name="description"
                placeholder="Подробное описание лота..."
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                required
              />
            </div>

            <div className="form-group">
              <label>Стартовая цена (₽):</label>
              <input
                type="number"
                name="startPrice"
                placeholder="1000"
                value={formData.startPrice}
                onChange={handleInputChange}
                min="1"
                required
              />
            </div>

            <div className="form-group">
              <label>Дата окончания торгов:</label>
              <input
                type="datetime-local"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Изображение лота:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
              />
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                </div>
              )}
            </div>

            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
            >
              {loading ? "Создание..." : "Создать лот"}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CreateLot;
