import { products } from '/data.js';


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
      <h2>${albumData.id}</h2>
      <h3>price: ${albumData.price}</h3>
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
}

window.addEventListener("load", loadEvent);