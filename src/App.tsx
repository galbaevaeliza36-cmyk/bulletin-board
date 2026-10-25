import { useState } from 'react';
import './App.css';

type Ad = {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
};

function App() {
  const [ads, setAds] = useState<Ad[]>(() => {
    const savedAds = localStorage.getItem('ads');

    if (savedAds) {
      return JSON.parse(savedAds) as Ad[];
    }

    return [
      {
        id: 1,
        title: 'Ноутбук Lenovo',
        description: 'Хороший ноутбук для учёбы.',
        price: 35000,
        category: 'Электроника',
      },
      {
        id: 2,
        title: 'Квартира в Бишкеке',
        description: 'Уютная квартира в центре города.',
        price: 45000,
        category: 'Недвижимость',
      },
    ];
  });

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Электроника');
  const [search, setSearch] = useState('');

  function saveAds(newAds: Ad[]) {
    setAds(newAds);
    localStorage.setItem('ads', JSON.stringify(newAds));
  }

  function addAd(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const newAd: Ad = {
      id: Date.now(),
      title: title,
      description: description,
      price: Number(price),
      category: category,
    };

    saveAds([...ads, newAd]);

    setTitle('');
    setDescription('');
    setPrice('');
    setCategory('Электроника');
  }

  function deleteAd(id: number) {
    const newAds = ads.filter((ad) => ad.id !== id);
    saveAds(newAds);
  }

  const filteredAds = ads.filter((ad) =>
    ad.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <header>
        <h1> Доска объявлений</h1>
        <p>Добавляй, просматривай и удаляй объявления</p>
      </header>

      <section className="form-section">
        <h2>Добавить объявление</h2>

        <form onSubmit={addAd}>
          <input
            type="text"
            placeholder="Название объявления"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />

          <textarea
            placeholder="Описание объявления"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Цена в сомах"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            min="1"
            required
          />

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option>Электроника</option>
            <option>Недвижимость</option>
            <option>Работа</option>
            <option>Одежда</option>
            <option>Другое</option>
          </select>

          <button type="submit">Добавить объявление</button>
        </form>
      </section>

      <section className="ads-section">
        <h2>Все объявления ({filteredAds.length})</h2>

        <input
          className="search"
          type="text"
          placeholder="Найти объявление..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <div className="ads-list">
          {filteredAds.map((ad) => (
            <article className="ad-card" key={ad.id}>
              <h3>{ad.title}</h3>

              <p>{ad.description}</p>

              <p>
                <strong>Категория:</strong> {ad.category}
              </p>

              <p className="price">
                {ad.price.toLocaleString('ru-RU')} сом
              </p>

              <button
                className="delete-button"
                onClick={() => deleteAd(ad.id)}
              >
                Удалить
              </button>
            </article>
          ))}

          {filteredAds.length === 0 && (
            <p>Объявлений пока нет.</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default App;