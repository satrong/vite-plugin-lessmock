import { URL } from 'url'
import type { Plugin } from 'vite'
import { GenerateMock } from './generateMock'
import { findFile } from './util'

type TOptions = {
  /**
   * The directory to search for mock files.
   */
  mockDir: string;
  /**
   * Intercept api requests based on this prefix
   */
  apiPrefix: string;
  /**
   * @default TLessMock
   */
  useType?: string;
}

export default function lessMock (options: TOptions): Plugin {
  return {
    name: 'lessmock',
    async configureServer (server) {
      server.middlewares.use(async (req, res, next) => {
        const parse = new URL(req.url!, `http://${req.headers.host}`)
        if (req.url?.startsWith(options.apiPrefix)) {
          const p = parse.pathname.replace(options.apiPrefix, '')
          const filepath = await findFile(options.mockDir, (p.startsWith('/') ? '' : '/') + p, req.method!.toLowerCase())
          if (filepath) {
            const result = new GenerateMock(filepath).generate()
            res.write(JSON.stringify(result))
            res.end()
            return
          }
        }
        next()
      })
    }
  }
}
