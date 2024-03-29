import Vue from 'vue'

export const formatMixin = Vue.extend({
  filters: {
    formatNumberKM(val: number | null,
                   maximumFractionDigits: number = 3,
                   minimumFractionDigits: number = 2) {
      if (!val) {
        val = 0
      }

      let suffix = ''
      if (val > 1e6) {
        val /= 1e6
        suffix = 'M'
      } else if (val > 1e3) {
        val /= 1e3
        suffix = 'K'
      }

      const formatted = val.toLocaleString('en-US', {
        minimumFractionDigits,
        maximumFractionDigits
      })
      const formattedNoCommas = formatted.replaceAll(',', '')
      return formattedNoCommas + suffix
    },
    formatNumber(val: number | null,
                 maximumFractionDigits: number = 3,
                 minimumFractionDigits: number = 2) {
      if (!val) {
        val = 0
      }

      const formatted = val.toLocaleString('en-US', {
        minimumFractionDigits,
        maximumFractionDigits
      })
      return formatted.replaceAll(',', '')
    },
    formatPercent(val: number | null) {
      if (!val) {
        val = 0
      }

      // show extremely long percents as infinity
      if (val >= 1e9) {
        val = Infinity
      }

      const formatted = val.toLocaleString('en-US', {
        style: 'percent',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
      return formatted.replaceAll(',', '')
    }
  }
})