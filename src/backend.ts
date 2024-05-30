import Pocketbase from 'pocketbase'
const pb = new Pocketbase(import.meta.env.VITE_URL_POCKETBASE)
import axios from 'axios'

export async function getUser(username: string) {
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
    await pb.collection('users').authRefresh()
    return true
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

export async function changePasswordLoggedIn(userid, password, passwordConfirm, oldPassword) {
  const userObject = {
    password: password,
    passwordConfirm: passwordConfirm,
    oldPassword: oldPassword
  }
  await pb.collection('users').update(userid, userObject)
  return true
}

export async function getContent(contentid) {
  const content = await axios.get(`https://api.artic.edu/api/v1/artworks/${contentid}`)
  return content.data.data
}
