const querystring = require('querystring')
const axios = require('axios')
const defaultDebug = require('debug')('swingby')

// remove empty key value pairs from a map
function omitEmptyKVs(map) {
    let newMap = {}
    Object.keys(map).forEach((k) => {
        if (map[k]) {
            newMap[k] = map[k]
        }
    })
    return newMap
}

function sendGetRequest(endpoint) {
    return axios.get(endpoint)
        .then((res) => {
            if (res.status < 200 || res.status > 299) {
                return Promise.reject(new Error(res.data.message))
            }
            if (res.status === 429) {
                return Promise.reject(new Error(`received rate limit exception (429)`))
            }
            return res
        })
        .catch((err) => {
            return Promise.reject(new Error(`GET ${endpoint} (${err.response.status}) - ${err.response.data.message}`))
        })
}

function sendPostRequest(endpoint, payload) {
    console.log(payload)
    return axios({
        method: 'POST',
        url: endpoint,
        headers: {
            'Content-Type': 'application/json',
        },
        data: JSON.stringify(payload)
    })
    .then((res) => {
        if (res.status < 200 || res.status > 299) {
            return Promise.reject(new Error(res.data.message))
        }
        if (res.status === 429) {
            return Promise.reject(new Error(`received rate limit exception (429)`))
        }
        return res
    })
    .catch((err) => {
        return Promise.reject(new Error(`POST ${endpoint} (${err.response.status}) - ${err.response.data.message}`))
    })
}

class NodeHttpClient {

    /**
     * Initiate the Swingby http client
     * 
     * @param {object} options 
     * @param {string} options.url url path to swingby node
     * @param {object} options.debug debugger instace
     * @param {function} options.getHandler async GET request handling function
     * @param {function} options.postHandler async POST request handling function
     * @param {boolean} options.logTransport log GET and POST data
     * 
     */
    constructor(options = {}) {
        const {
            url,
            debug = defaultDebug,
            getHandler = sendGetRequest,
            postHandler = sendPostRequest
        } = options
        if (!url || typeof url !== 'string') {
            throw Exception(`Invalid url ${url} - please provide a url to a swingby node`)
        }

        this.getHandler = getHandler.bind(this)
        this.postHandler = postHandler.bind(this)
        this.url = url
        this.debug = debug
    }

    /**
     * Create a float deposit record
     * https://testnet-node.swingby.network/docs#operation/createFloat
     * 
     * @returns {object} flaot
     * @returns {string} float.amount
     * @returns {string} float.currency
     * @returns {string} float.hash
     * @returns {intger} float.nonce
     */
    createFloat() {
        const endpoint = `${this.url}/api/v1/floats/create`
        return Promise.reject(`API endpoint ${endpoint} not implemented`)
    }

    /**
     * Query all float records
     * https://testnet-node.swingby.network/docs#operation/queryFloats
     * 
     * @param {object} args
     * @param {string} args.hash Hash of the inbound float
     * @param {string} args.chain Currency (BTC, BNB ...)
     * @param {string} args.address Swap inbound address
     * @param {string} args.status Status of swap (pending | active | expired)
     * @param {integer} args.page_size Max number of items per page
     * @param {integer} args.page Page number
     * @param {integer} args.sort if sort = 1 then results are old - new
     * @param {string} args.OrInHash Hash of the inbound transaction (OR match)
     * @param {string} args.OrHash Hash of the outbound transaction (OR match)
     * @param {string} args.OrInAddress Swap inbound address (OR match)
     */
    queryFloats(args = {}) {
        const endpoint = `${this.url}/api/v1/floats/query`
        return Promise.reject(`API endpoint ${endpoint} not implemented`)
    }

    /**
     * Get the nodes TSS addresses
     * https://testnet-node.swingby.network/docs#operation/getAddresses
     * 
     * @returns {array} addresses
     * @returns {string} addresses[n].address
     * @returns {string} addresses[n].currency
     */
    getTssAddresses() {
        const endpoint = `${this.url}/api/v1/addresses`
        return this.getHandler(endpoint)
            .then((res) => res.data)
    }

