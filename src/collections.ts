import Pocketbase from 'pocketbase'
import { pb } from '@/backend'

export async function addCategory(userid: string, category_name: string) {
  await pb
    .collection('categories')
    .create({ nom: category_name, appartient_a: `${userid}` })
}

export async function deleteCategory(recordid:string) {
  await pb.collection('categories').delete(recordid)
}

export async function addContent(content: string, categorie_associe: string, type: 'interne' | 'externe') {
  await pb.collection('contenus').create({content: content, categorie_associe: categorie_associe, type: type})
}

export async function deleteContent(contentid) {
  await pb.collection('contenus').delete(contentid)
}

export async function getCollections(userid: string) {
  const collections = await pb.collection('categories').getFullList({
    filter: `appartient_a = '${userid}'`
  })
  return collections
}

export async function getContents(categoryid: string) {
  const contents = await pb.collection('contenus').getFullList({
    filter: `categorie_associe = '${categoryid}'`
  })
  return contents
}


export async function getCategory(categoryid: string) {
  const category = await pb.collection('categories').getOne(categoryid)
  return category
}