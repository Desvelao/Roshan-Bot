const fs = require('fs');
const path = require('path');
const jimp = require('jimp');
const { items, heroes } = require('dotaconstants');
const cwd = process.cwd();

const APIURL = 'https://cdn.cloudflare.steamstatic.com';
const folderHeroes = 'heroes';
const foldeMiniHeroes = 'miniheroes';
const folderItems = 'items';

const downloadAll = process.argv.includes('-all');
const destination = process.argv[2] || 'assets';
const timeWaitPromises = 1;

function main() {
  console.log('Config');
  console.log('Destination:', destination);
  console.log('DownloadAll:', downloadAll);
  console.log('---------------------------');
  const assets = [];
  const heroesOwned = assestsOwned(path.join(destination, folderHeroes));
  const miniHeroresOwned = assestsOwned(
    path.join(destination, foldeMiniHeroes)
  );
  const itemsOwned = assestsOwned(path.join(destination, folderItems));

  // Heroes
  assets.push(
    ...Object.entries(heroes)
      .map(([id, heroData]) => {
        const url = `${APIURL}${heroData.img}`.replace(/(\?t=.*)/, '');
        return {
          t: heroData.img,
          filename: path.basename(url).replace(/\?/g, '').replace('_full', ''),
          url,
          dest: path.join(destination, folderHeroes)
        };
      })
      .filter(filterDownload(heroesOwned))
  );

  // Heroes - icon
  assets.push(
    ...Object.entries(heroes)
      .map(([id, heroData]) => {
        const url = `${APIURL}${heroData.icon}`.replace(/(\?t=.*)/, '');
        return {
          filename: path.basename(url).replace('_icon', ''),
          url,
          dest: path.join(destination, foldeMiniHeroes)
        };
      })
      .filter(filterDownload(miniHeroresOwned))
  );

  /* If this fail, get the list of files and use some script with

  for value in "${files[@]}"
  do
    echo "Downloading $value"
    wget -O "$(basename $value)" $value
    echo "Downloaded $value"
    sleep 1;
  done
  
  */

  // Items
  assets.push(
    ...Object.keys(items)
      .map((item) => {
        const url = `${APIURL}${items[item].img}`.replace(/(\?t=.*)/, '');
        return {
          filename: path.basename(url).replace(/\?3/g, '').replace('_lg', ''),
          url,
          dest: path.join(destination, folderItems)
        };
      })
      .filter(filterDownload(itemsOwned))
  );

  if (assets.length > 0) {
    console.log(`>> ${assets.length} assets found`);
    console.log('---------------------------');
    reducePromiseTemp(timeWaitPromises)(assets).then((results) => {
      const message = !results.fail.length
        ? ''
        : `with ${results.fail.length} errors\n${results.fail
            .map((f) => `<${f.filename}> to [${f.dest}] in |<${f.url}>|`)
            .join('\n')}`;
      console.log(`>> Download Finished!${message}`);
      process.exit();
    });
  } else {
    console.log('Assets is up to date!');
  }
}

function reducePromiseTemp(time) {
  return function (array) {
    return array.reduce((promise, { filename, url, dest }) => {
      return promise.then(
        (results) =>
          new Promise((res) => {
            setTimeout(() => {
              const destPath = path.join(cwd, dest);
              console.log(
                `Filename: <${filename}> to [${destPath}] in |${url}|`
              );
              jimp
                .read(url)
                .then((data) =>
                  data.quality(100).write(path.join(destPath, filename))
                )
                .then(() => {
                  console.log('-> Downloaded:', path.join(dest, filename));
                  results.success.push({ dest, filename, url });
                  res(results);
                })
                .catch((err) => {
                  console.log('ERROR in', url, err);
                  results.fail.push({ dest, filename, url });
                  res(results);
                });
            }, time * 1000);
          })
      );
    }, Promise.resolve({ success: [], fail: [] }));
  };
}

function assestsOwned(dir) {
  return fs.readdirSync(path.join(cwd, dir));
}

function filterDownload(files) {
  return function (item, index) {
    return downloadAll ? true : !files.includes(item.filename);
  };
}

main();
