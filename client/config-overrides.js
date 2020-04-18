const { override, addLessLoader } = require('customize-cra')

module.exports = override(
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: { '@font-size-base': '18px' }
  })
)
