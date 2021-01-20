const isFirefox = navigator.userAgent.toLowerCase().includes('firefox');

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
  const imageURL = albumArt.src.replace('_16.jpg', '_10.jpg');

  return imageURL;
}

async function writeToClipboard(commandList) {
  const result = await navigator.permissions.query({
    name: 'clipboard-write',
  });

  if (result.state == 'granted' || result.state == 'prompt') {
    try {
      await navigator.clipboard.writeText(commandList);
    } catch (err) {
      console.error(err);
      window.alert('Copying to clipboard failed, see console for details');

      return;
    }
  }
}

(async () => {
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

  if (isFirefox) {
    window.alert(coverImage);
  } else {
    await writeToClipboard(coverImage);
    window.alert(`Successfully copied cover image to clipboard`);
  }
})();
