const fs = require('fs/promises');
const path = require('path');

const cacheEncoding = 'utf8';
const maxCacheTimeMs = /*7 days*/7 * 24 * 60 * 60 * 1000;

exports.getProducts = async (adId, key) => {
    const jsonPath = path.join(__dirname, `../../localDataCache/${key}.json`);
    let fileData = await loadCachedResponse(jsonPath);
    console.log(`Retrieving products for partner ${key} (${adId})`);
    if (fileData && (new Date() - fileData.createdDate) < maxCacheTimeMs) {
        return fileData.cachedProducts;
    } else {
        console.log(`Cache invalid. ${(fileData) ? 'File is ' + ((new Date() - fileData.createdDate) / 1000) + ' seconds old.' : 'File does not exist.'} Calling API.`);
        let apiResponse = await CJAPI.queryProductsForAdId(adId);
        if (apiResponse) {
            writeResponseToCache(apiResponse, jsonPath);
            return apiResponse;
        }
        else if (fileData) {
            console.warn('Cached result is too old but API response is unavailable.');
            return fileData.cachedProducts;
        }
        else
            throw new Error('API call failed and no cache is available');
    }
};

const loadCachedResponse = async (jsonPath) => {
    try {
        let fileData = await fs.readFile(jsonPath, cacheEncoding);
        fileData = JSON.parse(fileData);
        fileData.createdDate = new Date(fileData.createdDate);
        return fileData;
    } catch (error) {
        console.error('Failed loading file with errors', error);
        return null;
    }
};

const writeResponseToCache = async (data, jsonPath) => {
    let cachedData = {
        cachedProducts: data,
        createdDate: new Date()
    }
    try {
        await fs.writeFile(jsonPath, JSON.stringify(cachedData), cacheEncoding);
    } catch (error) {
        console.error('Failed to write response to cache.', error);
    }
};