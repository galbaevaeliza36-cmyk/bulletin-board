
import { useState, type FormEvent } from 'react';
import './App.css';

const API_URL = 'https://inai-col1.fishrungames.com/ads';
const API_ORIGIN = 'https://inai-col1.fishrungames.com';

type Ad = {
  id?: number | string;
  title: string;
  description: string;
  price: number | string;
  image_url?: string;
};

function App() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [showAds, setShowAds] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Загрузка объявлений
  async function loadAds() {
    setShowAds(true);
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`);
      }

      const data = await response.json();

      const items: Ad[] = Array.isArray(data) ? data : data.items;

      if (!Array.isArray(items)) {
        throw new Error('Неверный формат данных');
      }

      setAds(items);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      setMessage('Не удалось загрузить объявления.');
      setAds([]);
    } finally {
      setLoading(false);
    }
  }

  // Добавление объявления
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setMessage('Публикация объявления...');

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`);
      }

      setMessage('Объявление успешно опубликовано!');
      form.reset();

      await loadAds();
    } catch (error) {
      console.error('Ошибка публикации:', error);
      setMessage('Не удалось опубликовать объявление.');
    }
  }

  // Удаление объявления сразу после нажатия
  async function deleteAd(id: number | string) {
    // Сохраняем текущий список на случай ошибки
    const previousAds = ads;

    // Сразу убираем объявление со страницы
    setAds((currentAds) =>
      currentAds.filter((ad) => String(ad.id) !== String(id))
    );

    setMessage('');

    try {
      const response = await fetch(
        `${API_URL}/${encodeURIComponent(String(id))}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`);
      }

      setMessage('Объявление удалено!');
    } catch (error) {
      console.error('Ошибка удаления:', error);

      // Возвращаем объявление, если сервер не удалил его
      setAds(previousAds);
      setMessage(
        'Не удалось удалить объявление на сервере. Попробуй ещё раз.'
      );
    }
  }

  return (
    <>
      <header>
        <h1> Доска объявлений</h1>
        <p>Размещайте и находите нужные объявления</p>
      </header>

      <main>
        <section className="form-section">
          <h2>Добавить объявление</h2>

          <form id="adForm" onSubmit={handleSubmit}>
            <label htmlFor="title">Название</label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Например: Продаю ноутбук"
              required
            />

            <label htmlFor="description">Описание</label>
            <textarea
              id="description"
              name="description"
              placeholder="Напишите описание товара"
              required
            />

            <label htmlFor="price">Цена</label>
            <input
              type="number"
              id="price"
              name="price"
              placeholder="Например: 45000"
              min="0"
              step="0.01"
              required
            />

            <label htmlFor="image">Изображение</label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
            />

            <button type="submit">Опубликовать объявление</button>
          </form>

          <p id="message" role="status">
            {message}
          </p>
        </section>

        <section className="ads-section">
          <div className="ads-header">
            <h2>Все объявления</h2>

            <button
              className="show-ads-button"
              type="button"
              onClick={loadAds}
            >
              {showAds ? 'Обновить объявления' : 'Посмотреть объявления'}
            </button>
          </div>

          {showAds && (
            <div id="adsList">
              {loading ? (
                <p>Загрузка объявлений...</p>
              ) : ads.length === 0 ? (
                <p>Объявлений пока нет.</p>
              ) : (
                ads.map((ad, index) => (
                  <article className="ad-card" key={ad.id ?? index}>
                    {ad.image_url && (
                      <img
                        src={
                          ad.image_url.startsWith('http')
                            ? ad.image_url
                            : `${API_ORIGIN}${ad.image_url}`
                        }
                        alt={ad.title}
                      />
                    )}

                    <h3>{ad.title}</h3>
                    <p>{ad.description}</p>

                    <div className="price">
                      {Number(ad.price).toLocaleString('ru-RU')} сом
                    </div>

                    {ad.id !== undefined && (
                      <button
                        type="button"
                        className="delete-button"
                        onClick={() => deleteAd(ad.id!)}
                      >
                         Удалить
                      </button>
                    )}
                  </article>
                ))
              )}
            </div>
          )}
        </section>
      </main>
    </>
  );
}

export default App;