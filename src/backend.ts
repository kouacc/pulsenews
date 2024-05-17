import PocketBase from 'pocketbase'
const pb = new PocketBase('http://127.0.0.1:8090')


// Copier ici les fonctions developpées en R214 | Système d'information

export async function getUser(username : string) {
  const record = await pb.collection('users').getOne(username)
  return record
}


export async function updateUser(tempUser, currentuser) {
  if (JSON.stringify(tempUser) !== JSON.stringify(currentuser)) {
    await pb.collection('users').update(`${currentuser.id}`, tempUser)
  } else {
    console.log('No changes')
  }
}
