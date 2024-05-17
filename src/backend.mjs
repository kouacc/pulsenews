import Pocketbase from 'pocketbase'
const pb = new Pocketbase('https://127.0.0.1:8090')

export async function UpdateProfile(id,data) {
    const updateddata = await pb.collection('users').update(id,data)
    return updateddata
}

export async function RequestChangePassword(email) {
    await pb.collection('users').requestPasswordReset(email)
}