declare module 'express-xss-sanitizer' {
  function xss (): (req, res, next) => void
  export { xss }
}
