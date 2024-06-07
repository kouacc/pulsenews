export interface ContentType {
  id: number
  artist_title: string
  category_titles: string[]
  description: string
  title: string
  image_id: string
  alt_text: string
}

export interface ContentCardType {
  id: number
  title: string
  image_id: string
  alt_text?: string
}

export interface ContentItem {
  categorie: string
  content: string
  type: string
}
