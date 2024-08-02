import { products } from '/data.js';
const favorites = [];

const divElement = (content) => {
  return `<div>${content}</div>`;
}

const trackElement = (trackData) => {
  return divElement(`
    <p>track name: ${trackData.name}</p>
    <p>composer: ${trackData.composer}</p>
    <p>length: ${convertMsToTime(trackData.milliseconds)}</p>
  `)
}

const tracksElement = (tracksArray) => {
  return tracksArray.map(track => trackElement(track)).join("");
}

const albumDivElement = (content) => {
  return `<div class="album">${content}</div>`;
}

const albumElement = (albumData) => {
  const tracksHtml = tracksElement(albumData.details);

  return albumDivElement(`
      <h2 class="album-id">${albumData.id}</h2>
      <h3>price: ${albumData.price}</h3>
      <button class="album-${albumData.id}">+</button>
      <p class="album-name">album name: ${albumData.name}</p>
      ${divElement(tracksHtml)}
    `);
}

const vendorElement = (vendorName, albumsHtml) => {
  return `
    <section>
      <h2>${vendorName}</h2>
      <div class="albums">
        ${albumsHtml}
      </div>
    </section>
  `
}

const convertMsToTime = (ms) => {
  let seconds = Math.round(ms / 1000);
  let minutes = Math.floor(seconds / 60);
  seconds -= minutes * 60;
  let hours = Math.floor(minutes / 60);
  minutes -= hours * 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().length < 2 ? `0${seconds}` : seconds}`
}

const loadEvent = function () {
  let albumsGroupedByVendorName = {};
  albumsGroupedByVendorName = products
    .filter(album => album.price >= 1000)
    .sort((a, b) => a.price - b.price)
    .reduce((acc, curr) => {
      acc[curr.vendor.name] ? acc[curr.vendor.name].push(curr) : acc[curr.vendor.name] = [curr]
      return acc
    }, {})

  const rootElement = document.querySelector("#root");

  for (const vendorName in albumsGroupedByVendorName) {
    const vendorAlbumsHtml = albumsGroupedByVendorName[vendorName]
      .map(album => albumElement(album))
      .join("");

    rootElement.insertAdjacentHTML("beforeend", vendorElement(vendorName, vendorAlbumsHtml));
  }

  const buttonElements = document.querySelectorAll("button");
  buttonElements.forEach(button => button.addEventListener("click", () => {
    /* const h2Element = button.parentElement.querySelector("h2.album-id");
    const albumObj = products.find(album => album.id === Number(h2Element.textContent));
    console.log(albumObj); */

    // console.log(button.classList[0].substring(6))
    const albumId = Number(button.classList[0].substring(6));
    const albumObj = products.find(album => album.id === albumId);
    if (button.textContent === "+") {
      favorites.push(albumObj);
      button.textContent = "-";
    } else {
      const albumIndex = favorites.findIndex(album => album.id === albumId);
      favorites.splice(albumIndex, 1);
      button.textContent = "+";
    }
    console.log(favorites);
  }));
}

window.addEventListener("load", loadEvent);