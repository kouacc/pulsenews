import Pocketbase from 'pocketbase'
const pb = new Pocketbase(import.meta.env.VITE_URL_POCKETBASE)

export async function addCategory(collectionid: string, category_name: string) {
  // grab le record associé à la collectionid
  const record = await pb.collection('content').getOne(collectionid)
  // grap les categories
  const categories = record.categories
  // créer la clé en fonction de la longueur de l'array
  const category_key = Object.keys(categories).length.toString()
  // append la catégorie à l'array
  categories[category_key] = category_name
  // update le record
  await pb.collection('content').update(collectionid, { categories: categories })
}

export async function deleteCategory(collectionid: string, category_key: number) {
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

export async function addContent(collectionid: string, category: number, content: string, content_type: 'interne' | 'externe') {
  //TODO: verifier si le contenu est déjà présent dans la catégorie choisie
  const record = await pb.collection('content').getOne(collectionid)
  const contenu = record.contenu
  const content_key = Object.keys(contenu).length.toString()
  contenu[content_key] = { categorie: category, content: content, type: content_type }
  await pb.collection('content').update(collectionid, { contenu: contenu })
}

export async function deleteContent(collectionid: string, content_key: number) {
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

export async function getCollections(userid: string) {
  const collections = await pb.collection('users').getOne(userid, {
    expand: 'contenu'
  })
  return collections
}
