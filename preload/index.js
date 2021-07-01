import Nzh from 'nzh'

const getDigitConvertList = (numStr) => {
  const isQian = numStr.includes(',')
  if (isQian) numStr = numStr.replace(/,/g, '')
  const list = [{
    title: Nzh.cn.toMoney(numStr, { outSymbol: false }),
    description: '复制 - 人民币大写',
    icon: 'yuan.png'
  }]
  if (!isQian && numStr.split('.')[0].length > 3) {
    list.push({
      title: numStr.replace(/\d+/, s => s.replace(/(\d)(?=(\d{3})+$)/g, '$1,')),
      description: '复制 - 人民币千分位',
      icon: 'yuan.png'
    })
  }
  return list
}

window.exports = {
  rmb: {
    mode: 'list',
    args: {
      placeholder: '输入阿拉伯数字',
      search: (action, searchWord, callbackSetList) => {
        if (!searchWord) return callbackSetList([])
        if (!/\d{1,15}(?:\.\d{1,2})?|\d{1,3}(?:,\d{3}){1,4}/.test(searchWord)) {
          return callbackSetList([])
        }
        callbackSetList(getDigitConvertList(searchWord))
      },
      select: (action, itemData) => {
        window.utools.hideMainWindow()
        window.utools.copyText(itemData.title)
        window.utools.outPlugin()
      }
    }
  },
  converter: {
    mode: 'list',
    args: {
      enter: (action, callbackSetList) => {
        if (/^\d/.test(action.payload)) {
          callbackSetList(getDigitConvertList(action.payload.trim()))
        } else {
          const num = Nzh.cn.decodeB(action.payload)
          if (typeof num !== 'number') return
          const list = [{
            title: num.toString(),
            description: action.payload,
            icon: 'yuan.png'
          }]
          if (num > 1000) {
            list.push({
              title: num.toString().replace(/\d+/, s => s.replace(/(\d)(?=(\d{3})+$)/g, '$1,')),
              description: '复制 - 人民币千分位',
              icon: 'yuan.png'
            })
          }
          callbackSetList(list)
        }
      },
      select: (action, itemData) => {
        window.utools.hideMainWindow()
        window.utools.copyText(itemData.title)
        window.utools.outPlugin()
      }
    }
  }
}
