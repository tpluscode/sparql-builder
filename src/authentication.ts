export default (user: string, password: string) => {
  return `Basic ${Buffer.from(`${user}:${password}`).toString('base64')}`
}
