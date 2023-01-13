const validOrigins = {
  bandcamp: 'https://bandcamp.com',
  instagram: 'https://instagram.com',
  mixcloud: 'https://mixcloud.com',
  soundcloud: 'https://soundcloud.com',
  youtube: 'https://youtube.com',
};

function getSoundcloudImage() {
  const albumArt =  document.querySelector('.fullHero__artwork .image span');
  const backgroundImage = albumArt.style.backgroundImage.split('"')[1];
  const imageURL = backgroundImage.replace(/t500x500/g, 'original');

  return imageURL;
}

function getMixcloudImage() {
  const albumArt = document.querySelector('.album-art img');
  const lastImage = albumArt.srcset.split(',').pop();
  const imageURL = lastImage.split(' ').shift();

  return imageURL;
}

function getInstagramImage() {
  const albumArt = document.querySelector('[style^="padding-bottom"] img');
  const lastImage = albumArt.srcset.split(',').pop();
  const imageURL = lastImage.split(' ').shift();

  return imageURL;
}

function getYoutubeImage() {
  let { groups } = window.location.href.match(/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?(?<id>[^#&?]*)/);


  return groups.id
    ? `http://i3.ytimg.com/vi/${groups.id}/maxresdefault.jpg`
    : null;
}

function getBandcampImage() {
  const albumArt = document.querySelector('#tralbumArt .popupImage img');
  const imageURL = albumArt.src.replace('900x900/', '').replace('_16.jpg', '_0.jpg');

  return imageURL;
}

async function writeToClipboard(coverImage) {
  try {
    await navigator.clipboard.writeText(coverImage);
  } catch (err) {
    console.error(err);
  }
}

(async () => {
  window.focus();

  const origin = window.location.origin.replace('//www.', '//');
  let coverImage = '';

  switch (origin) {
    case validOrigins.instagram:
      coverImage = getInstagramImage()
      break;

    case validOrigins.mixcloud:
    case validOrigins.wwwMixcloud:
      coverImage = getMixcloudImage()
      break;

    case validOrigins.soundcloud:
      coverImage = getSoundcloudImage()
      break;

    case validOrigins.youtube:
      coverImage = getYoutubeImage()
      break;

    default:
      if (origin.endsWith('.bandcamp.com')) {
        coverImage = getBandcampImage()
        break;
      }

      window.alert(`This bookmarklet does not support ${origin}`);
      return;
  }

  if (!coverImage) return;

  await writeToClipboard(coverImage);
  window.open(coverImage);
})();
