const Axios = require('axios');
const fs = require("fs")
const moveFile = require('move-file');

const baseUrl = process.argv[2]
const nbTome = 122;
const nbScan = 600;

let currentTome = 0;
async function launch() {
    for (currentTome = 1; currentTome <= nbTome; currentTome++) {
        console.log(`Download tome ${currentTome}...`);
        await downloadScan();
        console.log(`Tome ${currentTome} downloaded.`);
    }
}

async function request(currentScan) {
    const scanNumberFormat = ('00' + currentScan).substr(-2);
    const urlFile = `${baseUrl}/${currentTome}/${scanNumberFormat}.jpg`;

    return await Axios({
        url: urlFile,
        method: 'GET',
        responseType: 'stream'
    }).then(function (response){
        const fileName = `Tome - ${currentTome} | Scan - ${currentScan}.jpg`;
        const writer = fs.createWriteStream(fileName);
        response.data.pipe(writer);
        moveFiles(fileName, `Tome-${currentTome}`)
        return true;
    }).catch(function (error) {
        console.error(`Error getting scan: ${currentTome} - ${currentScan}`)
        console.error(`Go to next chapter.`)
        return false;
    });
}

async function downloadScan() {
    for (let currentScan = 1; currentScan <= nbScan; currentScan++) {
        const responseSuccess = await request(currentScan);
        if (!responseSuccess) {
            break;
        }
    }
}


function moveFiles(file, dest) {
    (async () => {
        await moveFile(`./${file}`, `./${dest}/${file}`);
        console.log(`The ${file} has been moved`);
    })();
}

launch();