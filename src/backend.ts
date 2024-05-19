import PocketBase from 'pocketbase'
const pb = new PocketBase('http://127.0.0.1:8090')


// Copier ici les fonctions developpées en R214 | Système d'information

export async function getUser(username : string ) {
  const record = await pb.collection('users').getOne(username)
  return record
}

export async function createUser(user) {
  await pb.collection('users').create(user)
  await pb.collection('users').requestVerification(user.email)
  return true
}

export async function updateUser(tempUser, currentuser) {
  if (JSON.stringify(tempUser) !== JSON.stringify(currentuser)) {
    await pb.collection('users').update(`${currentuser.id}`, tempUser)
    return true
  } else {
    console.log('No changes')
  }
}

export async function deleteUser(userid) {
  await pb.collection('users').delete(userid)
  return true
}

export async function getAuthMethods(userid) {
  const result = await pb.collection('users').listExternalAuths(userid)
  return result
}

export async function unlinkOAuth(userid) {
  await pb.collection('users').unlinkExternalAuth(userid, 'google')
  return true
}

export async function unlinkWebauthnKey(userid) {
  await pb.collection('users').update(userid, { webauthn_id_b64: '', webauthn_credentials: null })
  return true
}