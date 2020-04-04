const Stripe = require("../lib/stripe")
module.exports = {
  // eslint-disable-next-line consistent-return
  async create3dPayment(req, res) {
    try {
      const amount = 1
      const customerId = process.env.CUSTOMER// put an customer id here example: cus_xxxxxxxxxxxxxx
      const paymentIntent = await Stripe.createPaymentIntent(customerId, amount)
      const paymentCards = await Stripe.getCards(customerId)
      const customer = await Stripe.getCustomer(customerId)

      const defaultCard = paymentCards.data.find(element => String(element.id) === String(customer.default_source))
      const otherCards = paymentCards.data.filter(element => String(element.id) !== String(customer.default_source))

      res.render("checkout", {
        client_secret: paymentIntent.client_secret,
        publicKey: process.env.STRIPE_PKEY_TF_TEST,
        defaultCard,
        otherCards
      })
    } catch (error) {
      return res.status(400).json({
        error: true,
        reason: error.message
      })
    }
  }

}
