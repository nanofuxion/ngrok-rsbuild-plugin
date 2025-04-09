import type { DevConfig, RsbuildPlugin, ServerConfig } from '@rsbuild/core'
import { pluginQRCode } from '@lynx-js/qrcode-rsbuild-plugin';
import fs from 'fs'
import ngrok from 'ngrok';
import 'dotenv/config'

type Configs =  {
    server: ServerConfig;
    dev: DevConfig;

}

let nUrl = ''; // Define an empty variable to store the ngrok URL
const token = process.env.NGROK_TOKEN;

export const setServer = async (configs: ServerConfig): Promise<Configs> => {
    const {host, port } = configs;
    nUrl = await ngrok.connect({ proto: 'http', authtoken: token, addr: `${host}:${port}` });
    return {
        server: configs,
        dev: { assetPrefix: nUrl + '/assets/'}
    }
};

/**
 * Writes a string to a file asynchronously.
 * @param {string} filePath - The path to the file.
 * @param {string} content - The string content to write.
 */
function writeStringToFile(filePath: fs.PathOrFileDescriptor, content: string) {
    fs.appendFile(filePath, content + `\n\n`, 'utf8', (err) => {
      if (err) {
        console.error(`Error writing to file "${filePath}": ${err.message}`);
      } else {
        console.log(`File "${filePath}" has been written successfully.`);
      }
    });
}

const log = (...content: string[]) => {
    writeStringToFile('logs.txt', content.join(', '))
} 

export function pluginNgrok(options?: any): RsbuildPlugin {
    const defaultPluginOptions = {
        schema: (url: string) => ({ http: url }),
    };
    const { schema } = Object.assign({}, defaultPluginOptions, options);
    log('the schema is ', schema);
    return {
        name: 'lynx:rsbuild:ngrok',
        pre: ['lynx:rsbuild:api'],
        setup(api) {

            
            api.expose('lynx:rsbuild:ngrok', {
                ngrok_url: (() => { console.log("nurl is ", nUrl); return nUrl})(),
            })


            api.modifyRsbuildConfig((config) => {

                config.server ??= {}
                pluginQRCode({
                    schema(url) { 
                        return schema(token ? nUrl : url)
                    }
                }).setup(api)

            })
        },
    };
}
