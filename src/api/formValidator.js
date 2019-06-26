/**
 * @author Yuriy Matviyuk
 */

const validator = {
  /**
     * Types of validation
     */
  types: {
    entry: val => {
      return val ? '' : 'fieldCantBeEmpty'
    },
    email: val => {
      const re = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

      return re.test(String(val).toLowerCase()) ? '' : 'emailValidationError'
    },
    password: val => {
      let err = ''

      if (val.length < 6) {
        err = 'passMustContainMinSixSymbols'
      } else if (val.match(new RegExp(/([А-я])/))) {
        err = 'passCantContainCyrillic'
      } else if (val.match(new RegExp(/(\s)/))) {
        err = 'passCantContainSpaces'
      } else if (!val.match(new RegExp(/([0-9])/))) {
        err = 'passMustContainNumericSymbol'
      } else if (!val.match(new RegExp(/([A-Z])/))) {
        err = 'passMustContainCapitalLetter'
      }

      return err
    }
  },

  /**
     * Validate simple field dynamically
     *
     * @param el
     * @param setError
     */
  validateField (el, setError) {
    const value = el.value
    const data = el.dataset

    if (!data) {
      return
    }

    let validators = data.validate ? data.validate.split(',') : []

    validators.forEach(type => {
      const check = this.types[type]

      if (!check) {
        return
      }

      const target = data.target

      let err = {}

      if (target) {
        err[target] = check(value)
        setError(prevState => ({ ...prevState, ...err }))
      }
    })
  },

  /**
     * Validate form element
     *
     * @param form
     * @param callback
     */
  validateForm (form, callback) {
    const elements = form.querySelectorAll('.validate')

    let isValid = true

    if (!elements.length) {
      return isValid
    }

    elements.forEach(el => {
      const data = el.dataset

      if (!data) {
        return true
      }

      let validators = data.validate ? data.validate.split(',') : []

      validators.forEach(type => {
        const check = this.types[type]

        if (!check) {
          return true
        }

        let result = check(el.value)

        if (result && data.target) {
          callback(data.target, result)
          isValid = false
        }
      })
    })

    return isValid
  }
}

export default validator
