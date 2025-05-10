(() => {
  const init = () => {
    buildHTML();
    buildCSS();
    setEvents();
  };

  const buildHTML = () => {
    if (!PageUtils.onHomePage()) {
      console.log("wrong page");
      return;
    }
    Storage.read(CONFIG.storageKeys.products)
      .then(products => {
        Renderer.html(products);
      })
      .catch(err => console.error("Ürün yükleme hatası:", err));
  };

  const buildCSS = () => {
    Renderer.css();
  };

  const setEvents = () => {
    Storage.read(CONFIG.storageKeys.products)
      .then(products => {
        Events.bind(products);
      });
  };

  const CONFIG = {
    apiEndpoint: "https://gist.githubusercontent.com/sevindi/8bcbde9f02c1d4abe112809c974e1f49/raw/9bf93b58df623a9b16f1db721cd0a7a539296cf0/products.json",
    storageKeys: {
      products: "ebProductsData",
      favorites: "ebFavorites"
    },
    carouselSelectorPriority: [
      ".banner__titles",
      ".banner-bg",
      ".container",
      ".main-content",
      "main",
      "body"
    ]
  };

  const PageUtils = {
    onHomePage() {
      const p = location.pathname;
      return p === "/" || p.endsWith("/index.html");
    }
  };

  const Storage = {
    read(key) {
      return new Promise((resolve, reject) => {
        const cached = localStorage.getItem(key);
        if (cached) {
          try {
            return resolve(JSON.parse(cached));
          } catch (e) {
            localStorage.removeItem(key);
          }
        }
        fetch(CONFIG.apiEndpoint)
          .then(r => r.json())
          .then(data => {
            localStorage.setItem(key, JSON.stringify(data));
            resolve(data);
          })
          .catch(reject);
      });
    }
  };

  const Renderer = {
    css() {
      if (document.getElementById("eb-style")) return;
      const style = document.createElement("style");
      style.id = "eb-style";
      style.textContent = `
        .eb-carousel-container { max-width: 1200px; margin: 40px auto; position: relative; font-family: Poppins, sans-serif; }
        .eb-carousel-header { background: #fef6eb; padding: 25px 67px; border-radius: 35px 35px 0 0; display: flex; align-items: center; margin-bottom: 20px; }
        .eb-carousel-title { font: 700 3rem Quicksand; color: #f28e00; margin: 0; }
        @media(max-width: 768px) { .eb-carousel-title { font-size: 18px; } }
        .eb-carousel-track { overflow: hidden; position: relative; }
        .eb-carousel-stage { display: flex; transition: transform .25s ease; align-items: stretch; }
        .eb-carousel-slide { flex: 0 0 272.5px; margin-right: 20px; display: flex; flex-direction: column; }
        .eb-product-card { flex: 1; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, .08); display: flex; flex-direction: column; position: relative; border: 2px solid transparent; transition: border-color .3s; overflow: hidden; }
        .eb-product-card:hover { border-color: #f28e00; }
        .eb-image-wrap { width: 272.5px; height: 272.5px; overflow: hidden; position: relative; }
        .eb-image-wrap img { width: 100%; height: 100%; object-fit: contain; }
        .eb-product-full-link { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1; }
        .eb-fave-btn { position: absolute; top: 10px; right: 10px; width: 50px; height: 50px; border: none; border-radius: 50%; background: #fff; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0, 0, 0, .1); cursor: pointer; z-index: 2; }
        .eb-fave-btn img { width: 18px; height: 18px; }
        .eb-fave-btn.active img { display: none; }
        .eb-fave-btn.active .eb-heart-svg { display: block; }
        .eb-heart-svg { display: none; width: 25px; height: 25px; }
        .eb-content { padding: 0 17px; display: flex; flex-direction: column; flex: 1; position: relative; z-index: 1; }
        .eb-info { padding-top: 17px; height: 65px; overflow: hidden; }
        .eb-info .eb-title { font-size: 1.2rem; color: #7d7d7d; line-height: 1.22; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 3; overflow: hidden; }
        .eb-pricing { margin-top: auto; display: flex; flex-direction: column; position: relative; z-index: 1; }
        .eb-price-group { display: flex; align-items: center; margin-bottom: 4px; }
        .eb-old-price { color: #7d7d7d; text-decoration: line-through; font-size: 13px; margin-right: 6px; }
        .eb-discount-badge { background: #fff; color: #00a365; border-radius: 4px; padding: 0 4px; font-weight: 700; }
        .eb-new-price { font: 600 21px Poppins; }
        .eb-new-price.regular { color: #7d7d7d; }
        .eb-new-price.discounted { color: #00a365; }
        .eb-cart-btn { margin: 0 17px 17px; padding: 12px; border-radius: 37.5px; background: #fff7ec; color: #f28e00; font: 700 1.4rem Poppins; border: none; cursor: pointer; transition: .3s; position: relative; z-index: 1; }
        .eb-cart-btn:hover { background: #f28e00; color: #fff; }
        .eb-nav-arrow { position: absolute; top: 50%; transform: translateY(-50%); width: 48px; height: 48px; border-radius: 50%; background: #fff7ec; border: 1px solid transparent; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: .3s; z-index: 10; }
        .eb-nav-arrow:hover { background: #fff; border-color: #f28e00; }
        .eb-prev { left: -80px; }
        .eb-next { right: -80px; }
        .eb-nav-arrow svg { width: 34px; height: 34px; fill: #f28e00; }
        .eb-spacer { height: 60px; width: 100%; }
      `;
      document.head.appendChild(style);
    },

    html(products) {
      document.querySelectorAll(".eb-carousel-container, .eb-spacer").forEach(n => n.remove());
      const wrapper = document.createElement("div");
      wrapper.className = "eb-carousel-container";
      wrapper.innerHTML = `
        <div class="eb-carousel-header">
          <h2 class="eb-carousel-title">Beğenebileceğinizi düşündüklerimiz</h2>
        </div>
        <button class="eb-nav-arrow eb-prev">
          <svg viewBox="0 0 24 24"><path d="M15.41 7.41 14 6 8 12l6 6 1.41-1.41L10.83 12z"/></svg>
        </button>
        <div class="eb-carousel-track">
          <div class="eb-carousel-stage" id="eb-stage"></div>
        </div>
        <button class="eb-nav-arrow eb-next">
          <svg viewBox="0 0 24 24"><path d="M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
        </button>
      `;
      const stage = wrapper.querySelector("#eb-stage");
      const favs = JSON.parse(localStorage.getItem(CONFIG.storageKeys.favorites) || "[]");
      products.forEach(item => {
        const isFav = favs.includes(item.id);
        stage.appendChild(DOM.card(item, isFav));
      });
      stage.style.width = `${products.length * 292.5}px`;
      const anchor = CONFIG.carouselSelectorPriority.map(sel => document.querySelector(sel)).find(el => !!el) || document.body;
      anchor.parentNode.insertBefore(wrapper, anchor);
      const spacer = document.createElement("div");
      spacer.className = "eb-spacer";
      anchor.parentNode.insertBefore(spacer, anchor);
    }
  };

  const DOM = {
    card(data, fav) {
      const hasDiscount = data.original_price > data.price;
      const pct = hasDiscount ? Math.round((data.original_price - data.price) / data.original_price * 100) : 0;
      const container = document.createElement("div");
      container.className = "eb-carousel-slide";
      container.innerHTML = `
        <div class="eb-product-card" data-id="${data.id}">
          <a class="eb-product-full-link" href="${data.url}" target="_blank"></a>
          <div class="eb-image-wrap">
            <img src="${data.img}" alt="${data.name}">
            <button class="eb-fave-btn${fav ? " active" : ""}">
              <img src="assets/svg/${fav ? "added-favorite" : "default-favorite"}.svg">
              <svg class="eb-heart-svg" viewBox="0 0 24 24"><path fill="#f28e00" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09 C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5 c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            </button>
          </div>
          <div class="eb-content">
            <div class="eb-info"><span class="eb-title"><b>${data.brand}</b> ${data.name}</span></div>
            <div class="eb-pricing">
              ${hasDiscount
                ? `<div class="eb-price-group"><span class="eb-old-price">${data.original_price.toFixed(2)} TL</span><span class="eb-discount-badge">%${pct}</span></div><span class="eb-new-price discounted">${data.price.toFixed(2)} TL</span>`
                : `<span class="eb-new-price regular">${data.price.toFixed(2)} TL</span>`}
            </div>
          </div>
          <button class="eb-cart-btn">Sepete Ekle</button>
        </div>`;
      return container;
    }
  };

  const Events = {
    bind(products) {
      const stage = document.getElementById("eb-stage");
      const prev = document.querySelector(".eb-prev");
      const next = document.querySelector(".eb-next");
      if (!stage) return;

      let pos = 0;
      const step = 292.5;
      const maxPos = Math.max(0, products.length * step - stage.parentElement.clientWidth);

      function scrollTo(x) {
        pos = Math.max(0, Math.min(maxPos, x));
        stage.style.transform = `translateX(-${pos}px)`;
      }

      prev.addEventListener("click", () => scrollTo(pos - step));
      next.addEventListener("click", () => scrollTo(pos + step));

      let dragging = false, startX, startPos;

      stage.addEventListener("mousedown", e => {
        if (e.target.closest(".eb-fave-btn")) return;
        dragging = true;
        startX = e.pageX;
        startPos = pos;
        stage.style.transition = "none";
        e.preventDefault();
      });

      window.addEventListener("mousemove", e => {
        if (!dragging) return;
        scrollTo(startPos - (e.pageX - startX));
      });

      window.addEventListener("mouseup", () => {
        dragging = false;
        stage.style.transition = "";
      });

      document.querySelectorAll(".eb-fave-btn").forEach(btn => {
        btn.addEventListener("click", e => {
          e.stopPropagation();
          const id = +btn.closest(".eb-product-card").dataset.id;
          const favs = JSON.parse(localStorage.getItem(CONFIG.storageKeys.favorites) || "[]");
          const idx = favs.indexOf(id);

          if (idx < 0) {
            favs.push(id);
            btn.classList.add("active");
          } else {
            favs.splice(idx, 1);
            btn.classList.remove("active");
          }

          localStorage.setItem(CONFIG.storageKeys.favorites, JSON.stringify(favs));
          btn.querySelector("img").src = `assets/svg/${btn.classList.contains("active") ? "added-favorite" : "default-favorite"}.svg`;
        });
      });
    }
  };

  init();
})();
