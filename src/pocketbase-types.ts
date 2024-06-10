/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Categories = "categories",
	Content = "content",
	Contenus = "contenus",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

// System fields
export type BaseSystemFields<T = never> = {
	id: RecordIdString
	created: IsoDateString
	updated: IsoDateString
	collectionId: string
	collectionName: Collections
	expand?: T
}

export type AuthSystemFields<T = never> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type CategoriesRecord = {
	appartient_a?: RecordIdString
	nom?: string
}

export type ContentRecord<Tcat_prefs = unknown, Tcategories = unknown, Tcontenu = unknown> = {
	cat_prefs?: null | Tcat_prefs
	categories?: null | Tcategories
	contenu?: null | Tcontenu
}

export enum ContenusTypeOptions {
	"interne" = "interne",
	"externe" = "externe",
}
export type ContenusRecord = {
	categorie_associe?: RecordIdString
	content?: string
	type?: ContenusTypeOptions
}

export type UsersRecord<Twebauthn_credentials = unknown> = {
	avatar?: string
	biographie?: string
	facebook?: string
	github?: string
	instagram?: string
	linkedin?: string
	localisation?: string
	name?: string
	siteweb?: string
	surname?: string
	password: string
	passwordConfirm: string
	twitter?: string
	webauthn_credentials?: null | Twebauthn_credentials
	webauthn_id_b64?: string
}

// Response types include system fields and match responses from the PocketBase API
export type CategoriesResponse<Texpand = unknown> = Required<CategoriesRecord> & BaseSystemFields<Texpand>
export type ContentResponse<Tcat_prefs = unknown, Tcategories = unknown, Tcontenu = unknown, Texpand = unknown> = Required<ContentRecord<Tcat_prefs, Tcategories, Tcontenu>> & BaseSystemFields<Texpand>
export type ContenusResponse<Texpand = unknown> = Required<ContenusRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Twebauthn_credentials = unknown, Texpand = unknown> = Required<UsersRecord<Twebauthn_credentials>> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	categories: CategoriesRecord
	content: ContentRecord
	contenus: ContenusRecord
	users: UsersRecord
}

export type CollectionResponses = {
	categories: CategoriesResponse
	content: ContentResponse
	contenus: ContenusResponse
	users: UsersResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: 'categories'): RecordService<CategoriesResponse>
	collection(idOrName: 'content'): RecordService<ContentResponse>
	collection(idOrName: 'contenus'): RecordService<ContenusResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}
