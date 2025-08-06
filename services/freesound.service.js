const axios = require('axios');
const config = require('../config/bot.config');

class FreeSoundService {
    async searchMeditation() {
        try {
            const { data } = await axios.get('https://freesound.org/apiv2/search/text/', {
                params: {
                    query: 'meditation',
                    filter: 'duration:[60 TO 300]',
                    fields: 'id,name,previews,username,license',
                    token: config.freesoundApiKey
                },
                timeout: 10000
            });
            return data;
        } catch (error) {
            console.error('FreeSound API error:', error);
            throw error;
        }
    }
}

module.exports = new FreeSoundService();