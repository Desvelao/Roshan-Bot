// Get the locales from .xlsx file and save each locale in .json file
(function (){
    const path = require('path')
    const fs = require('fs')
    const xlsx = require('xlsx')

    const wb = xlsx.readFile(path.join(__dirname,'../locale/locale.xlsx'))

    const locales = {}
    const languages = []
    // Get locales from .xlsx file
    xlsx.utils.sheet_to_json(wb.Sheets.locale).forEach((row, index)=> {
        if(index === 0){
            const langs = Object.keys(row).filter(key => key !== 'langkey')
            langs.forEach(language => {
                locales[language] = {}
                languages.push(language)
            })
        }else{
            languages.forEach(language => {
                locales[language][row['langkey']] = row[language] || ''
            })
        }
    })

    // Save localtes to files
    languages.forEach(language => {
        fs.writeFile(path.join(__dirname,'../locales', `${language}.json`), JSON.stringify(locales[language], null, 4), function(err) {
            if(err) {
              console.log(err);
            } else {
              console.log("JSON saved to " + path.join(__dirname,'../locales', `${language}.json`));
            }
        }); 
    })
})()