    /**
     * Get a list of peers connected to the node
     * https://testnet-node.swingby.network/docs#operation/getPeers
     * 
     * @param {object} args
     * @param {string} args.type node type (signer | default: normal)
     * @returns {array} Node peers
     */
    getPeers(args = {}) {
        const query = querystring.stringify(omitEmptyKVs(args))
        const endpoint = `${this.url}/api/v1/peers?${query}`
        return this.getHandler(endpoint)
            .then((res) => res.data)
    }

    /**
     * Get all stakes on the network
     * https://testnet-node.swingby.network/docs#operation/getStakes
     * 
     * @returns {array} stakes
     * @returns {string} stakes.address
     * @returns {string} stakes.amount
     * @returns {string} stakes.stakeTxHash
     * @returns {integer} stakes.stakeTime
     * @returns {boolean} stakes.stakeValid
     */
    getStakes() {
        const endpoint = `${this.url}/api/v1/stakes`
        return Promise.reject(`API endpoint ${endpoint} not implemented`)
    }

    /**
     * Get node state and network metadata
     * https://testnet-node.swingby.network/docs#operation/getStatus
     * 
     * @returns {array} NodeStatus
     * @returns {object} NodeStatus.nodeInfo
     * @returns {object} NodeStatus.swapInfo
     */
    getStatus() {
        const endpoint = `${this.url}/api/v1/status`
        return this.getHandler(endpoint)
            .then((res) => res.data)
    }

    /**
     * Calculates the actual amount that the user will receive and fees for a given swap
     * https://testnet-node.swingby.network/docs#operation/calculateSwap
     * 
     * @param {object} args
     * @param {string} args.addressTo Payout address
     * @param {string} args.amount Amount of funds to swap
     * @param {string} args.currencyFrom Currency from (BTC, BNB ...)
     * @param {string} args.currencyTo Currency to (BTC, BNB ...)
     * 
     * @returns {object} swap
     * @returns {string} swap.currency_from
     * @returns {string} swap.currency_to
     * @returns {string} swap.fee
     * @returns {string} swap.receive_amount
     * @returns {string} swap.send_amount
     * @returns {integer} swap.nonce
     */
    calculateSwap(args = {}) {
        const endpoint = `${this.url}/api/v1/swaps/calculate`
        const payload = {
            address_to: args.addressTo,
            amount: args.amount,
            currency_from: args.currencyFrom,
            currency_to: args.currencyTo
        }
        return this.postHandler(endpoint, payload)
            .then((res) => res.data)
    }

    /**
     * Creates a swap record
     * https://testnet-node.swingby.network/docs#operation/createSwap
     * 
     * @param {object} args
     * @param {string} args.addressTo Payout address
     * @param {string} args.amount Amount of funds to swap
     * @param {string} args.currencyFrom Currency from (BTC, BNB ...)
     * @param {string} args.currencyTo Currency to (BTC, BNB ...)
     * @param {integer} args.nonce PoW nonce 
     * 
     * @returns {object} swap
     * @returns {string} swap.addressIn
     * @returns {string} swap.addressOut
     * @returns {string} swap.amountIn
     * @returns {string} swap.currencyIn
     * @returns {string} swap.currencyOut
     * @returns {integer} swap.timestamp
     */
    createSwap(args = {}) {
        const endpoint = `${this.url}/api/v1/swaps/create`
        const payload = {
            address_to: args.addressTo,
            amount: args.amount,
            currency_from: args.currencyFrom,
            currency_to: args.currencyTo,
            nonce: args.nonce
        }
        return this.postHandler(endpoint, payload)
            .then((res) => res.data)
    }

    /**
     * Calculates PoW and creates a swap record
     * @param {object} args
     * @param {string} args.addressTo Payout address
     * @param {string} args.amount Amount of funds to swap
     * @param {string} args.currencyFrom Currency from (BTC, BNB ...)
     * @param {string} args.currencyTo Currency to (BTC, BNB ...)
     * 
     * @returns {object} swap
     * @returns {string} swap.addressIn
     * @returns {string} swap.addressOut
     * @returns {string} swap.amountIn
     * @returns {string} swap.currencyIn
     * @returns {string} swap.currencyOut
     * @returns {integer} swap.timestamp
     * @returns {object} swap.calc response from calculateSwap
     */
    swap(args = {}) {
        // use calculateSwap for PoW nonce and then
        // pass into createSwap
        return this.calculateSwap(args)
            .then((res) => {
                return this.createSwap({
                    ...args,
                    amount: res.send_amount,
                    nonce: res.nonce
                })
                .then((swap) => {
                    return {
                        ...swap,
                        calc: res
                    }
                })
            })
    }

