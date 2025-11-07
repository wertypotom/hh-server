import moduleAlias from 'module-alias'
import path from 'path'

moduleAlias.addAliases({
  '@': path.join(__dirname),
  '@modules': path.join(__dirname, 'modules'),
  '@shared': path.join(__dirname, 'shared'),
  '@config': path.join(__dirname, 'shared/config'),
  '@middlewares': path.join(__dirname, 'shared/middlewares'),
  '@utils': path.join(__dirname, 'shared/utils'),
})
