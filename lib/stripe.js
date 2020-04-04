const Stripe = require("stripe")

module.exports = {
  getCurrentEnvironment() {
    if (process.env.ENVIRONMENT === "production") {
      return process.env.STRIPE_KEY_TF_PROD
    }
    return process.env.STRIPE_KEY_TF_TEST
    // return process.env.STRIPE_KEY_PB_TEST
  },

  createPaymentIntent(stripeCustomerId, amount) {
    return new Promise(async (resolve, reject) => {
      try {
        const stripe = Stripe(this.getCurrentEnvironment())
        const amountInCents = Number(Number(amount * 100).toFixed(2))
        const stripeResponse = await stripe.paymentIntents.create(
          {
            amount: amountInCents,
            currency: "usd",
            customer: stripeCustomerId,
            transfer_data: {
              amount: amountInCents* .8,
              destination: process.env.INFLUENCER // put an account id here example: acct_xxxxxxxxxxxxxx
            }
          })
        resolve(stripeResponse)
      } catch (err) {
        reject(err)
      }
    })
  },

  getPaymentMethods(stripeCustomerId) {
    return new Promise(async (resolve, reject) => {
      try {
        const stripe = Stripe(this.getCurrentEnvironment())
        const stripeResponse = await stripe.paymentMethods.list({customer: stripeCustomerId, type: 'card'})
        resolve(stripeResponse)
      } catch (err) {
        reject(err)
      }
    })
  },

  getCards(stripeCustomerId) {
    return new Promise(async (resolve, reject) => {
      try {
        const stripe = Stripe(this.getCurrentEnvironment())
        const stripeResponse = await stripe.customers.listSources(stripeCustomerId, {object: 'card', limit: 3})
        resolve(stripeResponse)
      } catch (err) {
        reject(err)
      }
    })
  },

  getCustomer(stripeCustomerId) {
    return new Promise(async (resolve, reject) => {
      try {
        const stripe = Stripe(this.getCurrentEnvironment())
        const stripeResponse = await stripe.customers.retrieve(stripeCustomerId)
        resolve(stripeResponse)
      } catch (err) {
        reject(err)
      }
    })
  }
}