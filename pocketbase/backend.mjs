import PocketBase from 'pocketbase'

const pb = new PocketBase('http://127.0.0.1:8090')

try {
  const fullList = await pb.collection('users').getFullList()
  console.log(fullList)
} catch (e) {
  console.error(e)
}