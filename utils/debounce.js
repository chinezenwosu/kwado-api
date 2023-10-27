const debounce = {
	isWaiting: false,

	submit: function (func, timeout = 1000) {
		if (!this.isWaiting) {
			this.isWaiting = true

			setTimeout(() => {
				func.apply()
				this.isWaiting = false
			}, timeout)
		}
	},
}

const debounceDelay = {
	timerId: 0,

	submit: function (func, timeout = 1000) {
		this.cancel()

		this.timerId = setTimeout(() => {
			func.apply(this)
		}, timeout)
	},

	cancel: function () {
		clearTimeout(this.timerId)
	},
}

exports.debounce = debounce
exports.debounceDelay = debounceDelay
