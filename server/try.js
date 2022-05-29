const translate = require('translate-google')

translate('நான் தூங்கி கொண்டிருக்கின்றேன்', {to: 'en'}).then(res => {
    console.log(res)
}).catch(err => {
    console.error(err)
})