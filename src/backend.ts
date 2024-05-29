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

export async function changePasswordLoggedIn(userid, password, passwordConfirm, oldPassword) {
  const userObject = {
    password: password,
    passwordConfirm: passwordConfirm,
    oldPassword: oldPassword
  }
  await pb.collection('users').update(userid, userObject)
  return true
}

export async function saveContent(userid, idcontent, category_type) {
  await pb
    .collection('content')
    .update(userid, { idcontent: idcontent, category_type: category_type })
  return true
}

export async function getContent(contentid) {
  const content = await axios.get(`https://api.artic.edu/api/v1/artworks/${contentid}`)
  return content.data.data
}

export async function addCategory(collectionid, category_name) {
  // grab le record associé à la collectionid
  const record = await pb.collection('content').getOne(collectionid)
  // grap les categories
  const categories = record.categories
  // créer la clé en fonction de la longueur de l'array
  const category_key = Object.keys(categories).length.toString();
  // append la catégorie à l'array
  categories[category_key] = category_name
  // update le record
  await pb.collection('content').update(collectionid, { categories: categories })
}

export async function deleteCategory(collectionid, category_key) {
  // grab le record associé à la collectionid
  const record = await pb.collection('content').getOne(collectionid)
  // grab les categories
  const categories = record.categories
  // delete la categorie en fonction de la clé
  delete categories[category_key]
  // reindex les clés
  const newcategories = {}
  let newindex = 0
  for (const key in categories) {
    if (categories.hasOwnProperty(key)) {
      newcategories[newindex.toString()] = categories[key]
      newindex++
    }
  }
  // update le record
  await pb.collection('content').update(collectionid, { categories: newcategories })

}

export async function addContent(collectionid, category, content, content_type) {
  const record = await pb.collection('content').getOne(collectionid)
  const contenu = record.contenu
  const content_key = Object.keys(contenu).length.toString()
  contenu[content_key] = { categorie: category, content: content, type: content_type }
  await pb.collection('content').update(collectionid, { contenu: contenu })
}

export async function deleteContent(collectionid, content_key) {
  // grab le record associé à la collectionid
  const record = await pb.collection('content').getOne(collectionid)
  // grab les contenus
  const contenu = record.contenu
  // delete le contenu en fonction de la clé
  delete contenu[content_key]
  // reindex les clés
  const newcontenu = {}
  let newindex = 0
  for (const key in contenu) {
    if (contenu.hasOwnProperty(key)) {
      newcontenu[newindex.toString()] = contenu[key]
      newindex++
    }
  }
  // update le record
  await pb.collection('content').update(collectionid, { contenu: newcontenu })

}

export async function getCollections(userid) {
  const collections = await pb.collection('users').getOne(userid, {
    expand: 'contenu',
  })
  return collections
}
