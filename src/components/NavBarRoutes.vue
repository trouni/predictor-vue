<script>
// Allows stubbing BaseLink in unit tests
const BaseLink = 'BaseLink'
const BaseIcon = 'BaseIcon'
export default {
  // Functional components are stateless, meaning they can't
  // have data, computed properties, etc and they have no
  // `this` context.
  functional: true,
  props: {
    routes: {
      type: Array,
      required: true,
    },
  },
  // Render functions are an alternative to templates
  render(h, { props }) {
    function getRouteAttr(route, attr) {
      return typeof route[attr] === 'function' ? route[attr]() : route[attr]
    }
    function processRoute(route) {
      Object.keys(route).forEach(
        attr => (route[attr] = getRouteAttr(route, attr))
      )
      return route
    }
    // Functional components are the only components allowed
    // to return an array of children, rather than a single
    // root node.
    return props.routes.map(route => (
      <BaseLink
        key={route.name}
        to={processRoute(route)}
        exact-active-class='text-black shadow-inner bg-gray-100 cursor-default leading-none'
        class='text-gray-600 flex-grow h-full no-underline'
      >
        <li class='flex h-full w-full items-center justify-center'>
          <BaseIcon name={route.fontAwesomeClass} />
        </li>
      </BaseLink>
    ))
  },
}
</script>
