let { createElement } = require('react')

let { useSubscription } = require('../use-subscription')

/**
 * Decorator to add subscribe action on component mount and unsubscribe
 * on unmount.
 *
 * @param {subscriber} subscriber Callback to return subscribe action
 *                                properties according to component props.
 * @param {object} [opts] Redux options.
 * @param {Context} [opts.context] Context with the store.
 * @param {string} [opts.subscribingProp='isSubscribing'] Change default
 *                                                        `isSubscribing`
 *                                                        property.
 *
 * @return {function} Class wrapper.
 *
 * @example
 * import subscribe from '@logux/redux/subscribe'
 * class User extends React.Component { … }
 * export default subscribe(({ id }) => `user/${ id }`)(User)
 *
 * @example
 * import subscribe from '@logux/redux/subscribe'
 * class User extends React.Component { … }
 * const SubscribeUser = subscribe(props => {
 *   return { channel: `user/${ props.id }`, fields: ['name'] }
 * })(User)
 */
function subscribe (subscriber, opts = { }) {
  let subscribingProp = 'isSubscribing'
  if (opts.subscribingProp) subscribingProp = opts.subscribingProp

  return function (Wrapped) {
    function SubscribeComponent (ownProps) {
      let channels = subscriber
      if (typeof subscriber === 'function') channels = subscriber(ownProps)
      if (!Array.isArray(channels)) channels = [channels]
      let isSubscribing = useSubscription(channels, opts)
      let props = { ...ownProps }
      props[subscribingProp] = isSubscribing
      return createElement(Wrapped, props)
    }
    SubscribeComponent.WrappedComponent = Wrapped
    return SubscribeComponent
  }
}

module.exports = { subscribe }

/**
 * @callback subscriber
 * @param {object} props The component properties.
 * @return {string|Subscription} The subscription action properties.
 */

/**
 * Details for subscription action.
 * @typedef {object} Subscription
 * @property {string} channel The channel name.
 */
