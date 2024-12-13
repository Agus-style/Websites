const axios = require("axios");

const FormData = require("form-data");

const { fromBuffer } = require("file-type");

/**

 * Upload image to url

 * Supported mimetype:

 * - `image/jpeg`

 * - `image/jpg`

 * - `image/png`s

 * @param {Buffer} buffer Image Buffer

 */
var anu = async (buffer, name) => {
  const { ext, mime } = (await fromBuffer(buffer)) || {};

  const form = new FormData();

  form.append("file", buffer, { filename: `${name}`, contentType: mime });

  try {
    const { data } = await axios.post(
      "https://tmpfiles.org/api/v1/upload",
      form,
      {
        headers: form.getHeaders(),
      },
    );

    const match = /https?:\/\/tmpfiles.org\/(.*)/.exec(data.data.url);

    return { pageUrl: `https://tmpfiles.org/${match[1]}`, imageUrl: `https://tmpfiles.org/dl/${match[1]}` }
  } catch (error) {
    throw error;
  }
};

module.exports = anu