    /**
     * Get the fees for performing a swap
     * https://testnet-node.swingby.network/docs#operation/getSwapFees
     * 
     * @returns {array} fees
     * @returns {string} fees[n].bridgeFeePercent
     * @returns {string} fees[n].currency
     * @returns {string} fees[n].minerFee
     */
    getSwapFees() {
        const endpoint = `${this.url}/api/v1/swaps/fees`
        return this.getHandler(endpoint)
            .then((res) => res.data)
    }

    /**
     * https://testnet-node.swingby.network/docs#operation/queryTransactions
     * 
     * @param {object} args
     * @param {string} args.in_hash Hash of the inbound tx
     * @param {string} args.out_hash Hash of the outbound tx
     * @param {string} args.to_chain Currency (BTC, BNB ...)
     * @param {string} args.from_chain Currency (BTC, BNB ...)
     * @param {string} args.inAddress Swap inbound address
     * @param {string} args.outAddress Swap outbound address
     * @param {string} args.status Status of swap (pending | active | expired)
     * @param {integer} args.page_size Max number of items per page
     * @param {integer} args.page Page number
     * @param {integer} args.sort if sort = 1 then results are old - new
     * @param {string} args.orInHash Hash of the inbound transaction (OR match)
     * @param {string} args.orOutHash Hash of the outbound transaction (OR match)
     * @param {string} args.orHash Hash of the outbound transaction (OR match)
     * @param {string} args.orInAddress Swap inbound address (OR match)
     * @param {string} args.orOutAddress Swap outbound address (OR match)
     * @returns {object} swaps
     * @returns {integer} swaps.itemCount number of swaps in response
     * @returns {integer} swaps.total number of swaps in db
     * @returns {array} swaps.items
     */
    querySwaps(args = {}) {
        const params = {
            in_hash: args.inHash,
            out_hash: args.outHash,
            to_chain: args.toChain,
            from_chain: args.fromChain,
            in_address: args.inAddress,
            out_address: args.outAddress,
            status: args.status,
            page_size: args.pageSize,
            page: args.page,
            sort: args.sort,
            OR_in_hash: args.orInHash,
            OR_out_hash: args.orOutHash,
            OR_hash: args.orHash,
            OR_in_address: args.orInAddress
        }
        const query = querystring.stringify(omitEmptyKVs(params))
        const endpoint = `${this.url}/api/v1/swaps/query?${query}`
        return this.getHandler(endpoint)
            .then((res) => res.data)
    }

    /**
     * https://testnet-node.swingby.network/docs#operation/getSwapStats
     * 
     * @returns {object} stats
     * @returns {array} stats.network1mSwaps
     * @returns {array} stats.network1mSwapsVolume
     * @returns {array} stats.network24hrSwaps
     * @returns {array} stats.network24hrSwapsVolume
     * @returns {array} stats.networkRewards1mVolume
     * @returns {array} stats.networkRewards24hrVolume
     * @returns {number} stats.networkRewardsVolume
     * @returns {number} stats.networkSwaps
     * @returns {number} stats.networkSwapsVolume
     * @returns {array} stats.participated1mSwaps
     * @returns {array} stats.participated1mSwapsVolume
     * @returns {array} stats.participated24hrSwaps
     * @returns {array} stats.participated24hrSwapsVolume
     * @returns {number} stats.participatedSwaps
     * @returns {number} stats.participatedSwapsVolume
     * @returns {array} stats.rewards1mVolume
     * @returns {array} stats.rewards24hrVolume
     * @returns {number} stats.rewardsVolume
     */
    getSwapStats() {
        const endpoint = `${this.url}/api/v1/swaps/stats`
        return this.getHandler(endpoint)
            .then((res) => res.data)
    }
}

module.exports = NodeHttpClient