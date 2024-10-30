class CryptoPriceTracker {
    constructor(options = {}) {
        this.delayLoading = options.delay || 500;
        this.baseUrl = options.baseUrl || 'https://api.coinbase.com/v2/prices';
        this.cache = new Map();
        this.priceElementsMap = new Map();
        this.callbacks = new Set();
        this.intervalId = null;
    }

    initializeElements(selector = "span[id^='price-']") {
        this.priceElementsMap = new Map(
            Array.from(document.querySelectorAll(selector))
                .map(element => {
                    const [coin, currency] = element.id.replace("price-", "").split("-");
                    return [element.id, { element, coin: coin.toUpperCase(), currency: currency.toUpperCase() }];
                })
        );
        return this;
    }

    async fetchPrice(coin, currency) {
        const cacheKey = `${coin}-${currency}`;
        const url = `${this.baseUrl}/${cacheKey}/buy`;
        
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("Not found");
            const data = await response.json();
            const price = data.data.amount;
            this.cache.set(cacheKey, price);
            return price;
        } catch (error) {
            console.error(`Error for ${coin}:`, error);
            return this.cache.get(cacheKey) || "Not found";
        }
    }

    onPriceUpdate(callback) {
        this.callbacks.add(callback);
        return this;
    }

    offPriceUpdate(callback) {
        this.callbacks.delete(callback);
        return this;
    }

    async updatePrices() {
        const updates = [];
        for (const { element, coin, currency } of this.priceElementsMap.values()) {
            const price = await this.fetchPrice(coin, currency);
            element.textContent = price;
            updates.push({ coin, currency, price });
        }
        
        this.callbacks.forEach(callback => callback(updates));
        return updates;
    }

    start() {
        this.updatePrices();
        this.intervalId = setInterval(() => this.updatePrices(), this.delayLoading);
        return this;
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        return this;
    }

    getCachedPrice(coin, currency) {
        return this.cache.get(`${coin}-${currency}`);
    }

    clearCache() {
        this.cache.clear();
        return this;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CryptoPriceTracker;
}