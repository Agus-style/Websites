
    async function write(collection, doc, json) {
        return new Promise(async(resolve, reject) => {
            db.collection(collection).doc(doc).set(json, { merge: true })
            .then(()=>{ return resolve({ status: true, ...json }) })
            .catch((e) =>{ return reject({ status: false, msg: e }) })
        })
    }
    module.exports.writeDB = write

    async function read(collection, doc) {
        return new Promise(async(resolve, reject) => {
            await db.collection(collection).doc(doc).get().then(doc => {
                return resolve(doc.data())
            }).catch((e) => { return reject({ status: false, msg: e })})
        })
    }

    module.exports.readDB = read